import SideBar from "@/Components/Pos/SideBar";
import Body from "@/Components/Pos/Body";
import NavBar from "@/Components/Pos/NavBar";
import PageMoneyTreasury from "@/Components/Pos/PageMoneyTreasury";
import Cart from "@/Components/Pos/Cart";
import DetailsMoney from "@/Components/Pos/detailsMoney";

export default function MoneyTreasury() {
  return (
    <div className="bg-[#F8F8F8]">
      <div className="flex overflow-hidden">
        <SideBar />
        <div className="flex-1 max-w-full overflow-hidden">
          <NavBar />
          <PageMoneyTreasury />
          <DetailsMoney />
          <Cart />
        </div>
      </div>
    </div>
  );
}
