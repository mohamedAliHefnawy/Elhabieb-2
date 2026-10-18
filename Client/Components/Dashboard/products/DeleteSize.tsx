import Alert from "@/Components/Alert";
import Icons from "@/iconsSvg";
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

import CryptoJS from "crypto-js";
import React from "react";

interface ModelDeleteColorOrSizeProps {
  index: number;
  localProperties: string[];
  property: string; // الخاصية التي سيتم عرضها
  productId: string; // معرف المنتج
  onDelete: (index: number, productId: string) => void; // تمرير productId هنا
  slug: string;
}

export default function ModelDeleteSize({
  index,
  localProperties,
  property,
  productId, // استلام معرف المنتج هنا
  onDelete,
  slug,
}: ModelDeleteColorOrSizeProps) {
  const keyHash = process.env.NEXT_PUBLIC_KEY_HASH;
  const apiEndpoint = process.env.NEXT_PUBLIC_LINK_API;

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const encryptData = (data: { size: string; _id: string; slug: string }) => {
    if (!keyHash) {
      throw new Error("Encryption key is missing");
    }
    return CryptoJS.AES.encrypt(JSON.stringify(data), keyHash).toString();
  };

  const handleSubmit = async () => {
    try {
      const sizeData = { size: property, _id: productId, slug: slug };

      const encryptedFormData = encryptData(sizeData);

      const response = await axios.post(
        `${apiEndpoint}products/deleteSizeOrColor/${productId}`,
        { data: encryptedFormData }
      );

      if (response.data === "EDIT_SUCCESS") {
        Alert("success", "تم تعديل المنتج بنجاح");
        new Audio("/mp3/susessEditedProduct.mp3").play();
        onDelete(index, productId);
        onClose();
      }
    } catch (error) {
      Alert("error", "توجد مشكلة في الإنترنت حاول تنشيط الصفحة");
      new Audio("/mp3/proplemInternet.mp3").play();
    }
  };

  const DeleteAndClose = () => {
    onDelete(index, productId);
    onClose();
  };

  return (
    <>
      {productId === "" ? (
        <p
          className="text-red-500 hover:cursor-pointer opacity-50 mr-1"
          onClick={DeleteAndClose}
        >
          {Icons.DeleteIcon}
        </p>
      ) : (
        <p
          className="text-red-500 hover:cursor-pointer opacity-50 mr-1"
          onClick={onOpen}
        >
          {Icons.DeleteIcon}
        </p>
      )}
      <Modal
        backdrop="blur"
        hideCloseButton
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>تـــأكيد !</ModalHeader>
              <ModalBody className="flex flex-col items-center relative">
                <p>هل أنت متأكد من حذف المقاس التالي للمنتج:</p>
                <strong>{property}</strong>
              </ModalBody>

              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  لا
                </Button>
                <Button
                  color="primary"
                  onPress={() => {
                    handleSubmit();
                  }}
                  className="w-[100%]"
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
