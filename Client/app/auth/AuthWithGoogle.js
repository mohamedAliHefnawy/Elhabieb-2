"use client"

import {
  useContext,
  createContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  signInWithPopup,
  onAuthStateChanged,
  GoogleAuthProvider,
  
} from "firebase/auth";
import { auth } from "@/fireBase/fireBaseAuth";
import CryptoJS from "crypto-js";
import axios from "axios";
import Alert from "@/Components/Alert";
import jwt from "jwt-simple";
import Cookies from "js-cookie";

const AuthContext = createContext(null);

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const keyHash = process.env.NEXT_PUBLIC_KEY_HASH;
  const apiEndpoint = process.env.NEXT_PUBLIC_LINK_API;

  const googleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      try {
        const dataToEncrypt = {
          email: user.email,
          image: user.photoURL,
          phone: user.phoneNumber,
          firstName: user.displayName,
          secondName: "",
        };

        const encryptedData = CryptoJS.AES.encrypt(
          JSON.stringify(dataToEncrypt),
          keyHash
        ).toString();

        const response = await axios.post(`${apiEndpoint}user/loginByGoogle`, {
          data: encryptedData,
        });

        const {
          state,
          id,
          image,
          email,
          phone,
          firstName,
          secondName,
          validity,
          company
        } = response.data;

        if (state === "Login_Successful") {
          Alert("success", "تم التسجيل بنجاح");
          new Audio("/mp3/loginSucess.mp3").play();
          const sessionData = {
            id,
            email,
            phone,
            firstName,
            secondName,
            image,
            validity,
            company
          };

          const token = jwt.encode(sessionData, keyHash);
          Cookies.set("session", token, {
            expires: new Date(Date.now() + validity * 86400),
            secure: true,
          });

          window.location.href = "/";
        } else if (response.data === "ADDED_SUCCESS") {
          Alert("success", "تم إنشاء الحساب بنجاح");
          new Audio("/mp3/signUpSucess.mp3").play();
          const sessionData = {
            id,
            email,
            phone,
            firstName,
            secondName,
            image,
            validity,
            company
          };

          const token = jwt.encode(sessionData, keyHash);
          Cookies.set("session", token, {
            expires: new Date(Date.now() + validity * 86400),
            secure: true,
          });

          window.location.href = "/";
        }
      } catch (error) {
        console.error("Error sending email:", error);
      }
      console.log("User signed in: ", user);
    } catch (error) {
      console.error("Error during sign in: ", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, googleSignIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const UserAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("UserAuth must be used within an AuthContextProvider");
  }
  return context;
};
