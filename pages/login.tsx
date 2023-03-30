import { onAuthStateChanged, signInWithPopup } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import router from "next/router";
import { useState } from "react";
import MetaTag from "../components/MetaTag";
import { SimpleModal } from "../components/SimpleModal";
import { admins, users } from "../config";
import { auth, firestore, provider } from "../config/firebase";

const Login = () => {
  const [notAllowed, setNotAllowed] = useState(false);

  const signInWithGoogle = async () => {
    const result = await signInWithPopup(auth, provider);
    const logIn = onAuthStateChanged(auth, (user) => {
      if (user) {
        const docuRef = doc(firestore, `usuarios/${user?.uid}`);
        setDoc(docuRef, {
          correo: user?.email,
          rol:
            user?.email && admins.includes(user?.email)
              ? "admin"
              : user?.email && users.includes(user?.email)
              ? "user"
              : "guest",
        });
        (user?.email && admins.includes(user?.email)) ||
        (user?.email && users.includes(user?.email))
          ? router.replace("/")
          : setNotAllowed(true);
      }
    });
  };

  return (
    <>
      <MetaTag title={"Inicia sesión | Trovali"} />
      <section className="">
        <div className="flex flex-col items-center justify-center pt-[150px] pb-[280px]">
          <a
            href="#"
            className="flex items-center mb-6 text-2xl font-bold "
          >
            <img src="/trovali.svg" className="w-8 h-8 mr-2 shadow-lg" />
            Trovali
          </a>
          <div className="w-full rounded-lg shadow border md:mt-0 sm:max-w-md xl:p-0  ">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight md:text-2xl">
                Inicia sesión con Google para continuar
              </h1>
              <button
                className="w-full text-gray-900 bg-gray-100 border-gray-600 bg-primary-600 hover:bg-primary-700 outline-none font-medium rounded-lg text-sm px-5 py-2.5 flex items-center justify-center text-center bg-primary-600 hover:bg-primary-700"
                onClick={signInWithGoogle}
              >
                <img
                  src="https://tailus.io/sources/blocks/social/preview/images/google.svg"
                  className="w-5 mr-3"
                  alt="google logo"
                ></img>
                <p>Inicia sesión con Google</p>
              </button>
              <p className="text-sm font-light text-gray-600">
                No tienes una cuenta aún? Contacta a los administradores de la
                aplicación para que te autoricen la entrada.{" "}
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* Modal */}
      <SimpleModal
        isOpen={notAllowed}
        onClose={() => {
          setNotAllowed(false);
        }}
        headerText={"Usuario no autorizado"}
        description={
          "Contacta a los administradores de ésta aplicación para más información."
        }
      />
    </>
  );
};

export default Login;
