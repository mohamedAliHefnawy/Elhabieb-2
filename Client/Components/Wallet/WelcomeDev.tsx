import { useSession } from "next-auth/react";
import WalletImage from "@/public/images/wallet.png";

export default function WelcomeDev() {

  return (
    <div className=" flex flex-col items-center">
      <p className="text-2xl animate-slide-color text-center mb-4 gapy-2">
        <span>اهلا ومرحباََ </span>
      </p>
      <img src={WalletImage.src} alt="" />
    </div>
  );
}
