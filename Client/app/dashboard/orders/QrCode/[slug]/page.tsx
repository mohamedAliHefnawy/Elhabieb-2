"use client";

//REACT
import QRCode from "qrcode.react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/src/store";

//COMPONENTS
import NavBar from "@/Components/Dashboard/NavBar";
import SideBar from "@/Components/Dashboard/SideBar";
import SizeScreen from "@/Components/Dashboard/SizeScreen";
import { useEffect, useRef } from "react";
import { fetchOrderByID } from "@/features/ordersSlice";
import Alert from "@/Components/Alert";
import { Spinner } from "@nextui-org/react";

export default function QrCode({ params }: { params: { slug: string } }) {
  const dispatch = useDispatch<AppDispatch>();
  const isInitialLoad = useRef(true);

  const { Order, loading, error } = useSelector(
    (state: RootState) => state.order
  );

  if (error) {
    Alert("error", "توجد مشكلة في الإنترنت حاول تنشيط الصفحة");
    new Audio("/mp3/proplemInternet.mp3").play();
    return;
  }

  const DataOrder = () => {
    return (
      <>
        <div dir="rtl" className="flex justify-center w-[100%] mt-16">
          <div className="w-[50%]">
            <div className="flex">
              <p className="ml-2 text-black opacity-50"> كود الطلبية : </p>
              <p className="opacity-95"> {Order?._id} </p>
            </div>
            <div className="flex my-5">
              <p className="ml-2 text-black opacity-50"> اسم العميل : </p>
              <p className="opacity-95"> {Order?.client} </p>
            </div>
            <div className="flex my-5">
              <p className="ml-2 text-black opacity-50"> رقم هاتف 1 : </p>
              <p className="opacity-95"> {Order?.phoneMain} </p>
            </div>
            <div className="flex my-5">
              <p className="ml-2 text-black opacity-50"> رقم هاتف 2 : </p>
              <p className="opacity-95">{Order?.phoneAlternative}</p>
            </div>
          </div>
          <div>
            <div className="flex my-5">
              <p className="ml-2 text-black opacity-50"> العنوان : </p>
              <p className="opacity-95"> {Order?.placeDetails} </p>
            </div>
            <div className="flex my-5">
              <p className="ml-2 text-black opacity-50"> التاريخ : </p>
              <p className="opacity-95"> {Order?.date} </p>
            </div>
            <div className="flex my-5">
              <p className="ml-2 text-black opacity-50"> الوقت : </p>
              <p className="opacity-95"> {Order?.time} </p>
            </div>
          </div>
        </div>
      </>
    );
  };
  const Body = () => {
    return (
      <div className="w-[100%] h-screen bg-[var(--color-body)] border-1 border-[var(--color-navbar)] mt-1 mb-0.5 p-4 flex flex-col justify-center items-center">
        <QRCode value={`${params.slug}`} size={200} />
        <DataOrder />
      </div>
    );
  };

  useEffect(() => {
    if (isInitialLoad.current) {
      dispatch(fetchOrderByID(params.slug));
      isInitialLoad.current = false;
    }
  }, []);
  return (
    <>
      <div className="w-full h-screen flex max-2xl:flex max-xl:flex lg:flex md:hidden sm:hidden max-sm:hidden">
        <div className="w-[84%] mr-1 flex flex-col">
          <NavBar />
          {loading ? (
            <div className="h-screen w-[100%] bg-[var(--color-body)] border-1 border-[var(--color-navbar)] mt-1 flex items-center justify-center">
              <Spinner color="success" size="lg" />
            </div>
          ) : (
            <Body />
          )}
        </div>
        <div className="w-[16%] flex flex-col">
          <SideBar />
        </div>
      </div>

      <SizeScreen />
    </>
  );
}
