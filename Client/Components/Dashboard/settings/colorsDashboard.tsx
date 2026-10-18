import { Key, useEffect, useState } from "react";
import Alert from "@/Components/Alert";
import Icons from "@/iconsSvg";
import { ColorResult, SketchPicker, BlockPicker } from "react-color";
import { Button, Spinner } from "@nextui-org/react";
import Cookies from "js-cookie";
import axios from "axios";
import CryptoJS from "crypto-js";
import SlidesMatger from "./slides";

export default function ColorsDashboard() {
  const keyHash = process.env.NEXT_PUBLIC_KEY_HASH;
  const apiEndpoint = process.env.NEXT_PUBLIC_LINK_API;

  const [navBarColor, setNavBarColor] = useState("#F2F2F2");
  const [sideBarColor, setSideBarColor] = useState("#F2F2F2");
  const [bodyColor, setBodyColor] = useState("#FAFAFA");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [activePicker, setActivePicker] = useState<string | null>(null);
  const updateCSSVariables = (
    navbarColor: any,
    sidebarColor: any,
    bodyColor: any
  ) => {
    document.documentElement.style.setProperty("--color-navbar", navbarColor);
    document.documentElement.style.setProperty("--color-sidebar", sidebarColor);
    document.documentElement.style.setProperty("--color-body", bodyColor);
  };

  // #F2F2F2
  // #FAFAFA
  const handleColorChange = (color: ColorResult) => {
    const selectedColor = color.hex;

    if (activePicker === "navbar") {
      setNavBarColor(selectedColor);
      localStorage.setItem("navBarColor", selectedColor);
      updateCSSVariables(selectedColor, sideBarColor, bodyColor);
    } else if (activePicker === "sidebar") {
      setSideBarColor(selectedColor);
      localStorage.setItem("sideBarColor", selectedColor);
      updateCSSVariables(navBarColor, selectedColor, bodyColor);
    } else if (activePicker === "body") {
      setBodyColor(selectedColor);
      localStorage.setItem("bodyColor", selectedColor);
      updateCSSVariables(navBarColor, sideBarColor, selectedColor);
    }
  };

  const handleSubmit = async () => {
    if (!keyHash) {
      return;
    }
    const dataToEncrypt = {
      navBarColor,
      sideBarColor,
      bodyColor,
    };

    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(dataToEncrypt),
      keyHash
    ).toString();
    setIsSubmitting(true);

    try {
      const response = await axios.post(`${apiEndpoint}settings/editSettings`, {
        data: encryptedData,
      });

      if (response.data === "SUCCESS") {
        Alert("success", "تمت العملية بنجاح");
        new Audio("/mp3/DoneSucess.mp3").play();
      } else {
        Alert("error", "توجد مشكلة في الإنترنت حاول تنشيط الصفحة");
        new Audio("/mp3/proplemInternet.mp3").play();
      }
    } catch (error) {
      console.error("Error submitting data", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      setNavBarColor(localStorage.getItem("navBarColor") || "#F2F2F2");
      setSideBarColor(localStorage.getItem("sideBarColor") || "#F2F2F2");
      setBodyColor(localStorage.getItem("bodyColor") || "#FAFAFA");
    }
  }, []);

  return (
    <div className="w-[100%] ">
      <div className="w-[100%]">
        <p className="mb-3 flex items-center justify-center gap-x-1" dir="rtl">
          {Icons.SettingIcon} تظبيط ألوان الداش بورد
        </p>
        <div className="flex">
          <div className="w-[100%] mr-1">
            <div
              className="flex justify-center items-center w-[100%] h-[60px]"
              style={{ backgroundColor: navBarColor }}
              onClick={() =>
                setActivePicker(activePicker === "navbar" ? null : "navbar")
              }
            >
              NavBar
            </div>
            <div
              className="mt-1 p-4 h-screen border-1 flex justify-center items-center border-[var(--color-navbar)]"
              style={{ backgroundColor: bodyColor }}
              onClick={() =>
                setActivePicker(activePicker === "body" ? null : "body")
              }
            >
              Body
            </div>
          </div>
          <div
            className="flex justify-center items-center w-[30%] mr-1"
            style={{ backgroundColor: sideBarColor }}
            onClick={() =>
              setActivePicker(activePicker === "sidebar" ? null : "sidebar")
            }
          >
            SideBar
          </div>
        </div>

        {activePicker && (
          <div className="fixed top-0 left-0 w-full h-full flex flex-col justify-center items-center bg-black bg-opacity-50">
            <button
              onClick={() => setActivePicker(null)}
              className="text-white mb-4"
            >
              إغلاق
            </button>
            <SketchPicker
              color={
                activePicker === "navbar"
                  ? navBarColor
                  : activePicker === "sidebar"
                  ? sideBarColor
                  : bodyColor
              }
              onChangeComplete={handleColorChange}
            />
          </div>
        )}
      </div>
      <Button
        className="w-[100%] h-12 mt-3 bg-[var(--color-navbar)] border-1"
        onClick={() => handleSubmit()}
        isLoading={isSubmitting}
        isDisabled={isSubmitting}
      >
        حفظ
      </Button>
    </div>
  );
}
