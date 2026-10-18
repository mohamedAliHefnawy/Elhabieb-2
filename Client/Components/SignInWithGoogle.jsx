"use client";

import React, { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { Avatar, Button } from "@nextui-org/react";
import Google from "@/public/images/google.png";
import axios from "axios";
import CryptoJS from "crypto-js";
import { useRouter } from "next/navigation";
import { UserAuth } from "@/app/auth/AuthWithGoogle";



const SignInWithGoogle = () => {
  const { googleSignIn } = UserAuth() || {};
  const handleSignIn = async () => {
    try {
      await googleSignIn();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Button
        type="button"
        className="w-[100%] h-14 flex justify-center items-center py-3"
        onClick={handleSignIn}
        variant="bordered"
        color="default"
      >
        <Avatar src={Google.src} size="sm" />
        <p className="opacity-80">التسجيل بواسطة جوجل</p>
      </Button>
    </div>
  );
};

export default SignInWithGoogle;
