import { fetchReportesProducts } from "@/features/reportesSlice";
import { AppDispatch, RootState } from "@/src/store";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer as LineChartContainer,
} from "recharts";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer as PieChartContainer,
} from "recharts";

import { Avatar } from "@nextui-org/react";
const CustomizedDot = ({
  cx,
  cy,
  currentValue,
  previousValue,
}: {
  cx: number;
  cy: number;
  currentValue: number;
  previousValue: number;
}) => {
  const fillColor = currentValue > previousValue ? "#80E67D" : "#FF4747";
  return (
    <svg
      x={cx - 5}
      y={cy - 5}
      width={10}
      height={10}
      fill={fillColor}
      viewBox="0 0 1024 1024"
    >
      <path d="M512 1009.984c-274.912 0-497.76-222.848-497.76-497.76s222.848-497.76 497.76-497.76c274.912 0 497.76 222.848 497.76 497.76s-222.848 497.76-497.76 497.76z" />
    </svg>
  );
};

const ReportProducts = () => {
  const [mounted, setMounted] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const isInitialLoad = useRef(true);

  const { products } = useSelector((state: RootState) => state.reportes);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isInitialLoad.current) {
      dispatch(fetchReportesProducts());
      isInitialLoad.current = false;
    }
  }, [dispatch]);

  const lineData: any[] | undefined = [];
  const months = [
    "يناير",
    "فبراير",
    "مارس",
    "أبريل",
    "مايو",
    "يونيو",
    "يوليو",
    "أغسطس",
    "سبتمبر",
    "أكتوبر",
    "نوفمبر",
    "ديسمبر",
  ];

  products.forEach((product: any) => {
    const salesByMonth = product.salesDetails["2024"] || [];
    salesByMonth.forEach((sales: any, index: any) => {
      if (!lineData[index]) {
        lineData[index] = { month: months[index] };
      }
      lineData[index][product.productId] = sales;
      lineData[index][`${product.productId}Prev`] =
        salesByMonth[index - 1] || 0;
    });
  });

  const COLORS = ["#ffc300", "#003566", "#9f86c0", "#3c6e71"];

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="w-full">
          <LineChartContainer width="100%" height={300}>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" dy={10}  />
              <YAxis dx={-10} />
              <Tooltip />
              {products.map((product, index) => (
                <Line
                  key={product.productId}
                  type="monotone"
                  dataKey={product.productId}
                  stroke={COLORS[index]}
                  dot={(dotProps) => (
                    <CustomizedDot
                      {...dotProps}
                      currentValue={dotProps.value}
                      previousValue={
                        lineData[dotProps.index][`${product.productId}Prev`]
                      }
                    />
                  )}
                />
              ))}
            </LineChart>
          </LineChartContainer>
        </div>

        <div className="w-full md:w-1/3 flex flex-col items-center">
          <div className="w-full flex justify-center gap-x-1 items-center ">
            <p>أكثر 4</p>
            <p className="font-bold">منتجات مبيعاً</p>
            <p>لهذا الشهر</p>
          </div>
          {mounted && (
            <PieChartContainer
              width="100%"
              height={400}
              className="flex justify-center"
            >
              <PieChart>
                <Pie
                  data={products}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="numberSells"
                >
                  {products.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </PieChartContainer>
          )}

          <div>
            <ul className="flex flex-wrap justify-center">
              {products.map((entry, index) => (
                <li
                  key={index}
                  className="flex justify-center items-center w-1/1 mb-3"
                >
                  <div
                    style={{
                      width: 16,
                      height: 16,
                      backgroundColor: COLORS[index % COLORS.length],
                    }}
                  ></div>
                  <span
                    className="max-w-xs overflow-hidden text-ellipsis whitespace-nowrap mx-2 "
                    style={{ color: COLORS[index % COLORS.length] }}
                  >
                    {entry.name}
                  </span>
                  {entry.image && (
                    <Avatar
                      src={entry.image}
                      alt={entry.name}
                      className="w-10 h-10 ml-2"
                    />
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportProducts;
