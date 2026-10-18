import SideBar from "@/Components/Pos/SideBar";
import PageProducts from "@/Components/Pos/PageProducts";
import NavBar from "@/Components/Pos/NavBar";
import Cart from "@/Components/Pos/Cart";

export default function Products() {
  return (
    <div className="bg-[#F8F8F8]">
      <div className="flex overflow-hidden">
        <SideBar />
        <div className="flex-1 max-w-full overflow-hidden">
          <NavBar />
          <PageProducts />
          <Cart />
        </div>
      </div>
    </div>
  );
}
