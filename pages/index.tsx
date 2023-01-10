import React, { useState, useEffect } from "react";
import * as faceapi from "face-api.js";
import firebase from "firebase/app";
import "firebase/storage";

const FaceRecognition: React.FC = () => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [faceMatches, setFaceMatches] = useState<string[] | null>(null);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hideRecognize, setHideRecognize] = useState(false);

  // Load models
  useEffect(() => {
    async function loadModels() {
      await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
      await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
      await faceapi.nets.ssdMobilenetv1.loadFromUri("/models");
      setLoaded(true);
    }
    loadModels();
  }, []);

  // Go through the db
  function recognize() {
    const faces = [
      "Black Widow",
      "Captain America",
      "Captain Marvel",
      "Hawkeye",
      "Jim Rhodes",
      "Thor",
      "Tony Stark",
    ];
    return Promise.all(
      faces.map(async (label) => {
        const descriptions = [];
        for (let i = 1; i <= 2; i++) {
          const img = await faceapi.fetchImage(
            `https://raw.githubusercontent.com/WebDevSimplified/Face-Recognition-JavaScript/master/labeled_images/${label}/${i}.jpg`
          );
          const detections: any = await faceapi
            .detectSingleFace(img)
            .withFaceLandmarks()
            .withFaceDescriptor();
          descriptions.push(detections.descriptor);
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
      .detectAllFaces(img)
      .withFaceLandmarks()
      .withFaceDescriptors();

    // Get the face descriptor objects for the detected faces
    const faceDescriptors = detections.map((detection) => detection.descriptor);

    // Create a face matcher with the face descriptor objects from the database
    const labeledFaceDescriptors = await recognize();
    const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6);

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

    setFaceMatches([]);
    setHideRecognize(false);

    const reader = new FileReader();
    reader.onload = () => {
      setImageUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="py-16 flex flex-col items-center justify-center">
      {/* Input field */}
      {loaded === true ? (
        <>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="text-sm pl-14 text-slate-500 file:mr-4 file:py-2 mb-8 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 first-letter:hover:file:bg-violet-100"
          />
        </>
      ) : (
        <p className="text-sm text-slate-500">Loading...</p>
      )}

      {imageUrl && (
        <>
          {/* Recognize button */}
          {hideRecognize ? null : (
            <button
              onClick={handleRecognition}
              className=" text-sm py-2 mb-4 px-4 rounded-full border-0 font-semibold bg-violet-50 text-violet-700 hover:bg-violet-100"
            >
              ¡Reconoce!
            </button>
          )}

          {/* Image */}
          <img src={imageUrl} alt="Selected" width={400} />

          {/* Loading results */}
          {isLoading ? (
            <p className="text-sm text-slate-500 mt-2">
              Cargando resultados de reconocimiento...
            </p>
          ) : null}

          {/* Recognition results */}
          {faceMatches && (
            <div>
              {faceMatches.map((match, i) => (
                <div className="text-lg text-bold text-slate-500 mt-2" key={i}>
                  {match.replace(/\(.*\)/g, "").replace(/^\w/, c => c.toUpperCase())}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FaceRecognition;
