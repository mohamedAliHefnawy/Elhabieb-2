"use client";

import React, { useState } from "react";
import Image from "next/image";
import Logo from "@/public/images/hbaieb.png";
import Link from "next/link";
import { Button } from "@nextui-org/react";
import Alert from "@/Components/Alert";
import CryptoJS from "crypto-js";
import axios from "axios";
import jwt from "jwt-simple";
import Cookies from "js-cookie";
import GoogleSignIn from "@/Components/SignInWithGoogle";

import { useRouter } from "next/navigation";

const SignInPage = () => {
  const keyHash = process.env.NEXT_PUBLIC_KEY_HASH as string;
  const apiEndpoint = process.env.NEXT_PUBLIC_LINK_API;
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const dataToEncrypt = {
      email,
      password,
    };

    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(dataToEncrypt),
      keyHash
    ).toString();

    try {
      const res = await axios.post(`${apiEndpoint}user/login`, {
        data: encryptedData,
      });

      const {
        state,
        id,
        image,
        email,
        phone,
        firstName,
        secondName,
        password,
        validity,
        company,
        phoneCompany,
        colorCompany,
        city,
        store,
      } = res.data;

      if (state === "Login_Successful") {
        Alert("success", "تم التسجيل بنجاح");
        new Audio("/mp3/loginSucess.mp3").play();

        const sessionData = {
          id,
          email,
          phone,
          firstName,
          secondName,
          image,
          validity,
          company,
          phoneCompany,
          colorCompany,
          city,
          store,
        };

        try {
          const token = jwt.encode(sessionData, keyHash);
          await fetch("/api/set-session", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ token }),
          });

          if (validity === "Delivery") {
            new Audio("/mp3/loginSucess.mp3").play();
            router.push("/delivery");
          } else if (validity === "Client" || validity === "Markter") {
            new Audio("/mp3/loginSucess.mp3").play();
            router.push("/");
          } else if (validity === "Employ" || validity === "Admin") {
            new Audio("/mp3/loginSucess.mp3").play();
            router.push("/dashboard");
          } else if (validity === "Pos") {
            Cookies.set("colorPos", colorCompany);
            new Audio("/mp3/loginSucess.mp3").play();
            router.push("/pos");
          }
        } catch (error) {
          Alert("error", "توجد مشكلة في الإنترنت حاول تنشيط الصفحة");
          new Audio("/mp3/proplemInternet.mp3").play();
        }
      } else if (res.data === "PASSWORD_ERROR") {
        Alert("error", "يوجد خطأ في كلمة المرور");
        new Audio("/mp3/proplemPassword.mp3").play();
      } else if (res.data === "USER_NOT_FOUND") {
        Alert("error", "هذا المستخدم غير موجود");
      } else {
        Alert("error", "توجد مشكلة في الإنترنت حاول تنشيط الصفحة");
        new Audio("/mp3/proplemInternet.mp3").play();
      }
    } catch (error) {
      Alert("error", "حاول مرة توجد مشكلة في الإنترنت حاول تنشيط الصفحة");
      new Audio("/mp3/proplemInternet.mp3").play();
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-gray-100 to-blue-100 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-200 opacity-50 rounded-full mix-blend-multiply filter blur-2xl animate-move-slow"></div>
      <div className="absolute top-1/4 right-0 w-[300px] h-[300px] bg-pink-200 opacity-50 rounded-full mix-blend-multiply filter blur-2xl animate-move-fast"></div>
      <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] bg-yellow-200 opacity-50 rounded-full mix-blend-multiply filter blur-2xl animate-move-medium"></div>

      <div className="bg-white shadow-lg rounded-lg p-8 z-10 w-full max-w-3xl mx-auto">
        <div className="flex justify-center mb-6">
          <Image src={Logo} alt="Logo" width={200} height={60} />
        </div>

        <h3 className="text-center text-lg mb-5" style={{ direction: "rtl" }}>
          تسجيل الدخول لمنصة الحبايب
        </h3>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <input
            className="input focus:bg-blue-50 w-full py-2 px-4 rounded-lg border border-gray-300 focus:border-blue-400 transition-colors"
            type="email"
            placeholder="البريد الإلكتروني"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="input focus:bg-blue-50 w-full py-2 px-4 rounded-lg border border-gray-300 focus:border-blue-400 transition-colors"
            type="password"
            minLength={7}
            placeholder="كلمة المرور"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <p className="text-right text-sm text-[var(--color-matg3er)] mt-4 hover:underline cursor-pointer">
            <Link href="/auth/signup">ليس لديك حساب ؟</Link>
          </p>

          <Button
            type="submit"
            className="mt-5 w-[100%] h-12 bg-[var(--color-navbar)] border-1"
          >
            تسجيل الدخول
          </Button>

          <div className="relative flex items-center py-5">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-4 text-gray-500">أو</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <GoogleSignIn />
        </form>
      </div>
    </div>
  );
};

export default SignInPage;
