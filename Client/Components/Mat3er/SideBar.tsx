"use client";
import Icons from "@/iconsSvg";
import React, { useState } from "react";
import product from "@/public/images/product.png";
import { Avatar } from "@nextui-org/react";
import Logo from "@/public/images/logo.png";
import Link from "next/link";

export default function SideBar() {
  const [showSideBar, setShowSideBar] = useState(false);

  const Catogry = (image: string, name: string) => {
    return (
      <div className="flex flex-col items-center hover:cursor-pointer mb-6 min-w-[100px]">
        <p className="mt-2 text-center">{name}</p>
      </div>
    );
  };
  const LinkCatogry = (text: string, link: string) => {
    return (
      <Link
        href={link}
        className="relative text-blue-600 hover:text-blue-300 flex justify-between items-center w-[100%]"
      >
        <div className="flex items-center gap-4">
          <Avatar src={Logo.src} className="w-16 h-16" />
          <p>{text}</p>
        </div>
        <span className="text-3xl">￫</span>
      </Link>
    );
  };

  return (
    <>
      <p
        className="mr-2 text-2xl hover:cursor-pointer text-gray-700"
        onClick={() => setShowSideBar(!showSideBar)}
      >
        {/* {Icons.Bars3BottomLeft} */}
      </p>

      {showSideBar && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setShowSideBar(false)}
        ></div>
      )}
      <div
        className={`fixed z-50 top-0 left-0 h-full xl:w-[35%] lg:w-[35%] md:w-[65%] sm:w-[80%] max-sm:w-[80%] bg-white shadow-lg p-10 pt-5 px-0 overflow-y-auto scrollbar2 transform transition-transform duration-300 ease-in-out ${
          showSideBar ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="w-[100%] flex flex-col items-center">
          <div className="w-[100%]">
            <div className="flex justify-between items-start w-[100%]">
              <div className="overflow-x-auto overflow-y-auto max-h-[200px] scrollbar-hide px-1">
                <div className="flex justify-evenly ">
                  {Catogry(product.src, "أثاث")}
                  {Catogry(product.src, "موسيقى")}
                  {Catogry(product.src, "إكسسوارات")}
                  {Catogry(product.src, "إلكترونيات")}
                  {Catogry(product.src, "ألعاب")}
                  {Catogry(product.src, "أجهزة منزلية")}
                  {Catogry(product.src, "كتب")}
                  {Catogry(product.src, "مجوهرات")}
                  {Catogry(product.src, "رياضة")}
                  {Catogry(product.src, "أثاث")}
                  {Catogry(product.src, "موسيقى")}
                </div>
              </div>
            </div>
            <div className="bg-slate-200 w-[100%] h-[1px] mt-2 mb-5"></div>
            <div className="flex flex-col items-end leading-relaxed w-[100%] px-5">
              {LinkCatogry("أثاث", "/")}
              {LinkCatogry("موسيقى", "/")}
              {LinkCatogry("إكسسوارات", "/")}
              {LinkCatogry("إلكترونيات", "/")}
              {LinkCatogry("ألعاب", "/")}
              {LinkCatogry("كتب", "/")}
              {LinkCatogry("مجوهرات", "/")}
              {LinkCatogry("رياضة", "/")}
              {LinkCatogry("أثاث", "/")}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
