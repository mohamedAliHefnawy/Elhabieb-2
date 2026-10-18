import { SetStateAction, useEffect, useRef, useState } from "react";
import DonePayCardMoney from "./DonePayCardMoney";
import ModelWithdarwMoney from "./ModelWithdarwMoney";
import PayableCardMoney from "./PayableCardMoney";
import TableDetailsWithDraws from "./TableDetailsWithDraws";
import WaitingCardMoney from "./WaitingCardMoney";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/src/store";
import Alert from "../Alert";
import { useSession } from "next-auth/react";
import { fetchUserWallet } from "@/features/userSlice";
import { Button, Spinner } from "@nextui-org/react";
import FailedCardMoney from "./FailedCardMoney";
import OnCallCardMoney from "./OnCallCardMoney";
import { fetchWithdrawReqsToUser } from "@/features/withdrawReqSlice";
import getSessionData, { SessionData } from "@/contexts/SessionContext";
import useSessionData from "@/hooks/useSessionData";

export default function BodyWallet() {
  const dispatch = useDispatch<AppDispatch>();
  const isInitialLoad = useRef(true);
  const sessionData = useSessionData();

  const [searchTerm, setSearchTerm] = useState("");

  const { userWallet, loading, error } = useSelector(
    (state: RootState) => state.user
  );

  const {
    withdrawReqs,
    loading: withdrawReqsLoading,
    error: withdrawReqsError,
  } = useSelector((state: RootState) => state.withdrawReq);

  if (error && withdrawReqsError) {
    Alert("error", "توجد مشكلة في الإنترنت حاول تنشيط الصفحة");
    new Audio("/mp3/proplemInternet.mp3").play();
    return;
  }

  const MoneyWaiting = userWallet
    ?.filter((item) => item.status === "Waiting")
    .reduce((calc, alt) => calc + alt.money, 0);

  const MoneyPayable = userWallet
    ?.filter((item) => item.status === "PayAble")
    .reduce((calc, alt) => calc + alt.money, 0);

  const MoneyOnCall = userWallet
    ?.filter((item) => item.status === "OnCall")
    .reduce((calc, alt) => calc + alt.money, 0);

  const MoneyDonePay = userWallet
    ?.filter((item) => item.status === "DonePay")
    .reduce((calc, alt) => calc + alt.money, 0);

  const MoneyFailed = userWallet
    ?.filter((item) => item.status === "Failed")
    .reduce((calc, alt) => calc + alt.money, 0);

  const handleSearchChange = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    if (isInitialLoad.current && sessionData?.email) {
      dispatch(fetchUserWallet(sessionData?.email as string));
      dispatch(fetchWithdrawReqsToUser(sessionData?.email as string));
      isInitialLoad.current = false;
    }
  }, [dispatch, sessionData?.email]);

  return (
    <div
      className="xl:px-10 lg:px-10 md:px-10 sm:px-3 max-sm:px-3 pt-28 xl:flex lg:flex md:flex items-start justify-evenly"
      dir="rtl"
    >
      <div className="w-[100%]">
        <div className="flex items-center mb-3">
          {MoneyPayable === 0 ? (
            <Button
              onClick={() => {
                Alert("info", "لا يوجد أموال قابلة للسحب");
                new Audio("/mp3/noMoney.mp3").play();
              }}
              className="h-12"
              color="default"
              variant="bordered"
            >
              سحب أموال
            </Button>
          ) : (
            <ModelWithdarwMoney moenyWallet={userWallet} />
          )}
          <input
            type="text"
            className="input mr-2"
            placeholder="... Search "
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        {loading && withdrawReqsLoading ? (
          <div className="w-[100%] mt-20 flex items-center justify-center">
            <Spinner color="warning" />
          </div>
        ) : (
          <>
            <div className="grid xl:grid-cols-4 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-1 max-sm:grid-cols-1 gap-3 gap-x-6">
              <WaitingCardMoney searchTerm={searchTerm} money={MoneyWaiting} />
              <PayableCardMoney searchTerm={searchTerm} money={MoneyPayable} />
              <OnCallCardMoney searchTerm={searchTerm} money={MoneyOnCall} />
              <DonePayCardMoney searchTerm={searchTerm} money={MoneyDonePay} />
              {/* <FailedCardMoney searchTerm={searchTerm} money={MoneyFailed} /> */}
            </div>
            <div className="mt-10">
              <TableDetailsWithDraws
                searchTerm={searchTerm}
                withdrawReqs={withdrawReqs}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
