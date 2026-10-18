"use client";

//COMPONENTS
import NavBar from "@/Components/Dashboard/NavBar";
import SideBar from "@/Components/Dashboard/SideBar";
import PageWithdrawReq from "@/Components/Dashboard/withdrawReq/pageWithdrawReq";
import SizeScreen from "@/Components/Dashboard/SizeScreen";

export default function WithdrawReq() {
  return (
    <>
      <div className="w-full h-screen flex max-2xl:flex max-xl:flex lg:flex md:hidden sm:hidden max-sm:hidden">
        <div className="w-[84%] mr-1 flex flex-col">
          <NavBar />
          <PageWithdrawReq />
        </div>
        <div className="w-[16%] flex flex-col">
          <SideBar />
        </div>
      </div>

      <SizeScreen />
    </>
  );
}
