import { Progress } from "@nextui-org/react";
import NavBar from "@/Components/Pos/NavBar";
import SideBar from "@/Components/Pos/SideBar";
import Cookies from "js-cookie";
import { BallTriangle } from "react-loader-spinner";
export default function LoadingComponent() {
  const colorCompany = Cookies.get("colorPos");

  return (
    <>
      <div className="bg-[#F8F8F8]">
        <div className="flex overflow-hidden">
          <SideBar />
          <div className="flex-1 max-w-full overflow-hidden">
            <NavBar />
            <div className="w-[100%] h-screen flex flex-col items-center justify-center">
              <div className="absolute inset-0 flex items-center justify-center">
                <BallTriangle
                  height={100}
                  width={100}
                  radius={5}
                  color={colorCompany}
                  ariaLabel="ball-triangle-loading"
                  wrapperStyle={{}}
                  wrapperClass=""
                  visible={true}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
