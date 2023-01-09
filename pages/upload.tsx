import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";

const Upload = () => {
  const [image, setImage] = useState<string | null>(null);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setImage(URL.createObjectURL(event.target.files![0]));
  };
  const handleDelete = () => {
    setImage(null);
  };

  return (
    <div className="py-8 flex flex-col items-center justify-center"> 
   
   
      <input type="file" onChange={handleChange} className="pb-6 pl-6 block" />
      {image && (
        <div className="relative w-[500px]">
          <button
            className="text-black bg-white px-4 py-2 rounded-md absolute top-0 right-0"
            onClick={handleDelete}
          >
            Delete
          </button>
          <img src={image} alt="Preview" /> 
        </div> 
      )}
    </div>
  );
};

export default Upload;
