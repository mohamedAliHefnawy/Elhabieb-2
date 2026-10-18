"use client";

// REACT
import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

// ICONS
import {
  LampDesk,
  LayoutPanelLeft,
  Newspaper,
  Wallet,
  Component,
  Power,
  Settings,
  Store,
} from "lucide-react";
import Alert from "../Alert";

export default function SideBar() {
  const path = usePathname();
  const router = useRouter();
  const colorCompany = Cookies.get("colorPos");

  const Items = [
    {
      icon: <LampDesk size={28} strokeWidth={1} key={0} />,
      link: "/pos",
      title: "Home",
    },
    {
      icon: <Component size={28} strokeWidth={1} key={1} />,
      link: "/pos/catogries",
      title: "الأقسام",
    },
    {
      icon: <LayoutPanelLeft size={28} strokeWidth={1} key={2} />,
      link: "/pos/products",
      title: "المنتجات",
    },
    {
      icon: <Wallet size={28} strokeWidth={1} key={3} />,
      link: "/pos/moneyTreasury",
      title: "الخزينة",
    },
    {
      icon: <Newspaper size={28} strokeWidth={1} key={4} />,
      link: "/pos/orders",
      title: "الطلبيات",
    },
    {
      icon: <Store size={28} strokeWidth={1} key={5} />,
      link: "/pos/store",
      title: "المخزن",
    },
  ];

  const handleSignOut = () => {
    Cookies.remove("session");
    Alert("success", "تم تسجيل الخروج بنجاح");
    new Audio("/mp3/logOut.mp3").play();
    router.push("/auth/signin");
  };

  return (
    <div className="bg-white py-16 h-screen border-1 rounded-se-3xl">
      {Items.map((item, key) => (
        <Link
          key={key}
          href={item.link}
          className={`flex flex-col items-center p-5 ${
            path === item.link ||
            (item.link !== "/pos" && path.startsWith(item.link))
              ? "border-r-2"
              : "opacity-75"
          }`}
          style={{
            color:
              path === item.link ||
              (item.link !== "/pos" && path.startsWith(item.link))
                ? colorCompany
                : undefined,
            borderColor:
              path === item.link ||
              (item.link !== "/pos" && path.startsWith(item.link))
                ? colorCompany
                : undefined,
          }}
        >
          <p>{item.icon}</p>
          <p>{item.title}</p>
        </Link>
      ))}

      <div className="fixed bottom-4 text-center p-9 text-red-500 cursor-pointer">
        <p onClick={handleSignOut}>
          <Power size={28} strokeWidth={1} />
        </p>
      </div>
    </div>
  );
}
