"use client";

// Components
import NavBar from "@/Components/Dashboard/NavBar";
import SideBar from "@/Components/Dashboard/SideBar";
import SizeScreen from "@/Components/Dashboard/SizeScreen";
import AddMoneyTreasury from "@/Components/Dashboard/moneyTreasury/AddMoneyTreasury";

export default function PageAddMoneyTreasury() {
  return (
    <>
      <div className="w-full h-screen flex max-2xl:flex max-xl:flex lg:flex md:hidden sm:hidden max-sm:hidden">
        <div className="w-[84%] mr-1 flex flex-col">
          <NavBar />
          <AddMoneyTreasury />
        </div>
        <div className="w-[16%] flex flex-col">
          <SideBar />
        </div>
      </div>

      <SizeScreen />
    </>
  );
}
