"use client";

//components
import NavBar from "@/Components/Dashboard/NavBar";
import SideBar from "@/Components/Dashboard/SideBar";

//images
import SizeScreen from "@/Components/Dashboard/SizeScreen";

export default function WorkingOnPage() {
  return (
    <>
      <div className="w-full h-screen flex max-2xl:flex max-xl:flex lg:flex md:hidden sm:hidden max-sm:hidden">
        <div className="w-[84%] mr-1 flex flex-col">
          <NavBar />
          <div className="h-screen w-full flex flex-col justify-center items-center bg-[var(--color-body)] bg-opacity-15 border-1 border-[var(--color-navbar)] overflow-y-auto custom-scrollbar p-6 mt-1">
            <p className="mb-3 text-3xl">-ˏˋ⋆ ᴡ ᴇ ʟ ᴄ ᴏ ᴍ ᴇ ⋆ˊˎ- </p>
            <p>ما زال العمل علي تلك الصفحة </p>
          </div>
        </div>
        <div className="w-[16%] flex flex-col">
          <SideBar />
        </div>
      </div>

      <SizeScreen />
    </>
  );
}
