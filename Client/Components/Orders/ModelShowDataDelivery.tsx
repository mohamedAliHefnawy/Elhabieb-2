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
import getSessionData, { SessionData } from "@/contexts/SessionContext";
import axios from "axios";
import Alert from "../Alert";
import Link from "next/link";

export default function ModelShowDataDelivery({
  delivery,
}: {
  delivery: string;
}) {
  const keyHash = process.env.NEXT_PUBLIC_KEY_HASH;
  const apiEndpoint = process.env.NEXT_PUBLIC_LINK_API;
  const router = useRouter();

  const [iseSubmiting, setIseSubmiting] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [phone, setPhone] = useState("xxxxxxxxxxx");

  const GetPhoneDelivery = async () => {
    if (!keyHash) {
      return;
    }

    try {
      const response = await axios.get(
        `${apiEndpoint}delivery/getPhoneDelivery/${delivery}`
      );
      setPhone(response.data.data);
    } catch (error) {
      console.error("Error submitting data:", error);
    } finally {
      setIseSubmiting(false);
    }
  };

  function GetAndOpen() {
    onOpen();
    GetPhoneDelivery();
  }

  return (
    <>
      <p
        onClick={GetAndOpen}
        className="text-orange-500 flex items-center cursor-pointer"
      >
        {delivery.split("@")[0]}
        <span className="ml-[1px] mt-[1px]">{Icons.EyeIcon}</span>
      </p>

      <Modal
        size="2xl"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        hideCloseButton
        className=" max-h-screen overflow-y-auto overflow-x-hidden scrollbar-thumb-gray-500 scrollbar-track-gray-300"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody className="text-center py-10">
                <Link href="tel:01212619708" className="text-blue-500">
                  {phone} : رقم الهاتف
                </Link>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
