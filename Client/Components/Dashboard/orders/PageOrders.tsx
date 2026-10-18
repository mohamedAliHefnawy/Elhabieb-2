"use client";

// REACT
import React, { useEffect, useRef, useState } from "react";

// NEXT UI
import { Spinner, Radio, RadioGroup } from "@nextui-org/react";

import Icons from "@/iconsSvg";
import Link from "next/link";
import { AppDispatch, RootState } from "@/src/store";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders } from "@/features/ordersSlice";
import Alert from "@/Components/Alert";
import getSessionData, { SessionData } from "@/contexts/SessionContext";
import ModelShowDataDelivery from "@/Components/Orders/ModelShowDataDelivery";
import useSessionData from "@/hooks/useSessionData";

const PageOrders = () => {
  const dispatch = useDispatch<AppDispatch>();
  const isInitialLoad = useRef(true);

  const { Orders, loading } = useSelector((state: RootState) => state.order);
  const [filter, setFilter] = useState("");
  const [selectedCase, setSelectedCase] = useState<string>("الكل");
  const sessionData = useSessionData();

  const filteredOrders = Orders.filter((item) => {
    const matchesCase =
      selectedCase === "الكل" ||
      selectedCase === "" ||
      item.casesOrder[item.casesOrder.length - 1].case ===
        selectedCase.toLowerCase();
    const matchesFilter =
      filter === "" ||
      item.client.toLowerCase().includes(filter.toLowerCase()) ||
      item.phoneMain.toLowerCase().includes(filter.toLowerCase());

    return matchesCase && matchesFilter;
  });

  const ItemRadio = (nameItem: string, value: number) => {
    return (
      <Radio
        className="mr-6 sm:mr-1 max-sm:mr-1"
        value={nameItem}
        color="success"
      >
        <div className="flex flex-col items-center">
          <p>{value}</p>
          <p>{nameItem}</p>
        </div>
      </Radio>
    );
  };

  const HeaderFilters = () => {
    return (
      <div className="w-[100%]">
        <input
          className="w-[90%] input"
          type="text"
          placeholder=" بحث ..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />

        <div className="flex flex-col gap-3 mt-6 items-center">
          <RadioGroup
            className="mb-8"
            orientation="horizontal"
            dir="ltr"
            onValueChange={setSelectedCase}
          >
            <Radio
              className="mr-6 sm:mr-1 max-sm:mr-1"
              value="الكل"
              color="success"
            >
              <div className="flex flex-col items-center">
                <p>{Orders.length}</p>
                <p>الكل</p>
              </div>
            </Radio>
            {ItemRadio(
              "في إنتظار الموافقة",
              Orders.filter(
                (item) =>
                  item.casesOrder[item.casesOrder.length - 1].case ===
                  "في إنتظار الموافقة"
              ).length
            )}
            {ItemRadio(
              "تم القبول",
              Orders.filter(
                (item) =>
                  item.casesOrder[item.casesOrder.length - 1].case ===
                  "تم القبول"
              ).length
            )}
            {ItemRadio(
              "تم الرفض",
              Orders.filter(
                (item) =>
                  item.casesOrder[item.casesOrder.length - 1].case ===
                  "تم الرفض"
              ).length
            )}
            {ItemRadio(
              "مع الشحن",
              Orders.filter(
                (item) =>
                  item.casesOrder[item.casesOrder.length - 1].case ===
                  "مع الشحن"
              ).length
            )}
            {ItemRadio(
              "تم التوصيل",
              Orders.filter(
                (item) =>
                  item.casesOrder[item.casesOrder.length - 1].case ===
                  "تم التوصيل"
              ).length
            )}
            {ItemRadio(
              "تم الإسترجاع",
              Orders.filter(
                (item) =>
                  item.casesOrder[item.casesOrder.length - 1].case ===
                  "تم الإسترجاع"
              ).length
            )}
            {ItemRadio(
              "إسترجاع جزئي",
              Orders.filter(
                (item) =>
                  item.casesOrder[item.casesOrder.length - 1].case ===
                  "إسترجاع جزئي"
              ).length
            )}
            {ItemRadio(
              "تم إستلام الكاش",
              Orders.filter(
                (item) =>
                  item.casesOrder[item.casesOrder.length - 1].case ===
                  "تم إستلام الكاش"
              ).length
            )}
          </RadioGroup>
        </div>
        <p>Total {Orders.length} Orders </p>
      </div>
    );
  };

  const HeaderTableOrders = () => {
    return (
      <div
        className="flex items-center mt-4 mb-5 p-4 pr-10 pl-10 bg-[var(--color-body)] shadow-lg shadow-[var(--color-navbar)] rounded-2xl text-black opacity-75"
        dir="rtl"
      >
        <div className="w-[100%] flex justify-center text-black opacity-50">
          <p>إسم العميل</p>
        </div>
        <div className="w-[100%] flex justify-center text-black opacity-50">
          <p>رقم الهاتف</p>
        </div>
        <div className="w-[100%] flex justify-center text-black opacity-50">
          <p>العنوان</p>
        </div>
        <div className="w-[100%] flex justify-center text-black opacity-50">
          <p>مندوب التسويق</p>
        </div>
        <div className="w-[100%] flex justify-center text-black opacity-50">
          <p>مندوب التوصيل</p>
        </div>
        <div className="w-[100%] flex justify-center text-black opacity-50">
          <p>الحالة</p>
        </div>
        <div className="w-[100%] flex justify-center text-black opacity-50">
          <p>chatRoom</p>
        </div>

        <div className="w-[10%] flex justify-center text-black opacity-50">
          -
        </div>
      </div>
    );
  };

  const TableOrders = () => {
    return filteredOrders
      .slice()
      .reverse()
      .map((order, i) => (
        <div
          key={i}
          className="flex items-center mb-2 p-4 pr-10 pl-10 bg-[var(--color-body)] shadow-lg rounded-2xl border-1 border-[var(--color-navbar)] text-black"
        >
          <div className="w-[100%] flex flex-col items-center justify-center">
            <Link
              className="hover:cursor-pointer border-b border-black text-[var(--ColorText)]"
              href={`orders/${order._id}`}
            >
              {order.client}
            </Link>
          </div>

          <div className="w-[100%] flex justify-center opacity-90">
            <Link
              href={`tel:${order.phoneMain}`}
              className="text-blue-500 underline"
            >
              {order.phoneMain}
            </Link>
          </div>

          <div className="w-[100%] flex justify-center opacity-90">
            <p>{order.city}</p>
          </div>
          <div className="w-[100%] flex justify-center opacity-90">
            <p className="flex">
              <span>{order.markter.split("@")[0]}</span>
            </p>
          </div>
          <div className="w-[100%] flex justify-center opacity-90" dir="ltr">
            {order.delivery ? (
              <ModelShowDataDelivery delivery={order.delivery} />
            ) : (
              <>لا يوجد بعد!</>
            )}
          </div>
          <div className="w-[100%] flex justify-center opacity-90">
            {["تم الرفض", "تم الإسترجاع", "تم إستلام الكاش"].includes(
              order.casesOrder[order.casesOrder.length - 1].case
            ) ? (
              <p
                onClick={() => {
                  Alert("error", "غير ممكن التعديل في تلك الطلبية");
                  new Audio("/mp3/errorEditingInOrder.mp3").play();
                }}
                className={`cursor-pointer underline ${
                  (order.casesOrder[order.casesOrder.length - 1].case ===
                    "في إنتظار الموافقة" &&
                    "text-orange-500") ||
                  (order.casesOrder[order.casesOrder.length - 1].case ===
                    "تم القبول" &&
                    "text-green-500") ||
                  (order.casesOrder[order.casesOrder.length - 1].case ===
                    "تم التوصيل" &&
                    "text-green-500") ||
                  (order.casesOrder[order.casesOrder.length - 1].case ===
                    "تم إستلام الكاش" &&
                    "text-green-500") ||
                  (order.casesOrder[order.casesOrder.length - 1].case ===
                    "تم الرفض" &&
                    "text-red-500") ||
                  (order.casesOrder[order.casesOrder.length - 1].case ===
                    "تم الإسترجاع" &&
                    "text-red-500") ||
                  (order.casesOrder[order.casesOrder.length - 1].case ===
                    "إسترجاع جزئي" &&
                    "text-red-500")
                }`}
              >
                {order.casesOrder[order.casesOrder.length - 1].case}
              </p>
            ) : (
              <Link
                href={`orders/edit/${order._id}`}
                className={` underline ${
                  (order.casesOrder[order.casesOrder.length - 1].case ===
                    "في إنتظار الموافقة" &&
                    "text-orange-500") ||
                  (order.casesOrder[order.casesOrder.length - 1].case ===
                    "تم القبول" &&
                    "text-green-500") ||
                  (order.casesOrder[order.casesOrder.length - 1].case ===
                    "تم التوصيل" &&
                    "text-green-500") ||
                  (order.casesOrder[order.casesOrder.length - 1].case ===
                    "تم إستلام الكاش" &&
                    "text-green-500") ||
                  (order.casesOrder[order.casesOrder.length - 1].case ===
                    "تم الرفض" &&
                    "text-red-500") ||
                  (order.casesOrder[order.casesOrder.length - 1].case ===
                    "تم الإسترجاع" &&
                    "text-red-500") ||
                  (order.casesOrder[order.casesOrder.length - 1].case ===
                    "إسترجاع جزئي" &&
                    "text-red-500")
                }`}
              >
                {order.casesOrder[order.casesOrder.length - 1].case}
              </Link>
            )}
          </div>
          <div className="w-[100%] flex flex-col justify-center items-center opacity-75">
            <div className="relative">
              <a href={`orders/chat/${order._id}`}>
                <p className="hover:cursor-pointer hover:opacity-75 bg-yellow-200 p-3 w-14 h-14 flex justify-center items-center rounded-full border border-yellow-600 text-yellow-900">
                  <span>{Icons.ChatbubbleleftrightIcon}</span>
                </p>
                <span className="absolute top-0 right-0 bg-yellow-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                  {
                    order.chat.filter((item) => {
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

            <div className="flex relative bottom-1">
              <Link href={`orders/Print/${order._id}`}>
                <p className="ml-[2px] hover:cursor-pointer hover:opacity-75 bg-orange-200 p-3 rounded-full border-1 border-orange-600 text-orange-900">
                  {Icons.PrinterIcon}
                </p>
              </Link>
              <Link href={`orders/QrCode/${order._id}`}>
                <p className="hover:cursor-pointer hover:opacity-75 bg-green-200 p-3 rounded-full border-1 border-green-600 text-green-900">
                  {Icons.QrCodeIcon}
                </p>
              </Link>
            </div>
          </div>
        </div>
      ));
  };

  useEffect(() => {
    if (isInitialLoad.current) {
      dispatch(fetchOrders());
      isInitialLoad.current = false;
    }
  }, [dispatch]);

  return (
    <div className="h-screen w-[100%] bg-[var(--color-body)] border-1  overflow-y-auto custom-scrollbar p-6 mt-1">
      <div className="mt-3 text-black opacity-60 text-sm text-center">
        {HeaderFilters()}
      </div>

      {HeaderTableOrders()}

      <div dir="rtl">
        {loading ? (
          <div className="flex justify-center items-center h-[400px]">
            <Spinner size="lg" color="success" />
          </div>
        ) : (
          <div>{TableOrders()}</div>
        )}
      </div>

      {filteredOrders.length === 0 && (
        <p className="w-[100%] flex justify-center mt-20 opacity-60">
          لا يوجد طلبيات
        </p>
      )}
    </div>
  );
};

export default PageOrders;
