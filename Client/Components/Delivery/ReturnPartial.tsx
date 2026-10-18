import Alert from "@/Components/Alert";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Autocomplete,
  AutocompleteItem,
} from "@nextui-org/react";
import axios from "axios";
import { useState } from "react";
import CryptoJS from "crypto-js";
import { useRouter } from "next/navigation";

interface MoneyTreasury {
  _id: string;
  image: string;
  name: string;
  Active: boolean;
  dateAdded: string;
  timeAdded: string;
  money: [
    {
      valueMoney: number;
      date: string;
      time: string;
      person: string;
      note: string;
    }
  ];
}
export default function ReturnPartial({
  client,
  vaildity,
  orderId,
  delivery,
  products,
}: {
  client: string;
  vaildity: string;
  orderId: string;
  delivery: string;
  products: [
    {
      idProduct: string;
      nameProduct: string;
      colorProduct: string;
      sizeProduct: string;
      priceProduct: number;
      gainMarkter: number;
      priceMarkter: number;
      priceCustomer: number;
      imageProduct: string;
      storeProduct: string;
      cityProduct: string;
      amountProduct: number;
      amountNewProduct: number;
    }
  ];
}) {
  const keyHash = process.env.NEXT_PUBLIC_KEY_HASH;
  const apiEndpoint = process.env.NEXT_PUBLIC_LINK_API;
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [selectedMoneyTreasuries, setSelectedMoneyTreasuries] =
    useState<string>("");

  const [quantities, setQuantities] = useState(
    products.map((product) => product.amountProduct)
  );
  const [productChanges, setProductChanges] = useState(
    products.map((product, i) => ({
      productId: product.idProduct,
      sizeProduct: product.sizeProduct,
      cityProduct: product.cityProduct,
      storeProduct: product.storeProduct,
      colorProduct: product.colorProduct,
      productName: product.nameProduct,
      priceMarkter: product.priceMarkter,
      priceCustomer: product.priceCustomer,
      oldQuantity: product.amountProduct,
      newQuantity: product.amountProduct,
      oldGain: product.gainMarkter * product.amountProduct,
      newGain: product.gainMarkter * product.amountProduct,
      totalPriceNew:
        vaildity === "Markter"
          ? product.priceMarkter * product.amountProduct
          : product.priceCustomer * product.amountProduct,
    }))
  );

  const handleQuantityChange = (index: any, change: any) => {
    setQuantities((prevQuantities) =>
      prevQuantities.map((qty, i) => {
        if (i === index) {
          const newQty = qty + change;
          const clampedQty = Math.max(
            0,
            Math.min(newQty, products[i].amountProduct)
          );

          setProductChanges((prevChanges) =>
            prevChanges.map((change, j) => {
              if (j === index) {
                return {
                  ...change,
                  newQuantity: clampedQty,
                  newGain: products[i].gainMarkter * clampedQty,
                  totalPriceNew:
                    vaildity === "Markter"
                      ? change.priceMarkter * clampedQty
                      : change.priceCustomer * clampedQty,
                };
              }
              return change;
            })
          );

          return clampedQty;
        }
        return qty;
      })
    );
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    if (!keyHash) {
      return;
    }

    const dataToEncrypt = {
      idOrder: orderId,
      productChanges,
      delivery,
      selectedCase: "إسترجاع جزئي",
    };

    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(dataToEncrypt),
      keyHash
    ).toString();

    try {
      const response = await axios.post(`${apiEndpoint}delivery/edit`, {
        data: encryptedData,
      });

      if (response.data === "SAVE_SUSESS") {
        Alert("success", "تم تغيير حالة الطلبيه بنجاح");
        new Audio("/mp3/errorEditingInOrder.mp3").play();
        router.push("/delivery");
      }
    } catch (error) {
      console.error("Error submitting data", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div>
        <h2 className="text-2xl text-center mt-6 mb-3">محتويات الطلبية</h2>
        <table
          className="border-1 border-[var(--color-navbar)] p-4 w-[100%]"
          dir="rtl"
        >
          <thead className="border-1 border-[var(--color-navbar)] p-4">
            <tr className="border-1 border-[var(--color-navbar)] p-4">
              <th className="border-1 border-[var(--color-navbar)] p-4">
                المنتج
              </th>
              <th className="border-1 border-[var(--color-navbar)] p-4">
                السعر
              </th>
              <th className="border-1 border-[var(--color-navbar)] p-4 text-center">
                -</th>
              <th className="border-1 border-[var(--color-navbar)] p-4">
                الكمية
              </th>
              <th className="border-1 border-[var(--color-navbar)] p-4">+</th>
            </tr>
          </thead>
          <tbody>
            {products.map((item, i) => (
              <tr
                key={i}
                className={`border-1 border-[var(--color-navbar)] p-4 ${
                  quantities[i] < item.amountProduct ? "text-red-500" : ""
                }`}
              >
                <td className="border-1 border-[var(--color-navbar)] p-4 flex justify-center items-center gap-x-2">
                  <p>{item.nameProduct}</p>
                  <p
                    className="w-4 h-4"
                    style={{ backgroundColor: item.colorProduct }}
                  ></p>
                  <p>{item.sizeProduct}</p>
                </td>

                <td className="border-1 border-[var(--color-navbar)] p-4 text-center">
                  {vaildity === "Markter"
                    ? item.priceMarkter
                    : item.priceCustomer}
                </td>
                <td
                  onClick={() => handleQuantityChange(i, -1)}
                  className="border-1 border-[var(--color-navbar)] p-4 text-center"
                >
                  -
                </td>
                <td className="border-1 border-[var(--color-navbar)] p-4 text-center">
                  {quantities[i]}
                </td>
                <td
                  onClick={() => handleQuantityChange(i, 1)}
                  className="border-1 border-[var(--color-navbar)] p-4 text-center cursor-pointer"
                >
                  +
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Button
        className="bg-[var(--color-navbar)] border-1 w-[100%] h-12"
        onPress={() => handleSubmit()}
        isLoading={isSubmitting}
        disabled={isSubmitting}
      >
        تم
      </Button>
    </>
  );
}
