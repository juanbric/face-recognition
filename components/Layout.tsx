import AppBar from "./AppBar";

export default function Layout({ children }: { children: any }) {
  return (
    <>
    <AppBar />
      <div className="text-slate-400 bg-gray-900 lg:flex lg:justify-center lg:items-center">
        <div className="px-4 lg:px-8 w-auto lg:w-[1130px] ">
          {children}
          </div>
        </div>
    </>
  );
}