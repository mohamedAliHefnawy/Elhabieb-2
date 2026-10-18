import { Progress } from "@nextui-org/react";
import NavBar from "@/Components/Dashboard/NavBar";

import SizeScreen from "./SizeScreen";
import SideBar from "./SideBar";

export default function LoadingComponent() {
  return (
    <>
      <div className="w-full h-screen flex max-2xl:flex max-xl:flex lg:flex md:hidden sm:hidden max-sm:hidden">
        <div className="w-[84%] mr-1 flex flex-col">
          <NavBar />

          <div className="h-screen w-full bg-[var(--color-body)] border border-[var(--color-navbar)] overflow-y-auto custom-scrollbar p-6 mt-1">
            <div className="w-[100%] h-screen flex flex-col items-center justify-center">
              <p className="mb-5">يتم تحميل الصفحة</p>
              <Progress
                size="sm"
                isIndeterminate
                aria-label="Loading..."
                className="max-w-md"
                color="success"
              />
            </div>
          </div>
        </div>
        <div className="w-[16%] bg-white flex flex-col">
          <SideBar />
        </div>
      </div>

      <SizeScreen />
    </>
  );
}
