"use client";

// REACT
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";

// NEXT UI
import { Card, CardBody, Spinner, Avatar } from "@nextui-org/react";

// COMPOENTS && STORE
import { fetchDeliveries } from "@/features/userSlice";
import { AppDispatch, RootState } from "@/src/store";
import Alert from "@/Components/Alert";

export default function PageDeliverySecurity() {
  const dispatch = useDispatch<AppDispatch>();
  const isInitialLoad = useRef(true);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const { users, loading, error } = useSelector(
    (state: RootState) => state.user
  );

  if (error) {
    Alert("error", "توجد مشكلة في الإنترنت حاول تنشيط الصفحة");
    new Audio("/mp3/proplemInternet.mp3").play();
    return;
  }

  const filtereDeliveries = users.filter(
    (user) =>
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone.toString().includes(searchQuery) ||
      user.firstName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const HeaderFilters = () => {
    return (
      <div className="w-[100%]">
        <input
          className="w-full input"
          type="text"
          placeholder="... بحث "
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <p className="mt-4 mb-5 opacity-70 text-center">
          Total {filtereDeliveries.length} Delivery{" "}
        </p>
      </div>
    );
  };

  const TableDeliveries = () => {
    return (
      <div className="grid grid-cols-4 gap-2 w-[100%] my-3">
        {filtereDeliveries.map((item, i) => (
          <Card key={i} shadow="sm">
            <CardBody className="overflow-visible p-5 text-lg">
              <Link
                className="w-[100%] flex justify-center"
                href={`/dashboard/deliverySecurity/${item._id}`}
              >
                <Avatar
                  src={item.image}
                  alt="لا يوجد صورة"
                  className="w-20 h-20 outline-white border-2 border-green-800"
                />
              </Link>

              <div className="flex justify-start my-2">
                <p className="opacity-75">إسم المندوب :</p>
                <p className="mr-2">{item.email.split("@")[0]}</p>
              </div>
              <div className="flex justify-start my-2">
                <p className="opacity-75">رقم الهاتف :</p>
                <p className="mr-2">{item.phone}</p>
              </div>
              <div className="flex justify-start my-2">
                <p className="opacity-75">عدد الطلبات :</p>
                <p className="mr-2">
                  {item.securityDelivery.idsIOrders.length}
                </p>
              </div>
              <div className="flex justify-start my-2">
                <p className="opacity-75">الأموال :</p>
                <div className="mr-2 flex">
                  <p>
                    {item.securityDelivery.money
                      .filter((item) => item.status === "أموال متوقعة")
                      .reduce((calc, alt) => calc + alt.money, 0)}
                  </p>
                  <p className="mr-1">د.ل</p>
                </div>
              </div>
              <Link
                href={`/dashboard/deliverySecurity/${item._id}`}
                className="opacity-90 rounded-full bg-[var(--color-navbar)] border-1 w-[100%] mt-2 py-3 text-black flex justify-center"
              >
                المخزن
              </Link>
            </CardBody>
          </Card>
        ))}
      </div>
    );
  };

  useEffect(() => {
    if (isInitialLoad.current) {
      dispatch(fetchDeliveries());
      isInitialLoad.current = false;
    }
  }, [dispatch]);

  return (
    <div className="h-screen w-full bg-[var(--color-body)] border border-[var(--color-navbar)] overflow-y-auto custom-scrollbar p-6 mt-1">
      {HeaderFilters()}
      <div dir="rtl">
        {loading ? (
          <div className="flex justify-center items-center h-[400px]">
            <Spinner size="lg" color="success" />
          </div>
        ) : (
          TableDeliveries()
        )}
      </div>
    </div>
  );
}
