"use client";

import React, { useEffect, useRef, useState } from "react";
import QRScanner from "@/Components/Delivery/scannner";
import getSessionData, { SessionData } from "@/contexts/SessionContext";
import DataDelivery from "@/Components/Delivery/DataDelivery";
import Orders3 from "@/Components/Delivery/Orders3";
import Footer from "@/Components/Delivery/Footer";
import WaitingCardMoney from "@/Components/Wallet/WaitingCardMoney";
import PayableCardMoney from "@/Components/Wallet/PayableCardMoney";
import Icons from "@/iconsSvg";
import { AppDispatch, RootState } from "@/src/store";
import { useDispatch, useSelector } from "react-redux";
import { fetDeliveryProducts } from "@/features/delivery";
import Alert from "@/Components/Alert";
import { AlarmClock, Clock8, ShieldCheck } from "lucide-react";
import { Avatar, Button, Spinner } from "@nextui-org/react";

import Hefnawy from "@/public/images/hefnayw.jpeg";
import useSessionData from "@/hooks/useSessionData";

interface Products {
  idProduct: string;
  nameProduct: string;
  colorProduct: string;
  sizeProduct: string;
  priceProduct: number;
  gainMarkter: number;
  priceMarkter: number;
  priceCustomer: number;
  imageProduct: string;
  storeProduct: string;
  cityProduct: string;
  amountProduct: number;
  amountNewProduct: number;
  validity: string;
}

const DeliveryPageStore = () => {
  const sessionData = useSessionData();
  const dispatch = useDispatch<AppDispatch>();
  const isInitialLoad = useRef(true);

  const { delieveryProducts, loading, error } = useSelector(
    (state: RootState) => state.delivery
  );

  const [selectedProducts, setSelectedProducts] = useState<Products[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  if (error) {
    Alert("error", "توجد مشكلة في الإنترنت حاول تنشيط الصفحة");
    new Audio("/mp3/proplemInternet.mp3").play();
    return;
  }

  const groupedProducts = delieveryProducts.reduce((acc: any, product: any) => {
    const {
      idProduct,
      sizeProduct,
      colorProduct,
      amountNewProduct,
      amountProduct,
    } = product;
    const key = `${idProduct}-${sizeProduct}-${colorProduct}`;

    if (acc[key]) {
      acc[key].amountNewProduct += amountNewProduct;
      acc[key].amountProduct += amountProduct;
    } else {
      acc[key] = { ...product };
    }

    return acc;
  }, {});

  const uniqueProducts = Object.values(groupedProducts) as Products[];

  const SelectedProduct = (id: string, color: string, size: string) => {
    const findProduct = uniqueProducts.find(
      (item) =>
        item.idProduct === id &&
        item.colorProduct === color &&
        item.sizeProduct === size
    );

    if (!findProduct) return;

    if (
      selectedProducts.some(
        (selected) =>
          selected.idProduct === id &&
          selected.colorProduct === color &&
          selected.sizeProduct === size
      )
    ) {
      setSelectedProducts((prev) =>
        prev.filter(
          (item) =>
            item.idProduct !== id &&
            item.colorProduct !== color &&
            item.sizeProduct !== size
        )
      );
    } else {
      setSelectedProducts((prev) => [
        ...prev,
        {
          amountNewProduct: findProduct.amountNewProduct,
          amountProduct: findProduct.amountProduct,
          cityProduct: findProduct.cityProduct,
          colorProduct: findProduct.colorProduct,
          gainMarkter: findProduct.gainMarkter,
          idProduct: findProduct.idProduct,
          imageProduct: findProduct.imageProduct,
          nameProduct: findProduct.nameProduct,
          priceCustomer: findProduct.priceCustomer,
          priceMarkter: findProduct.priceMarkter,
          priceProduct: findProduct.priceProduct,
          sizeProduct: findProduct.sizeProduct,
          storeProduct: findProduct.storeProduct,
          validity: findProduct.validity,
        },
      ]);
    }
  };

  const filteredProducts = uniqueProducts.filter(
    (product) =>
      product.nameProduct.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.colorProduct.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.idProduct.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.storeProduct.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sizeProduct.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const Body = () => {
    return (
      <div className="container mx-auto max-w-2xl">
        {loading ? (
          <div className="flex justify-center items-center h-[400px]">
            <Spinner size="lg" color="success" />
          </div>
        ) : (
          <>
            <input
              type="text"
              className="input mb-3"
              placeholder="... بحث"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="grid grid-cols-1">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((item, i) => (
                  <div
                    className={`border border-gray-200 ${
                      selectedProducts.some(
                        (selected) =>
                          selected.idProduct === item.idProduct &&
                          selected.colorProduct === item.colorProduct &&
                          selected.sizeProduct === item.sizeProduct
                      )
                        ? "border-gray-900"
                        : ""
                    } p-4 rounded-lg flex items-center justify-between mb-1`}
                    dir="rtl"
                    key={i}
                    onClick={() =>
                      SelectedProduct(
                        item.idProduct,
                        item.colorProduct,
                        item.sizeProduct
                      )
                    }
                  >
                    <div>
                      <p>
                        <span className="opacity-70 ml-1">إسم المنتج :</span>
                        <span>{item.nameProduct}</span>
                      </p>
                      <div className="flex items-center my-3">
                        <div className="flex items-center">
                          <p className="opacity-70 ml-1">اللون :</p>
                          <p
                            className="w-5 h-5 rounded-full"
                            style={{ backgroundColor: item.colorProduct }}
                          ></p>
                        </div>
                        <p className="mr-2">|</p>
                        <p className="mr-2">
                          <span className="opacity-70 ml-1">الحجم :</span>
                          <span>{item.sizeProduct}</span>
                        </p>
                      </div>
                      <div className="flex items-center">
                        <p>
                          <span className="opacity-70 ml-1">السعر :</span>
                          <span>
                            {item.validity === "Markter"
                              ? item.priceMarkter
                              : item.priceCustomer}
                            <span className="mr-1">د.ل</span>
                          </span>
                        </p>
                        <p className="mr-3">|</p>
                        <p className="mr-4">
                          <span className="opacity-70 ml-1">الكمية :</span>
                          <span>{item.amountNewProduct}</span>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-start gap-y-2 text-gray-500">
                      <Avatar
                        src={item.imageProduct}
                        className={`border-1 w-20 h-20 border-green-800 outline-2 outline-white relative -ml-2`}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <p className="opacity-60 text-center mt-28">
                  لا يوجد منتجات مطابقة
                </p>
              )}
            </div>
          </>
        )}
      </div>
    );
  };

  useEffect(() => {
    if (isInitialLoad.current && sessionData) {
      dispatch(fetDeliveryProducts(sessionData.email));
      isInitialLoad.current = false;
    }
  }, [dispatch, sessionData]);

  return (
    <div className="flex flex-col items-center bg-[var(--color-navbar)] min-h-screen w-full">
      <DataDelivery />
      <div className="bg-white rounded-ss-2xl rounded-se-2xl p-6 w-full h-screen pb-20">
        {Body()}
      </div>
      <Footer />
    </div>
  );
};

export default DeliveryPageStore;
