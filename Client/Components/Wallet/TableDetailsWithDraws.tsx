import { WithdrawReq } from "@/features/withdrawReqSlice";
import Icons from "@/iconsSvg";

export default function TableDetailsWithDraws({
  searchTerm,
  withdrawReqs,
}: {
  searchTerm: any;
  withdrawReqs: WithdrawReq[];
}) {
  const highlightText = (text: string) => {
    if (!searchTerm) return text;
    const regex = new RegExp(`(${searchTerm})`, "gi");
    const parts = text.split(regex);
    return parts.map((part, index) =>
      regex.test(part) ? (
        <span key={index} className="font-bold text-gray-900 underline">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <div className="pb-20">
      <p className="mb-3 text-xl opacity-60"> # طلبات السحب </p>
      <div className="overflow-x-auto">
        <div className="min-w-[800px] flex justify-between p-5 shadow-sm border border-[#dde7f1] bg-[#F8FAFC] rounded-3xl rounded-ee-none rounded-es-none opacity-65">
          <p className="w-[100%] flex justify-center">القيمة المالية</p>
          <p className="w-[100%] flex justify-center">المحفظة</p>
          <p className="w-[100%] flex justify-center">رقم الهاتف</p>
          <p className="w-[100%] flex justify-center">التاريخ</p>
          <p className="w-[100%] flex justify-center">الوقت</p>
          <p className="w-[100%] flex justify-center">الحالة</p>
        </div>
        {withdrawReqs.map((item, i) => (
          <div
            key={i}
            className="min-w-[800px] flex justify-between items-center bg-[#F8FAFC] gap-1 p-4 mt-3"
          >
            <p className="w-[100%] flex justify-center">
              <span>
                {item.money.reduce((calc, alt) => calc + alt.money, 0)}
              </span>
              <span>د.ل</span>
            </p>
            <p className="w-[100%] flex justify-center">{item.moneyTreasury}</p>
            <p className="w-[100%] flex justify-center">{item.phone}</p>
            <p className="w-[100%] flex justify-center">{item.date}</p>
            <p className="w-[100%] flex justify-center">{item.time}</p>
            <p
              className={`w-[100%] flex justify-center items-center ${
                item.state === "Waiting" ? "text-orange-700" : "text-green-700"
              }`}
            >
              {highlightText(
                `${item.state === "Waiting" ? "في الإنتظار" : "تم الدفع"}`
              )}
              {item.state === "Waiting" ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-5 h-5 mt-1 mr-1"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-6 h-6 mt-1 mr-1"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z"
                  />
                </svg>
              )}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
