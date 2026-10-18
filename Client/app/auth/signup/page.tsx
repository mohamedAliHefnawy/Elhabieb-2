"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Logo from "@/public/images/hbaieb.png";
import { useRouter } from "next/navigation";
import { Button } from "@nextui-org/react";
import Link from "next/link";
import SignInWithGoogle from "@/Components/SignInWithGoogle";
import axios from "axios";
import CryptoJS from "crypto-js";
import Alert from "@/Components/Alert";
import { useSession } from "next-auth/react";

const SignUpPage = () => {
  const keyHash = process.env.NEXT_PUBLIC_KEY_HASH as string;
  const apiEndpoint = process.env.NEXT_PUBLIC_LINK_API;
  const { status } = useSession();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const dataToEncrypt = {
        firstName,
        lastName,
        phone,
        email,
        password,
      };

      const encryptedData = CryptoJS.AES.encrypt(
        JSON.stringify(dataToEncrypt),
        keyHash
      ).toString();

      const response = await axios.post(`${apiEndpoint}user/register`, {
        data: encryptedData,
      });

      if (response.data === "ADDED_SUCCESS") {
        Alert("success", "تم إنشاء الحساب بنجاح");
        new Audio("/mp3/signUpSucess.mp3").play();
        router.push("/auth/signin");
      } else if (response.data === "ExistingUserSureEmail") {
        Alert("error", "هذا الإيميل تم إستخدامة من قبل ");
        new Audio("/mp3/emailExited.mp3").play();
      } else if (response.data === "ExistingUserSurePhone") {
        Alert("info", "هذا الهاتف تم إستخدامة من قبل ");
        new Audio("/mp3/phoneExited.mp3").play();
      }
    } catch (err) {
      Alert("error", "توجد مشكلة في الإنترنت حاول تنشيط الصفحة");
      new Audio("/mp3/proplemInternet.mp3").play();
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status, router]);

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-gray-100 to-blue-100 relative overflow-hidden">

      <div className="bg-white shadow-lg rounded-lg p-8 z-10 w-full max-w-3xl mx-auto">
        <div className="flex justify-center mb-6">
          <Image src={Logo} alt="Logo" width={200} height={60} />
        </div>

        <form className="space-y-5" onSubmit={handleSignUp}>
          {error && <p className="text-red-500 text-center">{error}</p>}

          <div className="flex ">
            <input
              className="input focus:bg-blue-50 w-full py-2 px-4 mr-1 rounded-lg border border-gray-300 focus:border-blue-400 transition-colors"
              type="text"
              placeholder="الاسم الأول"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <input
              className="input focus:bg-blue-50 w-full py-2 px-4 ml-1 rounded-lg border border-gray-300 focus:border-blue-400 transition-colors"
              type="text"
              placeholder="الاسم الأخير"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <input
            className="input focus:bg-blue-50 w-full py-2 px-4 rounded-lg border border-gray-300 focus:border-blue-400 transition-colors"
            type="number"
            placeholder="رقم الهاتف"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
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
            placeholder="كلمة المرور ( 7 حروف على الأقل )"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <p className="text-right text-sm text-[var(--color-matg3er)] mt-4 hover:underline cursor-pointer">
            <Link href="/auth/signin"> لدي حساب بالفعل ؟</Link>
          </p>

          <Button type="submit" className="mt-5 w-[100%] h-12 text-white" color="warning">
            إنشاء حساب
          </Button>

          <div className="relative flex items-center py-5">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-4 text-gray-500">أو</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <SignInWithGoogle />
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;
