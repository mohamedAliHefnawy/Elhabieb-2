"use client";

// REACT
import { Newspaper, Heart, House, Wallet, ShoppingCart } from "lucide-react";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

// COMPONENTS & STORE
import getSessionData, { SessionData } from "@/contexts/SessionContext";
import useSessionData from "@/hooks/useSessionData";

const Footer = () => {
  const sessionData = useSessionData();
  const path = usePathname();

  const Item = (icon: any, name: string, link: string) => {
    return (
      <Link
        href={link}
        className="flex flex-col items-center hover:cursor-pointer"
      >
        <p className="text-2xl">{icon}</p>
        <p className="mt-1 text-center text-sm">{name}</p>
      </Link>
    );
  };

  return (
    <div
      className={`fixed xl:hidden lg:hidden md:hidden sm:flex max-sm:flex z-50 bottom-0 w-full py-2 pt-3 flex items-center bg-slate-50 border-1 border-blue-200`}
    >
      <div className="flex flex-grow justify-around">
        {sessionData?.validity === "Markter" && (
          <div className="flex-none w-1/5 flex flex-col items-center hover:cursor-pointer">
            <Link
              className={`flex flex-col items-center ${
                path === "/wallet"
                  ? "text-[var(--color-matg3er)]"
                  : "text-gray-600"
              }`}
              href={"/wallet"}
            >
              <Wallet strokeWidth={1.25} absoluteStrokeWidth />
              <span className="text-sm mt-1">المحفظة</span>
            </Link>
          </div>
        )}
        <div className="flex-none w-1/5 flex flex-col items-center hover:cursor-pointer">
          <Link
            className={`flex flex-col items-center ${
              path === "/cart" ? "text-[var(--color-matg3er)]" : "text-gray-600"
            }`}
            href={"/cart"}
          >
            <ShoppingCart strokeWidth={1.25} absoluteStrokeWidth />
            <span className="text-sm mt-1">السلة</span>
          </Link>
        </div>
        <div className="flex-none w-1/5 flex flex-col items-center hover:cursor-pointer border-b-2 border-transparent ">
          <Link
            className={`flex flex-col items-center  ${
              path === "/" ? "text-[var(--color-matg3er)]" : "text-gray-600"
            }`}
            href={"/"}
          >
            <House strokeWidth={1.25} absoluteStrokeWidth />
            <span className="text-sm mt-1">الرئيسية</span>
          </Link>
        </div>
        <div className="flex-none w-1/5 flex flex-col items-center hover:cursor-pointer">
          <Link
            className={`flex flex-col items-center ${
              path.startsWith("/fav")
                ? "text-[var(--color-matg3er)]"
                : "text-gray-600"
            }`}
            href={"/fav"}
          >
            <Heart strokeWidth={1.25} absoluteStrokeWidth />
            <span className="text-sm mt-1">المفضلة</span>
          </Link>
        </div>
        <div className="flex-none w-1/5 flex flex-col items-center hover:cursor-pointer">
          <Link
            className={`flex flex-col items-center ${
              path.startsWith("/orders")
                ? "text-[var(--color-matg3er)]"
                : "text-gray-600"
            }`}
            href={"/orders"}
          >
            <Newspaper strokeWidth={1.25} absoluteStrokeWidth />
            <span className="text-sm mt-1">الطلبيات</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Footer;
