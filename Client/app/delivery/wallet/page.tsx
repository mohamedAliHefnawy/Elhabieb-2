"use client";

import React, { useEffect, useRef, useState } from "react";
import DataDelivery from "@/Components/Delivery/DataDelivery";
import Footer from "@/Components/Delivery/Footer";
import Icons from "@/iconsSvg";
import { AppDispatch, RootState } from "@/src/store";
import { useDispatch, useSelector } from "react-redux";
import { fetDeliveryWallet } from "@/features/delivery";
import Alert from "@/Components/Alert";
import { CircleCheckBig, Clock8, ShieldCheck } from "lucide-react";
import { Spinner } from "@nextui-org/react";
import axios from "axios";
import CryptoJS from "crypto-js";
import { useRouter } from "next/navigation";
import useSessionData from "@/hooks/useSessionData";

const DeliveryPageWallet = () => {
  const keyHash = process.env.NEXT_PUBLIC_KEY_HASH;
  const apiEndpoint = process.env.NEXT_PUBLIC_LINK_API;

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const sessionData = useSessionData();
  const dispatch = useDispatch<AppDispatch>();
  const isInitialLoad = useRef(true);
  const router = useRouter();

  const { delieveryWallet, loading, error } = useSelector(
    (state: RootState) => state.delivery
  );

  if (error) {
    Alert("error", "توجد مشكلة في الإنترنت حاول تنشيط الصفحة");
    new Audio("/mp3/proplemInternet.mp3").play();
    return;
  }

  const moneyWaiting = delieveryWallet
    .filter((item) => item.status === "أموال متوقعة")
    .reduce((calc, alt) => calc + alt.money, 0);

  const moneyAgree = delieveryWallet
    .filter((item) => item.status === "أموال قابلة للتحويل")
    .reduce((calc, alt) => calc + alt.money, 0);

  const moneyFull = delieveryWallet
    .filter((item) => item.status === "تم الإستلام بنجاح")
    .reduce((calc, alt) => calc + alt.money, 0);

  const CardsMoney = () => {
    return (
      <div className="grid grid-cols-1 gap-2 mb-7">
        <div className="p-7 border-2 border-dashed border-orange-300 bg-orange-50 rounded-lg text-center flex flex-col items-center space-y-3">
          <div className="text-yellow-700">
            <Clock8 size={46} strokeWidth={1.25} absoluteStrokeWidth />
          </div>
          <p className="text-yellow-700 text-xl flex items-center gap-x-2">
            <span>{Icons.BanknotesIcon}</span>
            <span>أموال متوقعة</span>
          </p>
          <span className="text-gray-600 text-lg" dir="rtl">
            {moneyWaiting} د.ل
          </span>
        </div>
        <div className="p-7 border-2 border-double border-green-300 bg-green-50 rounded-lg text-center flex flex-col items-center space-y-3">
          <div className="text-green-700">
            <ShieldCheck size={46} strokeWidth={1.25} absoluteStrokeWidth />
          </div>
          <p className="text-green-700 text-xl flex items-center gap-x-2">
            <span>{Icons.BanknotesIcon}</span>
            <span>أموال يمكن تحويلها للأدمن</span>
          </p>
          <span className="text-gray-600 text-lg" dir="rtl">
            {moneyAgree} د.ل
          </span>
        </div>
        <div className="p-7 border-2 border-double border-blue-300 bg-blue-50 rounded-lg text-center flex flex-col items-center space-y-3">
          <div className="text-blue-700">
            <CircleCheckBig size={46} strokeWidth={1.25} />
          </div>
          <p className="text-blue-700 text-xl flex items-center gap-x-2">
            <span>{Icons.BanknotesIcon}</span>
            <span>أموال تمت الإستلام بنجاح</span>
          </p>
          <span className="text-gray-600 text-lg" dir="rtl">
            {moneyFull} د.ل
          </span>
        </div>
      </div>
    );
  };
  const Body = () => {
    return (
      <div className="container mx-auto max-w-2xl">
        {loading ? (
          <div className="flex justify-center items-center h-[400px]">
            <Spinner size="lg" color="success" />
          </div>
        ) : (
          <>
            <h1 className="text-3xl mb-8 text-center" dir="rtl">
              محفظة , {sessionData?.email.split("@")[0]}
            </h1>
            <CardsMoney />
            <div className="flex mb-6">
              <button
                className={`flex-1 py-4 px-4 text-center bg-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
              >
                تحويل أموال للأدمن
              </button>
            </div>
            {moneyAgree !== 0 ? (
              <div className="bg-white pb-20">
                <p className="text-center opacity-80">
                  هل أنت متأكد من تحويل أموال الخزينة الخاصة بك إلي الأدمن ؟
                </p>
                {!isSubmitting ? (
                  <p
                    onClick={handleSubmit}
                    className="mt-6 text-center text-xl text-[var(--color-matg3er)] border-t-1 border-b-1 py-3 cursor-pointer"
                  >
                    نعم
                  </p>
                ) : (
                  <p className="mt-6 text-center text-xl text-[var(--color-matg3er)] border-t-1 border-b-1 py-3 cursor-pointer">
                    <span>
                      <Spinner size="md" color="default" />
                    </span>
                  </p>
                )}
              </div>
            ) : (
              <p className="text-center text-red-600 mb-4">
                لا يوجد أموال يمكن تحويلها
              </p>
            )}
          </>
        )}
      </div>
    );
  };

  const handleSubmit = async () => {
    if (!keyHash) {
      return;
    }
    const dataToEncrypt = {
      namerSender: sessionData?.email,
      validitySender: sessionData?.validity,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      money: delieveryWallet
        .filter((item) => item.status === "أموال قابلة للتحويل")
        .map((item) => ({
          money: item.money,
          date: item.date,
          time: item.time,
          orderId: item.orderId,
          numberOrder: item.numberOrder,
        })),
    };

    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(dataToEncrypt),
      keyHash
    ).toString();
    setIsSubmitting(true);

    try {
      const response = await axios.post(
        `${apiEndpoint}moneyTransfers/addMoneyTransfer`,
        {
          data: encryptedData,
        }
      );
      if (response.data === "ADDED_SUSESS") {
        new Audio("/mp3/susess_added_catogry.mp3").play();
        Alert("success", "تم التحويل بنجاح");
        router.push("/delivery");
      }
    } catch (error) {
      console.error("Error submitting data", error);
    }
  };

  useEffect(() => {
    if (isInitialLoad.current && sessionData) {
      dispatch(fetDeliveryWallet(sessionData.email));
      isInitialLoad.current = false;
    }
  }, [dispatch, sessionData]);

  return (
    <div className="flex flex-col items-center bg-[var(--color-navbar)] min-h-screen w-full">
      <DataDelivery />
      <div className="bg-white rounded-ss-2xl rounded-se-2xl p-6 w-full pb-20">
        {Body()}
      </div>

      <Footer />
    </div>
  );
};

export default DeliveryPageWallet;
