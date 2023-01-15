import router from "next/router";
import React from "react";
import MetaTag from "../components/MetaTag";
import useGetRol from "../hooks/useGetRol";
import useLogOut from "../hooks/useLogOut";

const Alimenta = () => {
  const rol = useGetRol();
  useLogOut();
  rol?.rol === "user" && router.replace("/");
  rol?.rol === "guest" && router.replace("/login");

  return (
    <div className="py-16 flex flex-col items-center justify-center">
      <MetaTag
        title={"Alimenta"}
        description={"Aplicación de detección y reconocimiento facial"}
      />
      Alimenta
    </div>
  );
};

export default Alimenta;
