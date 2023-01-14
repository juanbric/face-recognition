import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import MetaTag from "../components/MetaTag";
import { auth, firestore } from "../config/firebase";

const Home = () => {
  const router = useRouter();
  const [user] = useAuthState(auth);
  const [rol, setRol] = useState<any>();

  useEffect(() => {
    async function getRol(uid: any) {
      const docRef = doc(firestore, `usuarios/${uid}`);
      const fullDocu = await getDoc(docRef);
      if (fullDocu.exists()) {
        const data = fullDocu.data();
        const updatedUser = Object.assign({}, user, data);
        setRol(updatedUser);
      } else {
        console.log("No such document!");
      }
    }
    getRol(user?.uid);
  }, [user]);

  console.log("firestore", rol?.rol);

  useEffect(() => {
    const logOut = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace("/login");
      }
    });
    return () => logOut();
  }, []);

  return (
    <div className="py-16 flex flex-col items-center justify-center">
      <MetaTag
        title={"Home"}
        description={"Aplicación de detección y ¨Rreconocimiento facial"}
      />
      {rol?.rol === "user" ? <p>Not authorized to be here</p> : <p>Home</p>}
    </div>
  );
};

export default Home;
