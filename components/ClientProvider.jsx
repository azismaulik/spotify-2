"use client";

import { SessionProvider } from "next-auth/react";
import { RecoilRoot } from "recoil";

export default function ClientProviders({ children }) {
  return (
    <SessionProvider>
      <RecoilRoot>{children}</RecoilRoot>
    </SessionProvider>
  );
}
