import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Swal from "sweetalert2";
import { QrScanner } from "@yudiel/react-qr-scanner";
import Icons from "@/iconsSvg";
import Alert from "../Alert";
import { Spinner } from "@nextui-org/react";
import CryptoJS from "crypto-js";

export default function QRScanner({ user }: { user: string }) {
  const keyHash = process.env.NEXT_PUBLIC_KEY_HASH as string;
  const apiEndpoint = process.env.NEXT_PUBLIC_LINK_API;

  const [scanResult, setScanResult] = useState<string | null>(null);
  const [isScannerActive, setScannerActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleScannerResult = async (result: any) => {
    setIsLoading(true);
    setScannerActive(false);
    setScanResult(result?.toString());

    try {
      const dataToEncrypt = {
        deliveryEmail: user,
        idOrder: result,
      };

      const encryptedData = CryptoJS.AES.encrypt(
        JSON.stringify(dataToEncrypt),
        keyHash
      ).toString();
      const response = await axios.post(`${apiEndpoint}delivery/scanner`, {
        data: encryptedData,
      });

      if (response.data === "SUCCESS") {
        Alert("success", "تم مسح الطلبية بنجاح");
        new Audio("/mp3/scannerSucess.mp3").play();
        router.push(`/delivery/orders/${dataToEncrypt.idOrder}`);
      } else if (response.data === "ORDER_EXITED") {
        Alert("info", "هذا الطلبية قد مسحت من قبل");
        new Audio("/mp3/scannerExited.mp3").play();
      } else if (response.data === "ORDER_ALREADY_ADDED") {
        Alert("info", "هذا الطلبية قد مسحت من قبل");
        new Audio("/mp3/scannerExited.mp3").play();
      } else if (response.data === "NOT_VALID_ORDER") {
        Alert("warning", "غير ممكن مسح تلك الطلبية ");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleScanner = () => {
    handleScannerResult;
    setScannerActive((prev) => !prev);
  };

  const handleScannerError = (error: any) => {
    console.log(error?.message);
  };

  useEffect(() => {
    if (scanResult) {
      handleScannerResult(scanResult);
    }
  }, [scanResult]);

  return (
    <>
      <span className="relative bottom-16 " onClick={toggleScanner}>
        {Icons.QrCodeIcon}
      </span>
      {isScannerActive && (
        <QrScanner
          audio
          tracker
          scanDelay={500}
          onResult={handleScannerResult}
          onError={handleScannerError}
        />
      )}
      {isLoading && (
        <div className="flex justify-center items-center h-[400px]">
          <Spinner size="lg" color="success" />
        </div>
      )}
    </>
  );
}
