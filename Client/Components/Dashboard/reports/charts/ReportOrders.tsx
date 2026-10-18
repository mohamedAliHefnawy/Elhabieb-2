import { fetchReportesOrders } from "@/features/reportesSlice";
import { AppDispatch, RootState } from "@/src/store";
import React, { useEffect, useRef } from "react";
import { BallTriangle } from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
  XAxis,
  YAxis,
  Label,
} from "recharts";

export default function ReportOrders() {
  const dispatch = useDispatch<AppDispatch>();
  const isInitialLoad = useRef(true);

  const { orders, loading, error } = useSelector(
    (state: RootState) => state.reportes
  );

  useEffect(() => {
    if (isInitialLoad.current) {
      dispatch(fetchReportesOrders());
      isInitialLoad.current = false;
    }
  }, [dispatch]);

  return (
    <>
      <p className="w-[100%] text-center mb-5">
        عدد <span className="font-bold">الطلبيات</span> خلال السنة
      </p>

      <div style={{ direction: "ltr", width: "100%", height: "300px" }}>
        {loading ? (
          <div className="w-full flex justify-center">
            <BallTriangle
              height={100}
              width={100}
              radius={5}
              ariaLabel="ball-triangle-loading"
              wrapperStyle={{}}
              wrapperClass=""
              visible={true}
            />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={orders}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" className="mt-4">
                <Label position="insideBottom" offset={-10} fill="#F97D27" />
              </XAxis>
              <YAxis className="mt-3" dx={-10} />
              <Line
                type="monotoneX"
                dataKey="count"
                stroke="#F97D27"
                strokeWidth={2}
              />
              <Tooltip />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </>
  );
}
