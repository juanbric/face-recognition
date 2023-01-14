import Link from "next/link";
import {
  HStack,
  //@ts-ignore
} from "@chakra-ui/react";
import { auth } from "../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { signOut } from "firebase/auth";

export const AppBar = () => {
  const [user] = useAuthState(auth);
  const signUserOut = async () => {
    await signOut(auth);
  };

  return (
    <div className=" bg-white border-b-[0.00001px] border-[#dfd3dc] py-1 lg:py-2">
      <div className="lg:flex lg:justify-center lg:items-center">
        <div className="px-4 lg:px-8 w-auto lg:w-[1130px]">
          <div className="flex text-sm text-slate-500 justify-between items-center">
            {!user && <Link href={"/login"}>Login</Link>}
            {user && (
              <>
                <div>
                  <Link href={"/"} className="pr-8">Reconoce y sube</Link>
                  <Link href={"/busca"}>Busca</Link>
                </div>
                <div>
                  <HStack>
                    <button className="pr-8" onClick={signUserOut}>Log out</button>
                    <p>{user?.displayName}</p>
                    <img
                      src={user?.photoURL || ""}
                      className="w-8 h-8 rounded-full"
                    />
                  </HStack>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppBar;
