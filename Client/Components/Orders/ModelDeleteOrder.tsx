//react
import React, { useEffect, useState } from "react";
import Icons from "@/iconsSvg";
import { useRouter } from "next/navigation";
import CryptoJS from "crypto-js";

//nextui
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Avatar,
} from "@nextui-org/react";
import { Boxes, MessageCircleX } from "lucide-react";
import getSessionData, { SessionData } from "@/contexts/SessionContext";
import axios from "axios";
import Alert from "../Alert";
import useSessionData from "@/hooks/useSessionData";

export default function ModelDeleteOrder({ idOrder }: { idOrder: string }) {
  const keyHash = process.env.NEXT_PUBLIC_KEY_HASH;
  const apiEndpoint = process.env.NEXT_PUBLIC_LINK_API;
  const router = useRouter();

  const sessionData = useSessionData();
  const [iseSubmiting, setIseSubmiting] = useState(false);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const SubmitSituations = async () => {
    setIseSubmiting(true);
    if (!keyHash) {
      return;
    }

    const dataToEncrypt = {
      orderId: idOrder,
      casesOrder: ["تم الرفض"].map((item) => ({
        case: "تم الرفض",
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
      })),
    };

    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(dataToEncrypt),
      keyHash
    ).toString();

    try {
      const response = await axios.post(`${apiEndpoint}user/editOrder`, {
        data: encryptedData,
      });
      if (response.data === "SAVE_SUSESS") {
        Alert("success", "تم تغيير حالة الطلبيه بنجاح");
        new Audio("/mp3/changeCaseOrderSucess.mp3").play();
        router.push("/");
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

  return (
    <>
      <div onClick={onOpen} className="relative">
        <p className="hover:cursor-pointer hover:opacity-75 bg-red-200 p-3 w-14 h-14 flex justify-center items-center rounded-full border border-red-600 text-red-900">
          <MessageCircleX strokeWidth={0.75} size={28} />
        </p>
      </div>

      <Modal
        size="2xl"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        isDismissable={false}
        hideCloseButton
        className=" max-h-screen overflow-y-auto overflow-x-hidden scrollbar-thumb-gray-500 scrollbar-track-gray-300"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody className="text-center pt-10">
                هل أنت متأكد من إلغاء تلك الطلبية ؟
              </ModalBody>
              <ModalFooter>
                <Button onPress={onClose} color="danger" variant="bordered">
                  إلغاء
                </Button>
                <Button
                  onClick={SubmitSituations}
                  isLoading={iseSubmiting}
                  isDisabled={iseSubmiting}
                  className="bg-[var(--color-matg3er-rgb)] text-white w-full"
                >
                  نعم
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
