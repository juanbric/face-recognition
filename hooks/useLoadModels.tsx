import { useState, useEffect } from "react";
import * as faceapi from "face-api.js";

const useLoadModels = () => {
  const [loaded, setLoaded] = useState<boolean>(false);

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

  return loaded;
};

export default useLoadModels;
