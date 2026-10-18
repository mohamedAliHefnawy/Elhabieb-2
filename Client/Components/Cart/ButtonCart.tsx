import Icons from "@/iconsSvg";
import { useSession } from "next-auth/react";
import Alert from "../Alert";
import axios from "axios";
import CryptoJS from "crypto-js";
import { useDispatch } from "react-redux";
import {
  decrementTotalProducts,
  incrementTotalProducts,
} from "@/features/cartSlice";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import getSessionData, { SessionData } from "@/contexts/SessionContext";
import { ShoppingCart } from "lucide-react";
import useSessionData from "@/hooks/useSessionData";

export default function ButtonCart({
  idProduct,
  colorProduct,
  sizeProduct,
}: {
  idProduct: string;
  colorProduct: string;
  sizeProduct: string;
}) {
  const keyHash = process.env.NEXT_PUBLIC_KEY_HASH;
  const apiEndpoint = process.env.NEXT_PUBLIC_LINK_API;

  const sessionData = useSessionData();

  const dispatch = useDispatch();
  const router = useRouter();

  const handleSubmit = async () => {
    if (!keyHash) {
      return;
    }

    if (sessionData?.validity === "Admin") {
      Alert("error", "يجب أن تكون مسجلاً أولا للدخول");
      new Audio("/mp3/loginFirst.mp3").play();
      router.push("/dashboard");
      return;
    } else if (sessionData?.validity === "Employ") {
      Alert("error", "يجب أن تكون مسجلاً أولا للدخول");
      new Audio("/mp3/loginFirst.mp3").play();
      router.push("/dashboard");
      return;
    } else if (sessionData?.validity === "Delivery") {
      Alert("error", "يجب أن تكون مسجلاً أولا للدخول");
      new Audio("/mp3/loginFirst.mp3").play();
      router.push("/delivery");
      return;
    }

    if (!sessionData || !sessionData?.email) {
      Alert("error", "يجب أن تكون مسجلاً أولا للدخول");
      new Audio("/mp3/loginFirst.mp3").play();
      router.push("/auth/signin");
      return;
    }

    const dataToEncrypt = {
      idProduct,
      user: sessionData?.email,
      colorProduct: colorProduct,
      sizeProduct: sizeProduct,
    };

    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(dataToEncrypt),
      keyHash
    ).toString();

    try {
      const response = await axios.post(`${apiEndpoint}cart/cartUser`, {
        data: encryptedData,
      });

      if (response.data === "REMOVED_SUCCESS") {
        Alert("error", "تم حذف المنتج من السلة");
        new Audio("/mp3/deleteProductsWithCart.mp3").play();
        dispatch(decrementTotalProducts(1));
      } else if (response.data === "ADDED_SUCCESS") {
        Alert("success", "تم إضافة المنتج للسلة");
        new Audio("/mp3/addProductsToCart.mp3").play();
        dispatch(incrementTotalProducts(1));
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <p onClick={handleSubmit}>
      <ShoppingCart size={28} strokeWidth={1} />
    </p>
  );
}
