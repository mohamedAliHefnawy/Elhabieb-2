"use client";

import React, { useEffect, useRef, useState } from "react";
import QRScanner from "@/Components/Delivery/scannner";
import getSessionData, { SessionData } from "@/contexts/SessionContext";
import DataDelivery from "@/Components/Delivery/DataDelivery";
import Orders3 from "@/Components/Delivery/Orders3";
import Footer from "@/Components/Delivery/Footer";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/src/store";
import Alert from "@/Components/Alert";
import { fetchOrdersDelivery } from "@/features/delivery";
import { Radio, RadioGroup, Spinner, Avatar } from "@nextui-org/react";
import Link from "next/link";
import Icons from "@/iconsSvg";
import useSessionData from "@/hooks/useSessionData";

const DeliveryPageOrders = () => {
  const sessionData = useSessionData();
  const dispatch = useDispatch<AppDispatch>();
  const isInitialLoad = useRef(true);
  const [filter, setFilter] = useState("");
  const [selectedCase, setSelectedCase] = useState<string>("الكل");

  const { delieveryOrders, loading, error } = useSelector(
    (state: RootState) => state.delivery
  );

  if (error) {
    Alert("error", "توجد مشكلة في الإنترنت حاول تنشيط الصفحة");
    new Audio("/mp3/proplemInternet.mp3").play();
    return;
  }

  const filteredOrders = delieveryOrders
    .filter(
      (item) => !item.casesOrder.some((item) => item.case === "تم التوصيل")
    )
    .filter((item) => {
      const matchesCase =
        selectedCase === "الكل" ||
        selectedCase === "" ||
        item.casesOrder[item.casesOrder.length - 1].case ===
          selectedCase.toLowerCase();
      const matchesFilter =
        filter === "" ||
        item.client.toLowerCase().includes(filter.toLowerCase()) ||
        item.placeDetails.toLowerCase().includes(filter.toLowerCase()) ||
        item.phoneAlternative.toLowerCase().includes(filter.toLowerCase()) ||
        item.phoneMain.toLowerCase().includes(filter.toLowerCase());

      return matchesCase && matchesFilter;
    });

  const HeaderFilters = () => {
    const orderCases = [
      "الكل",
      "مع الشحن",
      // "تم التوصيل",
      "تم الإسترجاع",
      "إسترجاع جزئي",
    ];

    return (
      <div className="w-full">
        <input
          className="w-[90%] input"
          type="text"
          placeholder=" بحث ..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <div className="flex flex-col gap-x-3 mt-6 items-center">
          <RadioGroup
            className="mb-8"
            orientation="horizontal"
            dir="ltr"
            color="warning"
            onValueChange={setSelectedCase}
          >
            {orderCases.map((caseStatus) => (
              <>
                <Radio
                  key={caseStatus}
                  value={caseStatus}
                  color="warning"
                  className="mr-6 sm:mr-1 max-sm:mr-1"
                >
                  <div className="flex flex-col items-center">
                    <p className="opacity-75">
                      {caseStatus === "الكل"
                        ? delieveryOrders.length
                        : delieveryOrders.filter(
                            (item) =>
                              item.casesOrder[item.casesOrder.length - 1]
                                .case === caseStatus
                          ).length}
                    </p>
                    <p>{caseStatus}</p>
                  </div>
                </Radio>
              </>
            ))}
          </RadioGroup>
        </div>
        <p className="text-center opacity-60 mb-2">
          Total {filteredOrders.length} Orders
        </p>
      </div>
    );
  };

  const BodyOrders = () => {
    return (
      <>
        {loading && (
          <div className="flex justify-center items-center w-full h-[400px]">
            <Spinner size="lg" color="success" />
          </div>
        )}

        {filteredOrders.length > 0 ? (
          filteredOrders.map((order, i) => {
            const isMatch =
              filter &&
              (order.client.toLowerCase().includes(filter.toLowerCase()) ||
                order.placeDetails
                  .toLowerCase()
                  .includes(filter.toLowerCase()) ||
                order.phoneAlternative
                  .toLowerCase()
                  .includes(filter.toLowerCase()) ||
                order.phoneMain.toLowerCase().includes(filter.toLowerCase()));

            return (
              <div key={i} className="mb-2">
                <div
                  className={`border p-4 rounded-lg ${
                    isMatch
                      ? "border-[var(--color-matg3er)]"
                      : "border-gray-200"
                  }`}
                  dir="rtl"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="mb-2">
                        الهواتف :
                        <Link
                          href={`tel:${order.phoneMain}`}
                          className="text-[var(--color-matg3er)] underline mx-1"
                        >
                          {order.phoneMain}
                        </Link>
                        |
                        <Link
                          href={`tel:${order.phoneAlternative}`}
                          className="mr-1 text-[var(--color-matg3er)] underline"
                        >
                          {order.phoneAlternative}
                        </Link>
                      </p>
                      <p>العنوان : {order.placeDetails}</p>
                      <p className="mt-2">العميل : {order.client}</p>
                      <p className="text-gray-500 my-2">
                        حالة الطلب :
                        {order.casesOrder[order.casesOrder.length - 1].case}
                      </p>
                      <div className="flex items-center justify-start text-gray-500">
                        منتجات الطبية :
                        {order.products &&
                          order.products.length > 0 &&
                          order.products.map((item, index) => (
                            <>
                              <Avatar
                                key={index}
                                src={item.imageProduct}
                                size="md"
                                className={`border-1 border-green-800 outline-2 outline-white relative -ml-2 ${
                                  index * 10
                                }`}
                                style={{
                                  zIndex: filteredOrders.length - index,
                                }}
                              />
                            </>
                          ))}
                      </div>
                      <div className="flex justify-start gap-x-3 space-x-2 mt-2">
                        {order.casesOrder[order.casesOrder.length - 1].case ===
                        "مع الشحن" ? (
                          <Link
                            href={`/delivery/orders/${order._id}`}
                            className="text-gray-700 py-1 rounded-lg underline"
                          >
                            ⋆ الدخول للطلبية
                          </Link>
                        ) : (
                          <p
                            onClick={() => {
                              Alert("error", "غير ممكن التعديل في تلك الطلبية");
                              new Audio("/mp3/errorEditingInOrder.mp3").play();
                            }}
                            className="text-gray-700 py-1 rounded-lg underline cursor-pointer"
                          >
                            ⋆ الدخول للطلبية
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col justify-between items-center gap-10">
                      <p>{order.company?.name}</p>
                      <div className="relative flex flex-col items-baseline justify-between">
                        <a href={`orders/chat/${order._id}`}>
                          <p className="hover:cursor-pointer hover:opacity-75 bg-yellow-200 p-3 w-14 h-14 flex justify-center items-center rounded-full border border-yellow-600 text-yellow-900">
                            <span>{Icons.ChatbubbleleftrightIcon}</span>
                          </p>
                          <span className="absolute top-0 right-0 bg-yellow-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                            {(order.chat &&
                              order.chat.length > 0 &&
                              order.chat.filter((item) => {
                                if (sessionData?.validity === "Admin")
                                  return !item.showAdmin;
                                if (sessionData?.validity === "Employ")
                                  return !item.showEmploy;
                                if (sessionData?.validity === "Delivery")
                                  return !item.showDelivery;
                                return !item.showUser;
                              }).length) ||
                              0}
                          </span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex justify-center items-center w-full h-[200px] opacity-65">
            غير موجودة هذة الطلبية
          </div>
        )}
      </>
    );
  };

  useEffect(() => {
    if (isInitialLoad.current && sessionData) {
      dispatch(
        fetchOrdersDelivery({
          dataReq: [
            "_id",
            "phoneMain",
            "phoneAlternative",
            "placeDetails",
            "client",
            "casesOrder",
            "date",
            "time",
            "products",
            "chat",
            "company",
          ],
          numberOrdersReq: 0,
          delivery: sessionData.email,
        })
      );
      isInitialLoad.current = false;
    }
  }, [dispatch, sessionData]);

  return (
    <div className="flex flex-col items-center bg-[var(--color-navbar)] min-h-screen w-full">
      <DataDelivery />
      <div className="bg-white rounded-ss-2xl rounded-se-2xl p-6 w-full pb-20">
        {HeaderFilters()}
        {BodyOrders()}
      </div>

      <Footer />
    </div>
  );
};

export default DeliveryPageOrders;
