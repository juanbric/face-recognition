import MetaTag from "../components/MetaTag";
import { getStorage, ref, getMetadata } from "firebase/storage";
import { storage } from "../config/firebase"

const test = () => {
    const forestRef = ref(storage, 'Black-Widow/1.jpg');
    
    getMetadata(forestRef)
    .then((metadata) => {
      console.log(metadata)
    })
    .catch((error) => {
        console.log(error)
    });
  return (
    <div className="py-16 flex flex-col items-center justify-center">
      <MetaTag
        title={"Reconoce"}
        description={"Aplicación de detección y ¨Rreconocimiento facial"}
      />
      <p>Hola</p>
    </div>
  );
};

export default test;
