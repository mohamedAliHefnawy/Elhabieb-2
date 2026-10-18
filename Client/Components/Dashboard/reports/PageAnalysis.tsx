"use client";

import React from "react";

import ReportOrders from "@/Components/Dashboard/reports/charts/ReportOrders";
import ReportClients from "@/Components/Dashboard/reports/charts/ReportClients";
import ReportMarkter from "@/Components/Dashboard/reports/charts/ReportMarkter";
import ReportDelivery from "@/Components/Dashboard/reports/charts/ReportDelivery";
import ReportProducts from "@/Components/Dashboard/reports/charts/ReportProducts";
import ReportStores from "@/Components/Dashboard/reports/charts/ReportStores";

export default function PageAnalysis() {
  return (
    <>
      <div className="h-screen w-[100%] bg-[var(--color-body)] border-1 overflow-y-auto custom-scrollbar p-6 mt-1">
        <div dir="rtl">
          <p className="text-2xl">الطلبيات</p>
          <div className="my-10 mt-4 border-1 p-7">
            <ReportOrders />
          </div>
          <p className="mt-14 text-2xl">الأعضاء</p>
          <div className=" my-10 mt-4 border-1 p-7">
            <div className="flex">
              <ReportClients />
              <ReportMarkter />
            </div>
            <div className="mt-8">
              <ReportDelivery />
            </div>
          </div>
          <p className="mt-14 text-2xl">المنتجات</p>
          <div className="my-10 mt-4 border-1 p-7">
            <ReportProducts />
          </div>
          <p className="mt-14 text-2xl">المخازن</p>
          <div className="my-10 mt-4 border-1 p-7">
            <ReportStores />
          </div>
        </div>
      </div>
    </>
  );
}
