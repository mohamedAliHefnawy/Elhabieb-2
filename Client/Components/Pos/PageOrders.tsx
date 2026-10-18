"use client";

// REACT
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DNA } from "react-loader-spinner";
import Cookies from "js-cookie";

// COMPONENTS & STORE
import { RootState, AppDispatch } from "@/src/store";
import Link from "next/link";
import Alert from "../Alert";
import { fetchOrdersPos } from "@/features/posSlice";
import getSessionData, { SessionData } from "@/contexts/SessionContext";
import { EyeClosed, PencilRuler, Pipette } from "lucide-react";
import ModelShowProductsOrder from "./ModelShowProductsOrder";
import useSessionData from "@/hooks/useSessionData";

// NEXT UI

export default function PageOrders() {
  const dispatch = useDispatch<AppDispatch>();
  const isInitialLoad = useRef(true);
  const sessionData = useSessionData();
  const colorCompany = Cookies.get("colorPos");

  const { Orders, loading, error } = useSelector(
    (state: RootState) => state.pos2
  );
  const { searchKeyword } = useSelector((state: RootState) => state.pos);

  if (error) {
    Alert("error", "توجد مشكلة في الإنترنت حاول تنشيط الصفحة");
    new Audio("/mp3/proplemInternet.mp3").play();
    return;
  }

  const HeaderFilters = () => {
    return (
      <div className="w-[100%]">
        <p className="text-center opacity-55 mt-4 mb-2">
          Total {Orders.length} Orders{" "}
        </p>
      </div>
    );
  };

  const HeaderTableOrders = () => {
    return (
      <div
        className={`flex items-center mt-4 mb-5 p-6 pr-10 pl-10 border-1 rounded-3xl rounded-es-none rounded-ee-none text-black opacity-85`}
        dir="rtl"
        style={{ borderColor: colorCompany }}
      >
        <div className="w-[100%] flex justify-center text-black opacity-50">
          <p># كود الفاتورة</p>
        </div>
        <div className="w-[100%] flex justify-center text-black opacity-50">
          <p>التاريخ</p>
        </div>
        <div className="w-[100%] flex justify-center text-black opacity-50">
          <p>الوقت</p>
        </div>
        <div className="w-[100%] flex justify-center text-black opacity-50">
          <p>المنتجات</p>
        </div>
        <div className="w-[100%] flex justify-center text-black opacity-50">
          <p>الخصم</p>
        </div>
        <div className="w-[100%] flex justify-center text-black opacity-50">
          <p>الإجمالي</p>
        </div>
        <div className="w-[100%] flex justify-center text-black opacity-50">
          <p>الإجمالي بعد الخصم</p>
        </div>
        <div className="w-[100%] flex justify-center text-black opacity-50">
          <p>حالة الطلبية</p>
        </div>
        <div className="w-[100%] flex justify-center text-black opacity-50">
          <p>-</p>
        </div>
      </div>
    );
  };

  const TableOrders = () => {
    return Orders.slice()
      .reverse()
      .filter((order) =>
        order.CodeInvoice.toLowerCase().includes(searchKeyword.toLowerCase())
      )
      .map((order, i) => (
        <div
          key={i}
          dir="rtl"
          className="flex items-center mb-2 p-5 pr-10 pl-10 border-1 text-black"
        >
          <div className="w-[100%] flex justify-center opacity-80">
            <p>{order.CodeInvoice}</p>
          </div>
          <div className="w-[100%] flex justify-center opacity-80">
            <p>{order.dateInvoice}</p>
          </div>
          <div className="w-[100%] flex justify-center opacity-80">
            <p>{order.timeInvoice}</p>
          </div>
          <div className="w-[100%] flex justify-center opacity-80">
            <ModelShowProductsOrder
              products={order.products}
              codeInvoice={order.CodeInvoice}
              store={order.store}
            />
          </div>
          <div className="w-[100%] flex justify-center opacity-80">
            <p>{order.discount} % </p>
          </div>
          <div className="w-[100%] flex justify-center opacity-80">
            <p>{order.totalPrice} د.ل </p>
          </div>
          <div
            className="w-[100%] flex justify-center opacity-80"
            style={{ color: colorCompany }}
          >
            <p>{order.totalPriceAfterDisount} د.ل </p>
          </div>
          <div
            className="w-[100%] flex justify-center"
            style={{ color: colorCompany }}
          >
            {order.status === "InPos" && (
              <p className="text-orange-500">في الكاشير</p>
            )}
            {order.status === "InAdmin" && (
              <p className="text-green-500">في الأدمن</p>
            )}
            {order.status === "ReturnedAll" && (
              <p className="text-red-500">راجع كلي</p>
            )}
            {order.status === "ReturnedPartial" && (
              <p className="text-red-500">راجع جزئي</p>
            )}
          </div>
          <div className="w-[100%] flex justify-center opacity-50">
            <Link href={`/pos/orders/edit/${order.CodeInvoice}`}>
              <PencilRuler strokeWidth={1} />
            </Link>
          </div>
        </div>
      ));
  };

  useEffect(() => {
    if (isInitialLoad.current && sessionData) {
      dispatch(fetchOrdersPos(sessionData?.email as string));
      isInitialLoad.current = false;
    }
  }, [dispatch, sessionData]);

  return (
    <>
      <div className="px-5 pt-1">
        {loading ? (
          <div className="flex items-center justify-center min-h-screen">
            <DNA
              visible={true}
              height="80"
              width="80"
              ariaLabel="dna-loading"
              wrapperStyle={{}}
              wrapperClass="dna-wrapper"
            />
          </div>
        ) : (
          <div className="w-full mb-20">
            {Orders.filter((order) =>
              order.CodeInvoice.toLowerCase().includes(
                searchKeyword.toLowerCase()
              )
            ).length > 0 ? (
              <>
                {HeaderFilters()}
                {HeaderTableOrders()}
                <div className="max-h-[70vh] overflow-y-auto">
                  {TableOrders()}
                </div>
              </>
            ) : (
              <p className=" w-full h-screen flex justify-center items-center col-span-full text-sm opacity-55">
                لا يوجد طلبيات خالص .
              </p>
            )}
          </div>
        )}
      </div>
    </>
  );
}
