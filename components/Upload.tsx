import { storage } from "../config/firebase";
import React, { useEffect, useState } from "react";
import { ref, uploadBytes } from "firebase/storage";
//@ts-ignore
import { v4 } from "uuid";
import { SimpleModal } from "./SimpleModal";

const Upload = ({
  imageUpload,
  faceMatches,
  formData,
}: {
  imageUpload: any;
  faceMatches: any;
  formData: any;
}) => {
  const [submit, setSubmit] = useState(false);
  const [hasClosedModal, setHasClosedModal] = useState(false);

  const uploadImage = () => {
    if (imageUpload == null) return;
    //@ts-ignore
    const imageRef = ref(
      storage,
      `images/${
        " " + faceMatches + formData.grado + " " + formData.fecha + " " + v4()
      }`
    );
    uploadBytes(imageRef, imageUpload).then(() => {
      setSubmit(true);
    });
  };

  useEffect(() => {
    if (!hasClosedModal && submit) {
      setHasClosedModal(true);
    } else if (hasClosedModal && !submit) {
      window.location.reload();
    }
  }, [submit, hasClosedModal]);

  return (
    <>
      {faceMatches && formData.fecha && formData.grado && (
        <>
          <button
            className="text-sm py-2 mb-6 px-4 rounded-lg font-semibold border-0 bg-gray-100 text-black hover:bg-[#3c31dd] hover:text-white mt-8"
            onClick={uploadImage}
          >
            Añade a base de datos
          </button>

          <SimpleModal
            isOpen={submit}
            onClose={() => {
              setSubmit(false);
            }}
            headerText={"¡Éxito!"}
            description={`Tu imágen se ha subido exitosamente con sus tags y reconocimientos correspondientes.`}
          />
        </>
      )}
    </>
  );
};

export default Upload;
