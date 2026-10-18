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

export default function DetailsMoney() {
  const dispatch = useDispatch<AppDispatch>();
  const isInitialLoad = useRef(true);
  const sessionData = useSessionData();
  const colorCompany = Cookies.get("colorPos");

  const { Money, loading, error } = useSelector(
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
          Total {Money.length} Money
        </p>
      </div>
    );
  };

  const HeaderTableMoney = () => {
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
          <p>الخصم</p>
        </div>
        <div className="w-[100%] flex justify-center text-black opacity-50">
          <p>الإجمالي</p>
        </div>
        <div className="w-[100%] flex justify-center text-black opacity-50">
          <p>الإجمالي بعد الخصم</p>
        </div>
      </div>
    );
  };

  const TableMoney = () => {
    return Money.slice()
      .reverse()
      .filter((item) =>
        item.CodeInvoice.toLowerCase().includes(searchKeyword.toLowerCase())
      )
      .map((item, i) => (
        <div
          key={i}
          dir="rtl"
          className="flex items-center mb-2 p-5 pr-10 pl-10 border-1 text-black"
        >
          <div className="w-[100%] flex justify-center opacity-80">
            <p>{item.CodeInvoice}</p>
          </div>
          <div className="w-[100%] flex justify-center opacity-80">
            <p>{item.date}</p>
          </div>
          <div className="w-[100%] flex justify-center opacity-80">
            <p>{item.time}</p>
          </div>
          <div className="w-[100%] flex justify-center opacity-80">
            <p>{item.discount} % </p>
          </div>
          <div className="w-[100%] flex justify-center opacity-80">
            <p>{item.totalPrice} د.ل </p>
          </div>
          <div
            className="w-[100%] flex justify-center opacity-80"
            style={{ color: colorCompany }}
          >
            <p>{item.totalPriceAfterDisount} د.ل </p>
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
            {Money.filter((item) =>
              item.CodeInvoice.toLowerCase().includes(
                searchKeyword.toLowerCase()
              )
            ).length > 0 ? (
              <>
                {HeaderFilters()}
                {HeaderTableMoney()}
                <div className="max-h-[40vh] overflow-y-auto">
                  {TableMoney()}
                </div>
              </>
            ) : (
              <p className=" w-full h-28 flex justify-center items-center col-span-full text-sm opacity-55">
                لا يوجد حركات مالية خالص .
              </p>
            )}
          </div>
        )}
      </div>
    </>
  );
}
