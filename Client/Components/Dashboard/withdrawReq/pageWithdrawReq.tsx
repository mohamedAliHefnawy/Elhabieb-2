// REACT
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

// COMPONETS && STROE
import { fetchWithdrawReqs, WithdrawReq } from "@/features/withdrawReqSlice";
import { AppDispatch, RootState } from "@/src/store";
import Alert from "@/Components/Alert";
import Icons from "@/iconsSvg";

// NEXT UI
import {
  Checkbox,
  CheckboxGroup,
  Radio,
  RadioGroup,
  Spinner,
} from "@nextui-org/react";

import ModelPayWithdrawReq from "./modelPayWithdrawReq";

export default function PageWithdrawReq() {
  const dispatch = useDispatch<AppDispatch>();
  const isInitialLoad = useRef(true);

  const { withdrawReqs, loading, error } = useSelector(
    (state: RootState) => state.withdrawReq
  );

  const [allWithdrawReqs, setAllWithdrawReqs] = useState<WithdrawReq[]>([]);
  const [filter, setFilter] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("الكل");

  const filteredWithdrawReqs = allWithdrawReqs.filter((item) => {
    const matchesStatus =
      selectedStatus === "الكل" || item.state === selectedStatus;

    const matchesFilter =
      filter === "" ||
      item.user.toLowerCase().includes(filter.toLowerCase()) ||
      item.moneyTreasury.toLowerCase().includes(filter.toLowerCase()) ||
      item.phone.toLowerCase().includes(filter.toLowerCase()) ||
      item.state.toLowerCase().includes(filter.toLowerCase());

    return matchesStatus && matchesFilter;
  });

  if (error) {
    Alert("error", "توجد مشكلة في الإنترنت حاول تنشيط الصفحة");
    new Audio("/mp3/proplemInternet.mp3").play();
    return;
  }
  const HandlePay = (IdWithdrawReq: string) => {
    setAllWithdrawReqs((prev) =>
      prev.map((item) =>
        item._id === IdWithdrawReq ? { ...item, state: "Done" } : item
      )
    );
  };

  const HeaderFilters = () => (
    <div className="flex flex-col mb-10">
      <div className="flex justify-between items-center mb-4">
        <div className="w-[100%]">
          <input
            className="w-full input"
            type="text"
            placeholder="بحث ..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
      </div>
      <div className="flex flex-col gap-3 mt-6 items-center">
        <RadioGroup
          color="success"
          orientation="horizontal"
          className="mb-4"
          style={{ direction: "ltr" }}
          value={selectedStatus}
          onValueChange={setSelectedStatus}
        >
          <Radio value="Waiting">في الإنتظار</Radio>
          <Radio value="Done">تم التحويل</Radio>
          <Radio value="الكل">الكل</Radio>
        </RadioGroup>
      </div>

      <div className="mr-2 text-black opacity-60 text-sm flex justify-end">
        <p>Total {withdrawReqs.length} withdrawalRequests </p>
      </div>
    </div>
  );

  const HeaderTableWithdrawalRequests = () => (
    <div
      className="flex items-center p-4 mb-5 bg-[var(--color-body)] shadow-lg rounded-2xl text-black opacity-75"
      dir="rtl"
    >
      <div className="w-full flex justify-center text-black opacity-50">
        <p>مندوب التسويق</p>
      </div>
      <div className="w-full flex justify-center text-black opacity-50">
        <p dir="ltr">طريقة الدفع #</p>
      </div>
      <div className="w-full flex justify-center text-black opacity-50">
        <p>المبلغ</p>
      </div>
      <div className="w-full flex justify-center text-black opacity-50">
        <p>رقم الهاتف</p>
      </div>
      <div className="w-full flex justify-center text-black opacity-50">
        <p>الحالة</p>
      </div>
      <div className="w-full flex justify-center text-black opacity-50">
        <p>-</p>
      </div>
    </div>
  );

  const TableWithdrawalRequests = () => (
    <>
      {filteredWithdrawReqs.length === 0 ? (
        <div className="flex justify-center items-center h-[400px] text-black opacity-50">
          <p>لا يوجد أي طلبات سحب</p>
        </div>
      ) : (
        filteredWithdrawReqs.map((item, i) => (
          <div key={i}>
            <div className="flex items-center p-4 mb-2 bg-[var(--color-body)] shadow-lg rounded-2xl border border-[var(--color-navbar)] text-black">
              <div className="w-full flex justify-center">
                <p> ...@{item.user.split("@")[0]}</p>
              </div>
              <div className="w-full flex justify-center">
                <p>{item.moneyTreasury}</p>
              </div>
              <div className="w-full flex justify-center">
                <p className="flex justify-center">
                  <span>
                    {item.money.reduce((calc, alt) => calc + alt.money, 0)}
                  </span>
                  <span className="mr-1">د.ل</span>
                </p>
              </div>
              <div className="w-full flex justify-center">
                <p>{item.phone}</p>
              </div>
              <div className="w-full flex justify-center">
                {item.state === "Waiting" ? (
                  <p className="text-orange-400">في الإنتظار</p>
                ) : (
                  <p className="text-green-400">تم الدفع</p>
                )}
              </div>

              <div className="w-full flex justify-center">
                {item.state === "Waiting" ? (
                  <ModelPayWithdrawReq
                    idWithdraReq={item._id}
                    money={item.money}
                    user={item.user}
                    moneyTreasury={item.moneyTreasury}
                    phone={item.phone}
                    Pay={HandlePay}
                  />
                ) : (
                  <p
                    className="text-primary-300 cursor-pointer"
                    onClick={() => {
                      Alert("warning", "قد تم الدفع هذا الطلب من قبل");
                      new Audio("/mp3/paySure.mp3").play();
                    }}
                  >
                    {Icons.BanknotesIcon}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </>
  );

  useEffect(() => {
    if (isInitialLoad.current) {
      dispatch(fetchWithdrawReqs());
      isInitialLoad.current = false;
    }
  }, [dispatch]);

  useEffect(() => {
    if (withdrawReqs) {
      setAllWithdrawReqs(withdrawReqs);
    }
  }, [withdrawReqs]);

  return (
    <div className="h-screen w-full bg-[var(--color-body)] border-1 border-[var(--color-navbar)] overflow-y-auto custom-scrollbar p-6 mt-1">
      {HeaderFilters()}
      <HeaderTableWithdrawalRequests />
      <div dir="rtl">
        {loading ? (
          <div className="flex justify-center items-center h-[400px]">
            <Spinner size="lg" color="success" />
          </div>
        ) : (
          <TableWithdrawalRequests />
        )}
      </div>
    </div>
  );
}
