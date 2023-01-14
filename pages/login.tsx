import { onAuthStateChanged, signInWithPopup } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import router from "next/router";
import MetaTag from "../components/MetaTag";
import { auth, firestore, provider } from "../config/firebase";

const whiteList = ["juan@soltype.io", "jpbd94@gmail.com"]

const Login = () => {
  const signInWithGoogle = async () => {
    const result = await signInWithPopup(auth, provider);
    const logIn = onAuthStateChanged(auth, (user) => {
      if (user) {
        const docuRef = doc(firestore, `usuarios/${user?.uid}`);
        setDoc(docuRef, { correo: user?.email, rol: whiteList.includes(user?.email!) ? "admin" : "user"});
        console.log("user data sent to Firestore", user?.email);
        router.replace("/home");
      }
    });
  };

  return (
    <div className="py-16 flex flex-col items-center justify-center">
      <MetaTag
        title={"Login"}
        description={"Aplicación de detección y ¨Rreconocimiento facial"}
      />
      <h1>Sign in with Google to continue</h1>
      <button onClick={signInWithGoogle}>Sign in with Google</button>
    </div>
  );
};

export default Login;
