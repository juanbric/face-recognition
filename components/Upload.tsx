import { storage } from "../config/firebase";
import React, { useEffect, useState } from "react";
import { ref, uploadBytes } from "firebase/storage";
//@ts-ignore
import { v4 } from "uuid";
import { SimpleModal } from "./SimpleModal";

const Upload = ({
  imageUpload,
  faceMatches,
  grado,
  fecha,
}: {
  imageUpload: any;
  faceMatches: any;
  grado: any;
  fecha: any;
}) => {
  const [submit, setSubmit] = useState(false);
  const [hasClosedModal, setHasClosedModal] = useState(false);

  const uploadImage = () => {
    if (imageUpload == null) return;
    //@ts-ignore
    const imageRef = ref(
      storage,
      `images/${" " + faceMatches + grado + " " + fecha + " " + v4()}`
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
      <button
        className="text-sm py-2 mb-4 px-4 rounded-full border-0 font-semibold bg-blue-50 text-blue-700 mt-8 hover:bg-blue-100"
        onClick={uploadImage}
      >
        Upload image
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
  );
};

export default Upload;
