"use client";

import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Header = () => {
  const router = useRouter();
  const { data: session } = useSession();

  return (
    <>
      {session && (
        <header
          className={` absolute top-0 left-0 right-0 flex justify-between pt-5 pb-4 px-8`}>
          <div className="flex items-center gap-2">
            <div
              onClick={() => router.back()}
              className="rounded-full p-1 bg-neutral-950/70 flex justify-center items-center border border-neutral-800">
              <ChevronLeftIcon className="text-white group-hover:text-neutral-400 w-6 h-6" />
            </div>
            <div
              onClick={() => router.forward()}
              className="rounded-full p-1 bg-neutral-950/70 flex justify-center items-center border border-neutral-800">
              <ChevronRightIcon className="text-white group-hover:text-neutral-400 w-6 h-6" />
            </div>
          </div>
          <div
            onClick={signOut}
            className="w-max flex items-center space-x-3 opacity-90 hover:opacity-80 cursor-pointer rounded-full p-1 pr-2 bg-black border border-neutral-800">
            <UserCircleIcon className="h-8 w-8" />
            <p>{session?.user?.name}</p>
            <ChevronDownIcon className="h-4 w-4" />
          </div>
        </header>
      )}
    </>
  );
};

export default Header;
