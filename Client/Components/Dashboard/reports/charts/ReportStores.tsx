import { fetchReportesStores } from "@/features/reportesSlice";
import { AppDispatch, RootState } from "@/src/store";
import React, { PureComponent, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";


export default function ReportStores() {
  const [mounted, setMounted] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const isInitialLoad = useRef(true);

  const { stores, loading, error } = useSelector(
    (state: RootState) => state.reportes
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isInitialLoad.current) {
      dispatch(fetchReportesStores());
      isInitialLoad.current = false;
    }
  }, [dispatch]);

  return (
    mounted && (
      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart
          data={stores}
          margin={{
            top: 20,
            right: 20,
            bottom: 20,
            left: 20,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" dy={5} />
          <YAxis dx={-40} />
          <Tooltip />
          <Legend />
          <Bar
            dataKey="available"
            barSize={50}
            fill="#E1B849"
            name="المنتجات المتوفرة بكميات"
            radius={[40, 40, 0, 0]}
          />
          <Line
            type="monotone"
            dataKey="lowStock"
            stroke="#413ea0"
            name="المنتجات على وشك النفاذ"
          />
          <Line
            type="monotone"
            dataKey="outOfStock"
            stroke="#ff0000"
            name="المنتجات المنتهية"
          />
        </ComposedChart>
      </ResponsiveContainer>
    )
  );
}
