import React, { useEffect, useState } from "react";
import * as faceapi from "face-api.js";
import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "../styles/Home.module.css";
import { LabeledFaceDescriptors } from "face-api.js";

const FaceMatcher = () => {
  const [faceMatcher, setFaceMatcher] = useState<any>(null);
  const [image, setImage] = useState<any>(null);
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load the face recognition models
    async function loadModels() {
      await faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
        await faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
        await faceapi.nets.ssdMobilenetv1.loadFromUri("/models");
    }
    loadModels();
    setLoading(true);
  }, []);

  // Function to create a face matcher from a list of known faces
  const createFaceMatcher = async () => {
    // Create a face matcher with the list of known faces
    const labeledFaceDescriptors = await loadLabeledImages()
    const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6);
    setFaceMatcher(faceMatcher);
  };

  // Function to perform facial recognition on an image and match it against the list of known faces
  const recognizeFaces = async (image) => {
    // Detect the faces in the image
    const detections = await faceapi
      .detectAllFaces(image)
      .withFaceLandmarks()
      .withFaceDescriptors();

      const displaySize = { width: image.width, height: image.height }
    // Get the descriptions of the detected faces
    const faceDescriptions = detections.map((fd) => fd.descriptor);

    console.log("face descriptions", faceDescriptions)
    // Use the face matcher to identify the detected faces
    const results = faceMatcher.findBestMatch(faceDescriptions);


    setResults(results);
  };

console.log("results", results)

  return (
    <div className={styles.body}>
      <input
        type="file"
        onChange={(e) => {
          const file = e.target.files[0];
          const imageUrl = URL.createObjectURL(file);
          setImage(imageUrl);
          console.log("i", image)
        }}
      />
      {image && (
        <img
          src={image}
          onLoad={async (e) => {
            const image = e.target;
            await recognizeFaces(image);
          }}
        />
      )}
      {results && (
        <div>
          {results.map((result:any) => (
            <div key={result.label} style={{border: '#fff'}}>
              {result.label}: {result.distance}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

function loadLabeledImages() {
  const labels = ['Black Widow', 'Captain America', 'Captain Marvel', 'Hawkeye', 'Jim Rhodes', 'Thor', 'Tony Stark']
  return Promise.all(
    labels.map(async label => {
      const descriptions = []
      for (let i = 1; i <= 2; i++) {
        const img = await faceapi.fetchImage(`https://raw.githubusercontent.com/WebDevSimplified/Face-Recognition-JavaScript/master/labeled_images/${label}/${i}.jpg`)
        const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
        descriptions.push(detections.descriptor)
      }

      return new faceapi.LabeledFaceDescriptors(label, descriptions)
    })
  )
}

export default FaceMatcher;

