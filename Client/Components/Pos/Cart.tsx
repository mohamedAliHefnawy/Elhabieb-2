"use client";

import { Button, Input } from "@nextui-org/react";
import { BadgeMinus, BadgePlus, ShoppingCart, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import {
  selectProductsInCart,
  removeProduct,
  incrementProductAmount,
  decrementProductAmount,
} from "@/features/posSlice";
import Cookies from "js-cookie";

import { useDispatch, useSelector } from "react-redux";
import ButtonCreateOrder from "./ButtonCreateOrder";
import getSessionData, { SessionData } from "@/contexts/SessionContext";
import Alert from "../Alert";
import useSessionData from "@/hooks/useSessionData";

export default function Cart() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMoneyPay, setSelectedMoneyPay] = useState("");
  const productsInCart = useSelector(selectProductsInCart);
  const dispatch = useDispatch();
  const totalProducts = useSelector(selectProductsInCart);
  const [discount, setDiscount] = useState<Number>(0);
  const sessionData = useSessionData();
  const colorCompany = Cookies.get("colorPos");

  const TotalPrice = productsInCart.reduce(
    (calc, alt) => calc + alt.price * alt.amount,
    0
  );
  const TotalPriceAfterDiscount = TotalPrice - (TotalPrice * +discount) / 100;

  const toggleCart = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className="fixed z-50 bottom-12 right-0 cursor-pointer">
        <p
          className={`absolute z-50 bottom-0 right-0 mr-5 mb-3 rounded-full flex justify-center items-center text-white w-6 h-6`}
          style={{ backgroundColor: colorCompany }}
        >
          {totalProducts.length}
        </p>

        <div
          onClick={toggleCart}
          className="absolute z-40 bottom-0 right-0 mr-6 mb-4 bg-white rounded-full flex justify-center items-center border-2 p-7 w-10 h-10"
          style={{ borderColor: colorCompany }}
        >
          <span style={{ color: colorCompany }}>
            <ShoppingCart size={28} strokeWidth={1} />
          </span>
        </div>
      </div>

      <div
        className={`fixed z-50 top-0 right-0 w-80 h-full bg-white shadow-lg p-5 overflow-y-auto transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        dir="rtl"
      >
        <button
          onClick={toggleCart}
          className="absolute top-4 left-4 font-semibold text-lg"
          style={{ color: colorCompany }}
        >
          ×
        </button>

        <h2 className="text-xl font-semibold mb-10">إنشاء طلبية</h2>
        <div className="border-b-1 max-h-[50%] overflow-y-auto">
          {productsInCart.length > 0 ? (
            productsInCart.map((item) => (
              <div
                key={item._id}
                className="flex items-center gap-x-4 border-t py-4"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="rounded-2xl w-24 h-24"
                />

                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <p className="font-semibold text-lg" dir="rtl">
                      {item.name}
                    </p>
                    <p
                      className="cursor-pointer text-red-400 hover:text-red-700 transition-colors duration-200"
                      onClick={() =>
                        dispatch(
                          removeProduct({
                            _id: item._id,
                            size: item.size,
                            color: item.color,
                          })
                        )
                      }
                    >
                      <Trash2 strokeWidth={1} />
                    </p>
                  </div>

                  <div className="text-sm text-gray-600 opacity-70 flex items-center">
                    <p
                      className="w-4 h-4 rounded-full ml-2"
                      style={{ backgroundColor: item.color }}
                    ></p>
                    <p> | {item.size} </p>
                  </div>

                  <div className="flex justify-between items-center mt-2">
                    <p className="text-lg" style={{ color: colorCompany }}>
                      <span>{item.price}</span>
                      <span className="mr-1">د.ل</span>
                    </p>

                    <div className="flex items-center gap-x-2">
                      <p
                        className="cursor-pointer"
                        onClick={() =>
                          dispatch(
                            incrementProductAmount({
                              _id: item._id,
                              size: item.size,
                              color: item.color,
                            })
                          )
                        }
                      >
                        <BadgePlus size={24} strokeWidth={1} />
                      </p>
                      <p className="text-lg font-semibold">{item.amount}</p>
                      <p
                        className="cursor-pointer"
                        onClick={() =>
                          dispatch(
                            decrementProductAmount({
                              _id: item._id,
                              size: item.size,
                              color: item.color,
                            })
                          )
                        }
                      >
                        <BadgeMinus size={24} strokeWidth={1} />
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center opacity-55 py-4 border-t-1">
              لا توجد منتجات
            </p>
          )}
        </div>
        <div>
          <Input
            startContent="%"
            type="number"
            label="خصم"
            className="mt-3"
            variant="bordered"
            value={discount?.toString()}
            onChange={(e) => {
              let value = +e.target.value;
              value = Math.max(0, Math.min(100, value));
              setDiscount(value);
            }}
          />
        </div>
        <div className="mt-4 ">
          <p>
            <span className="opacity-70 ml-1"> الإجمالي : </span>
            <span>{TotalPrice} د.ل</span>
          </p>
          <p className="mt-2 text-lg" style={{ color: colorCompany }}>
            <span className="opacity-70 ml-1"> الإجمالي بعد الخصم : </span>
            <span> {TotalPriceAfterDiscount} د.ل </span>
          </p>
        </div>
        <div className="mt-4">
          <p className="mb-2 mr-1">إختر طريقة الدفع</p>
          <div className="flex gap-x-2">
            {["فوادفون كاش", "كاش"].map((item) => (
              <p
                onClick={() => setSelectedMoneyPay(item)}
                className={`opacity-60  p-3 border-2 border-dashed rounded-3xl cursor-pointer`}
                style={{
                  borderColor: colorCompany,
                  backgroundColor:
                    selectedMoneyPay === item ? `${colorCompany}85` : "", // يستخدم 80 لجعل الشفافية 50%
                }}
              >
                {item}
              </p>
            ))}
          </div>
        </div>
        <div>
          {totalProducts.length > 0 && selectedMoneyPay !== "" ? (
            <ButtonCreateOrder
              namePos={sessionData?.email || ""}
              imagePos={sessionData?.image || ""}
              phonePos={sessionData?.phone || ""}
              phoneCompany={sessionData?.phoneCompany || ""}
              colorCompany={sessionData?.colorCompany || ""}
              moneyTreasury={selectedMoneyPay}
              city={sessionData?.city || ""}
              store={sessionData?.store || ""}
              discount={+discount}
              totalPrice={TotalPrice}
              totalPriceAfterDiscount={TotalPriceAfterDiscount}
              products={totalProducts}
            />
          ) : (
            <Button
              onClick={() => {
                if (totalProducts.length === 0) {
                  Alert("error", "لا توجد منتجات في السلة");
                } else if (selectedMoneyPay === "") {
                  Alert("error", "من فضلك إختر طريقة الدفع");
                }
              }}
              className="w-full mt-5 rounded-full text-white border border-white outline-2"
              style={{
                backgroundColor: colorCompany,
                outlineColor: colorCompany,
              }}
            >
              إنشاء طلبية
            </Button>
          )}
        </div>
      </div>
    </>
  );
}
