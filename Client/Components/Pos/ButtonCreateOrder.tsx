import { Button } from "@nextui-org/react";
import React, { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { Cairo } from "next/font/google";
import CryptoJS from "crypto-js";

//images
import faceBook from "@/public/images/facebook.png";
import linkenIn from "@/public/images/linkedin.png";
import telegram from "@/public/images/telegram.png";
import instagram from "@/public/images/instagram.png";
import Logo from "@/public/images/hbaieb.png";

import { Avatar } from "@nextui-org/react";
import axios from "axios";
import Alert from "../Alert";
import { removeAllProducts } from "@/features/posSlice";
import { useDispatch } from "react-redux";

const cairo = Cairo({ subsets: ["arabic"] });

interface Product {
  _id: string;
  name: string;
  image: string;
  color: string;
  size: string;
  amount: number;
  price: number;
  describtion: string;
}

export default function ButtonCreateOrder({
  namePos,
  imagePos,
  phonePos,
  phoneCompany,
  colorCompany,
  moneyTreasury,
  city,
  store,
  discount,
  totalPrice,
  totalPriceAfterDiscount,
  products,
}: {
  namePos: string;
  imagePos: string;
  phonePos: string;
  phoneCompany: string;
  colorCompany: string;
  moneyTreasury: string;
  city: string;
  store: string;
  discount: number;
  totalPrice: number;
  totalPriceAfterDiscount: number;
  products: Product[];
}) {
  const keyHash = process.env.NEXT_PUBLIC_KEY_HASH;
  const apiEndpoint = process.env.NEXT_PUBLIC_LINK_API;

  const printRef = useRef<HTMLFormElement | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const dispatch = useDispatch();

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  const orderInvoice = async () => {
    handlePrint();

    if (!keyHash) {
      return;
    }
    const dataToEncrypt = {
      namePos,
      imagePos,
      phonePos,
      phoneCompany,
      colorCompany,
      moneyTreasury,
      city,
      store,
      discount,
      totalPrice,
      totalPriceAfterDiscount,
      products,
    };
    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(dataToEncrypt),
      keyHash
    ).toString();
    setIsSubmitting(true);

    try {
      const response = await axios.post(`${apiEndpoint}pos/newInvoice`, {
        data: encryptedData,
      });

      if (response.data === "SUCCESS") {
        dispatch(removeAllProducts());
        Alert("success", "تم عمل الاوردر بنجاح");
        // new Audio("/mp3/susess_added_catogry.mp3").play();
      }
    } catch (error) {
      console.error("Error submitting data", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-5">
      <Button
        isLoading={isSubmitting}
        isDisabled={isSubmitting}
        onClick={orderInvoice}
        className="w-full rounded-full text-white border border-white outline-2"
        style={{ backgroundColor: colorCompany, outlineColor: colorCompany }}
      >
        إنشاء طلبية
      </Button>
      <div className="hidden">
        <form ref={printRef} className={cairo.className}>
          <div className="p-4 flex justify-between items-center">
            <p
              className="w-[5%] h-4"
              style={{ backgroundColor: `${colorCompany}` }}
            ></p>
            <p className="w-[45%] flex justify-center items-center">
              <Avatar src={Logo.src} />
              <span className="ml-3">الحبايب</span>
            </p>
            <p
              style={{ backgroundColor: `${colorCompany}` }}
              className="w-[50%] h-10 text-lg text-white font-bold flex justify-center items-center"
            >
              فاتورة
            </p>
          </div>
          <div className="my-7">
            <div
              className="flex justify-evenly items-center text-sm text-white p-4"
              style={{ backgroundColor: `${colorCompany}` }}
            >
              <p className="w-full text-center">الإجمالي</p>
              <p className="w-full text-center">الكميه</p>
              <p className="w-full text-center">السعر</p>
              <p className="w-full text-center">اللون</p>
              <p className="w-full text-center">المقاس</p>
              <p className="w-full text-center">المنتج</p>
            </div>
            {products.map((item, indexItem) => (
              <div
                key={indexItem}
                className="flex justify-evenly items-center text-sm p-4 border-b-1"
                style={{ borderBottom: `1px ${colorCompany} solid` }}
              >
                <p className="w-full text-center">{item.amount * item.price}</p>
                <p className="w-full text-center">{item.amount}</p>
                <p className="w-full text-center">{item.price}</p>
                <p className="w-full text-center">{item.color}</p>
                <p className="w-full text-center">{item.size}</p>
                <p className="w-full text-center">{item.name}</p>
              </div>
            ))}

            <div className="text-sm p-4 ml-5 flex flex-col items-center justify-center w-28">
              <p className="flex font-bold">
                <p className="mr-1">د.ل</p>
                <p>{totalPrice}</p>
              </p>
              <p
                className="flex font-bold mt-2 p-3 text-center rounded-2xl text-white "
                style={{
                  backgroundColor: `${colorCompany}`,
                  outline: `1px double ${colorCompany}`,
                  border: `1px double white`,
                }}
              >
                <p className="mr-1">د.ل</p>
                <p>{totalPriceAfterDiscount}</p>
              </p>
            </div>
            <div className="w-[100%] flex justify-center items-center mt-10  ">
              <Avatar src={Logo.src} className="w-60 h-60 opacity-65" />
            </div>
            <div
              style={{ backgroundColor: `${colorCompany}` }}
              className="absolute bottom-0 mb-3 p-4 flex justify-evenly items-center ite w-[95%] text-white text-sm"
            >
              <div className="flex">
                <Avatar src={faceBook.src} size="sm" className="mr-2" />
                <Avatar src={telegram.src} size="sm" className="mr-2" />
                <Avatar src={linkenIn.src} size="sm" className="mr-2" />
                <Avatar src={instagram.src} size="sm" className="mr-2" />
              </div>
              <div>alhabieb@gmail.com</div>
              <div>{phoneCompany}</div>
            </div>
          </div>
        </form>

        <style jsx global>{`
          @media print {
            body {
              font-size: 30px;
              padding: 15px;
            }

            .non-printable {
              display: none;
            }

            form {
              width: 100%;
            }

            /* Add any additional print styles here */
          }
        `}</style>
      </div>
    </div>
  );
}
