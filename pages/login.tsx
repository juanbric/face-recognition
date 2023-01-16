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
    <div className="py-16 flex flex-col items-center justify-center">
      <MetaTag title={"Inicia sesión"} />
      <h1>Inicia sesión con Google para continuar</h1>
      <button
        className="text-slate px-4 py-2 bg-[#f6f6f6] mt-6 rounded-[16px]"
        onClick={signInWithGoogle}
      >
        Inicia sesión con Google
      </button>

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
    </div>
  );
};

export default Login;
