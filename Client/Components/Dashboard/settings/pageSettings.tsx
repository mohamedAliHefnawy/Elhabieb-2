"use client";

import { Tab, Tabs } from "@nextui-org/react";
import SlidesMatger from "./slides";
import ColorsDashboard from "./colorsDashboard";
import { useEffect, useState } from "react";

export default function PageSettings() {
  const [navBarColor, setNavBarColor] = useState("#F2F2F2");
  const [sideBarColor, setSideBarColor] = useState("#F2F2F2");
  const [bodyColor, setBodyColor] = useState("#FAFAFA");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setNavBarColor(localStorage.getItem("navBarColor") || "#F2F2F2");
      setSideBarColor(localStorage.getItem("sideBarColor") || "#F2F2F2");
      setBodyColor(localStorage.getItem("bodyColor") || "#FAFAFA");
    }
  }, []);

  const Body = () => {
    return (
      <div className="flex flex-col items-end">
        <Tabs className="" dir="rtl" variant="bordered" color="default">
          <Tab className="w-full" title={"الداش بورد"}>
            <ColorsDashboard />
          </Tab>
          <Tab className="w-full" title={"المتجر"}>
            <SlidesMatger />
          </Tab>
        </Tabs>
      </div>
    );
  };

  return (
    <div
      className={`h-screen w-full overflow-y-auto custom-scrollbar p-6 mt-1`}
      style={{
        backgroundColor: bodyColor,
        border: `1px solid ${navBarColor}`,
      }}
    >
      {Body()}
    </div>
  );
}
