import React, { useState, useRef, useEffect } from "react";
import * as faceapi from "face-api.js";
import MetaTag from "../components/MetaTag";
import Upload from "../components/Upload";
import useGetRol from "../hooks/useGetRol";
import useLogOut from "../hooks/useLogOut";
import router from "next/router";
import InputField from "../components/InputField";
import RecognizeButton from "../components/RecognizeButton";
import Tags from "../components/Tags";
import useLoadModels from "../hooks/useLoadModels";
import PreviewImage from "../components/PreviewImage";
import useClearCanvas from "../hooks/useClearCanvas";
import useHandleTagsChange from "../hooks/useHandleTagsChange";
import { SimpleModal } from "../components/SimpleModal";
import { getDownloadURL, listAll, ref } from "firebase/storage";
import { storage } from "../config/firebase";

const Sube: React.FC = () => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [faceMatches, setFaceMatches] = useState<string[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imageUpload, setImageUpload] = useState<File>();
  const [showRecognize, setShowRecognize] = useState(false);
  const [loadTags, setLoadTags] = useState(false);
  const [noMatchesFound, setNoMatchesFound] = useState(false);
  const loaded = useLoadModels();
  const canvasRef = useRef(null);
  const [formData, handleTagsChange] = useHandleTagsChange();
  const rol = useGetRol();
  useLogOut();
  rol?.rol === "guest" && router.replace("/login");
  useClearCanvas(imageUrl, canvasRef, setLoadTags);
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [nameList, setNameList] = useState<string[]>([])

  const imagesListRef = ref(storage, "reference/");

  useEffect(() => {
    listAll(imagesListRef).then((response) => {
      response.items.forEach((item) => {
        getDownloadURL(item).then((url) => {
          setImageUrls((prev) => [...prev, url]);
        });
      });

      setNameList(
        response.items.map((item) => item.name.replace(/\.jpg$/, ""))
      );
    });
  }, []);

  console.log("imgurl", imageUrls.map(async (img) => img))
 
  async function recognize() {
    const faces = [
      "Neymar",
      "Messi",
      "Cristiano",
      "Mbappe",
      "Zidane",
      "Ronaldinho",
      "Iniesta",
    ];
    return Promise.all(
      faces.map(async (label) => {
        const imgUrl = `/${label}.jpg`;
        const img = await faceapi.fetchImage("https://firebasestorage.googleapis.com/v0/b/juanbri-face-recognition.appspot.com/o/reference%2FMbappe.jpg?alt=media&token=11232119-8bd3-41a9-94fd-29958f23ac3e");
        // img is equal to the amount of pictures stored in
        const detections = await faceapi
          .detectSingleFace(img)
          .withFaceLandmarks()
          .withFaceDescriptor();

        if (!detections) {
          throw new Error(`no faces detected for ${label}`);
        }
        const faceDescriptors = [detections.descriptor];
        return new faceapi.LabeledFaceDescriptors(label, faceDescriptors);
      })
    );
  }

  const handleRecognition = async () => {
    if (!imageUrl) {
      return;
    }
    setShowRecognize(false);
    setIsLoading(true);

    // Recognition part
    const labeledFaceDescriptors = await recognize();
    const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.55);
    // Drawing
    const img = await faceapi.fetchImage(imageUrl);
    //@ts-ignore
    canvasRef.current.innerHTML = "";
    const displaySize = { width: 520, height: 300 };
    //@ts-ignore
    faceapi.matchDimensions(canvasRef.current, displaySize);
    const detections = await faceapi
      .detectAllFaces(img, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptors();
    const resizedDetections = faceapi.resizeResults(detections, displaySize);
    const results = resizedDetections.map((d) =>
      faceMatcher.findBestMatch(d.descriptor)
    );

    const matches = results.map((result, i) => {
      const box = resizedDetections[i].detection.box;
      const name = result.toString().replace(/\(.*\)/g, "");
      const formattedName = name.charAt(0).toUpperCase() + name.slice(1);
      const drawBox = new faceapi.draw.DrawBox(box, {
        label: formattedName,
        boxColor: "#6c77e7",
        lineWidth: 0.5,
      });
      //@ts-ignore
      drawBox.draw(canvasRef.current);
      return result.toString();
    });

    matches.length === 0 && setNoMatchesFound(true);
    setIsLoading(false);
    setLoadTags(true);
    setFaceMatches(matches);
  };

  // Handle image function
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }
    // Load state to upload pic to firebase if needed
    setImageUpload(file);
    // Show recognize button
    setShowRecognize(true);
    // Set imageUrl state to the selected file
    const reader = new FileReader();
    reader.onload = () => {
      setImageUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="py-10">
      <MetaTag title={"Reconoce"} />
      <div className="grid grid-cols-3 gap-8 justify-start">
        <div className="col-span-2">
          <InputField loaded={loaded} handleImageChange={handleImageChange} />
          {imageUrl && (
            <PreviewImage canvasRef={canvasRef} imageUrl={imageUrl} />
          )}
        </div>
        <div className="">
          <p className="text-lg text-bold text-slate-500 mt-4">Resultados</p>
          {imageUrl && (
            <RecognizeButton
              showRecognize={showRecognize}
              handleRecognition={handleRecognition}
              isLoading={isLoading}
            />
          )}
          {imageUrl && faceMatches?.length == 0 ? null : (
            <>
              <Tags
                formData={formData}
                handleTagsChange={handleTagsChange}
                loadTags={loadTags}
              />
              <Upload
                formData={formData}
                faceMatches={
                  faceMatches &&
                  faceMatches.map((name) => name.split(" (")[0]).join(" ") + " "
                }
                imageUpload={imageUpload}
              />
            </>
          )}
        </div>
      </div>

      <SimpleModal
        isOpen={noMatchesFound}
        onClose={() => {
          setNoMatchesFound(false);
        }}
        headerText={"No se encontraron coincidencias"}
        description={
          "Es probable que la/s identidad/es de esta foto no esté/n registrada/s en nuestra base de datos de imágenes de referencia. También es posible que la imágen que usted ha subido se encuentre borrosa o no se aprecie con claridad la cara del individuo a identificar. Contacta a un administrador para más información"
        }
      />
    </div>
  );
};

export default Sube;
