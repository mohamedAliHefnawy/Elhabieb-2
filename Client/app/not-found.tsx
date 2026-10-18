"use client";

// REACT
import Image from "next/image";
import Link from "next/link";
import React from "react";

// IMAGES
import Logo from "@/public/images/hbaieb.png";

const NotFound = () => {
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-gray-100 to-blue-100 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-200 opacity-50 rounded-full mix-blend-multiply filter blur-2xl animate-move-slow"></div>
      <div className="absolute top-1/4 right-0 w-[300px] h-[300px] bg-pink-200 opacity-50 rounded-full mix-blend-multiply filter blur-2xl animate-move-fast"></div>
      <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] bg-yellow-200 opacity-50 rounded-full mix-blend-multiply filter blur-2xl animate-move-medium"></div>

      <div className="bg-white shadow-lg rounded-lg p-8 z-10 w-full max-w-3xl mx-auto flex flex-col items-center">
        <div className="flex justify-center mb-6">
          <Image src={Logo} alt="Logo" width={200} height={60} />
        </div>

        <h3 className="text-center text-lg mb-5" style={{ direction: "rtl" }}>
          عذرا هذة الصفحة غير موجودة
        </h3>
        <Link className="my-5 text-center underline" href={"/"}>
          عودة للصفحة الرئيسة
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
