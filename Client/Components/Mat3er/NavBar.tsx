"use client";

import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Heart,
  LampDesk,
  Newspaper,
  ShoppingCart,
  UserRoundCog,
  Wallet,
} from "lucide-react";

import Icons from "@/iconsSvg";
import SideBar from "@/Components/Mat3er/SideBar";
import { AppDispatch } from "@/src/store";
import { fetchProductsInCartUser } from "@/features/cartSlice";
import Alert from "@/Components/Alert";
import { fetchProductsInFavUser } from "@/features/favSlice";

import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/react";
import useSessionData from "@/hooks/useSessionData";

const NavBar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const isInitialLoad = useRef(true);
  const router = useRouter();
  const path = usePathname();
  const sessionData = useSessionData();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isInitialLoad.current && sessionData?.email) {
      dispatch(fetchProductsInCartUser(sessionData.email));
      dispatch(fetchProductsInFavUser(sessionData.email));
      isInitialLoad.current = false;
    }
  }, [dispatch, sessionData?.email]);

  const handleSignOut = async () => {
    try {
      await fetch("/api/logout", {
        method: "POST",
      });
      Alert("success", "تم تسجيل الخروج بنجاح");
      new Audio("/mp3/logOut.mp3").play();
      router.push("/auth/signin");
    } catch (err) {
      console.error("فشل تسجيل الخروج", err);
      Alert("error", "فشل تسجيل الخروج، حاول مرة أخرى");
    }
  };

  const AnimatedBorderLink = (Icon: any, link: string, title: string) => (
    <Link
      href={link}
      className={`relative mr-8 flex items-center gap-x-2 ${
        !isScrolled && !path.startsWith("/orders/chat")
          ? "text-[var(--color-matg3er)]"
          : "text-white"
      } hover:opacity-75 after:content-[''] after:bg-[var(--color-matg3er)] after:transition-all after:duration-300 hover:after:w-full`}
    >
      <p>{title}</p>
      <p>{Icon}</p>
    </Link>
  );

  return (
    <div
      className={`flex justify-evenly items-center py-4 fixed z-50 w-full transition-all duration-300`}
      style={{
        backgroundColor:
          isScrolled || path.startsWith("/orders/chat")
            ? "var(--color-matg3er-rgb)"
            : "transparent",
      }}
    >
      <div className="hover:cursor-pointer">
        <SideBar />
      </div>

      <div className="xl:flex lg:flex md:flex sm:hidden max-sm:hidden justify-center items-center">
        {AnimatedBorderLink(Icons.SearchIcon, "/", "")}
        {AnimatedBorderLink(
          <LampDesk size={28} strokeWidth={1} />,
          "/",
          "الرئيسية"
        )}
        {AnimatedBorderLink(
          <Heart size={28} strokeWidth={1} />,
          "/fav",
          "المفضلة"
        )}
        {sessionData?.validity === "Markter" &&
          AnimatedBorderLink(
            <Wallet size={28} strokeWidth={1} />,
            "/wallet",
            "المحفظة"
          )}
        {AnimatedBorderLink(
          <Newspaper strokeWidth={1.25} absoluteStrokeWidth />,
          "/orders",
          "الطلبيات"
        )}
        {AnimatedBorderLink(
          <ShoppingCart size={28} strokeWidth={1} />,
          "/cart",
          "السلة"
        )}
      </div>

      {sessionData ? (
        <Popover placement="bottom" showArrow={true}>
          <PopoverTrigger
            className={`cursor-pointer ${
              !isScrolled && !path.startsWith("/orders/chat")
                ? "text-[var(--color-matg3er)]"
                : "text-white"
            }`}
          >
            <p className="flex gap-x-2">
              <span dir="rtl">مرحباَ بك {sessionData.email.split("@")[0]}</span>
              <span>{Icons.ChevrondownIcon}</span>
            </p>
          </PopoverTrigger>
          <PopoverContent className="flex flex-col items-end">
            <Link
              className="px-1 py-2 flex items-center justify-end cursor-pointer"
              href={"/Profile"}
            >
              <p>حسابي</p>
              <p className="ml-2">
                <UserRoundCog strokeWidth={1.25} />
              </p>
            </Link>
            <div
              onClick={handleSignOut}
              className="px-1 py-2 text-red-600 flex items-center justify-end cursor-pointer"
            >
              <p>تسجيل خروج</p>
              <p>{Icons.LogoutIcon}</p>
            </div>
          </PopoverContent>
        </Popover>
      ) : (
        <Link
          href="/auth/signin"
          className={`flex items-center gap-x-2 cursor-pointer ${
            !isScrolled ? "text-[var(--color-matg3er)]" : "text-white"
          }`}
        >
          <span>تسجيل الدخول</span>
          <span>{Icons.ChevrondownIcon}</span>
        </Link>
      )}
    </div>
  );
};

export default NavBar;
