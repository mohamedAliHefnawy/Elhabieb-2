"use client";

import React from "react";
import QRScanner from "@/Components/Delivery/scannner";
import DataDelivery from "@/Components/Delivery/DataDelivery";
import Orders3 from "@/Components/Delivery/Orders3";
import Footer from "@/Components/Delivery/Footer";
import useSessionData from "@/hooks/useSessionData";

const DeliveryPage = () => {
  const sessionData = useSessionData();

  return (
    <div className="flex flex-col items-center bg-[var(--color-navbar)] min-h-screen w-full">
      <DataDelivery />
      <div className="bg-white shadow-sm rounded-full p-4 px-6 w-full mb-6 flex justify-between items-center">
        <p className="text-lg">scanner to order</p>
      </div>
      <QRScanner user={sessionData?.email || ""} />
      <div className="pb-20 w-[100%]">
        <Orders3 />
      </div>
      <Footer />
    </div>
  );
};

export default DeliveryPage;
