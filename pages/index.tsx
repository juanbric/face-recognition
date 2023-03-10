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
import ShareResults from "../components/ShareResults";

const Sube: React.FC = () => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [faceMatches, setFaceMatches] = useState<string[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imageUpload, setImageUpload] = useState<File>();
  const [showRecognize, setShowRecognize] = useState(false);
  const [loadTags, setLoadTags] = useState(false);
  const [shareResults, setShareResults] = useState(false);
  const [noMatchesFound, setNoMatchesFound] = useState(false);
  const loaded = useLoadModels();
  const canvasRef = useRef(null);
  const [formData, handleTagsChange, setFormData] = useHandleTagsChange();
  const rol = useGetRol();
  useLogOut();
  rol?.rol === "guest" && router.replace("/login");
  useClearCanvas(imageUrl, canvasRef, setLoadTags, setFormData, setShareResults);
  // const [imageUrls, setImageUrls] = useState<string[]>([])
  // const [nameList, setNameList] = useState<string[]>([])
  // const imagesListRef = ref(storage, "reference/");

  // useEffect(() => {
  //   listAll(imagesListRef).then((response) => {
  //     response.items.forEach((item) => {
  //       getDownloadURL(item).then((url) => {
  //         setImageUrls((prev) => [...prev, url]);
  //       });
  //     });

  //     setNameList(
  //       response.items.map((item) => item.name.replace(/\.jpg$/, ""))
  //     );
  //   });
  // }, []);

  // async function recognize() {
  //   return Promise.all(
  //     nameList.map(async (label, index) => {
  //       const img = await faceapi.fetchImage(imageUrls[index]);
  //       const detections = await faceapi
  //         .detectSingleFace(img)
  //         .withFaceLandmarks()
  //         .withFaceDescriptor();

  //       if (!detections) {
  //         throw new Error(`no faces detected for ${label}`);
  //       }
  //       const faceDescriptors = [detections.descriptor];
  //       return new faceapi.LabeledFaceDescriptors(label, faceDescriptors);
  //     })
  //   );
  // }

  async function recognize() {
    const faces = [
      "Neymar",
      "MessiNEGATIVO",
      "Cristiano",
      "Mbappe",
      "Zidane",
      "Ronaldinho",
      "Iniesta",
    ];
    return Promise.all(
      faces.map(async (label) => {
        const imgUrl = `/${label}.jpg`;
        const img = await faceapi.fetchImage(imgUrl);
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
        label: formattedName.includes("NEGATIVO") ? formattedName.replace("NEGATIVO", "") : formattedName,
        boxColor: "#111827",
        lineWidth: 0.5,
      });
      //@ts-ignore
      drawBox.draw(canvasRef.current);
      return result.toString();
    });

    matches.length === 0 && setNoMatchesFound(true);
    setIsLoading(false);
    setLoadTags(true);
    setShareResults(true);
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
      <MetaTag title={"Reconoce | Trovali"} />
      <div className="grid grid-cols-5 gap-12 justify-start">
        <h1 className="col-span-3 text-xl mb-8 font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
          1. Elige la foto a reconocer
        </h1>
        <h2 className="col-span-2 text-xl mb-8 font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
          2. Reconoce, a??ade tags y sube
        </h2>
      </div>
      <div className="grid grid-cols-5 gap-12 justify-start">
        <div className="col-span-3">
          <InputField loaded={loaded} handleImageChange={handleImageChange} />
          {imageUrl && (
            <PreviewImage canvasRef={canvasRef} imageUrl={imageUrl} />
          )}
        </div>
        <div className="col-span-2">
          {imageUrl && (
            <RecognizeButton
              showRecognize={showRecognize}
              handleRecognition={handleRecognition}
              isLoading={isLoading}
            />
          )}
          {imageUrl && faceMatches?.length == 0 ? null : (
            <>
            <ShareResults shareResults={shareResults} faceMatches={faceMatches}/>
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
          "Es probable que la/s identidad/es de esta foto no est??/n registrada/s en nuestra base de datos de im??genes de referencia. Tambi??n es posible que la im??gen que usted ha subido se encuentre borrosa o no se aprecie con claridad la cara del individuo a identificar. Contacta a un administrador para m??s informaci??n"
        }
      />
    </div>
  );
};

export default Sube;
