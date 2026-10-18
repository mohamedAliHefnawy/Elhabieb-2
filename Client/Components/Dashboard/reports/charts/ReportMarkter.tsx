import { fetchReportesMarkter } from "@/features/reportesSlice";
import { AppDispatch, RootState } from "@/src/store";
import React, { FC, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const ReportMarketer: FC = () => {
  const [mounted, setMounted] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const isInitialLoad = useRef(true);

  const { markters, loading, error } = useSelector(
    (state: RootState) => state.reportes
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isInitialLoad.current) {
      dispatch(fetchReportesMarkter());
      isInitialLoad.current = false;
    }
  }, [dispatch]);

  return (
    <div className="w-full">
      <div className="w-[100%] flex justify-center gap-x-1 items-center mb-5">
        <p>أكثر 4 مندوبين</p>
        <p className="font-bold">تسويق</p>
        <p>نشاطاَ</p>
        <p className="w-3 h-3 rounded-full bg-green-600 shadow-2xl shadow-green-600"></p>
      </div>

      {mounted && (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={markters}>
            <CartesianGrid strokeDasharray="5 5" />
            <XAxis dataKey="_id" dy={5} />
            <YAxis dx={-20} dataKey="orderCount" />
            <Tooltip />
            <Bar
              dataKey="orderCount"
              fill="#E1B849"
              barSize={50}
              radius={[40, 40, 40, 40]}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default ReportMarketer;
