"use client";

import React, { useEffect, useRef, useState } from "react";
import DataDelivery from "@/Components/Delivery/DataDelivery";
import Footer from "@/Components/Delivery/Footer";
import { AppDispatch, RootState } from "@/src/store";
import { useDispatch } from "react-redux";
import useSessionData from "@/hooks/useSessionData";

const DeliveryPageSettings = () => {
  const sessionData = useSessionData();

  const Body = () => {
    return (
      <div className="container mx-auto max-w-2xl">
        <div className="h-screen w-full flex flex-col justify-center items-center overflow-y-auto custom-scrollbar p-6 mt-1">
          <div className="mb-3 text-3xl">
            <p className="mb-4">{sessionData?.email.split("@")[0]}</p>
            <p> -ˏˋ⋆ ᴡ ᴇ ʟ ᴄ ᴏ ᴍ ᴇ ⋆ˊˎ-</p>
          </div>
          <p>ما زال العمل علي تلك الصفحة </p>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center bg-[var(--color-navbar)] min-h-screen w-full">
      <DataDelivery />
      <div className="bg-white rounded-ss-2xl rounded-se-2xl p-6 w-full h-screen pb-20">
        {Body()}
      </div>
      <Footer />
    </div>
  );
};

export default DeliveryPageSettings;
