"use client";

import Image from "next/image";
import React from "react";
import { signIn } from "next-auth/react";

const Login = () => {
  return (
    <div className="w-full min-h-screen flex justify-center items-center">
      <button
        onClick={() => signIn("spotify", { callbackUrl: "/" })}
        type="button"
        className="flex gap-2 items-center bg-white text-black font-semibold py-3 px-4 rounded-full hover:bg-green-700 hover:text-white">
        <Image
          src="https://links.papareact.com/9xl"
          alt="Spotify"
          width={25}
          height={25}
        />
        Login with Spotify
      </button>
    </div>
  );
};

export default Login;
