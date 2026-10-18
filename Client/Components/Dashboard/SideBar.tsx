"use client";

// react
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Cookies from "js-cookie";

//component
import Icons from "@/iconsSvg";
import { Accordion, AccordionItem } from "@nextui-org/react";
import { LogOut, UserRoundCog, Users } from "lucide-react";
import Alert from "../Alert";

export default function SideBar() {
  const path = usePathname();
  const [sideBarColor, setSideBarColor] = useState("#F2F2F2");
  interface ItemProps {
    icon: any;
    nameItem: string;
    link: string;
  }

  const Item = ({ icon, nameItem, link }: ItemProps) => {
    return (
      <Link
        className="p-4 pl-5 opacity-90 mb-1 text-black text-sm flex justify-between items-center hover:font-bold hover:transform hover:scale-110 transition-transform duration-300 hover:cursor-pointer"
        href={link}
      >
        <div className="flex items-center">
          {icon}
          <p className="block hover:font-bold mr-3">{nameItem}</p>
        </div>
        <p
          className={`rotate-180 ${
            path === link.replace(/\/$/, "") ? "" : "hidden"
          }`}
        >
          {Icons.ForwardIcon}
        </p>
      </Link>
    );
  };

  const handleSignOut = () => {
    Cookies.remove("session");
    Alert("success", "تم تسجيل الخروج بنجاح");
    window.location.href = "/auth/signin";
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      setSideBarColor(localStorage.getItem("sideBarColor") || "#F2F2F2");
    }
  }, []);

  return (
    <>
      <div
        className={`h-screen overflow-y-auto custom-scrollbar`}
        style={{ backgroundColor: sideBarColor }}
        dir="rtl"
      >
        <div className="p-6 flex justify-center">
          <p className="text-xl text-center animate-slide-color">
            اللهم صلي وسلم علي سيدنا محمد
          </p>
        </div>
        <div className="w-[100%] h-10"></div>
        <div className="flex items-center justify-between">
          <div className="w-[35%] h-[1px] bg-slate-400"></div>
          <span className="text-slate-400">العمليات</span>
          <div className="w-[35%] h-[1px] bg-slate-400"></div>
        </div>
        <Item
          icon={Icons.HomeIcon}
          nameItem={"لوحة التحكم"}
          link={"/dashboard"}
        />
        <Item
          icon={Icons.MapIcon}
          nameItem={"الطلبيات"}
          link={"/dashboard/orders"}
        />
        <Item
          icon={Icons.ArrowtrendingdownIcon}
          nameItem={"عهدة التوصيل"}
          link={"/dashboard/deliverySecurity"}
        />
        <Accordion>
          <AccordionItem
            className="px-2"
            key="1"
            title={
              <div className="pl-5 opacity-90 mb-1 text-black text-sm flex justify-between items-center hover:font-bold hover:transform hover:scale-110 transition-transform duration-300 hover:cursor-pointer">
                <div className="flex items-center">
                  {Icons.BoltIcon}
                  <p className="block hover:font-bold mr-3">فريق العمل</p>
                </div>
              </div>
            }
          >
            <div className="w-[100%] overflow-x-hidden">
              <Item
                icon={<UserRoundCog strokeWidth={1} />}
                nameItem={"الأدمن "}
                link={"/dashboard/admins"}
              />
              <Item
                icon={<Users strokeWidth={1} />}
                nameItem={"الموظفين"}
                link={"/dashboard/employees"}
              />
              <Item
                icon={Icons.UsergroupIcon}
                nameItem={"عملاء"}
                link={"/dashboard/clients"}
              />
              <Item
                icon={Icons.ShoppingcartIcon}
                nameItem={"مندوبي التسويق"}
                link={"/dashboard/marketer"}
              />

              <Item
                icon={Icons.RocketlaunchIcon}
                nameItem={"مندوبي التوصيل"}
                link={"/dashboard/deliveries"}
              />
            </div>
          </AccordionItem>
        </Accordion>

        <div className="flex items-center justify-between">
          <div className="w-[35%] h-[1px] bg-slate-400"></div>
          <span className="text-slate-400">المنتجات</span>
          <div className="w-[35%] h-[1px] bg-slate-400"></div>
        </div>

        <Item
          icon={Icons.ProductsIcon}
          nameItem={"المنتجات"}
          link={"/dashboard/products"}
        />

        <Item
          icon={Icons.ListbulletIcon}
          nameItem={"الأقسام"}
          link={"/dashboard/categories"}
        />

        <Item
          icon={Icons.BuildingstorefrontIcon}
          nameItem={"المخازن"}
          link={"/dashboard/cities/"}
        />

        <div className="flex items-center justify-between">
          <div className="w-[35%] h-[1px] bg-slate-400"></div>
          <span className="text-slate-400">المالية</span>
          <div className="w-[35%] h-[1px] bg-slate-400"></div>
        </div>
        <Item
          icon={Icons.BuildinglibraryIcon}
          nameItem={"الخزينه"}
          link={"/dashboard/moneyTreasury"}
        />
        <Item
          icon={Icons.BanknotesIcon}
          nameItem={"طلبات السحب"}
          link={"/dashboard/withdrawReq"}
        />
        <Item
          icon={Icons.UsergroupIcon}
          nameItem={"الموردين"}
          link={"/dashboard/suppliers"}
        />
        <Item
          icon={Icons.ShoppingbagIcon}
          nameItem={"المشتريات"}
          link={"/dashboard/purchases"}
        />
        <Item
          icon={Icons.ArrowPathcon}
          nameItem={"تحويلات مالية"}
          link={"/dashboard/moneyTransfers"}
        />

        <div className="flex items-center justify-between">
          <div className="w-[35%] h-[1px] bg-slate-400"></div>
          <span className="text-slate-400">أخري</span>
          <div className="w-[35%] h-[1px] bg-slate-400"></div>
        </div>

        <Item
          icon={Icons.ComputerDesktopIcon}
          nameItem={"الكاشير"}
          link={"/dashboard/pos"}
        />

        <Item
          icon={Icons.SettingIcon}
          nameItem={"الإعدادت"}
          link={"/dashboard/settings/"}
        />

        <div
          onClick={handleSignOut}
          className="p-4 pl-5 cursor-pointer text-sm flex items-center text-red-500 hover:underline opacity-[0.7] rounded-2xl"
        >
          <LogOut strokeWidth={1.25} />
          <p className="mr-3">تسجيل خروج</p>
        </div>
      </div>
    </>
  );
}
