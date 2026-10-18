"use client";

//components
import NavBar from "@/Components/Dashboard/NavBar";
import SideBar from "@/Components/Dashboard/SideBar";
import PageMoneyTreasury from "@/Components/Dashboard/moneyTreasury/MoneyTreasury";
import SizeScreen from "@/Components/Dashboard/SizeScreen";
import WorkingOnPage from "@/Components/WorkingOnPage";

export default function MoneyTreasury() {
  return (
    <>
      <div className="w-full h-screen flex max-2xl:flex max-xl:flex lg:flex md:hidden sm:hidden max-sm:hidden">
        <div className="w-[84%] mr-1 flex flex-col">
          <NavBar />
          <PageMoneyTreasury />
        </div>
        <div className="w-[16%] flex flex-col">
          <SideBar />
        </div>
      </div>

      <SizeScreen />
    </>
  );
}
