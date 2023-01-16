import React, { useState, useEffect, useRef } from "react";
import * as faceapi from "face-api.js";
import MetaTag from "../components/MetaTag";
//@ts-ignore
import { HStack } from "@chakra-ui/react";
import Upload from "../components/Upload";
import useGetRol from "../hooks/useGetRol";
import useLogOut from "../hooks/useLogOut";
import router from "next/router";

const Sube: React.FC = () => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [faceMatches, setFaceMatches] = useState<string[] | null>(null);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [imageUpload, setImageUpload] = useState<File>();
  const [hideRecognize, setHideRecognize] = useState(false);
  const [formData, setFormData] = useState({ grado: "", fecha: "" });
  const canvasRef = useRef(null);
  const rol = useGetRol();
  useLogOut();
  rol?.rol === "guest" && router.replace("/login");
  // Load models
  useEffect(() => {
    async function loadModels() {
      await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
      await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
      await faceapi.nets.ssdMobilenetv1.loadFromUri("/models");
      await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
      setLoaded(true);
    }
    loadModels();
  }, []);

  // Go through the db
  async function fetchImage(label: any, i: any, token: any) {
    const headers = {
      Authorization: `Token ${token}`,
      Accept: "application/vnd.github+json",
    };
    const path = `/repos/juanbric/face-recognition/contents/labeled_images/${label}/${i}.jpg`;
    const url = `https://api.github.com${path}`;
    try {
      const response = await fetch(url, { headers, cache: 'no-store' });
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
  // Handle recognition
  const handleRecognition = async () => {
    if (!imageUrl) {
      return;
    }
    console.log("loading recognition");
    setHideRecognize(true);
    setIsLoading(true);

    // Load the image into an HTMLImageElement
    const img = await faceapi.fetchImage(imageUrl);

    // Detect the faces in the image
    const detections = await faceapi
      .detectAllFaces(img, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptors();
    console.log(detections);
    //@ts-ignore
    canvasRef.current.innerHtml = faceapi.createCanvasFromMedia(img);
    //@ts-ignore
    faceapi.matchDimensions(canvasRef.current, {
      width: 800,
      height: 600,
    });
    const resized = faceapi.resizeResults(detections, {
      width: 800,
      height: 600,
    });

    //@ts-ignore
    faceapi.draw.drawDetections(canvasRef.current, resized);
    // Get the face descriptor objects for the detected faces
    const faceDescriptors = detections.map((detection) => detection.descriptor);

    // Create a face matcher with the face descriptor objects from the database
    const labeledFaceDescriptors = await recognize(
      "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"
    );
    const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.5);

    const results = resized.map((d) => faceMatcher.findBestMatch(d.descriptor));
    // Find the best match for each face descriptor
    const matches = faceDescriptors.map((descriptor) =>
      faceMatcher.findBestMatch(descriptor).toString()
    );
    console.log("loading recognition done");
    setIsLoading(false);
    setFaceMatches(matches);
  };

  // Handle image function
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }
    setImageUpload(file);
    setFaceMatches([]);
    setHideRecognize(false);

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
      <MetaTag
        title={"Reconoce"}
        description={"Aplicación de detección y ¨Rreconocimiento facial"}
      />

      {/* Input field */}
      {loaded === true ? (
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="text-sm pl-0 lg:pl-14 text-slate-500 file:mr-4 file:py-2 mb-8 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 first-letter:hover:file:bg-blue-100"
        />
      ) : (
        <p className="text-sm text-slate-500">Cargando...</p>
      )}

      {imageUrl && (
        <>
          {/* Recognize button */}
          {hideRecognize ? null : (
            <button
              onClick={handleRecognition}
              className="text-sm py-2 mb-4 px-4 rounded-full border-0 font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100"
            >
              ¡Reconoce!
            </button>
          )}

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
              {faceMatches && (
                <form className="mt-8 text-lg text-bold mr-2 text-slate-500">
                  <label>
                    Grado: 
                    <input
                      type="text"
                      name="grado"
                      className="ml-4 outline-none p-1 rounded-[12px] w-10 bg-[#f6f6f6] mb-4"
                      value={formData.grado}
                      onChange={handleTagsChange}
                    />
                  </label>
                  <br />
                  <label>
                    Fecha:
                    <input
                      type="text"
                      name="fecha"
                      className="ml-4 outline-none p-1 rounded-[12px] w-[120px] bg-[#f6f6f6]"
                      value={formData.fecha}
                      onChange={handleTagsChange}
                    />
                  </label>
                  <br />
                </form>
              )}

              {faceMatches && formData.fecha && formData.grado && (
                <Upload
                  grado={formData.grado}
                  fecha={formData.fecha}
                  faceMatches={
                    faceMatches.map((name) => name.split(" (")[0]).join(" ") +
                    " "
                  }
                  imageUpload={imageUpload}
                />
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Sube;
