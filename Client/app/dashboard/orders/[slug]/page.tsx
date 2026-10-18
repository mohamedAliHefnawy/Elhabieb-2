"use client";

//REACT
import Barcode from "react-barcode";

//COMPONENTS
import NavBar from "@/Components/Dashboard/NavBar";
import SideBar from "@/Components/Dashboard/SideBar";
import SizeScreen from "@/Components/Dashboard/SizeScreen";
import { Avatar, Pagination, Spinner } from "@nextui-org/react";
import { useEffect, useRef, useState } from "react";
import { fetchOrderByID } from "@/features/ordersSlice";
import { AppDispatch, RootState } from "@/src/store";
import { useDispatch, useSelector } from "react-redux";
import Alert from "@/Components/Alert";

export default function Order({ params }: { params: { slug: string } }) {
  const isInitialLoad = useRef(true);
  const dispatch = useDispatch<AppDispatch>();

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
      <div className="flex ">
        <div className="w-[50%]">
          <div className="flex">
            <p className="ml-2 text-black opacity-50"> كود الطلبية : </p>
            <p className=""> {Order?._id} </p>
          </div>
          <div className="flex my-5">
            <p className="ml-2 text-black opacity-50"> اسم العميل : </p>
            <p className="text-[var(--ColorText)]"> {Order?.client} </p>
          </div>
          <div className="flex my-5">
            <p className="ml-2 text-black opacity-50"> رقم هاتف 1 : </p>
            <p className="text-[var(--ColorText)]"> {Order?.phoneMain} </p>
          </div>
          <div className="flex my-5">
            <p className="ml-2 text-black opacity-50"> رقم هاتف 2 : </p>
            <p className="text-[var(--ColorText)]">{Order?.phoneAlternative}</p>
          </div>
          <div className="flex my-5">
            <p className="ml-2 text-black opacity-50"> العنوان : </p>
            <p className="text-[var(--ColorText)]"> {Order?.placeDetails} </p>
          </div>
          <div className="flex my-5">
            <p className="ml-2 text-black opacity-50"> التاريخ : </p>
            <p className="text-[var(--ColorText)]"> {Order?.date} </p>
          </div>
          <div className="flex my-5">
            <p className="ml-2 text-black opacity-50"> الوقت : </p>
            <p className="text-[var(--ColorText)]"> {Order?.time} </p>
          </div>
        </div>
        <div>
          <div className="flex">
            <p className="ml-2 text-black opacity-50">مندوب التسويق :</p>
            <p className="text-[var(--ColorText)]"> {Order?.markter} </p>
          </div>
          <div className="flex my-5">
            <p className="ml-2 text-black opacity-50"> ربح المسوق : </p>
            <p className="text-[var(--ColorText)]">
              {" "}
              {Order?.gainMarkter!} د.ل{" "}
            </p>
          </div>
          <div className="flex my-5">
            <p className="ml-2 text-black opacity-50"> ربح الأدمن : </p>
            <p className="text-[var(--ColorText)]"> {Order?.gainAdmin!} د.ل </p>
          </div>
          <div className="flex my-5">
            <p className="ml-2 text-black opacity-50"> سعر التوصيل : </p>
            <p className="text-[var(--ColorText)]">
              {" "}
              {Order?.priceDelivery} د.ل{" "}
            </p>
          </div>
          <div className="flex my-5">
            <p className="ml-2 text-black opacity-50"> حالة الطلبية : </p>
            <p
              className={`${
                (Order?.casesOrder[Order?.casesOrder.length - 1].case ===
                  "في إنتظار الموافقة" &&
                  "text-orange-500") ||
                (Order?.casesOrder[Order?.casesOrder.length - 1].case ===
                  "تم القبول" &&
                  "text-green-500") ||
                (Order?.casesOrder[Order?.casesOrder.length - 1].case ===
                  "تم الرفض" &&
                  "text-red-500")
              }`}
            >
              {Order?.casesOrder[Order?.casesOrder.length - 1].case}
            </p>
          </div>
        </div>
      </div>
    );
  };

  const ProductsOrder = () => {
    return (
      <div>
        <div>
          <div className="flex items-center mt-4 mb-5 p-4 pr-10 pl-10 bg-[var(--color-body)] shadow-lg shadow-[var(--color-navbar)] rounded-2xl text-black opacity-75">
            <div className="w-[20%] text-center text-black opacity-50">
              <p> الصورة </p>
            </div>
            <div className="w-[20%] text-center text-black opacity-50">
              <p> إسم المنتج </p>
            </div>
            <div className="w-[20%] text-center text-black opacity-50">
              <p> اللون </p>
            </div>
            <div className="w-[20%] text-center text-black opacity-50">
              <p> المقاس </p>
            </div>
            <div className="w-[20%] text-center text-black opacity-50">
              <p> الكمية </p>
            </div>
            <div className="w-[20%] text-center text-black opacity-50">
              <p> سعر المنتج </p>
            </div>
            <div className="w-[20%] text-center text-black opacity-50">
              <p> الإجمالي </p>
            </div>
            <div className="w-[20%] text-center text-black opacity-50">
              <p> المخزن </p>
            </div>
          </div>

          <div>
            {Order?.products.map((product, i) => (
              <div
                key={i}
                className="flex items-center mb-3 p-4 pr-10 pl-10 bg-[var(--color-body)] shadow-lg rounded-2xl border-1 border-[var(--color-navbar)] text-black "
              >
                <div className="w-[20%] flex justify-center">
                  <Avatar size="lg" src={product.imageProduct} />
                </div>
                <div className="w-[20%] text-center">
                  <p> {product.nameProduct} </p>
                </div>
                <div className="w-[20%] flex justify-center">
                  <p
                    className="w-3 h-3"
                    style={{ backgroundColor: product.colorProduct }}
                  ></p>
                </div>
                <div className="w-[20%] text-center">
                  <p> {product.sizeProduct} </p>
                </div>
                <div className="w-[20%] text-center">
                  <p> {product.amountProduct} </p>
                </div>
                <div className="w-[20%] text-center">
                  <p>
                    <span>
                      {Order.vaildity === "Markter"
                        ? product.priceMarkter
                        : product.priceCustomer}
                    </span>
                    <span className="mr-1">د.ل</span>
                  </p>
                </div>
                <div className="w-[20%] text-center">
                  <p>
                    <span>
                      {Order.vaildity === "Markter"
                        ? product.priceMarkter * product.amountProduct
                        : product.priceCustomer * product.amountProduct}
                    </span>
                    <span className="mr-1">د.ل</span>
                  </p>
                </div>
                <div className="w-[20%] text-center">
                  <p> {product.storeProduct} </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };
  const Body = () => {
    return (
      <div
        className="h-screen w-[100%] bg-[var(--color-body)] border-1 border-[var(--color-navbar)]  overflow-y-auto custom-scrollbar p-6 mt-1"
        dir="rtl"
      >
        <DataOrder />
        <ProductsOrder />
      </div>
    );
  };

  useEffect(() => {
    if (isInitialLoad.current && typeof params.slug === "string") {
      dispatch(fetchOrderByID(params.slug));
      isInitialLoad.current = false;
    }
  }, [dispatch]);
  return (
    <>
      <div className="w-full h-screen flex max-2xl:flex max-xl:flex lg:flex md:hidden sm:hidden max-sm:hidden">
        <div className="w-[84%] mr-1 flex flex-col">
          <NavBar />
          {loading ? (
            <div className="h-screen mt-1 w-[100%] bg-[var(--color-body)] border-1 border-[var(--color-navbar)] flex items-center justify-center">
              <Spinner color="success" size="lg" />
            </div>
          ) : (
            <Body />
          )}
        </div>
        <div className="w-[16%] bg-white flex flex-col">
          <SideBar />
        </div>
      </div>

      <SizeScreen />
    </>
  );
}
