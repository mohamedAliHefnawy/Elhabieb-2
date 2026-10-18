
import SideBar from "@/Components/Pos/SideBar";
import Body from "@/Components/Pos/Body";
import NavBar from "@/Components/Pos/NavBar";
import PageEditOrder from "@/Components/Pos/PageEditOrder";
import Cart from "@/Components/Pos/Cart";

export default function EditOrder({ params }: { params: { slug: string } }) {
  return (
    <div className="bg-[#F8F8F8]">
      <div className="flex overflow-hidden">
        <SideBar />
        <div className="flex-1 max-w-full overflow-hidden">
          <NavBar />
          <PageEditOrder slug={params.slug} />
          <Cart />
        </div>
      </div>
    </div>
  );
}
