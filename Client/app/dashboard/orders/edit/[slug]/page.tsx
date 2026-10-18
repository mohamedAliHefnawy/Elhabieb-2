"use client";

// REACT
import { useEffect, useRef, useState } from "react";
import React from "react";
import { fetchOrderByID } from "@/features/ordersSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/src/store";
import { useRouter } from "next/navigation";
import CryptoJS from "crypto-js";
import axios from "axios";

// COMPONENTS
import NavBar from "@/Components/Dashboard/NavBar";
import SideBar from "@/Components/Dashboard/SideBar";
import SizeScreen from "@/Components/Dashboard/SizeScreen";
import Alert from "@/Components/Alert";
import { Autocomplete, AutocompleteItem, Button } from "@nextui-org/react";
import { fetchMoneyTreasuries } from "@/features/moneyTreasurySlice";
import MoadelReturnPartial from "@/Components/Dashboard/orders/moadelReturnPartial";

export default function Edit({ params }: { params: { slug: string } }) {
  const keyHash = process.env.NEXT_PUBLIC_KEY_HASH;
  const apiEndpoint = process.env.NEXT_PUBLIC_LINK_API;
  const dispatch = useDispatch<AppDispatch>();
  const isInitialLoad = useRef(true);
  const [selectedMoneyTreasuries, setSelectedMoneyTreasuries] =
    useState<string>("");

  const [iseSubmiting, setIseSubmiting] = useState(false);

  const [situations, setSituations] = useState<
    { situation: string; date: string; time: string }[]
  >([]);

  const router = useRouter();

  const { Order = null } = useSelector((state: RootState) => state.order);

  const { moneyTreasuries } = useSelector(
    (state: RootState) => state.moneyTreasury
  );

  const handleSituationClick = (status: string) => {
    const currentDate = new Date();

    setSituations((prevSituations) => {
      const deliveryStatuses = ["تم الإسترجاع", "إسترجاع جزئي"];
      const acceptanceStatuses = ["تم القبول", "تم الرفض"];

      if (deliveryStatuses.includes(status)) {
        const newSituations = prevSituations.filter(
          (item) => !deliveryStatuses.includes(item.situation)
        );

        return [
          ...newSituations,
          {
            situation: status,
            date: currentDate.toLocaleDateString(),
            time: currentDate.toLocaleTimeString(),
          },
        ];
      } else if (acceptanceStatuses.includes(status)) {
        const newSituations = prevSituations.filter(
          (item) => !acceptanceStatuses.includes(item.situation)
        );

        return [
          ...newSituations,
          {
            situation: status,
            date: currentDate.toLocaleDateString(),
            time: currentDate.toLocaleTimeString(),
          },
        ];
      } else {
        const existingSituationIndex = prevSituations.findIndex(
          (item) => item.situation === status
        );

        if (existingSituationIndex !== -1) {
          return prevSituations.filter((item) => item.situation !== status);
        } else {
          return [
            ...prevSituations,
            {
              situation: status,
              date: currentDate.toLocaleDateString(),
              time: currentDate.toLocaleTimeString(),
            },
          ];
        }
      }
    });
  };

  const SituationItem = ({ status, situations }: any) => {
    const isActive = situations.some(
      (item: { situation: string }) => item.situation === status
    );

    return (
      <div className="flex flex-col items-center">
        {status !== "مع الشحن" && status !== "في إنتظار الموافقة" ? (
          status === "إسترجاع جزئي" ? (
            <MoadelReturnPartial
              client={Order?.client || ""}
              vaildity={Order?.vaildity || ""}
              date={Order?.date || ""}
              time={Order?.time || ""}
              phoneMain={Order?.phoneMain || ""}
              phoneAlternative={Order?.phoneAlternative || ""}
              orderId={params.slug || ""}
              moneyTreasuries={moneyTreasuries}
              products={
                Order?.products || [
                  {
                    idProduct: "",
                    nameProduct: "",
                    colorProduct: "",
                    sizeProduct: "",
                    priceProduct: 0,
                    gainMarkter: 0,
                    priceMarkter: 0,
                    priceCustomer: 0,
                    imageProduct: "",
                    storeProduct: "",
                    cityProduct: "",
                    amountProduct: 0,
                    amountNewProduct: 0,
                  },
                ]
              }
            />
          ) : (
            <div
              className={`border-1 border-[var(--color-navbar)] w-36 h-16 rounded-full flex justify-center items-center hover:cursor-pointer ${
                isActive ? "bg-[var(--color-navbar)]" : ""
              }`}
              onClick={() => handleSituationClick(status)}
            >
              {status}
            </div>
          )
        ) : (
          <div
            className={`border-1 border-[var(--color-navbar)] w-36 h-16 rounded-full flex justify-center items-center  ${
              isActive ? "bg-[var(--color-navbar)]" : ""
            }`}
          >
            {status}
          </div>
        )}
        <p className="w-[100%] text-center">
          {isActive
            ? situations.find(
                (item: { situation: string }) => item.situation === status
              )?.date || "-/--/----"
            : "-/--/----"}
        </p>
        <p className="w-[100%] text-center">
          {isActive
            ? situations.find(
                (item: { situation: string }) => item.situation === status
              )?.time || "--:--"
            : "--:--"}
        </p>
        {status === "تم إستلام الكاش" && isActive && (
          <Autocomplete
            variant="underlined"
            color="primary"
            label="إختر المحفظة"
            className="max-w-xs"
            selectedKey={selectedMoneyTreasuries}
            onSelectionChange={(key) =>
              setSelectedMoneyTreasuries(key as string)
            }
          >
            {moneyTreasuries.map((moneyTreasury, i) => (
              <AutocompleteItem
                key={moneyTreasury.name}
                value={moneyTreasury.name}
              >
                {moneyTreasury.name}
              </AutocompleteItem>
            ))}
          </Autocomplete>
        )}
      </div>
    );
  };

  const Tabs = ({ situations }: any) => {
    const statuses = [
      "في إنتظار الموافقة",
      "تم القبول",
      "تم الرفض",
      "مع الشحن",
      // "تم التوصيل",
      "تم الإسترجاع",
      "إسترجاع جزئي",
      "تم إستلام الكاش",
    ];

    const radius = 200;
    const angle = 360 / statuses.length;

    return (
      <div className="flex justify-center items-center h-screen relative">
        {statuses.map((status, index) => {
          const rotation = angle * index;
          const translateX = radius * Math.cos((rotation * Math.PI) / 180);
          const translateY = radius * Math.sin((rotation * Math.PI) / 180);

          return (
            <div
              key={status}
              className="flex flex-col items-center absolute"
              style={{
                transform: `translate(${translateX}px, ${translateY}px)`,
                transition: "transform 0.3s",
              }}
            >
              <SituationItem status={status} situations={situations} />
              <div className="mt-2 w-2 h-2 rounded-full bg-black" />
            </div>
          );
        })}
        <div className="absolute w-2 h-2 rounded-full bg-transparent border-2 border-black" />
      </div>
    );
  };

  const Body = ({ situations }: any) => (
    <div className="h-screen w-[100%] bg-[var(--color-body)] border-1 border-[var(--color-navbar)] overflow-y-auto custom-scrollbar flex flex-col justify-center items-center p-6 mt-1">
      <p className="text-lg w-[100%] flex justify-end mb-20">
        <span className="opacity-75" dir="rtl">
          {Order?.delivery !== "" ? (
            Order?.delivery
          ) : (
            <span>لا يوجد بعد !</span>
          )}
        </span>
        <span className="ml-2 text-black opacity-50 " dir="rtl">
          مندوب التوصيل |
        </span>
      </p>
      <Tabs situations={situations} />
      <Button
        onClick={SubmitSituations}
        variant="bordered"
        color={selectedMoneyTreasuries === "" ? "danger" : "default"}
        disabled={selectedMoneyTreasuries === "" ? true : false}
        className="w-[100%] h-12 py-7 mt-10 rounded-full"
        isLoading={iseSubmiting}
      >
        تعديل حالة الطلبية
      </Button>
    </div>
  );

  const SubmitSituations = async () => {
    setIseSubmiting(true);
    if (!keyHash) {
      return;
    }

    const dataToEncrypt = {
      orderId: params.slug,
      moneyTreasury: selectedMoneyTreasuries,
      casesOrder: situations.map((item) => ({
        case: item.situation,
        date: item.date,
        time: item.time,
      })),
    };

    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(dataToEncrypt),
      keyHash
    ).toString();

    try {
      const response = await axios.post(`${apiEndpoint}order/editOrder`, {
        data: encryptedData,
      });
      if (response.data === "SAVE_SUSESS") {
        Alert("success", "تم تغيير حالة الطلبيه بنجاح");
        new Audio("/mp3/changeCaseOrderSucess.mp3").play();
        router.push("/dashboard/orders/");
      } else if (response.data === "FALIED") {
        Alert("error", "توجد مشكلة في الإنترنت حاول تنشيط الصفحة");
        new Audio("/mp3/proplemInternet.mp3").play();
      }
    } catch (error) {
      console.error("Error submitting data:", error);
    } finally {
      setIseSubmiting(false);
    }
  };

  useEffect(() => {
    if (isInitialLoad.current) {
      dispatch(fetchOrderByID(params.slug));
      dispatch(fetchMoneyTreasuries());
      isInitialLoad.current = false;
    }
  }, [dispatch]);

  useEffect(() => {
    if (Order && Order.casesOrder) {
      setSituations(
        Order.casesOrder.map((orderCase) => ({
          situation: orderCase.case,
          date: orderCase.date,
          time: orderCase.time,
        }))
      );
    }
  }, [Order]);

  useEffect(() => {
    if (moneyTreasuries && moneyTreasuries.length > 0) {
      setSelectedMoneyTreasuries(moneyTreasuries[0].name);
    }
  }, [moneyTreasuries]);

  return (
    <>
      <div className="w-full h-screen flex max-2xl:flex max-xl:flex lg:flex md:hidden sm:hidden max-sm:hidden">
        <div className="w-[84%] mr-1 flex flex-col">
          <NavBar />
          <Body situations={situations} />
        </div>
        <div className="w-[16%] flex flex-col">
          <SideBar />
        </div>
      </div>
      <SizeScreen />
    </>
  );
}
