import MetaTag from "../components/MetaTag";
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "../config/firebase";

const test = () => {
  const imgRef = ref(storage, "Black-Widow/1.jpg");
 const githubToken = "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"
  return (
    <div className="py-16 flex flex-col items-center justify-center">
      <MetaTag
        title={"Test"}
        description={"Aplicación de detección y ¨Rreconocimiento facial"}
      />
      <p>Hola</p>
    </div>
  );
};

export default test;
