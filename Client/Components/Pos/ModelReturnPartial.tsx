import Alert from "@/Components/Alert";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import axios from "axios";
import { useState } from "react";
import CryptoJS from "crypto-js";
import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";

interface Product {
  idproduct: string;
  nameProduct: string;
  imageProduct: string;
  colorProduct: string;
  sizeProduct: string;
  describtionProduct: string;
  priceProduct: number;
  amountProduct: number;
  amountNewProduct: number;
}

export default function ModelReturnPartial({
  codeInvoice,
  date,
  time,
  products,
  city,
  store,
  emailPos,
  colorPos,
}: {
  codeInvoice: string;
  date: string;
  time: string;
  products: Product[];
  city: string;
  store: string;
  emailPos: string;
  colorPos: string;
}) {
  const keyHash = process.env.NEXT_PUBLIC_KEY_HASH;
  const apiEndpoint = process.env.NEXT_PUBLIC_LINK_API;
  const router = useRouter();

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [quantities, setQuantities] = useState(
    products.map((product) => product.amountProduct)
  );
  const [productChanges, setProductChanges] = useState(
    products.map((product) => ({
      productId: product.idproduct,
      sizeProduct: product.sizeProduct,
      colorProduct: product.colorProduct,
      productName: product.nameProduct,
      priceProduct: product.priceProduct,
      oldQuantity: product.amountProduct,
      newQuantity: product.amountProduct,
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
      productChanges,
      selectedCase: "راجع جزئي",
      city,
      store,
      email: emailPos,
      slug: codeInvoice,
    };

    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(dataToEncrypt),
      keyHash
    ).toString();

    try {
      const response = await axios.post(`${apiEndpoint}pos/editVoice`, {
        data: encryptedData,
      });

      if (response.data === "SUCCESS") {
        Alert("success", "تم تغيير حالة الطلبيه بنجاح");
        new Audio("/mp3/changeCaseOrderSucess.mp3").play();
        router.push("/pos");
      }
    } catch (error) {
      console.error("Error submitting data", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div onClick={onOpen} className="flex flex-col items-center">
        <AlertCircle />
        <p>راجع جزئي</p>
      </div>
      <Modal
        size="4xl"
        hideCloseButton
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col items-end p-7">
                <p dir="rtl">
                  <span className="opacity-55 ml-2" dir="rtl">
                    كود الطلبية :
                  </span>
                  <span>{codeInvoice}</span>
                </p>
                <div className="flex justify-end w-[100%] mt-3">
                  <p dir="rtl">
                    <span className="opacity-55 ml-2">تاريخ الإنشاء : </span>
                    <span dir="ltr">
                      {date} | {time}
                    </span>
                  </p>
                </div>
              </ModalHeader>
              <ModalBody className="flex flex-col items-center">
                <h2 className="text-2xl">محتويات الطلبية</h2>
                <table
                  className="border-1 border-[var(--color-navbar)] p-4 w-[100%]"
                  dir="rtl"
                >
                  <thead className="border-1 border-[var(--color-navbar)] p-4">
                    <tr className="border-1 border-[var(--color-navbar)] p-4">
                      <th className="border-1 border-[var(--color-navbar)] p-4">
                        #
                      </th>
                      <th className="border-1 border-[var(--color-navbar)] p-4">
                        المنتج
                      </th>
                      <th className="border-1 border-[var(--color-navbar)] p-4">
                        السعر
                      </th>
                      <th className="border-1 border-[var(--color-navbar)] p-4">
                        -
                      </th>
                      <th className="border-1 border-[var(--color-navbar)] p-4">
                        الكمية
                      </th>
                      <th className="border-1 border-[var(--color-navbar)] p-4">
                        +
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((item, i) => (
                      <tr
                        key={i}
                        className={`border-1 border-[var(--color-navbar)] p-4 ${
                          quantities[i] < item.amountProduct
                            ? "text-red-500"
                            : ""
                        }`}
                      >
                        <td className="border-1 border-[var(--color-navbar)] p-4 text-center">
                          {i + 1}
                        </td>
                        <td className="border-1 border-[var(--color-navbar)] p-4 flex justify-center items-center gap-x-2">
                          <p>{item.nameProduct}</p>
                          <p
                            className="w-4 h-4"
                            style={{ backgroundColor: item.colorProduct }}
                          ></p>
                          <p>{item.sizeProduct}</p>
                        </td>

                        <td className="border-1 border-[var(--color-navbar)] p-4 text-center">
                          {item.priceProduct} د.ل
                        </td>
                        <td
                          onClick={() => handleQuantityChange(i, -1)}
                          className="border-1 border-[var(--color-navbar)] p-4 text-center cursor-pointer"
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
              </ModalBody>
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
                  className="border-1 w-[100%] h-12 text-white"
                  style={{ backgroundColor: colorPos }}
                  onPress={() => handleSubmit()}
                  isLoading={isSubmitting}
                  disabled={isSubmitting}
                >
                  تم
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
