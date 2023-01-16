import React, { useState, useEffect, useRef } from "react";
import * as faceapi from "face-api.js";
import MetaTag from "../components/MetaTag";
import { HStack } from "@chakra-ui/react";
import Upload from "../components/Upload";
import useGetRol from "../hooks/useGetRol";
import useLogOut from "../hooks/useLogOut";
import router from "next/router";
import InputField from "../components/InputField";
import RecognizeButton from "../components/RecognizeButton";
import Tags from "../components/Tags";
import useLoadModels from "../hooks/useLoadModels";

const Sube: React.FC = () => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [faceMatches, setFaceMatches] = useState<string[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imageUpload, setImageUpload] = useState<File>();
  const [showRecognize, setShowRecognize] = useState(false);
  const [formData, setFormData] = useState({ grado: "", fecha: "" });
  const loaded = useLoadModels();
  const canvasRef = useRef(null);
  const rol = useGetRol();
  useLogOut();
  rol?.rol === "guest" && router.replace("/login");

  // Analyse reference images
  async function fetchImage(label: any, i: any, token: any) {
    const headers = {
      Authorization: `Token ${token}`,
      Accept: "application/vnd.github+json",
    };
    const path = `/repos/juanbric/face-recognition/contents/labeled_images/${label}/${i}.jpg`;
    const url = `https://api.github.com${path}`;
    try {
      const response = await fetch(url, { headers, cache: "no-store" });
      const json = await response.json();
      const imgUrl = json.download_url;
      return await faceapi.fetchImage(imgUrl);
    } catch (err: any) {
      console.error(err);
      throw new Error(`Failed to fetch image: ${err.message}`);
    }
  }

  async function recognize(token: any) {
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
        const descriptions = [];
        for (let i = 1; i <= 2; i++) {
          const img = await fetchImage(label, i, token);
          const detections = await faceapi
            .detectSingleFace(img)
            .withFaceLandmarks()
            .withFaceDescriptor();
          if (detections) {
            descriptions.push(detections.descriptor);
          }
        }
        return new faceapi.LabeledFaceDescriptors(label, descriptions);
      })
    );
  }

  const handleRecognition = async () => {
    if (!imageUrl) {
      return;
    }
    setShowRecognize(false);
    setIsLoading(true);

    // Load the image into an HTMLImageElement
    const img = await faceapi.fetchImage(imageUrl);

    // Detect how many faces in the image
    const detections = await faceapi
      .detectAllFaces(img, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptors();

    // Draw squares based on detections
    const displaySize = { width: img.width, height: img.height };
    //@ts-ignore
    canvasRef.current.innerHtml = faceapi.createCanvasFromMedia(img);
    //@ts-ignore
    faceapi.matchDimensions(canvasRef.current, displaySize);
    const resized = faceapi.resizeResults(detections, displaySize);
    //@ts-ignore
    faceapi.draw.drawDetections(canvasRef.current, resized);

    // Get the face descriptor objects for the detected faces
    const faceDescriptors = detections.map((detection) => detection.descriptor);

    // Create a face matcher with the face descriptor objects from the database
    const labeledFaceDescriptors = await recognize(
      "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"
    );

    const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.7);

    // Find the best match for each face descriptor
    const matches = faceDescriptors.map((descriptor) =>
      faceMatcher.findBestMatch(descriptor).toString()
    );
    setIsLoading(false);
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

  // Handle tags change
  const handleTagsChange = (event: any) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="py-6 flex flex-col items-center justify-center">
      <MetaTag title={"Reconoce"} />
      {/* Input field */}
      <InputField loaded={loaded} handleImageChange={handleImageChange} />
      {imageUrl && (
        <>
          {/* Recognize button */}
          <RecognizeButton
            showRecognize={showRecognize}
            handleRecognition={handleRecognition}
          />
          {/* Image */}
          <div className="relative">
            <canvas
              ref={canvasRef}
              width={400}
              height={300}
              style={{
                width: "400px",
                height: "300px",
                position: "absolute",
                left: "50%",
                transform: "translateX(-50%)",
              }}
            />
            <img src={imageUrl} width={400} height={300} />
          </div>
          {/* Loading results */}
          {isLoading ? (
            <p className="text-sm text-slate-500 mt-2">
              Cargando resultados de reconocimiento...
            </p>
          ) : null}
          {/* Recognition results */}
          {faceMatches?.length == 0 ? null : (
            <>
              <HStack className="mt-2">
                {faceMatches &&
                  faceMatches.map((match, i) => (
                    <div
                      className="text-lg text-bold mr-2 text-slate-500"
                      key={i}
                    >
                      {match
                        .replace(/\(.*\)/g, "")
                        .replace(/^\w/, (c) => c.toUpperCase())}
                    </div>
                  ))}
              </HStack>
              <Tags
                faceMatches={faceMatches}
                formData={formData}
                handleTagsChange={handleTagsChange}
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
        </>
      )}
    </div>
  );
};

export default Sube;
