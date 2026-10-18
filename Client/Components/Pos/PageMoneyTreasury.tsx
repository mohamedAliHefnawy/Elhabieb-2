"use client";

import React, { useEffect, useRef, useState } from "react";
import getSessionData, { SessionData } from "@/contexts/SessionContext";
import DataDelivery from "@/Components/Delivery/DataDelivery";
import Footer from "@/Components/Delivery/Footer";
import Icons from "@/iconsSvg";
import { AppDispatch, RootState } from "@/src/store";
import { useDispatch, useSelector } from "react-redux";
import { fetDeliveryWallet } from "@/features/delivery";
import Alert from "@/Components/Alert";
import {
  Bitcoin,
  CircleCheckBig,
  Clock8,
  CookingPot,
  ShieldCheck,
} from "lucide-react";
import { Spinner } from "@nextui-org/react";
import axios from "axios";
import CryptoJS from "crypto-js";
import { useRouter } from "next/navigation";
import { fetchMoneyPos } from "@/features/posSlice";
import Cookies from "js-cookie";
import { DNA } from "react-loader-spinner";
import useSessionData from "@/hooks/useSessionData";
export default function PageMoneyTreasury() {
  const keyHash = process.env.NEXT_PUBLIC_KEY_HASH;
  const apiEndpoint = process.env.NEXT_PUBLIC_LINK_API;

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const sessionData = useSessionData();
  const dispatch = useDispatch<AppDispatch>();
  const isInitialLoad = useRef(true);
  const router = useRouter();
  const colorCompany = Cookies.get("colorPos");

  const { Money, loading, error } = useSelector(
    (state: RootState) => state.pos2
  );

  if (error) {
    Alert("error", "توجد مشكلة في الإنترنت حاول تنشيط الصفحة");
    new Audio("/mp3/proplemInternet.mp3").play();
    return;
  }

  const [moneyInPos, setMoneyInPos] = useState(0);

  const moneyInAdmin = Money.filter((item) => item.status === "InAdmin").reduce(
    (calc, alt) => calc + alt.totalPriceAfterDisount,
    0
  );

  const moneyFailed = Money.filter((item) => item.status === "Failed").reduce(
    (calc, alt) => calc + alt.totalPriceAfterDisount,
    0
  );

  const CardsMoney = () => {
    return (
      <div className="grid grid-cols-3 gap-2 mb-7">
        <div
          className="p-7 border-2 border-dashed rounded-lg text-center flex flex-col items-center space-y-3"
          style={{ borderColor: colorCompany }}
        >
          <div style={{ color: colorCompany }}>
            <Bitcoin size={50} strokeWidth={1.25} />
          </div>
          <p
            className="text-xl flex items-center gap-x-2"
            style={{ color: colorCompany }}
          >
            <span>{Icons.BanknotesIcon}</span>
            <span>أموال في الحساب</span>
          </p>
          <span className="text-gray-600 text-lg" dir="rtl">
            {moneyInPos} د.ل
          </span>
        </div>

        <div
          className="p-7 border-2 border-dashed rounded-lg text-center flex flex-col items-center space-y-3"
          style={{ borderColor: colorCompany }}
        >
          <div style={{ color: colorCompany }}>
            <CircleCheckBig size={46} strokeWidth={1.25} />
          </div>
          <p
            className="text-xl flex items-center gap-x-2"
            style={{ color: colorCompany }}
          >
            <span>{Icons.BanknotesIcon}</span>
            <span>أموال تمت الإستلام بنجاح</span>
          </p>
          <span className="text-gray-600 text-lg" dir="rtl">
            {moneyInAdmin} د.ل
          </span>
        </div>

        <div className="p-7 border-2 border-dashed border-red-600 bg-red-50 rounded-lg text-center flex flex-col items-center space-y-3">
          <div className="text-red-600">
            <CookingPot size={46} strokeWidth={1.25} />
          </div>
          <p className="text-xl flex items-center gap-x-2 text-red-600">
            <span>{Icons.BanknotesIcon}</span>
            <span>أموال عمليات الراجع</span>
          </p>
          <span className="text-gray-600 text-lg" dir="rtl">
            {moneyFailed} د.ل
          </span>
        </div>
      </div>
    );
  };
  const Body = () => {
    return (
      <div className="p-3">
        {loading ? (
          <div className="flex justify-center items-center h-[400px]">
            <DNA
              visible={true}
              height="80"
              width="80"
              ariaLabel="dna-loading"
            />
          </div>
        ) : (
          <>
            <CardsMoney />
            <div className="flex mb-6">
              <button
                className={`flex-1 py-4 px-4 text-center bg-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
              >
                تحويل أموال للأدمن
              </button>
            </div>
            {moneyInPos !== 0 ? (
              <div className="pb-20">
                <p className="text-center opacity-80">
                  هل أنت متأكد من تحويل أموال الخزينة الخاصة بك إلي الأدمن ؟
                </p>
                {!isSubmitting ? (
                  <p
                    onClick={handleSubmit}
                    className="mt-6 text-center text-xl border-t-1 border-b-1 py-5 cursor-pointer"
                    style={{ color: colorCompany }}
                  >
                    نعم
                  </p>
                ) : (
                  <p
                    className="mt-6 text-center text-xl border-t-1 border-b-1 py-3 cursor-pointer flex justify-center"
                    style={{ color: colorCompany }}
                  >
                    <DNA
                      visible={true}
                      height="80"
                      width="80"
                      ariaLabel="dna-loading"
                    />
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
      money: Money.filter((item) => item.status === "InPos").map((item) => ({
        money: item.totalPriceAfterDisount,
        date: item.date,
        time: item.time,
        orderId: "",
        numberOrder: item.NumberInvoice,
        codeOrder: item.CodeInvoice,
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
        setMoneyInPos(0);
        new Audio("/mp3/susess_added_catogry.mp3").play();
        Alert("success", "تم التحويل بنجاح");
        // router.push("/pos");
      }
    } catch (error) {
      console.error("Error submitting data", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (isInitialLoad.current && sessionData) {
      dispatch(fetchMoneyPos(sessionData.email));
      isInitialLoad.current = false;
    }
  }, [dispatch, sessionData]);

  useEffect(() => {
    if (Money) {
      setMoneyInPos(
        Money.filter((item) => item.status === "InPos").reduce(
          (calc, alt) => calc + alt.totalPriceAfterDisount,
          0
        )
      );
    }
  }, [Money]);

  return <> {Body()}</>;
}
