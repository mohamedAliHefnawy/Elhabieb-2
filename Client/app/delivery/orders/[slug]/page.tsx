"use client";

import Alert from "@/Components/Alert";
import DataDelivery from "@/Components/Delivery/DataDelivery";
import Footer from "@/Components/Delivery/Footer";
import ModelChangeCaseOrder from "@/Components/Delivery/ModelChangeCaseOrder";
import PageProduct from "@/Components/Mat3er/PageProduct";
import { fetchOrderDelivery } from "@/features/delivery";
import useSessionData from "@/hooks/useSessionData";
import Icons from "@/iconsSvg";
import { AppDispatch, RootState } from "@/src/store";
import { Avatar, Link, Spinner } from "@nextui-org/react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function OrderDelivery() {
  const path = usePathname();
  const decodedPath = decodeURIComponent(path);
  const dispatch = useDispatch<AppDispatch>();
  const isInitialLoad = useRef(true);
  const lastSegment = decodedPath.split("/").pop() as string;
  const sessionData = useSessionData();

  const { delieveryOrder, loading, error } = useSelector(
    (state: RootState) => state.delivery
  );

  if (error) {
    Alert("error", "توجد مشكلة في الإنترنت حاول تنشيط الصفحة");
    new Audio("/mp3/proplemInternet.mp3").play();
    return;
  }

  const Body = () => {
    return (
      <div>
        {loading && (
          <div className="flex justify-center items-center w-full h-[400px]">
            <Spinner size="lg" color="warning" />
          </div>
        )}

        <div dir="rtl">
          <div className="flex justify-between items-center">
            <div>
              <p className="mb-2">
                الهواتف :
                <Link
                  href={`tel:${delieveryOrder?.phoneMain}`}
                  className="text-[var(--color-matg3er)] underline mx-1"
                >
                  {delieveryOrder?.phoneMain}
                </Link>
                |
                <Link
                  href={`tel:${delieveryOrder?.phoneAlternative}`}
                  className="mr-1 text-[var(--color-matg3er)] underline"
                >
                  {delieveryOrder?.phoneAlternative}
                </Link>
              </p>
              <p>العنوان : {delieveryOrder?.placeDetails}</p>
              <p className="mt-2">العميل : {delieveryOrder?.client}</p>
              <p className="mt-2">المدينة : {delieveryOrder?.city}</p>

              <div className="flex items-center justify-start text-gray-500">
                منتجات الطبية :
                {delieveryOrder?.products &&
                  delieveryOrder?.products.length > 0 &&
                  delieveryOrder?.products.map((item, index) => (
                    <>
                      <Avatar
                        key={index}
                        src={item.imageProduct}
                        size="md"
                        className={`border-1 border-green-800 outline-2 outline-white relative -ml-2 ${
                          index * 10
                        }`}
                        style={{
                          zIndex: delieveryOrder?.products.length - index,
                        }}
                      />
                    </>
                  ))}
              </div>
              <p className="mt-2 text-gray-500">
                إجمالي المنتجات : {delieveryOrder?.priceProducts} د.ل
              </p>
              <p className="mt-2 text-gray-500">
                سعر التوصيل : {delieveryOrder?.priceDelivery} د.ل
              </p>
              <p className="mt-2 text-gray-500">
                <span className="ml-1">الإجمالي :</span>
                {+delieveryOrder?.priceDelivery.toFixed()! +
                  +delieveryOrder?.priceProducts.toFixed()!}
                د.ل
              </p>

              <p className="text-gray-500 my-2">
                <span className="ml-1">حالة الطلبية :</span>
                {delieveryOrder?.casesOrder &&
                  delieveryOrder?.casesOrder.length > 0 &&
                  delieveryOrder?.casesOrder[
                    delieveryOrder?.casesOrder.length - 1
                  ].case}
              </p>
            </div>
            <div className="flex flex-col justify-between items-center gap-10">
              <p>{delieveryOrder?.company.name}</p>
              <div className="relative flex flex-col items-baseline justify-between">
                <a href={`chat/${delieveryOrder?._id}`}>
                  <p className="hover:cursor-pointer hover:opacity-75 bg-yellow-200 p-3 w-14 h-14 flex justify-center items-center rounded-full border border-yellow-600 text-yellow-900">
                    <span>{Icons.ChatbubbleleftrightIcon}</span>
                  </p>
                  <span className="absolute top-0 right-0 bg-yellow-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                    {
                      delieveryOrder?.chat.filter((item) => {
                        if (sessionData?.validity === "Admin")
                          return !item.showAdmin;
                        if (sessionData?.validity === "Employ")
                          return !item.showEmploy;
                        if (sessionData?.validity === "Delivery")
                          return !item.showDelivery;
                        return !item.showUser;
                      }).length
                    }
                  </span>
                </a>
              </div>
            </div>
          </div>

          <ModelChangeCaseOrder
            idOrder={lastSegment}
            vaildity={delieveryOrder?.vaildity || ""}
            client={delieveryOrder?.client || ""}
            products={
              delieveryOrder?.products || [
                {
                  idProduct: "",
                  nameProduct: "",
                  colorProduct: "",
                  sizeProduct: "",
                  priceProduct: 0,
                  gainMarkter: 0,
                  priceMarkter: 0,
                  priceCustomer: 0,
                  imageProduct: "",
                  storeProduct: "",
                  cityProduct: "",
                  amountProduct: 0,
                  amountNewProduct: 0,
                },
              ]
            }
            delivery={sessionData?.email || ""}
          />
          <div className="overflow-x-auto mt-3">
            <table
              className="border-1 border-[var(--color-navbar)] p-4 w-full"
              dir="rtl"
            >
              <thead className="border-1 border-[var(--color-navbar)] p-4">
                <tr className="border-1 border-[var(--color-navbar)] p-4">
                  <th className="border-1 border-[var(--color-navbar)] p-4  min-w-[10rem]">
                    المنتج
                  </th>
                  <th className="border-1 border-[var(--color-navbar)] p-4  min-w-[10rem]">
                    الحجم
                  </th>
                  <th className="border-1 border-[var(--color-navbar)] p-4  min-w-[10rem]">
                    اللون
                  </th>
                  <th className="border-1 border-[var(--color-navbar)] p-4  min-w-[10rem]">
                    السعر
                  </th>
                  <th className="border-1 border-[var(--color-navbar)] p-4  min-w-[10rem]">
                    الكمية
                  </th>
                  <th className="border-1 border-[var(--color-navbar)] p-4  min-w-[10rem]">
                    الإجمالي
                  </th>
                </tr>
              </thead>
              <tbody>
                {delieveryOrder?.products.map((item, i) => (
                  <tr
                    key={i}
                    className={`border-1 border-[var(--color-navbar)] p-4`}
                  >
                    <td className="border-1 border-[var(--color-navbar)] p-4 flex justify-center items-center gap-x-2 min-w-[10rem]">
                      <p className="overflow-hidden whitespace-nowrap text-ellipsis">
                        {item.nameProduct}
                      </p>
                    </td>
                    <td className="border-1 border-[var(--color-navbar)] p-4 text-center  min-w-[10rem]">
                      {item.sizeProduct}
                    </td>
                    <td
                      className="border-1 border-[var(--color-navbar)] p-4 text-center  min-w-[12rem]"
                      style={{ backgroundColor: item.colorProduct }}
                    >
                      {item.colorProduct}
                    </td>
                    <td className="border-1 border-[var(--color-navbar)] p-4 text-center  min-w-[10rem]">
                      {delieveryOrder.vaildity === "Markter"
                        ? item.priceMarkter
                        : item.priceCustomer}
                    </td>
                    <td className="border-1 border-[var(--color-navbar)] p-4 text-center  min-w-[12rem]">
                      {item.amountProduct}
                    </td>
                    <td className="border-1 border-[var(--color-navbar)] p-4 text-center  min-w-[12rem]">
                      {delieveryOrder.vaildity === "Markter"
                        ? item.priceMarkter * item.amountProduct
                        : item.priceCustomer * item.amountProduct}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    if (isInitialLoad.current && sessionData) {
      dispatch(
        fetchOrderDelivery({
          dataReq: [
            "_id",
            "phoneMain",
            "phoneAlternative",
            "placeDetails",
            "client",
            "vaildity",
            "orderId",
            "city",
            "priceDelivery",
            "priceProducts",
            "casesOrder",
            "date",
            "time",
            "products",
            "chat",
          ],
          slug: lastSegment,
        })
      );
      isInitialLoad.current = false;
    }
  }, [dispatch, sessionData]);

  return (
    <div className="flex flex-col items-center bg-[var(--color-navbar)] min-h-screen w-full">
      <DataDelivery />
      <div className="bg-white rounded-ss-2xl rounded-se-2xl p-6 w-full pb-20">
        {Body()}
      </div>

      <Footer />
    </div>
  );
}
