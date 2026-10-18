import Alert from "@/Components/Alert";
import { fetchMoneyTreasuries } from "@/features/moneyTreasurySlice";
import Icons from "@/iconsSvg";
import { AppDispatch, RootState } from "@/src/store";
import CryptoJS from "crypto-js";

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

import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import getSessionData, { SessionData } from "@/contexts/SessionContext";
import useSessionData from "@/hooks/useSessionData";

export default function ModelPayInvoice({
  idInvoice,
  totalMoneyInvoice,
  payRecentMoney,
  Sucess,
}: {
  idInvoice: string;
  totalMoneyInvoice: number;
  payRecentMoney: number;
  Sucess: any;
}) {
  const keyHash = process.env.NEXT_PUBLIC_KEY_HASH;
  const apiEndpoint = process.env.NEXT_PUBLIC_LINK_API;
  const sessionData = useSessionData();

  const dispatch = useDispatch<AppDispatch>();
  const isInitialLoad = useRef(true);

  const { moneyTreasuries, loading } = useSelector(
    (state: RootState) => state.moneyTreasury
  );

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedMoneyTreasury, setSlectedMoneyTreasury] = React.useState("");
  const [moneyValue, setValueMoney] = React.useState("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async () => {
    if (selectedMoneyTreasury === "") {
      Alert("error", "من فضلك إختر المحفظة");
      new Audio("/mp3/pleaseChooseWallet.mp3").play();
      return;
    }
    if (!keyHash) {
      return;
    }

    const dataToEncrypt = {
      idInvoice,
      moneyValue,
      selectedMoneyTreasury,
      employ: sessionData?.email,
    };

    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(dataToEncrypt),
      keyHash
    ).toString();

    setIsSubmitting(true);

    try {
      const response = await axios.post(
        `${apiEndpoint}purchase/payPurchase/${idInvoice}`,
        {
          data: encryptedData,
        }
      );

      if (response.data === "SUSESS") {
        Alert("success", "تم الدفع بنجاح");
        // new Audio("/mp3/createPurshesSucess.mp3").play();
        Sucess(dataToEncrypt);
      }
    } catch (error) {
      console.error("Error submitting data", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (isInitialLoad.current) {
      dispatch(fetchMoneyTreasuries());
      isInitialLoad.current = false;
    }
  }, [dispatch]);

  return (
    <>
      <p
        onClick={onOpen}
        className="w-[100%] bg-blue-100 border-1 border-blue-400  rounded-3xl p-3 text-center text-blue-950 ml-2 flex items-center justify-center cursor-pointer"
      >
        <span>{Icons.BanknotesIcon}</span>
        <span className="mb-1 mr-1">دفع</span>
      </p>
      <Modal
        size="3xl"
        hideCloseButton
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex justify-between items-center">
                <p>صلي علي محمد ! </p>
              </ModalHeader>
              <ModalBody>
                <input
                  type="number"
                  className="input"
                  placeholder="القيمة المالية"
                  value={moneyValue}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (+value <= totalMoneyInvoice - payRecentMoney) {
                      setValueMoney(e.target.value);
                    }
                  }}
                />
                <div className="w-[100%] flex justify-center items-center mt-1 ">
                  <Autocomplete
                    label="إختر المحفظة"
                    variant="underlined"
                    color="primary"
                    className="[w-[100%] cursor-pointer flex justify-center"
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
                </div>
                <p className="my-5 px-5 text-center">
                  هل أنت متأكد من دفع مبلغ قدرة لهذة الفاتورة علماََ بأن المبلغ
                  <span className="mx-1 font-bold">
                    {moneyValue ? moneyValue : 0} د.لـ
                  </span>
                  سيتم خصمة من الخزينة
                  <span className="mx-2 font-bold">
                    {selectedMoneyTreasury !== "" ? selectedMoneyTreasury : "-"}
                  </span>
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  إلغاء
                </Button>
                <Button
                  isLoading={isSubmitting}
                  isDisabled={isSubmitting}
                  color="primary"
                  onClick={handleSubmit}
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
