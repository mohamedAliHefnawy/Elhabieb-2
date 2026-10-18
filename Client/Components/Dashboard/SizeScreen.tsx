import Image from "next/image";
import error from "@/public/images/notfound.png";

const SizeScreen = () => {
  return (
    <div className="flex max-2xl:hidden max-xl:hidden lg:hidden md:flex sm:flex max-sm:flex h-screen flex-col items-center justify-center">
      <Image src={error} alt={"error"} width={200} height={300} />
      <p> عفوا مقاس الشاشه الخاص بك غير مدعوم ☹ </p>
    </div>
  );
};

export default SizeScreen;
