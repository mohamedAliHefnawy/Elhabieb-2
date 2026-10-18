import Icons from "@/iconsSvg";

export default function PayableCardMoney({ searchTerm, money }: {searchTerm : any ; money : number }) {
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
    <div className="p-7 border-2 border-double border-green-300 bg-green-50 rounded-lg text-center flex flex-col items-center space-y-3">
      <div className="text-green-700">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-12 h-12"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13.5 10.5V6.75a4.5 4.5 0 1 1 9 0v3.75M3.75 21.75h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H3.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
          />
        </svg>
      </div>
      <p className="text-green-700 text-xl flex items-center gap-x-2">
        <span>{Icons.BanknotesIcon}</span>
        <span>{highlightText("أموال يمكن سحبها")}</span>
      </p>
      <span className="text-gray-600 text-lg">{money.toFixed(2)} د.ل</span>
    </div>
  );
}
