import Alert from "@/Components/Alert";
import { fetchCities } from "@/features/citiesSlice";
import { AppDispatch, RootState } from "@/src/store";
import {
  Modal,
  ModalContent,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Autocomplete,
  AutocompleteItem,
  ModalHeader,
} from "@nextui-org/react";
import axios, { all } from "axios";
import { Check } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CryptoJS from "crypto-js";

interface Products {
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
  validity: string;
}

export default function ModelReturnProductToStore({
  products,
  idDelivery,
}: {
  products: Products[];
  idDelivery: string;
}) {
  const keyHash = process.env.NEXT_PUBLIC_KEY_HASH;
  const apiEndpoint = process.env.NEXT_PUBLIC_LINK_API;
  const dispatch = useDispatch<AppDispatch>();
  const isInitialLoad = useRef(true);

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [selectedCity, setSlectedCity] = React.useState("");
  const [selectedStore, setSlectedStore] = React.useState("");
  const [quantities, setQuantities] = useState<
    {
      idProduct: string;
      quantity: number;
      colorProduct: string;
      sizeProduct: string;
    }[]
  >([]);

  const { Cities = [], loading } = useSelector(
    (state: RootState) => state.city
  );

  const handleQuantityChange = (
    index: number,
    action: "increment" | "decrement"
  ) => {
    setQuantities((prevQuantities) => {
      return prevQuantities.map((quantityObj, i) => {
        if (i === index) {
          const product = products[i];
          const maxQuantity = product.amountNewProduct;
          if (action === "increment" && quantityObj.quantity < maxQuantity) {
            return {
              ...quantityObj,
              quantity: quantityObj.quantity + 1,
            };
          }
          if (action === "decrement" && quantityObj.quantity > 0) {
            return {
              ...quantityObj,
              quantity: quantityObj.quantity - 1,
            };
          }
        }
        return quantityObj;
      });
    });
  };

  const handleSubmit = async () => {
    if (selectedCity === "") {
      Alert("error", "من فضلك إختر المدينة");
      new Audio("/mp3/pleaseChooseCity.mp3").play();
      return;
    }
    if (selectedStore === "") {
      Alert("error", "من فضلك إختر المخزن");
      new Audio("/mp3/pleaseChooseStore.mp3").play();
      return;
    }
    if (!keyHash) {
      return;
    }

    const dataToEncrypt = {
      selectedCity,
      selectedStore,
      quantities,
      idDelivery,
    };

    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(dataToEncrypt),
      keyHash
    ).toString();

    setIsSubmitting(true);

    try {
      const response = await axios.post(
        `${apiEndpoint}delivery/returnProductsToStore`,
        {
          data: encryptedData,
        }
      );

      if (response.data === "SUCCESS") {
        onClose();
        Alert("success", "تمت العملية بنجاح");
        new Audio("/mp3/DoneSucess.mp3").play();
        setSlectedStore("");
        setSlectedCity("");
        window.location.reload();
      } else if (response.data === "NoStore") {
        Alert(
          "error",
          "هذا المخزن غير ممكن إضافة فيه منتجات الان يرجي عمل اي مشتريات في هذا المخزن أولا"
        );
        new Audio("/mp3/errorAcceptProducts.mp3").play();
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
    if (products) {
      setQuantities(
        products.map((product) => ({
          idProduct: product.idProduct,
          colorProduct: product.colorProduct,
          sizeProduct: product.sizeProduct,
          quantity: 0,
        }))
      );
    }
  }, [products]);

  return (
    <>
      <div className="fixed bottom-2 left-0 z-50 mx-3 rounded-xl w-[83%] bg-[var(--color-navbar)] border-1">
        <Button onClick={onOpen} className="w-full h-12">
          إرجاع للمخزن
        </Button>
      </div>
      <Modal
        backdrop="blur"
        hideCloseButton
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        isDismissable={false}
        size="5xl"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                <div className="w-[100%] flex justify-center items-center mt-1 ">
                  <Autocomplete
                    label="أختر المخزن"
                    isLoading={loading}
                    isDisabled={loading}
                    className="[w-[100%] border-dashed border-2 border-[var(--color-navbar)] rounded-xl cursor-pointer"
                    selectedKey={selectedStore}
                    onSelectionChange={(key) => {
                      setSlectedStore(key !== null ? String(key) : "");
                    }}
                  >
                    {(
                      Cities.find((cityFind) => cityFind.name === selectedCity)
                        ?.stores || []
                    ).map((store) => (
                      <AutocompleteItem
                        key={store.nameStore}
                        value={store.nameStore}
                      >
                        {store.nameStore}
                      </AutocompleteItem>
                    ))}
                  </Autocomplete>

                  <Autocomplete
                    label="أختر المدينة"
                    isLoading={loading}
                    isDisabled={loading}
                    className="[w-[100%] border-dashed border-2 border-[var(--color-navbar)] ml-1 rounded-xl cursor-pointer"
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
                      <AutocompleteItem
                        key={cityItem.name}
                        value={cityItem.name}
                      >
                        {cityItem.name}
                      </AutocompleteItem>
                    ))}
                  </Autocomplete>
                </div>
              </ModalHeader>
              <ModalBody className="flex flex-col items-center relative py-4">
                <table
                  className="border-1 border-[var(--color-navbar)] p-4 w-[100%]"
                  dir="rtl"
                >
                  <thead className="border-1 border-[var(--color-navbar)] p-4">
                    <tr className="border-1 border-[var(--color-navbar)] p-4">
                      <th className="border-1 border-[var(--color-navbar)] p-4">المنتج</th>
                      <th className="border-1 border-[var(--color-navbar)] p-4">الحجم</th>
                      <th className="border-1 border-[var(--color-navbar)] p-4">اللون</th>
                      <th className="border-1 border-[var(--color-navbar)] p-4">الكمية</th>
                      <th className="border-1 border-[var(--color-navbar)] p-4">-</th>
                      <th className="border-1 border-[var(--color-navbar)] p-4">
                        الراجع للمخزن
                      </th>
                      <th className="border-1 border-[var(--color-navbar)] p-4">+</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((item, i) => (
                      <tr key={i} className="border-1 border-[var(--color-navbar)] p-4">
                        <td className="border-1 border-[var(--color-navbar)] p-4">
                          <p className="text-center">{item.nameProduct}</p>
                        </td>
                        <td className="border-1 border-[var(--color-navbar)] p-4">
                          <p className="text-center">{item.sizeProduct}</p>
                        </td>
                        <td className="border-1 border-[var(--color-navbar)] p-4">
                          <p
                            className="flex justify-center w-4 h-4 rounded-full"
                            style={{ backgroundColor: item.colorProduct }}
                          ></p>
                        </td>
                        <td className="border-1 border-[var(--color-navbar)] p-4">
                          <p className="text-center">{item.amountNewProduct}</p>
                        </td>
                        <td
                          onClick={() => handleQuantityChange(i, "decrement")}
                          className="border-1 border-[var(--color-navbar)] p-4 cursor-pointer"
                        >
                          <p className="text-center text-2xl">-</p>
                        </td>
                        <td className="border-1 border-[var(--color-navbar)] p-4">
                          <p className="text-center text-green-600">
                            {quantities[i]?.quantity || 0}
                          </p>
                        </td>
                        <td
                          onClick={() => handleQuantityChange(i, "increment")}
                          className="border-1 border-[var(--color-navbar)] p-4 cursor-pointer"
                        >
                          <p className="text-center text-2xl">+</p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </ModalBody>
              <ModalFooter>
                <Button
                  onPress={onClose}
                  className="h-12"
                  variant="bordered"
                  color="danger"
                >
                  إلغاء
                </Button>
                <Button
                  isLoading={isSubmitting}
                  onClick={handleSubmit}
                  className="bg-[var(--color-navbar)] border-1 rounded-xl w-full h-12"
                >
                  إرجاع
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
