import { ProductStateType } from "@/features/productSlice";
import {
  Modal,
  ModalContent,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Avatar,
} from "@nextui-org/react";
import React, { useState } from "react";

export default function ModelTableProduct({
  id,
  name,
  image,
  price,
  details,
  onSave,
}: {
  id: string;
  name: string;
  image: string;
  price: number;
  details: {
    color: string;
    sizes: {
      size: string;
      city: string;
      store: string;
      amount: number;
    }[];
  }[];
  onSave: (
    data: Array<{
      id: string;
      color: string;
      size: string;
      amount: number;
      price: number;
    }>
  ) => void;
}) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const [productQuantities, setProductQuantities] = useState(
    details.map((item) => ({
      color: item.color,
      sizes: item.sizes.map((size) => ({
        ...size,
        amount: 0,
      })),
    }))
  );

  const handleQuantityChange = (
    colorIndex: any,
    sizeName: any,
    newAmount: any
  ) => {
    setProductQuantities((prevQuantities) =>
      prevQuantities.map((item, i) => {
        if (i === colorIndex) {
          return {
            ...item,
            sizes: item.sizes.map((sizeItem) =>
              sizeItem.size === sizeName
                ? { ...sizeItem, amount: newAmount }
                : sizeItem
            ),
          };
        }
        return item;
      })
    );
  };

  const handleSave = () => {
    const result = productQuantities.map((item) =>
      item.sizes.map((size) => ({
        id: id,
        price: price,
        color: item.color,
        size: size.size,
        amount: size.amount,
      }))
    );

    const flattenedResult = result.flat();
    onSave(flattenedResult);
    onClose();
  };

  return (
    <>
      <div
        onClick={onOpen}
        className="bg-[var(--color-body)] text-[#e0ac68] absolute bottom-0 right-0 px-2 hover:cursor-pointer"
      >
        !
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
              <ModalBody className="flex flex-col items-center relative">
                <div className="relative">
                  <Avatar src={image} alt="" className="h-28 w-28" />
                  <div className="absolute bottom-0 left-0 w-full h-10 bg-black bg-opacity-50 transform skew-y-3 ">
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-white text-center">
                      {name}
                    </div>
                  </div>
                </div>
                <div className="overflow-x-auto w-[100%]">
                  <table className="min-w-full border border-gray-300 text-center">
                    <thead>
                      <tr className="bg-gray-200">
                        {Array.from(
                          new Set(
                            details.flatMap((item) =>
                              item.sizes.map((sizeItem) => sizeItem.size)
                            )
                          )
                        ).map((uniqueSize, sizeIndex) => (
                          <th key={sizeIndex} className="p-4">
                            {uniqueSize}
                          </th>
                        ))}
                        <th className="p-4">المقاسات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productQuantities.map((item, i) => (
                        <tr key={i} className="text-center">
                          {Array.from(
                            new Set(
                              details.flatMap((detail) =>
                                detail.sizes.map((sizeItem) => sizeItem.size)
                              )
                            )
                          ).map((uniqueSize, sizeIndex) => {
                            const sizeData = item.sizes.find(
                              (sizeItem) => sizeItem.size === uniqueSize
                            );

                            return (
                              <td key={sizeIndex} className="p-4">
                                {sizeData ? (
                                  <input
                                    type="number"
                                    placeholder="عدد المشتريات من هذا الحجم لهذا اللون"
                                    className="border-none focus:border-none active:border-none outline-none w-[100%] h-full px-2 flex justify-center text-center"
                                    value={sizeData.amount}
                                    onChange={(e) =>
                                      handleQuantityChange(
                                        i, // المؤشر الخاص باللون
                                        uniqueSize, // تمرير اسم المقاس بدلاً من المؤشر
                                        parseInt(e.target.value) || 0
                                      )
                                    }
                                  />
                                ) : (
                                  "-"
                                )}
                              </td>
                            );
                          })}

                          <td
                            className="p-4"
                            style={{ backgroundColor: item.color }}
                          >
                            {item.color}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </ModalBody>

              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onPress={onClose}
                  className="h-12"
                >
                  إلغاء
                </Button>
                <Button
               
                  onPress={handleSave}
                  className="w-[100%] h-12 bg-[var(--color-navbar)] border-1"
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
