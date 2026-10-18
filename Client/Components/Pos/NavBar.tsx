"use client";

// REACT
import React, { useEffect, useState } from "react";

// NEXT UI
import { Avatar, Input } from "@nextui-org/react";

// IMAGES
import hefnawy from "@/public/images/hefnayw.jpeg";

// ICONS
import { Search } from "lucide-react";
import getSessionData, { SessionData } from "@/contexts/SessionContext";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/src/store";
import { setSearchKeyword } from "@/features/pos";
import useSessionData from "@/hooks/useSessionData";

export default function NavBar() {
  const sessionData = useSessionData();

  const dispatch = useDispatch();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const keyword = e.target.value;
    dispatch(setSearchKeyword(keyword));
  };

  return (
    <div className="w-full bg-white ml-[2px] p-2 border-1 rounded-es-3xl flex items-center gap-x-3">
      <Input
        type="text"
        label="َ"
        placeholder="Search ..."
        startContent={<Search size={28} strokeWidth={1} key={4} />}
        className="text-center rounded-3xl"
        onChange={handleSearch}
      />
      <div className="flex w-[25%]">
        <div className="text-right mr-2">
          <p dir="rtl">مرحبا , {sessionData?.email.split("@")[0]}</p>
          <p className="text-sm opacity-70">pos</p>
        </div>
        <Avatar src={hefnawy.src} className="w-12 h-12" />
      </div>
    </div>
  );
}
