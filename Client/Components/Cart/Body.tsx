import React, { useEffect, useRef, useState } from "react";
import SelectAllItems from "./SelectAllItems";
import ProductInCart from "./ProductInCart";
import CompleteOrder from "./CompleteOrder";
import {
  decrementTotalProducts,
  fetchProductsInCartUser,
} from "@/features/cartSlice";
import { AppDispatch, RootState } from "@/src/store";
import { useDispatch, useSelector } from "react-redux";
import Alert from "../Alert";
import axios from "axios";
import CryptoJS from "crypto-js";
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

export default function BodyCart() {
  const keyHash = process.env.NEXT_PUBLIC_KEY_HASH as string;
  const apiEndpoint = process.env.NEXT_PUBLIC_LINK_API;
  const sessionData = useSessionData();

  const [selectedAll, setSelectedAll] = useState(false);
  const [selectedItems, setSelectedItems] = useState<boolean[]>([]);
  const [cartProducts, setCartProducts] = useState<ProductsInCart[]>([]);
  const dispatch = useDispatch<AppDispatch>();
  const isInitialLoad = useRef(true);
  const { items } = useSelector(
    (state: RootState) => state.cart
  ) as unknown as { items: ProductsInCart[] };

  const handleSelectAll = () => {
    const newState = !selectedAll;
    setSelectedAll(newState);
    setSelectedItems(new Array(items.length).fill(newState));
  };

  const handleSelectItem = (index: number) => {
    const updatedItems = [...selectedItems];
    updatedItems[index] = !updatedItems[index];
    setSelectedItems(updatedItems);

    setSelectedAll(updatedItems.every((item) => item));
  };

  const handleDeleteSelectedItems = async () => {
    const selectedItemsData = cartProducts
      .filter((_, index) => selectedItems[index])
      .map((item) => ({
        id: item._id,
        size: item.size,
        color: item.color,
      }));

    const dataToEncrypt = {
      selectedItemsData,
      user: sessionData?.email,
    };
    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(dataToEncrypt),
      keyHash
    ).toString();

    try {
      const response = await axios.post(
        `${apiEndpoint}cart/deleteProductsWithCart`,
        {
          data: encryptedData,
        }
      );

      if (response.data === "Done") {
        Alert("success", "تم حذف العناصر المحددة بنجاح");
        new Audio("/mp3/deleteElementsSucess.mp3").play();

        dispatch(decrementTotalProducts(selectedItemsData.length));

        setCartProducts((prevProducts) =>
          prevProducts.filter(
            (product) =>
              !selectedItemsData.some(
                (selectedItem) =>
                  selectedItem.id === product._id &&
                  selectedItem.size === product.size &&
                  selectedItem.color === product.color
              )
          )
        );
      }
    } catch (error) {
      console.error("Error submitting data", error);
    }
  };

  const selectedCount = selectedItems.filter((item) => item).length;

  const handleCompleteOrder = () => {
    setCartProducts([]);
  };

  useEffect(() => {
    if (isInitialLoad.current && sessionData?.email) {
      dispatch(fetchProductsInCartUser(sessionData?.email as string));
      isInitialLoad.current = false;
    }
  }, [dispatch, sessionData?.email]);

  useEffect(() => {
    setCartProducts(items);
  }, [items]);

  return (
    <div className="xl:px-5 lg:px-5 md:px-5 sm:px-1 max-sm:px-1 pt-24 xl:flex lg:flex md:flex items-start">
      <div className="xl:w-[70%] lg:w-[70%] md:w-[70%] sm:w-[100%] max-sm:w-[100%] xl:mb-24 lg:mb-24 md:mb-24 ">
        <SelectAllItems
          selectedAll={selectedAll}
          handleSelectAll={handleSelectAll}
          selectedCount={selectedCount}
          productsLenght={cartProducts.length}
          handleDeleteSelectedItems={handleDeleteSelectedItems}
        />

        <ProductInCart
          selectedItems={selectedItems}
          handleSelectItem={handleSelectItem}
          products={cartProducts}
        />
      </div>
      <div className="xl:w-[30%] lg:w-[30%] md:w-[30%] sm:w-[100%] max-sm:w-[100%] xl:ml-1 lg:ml-1 md:ml-1 xl:mt-0 lg:mt-0 md:mt-0 sm:mt-3 max-sm:mt-3 mb-24">
        <CompleteOrder
          products={cartProducts}
          onComplete={handleCompleteOrder}
        />
      </div>
    </div>
  );
}
