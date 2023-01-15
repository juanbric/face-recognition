import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore } from "../config/firebase";

const useGetRol = () => {
  const [user, loading] = useAuthState(auth);
  const [rol, setRol] = useState<any>();

  useEffect(() => {
    async function getRol(uid: any) {
      if (!uid) return;
      const docRef = doc(firestore, `usuarios/${uid}`);
      const fullDocu = await getDoc(docRef);
      if (fullDocu.exists()) {
        const data = fullDocu.data();
        const updatedUser = { ...user, ...data };
        setRol(updatedUser);
      }
    }

    getRol(user?.uid);
  }, [user, firestore]);

  return rol;
};

export default useGetRol;
