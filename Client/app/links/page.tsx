"use client";

//React
import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

//nextUI
import { Button } from "@nextui-org/react";

//Images
import logo from "@/public/images/hbaieb.png";
import Link from "next/link";

export default function LinksPage() {
  const router = useRouter();
  const [showDiv, setShowDiv] = useState(false);

  const dropDown = () => {
    return (
      <>
        <Button
          color="warning"
          variant="shadow"
          className="max-sm:w-[80%] sm:w-[60%] lg:w-[30%] max-lg:w-[40%] text-white"
          onClick={() => setShowDiv(!showDiv)}
        >
          إختر نوع الحساب الخاص بك
        </Button>
        <div
          className={`max-sm:w-[80%] sm:w-[60%] lg:w-[30%] max-lg:w-[40%] border-2 border-warning-300 rounded-lg mt-3 flex flex-col items-center transition-all duration-500 ${
            showDiv ? "opacity-100 translate-y-0" : "opacity-0 translate-y-full"
          }`}
        >
          {[
            { validate: "أدمن", link: "/dashboard" },
            { validate: "موظف", link: "/dashboard" },
            { validate: "مندوب تسويق", link: "/" },
            { validate: "عميل", link: "/" },
            { validate: "مندوب توصيل", link: "/delivery" },
            { validate: "كاشير", link: "/pos" },
          ].map((item) => (
            <div className="flex justify-between items-center p-4 w-[100%]">
              <div>
                <Link
                  href={item.link}
                  className="text-[var(--color-matg3er)] p-3"
                >
                  تسجيل دخول
                </Link>
              </div>
              <p> {item.validate} </p>
            </div>
          ))}
        </div>
      </>
    );
  };

  return (
    <>
      <div className="flex flex-col justify-center items-center h-auto pb-6">
        <Image src={logo} alt={"error"} width={500} height={500} />
        {dropDown()}
      </div>
    </>
  );
}
