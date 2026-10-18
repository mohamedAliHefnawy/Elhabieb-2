import React from "react";
import Image from "next/image";
import personReviews from "@/public/images/personReviews.png";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Tab,
} from "@nextui-org/react";
import Icons from "@/iconsSvg";

const AddComment = ({ where }: { where: string }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const desinButton = () => {
    if (where === "Categories") {
      return (
        <>
          <div
            onClick={onOpen}
            className="flex flex-col justify-center items-center gap-y-1 "
          >
            <p>إضافة تعليق علي هذا المنتج</p>
            <p>{Icons.Like}</p>
          </div>
        </>
      );
    } else if (where === "Categories") {
      return (
        <>
          <p
            className={`hover:cursor-pointer p-4 rounded-full flex justify-center items-center hover:bg-slate-100 dark:hover:bg-slate-700 `}
            onClick={onOpen}
          >
            <Image src={personReviews.src} alt={""} width={40} height={40} />
          </p>
        </>
      );
    }
  };

  return (
    <>
      {desinButton()}

      <Modal
        size="5xl"
        backdrop="blur"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        hideCloseButton
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1"></ModalHeader>
              <ModalBody className="flex flex-col items-center py-20">
                يتم العمل علي هذا !
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddComment;
