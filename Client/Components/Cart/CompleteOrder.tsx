import { fetchCities } from "@/features/citiesSlice";
import { AppDispatch, RootState } from "@/src/store";
import {
  Autocomplete,
  AutocompleteItem,
  Avatar,
  Input,
  Spinner,
  Textarea,
} from "@nextui-org/react";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Alert from "../Alert";
import axios from "axios";
import CryptoJS from "crypto-js";
import { useSession } from "next-auth/react";
import { decrementTotalProducts } from "@/features/cartSlice";

import { useRouter } from "next/navigation";
import { getValidityFromLocalStorage } from "../validate";
import getSessionData, { SessionData } from "@/contexts/SessionContext";
import useSessionData from "@/hooks/useSessionData";

interface ProductsInCart {
  _id: string;
  category: string;
  color: string;
  images: string;
  name: string;
  price: number;
  priceCustomer: number;
  priceMarkter: number;
  gainMarkter: number;
  size: string;
  amounts: [
    {
      city: string;
      store: string;
      amount: number;
      size: string;
      color: string;
    }
  ];
}

export default function CompleteOrder({
  products,
  onComplete,
}: {
  products: ProductsInCart[];
  onComplete: () => void;
}) {
  const keyHash = process.env.NEXT_PUBLIC_KEY_HASH;
  const apiEndpoint = process.env.NEXT_PUBLIC_LINK_API;
  const sessionData = useSessionData();

  const router = useRouter();
  const isInitialLoad = useRef(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const [quantities, setQuantities] = useState<number[]>(
    new Array(products.length).fill(1)
  );
  const { Cities = [], loading: citiesLoading } = useSelector(
    (state: RootState) => state.city
  );
  const [selectedCity, setSlectedCity] = useState("");
  const [selectedStore, setSlectedStore] = useState("");
  const [orderData, setOrderData] = useState<any[]>([]);
  const [client, setClient] = useState("");
  const [phoneMain, setPhoneMain] = useState("");
  const [phoneAlternative, setPhoneAlternative] = useState("");
  const [placeDetails, setPlaceDetails] = useState("");
  const [IsAmountsZero, setIsAmountZero] = useState(true);

  const handleQuantityChange = (index: number, value: number) => {
    const updatedQuantities = [...quantities];
    updatedQuantities[index] = value > 0 ? value : 1;
    setQuantities(updatedQuantities);
  };

  let totalCost = products.reduce((total, product, index) => {
    const price =
      sessionData?.validity === "Markter"
        ? parseFloat(product.priceMarkter.toString())
        : parseFloat(product.priceCustomer.toString());
    const quantity = quantities[index] || 1;
    return total + price * quantity;
  }, 0);

  let GainMarkter = products.reduce((total, product, index) => {
    const gainMarkter = parseFloat(product.gainMarkter.toString()) || 0;
    const quantity = quantities[index] || 1;
    return total + gainMarkter * quantity;
  }, 0);

  let GainAdmin = products.reduce((total, product, index) => {
    const price = parseFloat(product.price.toString()) || 0;
    const priceMarkter = parseFloat(product.priceMarkter.toString()) || 0;
    const priceClient = parseFloat(product.priceCustomer.toString()) || 0;
    const gainMarkter = parseFloat(product.gainMarkter.toString()) || 0;
    const quantity = quantities[index] || 1;

    return sessionData?.validity === "Markter"
      ? total + (priceMarkter - price - gainMarkter) * quantity
      : total + (priceClient - price) * quantity;
  }, 0);

  let priceDelivery =
    Cities.find((city) => city.name === selectedCity)?.prices.find(
      (price) => price.name === selectedStore
    )?.price ?? 0;

  const countOutOfStockProducts = (
    products: ProductsInCart[],
    selectedCity: string
  ): number => {
    return products.filter(
      (product) =>
        !product.amounts.some(
          (amount) => amount.city === selectedCity && amount.amount > 0
        )
    ).length;
  };

  const hasOutOfStockProducts = (
    products: ProductsInCart[],
    selectedCity: string
  ): boolean => {
    return products.some(
      (product) =>
        !product.amounts.some(
          (amount) => amount.city === selectedCity && amount.amount > 0
        )
    );
  };

  const collectOrderData = (
    products: ProductsInCart[],
    selectedCity: string,
    quantities: number[]
  ) => {
    return products
      .map((product, index) => {
        const amountInfo = product.amounts.find(
          (amount) =>
            amount.city === selectedCity &&
            amount.size === product.size &&
            amount.amount > 0
        );

        if (!amountInfo) return null;

        return {
          idProduct: product._id,
          nameProduct: product.name,
          colorProduct: product.color,
          sizeProduct: product.size,
          priceProduct: product.price,
          gainMarkter: product.gainMarkter,
          priceMarkter: product.priceMarkter,
          priceCustomer: product.priceCustomer,
          imageProduct: product.images,
          storeProduct: amountInfo.store,
          cityProduct: amountInfo.city,
          amountProduct: quantities[index] || 1,
        };
      })
      .filter(Boolean);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    if (!keyHash) {
      return;
    }
    const dataToEncrypt = {
      markter: sessionData?.email,
      vaildity: sessionData?.validity,
      client: client,
      phoneMain: phoneMain,
      phoneAlternative: phoneAlternative,
      city: selectedCity,
      placeDetails: placeDetails,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      priceProducts: totalCost,
      priceDelivery: priceDelivery,
      gainAdmin: GainAdmin,
      gainMarkter: sessionData?.validity === "Markter" ? GainMarkter : 0,
      totalPrice: priceDelivery + totalCost,
      products: orderData,
      casesOrder: [
        {
          case: "في إنتظار الموافقة",
          date: new Date().toLocaleDateString(),
          time: new Date().toLocaleTimeString(),
        },
      ],
      chat: [],

      company: sessionData?.validity === "Markter" && {
        name: sessionData?.company.name,
        image: sessionData?.company.image,
        phone: sessionData?.company.phone,
        color: sessionData?.company.color,
      },
    };

    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(dataToEncrypt),
      keyHash
    ).toString();

    try {
      const response = await axios.post(`${apiEndpoint}order/addOrder`, {
        data: encryptedData,
      });

      if (response.data === "ADDED_SUSESS") {
        Alert("success", "تم إنشاء الطلبية بنجاح");
        new Audio("/mp3/addeddOrderSucess.mp3").play();
        dispatch(decrementTotalProducts(orderData.length));
        onComplete();
        totalCost = 0;
        priceDelivery = 0;
        router.push("/");
      }
    } catch (error) {
      console.error("Error submitting data", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (isInitialLoad.current) {
      dispatch(fetchCities());

      isInitialLoad.current = false;
    }
  }, [dispatch]);

  useEffect(() => {
    if (Cities && Cities.length > 0) {
      setSlectedCity(Cities[0].name || "");
      if (Cities[0].prices && Cities[0].prices.length > 0) {
        setSlectedStore(Cities[0].prices[0].name);
      }
    }
  }, [Cities]);

  useEffect(() => {
    const data = collectOrderData(products, selectedCity, quantities);
    setOrderData(data);
  }, [products, selectedCity, quantities]);

  useEffect(() => {
    const hasOutOfStockProduct = products.some(
      (product) =>
        !product.amounts.some(
          (amount) => amount.city === selectedCity && amount.amount > 0
        )
    );

    if (hasOutOfStockProduct) {
      setIsAmountZero(false);
    } else {
      setIsAmountZero(true);
    }
  }, [products, selectedCity]);

  return (
    <div className="bg-[#F8FAFC] border-2 border-dashed border-gray-300">
      <p className="text-2xl text-right p-5">ملخص الطلبية</p>

      {products.map((product, index) => (
        <div
          key={product._id}
          className="p-5 border-b flex items-center justify-between border-gray-300"
        >
          <div className="flex items-start">
            <div>
              <Avatar
                src={product.images}
                className={`w-24 h-24 mr-3 ${
                  product.amounts.some(
                    (fill) =>
                      fill.city === selectedCity &&
                      fill.size === product.size &&
                      fill.amount > 0
                  )
                    ? "border-2 border-green-500"
                    : "border-2 border-red-500"
                }`}
              />
            </div>
            <div className="overflow-hidden">
              <p className="text-ellipsis overflow-hidden whitespace-nowrap mb-1">
                {product.name}
              </p>
              <div className="flex items-center mb-1">
                <p>{product.size}</p>
                <p
                  style={{ backgroundColor: product.color }}
                  className="w-4 h-4 rounded-full ml-2 opacity-60"
                ></p>
              </div>
              <div className="flex items-center">
                <p className="mr-1">د.ل</p>
                <p className="font-bold">
                  {sessionData?.validity === "Markter"
                    ? product?.priceMarkter
                    : product?.priceCustomer}
                </p>
              </div>
            </div>
          </div>
          <div className="w-[50%]">
            {(() => {
              const availableStore = product.amounts.find(
                (fill) =>
                  fill.city === selectedCity &&
                  fill.size === product.size &&
                  fill.amount > 0
              );

              return (
                <input
                  id={`quantity-${product._id}`}
                  type="number"
                  defaultValue={1}
                  min="1"
                  max={availableStore ? availableStore.amount : 1}
                  value={quantities[index]}
                  onChange={(e) =>
                    handleQuantityChange(index, parseInt(e.target.value, 10))
                  }
                  className="input border border-gray-300 rounded-md text-center"
                />
              );
            })()}
          </div>
        </div>
      ))}

      <div className="w-[100%] flex justify-center items-center">
        <Autocomplete
          label="أختر المنطقة"
          className="[w-[100%] border-dashed border-2 border-gray-500 cursor-pointer"
          selectedKey={selectedStore}
          onSelectionChange={(key) => {
            setSlectedStore(key !== null ? String(key) : "");
          }}
          isClearable={false}
        >
          {(
            Cities.find((cityFind) => cityFind.name === selectedCity)?.prices ||
            []
          ).map((place) => (
            <AutocompleteItem key={place.name} value={place.name}>
              {place.name}
            </AutocompleteItem>
          ))}
        </Autocomplete>

        <Autocomplete
          label="أختر المدينة"
          className="[w-[100%] border-dashed border-2 border-gray-500 ml-1 cursor-pointer"
          selectedKey={selectedCity}
          onSelectionChange={(key) => {
            if (key !== null) {
              setSlectedCity(String(key));
            } else {
              setSlectedCity("");
            }
          }}
          isClearable={false}
          menuTrigger="focus"
        >
          {Cities.map((cityItem) => (
            <AutocompleteItem key={cityItem.name} value={cityItem.name}>
              {cityItem.name}
            </AutocompleteItem>
          ))}
        </Autocomplete>
      </div>
      <div className="w-[100%] px-2 mt-3">
        <Input
          type="text"
          label="إسم العميل"
          variant="bordered"
          color="default"
          className="mt-2"
          value={client}
          onChange={(e) => setClient(e.target.value)}
        />
        <div className="flex gap-x-1 mt-1">
          <Input
            type="number"
            label="رقم الهاتف الأساسي"
            variant="bordered"
            color="default"
            value={phoneMain.toString()}
            onChange={(e) => setPhoneMain(e.target.value)}
          />
          <Input
            type="number"
            label="رقم الهاتف الإحتياطي"
            variant="bordered"
            color="default"
            value={phoneAlternative.toString()}
            onChange={(e) => setPhoneAlternative(e.target.value)}
          />
        </div>

        <Textarea
          label="العنوان بالتفصيل"
          variant="bordered"
          color="default"
          className="mt-1"
          value={placeDetails}
          onChange={(e) => setPlaceDetails(e.target.value)}
        />
      </div>

      <div className="flex items-center justify-between w-[100%] opacity-60 p-5 py-0 mt-8">
        <p className="flex mr-3">
          <span className="mr-1">د.ل</span>
          <span>{priceDelivery.toFixed(2)}</span>
        </p>
        <p>سعر التوصيل</p>
      </div>

      <div className="flex items-center justify-between w-[100%] opacity-60 p-5 py-0 mt-8">
        <p className="flex mr-3 text-xl">
          <span className="mr-1">د.ل</span>
          <span>{totalCost.toFixed(2)}</span>
        </p>
        <p>السعر الاجمالي</p>
      </div>

      {countOutOfStockProducts(products, selectedCity) > 0 || !IsAmountsZero ? (
        <div
          onClick={() => {
            Alert("error", "توجد بعض المنتجات غير متوفره في هذه المدينة");
            new Audio("/mp3/someProductsNoExited.mp3").play();
          }}
          className="mt-10 text-center border-t-2 border-dashed border-gray-300 p-5 hover:text-red-400 cursor-pointer"
        >
          تــأكيد الطلبية
        </div>
      ) : !isSubmitting ? (
        phoneMain === "" ||
        phoneAlternative === "" ||
        placeDetails.trim() === "" ||
        client.trim() === "" ? (
          <div
            onClick={() => {
              Alert("error", "يجب كتابه أرقام الهواتف والعنوان بالتفصيل");
              new Audio("/mp3/mustEnterPhonesAndAddress.mp3").play();
            }}
            className="mt-10 text-center border-t-2 border-dashed border-gray-300 p-5 hover:text-red-400 cursor-pointer"
          >
            <span> تــأكيد الطلبية</span>
          </div>
        ) : (
          <div
            onClick={() => handleSubmit()}
            className="mt-10 text-center border-t-2 border-dashed border-gray-300 p-5 hover:text-[var(--color-matg3er)] cursor-pointer"
          >
            <span> تــأكيد الطلبية</span>
          </div>
        )
      ) : (
        <div className="mt-10 text-center border-t-2 border-dashed border-gray-300 p-5 hover:text-[var(--color-matg3er)]-pointer">
          <Spinner size="md" color="warning" />
        </div>
      )}
    </div>
  );
}
