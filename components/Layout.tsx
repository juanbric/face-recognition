import AppBar from "./AppBar";

export default function Layout({ children }: { children: any }) {
  return (
    <>
    <AppBar />
      <div className="text-[#111827] bg-[#fefefe] lg:flex lg:justify-center lg:items-center">
        <div className="px-4 lg:px-8 w-auto lg:w-[1130px] ">
          {children}
          </div>
        </div>
    </>
  );
}