import React, { useState, useEffect } from "react";
import * as faceapi from "face-api.js";

const FaceRecognition: React.FC = () => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [faceMatches, setFaceMatches] = useState<string[] | null>(null);

  function loadLabeledImages() {
    const labels = [
      "Black Widow",
      "Captain America",
      "Captain Marvel",
      "Hawkeye",
      "Jim Rhodes",
      "Thor",
      "Tony Stark",
    ];
    return Promise.all(
      labels.map(async (label) => {
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

  useEffect(() => {
    async function loadModels() {
      await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
      await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
      await faceapi.nets.ssdMobilenetv1.loadFromUri("/models");
      console.log("loaded");
    }

    loadModels();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImageUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRecognizeClick = async () => {
    if (!imageUrl) {
      return;
    }

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
    const labeledFaceDescriptors = await loadLabeledImages();
    const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6);

    // Find the best match for each face descriptor
    const matches = faceDescriptors.map((descriptor) =>
      faceMatcher.findBestMatch(descriptor).toString()
    );

    setFaceMatches(matches);
  };

  return (
    <div className="py-8 flex flex-col items-center justify-center">
      <input type="file" accept="image/*" onChange={handleImageChange} />
      <button onClick={handleRecognizeClick}>Recognize</button>
      {imageUrl && (
        <div>
          <div>
            <img src={imageUrl} alt="Selected" />
          </div>
          {faceMatches && (
            <div>
              {faceMatches.map((match, i) => (
                <div key={i}>{match}</div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FaceRecognition;