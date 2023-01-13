import Link from "next/link";
import Image from "next/image";
import {
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";

export const AppBar = () => {
  return (
    <div className=" bg-white border-b-[0.00001px] border-[#dfd3dc] py-1 lg:py-2">
      <div className="lg:flex lg:justify-center lg:items-center">
        <div className="px-4 lg:px-8 w-auto lg:w-[1130px]">
          <div className="flex justify-start items-center">
            <div className="hidden lg:block text-sm text-slate-500">
              <Link href={"/"} className="pr-8">Reconoce y sube</Link>
              <Link href={"/busca"} className="header-tiny-bold azul">
                Busca
              </Link>
            </div>

            <div className="lg:hidden block">
              <Menu>
                <MenuButton
                  as={IconButton}
                  aria-label="Options"
                  icon={
                    <Image
                      src="/hamburguer.png"
                      width={23}
                      height={23}
                      alt={""}
                    />
                  }
                  variant="white"
                />
                <MenuList minW="50px" className="azul">
                  <MenuItem>
                    <Link href={"/index"}>Reconoce y sube</Link>
                  </MenuItem>
                  <MenuItem>
                    <Link href={"/busca"}>Busca</Link>
                  </MenuItem>
                </MenuList>
              </Menu>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppBar;
