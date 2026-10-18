import { useEffect, useState } from "react";
import { SessionData } from "@/data/session";

const useSessionData = () => {
  const [sessionData, setSessionData] = useState<SessionData | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await fetch("/api/session", { cache: "no-store" });
        const data = await res.json();
        if (data?.user) setSessionData(data.user as SessionData);
      } catch (err) {
        console.error("فشل في جلب بيانات الجلسة", err);
      }
    };

    fetchSession();
  }, []);

  return sessionData;
};

export default useSessionData;
