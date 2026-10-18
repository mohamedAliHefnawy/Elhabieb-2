import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Spinner, Button, Avatar, Textarea } from "@nextui-org/react";
import { RootState, AppDispatch } from "@/src/store";
import { fetchMoneyTreasuryById } from "@/features/moneyTreasurySlice";
import axios from "axios";
import { useParams } from "next/navigation";
import Alert from "@/Components/Alert";
import CryptoJS from "crypto-js";
import Link from "next/link";

const DetailsMoneyTreasury: React.FC = () => {
  const keyHash = process.env.NEXT_PUBLIC_KEY_HASH;
  const apiEndpoint = process.env.NEXT_PUBLIC_LINK_API;
  const { slug } = useParams() || "";
  const isInitialLoad = useRef(true);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [addOrMinusMoney, setAddOrMinusMoney] = useState<string>("+");

  const [formData, setFormData] = useState({
    valueMoney: 0,
    note: "لا يوجد أي ملاحظات",
    person: "محمد علي",
  });

  const [AllData, setAllData] = useState({
    _id: "",
    image: "",
    name: "",
    Active: true,
    dateAdded: "",
    timeAdded: "",
    money: [
      {
        valueMoney: 0,
        date: "",
        time: "",
        person: "",
        note: "",
      },
    ],
  });

  const handleChange = (e: any) => {
    const value = parseFloat(e.target.value.replace(/[^\d.]/g, "")) || 0;
    setFormData((prevData) => ({
      ...prevData,
      valueMoney: +(addOrMinusMoney + value.toString()),
    }));
  };

  const dispatch = useDispatch<AppDispatch>();
  const { moneyTreasury, loading } = useSelector(
    (state: RootState) => state.moneyTreasury
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!keyHash) {
      return;
    }

    const dataToEncrypt = {
      id: slug,
      ...formData,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
    };

    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(dataToEncrypt),
      keyHash
    ).toString();

    setIsSubmitting(true);

    try {
      const response = await axios.post(
        `${apiEndpoint}moneyTreasury/addMoney/${slug}`,
        {
          data: encryptedData,
        }
      );

      if (response.data === "ADDEDD_MONEY_SUCCESS") {
        setAllData((prevAllData) => ({
          ...prevAllData,
          money: [
            ...prevAllData.money,
            {
              valueMoney: +formData.valueMoney,
              date: new Date().toLocaleDateString(),
              time: new Date().toLocaleTimeString(),
              person: formData.person,
              note: formData.note || "لا يوجد أي ملاحظات",
            },
          ],
        }));
        Alert("success", "تم إضافة الأموال بنجاح إلي الخزينة");
        new Audio("/mp3/addSucessMoneyToWallet.mp3").play();
      } else if (response.data === "MONEYTREASURY_NOT_FOUND") {
        Alert("error", "توجد مشكلة في الإنترنت حاول تنشيط الصفحة");
        new Audio("/mp3/proplemInternet.mp3").play();
      }
    } catch (error) {
      console.error("Error submitting data", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const DataMoneyTreasury = () => {
    return (
      <div className="flex justify-between items-center">
        <div className="w-[50%]">
          <div className="mb-3">
            <Avatar src={AllData?.image} className="w-20 h-20" />
          </div>
          <div className="flex">
            <p className="ml-2 text-black opacity-50"> كود الخزينة : </p>
            <p className="opacity-95"> {AllData?._id} </p>
          </div>
          <div className="flex my-5">
            <p className="ml-2 text-black opacity-50"> الإسم : </p>
            <p className="opacity-95"> {AllData?.name} </p>
          </div>
          <div className="flex my-5">
            <p className="ml-2 text-black opacity-50"> أخر عملية : </p>
            <p
              className={`${
                AllData?.money.length > 0 &&
                AllData?.money[AllData?.money.length - 1].valueMoney > 0
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              <span>
                {AllData?.money.length > 0 &&
                  AllData?.money[AllData?.money.length - 1].valueMoney}
              </span>
              <span className="mr-1">د.ل</span>
            </p>
          </div>
          <div className="flex my-5">
            <p className="ml-2 text-black opacity-50"> أخر عملية بتاريخ : </p>
            <p className="opacity-95">
              {AllData?.money.length > 0 &&
                AllData?.money[AllData?.money.length - 1].date}
            </p>
          </div>
          <div className="flex my-5">
            <p className="ml-2 text-black opacity-50"> أخر عملية الوقت : </p>
            <p className="opacity-95">
              {AllData?.money.length > 0 &&
                AllData?.money[AllData?.money.length - 1].time}
            </p>
          </div>
          <div className="flex my-5">
            <p className="ml-2 text-black opacity-50">
              أخر عملية من خلال الموظف :
            </p>
            <p className="opacity-95">
              {AllData?.money.length > 0 &&
                AllData?.money[AllData?.money.length - 1].person}
            </p>
          </div>
        </div>
        <div className="w-[40%]">
          <form onSubmit={handleSubmit}>
            <p className="flex justify-center items-center gap-x-7 text-black bg-[var(--color-navbar)] opacity-60 p-5 rounded-3xl rounded-ee-none rounded-es-none">
              <span
                onClick={() => setAddOrMinusMoney("+")}
                className={`bg-white rounded-full w-6 h-6 flex justify-center items-center cursor-pointer ${
                  addOrMinusMoney === "+" ? "border border-blue-500" : ""
                }`}
              >
                +
              </span>
              <span>اضافه او خصم</span>
              <span
                onClick={() => setAddOrMinusMoney("-")}
                className={`bg-white rounded-full w-6 h-6 flex justify-center items-center cursor-pointer ${
                  addOrMinusMoney === "-" ? "border border-blue-500" : ""
                }`}
              >
                -
              </span>
            </p>
            <input
              type="text"
              id="valueMoney"
              name="valueMoney"
              className="input mt-2"
              placeholder="أدخل المبلغ المراد إضافته إلى المحفظة"
              value={formData.valueMoney}
              onChange={handleChange}
              required
            />

            <Textarea
              dir="rtl"
              variant="underlined"
              color="primary"
              name="note"
              defaultValue="لا يوجد أي ملاحظات"
              placeholder="لا يوجد أي ملاحظات"
              disableAnimation
              disableAutosize
              className="rounded-lg my-4 resize-y min-h-[60px] max-h-[60px] p-2"
              value={formData.note}
              onChange={(e) =>
                setFormData((prevData) => ({
                  ...prevData,
                  note: e.target.value,
                }))
              }
            />
            <Button
              className="h-14 w-[100%] my-3 opacity-70 rounded-full rounded-se-none rounded-es-none border-[var(--color-navbar)]"
              type="submit"
              variant="bordered"
              disabled={isSubmitting}
              isLoading={isSubmitting}
            >
              إضافة
            </Button>
          </form>
        </div>
      </div>
    );
  };

  const AllMoneyInMoneyTreasury = () => {
    return (
      <div>
        <div>
          <div className="flex items-center mt-4 mb-5 p-4 pr-10 pl-10 bg-primar shadow-lg shadow-[var(--color-navbar)] border-1 rounded-2xl text-black opacity-75">
            <div className="w-[100%] text-center text-black opacity-50">
              <p> المبلغ </p>
            </div>
            <div className="w-[100%] text-center text-black opacity-50">
              <p> الموظف </p>
            </div>
            <div className="w-[100%] text-center text-black opacity-50">
              <p> التاريخ </p>
            </div>
            <div className="w-[100%] text-center text-black opacity-50">
              <p> الوقت </p>
            </div>
            <div className="w-[100%] text-center text-black opacity-50">
              <p> ملاحظة </p>
            </div>
          </div>

          <div className="mb-14">
            {loading ? (
              <div className="flex justify-center items-center h-[400px]">
                <Spinner size="lg" color="success" />
              </div>
            ) : AllData?.money.length > 0 && AllData?.money[0].date ? (
              AllData?.money
                .slice()
                .reverse()
                .map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center mb-3 p-4 pr-10 pl-10 bg-[var(--color-body)] shadow rounded-2xl border-1 border-[var(--color-navbar)]"
                  >
                    <div className="w-[100%] text-center">
                      <p
                        className={`${
                          item.valueMoney > 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        <span>{item.valueMoney}</span>
                        <span className="mr-1">د.ل</span>
                      </p>
                    </div>
                    <div className="w-[100%] text-center">
                      <p> {item.person} </p>
                    </div>
                    <div className="w-[100%] text-center">
                      <p> {item.date} </p>
                    </div>
                    <div className="w-[100%] text-center">
                      <p> {item.time}</p>
                    </div>
                    {/* {item.note.split("فلوس طلبية")[1].split(" ")[1]} */}
                    <div className="w-[100%] text-center">
                      {item.note.startsWith("فلوس طلبية") ? (
                        <Link
                          href={`/dashboard/orders/${
                            item.note.split("فلوس طلبية")[1].split(" ")[1]
                          }`}
                          className="text-orange-400 underline"
                        >
                          {item.note}
                        </Link>
                      ) : (
                        <p> {item.note}</p>
                      )}
                    </div>
                  </div>
                ))
            ) : (
              <div className="flex justify-center items-center h-[400px] text-black opacity-50">
                لا توجد تحويلات حتى الآن .
              </div>
            )}
          </div>
          <div className="fixed z-50 bottom-0 flex items-center mb-3 p-4 pr-10 pl-10 bg-[var(--color-body)] shadow-lg rounded-2xl border-1 border-[var(--color-navbar)]">
            <p>إجمالي المبلغ </p>
            <p
              className={`mr-2 ${
                AllData?.money.length > 0 &&
                AllData.money.reduce((calc, i) => calc + i.valueMoney, 0) > 0
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              <span>
                {AllData.money.reduce((calc, i) => calc + i.valueMoney, 0)}
              </span>
              <span className="mr-1">د.ل</span>
            </p>
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    if (isInitialLoad.current && typeof slug === "string") {
      dispatch(fetchMoneyTreasuryById(slug));
      isInitialLoad.current = false;
    }
  }, [dispatch, slug]);

  useEffect(() => {
    if (moneyTreasury) {
      setAllData(moneyTreasury);
    }
  }, [moneyTreasury]);

  return (
    <div className="h-screen w-full bg-[var(--color-body)] border-1 border-[var(--color-navbar)] overflow-y-auto custom-scrollbar p-6 mt-1">
      <div dir="rtl">
        {loading ? (
          <div className="flex justify-center items-center h-[400px]">
            <Spinner size="lg" color="success" />
          </div>
        ) : (
          <>
            {DataMoneyTreasury()}
            {AllMoneyInMoneyTreasury()}
          </>
        )}
      </div>
    </div>
  );
};

export default DetailsMoneyTreasury;
