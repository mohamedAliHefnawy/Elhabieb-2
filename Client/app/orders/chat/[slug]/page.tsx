"use client";

// REACT
import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import InputEmoji from "react-input-emoji";
import CryptoJS from "crypto-js";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Spinner } from "@nextui-org/react";
import { MousePointer2 } from "lucide-react";

// COMPONENTS & STORE
import NavBar from "@/Components/Mat3er/NavBar";
import Footer from "@/Components/Mat3er/Footer";

import SizeScreen from "@/Components/Dashboard/SizeScreen";
import { fetchChatOrder } from "@/features/ordersSlice";
import Alert from "@/Components/Alert";
import { AppDispatch, RootState } from "@/src/store";
import { usePathname } from "next/navigation";
import useSessionData from "@/hooks/useSessionData";

const keyHash = process.env.NEXT_PUBLIC_KEY_HASH;
const apiEndpoint = process.env.NEXT_PUBLIC_LINK_API;

// const socket = io(apiEndpoint);

interface Message {
  _id: string;
  message: string;
  nameSender: string;
  sender: string;
  vaildity: string;
  date: string;
  time: string;
}

export default function Chat({ params }: { params: { slug: string } }) {
  const sessionData = useSessionData();
  const isInitialLoad = useRef(true);
  const dispatch = useDispatch<AppDispatch>();

  const { Chat, loading, error } = useSelector(
    (state: RootState) => state.order
  );

  if (error) {
    Alert("error", "توجد مشكلة في الإنترنت حاول تنشيط الصفحة");
    new Audio("/mp3/proplemInternet.mp3").play();
    return;
  }

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [userTyping, setUserTyping] = useState<any[]>([]);
  const user = sessionData?.email || "";
  const path = usePathname();

  const HandleChangeMessage = (newMessage: string) => {
    setNewMessage(newMessage);
    // socket.emit("Write_Message", user);
    // clearTimeout(typingTimeout);
    // typingTimeout = setTimeout(() => {
    //   socket.emit("Stop_Writing", user);
    // }, 5000);
  };

  // let typingTimeout: NodeJS.Timeout;

  const handleSubmit = async () => {
    if (!keyHash) {
      return;
    }
    const dataToEncrypt = {
      message: newMessage,
      nameSender: sessionData?.email,
      vaildity: sessionData?.validity,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      idOrder: params.slug,
    };

    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(dataToEncrypt),
      keyHash
    ).toString();

    try {
      const response = await axios.post(`${apiEndpoint}order/chat`, {
        data: encryptedData,
      });

      if (response.data === "SUSESS") {
        setUsers((prev) => {
          const exists = prev.some((user) => user === dataToEncrypt.nameSender);
          if (!exists) {
            return [...prev, dataToEncrypt.nameSender];
          }
          return prev;
        });

        const newMsg: Message = {
          _id: `${messages.length + 1}`,
          message: dataToEncrypt.message,
          nameSender: dataToEncrypt.nameSender || "",
          sender: "me",
          vaildity: dataToEncrypt.vaildity || "",
          date: dataToEncrypt.date,
          time: dataToEncrypt.time,
        };

        // socket.emit("new_messages", newMsg.sender);

        // socket.emit("ready", newMsg);
        if (newMsg.sender === "other") {
          new Audio("/mp3/WhatsApp.mpeg").play();
        }
        setMessages([...messages, newMsg]);
        setNewMessage("");
      } else {
        Alert("error", "توجد مشكلة في الإنترنت حاول تنشيط الصفحة");
        new Audio("/mp3/proplemInternet.mp3").play();
        return;
      }
    } catch (error) {
      console.error("Error submitting data", error);
    }
  };

  // useEffect(() => {
  //   socket.on("Recieve_Message", (data) => {
  //     const newMsg: Message = {
  //       _id: `${messages.length + 1}`,
  //       message: data.message,
  //       nameSender: data.nameSender || "",
  //       sender: "other",
  //       vaildity: data.vaildity || "",
  //       date: data.date,
  //       time: data.time,
  //     };
  //     setMessages([...messages, newMsg]);
  //     if (newMsg.sender !== "me") {
  //       new Audio("/mp3/WhatsApp.mpeg").play();
  //     }
  //   });

  //   return () => {
  //     socket.off("Recieve_Message");
  //   };
  // });

  // useEffect(() => {
  //   socket.on("Write_Message_Others", (data) => {
  //     setUserTyping((prev) => {
  //       if (!prev.includes(data)) {
  //         return [...prev, data];
  //       }
  //       return prev;
  //     });
  //   });

  //   socket.on("Stop_Writing_Others", (data) => {
  //     setUserTyping((prev) => prev.filter((user) => user !== data));
  //   });

  //   return () => {
  //     socket.off("Write_Message_Others");
  //     socket.off("Stop_Writing_Others");
  //   };
  // }, []);

  useEffect(() => {
    if (isInitialLoad.current && typeof params.slug === "string") {
      dispatch(fetchChatOrder(params.slug));
      isInitialLoad.current = false;
    }
  }, [dispatch]);

  useEffect(() => {
    if (Chat) {
      setMessages((prev) => [
        ...prev,
        ...Chat.map((item) => ({
          _id: item._id,
          message: item.message,
          nameSender: item.nameSender,
          sender: item.nameSender === user ? "me" : "other",
          vaildity: item.vaildity,
          date: item.date,
          time: item.time,
        })),
      ]);
      setUsers((prev) => {
        const updatedUsers = new Set(prev);
        Chat.forEach((item) => {
          updatedUsers.add(item.nameSender);
        });

        return Array.from(updatedUsers);
      });
    }
  }, [Chat]);

  useEffect(() => {
    const submitData = async () => {
      if (!keyHash || !sessionData) {
        return;
      }

      const dataToEncrypt = {
        nameSender: sessionData.email,
        vaildity: sessionData.validity,
        idOrder: params.slug,
      };

      const encryptedData = CryptoJS.AES.encrypt(
        JSON.stringify(dataToEncrypt),
        keyHash
      ).toString();

      try {
        const response = await axios.post(`${apiEndpoint}order/editChat`, {
          data: encryptedData,
        });
      } catch (error) {
        console.error("Error submitting data", error);
      }
    };

    submitData();
  }, [messages, keyHash, sessionData, params.slug]);

  return (
    <>
      <div className="xl:flex lg:flex md:flex sm:hidden max-sm:hidden">
        <NavBar />
      </div>

      <div className="w-full h-screen flex xl:pt-14 lg:pt-14 md:pt-14 sm:pt-0 max-sm:pt-0 xl:pb-0 lg:pb-0 md:pb-0 sm:pb-16 max-sm:pb-16">
        <div className="flex-1 flex flex-col mr-1">
          {loading ? (
            <div className=" mt-1 flex justify-center items-center h-screen bg-[var(--color-body)] border-1 border-[var(--color-navbar)]">
              <Spinner size="lg" color="success" />
            </div>
          ) : (
            <>
              <div className="bg-[var(--color-body)] border-1 border-[var(--color-navbar)] mt-1 mb-0.5 p-4 flex items-center">
                <div className="text-lg font-semibold hover:cursor-pointer flex flex-wrap gap-x-2 items-center">
                  {users.map((user, index) => (
                    <div key={index} className="flex gap-x-2 items-center">
                      <p>{user.split("@")[0]}</p>
                      {userTyping.includes(user) && (
                        <div className="top-[50%] flex items-center space-x-1 mt-1">
                          <span className="dot w-1 h-1 bg-gray-500 rounded-full animate-bounce1"></span>
                          <span className="dot w-1 h-1 bg-gray-500 rounded-full animate-bounce2"></span>
                          <span className="dot w-1 h-1 bg-gray-500 rounded-full animate-bounce3"></span>
                          <span className="mb-2 ml-1">يكتب الأنـ</span>
                        </div>
                      )}
                      {index < users.length - 1 && <p>&</p>}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex-1 p-4 pt-10 overflow-auto bg-[var(--color-body)] border-1 border-[var(--color-navbar)]">
                <div className="flex flex-col space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message._id}
                      className={`flex ${
                        message.sender === "me"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`p-4 rounded-2xl ${
                          message.sender === "me"
                            ? "bg-[var(--color-navbar)]"
                            : "bg-[var(--color-navbar)] opacity-90"
                        }`}
                      >
                        <p>{message.message}</p>
                        <span className="text-xs opacity-75">
                          {message.time}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-[var(--color-body)] border-1 border-[var(--color-navbar)] p-4 flex items-center border-t">
                <p className="cursor-pointer" onClick={handleSubmit}>
                  <MousePointer2 size={40} strokeWidth={0.5} />
                </p>
                <InputEmoji
                  value={newMessage}
                  onChange={HandleChangeMessage}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  inputClass="input"
                  cleanOnEnter
                  placeholder="Type a message ..."
                  shouldReturn={false}
                  shouldConvertEmojiToImage={false}
                  fontSize={17}
                />
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
