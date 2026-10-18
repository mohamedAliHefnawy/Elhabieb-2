"use client";

//REACT
import React, { useEffect, useRef, useState } from "react";
import QRCode from "qrcode.react";
import { fetchOrderByID } from "@/features/ordersSlice";
import { AppDispatch, RootState } from "@/src/store";
import { useDispatch, useSelector } from "react-redux";

//COMPONENTS
import NavBar from "@/Components/Dashboard/NavBar";
import SideBar from "@/Components/Dashboard/SideBar";
import SizeScreen from "@/Components/Dashboard/SizeScreen";
import BottomPrint from "@/Components/Dashboard/orders/ButtonPrintComponent";

//NEXT UI
import { Avatar } from "@nextui-org/react";

//IMAGES
import faceBook from "@/public/images/facebook.png";
import linkenIn from "@/public/images/linkedin.png";
import telegram from "@/public/images/telegram.png";
import instagram from "@/public/images/instagram.png";
import whatsapp from "@/public/images/whatsapp.png";
import Hbaieb from "@/public/images/hbaieb.png";
import Alert from "@/Components/Alert";

export default function QrCode({ params }: { params: { slug: string } }) {
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

  const [offset, setOffset] = useState(0);
  const [isScrollingDown, setIsScrollingDown] = useState(true);
  let lastScrollTop = 0;

  const handleScroll = () => {
    const currentScrollTop = window.scrollY;
    if (currentScrollTop > lastScrollTop) {
      setIsScrollingDown(true);
    } else {
      setIsScrollingDown(false);
    }
    lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
    setOffset(currentScrollTop);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const Body = () => {
    return (
      <div className="h-screen w-[100%] bg-[var(--color-body)] border-1 border-[var(--color-navbar)] flex justify-center items-center overflow-y-auto custom-scrollbar p-6 mt-1 pt-40">
        <div
          className="w-[60%] mt-4 border-b-0 border-1"
          style={{ borderColor: Order?.company.color || "var(--color-navbar)" }}
        >
          <div className="p-4 w-[100%] flex justify-between items-center">
            <p
              className="w-[5%] h-4"
              style={{
                backgroundColor: Order?.company.color || "var(--color-navbar)",
              }}
            ></p>
            <p className="w-[45%] flex justify-center items-center">
              {Order?.company.image ? (
                <Avatar src={Order?.company.image} size="md" />
              ) : (
                <Avatar src={`${Hbaieb.src}`} size="md" />
              )}
              <span className="ml-3">{Order?.company.name || "الحبايب"}</span>
            </p>
            <p
              className="w-[50%] h-10 text-lg text-white font-bold flex justify-center items-center"
              style={{
                backgroundColor: Order?.company.color || "var(--color-navbar)",
              }}
            >
              فاتورة
            </p>
          </div>
          <div className="my-4">
            <div className="w-[100%] mt-10 p-4 text-sm flex justify-evenly items-center">
              <QRCode value={`${Order?._id}`} size={140} />

              <div className="flex justify-between items-center w-[100%] mt-7">
                <div></div>
                <div className="flex flex-col items-end text-md w-[50%]">
                  <div className="flex justify-between mb-2 w-full">
                    <p className="flex">
                      <span className="mr-1">{Order?.placeDetails}</span>
                      <span className="text-black opacity-50"> : العنوان </span>
                    </p>
                    <p className="flex">
                      <span className="mr-1">{Order?.client}</span>
                      <span className="text-black opacity-50"> : الإسم </span>
                    </p>
                  </div>
                  <div className="flex justify-between mb-2 w-full">
                    <p className="flex mb-2">
                      <span className="mr-1">{Order?.time}</span>
                      <span className="text-black opacity-50"> : الوقت </span>
                    </p>
                    <p className="flex mb-2">
                      <span className="mr-1">{Order?.date}</span>
                      <span className="text-black opacity-50"> : التاريخ </span>
                    </p>
                  </div>
                  <div className="flex justify-between mb-2 w-full">
                    <p className="flex mb-2">
                      <span className="mr-1" dir="rtl">
                        {Order?.products.reduce(
                          (calc, alt) =>
                            calc + alt.amountProduct * alt.priceProduct,
                          0
                        )}{" "}
                        د.ل
                      </span>
                      <span className="text-black opacity-50">
                        : إجمالي المنتجات
                      </span>
                    </p>
                    <p className="flex mb-2">
                      <span className="mr-1" dir="rtl">
                        {Order?.priceDelivery} د.ل
                      </span>
                      <span className="text-black opacity-50">
                        : سعر التوصيل
                      </span>
                    </p>
                  </div>
                  <p className="flex mb-2">
                    <span className="mr-1">
                      {Order?.phoneMain} . {Order?.phoneAlternative}
                    </span>
                    <span className="text-black opacity-50">
                      : أرقام الهواتف
                    </span>
                  </p>
                </div>
              </div>
            </div>
            <div
              className="flex justify-evenly items-center text-sm text-black opacity-50 p-4"
              style={{
                backgroundColor: Order?.company.color || "var(--color-navbar)",
              }}
            >
              <p className="w-[20%] text-center">المخزن</p>
              <p className="w-[20%] text-center">الإجمالي</p>
              <p className="w-[20%] text-center">الكميه</p>
              <p className="w-[20%] text-center">السعر</p>
              <p className="w-[20%] text-center">المقاس</p>
              <p className="w-[20%] text-center">اللون</p>
              <p className="w-[20%] text-center">المنتج</p>
            </div>

            {Order?.products.map((product, i) => (
              <div
                key={i}
                className="flex justify-evenly items-center text-sm p-4 border-b-1"
              >
                <p className="w-[20%] text-center">{product.storeProduct}</p>
                <p className="w-[20%] text-center">
                  {product.priceProduct * product.amountProduct}
                </p>
                <p className="w-[20%] text-center">{product.amountProduct}</p>
                <p className="w-[20%] text-center">{product.priceProduct}</p>
                <p className="w-[20%] text-center">{product.sizeProduct}</p>
                <p
                  className="w-[20%] h-4  text-center"
                  style={{ backgroundColor: product.colorProduct }}
                ></p>
                <p className="w-[20%] text-center">{product.nameProduct}</p>
              </div>
            ))}

            <div className="flex justify-center my-4">
              <Avatar src={`${Hbaieb.src}`} className="w-60 h-60 opacity-30" />
            </div>

            <div
              className="w-[100%] -mb-4 p-4 flex justify-evenly items-center text-sm"
              style={{
                backgroundColor: Order?.company.color || "var(--color-navbar)",
              }}
            >
              <div className="flex">
                <Avatar src={faceBook.src} size="sm" className="mr-2" />
                <Avatar src={telegram.src} size="sm" className="mr-2" />
                <Avatar src={linkenIn.src} size="sm" className="mr-2" />
                <Avatar src={instagram.src} size="sm" className="mr-2" />
                <Avatar src={whatsapp.src} size="sm" className="mr-2" />
              </div>
              <div>{Order?.company.phone || <>لا يوجد رقم هاتف</>}</div>
              <div>
                {Order?.company.image ? (
                  <Avatar src={Order.company.image} size="md" />
                ) : (
                  <Avatar src={`${Hbaieb.src}`} size="md" />
                )}
              </div>
            </div>
          </div>
        </div>
        <BottomPrint
          idOrder={Order?._id || ""}
          client={Order?.client || ""}
          address={Order?.placeDetails || ""}
          phone1={Order?.phoneMain || ""}
          phone2={Order?.phoneAlternative || ""}
          date={Order?.date || ""}
          priceDelivery={Order?.priceDelivery || 0}
          company={
            Order?.company || { name: "", image: "", phone: "", color: "" }
          }
          products={
            Order?.products || [
              {
                idProduct: "",
                nameProduct: "",
                colorProduct: "",
                sizeProduct: "",
                priceProduct: 0,
                imageProduct: "",
                storeProduct: "",
                cityProduct: "",
                amountProduct: 0,
              },
            ]
          }
        />
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
          <Body />
        </div>
        <div className="w-[16%] flex flex-col">
          <SideBar />
        </div>
      </div>

      <SizeScreen />
    </>
  );
}
