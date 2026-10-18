import SideBar from "@/Components/Pos/SideBar";
import Body from "@/Components/Pos/Body";
import NavBar from "@/Components/Pos/NavBar";
import PageOrders from "@/Components/Pos/PageOrders";
import Cart from "@/Components/Pos/Cart";

export default function Orders() {
  return (
    <div className="bg-[#F8F8F8]">
      <div className="flex overflow-hidden">
        <SideBar />
        <div className="flex-1 max-w-full overflow-hidden">
          <NavBar />
          <PageOrders />
          <Cart />
        </div>
      </div>
    </div>
  );
}
