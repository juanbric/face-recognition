import React, { useState, useRef } from "react";
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

const Sube: React.FC = () => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [faceMatches, setFaceMatches] = useState<string[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imageUpload, setImageUpload] = useState<File>();
  const [showRecognize, setShowRecognize] = useState(false);
  const [loadTags, setLoadTags] = useState(false);
  const loaded = useLoadModels();
  const canvasRef = useRef(null);
  const [formData, handleTagsChange] = useHandleTagsChange();
  const rol = useGetRol();
  useLogOut();
  rol?.rol === "guest" && router.replace("/login");
  useClearCanvas(imageUrl, canvasRef, setLoadTags);

  // Analyse reference images
  // async function fetchImage(label: any, i: any, token: any) {
  //   const headers = {
  //     Authorization: `Token ${token}`,
  //     Accept: "application/vnd.github+json",
  //   };
  //   const path = `/repos/juanbric/face-recognition/contents/labeled_images/${label}/${i}.jpg`;
  //   const url = `https://api.github.com${path}`;
  //   try {
  //     const response = await fetch(url, { headers, cache: "no-store" });
  //     const json = await response.json();
  //     // const imgUrl = json.download_url;
  //     // return await faceapi.fetchImage(imgUrl);
  //   } catch (err: any) {
  //     console.error(err);
  //     throw new Error(`Failed to fetch image: ${err.message}`);
  //   }
  // }

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
        const img = await faceapi.fetchImage(imgUrl);
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
            <PreviewImage
              canvasRef={canvasRef}
              imageUrl={imageUrl}
              isLoading={isLoading}
            />
          )}
        </div>
        <div className="mt-16">
          {imageUrl && (
            <RecognizeButton
              showRecognize={showRecognize}
              handleRecognition={handleRecognition}
            />
          )}
          <p className="text-lg text-bold text-slate-500 mt-4">Resultados</p>
          <p className="text-sm text-slate-500">
            Aqui aparece si la foto se puede publicar
          </p>
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
    </div>
  );
};

export default Sube;
