
import { storage } from "../config/firebase";
import {
  ref,
  listAll,
  getDownloadURL,
  list,
} from "firebase/storage";
import firebase from "firebase/app";
import "firebase/storage";
import MetaTag from "../components/MetaTag";
import { useEffect, useState } from "react";


const test = () => {
    const [imageUrls, setImageUrls] = useState([]);
    // const imagesListRef = ref(storage, "images/");
    // useEffect(() => {
    //     listAll(imagesListRef).then((response) => {
    //       response.items.forEach((item) => {
    //         getDownloadURL(item).then((url) => {
    //           setImageUrls((prev) => [...prev, url]);
    //         });
    //       });
    //     });
    //   }, []);

  return (
    <div className="py-16 flex flex-col items-center justify-center">
    <MetaTag
      title={"Reconoce"}
      description={"Aplicación de detección y ¨Rreconocimiento facial"}
    />
    <p>Hola</p>
  </div>
  )
}

export default test