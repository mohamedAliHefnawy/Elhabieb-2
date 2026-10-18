import Order from "@/app/dashboard/orders/[slug]/loading";
import getSessionData, { SessionData } from "@/contexts/SessionContext";
import { fetchOrdersForUser } from "@/features/ordersSlice";
import Icons from "@/iconsSvg";
import { AppDispatch, RootState } from "@/src/store";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  Radio,
  RadioGroup,
} from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Alert from "../Alert";
import { Boxes, EyeOff, MessageCircleX } from "lucide-react";
import ModelProductsOrder from "./ModelProductsOrder";
import ModelDeleteOrder from "./ModelDeleteOrder";
import ModelShowDataDelivery from "./ModelShowDataDelivery";
import useSessionData from "@/hooks/useSessionData";

export default function BodyOrders() {
  const dispatch = useDispatch<AppDispatch>();
  const isInitialLoad = useRef(true);
  const sessionData = useSessionData();

  const { Orders, loading, error } = useSelector(
    (state: RootState) => state.order
  );

  if (error) {
    Alert("error", "توجد مشكلة في الإنترنت حاول تنشيط الصفحة");
    new Audio("/mp3/proplemInternet.mp3").play();
    return;
  }

  const [filter, setFilter] = useState("");
  const [selectedCase, setSelectedCase] = useState<string>("الكل");

  const filteredOrders = Orders.filter((item) => {
    const matchesCase =
      selectedCase === "الكل" ||
      selectedCase === "" ||
      item.casesOrder[item.casesOrder.length - 1].case ===
        selectedCase.toLowerCase();
    const matchesFilter =
      filter === "" ||
      item.client.toLowerCase().includes(filter.toLowerCase()) ||
      item.phoneMain.toLowerCase().includes(filter.toLowerCase());

    return matchesCase && matchesFilter;
  });

  const ItemRadio = (nameItem: string, value: number) => {
    return (
      <Radio
        className="mr-6 sm:mr-1 max-sm:mr-1"
        value={nameItem}
        color="success"
      >
        <div className="flex flex-col items-center">
          <p>{value}</p>
          <p>{nameItem}</p>
        </div>
      </Radio>
    );
  };

  useEffect(() => {
    if (isInitialLoad.current && sessionData?.email) {
      dispatch(fetchOrdersForUser(sessionData?.email as string));
      isInitialLoad.current = false;
    }
  }, [dispatch, sessionData]);

  return (
    <div className="py-20 xl:px-3 lg:px-3 md:px-3 sm:px-2 max-sm:px-2">
      <div className="w-full flex flex-col items-center py-6">
        <p className="text-4xl mb-4">الطلبات</p>
        <input
          type="text"
          placeholder=" بحث ..."
          className="input"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>
      <div className="w-full flex justify-center">
        <div className="flex flex-col justify-center items-center gap-3">
          <RadioGroup
            className="mb-8 flex flex-col items-center px-6"
            orientation="horizontal"
            dir="ltr"
            onValueChange={setSelectedCase}
          >
            <Radio
              className="mr-6 sm:mr-1 max-sm:mr-1"
              value="الكل"
              color="success"
            >
              <div className="flex flex-col items-center">
                <p>{Orders.length}</p>
                <p>الكل</p>
              </div>
            </Radio>
            {ItemRadio(
              "في إنتظار الموافقة",
              Orders.filter(
                (item) =>
                  item.casesOrder[item.casesOrder.length - 1].case ===
                  "في إنتظار الموافقة"
              ).length
            )}
            {ItemRadio(
              "تم القبول",
              Orders.filter(
                (item) =>
                  item.casesOrder[item.casesOrder.length - 1].case ===
                  "تم القبول"
              ).length
            )}
            {ItemRadio(
              "تم الرفض",
              Orders.filter(
                (item) =>
                  item.casesOrder[item.casesOrder.length - 1].case ===
                  "تم الرفض"
              ).length
            )}
            {ItemRadio(
              "مع الشحن",
              Orders.filter(
                (item) =>
                  item.casesOrder[item.casesOrder.length - 1].case ===
                  "مع الشحن"
              ).length
            )}
            {ItemRadio(
              "تم التوصيل",
              Orders.filter(
                (item) =>
                  item.casesOrder[item.casesOrder.length - 1].case ===
                  "تم التوصيل"
              ).length
            )}
            {ItemRadio(
              "تم الإسترجاع",
              Orders.filter(
                (item) =>
                  item.casesOrder[item.casesOrder.length - 1].case ===
                  "تم الإسترجاع"
              ).length
            )}
            {ItemRadio(
              "إسترجاع جزئي",
              Orders.filter(
                (item) =>
                  item.casesOrder[item.casesOrder.length - 1].case ===
                  "إسترجاع جزئي"
              ).length
            )}
            {ItemRadio(
              "تم إستلام الكاش",
              Orders.filter(
                (item) =>
                  item.casesOrder[item.casesOrder.length - 1].case ===
                  "تم إستلام الكاش"
              ).length
            )}
          </RadioGroup>
        </div>
      </div>
      <div className="w-full overflow-x-auto">
        <table className="border-1 w-full text-center p-4">
          <thead>
            <tr className="border-1 opacity-40 text-sm">
              <th className="border-1  min-w-[12rem] mx-2 p-4">إسم العميل</th>
              <th className="border-1  min-w-[9rem] mx-2">رقم الهاتف</th>
              <th className="border-1  min-w-[9rem] mx-2">الإجمالي</th>
              <th className="border-1  min-w-[15rem] mx-2">المكان</th>
              <th className="border-1  min-w-[15rem] mx-2">تاريخ الطلب</th>
              <th className="border-1  min-w-[9rem] mx-2">الحالة</th>
              <th className="border-1  min-w-[12rem] mx-2">مندوب التوصيل</th>
              <th className="border-1  min-w-[12rem] mx-2">المتجر</th>
              <th className="border-1  min-w-[9rem] mx-2">chatRoom</th>
              <th className="border-1  min-w-[9rem] mx-2">ملاحظات</th>
              <th className="border-1  min-w-[4rem] mx-2">-</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders
              .slice()
              .reverse()
              .map((order, i) => (
                <tr key={i} className="border-1">
                  <td className="border-1 min-w-[12rem] mx-2">
                    <p className="flex justify-center p-5">{order.client}</p>
                  </td>
                  <td className="border-1">
                    <p className="p-4">{order.phoneMain}</p>
                  </td>
                  <td className="border-1">
                    <p className="flex justify-center p-3">
                      <span className="mr-1">د.ل</span>
                      <span>{order.totalPrice}</span>
                    </p>
                  </td>
                  <td className="border-1 p-3">
                    <p className="flex justify-center p-3">
                      {order.placeDetails}
                    </p>
                  </td>
                  <td className="border-1">
                    <p className="flex justify-center p-3">{order.date}</p>
                  </td>
                  <td className="border-1">
                    <p
                      className={`${
                        (order.casesOrder[order.casesOrder.length - 1].case ===
                          "في إنتظار الموافقة" &&
                          "text-orange-500") ||
                        (order.casesOrder[order.casesOrder.length - 1].case ===
                          "تم القبول" &&
                          "text-green-500") ||
                        (order.casesOrder[order.casesOrder.length - 1].case ===
                          "تم التوصيل" &&
                          "text-green-500") ||
                        (order.casesOrder[order.casesOrder.length - 1].case ===
                          "تم إستلام الكاش" &&
                          "text-green-500") ||
                        (order.casesOrder[order.casesOrder.length - 1].case ===
                          "تم الرفض" &&
                          "text-red-500") ||
                        (order.casesOrder[order.casesOrder.length - 1].case ===
                          "تم الإسترجاع" &&
                          "text-red-500") ||
                        (order.casesOrder[order.casesOrder.length - 1].case ===
                          "إسترجاع جزئي" &&
                          "text-red-500")
                      }`}
                    >
                      {order.casesOrder[order.casesOrder.length - 1].case}
                    </p>
                  </td>
                  <td className="border-1">
                    <div className="flex justify-center ">
                      {order.delivery ? (
                        <ModelShowDataDelivery delivery={order.delivery} />
                      ) : (
                        <p className="opacity-70 text-sm">لا يوجد</p>
                      )}
                    </div>
                  </td>
                  <td className="border-1">
                    <div className="flex justify-center">
                      {order.company.name || <p className="opacity-70 text-sm">لا يوجد</p>}
                    </div>
                  </td>
                  <td className="border-1">
                    <p className="flex justify-center p-3">
                      <div className="relative">
                        <a href={`orders/chat/${order._id}`}>
                          <p className="hover:cursor-pointer hover:opacity-75 bg-yellow-200 p-3 w-14 h-14 flex justify-center items-center rounded-full border border-yellow-600 text-yellow-900">
                            <span>{Icons.ChatbubbleleftrightIcon}</span>
                          </p>
                          <span className="absolute top-0 right-0 bg-yellow-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                            {
                              order.chat.filter((item) => {
                                if (sessionData?.validity === "Admin")
                                  return !item.showAdmin;
                                if (sessionData?.validity === "Employ")
                                  return !item.showEmploy;
                                if (sessionData?.validity === "Delivery")
                                  return !item.showDelivery;
                                return !item.showUser;
                              }).length
                            }
                          </span>
                        </a>
                      </div>
                    </p>
                  </td>
                  <td className="border-1">
                    <p className="flex justify-center ">
                      <Popover>
                        <PopoverTrigger>
                          <span className="hover:cursor-pointer">
                            <EyeOff strokeWidth={1} />
                          </span>
                        </PopoverTrigger>
                        <PopoverContent>
                          <div className="p-4 flex gap-x-2">
                            {order.placeDetails}
                          </div>
                        </PopoverContent>
                      </Popover>
                    </p>
                  </td>
                  <td className="border-1">
                    <p className="flex justify-center p-3">
                      <Popover>
                        <PopoverTrigger>
                          <span className="hover:cursor-pointer">
                            {Icons.EllipsisverticalIcon}
                          </span>
                        </PopoverTrigger>
                        <PopoverContent>
                          <div className="p-4 flex gap-x-2">
                            <ModelProductsOrder produts={order.products} />

                            {(order.delivery === "" &&
                              order.casesOrder[order.casesOrder.length - 1]
                                .case === "في إنتظار الموافقة") ||
                            order.casesOrder[order.casesOrder.length - 1]
                              .case === "تم القبول" ? (
                              <ModelDeleteOrder idOrder={order._id} />
                            ) : (
                              <div
                                onClick={() =>
                                  Alert("error", "غير ممكن إلغاء تلك الطلبية")
                                }
                                className="relative"
                              >
                                <p className="hover:cursor-pointer hover:opacity-75 bg-red-200 p-3 w-14 h-14 flex justify-center items-center rounded-full border border-red-600 text-red-900">
                                  <MessageCircleX
                                    strokeWidth={0.75}
                                    size={28}
                                  />
                                </p>
                              </div>
                            )}
                          </div>
                        </PopoverContent>
                      </Popover>
                    </p>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {filteredOrders.length === 0 && (
        <p className="w-[100%] flex justify-center mt-20 opacity-60">
          لا يوجد طلبيات{" "}
        </p>
      )}
    </div>
  );
}
