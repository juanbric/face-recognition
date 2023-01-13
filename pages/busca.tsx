import { getDownloadURL, listAll, ref } from "firebase/storage";
import React, { useEffect, useState } from "react";
import MetaTag from "../components/MetaTag";
import { storage } from "../config/firebase";

const Busca = () => {
    const [imageUrls, setImageUrls] = useState([] as string[]);
  const imagesListRef = ref(storage, "images/");

  useEffect(() => {
    listAll(imagesListRef).then((response) => {
      response.items.forEach((item) => {
        getDownloadURL(item).then((url) => {
            setImageUrls((prev) => [...prev, url]);
        });
    });
    });
  }, []);

  return (
    <div className="py-16 flex flex-col items-center justify-center">
      <MetaTag title={"Firebase"} description={undefined} />
      {imageUrls.map((url, i) => {
        return <img key={i} src={url} />;
      })}
    </div>
  );
};

export default Busca;
