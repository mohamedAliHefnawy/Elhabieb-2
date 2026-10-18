"use client";

import getSessionData, { SessionData } from "@/contexts/SessionContext";
import Icons from "@/iconsSvg";
import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import Alert from "../Alert";
import Cookies from "js-cookie";
import useSessionData from "@/hooks/useSessionData";

export default function DataDelivery() {
  const sessionData = useSessionData();

  const handleSignOut = () => {
    Cookies.remove("session");
    Alert("success", "تم تسجيل الخروج بنجاح");
    window.location.href = "/auth/signin";
  };

  return (
    <div className="bg-white p-6 w-full mb-6 border-1">
      <div className="flex items-center space-x-4">
        <img
          className="w-20 h-20 rounded-full object-cover"
          src={sessionData?.image}
          alt="Driver Profile"
        />
        <div>
          <h2 className="text-xl font-bold">
            <Popover placement="bottom" showArrow={true}>
              <PopoverTrigger className={` cursor-pointer`}>
                <p className="flex gap-x-2">
                  <span dir="rtl">{sessionData?.email.split("@")[0]}</span>
                  <span className="pt-1">{Icons.ChevrondownIcon}</span>
                </p>
              </PopoverTrigger>
              <PopoverContent>
                <div
                  onClick={handleSignOut}
                  className="px-1 py-2 text-red-600 flex items-center cursor-pointer"
                >
                  <p>تسجيل خروج </p>
                  <p>{Icons.LogoutIcon}</p>
                </div>
              </PopoverContent>
            </Popover>
          </h2>
          <p className="text-gray-500 my-1">
            رقم الهاتف : {sessionData?.phone}
          </p>
          <div className="flex items-center text-yellow-500">
            <span>⭐⭐⭐⭐☆</span>
            <span className="ml-2 text-gray-500">(25 تقييم)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
