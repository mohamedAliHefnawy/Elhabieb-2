"use client";

// REACT
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

// NEXT UI
import { Card, CardBody, Spinner } from "@nextui-org/react";

// COMPONENTS
import { fetchMoneyTransfers } from "@/features/moneyTransfersSlice";
import { AppDispatch, RootState } from "@/src/store";
import MoadelAllmoney from "./modelAllmoney";
import Alert from "@/Components/Alert";

interface MoneyTransfers {
  _id: string;
  namerSender: string;
  validitySender: string;
  date: string;
  time: string;
  money: [
    {
      money: number;
      date: string;
      time: string;
      orderId: string;
      numberOrder: number;
      codeOrder: string;
    }
  ];
}

export default function PageMoneyTransfers() {
  const dispatch = useDispatch<AppDispatch>();
  const isInitialLoad = useRef(true);

  const { moneyTransfers, loading, error } = useSelector(
    (state: RootState) => state.moneyTransfers
  );

  if (error) {
    Alert("error", "توجد مشكلة في الإنترنت حاول تنشيط الصفحة");
    new Audio("/mp3/proplemInternet.mp3").play();
    return;
  }

  const [searchText, setSearchText] = useState("");
  const [allMoneyTransfer, setAllMoneyTransfer] = useState<MoneyTransfers[]>(
    []
  );

  const filteredMoneyTransfers = allMoneyTransfer.filter((item) =>
    item.namerSender.toLowerCase().includes(searchText.toLowerCase())
  );

  const Update = (idMoneyTransfer: string) => {
    const filters = allMoneyTransfer.filter(
      (item) => item._id !== idMoneyTransfer
    );
    setAllMoneyTransfer(filters);
  };

  const HeaderFilters = () => {
    return (
      <div className="w-[100%] mb-7">
        <input
          className="w-[90%] input"
          type="text"
          placeholder=" بحث ..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <p className="mt-4 opacity-75 text-center">
          Total {moneyTransfers.length} MoneyTransfers
        </p>
      </div>
    );
  };

  const TableMoneyTransfers = () => {
    return (
      <div className="gap-2 grid grid-cols-2 sm:grid-cols-4">
        {filteredMoneyTransfers.map((item, i) => (
          <Card key={i} shadow="sm">
            <CardBody className="overflow-visible p-5 ">
              <div className=" flex flex-col items-start text-md">
                <p className="mb-3">
                  <span>إسم المرسل | </span>
                  <span className="font-bold">
                    {item.namerSender.split("@")[0]}
                  </span>
                </p>
                <p className="mb-3">
                  <span>رتبة المرسل | </span>
                  <span className="font-bold">{item.validitySender}</span>
                </p>
                <p className="mb-3">
                  <span>التاريخ | </span>
                  <span className="font-bold">{item.date}</span>
                </p>
                <p className="" style={{ direction: "rtl" }}>
                  <span>الوقت | </span>
                  <span className="font-bold">{item.time}</span>
                </p>
              </div>
              <MoadelAllmoney
                moneyDetails={item.money || []}
                idMoneyTransfer={item._id}
                Update={Update}
                validity={item.validitySender}
              />
            </CardBody>
          </Card>
        ))}
      </div>
    );
  };

  useEffect(() => {
    if (isInitialLoad.current) {
      dispatch(fetchMoneyTransfers());
      isInitialLoad.current = false;
    }
  }, [dispatch]);

  useEffect(() => {
    if (moneyTransfers) {
      setAllMoneyTransfer(moneyTransfers);
    }
  }, [moneyTransfers]);

  return (
    <div className="h-screen w-full bg-[var(--color-body)] border-1 border-[var(--color-navbar)] overflow-y-auto custom-scrollbar p-6 mt-1">
      {HeaderFilters()}

      {filteredMoneyTransfers.length === 0 && (
        <p className="text-center opacity-65 mt-80">لا توجد تحويلات مالية </p>
      )}

      <div dir="rtl">
        {loading ? (
          <div className="flex justify-center items-center h-[400px]">
            <Spinner size="lg" color="success" />
          </div>
        ) : (
          TableMoneyTransfers()
        )}
      </div>
    </div>
  );
}
