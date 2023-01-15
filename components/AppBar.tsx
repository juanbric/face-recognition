import Link from "next/link";
import { HStack } from "@chakra-ui/react";
import { auth } from "../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { signOut } from "firebase/auth";
import useGetRol from "../hooks/useGetRol";

export const AppBar = () => {
  const [user] = useAuthState(auth);
  const rol = useGetRol();
  const unauthorized = rol?.rol === "guest";
  const admin = rol?.rol === "admin";

  const signUserOut = async () => {
    await signOut(auth);
  };

  console.log("User metadata", rol);

  return (
    <div className=" bg-white border-b-[0.00001px] border-[#dfd3dc] py-1 lg:py-2">
      <div className="lg:flex lg:justify-center lg:items-center">
        <div className="px-4 lg:px-8 w-auto lg:w-[1130px]">
          <div className="flex text-sm text-slate-500 justify-between items-center">
            {/* Logged out and unauthorized view */}
            {!user || unauthorized ? <Link href={"/login"}>Login</Link> : null}

            {/* Users and admin view */}
            {user && !unauthorized && (
              <>
                <div>
                  <Link href={"/"} className="pr-8">
                    Reconoce y sube
                  </Link>
                  <Link href={"/busca"}>Busca</Link>
                  {admin ? (
                    <Link className="pl-8" href={"/alimenta"}>
                      Alimenta
                    </Link>
                  ) : null}
                </div>
                <div>
                  <HStack>
                    <button className="pr-8" onClick={signUserOut}>
                      Log out
                    </button>
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
