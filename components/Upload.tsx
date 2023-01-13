import { storage } from "../config/firebase";
import React, { useEffect, useState } from "react";
import { ref, uploadBytes } from "firebase/storage";
//@ts-ignore
import { v4 } from "uuid";

const Upload = ({ imageUpload, faceMatches }: { imageUpload: any, faceMatches: any }) => {
  const uploadImage = () => {
    if (imageUpload == null) return;
    
    {console.log("facematches", faceMatches)}
    //@ts-ignore
    const imageRef = ref(storage, `images/${' ' + faceMatches + v4()}`);
    uploadBytes(imageRef, imageUpload).then(() => {
      alert("Image Uploaded");
    });
  };

  return (
    <button
      className="text-sm py-2 mb-4 px-4 rounded-full border-0 font-semibold bg-violet-50 text-violet-700 mt-8 hover:bg-violet-100"
      onClick={uploadImage}
    >
      Upload image
    </button>
  );
};

export default Upload;
