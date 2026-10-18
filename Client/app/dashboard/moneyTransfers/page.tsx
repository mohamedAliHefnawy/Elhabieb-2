"use client";

//components
import NavBar from "@/Components/Dashboard/NavBar";
import SideBar from "@/Components/Dashboard/SideBar";
import PageMoneyTransfers from "@/Components/Dashboard/moneyTransfers/PageMoneyTransfers";
import SizeScreen from "@/Components/Dashboard/SizeScreen";

export default function MoneyTransfers() {
  return (
    <>
      <div className="w-full h-screen flex max-2xl:flex max-xl:flex lg:flex md:hidden sm:hidden max-sm:hidden">
        <div className="w-[84%] mr-1 flex flex-col">
          <NavBar />
          <PageMoneyTransfers />
        </div>
        <div className="w-[16%] flex flex-col">
          <SideBar />
        </div>
      </div>

      <SizeScreen />
    </>
  );
}
