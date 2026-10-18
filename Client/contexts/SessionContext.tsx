"use client";

import Cookies from "js-cookie";
import jwt from "jsonwebtoken";

export interface SessionData {
  id: string;
  email: string;
  phone: string;
  firstName: string;
  secondName: string;
  image: string;
  validity: string;
  company: {
    name: string;
    image: string;
    phone: string;
    color: string;
  };
  phoneCompany: string;
  colorCompany: string;
  city: string;
  store: string;
}

const getSessionData = (): SessionData | null => {
  const token = Cookies.get("session");

  if (token) {
    try {
      const decodedData = jwt.decode(token) as SessionData;
      return decodedData;
    } catch (error) {
      console.error("Error decoding session token:", error);
    }
  } else {
    console.log("No session token found.");
  }
  return null;
};

export default getSessionData;
