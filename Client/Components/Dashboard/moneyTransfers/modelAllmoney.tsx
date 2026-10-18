import Alert from "@/Components/Alert";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Autocomplete,
  AutocompleteItem,
} from "@nextui-org/react";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import CryptoJS from "crypto-js";
import { useRouter } from "next/navigation";
import Icons from "@/iconsSvg";
import { HandCoins } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/src/store";
import { fetchMoneyTreasuries } from "@/features/moneyTreasurySlice";
import React from "react";

interface DetailsMoney {
  money: number;
  date: string;
  time: string;
  orderId: string;
  numberOrder: number;
  codeOrder: string;
}

export default function MoadelAllmoney({
  idMoneyTransfer,
  validity,
  moneyDetails,
  Update,
}: {
  idMoneyTransfer: string;
  validity: string;
  moneyDetails: DetailsMoney[];
  Update: any;
}) {
  const keyHash = process.env.NEXT_PUBLIC_KEY_HASH;
  const apiEndpoint = process.env.NEXT_PUBLIC_LINK_API;

  const dispatch = useDispatch<AppDispatch>();
  const isInitialLoad = useRef(true);
  const router = useRouter();

  const [allMoneyTransfersMoney, setAllMoneyTransfersMoney] = useState<
    DetailsMoney[]
  >([]);

  const { moneyTreasuries, loading: moneyTreasuriesLoading } = useSelector(
    (state: RootState) => state.moneyTreasury
  );

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [selectedMoneyTreasury, setSlectedMoneyTreasury] = React.useState("");

  const handleSubmit = async (
    orderId: string,
    money: number,
    state: string,
    codeOrder?: string,
    OrdersIds?: DetailsMoney[]
  ) => {
    if (selectedMoneyTreasury === "") {
      Alert("error", "من فضلك إختر المحفظة");
      new Audio("/mp3/pleaseChooseWallet.mp3").play();
      return;
    }
    setIsSubmitting(true);
    if (!keyHash) {
      return;
    }

    const dataToEncrypt = {
      idMoneyTransfer,
      orderId,
      codeOrder,
      money,
      selectedMoneyTreasury,
      state,
      OrdersIds,
    };

    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(dataToEncrypt),
      keyHash
    ).toString();

    try {
      const response = await axios.post(
        `${apiEndpoint}moneyTransfers/${
          validity === "Pos" ? "editmoneyTransferPos" : "edit"
        }/${idMoneyTransfer}`,
        {
          data: encryptedData,
        }
      );

      if (response.data === "SAVE_SUSESS") {
        Alert("success", "تم إستلام الكاش بنجاح");
        new Audio("/mp3/acceptMoneySusess.mp3").play();
        const FilterMoney = allMoneyTransfersMoney.filter((item) =>
          validity !== "Pos"
            ? item.orderId !== orderId
            : item.codeOrder !== codeOrder
        );
        setAllMoneyTransfersMoney(FilterMoney);
      } else if (response.data === "SAVE_SUSESS_AND_DELETE") {
        Alert("success", "تم إستلام الكاش بنجاح");
        new Audio("/mp3/acceptMoneySusess.mp3").play();
        Update(idMoneyTransfer);
        onClose();
      }
    } catch (error) {
      console.error("Error submitting data", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (moneyDetails) {
      setAllMoneyTransfersMoney(moneyDetails);
    }
  }, [moneyDetails]);

  useEffect(() => {
    if (isInitialLoad.current) {
      dispatch(fetchMoneyTreasuries());
      isInitialLoad.current = false;
    }
  }, [dispatch]);

  return (
    <>
      <Button
        className="w-[100%] rounded-full text-blue-400 mt-4 bg-[var(--color-navbar)] border-1"
        startContent={Icons.BanknotesIcon}
        onClick={onOpen}
      >
        إستلام
      </Button>
      <Modal
        size="4xl"
        hideCloseButton
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex items-center justify-between p-7">
                <Autocomplete
                  isLoading={moneyTreasuriesLoading}
                  isDisabled={moneyTreasuriesLoading}
                  label="إختر المحفظة"
                  className="w-[100%] border-dashed border-2 border-[var(--color-navbar)] cursor-pointer flex justify-center rounded-2xl"
                  selectedKey={selectedMoneyTreasury}
                  onSelectionChange={(key) => {
                    setSlectedMoneyTreasury(key !== null ? String(key) : "");
                  }}
                >
                  {moneyTreasuries.map((item) => (
                    <AutocompleteItem key={item.name} value={item.name}>
                      {item.name}
                    </AutocompleteItem>
                  ))}
                </Autocomplete>
                <p className="w-[20%] ml-2">صلي علي النبي !</p>
              </ModalHeader>
              <ModalBody>
                <div
                  className="border-1 shadow-md w-full flex items-center justify-center p-4"
                  dir="rtl"
                >
                  <p className="w-full flex justify-center">القيمة المالية</p>
                  <p className="w-full flex justify-center">التاريخ</p>
                  <p className="w-full flex justify-center">الوقت</p>
                  <p className="w-full flex justify-center">الطلبيه #</p>
                  <p className="w-full flex justify-center">إستلام</p>
                </div>
                <div className=" w-full">
                  {allMoneyTransfersMoney.map((item, i) => (
                    <div
                      key={i}
                      className="flex justify-center items-center border-1 p-4 mb-1 border-[var(--color-navbar)]"
                      dir="rtl"
                    >
                      <p className="w-full flex justify-center">{item.money}</p>
                      <p className="w-full flex justify-center">{item.date}</p>
                      <p className="w-full flex justify-center">{item.time}</p>
                      <p className="w-full flex justify-center">
                        {item.codeOrder ? item.codeOrder : item.numberOrder }
                      </p>
                      <div className="w-full flex justify-center">
                        <Button
                          className=" cursor-pointer text-blue-500"
                          onClick={() =>
                            handleSubmit(
                              item.orderId,
                              item.money,
                              "only",
                              item.codeOrder
                            )
                          }
                          isLoading={isSubmitting}
                          disabled={isSubmitting}
                          variant="bordered"
                        >
                          {Icons.BanknotesIcon}
                        </Button>
                      </div>
                    </div>
                  ))}
                  <div
                    className="flex justify-center items-center border-1 p-4 mb-1 border-[var(--color-navbar)]"
                    dir="rtl"
                  >
                    <p className="w-full flex justify-center">إستلام الكل</p>
                    <p className="w-full flex justify-center"></p>
                    <p className="w-full flex justify-center"></p>
                    <p className="w-full flex justify-center"></p>
                    <p className="w-full flex justify-center cursor-pointer text-blue-500">
                      <Button
                        className=" cursor-pointer text-blue-500"
                        onClick={() =>
                          handleSubmit("", 0, "all", "", allMoneyTransfersMoney)
                        }
                        isLoading={isSubmitting}
                        disabled={isSubmitting}
                        variant="bordered"
                      >
                        <HandCoins size={28} strokeWidth={1} />
                      </Button>
                    </p>
                  </div>
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
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
