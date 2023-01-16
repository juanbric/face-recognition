import React, { useState, useEffect, useRef } from "react";
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

const Sube: React.FC = () => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [faceMatches, setFaceMatches] = useState<string[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imageUpload, setImageUpload] = useState<File>();
  const [showRecognize, setShowRecognize] = useState(false);
  const [imgSize, setImgSize] = useState<any>();
  const [formData, setFormData] = useState({ grado: "", fecha: "" });
  const loaded = useLoadModels();
  const canvasRef = useRef(null);
  const rol = useGetRol();
  useLogOut();
  rol?.rol === "guest" && router.replace("/login");

  // Clear canvas after image change
  useEffect(() => {
    if (imageUrl) {
      //@ts-ignore
      const ctx = canvasRef.current.getContext("2d");
      //@ts-ignore
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      //@ts-ignore

      canvasRef.current.innerHTML = "";
    }
  }, [imageUrl]);

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

    const labeledFaceDescriptors = await recognize(
      "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"
    );

    const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.9);

    // Load the image into an HTMLImageElement
    const img = await faceapi.fetchImage(imageUrl);
    setImgSize(img)

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
      const drawBox = new faceapi.draw.DrawBox(box, {
        label: result.toString().replace(/\(.*\)/g, ""),
        boxColor: "black",
        lineWidth: 3,
      });
      //@ts-ignore
      drawBox.draw(canvasRef.current);
      return result.toString();
    });

    setIsLoading(false);
    setFaceMatches(matches);
  };

  // Handle image function
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }
    setImgSize(file);
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
      <div className="grid grid-cols-2">
        <div>
          <InputField loaded={loaded} handleImageChange={handleImageChange} />
          {imageUrl && (
            <PreviewImage
              canvasRef={canvasRef}
              imageUrl={imageUrl}
              isLoading={isLoading}
            />
          )}
        </div>
        <div>
          {imageUrl && (
            <>
              <RecognizeButton
                showRecognize={showRecognize}
                handleRecognition={handleRecognition}
              />
              {faceMatches?.length == 0 ? null : (
                <>
                  <Tags
                    faceMatches={faceMatches}
                    formData={formData}
                    handleTagsChange={handleTagsChange}
                  />
                  <Upload
                    formData={formData}
                    faceMatches={
                      faceMatches &&
                      faceMatches.map((name) => name.split(" (")[0]).join(" ") +
                        " "
                    }
                    imageUpload={imageUpload}
                  />
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sube;
