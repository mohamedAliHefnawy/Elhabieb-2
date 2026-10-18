"use client";

//REACT
import Barcode from "react-barcode";
import { DNA } from "react-loader-spinner";
import { useRouter } from "next/navigation";
import CryptoJS from "crypto-js";

//COMPONENTS

import { Avatar, Pagination, Spinner } from "@nextui-org/react";
import { useEffect, useRef, useState } from "react";
import { fetchOrderByID } from "@/features/ordersSlice";
import { AppDispatch, RootState } from "@/src/store";
import { useDispatch, useSelector } from "react-redux";
import Alert from "@/Components/Alert";
import getSessionData, { SessionData } from "@/contexts/SessionContext";
import { fetchOrdersPosById } from "@/features/posSlice";
import { AlertCircle, CheckCircle2, PencilRuler } from "lucide-react";
import axios from "axios";
import ModelReturnPartial from "./ModelReturnPartial";
import useSessionData from "@/hooks/useSessionData";

export default function PageEditOrder({ slug }: { slug: string }) {
  const keyHash = process.env.NEXT_PUBLIC_KEY_HASH;
  const apiEndpoint = process.env.NEXT_PUBLIC_LINK_API;
  const isInitialLoad = useRef(true);
  const router = useRouter();

  const dispatch = useDispatch<AppDispatch>();
  const sessionData = useSessionData();
  const [selectedCase, setSelectedCase] = useState("راجع كلي");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const { Order, loading, error } = useSelector(
    (state: RootState) => state.pos2
  );

  if (error) {
    Alert("error", "توجد مشكلة في الإنترنت حاول تنشيط الصفحة");
    new Audio("/mp3/proplemInternet.mp3").play();
    return;
  }

  const DataOrder = () => {
    return (
      <div className="flex ">
        <div className="w-[50%]">
          <div className="flex">
            <p className="ml-2 text-black opacity-50"> رقم الطلبية : </p>
            <p> {Order?.NumberInvoice} </p>
          </div>
          <div className="flex  my-5">
            <p className="ml-2 text-black opacity-50"> كود الطلبية : </p>
            <p> {Order?.CodeInvoice} </p>
          </div>
          <div className="flex  my-5">
            <p className="ml-2 text-black opacity-50"> المخزن : </p>
            <p>
              {Order?.city} | {Order?.store}
            </p>
          </div>
          <div className="flex  my-5">
            <p className="ml-2 text-black opacity-50"> الإجمالي : </p>
            <p> {Order?.totalPrice} د.ل </p>
          </div>
          <div className="flex  my-5">
            <p className="ml-2 text-black opacity-50"> خصم : </p>
            <p> {Order?.discount} %</p>
          </div>
          <div className="flex  my-5">
            <p className="ml-2 text-black opacity-50"> الإجمالي بعد الخصم : </p>
            <p> {Order?.totalPriceAfterDisount} د.ل </p>
          </div>
        </div>
        <div>
          <div className="flex items-center">
            <div className="flex items-center gap-x-2">
              <Avatar src={Order?.imagePos} className="w-16 h-16" />
              <div>
                <p>{Order?.namePos}</p>
                <p>{Order?.phonePos}</p>
              </div>
            </div>
          </div>

          <div className="flex my-5">
            <p className="ml-2 text-black opacity-50"> التاريخ : </p>
            <p className=""> {Order?.dateInvoice} </p>
          </div>
          <div className="flex my-5">
            <p className="ml-2 text-black opacity-50"> الوقت : </p>
            <p className=""> {Order?.timeInvoice} </p>
          </div>

          <div className="flex my-5">
            <p className="ml-2 text-black opacity-50"> حالة الطلبية : </p>
            <p className="">
              {Order?.status === "InPos" && (
                <p className="text-orange-500">
                  أموالها ما زالت في الخزينة الخاصه بك .
                </p>
              )}
              {Order?.status === "InAdmin" && (
                <p className="text-green-500">
                  تم تحويل أموالها للادمن بنجاح .
                </p>
              )}
              {Order?.status === "ReturnedAll" && (
                <p className="text-red-500">راجع كلي .</p>
              )}
              {Order?.status === "ReturnedPartial" && (
                <p className="text-red-500">راجع جزئي .</p>
              )}
            </p>
          </div>

          {Order?.status === "InPos" && (
            <div className="flex items-center my-5">
              <p className="ml-2 text-black opacity-50"> تغيير الحالة </p>
              <div
                className={`flex flex-col items-center text-red-500 cursor-pointer p-3 px-5 ${
                  selectedCase === "راجع كلي" ? "border-2 border-dashed" : ""
                }`}
                onClick={() => setSelectedCase("راجع كلي")}
              >
                <CheckCircle2 />
                <p>راجع كلي</p>
              </div>

              <div
                className={`flex flex-col items-center text-blue-500 cursor-pointer p-3 px-5  ${
                  selectedCase === "راجع جزئي"
                    ? "border-2 border-dashed border-gray-300"
                    : ""
                }`}
              >
                <ModelReturnPartial
                  codeInvoice={Order.CodeInvoice}
                  date={Order.dateInvoice}
                  time={Order.timeInvoice}
                  products={Order.products}
                  city={Order.city}
                  store={Order.store}
                  emailPos={Order.namePos}
                  colorPos={Order.colorCompany}
                />
              </div>

              {isSubmitting ? (
                <div
                  className={`flex flex-col items-center p-3 px-5`}
                  style={{ color: sessionData?.colorCompany }}
                >
                  <Spinner color="default" size="md" />
                </div>
              ) : (
                <div
                  className={`flex flex-col items-center cursor-pointer p-3 px-5`}
                  style={{ color: sessionData?.colorCompany }}
                  onClick={handleSubmit}
                >
                  <PencilRuler strokeWidth={1} /> <p>تعديل</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  const ProductsOrder = () => {
    return (
      <div>
        <div>
          <div className="flex items-center mt-4 mb-5 p-5 pr-10 pl-10 border-1 rounded-2xl text-black opacity-75">
            <div className="w-full text-center text-black opacity-50">
              <p> الصورة </p>
            </div>
            <div className="w-full text-center text-black opacity-50">
              <p> إسم المنتج </p>
            </div>
            <div className="w-full text-center text-black opacity-50">
              <p> اللون </p>
            </div>
            <div className="w-full text-center text-black opacity-50">
              <p> المقاس </p>
            </div>
            <div className="w-full text-center text-black opacity-50">
              <p> الكمية </p>
            </div>
            <div className="w-full text-center text-black opacity-50">
              <p> سعر المنتج </p>
            </div>
            <div className="w-full text-center text-black opacity-50">
              <p> الإجمالي </p>
            </div>
            <div className="w-full text-center text-black opacity-50">
              <p> المخزن </p>
            </div>
          </div>

          <div className="max-h-60 overflow-y-auto">
            {Order?.products.map((product, i) => (
              <div
                key={i}
                className="flex items-center mb-1 p-4 pr-10 pl-10 rounded-2xl border-1 text-black "
                style={{
                  borderColor: `${product.amountNewProduct !== null && "red"}`,
                }}
              >
                <div className="w-full flex justify-center">
                  <Avatar size="lg" src={product.imageProduct} />
                </div>
                <div className="w-full text-center">
                  <p> {product.nameProduct} </p>
                </div>
                <div className="w-full flex justify-center">
                  <p
                    className="w-4 h-4"
                    style={{ backgroundColor: product.colorProduct }}
                  ></p>
                </div>
                <div className="w-full text-center">
                  <p> {product.sizeProduct} </p>
                </div>
                <div className="w-full text-center">
                  <div
                    className={`${
                      product.amountNewProduct !== null
                        ? "line-through text-gray-500"
                        : ""
                    }`}
                  >
                    <p>{product.amountProduct}</p>
                  </div>
                  <p>
                    {product.amountNewProduct && (
                      <>{product.amountNewProduct}</>
                    )}
                  </p>
                </div>
                <div className="w-full text-center">
                  <p>
                    <span>{product.priceProduct}</span>
                    <span className="mr-1">د.ل</span>
                  </p>
                </div>
                <div className="w-full text-center">
                  <p>
                    <span>{product.priceProduct * product.amountProduct}</span>
                    <span className="mr-1">د.ل</span>
                  </p>
                </div>
                <div className="w-full text-center">
                  <p>
                    {Order.city} | {Order.store}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };
  const Body = () => {
    return (
      <div className="p-6 mt-1" dir="rtl">
        <DataOrder />
        <ProductsOrder />
      </div>
    );
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    if (!keyHash) {
      return;
    }

    const dataToEncrypt = {
      slug,
      email: sessionData?.email,
      selectedCase,
    };

    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(dataToEncrypt),
      keyHash
    ).toString();

    try {
      const response = await axios.post(`${apiEndpoint}pos/editVoice`, {
        data: encryptedData,
      });

      if (response.data === "SUCCESS") {
        Alert("success", "تم تغيير حالة الطلبيه بنجاح");
        new Audio("/mp3/changeCaseOrderSucess.mp3").play();
        router.push("/pos");
      }
    } catch (error) {
      console.error("Error submitting data", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (isInitialLoad.current && typeof slug === "string" && sessionData) {
      dispatch(fetchOrdersPosById(`${slug}^${sessionData?.email}`));
      isInitialLoad.current = false;
    }
  }, [dispatch, sessionData]);

  return (
    <>
      <div className="w-full">
        <div className="mr-1 w-full">
          {loading ? (
            <div className="flex items-center justify-center min-h-screen">
              <DNA
                visible={true}
                height="80"
                width="80"
                ariaLabel="dna-loading"
                wrapperStyle={{}}
                wrapperClass="dna-wrapper"
              />
            </div>
          ) : (
            <Body />
          )}
        </div>
      </div>
    </>
  );
}
