"use client";

import React, { useEffect, useRef } from "react";

import { useDispatch, useSelector } from "react-redux";
import { fetchSettings } from "@/features/settingsSlice";
import { AppDispatch, RootState } from "@/src/store";
import Cookies from "js-cookie";
import SizeScreen from "@/Components/Dashboard/SizeScreen";
import SideBar from "@/Components/Dashboard/SideBar";
import NavBar from "@/Components/Dashboard/NavBar";
import PageAnalysis from "@/Components/Dashboard/reports/PageAnalysis";

export default function Home() {
  const isInitialLoad = useRef(true);
  const dispatch = useDispatch<AppDispatch>();
  // const { settings } = useSelector((state: RootState) => state.settings);

  // const clearColorCookies = () => {
  //   Cookies.remove("navBarColor");
  //   Cookies.remove("sideBarColor");
  //   Cookies.remove("bodyColor");
  // };

  // const setCssVariables = (
  //   navBarColor: any,
  //   sideBarColor: any,
  //   bodyColor: any
  // ) => {
  //   document.documentElement.style.setProperty("--color-navbar", navBarColor);
  //   document.documentElement.style.setProperty("--color-sidebar", sideBarColor);
  //   document.documentElement.style.setProperty("--color-body", bodyColor);
  // };

  useEffect(() => {
    if (isInitialLoad.current) {
      // clearColorCookies();
      dispatch(fetchSettings());
      const navBarColor = localStorage.getItem("navBarColor") || "#F2F2F2";
      const sideBarColor = localStorage.getItem("sideBarColor") || "#F2F2F2";
      const bodyColor = localStorage.getItem("bodyColor") || "#FAFAFA";

      document.documentElement.style.setProperty("--color-navbar", navBarColor);
      document.documentElement.style.setProperty("--color-sidebar", sideBarColor);
      document.documentElement.style.setProperty("--color-body", bodyColor);
      isInitialLoad.current = false;
    }
  }, [dispatch]);

  // useEffect(() => {
  //   if (settings) {
  //     const { navBarColor, sideBarColor, bodyColor } = settings.colors;
  //     Cookies.set("navBarColor", navBarColor);
  //     Cookies.set("sideBarColor", sideBarColor);
  //     Cookies.set("bodyColor", bodyColor);
  //     setCssVariables(navBarColor, sideBarColor, bodyColor);
  //   }
  // }, [settings]);

  return (
    <>
      <div className="w-full h-screen flex max-2xl:flex max-xl:flex lg:flex md:hidden sm:hidden max-sm:hidden">
        <div className="w-[84%] mr-1 flex flex-col">
          <NavBar />
          <PageAnalysis />
        </div>
        <div className="w-[16%] flex flex-col">
          <SideBar />
        </div>
      </div>

      <SizeScreen />
    </>
  );
}
