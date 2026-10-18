// ReportPrint.js
import React, { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import * as XLSX from "xlsx";

const PrintOrders = ({ data, textRef, chartRef, setLoading }: any) => {
  const tableRef = useRef(null);

  const downloadPDF = () => {
    setLoading(true); // بدء التحميل

    if (textRef.current) {
      html2canvas(textRef.current).then((textCanvas) => {
        const textImgData = textCanvas.toDataURL("image/png");

        if (chartRef.current) {
          html2canvas(chartRef.current).then((chartCanvas) => {
            const chartImgData = chartCanvas.toDataURL("image/png");

            if (tableRef.current) {
              html2canvas(tableRef.current).then((tableCanvas) => {
                const tableImgData = tableCanvas.toDataURL("image/png");

                const doc = new jsPDF({
                  orientation: "p",
                  unit: "mm",
                  format: "a4",
                  putOnlyUsedFonts: true,
                  floatPrecision: 16,
                });

                doc.addImage(textImgData, "PNG", 14, 22, 180, 30);
                doc.addImage(chartImgData, "PNG", 14, 60, 180, 100);
                doc.addImage(tableImgData, "PNG", 14, 170, 180, 50);

                doc.save("تقرير_الطلبيات.pdf");
                setLoading(false); // إنهاء التحميل
              });
            } else {
              console.error("Table reference is null.");
              setLoading(false);
            }
          });
        } else {
          console.error("Chart reference is null.");
          setLoading(false);
        }
      });
    } else {
      console.error("Text reference is null.");
      setLoading(false);
    }
  };

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data); // تحويل البيانات إلى ورقة عمل
    const workbook = XLSX.utils.book_new(); // إنشاء مصنف جديد
    XLSX.utils.book_append_sheet(workbook, worksheet, "الطلبيات"); // إضافة ورقة العمل إلى المصنف

    // حفظ الملف
    XLSX.writeFile(workbook, "تقرير_الطلبيات.xlsx");
  };

  return (
    <div>
      <div className="flex justify-center mb-4">
        <button
          onClick={downloadPDF}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mr-2 transition"
        >
          تحميل تقرير PDF
        </button>
        <button
          onClick={downloadExcel}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition"
        >
          تحميل تقرير Excel
        </button>
      </div>

      {/* الجدول */}
      <div
        ref={tableRef}
        style={{ direction: "rtl", width: "100%", marginTop: "20px" }}
      >
        <table className="min-w-full bg-white border border-collapse shadow-lg">
          <thead>
            <tr className="bg-orange-500 text-white">
              <th className="border px-4 py-2">الشهر</th>
              <th className="border px-4 py-2">الطلبيات</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item: any) => (
              <tr key={item.name} className="hover:bg-gray-100 transition">
                <td className="border px-4 py-2">{item.name}</td>
                <td className="border px-4 py-2">{item.pv}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <style jsx>{`
        @media print {
          table {
            display: table;
          }
        }

        @media screen {
          table {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default PrintOrders;
