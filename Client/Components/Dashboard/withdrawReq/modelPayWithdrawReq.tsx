// REACT
import CryptoJS from "crypto-js";

// COMPONETS
import Alert from "@/Components/Alert";
import Icons from "@/iconsSvg";

// NEXT UI
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

export default function ModelPayWithdrawReq({
  idWithdraReq,
  money,
  user,
  moneyTreasury,
  phone,
  Pay,
}: {
  idWithdraReq: string;
  money: [
    {
      money: number;
      orderId: string;
      status: string;
    }
  ];
  user: string;
  moneyTreasury: string;
  phone: string;
  Pay: any;
}) {
  const keyHash = process.env.NEXT_PUBLIC_KEY_HASH;
  const apiEndpoint = process.env.NEXT_PUBLIC_LINK_API;

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async () => {
    if (!keyHash) {
      return;
    }
    const dataToEncrypt = {
      idWithdraReq,
      money,
      user,
      moneyTreasury,
      phone,
    };
    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(dataToEncrypt),
      keyHash
    ).toString();
    setIsSubmitting(true);

    try {
      const response = await axios.post(
        `${apiEndpoint}withdrawReq/edit/${user}`,
        {
          data: encryptedData,
        }
      );

      if (response.data === "SUCCESS") {
        onClose();
        Alert("success", "تمت العملية بنجاح");
        new Audio("/mp3/DoneSucess.mp3").play();
        Pay(idWithdraReq);
      } else {
        Alert("error", "توجد مشكلة في الإنترنت حاول تنشيط الصفحة");
        new Audio("/mp3/proplemInternet.mp3").play();
      }
    } catch (error) {
      console.error("Error submitting data", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <p className="text-primary-300 cursor-pointer" onClick={onOpen}>
        {Icons.BanknotesIcon}
      </p>
      <Modal size="3xl" isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">تأكيد !</ModalHeader>
              <ModalBody className="w-[100%]">
                <div className="flex justify-center gap-x-2" dir="rtl">
                  <p>هل أنت متأكد من تحويل أموال قدرها</p>
                  <p className="font-bold">
                    <span>
                      {money.reduce((calc, alt) => calc + alt.money, 0)}
                    </span>
                    <span className="mr-1">د.ل</span>
                  </p>
                  <p>لـ مندوب التسويق</p>
                  <p className="font-bold">{user}</p>
                </div>
                <div
                  className="flex items-center justify-center gap-x-2"
                  dir="rtl"
                >
                  <p>علما بأن هذه الأموال سيتم خصمها من المحفظه </p>
                  <p className="font-bold">{moneyTreasury}</p>
                </div>
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
                  className="w-[100%] h-12 bg-[var(--color-navbar)] border-1"
                  onClick={() => handleSubmit()}
                  isLoading={isSubmitting}
                >
                  متأكد
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
