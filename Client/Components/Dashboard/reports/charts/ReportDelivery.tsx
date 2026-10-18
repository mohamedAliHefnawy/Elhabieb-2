import { fetchReportesDelivery } from "@/features/reportesSlice";
import { AppDispatch, RootState } from "@/src/store";
import React, { FC, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface OrderPerMonth {
  year: number;
  month: string;
  count: number;
}

interface Delivery {
  name: string;
  ordersPerMonth: OrderPerMonth[];
}

const ReportDelivery: FC = () => {
  const [mounted, setMounted] = useState(false);
  const [opacity, setOpacity] = useState<{ [key: string]: number }>({});
  const dispatch = useDispatch<AppDispatch>();
  const isInitialLoad = useRef(true);

  const { deliveries, loading, error } = useSelector(
    (state: RootState) => state.reportes
  );

  const handleMouseEnter = (o: any) => {
    const { dataKey } = o;
    setOpacity((op) => ({ ...op, [dataKey]: 0.5 }));
  };

  const handleMouseLeave = (o: any) => {
    const { dataKey } = o;
    setOpacity((op) => ({ ...op, [dataKey]: 1 }));
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isInitialLoad.current) {
      dispatch(fetchReportesDelivery());
      isInitialLoad.current = false;
    }
  }, [dispatch]);

  const data: { name: any; [key: string]: number }[] = [];
  const months = [
    "يناير",
    "فبراير",
    "مارس",
    "إبريل",
    "مايو",
    "يونيو",
    "يوليو",
    "أغسطس",
    "سبتمبر",
    "أكتوبر",
    "نوفمبر",
    "ديسمبر",
  ];

  deliveries.forEach((delivery: Delivery) => {
    months.forEach((month, index) => {
      const orderData = delivery.ordersPerMonth.find(
        (order) => order.month === month
      );
      const count = orderData ? orderData.count : 0;

      if (!data[index]) {
        data[index] = { name: month } as any;
      }

      data[index][delivery.name] = count; 
    });
  });

  return (
    <div className="w-full">
      <div className="w-[100%] flex justify-center gap-x-1 items-center mb-5">
        <p>حركة أكثر 2</p>
        <p className="font-bold">مندوبين توصيل</p>
        <p>نشاطاَ</p>
        <p className="w-3 h-3 rounded-full bg-green-600 shadow-2xl shadow-green-600"></p>
      </div>

      {mounted && (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis dx={-20} />
            <Tooltip />
            <Legend
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              payload={deliveries.map((delivery, index) => ({
                value: delivery.name,
                type: "line",
                color: index % 2 === 0 ? "#8884d8" : "#82ca9d", 
                id: delivery.name,
              }))}
            />
            {deliveries.map((delivery, index) => (
              <Line
                key={delivery.name}
                type="monotone"
                dataKey={delivery.name}
                strokeOpacity={opacity[delivery.name] || 1}
                stroke={index % 2 === 0 ? "#8884d8" : "#82ca9d"} 
                activeDot={{ r: 8 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default ReportDelivery;
