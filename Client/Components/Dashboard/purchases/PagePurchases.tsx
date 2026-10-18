"use client";

// REACT
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

// COMPONENTS & STORE
import { RootState, AppDispatch } from "@/src/store";
import { fetchProducts } from "@/features/productSlice";
import { fetchCities } from "@/features/citiesSlice";
import { fetchMoneyTreasuries } from "@/features/moneyTreasurySlice";
import { fetchSuppliers } from "@/features/supplierSlice";
import CryptoJS from "crypto-js";

import Alert from "@/Components/Alert";
import ModelTableProduct from "./ModelTableProduct";

// Next Ui
import {
  Autocomplete,
  AutocompleteItem,
  Avatar,
  Button,
  Spinner,
} from "@nextui-org/react";
import axios from "axios";

interface TypeData {
  _id: string;
  name: string;
  price: number;
  images: [string];
  details: [
    {
      color: string;
      sizes: [
        {
          size: string;
          city: string;
          store: string;
          amount: number;
        }
      ];
    }
  ];
}

interface TypeDataMoroo {
  id: string;
  color: string;
  size: string;
  amount: number;
  price: number;
}

const PagePurchases: React.FC = () => {
  const keyHash = process.env.NEXT_PUBLIC_KEY_HASH;
  const apiEndpoint = process.env.NEXT_PUBLIC_LINK_API;

  const dispatch = useDispatch<AppDispatch>();
  const isInitialLoad = useRef(true);

  const [droppedProducts, setDroppedProducts] = useState<TypeData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSlectedCity] = React.useState("");
  const [selectedStore, setSlectedStore] = React.useState("");
  const [selectedMoneyTreasury, setSlectedMoneyTreasury] = React.useState("");
  const [selectedSupplier, setSelectedSupplier] = React.useState("");
  const [productData, setProductData] = useState<TypeDataMoroo[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const { products = [], loading: productsLoading } = useSelector(
    (state: RootState) => state.product
  );
  const { Cities = [], loading: citiesLoading } = useSelector(
    (state: RootState) => state.city
  );
  const { moneyTreasuries, loading: moneyTreasuriesLoading } = useSelector(
    (state: RootState) => state.moneyTreasury
  );
  const { suppliers, loading: suppliersLoading } = useSelector(
    (state: RootState) => state.supplier
  );

  const TotalMoneyPurchases = productData.reduce(
    (calc, i) => calc + i.amount * i.price,
    0
  );

  const handleDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    product: any
  ) => {
    event.dataTransfer.setData("product", JSON.stringify(product));
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const productData = event.dataTransfer.getData("product");
    const product = JSON.parse(productData);

    const exists = droppedProducts.some((p) => p._id === product._id);
    if (exists) {
      Alert("warning", "المنتج موجود بالفعل");
      new Audio("/mp3/productExited.mp3").play();
    } else {
      setDroppedProducts((prevProducts: any) => [...prevProducts, product]);
      Alert("success", "تم الإضافة بنجاح");
      new Audio("/mp3/addSucess.mp3").play();
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleClick = (product: any) => {
    const exists = droppedProducts.some((p) => p._id === product._id);
    if (exists) {
      Alert("warning", "المنتج موجود بالفعل");
      new Audio("/mp3/productExited.mp3").play();
    } else {
      setDroppedProducts((prevProducts: any) => [...prevProducts, product]);
      Alert("success", "تم الإضافة بنجاح");
      new Audio("/mp3/addSucess.mp3").play();
    }
  };

  const handleRemoveProduct = (productId: string) => {
    setDroppedProducts((prevProducts) =>
      prevProducts.filter((product) => product._id !== productId)
    );
  };

  const AllProducts = products.map((product) => {
    const mainProductDetails = {
      _id: product._id,
      name: product.name,
      price: product.price,
      priceMarkter: product.priceMarkter,
      priceCustomer: product.priceCustomer,
      colors: product.colors,
      images: product.images,
      discrubtion: product.discrubtion,
      active: product.active,
      catogry: product.catogry,
      dateAdded: product.dateAdded,
      timeAdded: product.timeAdded,
      numberSelles: product.numberSelles,
      details: product.details,
    };

    const subProducts = product.products.map((subProduct) => ({
      _id: subProduct._id,
      name: subProduct.name,
      price: subProduct.price,
      priceMarkter: subProduct.priceMarkter,
      priceCustomer: subProduct.priceCustomer,
      colors: subProduct.colors,
      images: subProduct.images,
      discrubtion: subProduct.discrubtion,
      active: subProduct.active,
      catogry: subProduct.catogry,
      dateAdded: subProduct.dateAdded,
      timeAdded: subProduct.timeAdded,
      numberSelles: subProduct.numberSelles,
      details: subProduct.details,
    }));

    return [mainProductDetails, ...subProducts];
  });
  const flattenedProducts = AllProducts.flat();

  const filteredProducts = flattenedProducts.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSave = (
    newData: Array<{
      id: string;
      color: string;
      size: string;
      amount: number;
      price: number;
    }>
  ) => {
    setProductData((prevData) => {
      const updatedData = [...prevData];

      newData.forEach((newProduct) => {
        const existingProductIndex = updatedData.findIndex(
          (product) =>
            product.id === newProduct.id &&
            product.size === newProduct.size &&
            product.color === newProduct.color
        );

        if (existingProductIndex !== -1) {
          updatedData[existingProductIndex] = {
            ...updatedData[existingProductIndex],
            amount: newProduct.amount,
          };
        } else {
          updatedData.push(newProduct);
        }
      });

      return updatedData;
    });
  };

  const DivDrag = () => {
    return (
      <div className="w-[100%]  border-dashed border-2 border-[var(--color-navbar)] p-2 py-5">
        <input
          type="text"
          placeholder="بحث عن منتج..."
          className="input mb-2"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="grid grid-cols-3 gap-3 ">
          {filteredProducts.map((item) => (
            <div
              key={item._id}
              draggable
              onDragStart={(event) => handleDragStart(event, item)}
              onClick={() => handleClick(item)}
              className="border-2 border-dashed border-[var(--color-navbar)] cursor-pointer flex flex-col items-center w-[100%] p-2"
            >
              <Avatar src={item.images[0]} alt="" className="h-28 w-28" />
              <div className="w-full p-4 text-ellipsis overflow-hidden whitespace-nowrap">
                <p className="text-center">{item.name}</p>
                <div className="flex items-end justify-evenly mt-4 bg-blue-50 py-4">
                  <div className="flex items-end text-blue-500">
                    <p className="mb-1 mr-1">د.ل</p>
                    <p className="text-2xl">{item.price}</p>
                    <p className="mb-[2px]">.00</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {filteredProducts.length === 0 && (
          <p className="text-center w-[100%] opacity-60 mt-4">
            لا يوجد هذا المنتج
          </p>
        )}
      </div>
    );
  };

  const DivDrop = () => {
    return (
      <div className="w-[100%]">
        <div
          className="w-[100%] flex flex-col items-center border-dashed border-2 border-[var(--color-navbar)] p-4 py-14"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <div className="w-[100%] grid grid-cols-3 gap-3">
            {droppedProducts.map((product) => (
              <div
                key={product._id}
                className="relative border-2 border-dashed border-[var(--color-navbar)] flex flex-col items-center justify-center p-2"
              >
                <Avatar src={product.images[0]} alt="" className="h-28 w-28" />
                <div className="w-full p-4 text-ellipsis overflow-hidden whitespace-nowrap">
                  <p className="text-center">{product.name}</p>
                </div>

                <button
                  className="absolute top-2 right-2 bg-red-500  text-white rounded-full p-2 opacity-55 hover:bg-red-700 transition duration-300"
                  onClick={() => handleRemoveProduct(product._id)}
                >
                  حذف
                </button>

                <ModelTableProduct
                  id={product._id}
                  name={product.name}
                  image={product.images[0]}
                  price={product.price}
                  details={product.details}
                  onSave={handleSave}
                />
              </div>
            ))}
          </div>
          {droppedProducts.length === 0 && (
            <p className="text-center w-[100%] ">لا توجد منتجات مسحوبة</p>
          )}
        </div>

        <div className="w-[100%] flex justify-center items-center mt-1 ">
          <Autocomplete
            label="أختر المخزن"
            className="[w-[100%] border-dashed border-2 border-[var(--color-navbar)] cursor-pointer"
            selectedKey={selectedStore}
            onSelectionChange={(key) => {
              setSlectedStore(key !== null ? String(key) : "");
            }}
          >
            {(
              Cities.find((cityFind) => cityFind.name === selectedCity)
                ?.stores || []
            ).map((store) => (
              <AutocompleteItem key={store.nameStore} value={store.nameStore}>
                {store.nameStore}
              </AutocompleteItem>
            ))}
          </Autocomplete>

          <Autocomplete
            label="أختر المدينة"
            className="[w-[100%] border-dashed border-2 border-[var(--color-navbar)] ml-1 cursor-pointer"
            selectedKey={selectedCity}
            onSelectionChange={(key) => {
              if (key !== null) {
                setSlectedCity(String(key));
              } else {
                setSlectedCity("");
              }
            }}
          >
            {Cities.map((cityItem) => (
              <AutocompleteItem key={cityItem.name} value={cityItem.name}>
                {cityItem.name}
              </AutocompleteItem>
            ))}
          </Autocomplete>
        </div>
        <div className="w-[100%] flex justify-center items-center mt-1 ">
          <Autocomplete
            label="إختر المحفظة"
            className="[w-[100%] border-dashed border-2 border-[var(--color-navbar)] cursor-pointer flex justify-center"
            selectedKey={selectedMoneyTreasury}
            onSelectionChange={(key) => {
              setSlectedMoneyTreasury(key !== null ? String(key) : "");
            }}
          >
            {moneyTreasuries.map((item) => (
              <AutocompleteItem key={item.name} value={item.name}>
                {item.name}
              </AutocompleteItem>
            ))}
          </Autocomplete>
        </div>
        <div className="w-[100%] flex justify-center items-center mt-1 ">
          <Autocomplete
            label="إختر المورد"
            className="[w-[100%] border-dashed border-2 border-[var(--color-navbar)] cursor-pointer flex justify-center"
            selectedKey={selectedSupplier}
            onSelectionChange={(key) => {
              setSelectedSupplier(key !== null ? String(key) : "");
            }}
          >
            {suppliers.map((item) => (
              <AutocompleteItem key={item.name} value={item.name}>
                {item.name}
              </AutocompleteItem>
            ))}
          </Autocomplete>
        </div>
      </div>
    );
  };

  const handleSubmit = async () => {
    if (!keyHash) {
      return;
    }

    const dataToEncrypt = {
      selectedCity,
      selectedStore,
      selectedMoneyTreasury,
      selectedSupplier,
      productData,
      TotalMoneyPurchases,
    };

    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(dataToEncrypt),
      keyHash
    ).toString();

    setIsSubmitting(true);

    try {
      const response = await axios.post(`${apiEndpoint}purchase/addpurchase`, {
        data: encryptedData,
      });

      if (response.data === "ADDED_SUSESS") {
        Alert("success", "تم إنشاء الفاتورة بنجاح");
        new Audio("/mp3/createPurshesSucess.mp3").play();

        setDroppedProducts([]);
        setSelectedSupplier("");
        setSlectedMoneyTreasury("");
        setSlectedStore("");
        setSlectedCity("");
      }
    } catch (error) {
      console.error("Error submitting data", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (isInitialLoad.current) {
      dispatch(fetchProducts());
      dispatch(fetchCities());
      dispatch(fetchMoneyTreasuries());
      dispatch(fetchSuppliers());
      isInitialLoad.current = false;
    }
  }, [dispatch]);

  return (
    <>
      <div className="h-screen w-full bg-[var(--color-body)] border border-[var(--color-navbar)] overflow-y-auto custom-scrollbar p-6 mt-1 ">
        <div className="flex justify-between items-start gap-x-2">
          {DivDrag()}
          {DivDrop()}
        </div>
        {selectedCity !== "" &&
          selectedStore !== "" &&
          selectedMoneyTreasury !== "" &&
          selectedSupplier !== "" && (
            <Button
              variant="solid"
              color="default"
              className="w-[100%] h-14 rounded-none mt-3"
              onClick={handleSubmit}
            >
              {isSubmitting ? (
                <Spinner color="primary" size="sm" />
              ) : (
                <p> إتمام عملية المشتريات</p>
              )}
            </Button>
          )}
      </div>
      <div className="bg-[var(--color-body)]  fixed right-[20%] bottom-[10%] flex items-center h-16 rounded-ss-full rounded-es-full">
        <div className="flex mr-3 bg-[var(--color-navbar)] p-5 rounded-ss-full rounded-es-full">
          <p className="mr-1">د.ل</p>
          <p>{TotalMoneyPurchases}</p>
        </div>
        <p dir="rtl" className="opacity-55 p-3">
          إجمالي الفاتورة
        </p>
      </div>
    </>
  );
};

export default PagePurchases;
