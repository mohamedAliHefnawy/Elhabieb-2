//react
import React, { useEffect, useState } from "react";
import Icons from "@/iconsSvg";

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
import { Boxes } from "lucide-react";
import getSessionData, { SessionData } from "@/contexts/SessionContext";
import useSessionData from "@/hooks/useSessionData";

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
}

export default function ModelProductsOrder({
  produts,
}: {
  produts: Products[];
}) {
  const sessionData = useSessionData();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const body = () => {
    return (
      <>
        <div className="p-4">
          {produts.map((item, itemIndex) => (
            <div key={itemIndex} className="flex justify-end items-center mb-4">
              <div className="flex flex-col items-end mr-3">
                <div className="flex items-center">
                  <p className="border-1 p-2 rounded-full mr-3">
                    {item.amountProduct}
                  </p>
                  <p className="font-bold">{item.nameProduct}</p>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <p className="flex mr-5 text-warning-500">
                    <span className="mr-1">د.ل</span>
                    <span>
                      {sessionData?.validity === "Markter"
                        ? item.priceMarkter
                        : item.priceCustomer}
                    </span>
                  </p>
                  <p>{item.sizeProduct}</p>
                </div>
                <div className="text-opacity-50 text-sm my-3">
                  المخزن : {item.storeProduct}
                </div>
              </div>

              <Avatar
                size="lg"
                src={`${item.imageProduct}`}
                className="w-20 h-20"
              />
            </div>
          ))}
        </div>
      </>
    );
  };

  return (
    <>
      <div onClick={onOpen} className="relative">
        <p className="hover:cursor-pointer hover:opacity-75 bg-green-200 p-3 w-14 h-14 flex justify-center items-center rounded-full border border-green-600 text-green-900">
          <Boxes strokeWidth={0.75} size={28} />
        </p>
      </div>

      <Modal
        size="2xl"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        isDismissable={false}
        className=" max-h-screen overflow-y-auto overflow-x-hidden scrollbar-thumb-gray-500 scrollbar-track-gray-300"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                ! منتجات الطلبية
              </ModalHeader>
              <ModalBody>{body()}</ModalBody>
              <ModalFooter>
                <Button onPress={onClose}>شكرا</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
