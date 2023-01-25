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

  return (
    <div className="pb-8 flex flex-col items-center justify-center">
      <MetaTag title={"Busca | Trovali"} />

      <input
        type="text"
        className="bg-gray-50 border mb-4 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-1/2 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder="Search by file name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="md:grid md:grid-cols-2">
        {!searchTerm
          ? null
          : filteredUrls.map((url, i) => {
              return (
                <img
                  key={i}
                  width={400}
                  height={300}
                  src={url}
                  className="p-4 rounded-[6px]"
                  style={{borderRadius: '6px'}}
                />
              );
            })}
      </div>
    </div>
  );
};

export default Busca;
