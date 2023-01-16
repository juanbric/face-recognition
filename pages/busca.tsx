import { getDownloadURL, listAll, ref } from "firebase/storage";
import router from "next/router";
import React, { useEffect, useState } from "react";
import MetaTag from "../components/MetaTag";
import { storage } from "../config/firebase";
import useGetRol from "../hooks/useGetRol";
import useLogOut from "../hooks/useLogOut";

const Busca = () => {
  const [imageUrls, setImageUrls] = useState([] as string[]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUrls, setFilteredUrls] = useState([] as string[]);
  const imagesListRef = ref(storage, "images/");

  const rol = useGetRol();
  useLogOut();
  rol?.rol === "guest" && router.replace("/login");

  useEffect(() => {
    listAll(imagesListRef).then((response) => {
      response.items.forEach((item) => {
        getDownloadURL(item).then((url) => {
          setImageUrls((prev) => [...prev, url]);
        });
      });
    });
  }, []);

  useEffect(() => {
    setFilteredUrls(
      imageUrls.filter((url) => {
        const fileName = url.split("%2F")[1].split("?")[0];
        const search = new RegExp(searchTerm, "i");
        return search.test(fileName);
      })
    );
  }, [searchTerm]);

  console.log("search", searchTerm);

  return (
    <div className="py-8 flex flex-col items-center justify-center">
      <MetaTag title={"Firebase"} />

      <input
        type="text"
        className="outline-none bg-[#f6f6f6] text-sm shadow-xl w-1/3 text-slate-500 p-2 rounded-lg"
        placeholder="Search by file name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {!searchTerm
        ? null
        : filteredUrls.map((url, i) => {
            return (
              <img key={i} width={400} height={300} src={url} className="p-4" />
            );
          })}
    </div>
  );
};

export default Busca;
