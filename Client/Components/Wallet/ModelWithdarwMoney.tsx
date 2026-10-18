// REACT
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CryptoJS from "crypto-js";
import axios from "axios";
import { useRouter } from "next/navigation";

// COMPONENTS & STORE
import { RootState, AppDispatch } from "@/src/store";
import { fetchMoneyTreasuries } from "@/features/moneyTreasurySlice";
import Alert from "../Alert";

// NEXT UI
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
  Input,
} from "@nextui-org/react";
import { useSession } from "next-auth/react";
import getSessionData, { SessionData } from "@/contexts/SessionContext";
import useSessionData from "@/hooks/useSessionData";

interface moenyWallet {
  money: number;
  status: string;
  date: string;
  time: string;
  orderId: string;
}

export default function ModelWithdarwMoney({
  moenyWallet,
}: {
  moenyWallet: moenyWallet[];
}) {
  const dispatch = useDispatch<AppDispatch>();
  const keyHash = process.env.NEXT_PUBLIC_KEY_HASH;
  const apiEndpoint = process.env.NEXT_PUBLIC_LINK_API;
  const sessionData = useSessionData();
  const router = useRouter();
  const isInitialLoad = useRef(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [phone, setPhone] = useState("");

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const { moneyTreasuries, loading, error } = useSelector(
    (state: RootState) => state.moneyTreasury
  );

  const [selectedMoneyTreasuries, setSelectedMoneyTreasuries] = useState("");
  const [selectedMonetWithDraw, setSelectedMonetWithDraw] = useState<
    moenyWallet[]
  >([]);

  if (error) {
    Alert("error", "توجد مشكلة في الإنترنت حاول تنشيط الصفحة");
    new Audio("/mp3/proplemInternet.mp3").play();
    return;
  }

  const AddToSelectedMonetWithDraw = (
    date: string,
    money: number,
    orderId: string,
    status: string,
    time: string
  ) => {
    const findMoney = selectedMonetWithDraw.find(
      (item) => item.orderId === orderId
    );
    if (findMoney) {
      const filterMoney = selectedMonetWithDraw.filter(
        (item) => item.orderId !== orderId
      );
      setSelectedMonetWithDraw(filterMoney);

      return;
    } else {
      setSelectedMonetWithDraw((prev) => [
        ...prev,
        {
          date,
          money,
          orderId,
          status,
          time,
        },
      ]);
    }
  };

  const handleSubmit = async () => {
    if (selectedMoneyTreasuries === "") {
      Alert("warning", "من فضلك إختر المحفظة");
      new Audio("/mp3/pleaseChooseWallet.mp3").play();
      return;
    } else if (selectedMonetWithDraw.length === 0) {
      Alert("warning", "من فضلك إختر الأموال المطلوب سحبها");
      new Audio("/mp3/pleaseSelectedMoney.mp3").play();
      return;
    } else if (phone === "") {
      Alert("warning", "من فضلك أكتب رقم الهاتف ");
      new Audio("/mp3/pleaseEnterPhone.mp3").play();
      return;
    }
    if (!keyHash) {
      return;
    }
    const dataToEncrypt = {
      user: sessionData?.email,
      moneyTreasury: selectedMoneyTreasuries,
      money: selectedMonetWithDraw.map((item) => ({
        money: item.money,
        orderId: item.orderId,
        status: item.status,
      })),
      phone: phone,
      state: "Waiting",
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
    };
    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(dataToEncrypt),
      keyHash
    ).toString();
    setIsSubmitting(true);

    try {
      const response = await axios.post(
        `${apiEndpoint}withdrawReq/addWithdrawReq`,
        {
          data: encryptedData,
        }
      );

      if (response.data === "ADDED_SUSESS") {
        Alert("success", "تم طلب السحب بنجاح");
        router.push("/");
        new Audio("/mp3/sucessWithdarwReq.mp3").play();

        window.location.reload();
      } else if (response.data === "FAILIED") {
        Alert("error", "توجد مشكلة في الإنترنت حاول تنشيط الصفحة");
        new Audio("/mp3/proplemInternet.mp3").play();
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
      <Button
        onPress={onOpen}
        className="h-12"
        color="default"
        variant="bordered"
      >
        سحب أموال
      </Button>
      <Modal
        size="3xl"
        hideCloseButton
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="mb-[20px] flex gap-1">
                <Button
                  color="danger"
                  variant="bordered"
                  className="h-12"
                  onPress={onClose}
                >
                  إلغاء
                </Button>
                <Button
                  color="warning"
                  onClick={() => handleSubmit()}
                  className="w-[100%] flex items-center justify-center h-12 text-white"
                  isLoading={isSubmitting}
                >
                  <span>د.ل</span>
                  <span>
                    {selectedMonetWithDraw.reduce(
                      (acc, current) => acc + current.money,
                      0
                    )}
                  </span>
                  <span>سحب مبلغ قدره</span>
                </Button>
              </ModalHeader>
              <ModalBody>
                {moenyWallet.filter(
                  (itemFilter) => itemFilter.status === "PayAble"
                ).length === 0 && (
                  <p className="w-[100%] flex justify-center opacity-70">
                    لا توجد أموال قابلة للسحب
                  </p>
                )}
                <div className="grid xl:grid-cols-6 lg:grid-cols-6 md:grid-cols-5 sm:grid-cols-4 max-sm:grid-cols-4 gap-1">
                  {moenyWallet
                    .filter((itemFilter) => itemFilter.status === "PayAble")
                    .map((item, i) => {
                      const isSelected = selectedMonetWithDraw.some(
                        (selectedItem) => selectedItem.orderId === item.orderId
                      );

                      return (
                        <p
                          key={i}
                          onClick={() =>
                            AddToSelectedMonetWithDraw(
                              item.date,
                              item.money,
                              item.orderId,
                              item.status,
                              item.time
                            )
                          }
                          className={`p-3 border-2 border-dashed flex items-center justify-center rounded-xl cursor-pointer hover:bg-gray-50 ${
                            isSelected
                              ? "bg-blue-100 border-2 border-dashed border-[var(--color-matg3er)]"
                              : ""
                          }`}
                        >
                          <span className="mr-1"> د.ل</span>
                          <span> {item.money}</span>
                        </p>
                      );
                    })}
                </div>
                <Input
                  type="number"
                  label="رقم الهاتف"
                  color="warning"
                  variant="underlined"
                  className="my-4"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                <select
                  id="moneyTreasuries"
                  className="border border-warning bg-white p-3 rounded-md outline-none w-full mt-3"
                  value={selectedMoneyTreasuries}
                  onChange={(e) => setSelectedMoneyTreasuries(e.target.value)}
                >
                  <option value="" disabled>
                    اختر من القائمة
                  </option>

                  {moneyTreasuries
                    .filter((item) => item.Active !== false)
                    .map((moneyTreasury) => (
                      <option
                        key={moneyTreasury.name}
                        value={moneyTreasury.name}
                      >
                        {moneyTreasury.name}
                      </option>
                    ))}
                </select>
                <div className="my-5 pt-4 border-t-1 flex flex-col items-center">
                  <p className="text-2xl">ملخص السحب</p>
                  <p className="mt-3">
                    <span>القيمة المالية |</span>
                    <span className="mr-1 text-green-600">
                      <span>
                        {selectedMonetWithDraw.reduce(
                          (calc, alt) => calc + alt.money,
                          0
                        )}
                      </span>
                      <span className="mr-1">د.ل</span>
                    </span>
                  </p>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
