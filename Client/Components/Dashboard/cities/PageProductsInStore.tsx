import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Avatar, Spinner } from "@nextui-org/react";
import { RootState, AppDispatch } from "@/src/store";
import { fetchProductsWithStore } from "@/features/citiesSlice";

import { usePathname } from "next/navigation";
import Alert from "@/Components/Alert";
import ModelConvertProducts from "./ModelConvertProducts";

interface GroupedProduct {
  productId: string;
  color: string;
  image: string;
  sizes: {
    size: string;
    city: string;
    store: string;
    amount: number;
    _id: string;
  }[];
}

interface ProductsSelected {
  productId: string;
  color: string;
  image: string;
  sizes: {
    size: string;
    city: string;
    store: string;
    amount: number;
    _id: string;
  }[];
}

const PageProductsInStore: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const isInitialLoad = useRef(true);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const {
    Cities = [],
    decryptedData,
    store,
    city,
    loading,
    error,
  } = useSelector((state: RootState) => state.city);

  if (error) {
    Alert("error", "توجد مشكلة في الإنترنت حاول تنشيط الصفحة");
    new Audio("/mp3/proplemInternet.mp3").play();
    return;
  }

  const path = usePathname();
  const lastTwoIds = path.split("/").slice(-2).join("-");
  const [selectedProducts, setSelectedProducts] = useState<GroupedProduct[]>(
    []
  );

  const filteredCities = (Cities || []).filter((city) =>
    city.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const HeaderFilters = () => (
    <div className="flex flex-col mb-10">
      <div className="flex justify-between items-center mb-4">
        <ModelConvertProducts
          products={selectedProducts}
          idCity={lastTwoIds.split("-")[0]}
          idStore={lastTwoIds.split("-")[1]}
        />

        <div className="w-[95%] ml-1">
          <input
            className="w-full input"
            type="text"
            placeholder="بحث ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <div className="mr-2 text-black opacity-60 text-sm flex justify-end">
        <p>Total {filteredCities.length} Products</p>
      </div>
    </div>
  );

  const TableCities = () => {
    const filteredData = decryptedData.filter((product) => {
      return (
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.details.some((detail) =>
          detail.sizes.some((size) => size.size.includes(searchQuery))
        )
      );
    });

    const groupedProducts = filteredData.reduce<Record<string, GroupedProduct>>(
      (acc, product) => {
        product.details.forEach((detail) => {
          const key = `${product._id}-${detail.color}`;

          if (!acc[key]) {
            acc[key] = {
              productId: product._id,
              color: detail.color,
              image: "",
              sizes: [],
            };
          }
          detail.sizes.forEach((size: any) => {
            if (size.city === city && size.store === store) {
              acc[key].sizes.push(size);
            }
          });
        });
        return acc;
      },
      {}
    );

    const SelectProduct = (id: string, color: string) => {
      const FindProductInSourse = Object.values(groupedProducts).find(
        (item) => item.productId === id && item.color === color
      );

      setSelectedProducts((prev) => {
        const isProductSelected = prev.some(
          (item) => item.productId === id && item.color === color
        );

        if (isProductSelected) {
          return prev.filter((item) => item.productId !== id);
        } else {
          return [
            // ...prev,
            {
              color: FindProductInSourse!.color,
              productId: FindProductInSourse!.productId,
              sizes: FindProductInSourse!.sizes,
              image: decryptedData.find((p) => p._id === id)?.images[0] ?? "",
            },
          ];
        }
      });
    };

    return (
      <div className="grid grid-cols-4 gap-2">
        {Object.values(groupedProducts).map((group) => {
          const isSelected = selectedProducts.some(
            (product) =>
              product.productId === group.productId &&
              product.color === group.color
          );

          return (
            <div
              key={group.productId}
              onClick={() => SelectProduct(group.productId, group.color)}
              className={`relative p-4 shadow-sm rounded-2xl cursor-pointer text-black  ${
                isSelected ? "border-1 border-blue-400" : "border-1"
              }`}
            >
              <div className="flex justify-center">
                <Avatar
                  src={
                    decryptedData.find((p) => p._id === group.productId)
                      ?.images[0]
                  }
                  className="w-20 h-20"
                />
              </div>
              <p
                style={{ backgroundColor: group.color }}
                className="w-9 h-9 rounded-full mb-2"
              ></p>
              <div className="flex flex-col">
                {group.sizes.map((size) => (
                  <p key={size._id}>
                    الحجم: {size.size} - الكمية: {size.amount}
                  </p>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  useEffect(() => {
    if (isInitialLoad.current) {
      dispatch(fetchProductsWithStore(lastTwoIds));
      isInitialLoad.current = false;
    }
  }, [dispatch, lastTwoIds]);

  return (
    <div className="h-screen w-full bg-[var(--color-body)] border-1 border-[var(--color-navbar)] overflow-y-auto custom-scrollbar p-6 mt-1">
      {HeaderFilters()}

      <div dir="rtl">{TableCities()}</div>
      <div className="w-[100%] mt-28 flex justify-center items-center">
        {decryptedData.length === 0 && (
          <p className="opacity-60">لا توجد منتجات في هذا المخزن</p>
        )}
      </div>
    </div>
  );
};

export default PageProductsInStore;
