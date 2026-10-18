import Alert from "@/Components/Alert";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Autocomplete,
  AutocompleteItem,
} from "@nextui-org/react";
import axios from "axios";
import { useState } from "react";
import CryptoJS from "crypto-js";
import { useRouter } from "next/navigation";

import { AlertCircle, CheckCircle2, TruckIcon } from "lucide-react";
import React from "react";
import ReturnPartial from "./ReturnPartial";

export default function ModelChangeCaseOrder({
  idOrder,
  delivery,
  vaildity,
  client,
  products,
}: {
  idOrder: string;
  delivery: string;
  vaildity: string;
  client: string;
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

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [selectedCase, setSelectedCase] = React.useState("تم التوصيل");

  const handleSubmit = async () => {
    setIsSubmitting(true);
    if (!keyHash) {
      return;
    }

    const dataToEncrypt = {
      idOrder,
      delivery,
      selectedCase,
    };

    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(dataToEncrypt),
      keyHash
    ).toString();

    try {
      const response = await axios.post(`${apiEndpoint}delivery/edit`, {
        data: encryptedData,
      });

      if (response.data === "SUCCESS") {
        Alert("success", "تم تغيير حالة الطلبيه بنجاح");
        new Audio("/mp3/changeCaseOrderSucess.mp3").play();
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
      <div
        onClick={onOpen}
        className="text-center text-lg mt-4 border-t-1 border-b-1 py-4 opacity-75 text-[var(--color-matg3er)] underline"
      >
        تغييــر حالة الطلبية
      </div>
      <Modal
        size="4xl"
        placement="center"
        hideCloseButton
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col items-end p-7"></ModalHeader>
              <ModalBody className="flex flex-col items-center">
                <div className="flex justify-between items-start w-full">
                  <div
                    className={`flex flex-col items-center text-green-700 cursor-pointer p-2 border-2 ${
                      selectedCase === "تم التوصيل"
                        ? "border-2 border-dashed"
                        : "border-white"
                    }`}
                    onClick={() => setSelectedCase("تم التوصيل")}
                  >
                    <TruckIcon />
                    <p>تم التوصيل</p>
                  </div>

                  <div
                    className={`flex flex-col items-center text-yellow-700 cursor-pointer p-2 border-2 ${
                      selectedCase === "تم الإسترجاع"
                        ? "border-2 border-dashed"
                        : "border-white"
                    }`}
                    onClick={() => setSelectedCase("تم الإسترجاع")}
                  >
                    <CheckCircle2 />
                    <p>إسترجاع</p>
                  </div>

                  <div
                    className={`flex flex-col items-center text-red-700 cursor-pointer p-2 border-2 ${
                      selectedCase === "راجع جزئي"
                        ? "border-2 border-dashed border-gray-300"
                        : "border-white"
                    }`}
                    onClick={() => setSelectedCase("راجع جزئي")}
                  >
                    <AlertCircle />
                    <p>راجع جزئي</p>
                  </div>
                </div>

                {selectedCase === "راجع جزئي" && (
                  <ReturnPartial
                    client={client}
                    vaildity={vaildity}
                    orderId={idOrder}
                    products={products}
                    delivery={delivery}
                  />
                )}
              </ModalBody>

              {selectedCase !== "راجع جزئي" && (
                <ModalFooter>
                  <Button
                    color="danger"
                    variant="light"
                    className="h-12"
                    onPress={onClose}
                  >
                    إلغاء
                  </Button>
                  <Button
                    className="bg-[var(--color-navbar)] border-1 w-[100%] h-12"
                    onPress={() => handleSubmit()}
                    isLoading={isSubmitting}
                    disabled={isSubmitting}
                  >
                    تم
                  </Button>
                </ModalFooter>
              )}
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
