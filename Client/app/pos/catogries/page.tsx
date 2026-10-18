import SideBar from "@/Components/Pos/SideBar";
import BodyCatogries from "@/Components/Pos/PageCatogries";
import NavBar from "@/Components/Pos/NavBar";
import Cart from "@/Components/Pos/Cart";

export default function Catogries() {
  return (
    <div className="bg-[#F8F8F8]">
      <div className="flex overflow-hidden">
        <SideBar />
        <div className="flex-1 max-w-full overflow-hidden">
          <NavBar />
          <BodyCatogries />
          <Cart />
        </div>
      </div>
    </div>
  );
}
