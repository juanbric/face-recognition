import * as faceapi from 'face-api.js';

const MODEL_URL = '/models';

export async function loadModels() {
  const MODEL_URL = '/models';
  await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
  await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
  await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
  await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
}

export async function getFaceMatch(image: File, faceDescriptors: faceapi.FaceDescriptor[]) {
    // Load the image into an HTMLImageElement
    const img = await faceapi.bufferToImage(image);
  
    // Detect the face in the image
    const detection = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
  
    // If no face is detected, return null
    if (!detection) {
      return null;
    }
  
    // Get the face descriptor for the detected face
    const faceDescriptor = detection.descriptor;
  
    // Create a face matcher with the face descriptors from the database
    const faceMatcher = new faceapi.FaceMatcher(faceDescriptors);
  
    // Find the best match for the detected face descriptor
    const bestMatch = faceMatcher.findBestMatch(faceDescriptor);
  
    // Return the values corresponding to the best match
    return bestMatch.toString();
  }

  export default loadModels;