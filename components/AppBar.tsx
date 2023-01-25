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

  return (
    <div className="bg-gray-900  shadow-xl py-1 lg:py-4">
      <div className="lg:flex lg:justify-center lg:items-center">
        <div className="px-4 lg:px-8 w-auto lg:w-[1130px]">
          <div className="flex text-sm text-slate-400 justify-between items-center">
            {/* Logged out and unauthorized view */}
            {!user || unauthorized ? null : (
              <>
                <Link
                  className="hover:scale-110 transform-gpu ease-in-out duration-300 rounded-full"
                  href={"/"}
                >
                  <img
                    src="/trovali.svg"
                    className="w-[32px] h-[32px] shadow-lg"
                  />
                </Link>
              </>
            )}
            {/* Users and admin view */}
            {user && !unauthorized && (
              <div className="flex items-center gap-6">
                {/* {admin ? (
                    <Link className="pl-8" href={"/alimenta"}>
                    Alimenta
                    </Link>
                  ) : null} */}
                <Link href={"/busca"}>
                  <img src="/search.svg" />
                </Link>
                  <p className="">{user?.displayName}</p>
                  <button onClick={signUserOut}>Log out</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppBar;
