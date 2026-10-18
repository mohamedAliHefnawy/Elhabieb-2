"use client";

// react
import { useEffect, useState } from "react";

// nextUi
import {
  Tooltip,
  User,
  Spinner,
  Badge,
  PopoverContent,
  Popover,
  PopoverTrigger,
} from "@nextui-org/react";

// svgIcons
import Icons from "@/iconsSvg";
import getSessionData, { SessionData } from "@/contexts/SessionContext";
import useSessionData from "@/hooks/useSessionData";

export default function NavBar() {
  const sessionData = useSessionData();
  const [navBarColor, setNavBarColor] = useState("#F2F2F2");

  const notif = () => {
    return (
      <>
        <div className=" text-white text-sm flex items-center justify-between pr-5 hover:font-bold hover:cursor-pointer hover:transform hover:scale-110 transition-transform duration-300">
          <Popover className="w-[1000px]" placement="right" backdrop="blur">
            <PopoverTrigger>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <Badge color="success" content={2} shape="circle">
                    <span className="text-black">{Icons.BellalertIcon}</span>
                  </Badge>
                </div>
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-[100%] flex flex-col justify-start items-end max-h-[500px] min-h-96 overflow-y-auto  P-4 py-6">
              <div className="w-[100%] h-96 text-lg flex justify-center items-center">
                لا يوجد أي إشعارات
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </>
    );
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      setNavBarColor(localStorage.getItem("navBarColor") || "#F2F2F2");
    }
  }, []);
  return (
    <>
      <div
        className="flex justify-between items-center w-[100%] h-[60px]"
        style={{ direction: "ltr", backgroundColor: navBarColor }}
      >
        <div className="flex justify-start items-center w-[35%] h-[60px] pl-6 ">
          <span className="text-black opacity-90 font-bold text-xl mr-5">
            Dashboard
          </span>
        </div>

        <div className="mr-7 flex items-center">
          {/* {notif()} */}
          <Tooltip
            showArrow
            placement="bottom"
            content={1}
            classNames={{
              base: "py-2 px-4 shadow-xl text-black bg-gradient-to-br from-white to-neutral-400 rounded-lg",
              arrow: "bg-neutral-400 dark:bg-white",
            }}
          >
            <User
              className="hover:cursor-pointer"
              name={
                <div className="text-black opacity-90 font-medium">
                  <p>{sessionData?.email.split("@")[0]}</p>
                  <p className="text-slate-500 text-sm mt-1">
                    {sessionData?.validity}
                  </p>
                </div>
              }
              avatarProps={{
                src: sessionData?.image,
                size: "md",
              }}
            />
          </Tooltip>
        </div>
      </div>
    </>
  );
}
