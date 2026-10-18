"use client";

import React, { useEffect, useState } from "react";
import CryptoJS from "crypto-js";

// COMPONENTS & STORE
import NavBar from "@/Components/Mat3er/NavBar";
import Footer from "@/Components/Mat3er/Footer";
import ButtonScroll from "@/Components/Mat3er/ButtonScroll";
import BodyWallet from "@/Components/Wallet/Body";
import Icons from "@/iconsSvg";
import { Button, Input } from "@nextui-org/react";
import Alert from "@/Components/Alert";
import axios from "axios";
import useSessionData from "@/hooks/useSessionData";

export default function Wallet() {
  const keyHash = process.env.NEXT_PUBLIC_KEY_HASH;
  const apiEndpoint = process.env.NEXT_PUBLIC_LINK_API;
  const sessionData = useSessionData();

  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [isVisible, setIsVisible] = React.useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  const handlePasswordSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!keyHash) {
      return;
    }

    const dataToEncrypt = {
      user: sessionData?.email,
      password,
    };

    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(dataToEncrypt),
      keyHash
    ).toString();

    try {
      const response = await axios.post(`${apiEndpoint}user/loginWallet`, {
        data: encryptedData,
      });

      if (response.data === "SUSESS") {
        Alert("success", "تم الدخول بنجاح");
        new Audio("/mp3/enterSucess.mp3").play();
        setIsAuthenticated(true);
      } else if (response.data === "PASSWORD_ERROR") {
        Alert("error", "يوجد خطأ في كلمة المرور");
        new Audio("/mp3/proplemPassword.mp3").play();
      }
    } catch (error) {
      console.error("Error submitting data", error);
    }
  };

  return (
    <>
      {!isAuthenticated ? (
        <>
          <NavBar />
          <div className="flex flex-col items-center justify-center h-screen">
            <h2 className="mb-4 text-xl">أدخل كلمة المرور</h2>
            <form
              onSubmit={handlePasswordSubmit}
              className="flex flex-col items-center xl:w-[40%] lg:w-[40%] md:w-[40%] sm:w-[90%] max-sm:w-[90%]"
            >
              <Input
                label="Password"
                variant="bordered"
                color="warning"
                placeholder="أدخل كلمة المرور"
                endContent={
                  <button
                    className="focus:outline-none"
                    type="button"
                    onClick={toggleVisibility}
                    aria-label="toggle password visibility"
                  >
                    {isVisible ? Icons.EyeNotIcon : Icons.EyeIcon}
                  </button>
                }
                type={isVisible ? "text" : "password"}
                className="w-[100%]"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <Button
                type="submit"
                color="warning"
                variant="solid"
                className="mt-6 w-[100%] h-12 text-white"
              >
                دخول
              </Button>
            </form>
          </div>
          <Footer />
        </>
      ) : (
        <>
          <NavBar />
          <BodyWallet />
          <Footer />
        </>
      )}
    </>
  );
}
