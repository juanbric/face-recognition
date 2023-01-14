import * as faceapi from "face-api.js";
import { useEffect, useRef } from "react";
import MetaTag from "../components/MetaTag";

export default function test() {
  const imgRef = useRef(null);
  const canvasRef = useRef(null);

  // Detect faces and draw bos
  const handleImage = async () => {
    const detections = await faceapi
      //@ts-ignore
      .detectAllFaces(imgRef.current, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptors();
    console.log(detections);
    //@ts-ignore
    canvasRef.current.innerHtml = faceapi.createCanvasFromMedia(imgRef.current);
    //@ts-ignore
    faceapi.matchDimensions(canvasRef.current, {
      width: 650,
      height: 650,
    });
    const resized = faceapi.resizeResults(detections, {
      width: 650,
      height: 650,
    });
    //@ts-ignore
    faceapi.draw.drawDetections(canvasRef.current, resized,);
  };

  useEffect(() => {
    const loadModels = () => {
      Promise.all([
        faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
        faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
        faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
        faceapi.nets.faceExpressionNet.loadFromUri("/models"),
      ])
        .then(handleImage)
        .catch((e) => console.log(e));
    };

    imgRef.current && loadModels();
  }, []);

  return (
    <div className="flex">
      <MetaTag title={"Test"} description={undefined} />
      <img
        crossOrigin="anonymous"
        ref={imgRef}
        src="/2.jpg"
        width="940"
        height="650"
        style={{ width: "650px", height: "650px", display: "block", margin: "0 auto" }}
      />
      <canvas
        ref={canvasRef}
        style={{width: '650px', height: '650px', position: 'absolute', left: '50%', transform: 'translateX(-50%)'}}
      />
    </div>
  );
}
