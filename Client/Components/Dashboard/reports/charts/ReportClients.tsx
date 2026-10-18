// import { fetchReportesClients } from "@/features/reportesSlice";
// import { AppDispatch, RootState } from "@/src/store";
// import React, { useEffect, useRef, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { BarChart, Bar, Cell, XAxis, CartesianGrid } from "recharts";

// const colors = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

// const data = [
//   { name: "محمد علي", uv: 4000, pv: 2400, amt: 2400 },
//   { name: "عبد الهادي", uv: 3000, pv: 1398, amt: 2210 },
//   { name: "أحمد حسين", uv: 2000, pv: 9800, amt: 2290 },
//   { name: "أميرة الصافي", uv: 2780, pv: 3908, amt: 2000 },
// ];

// const getPath = (x: any, y: any, width: any, height: any) => {
//   return `M${x},${y + height}C${x + width / 3},${y + height} ${x + width / 2},${
//     y + height / 3
//   }
//   ${x + width / 2}, ${y}
//   C${x + width / 2},${y + height / 3} ${x + (2 * width) / 3},${y + height} ${
//     x + width
//   }, ${y + height}
//   Z`;
// };

// const TriangleBar = (props: any) => {
//   const { fill, x, y, width, height } = props;
//   return <path d={getPath(x, y, width, height)} stroke="none" fill={fill} />;
// };

// export default function ReportClients() {
//   const [mounted, setMounted] = useState(false);
//   const dispatch = useDispatch<AppDispatch>();
//   const isInitialLoad = useRef(true);

//   const { clients, loading, error } = useSelector(
//     (state: RootState) => state.reportes
//   );

//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   useEffect(() => {
//     if (isInitialLoad.current) {
//       dispatch(fetchReportesClients());
//       isInitialLoad.current = false;
//     }
//   }, [dispatch]);

//   return (
//     <div className="w-full">
//       <div className="w-[100%] flex justify-center gap-x-1 items-center mb-5">
//         <p>أكثر 4 </p>
//         <p className="font-bold">عملاء</p>
//         <p>نشاطاَ</p>
//         <p className="w-3 h-3 rounded-full bg-green-600 shadow-2xl shadow-green-600"></p>
//       </div>

//       {mounted && (
//         <BarChart
//           width={600}
//           height={300}
//           data={data}
//           style={{ width: "100%", direction: "ltr" }}
//         >
//           <CartesianGrid strokeDasharray="5 5" />
//           <XAxis dataKey="name" />
//           <Bar
//             dataKey="uv"
//             fill="#8884d8"
//             shape={<TriangleBar />}
//             label={{ position: "top" }}
//           >
//             {data.map((entry, index) => (
//               <Cell
//                 key={`cell-${index}`}
//                 fill={colors[index % colors.length]}
//               />
//             ))}
//           </Bar>
//         </BarChart>
//       )}
//     </div>
//   );
// }import { fetchReportesClients } from "@/features/reportesSlice";

import { fetchReportesClients } from "@/features/reportesSlice";
import { AppDispatch, RootState } from "@/src/store";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BarChart, Bar, Cell, XAxis, CartesianGrid, YAxis } from "recharts";

const colors = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const getPath = (x: any, y: any, width: any, height: any) => {
  return `M${x},${y + height}C${x + width / 3},${y + height} ${x + width / 2},${
    y + height / 3
  }
  ${x + width / 2}, ${y}
  C${x + width / 2},${y + height / 3} ${x + (2 * width) / 3},${y + height} ${
    x + width
  }, ${y + height}
  Z`;
};

const TriangleBar = (props: any) => {
  const { fill, x, y, width, height } = props;
  return <path d={getPath(x, y, width, height)} stroke="none" fill={fill} />;
};

export default function ReportClients() {
  const [mounted, setMounted] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const isInitialLoad = useRef(true);

  const { clients, loading, error } = useSelector(
    (state: RootState) => state.reportes
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isInitialLoad.current) {
      dispatch(fetchReportesClients());
      isInitialLoad.current = false;
    }
  }, [dispatch]);

  return (
    <div className="w-full">
      <div className="w-[100%] flex justify-center gap-x-1 items-center mb-5">
        <p>أكثر 4 </p>
        <p className="font-bold">عملاء</p>
        <p>نشاطاَ</p>
        <p className="w-3 h-3 rounded-full bg-green-600 shadow-2xl shadow-green-600"></p>
      </div>

      {mounted && (
        <BarChart
          width={600}
          height={300}
          data={clients}
          style={{ width: "100%", direction: "ltr" }}
        >
          <CartesianGrid strokeDasharray="5 5" />
          <XAxis dataKey="_id" dy={5} dx={-20} />
          <YAxis dataKey="orderCount" />
          <Bar
            dataKey="orderCount"
            fill="#8884d8"
            shape={<TriangleBar />}
            label={{ position: "top" }}
          >
            {clients.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={colors[index % colors.length]}
              />
            ))}
          </Bar>
        </BarChart>
      )}
    </div>
  );
}
