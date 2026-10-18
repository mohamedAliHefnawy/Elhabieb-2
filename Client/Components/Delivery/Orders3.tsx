import { fetchOrdersDelivery } from "@/features/delivery";
import { AppDispatch, RootState } from "@/src/store";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Alert from "../Alert";
import getSessionData, { SessionData } from "@/contexts/SessionContext";
import { Spinner } from "@nextui-org/react";
import useSessionData from "@/hooks/useSessionData";

export default function Orders3() {
  const dispatch = useDispatch<AppDispatch>();
  const isInitialLoad = useRef(true);
  const sessionData = useSessionData();

  const { delieveryOrders, loading, error } = useSelector(
    (state: RootState) => state.delivery
  );

  if (error) {
    Alert("error", "توجد مشكلة في الإنترنت حاول تنشيط الصفحة");
    new Audio("/mp3/proplemInternet.mp3").play();
    return;
  }

  useEffect(() => {
    if (isInitialLoad.current && sessionData) {
      dispatch(
        fetchOrdersDelivery({
          dataReq: [
            "_id",
            "phoneMain",
            "phoneAlternative",
            "placeDetails",
            "client",
            "casesOrder",
            "date",
            "time",
          ],
          numberOrdersReq: 3,
          delivery: sessionData.email,
        })
      );
      isInitialLoad.current = false;
    }
  }, [dispatch, sessionData]);

  return (
    <div className="bg-white rounded-ss-2xl rounded-se-2xl p-6 w-full">
      <h3 className="text-xl text-center mb-4">أحدث الطلبيات</h3>
      {loading && (
        <div className="flex justify-center items-center w-full h-[400px]">
          <Spinner size="lg" color="success" />
        </div>
      )}

      {delieveryOrders.map((order, i) => (
        <div key={i} className="mb-2">
          <div className="border border-gray-200 p-4 rounded-lg" dir="rtl">
            <p className="mb-2 ">
              رقم الهاتف :
              <Link
                href={`tel:${order.phoneMain}`}
                className="text-[var(--color-matg3er)] underline mx-1"
              >
                {order.phoneMain}
              </Link>
              |
              <Link
                href={`tel:${order.phoneAlternative}`}
                className="mr-1 text-[var(--color-matg3er)] underline"
              >
                {order.phoneAlternative}
              </Link>
            </p>
            <p className="">العنوان : {order.placeDetails}</p>
            <p className="mt-2">العميل : {order.client}</p>
            <p className="text-gray-500 my-2">
              حالة الطلب : {order.casesOrder[order.casesOrder.length - 1].case}
            </p>
            <p className="text-gray-500">
              ميعاد إنشاء الطلبية : {order.date} | {order.time}
            </p>
            <div className="flex justify-start gap-x-3 space-x-2 mt-2">
              {order.casesOrder[order.casesOrder.length - 1].case ===
              "مع الشحن" ? (
                <Link
                  href={`/delivery/orders/${order._id}`}
                  className="text-gray-700 py-1 rounded-lg underline"
                >
                  ⋆ الدخول للطلبية
                </Link>
              ) : (
                <p
                  onClick={() => {
                    Alert("error", "غير ممكن التعديل في تلك الطلبية");
                    new Audio("/mp3/errorEditingInOrder.mp3").play();
                  }}
                  className="text-gray-700 py-1 rounded-lg underline"
                >
                  ⋆ الدخول للطلبية
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
