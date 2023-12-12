"use client";

import { SessionProvider } from "next-auth/react";
import { RecoilRoot } from "recoil";

export default function ClientProviders({ children, session }) {
  return (
    <SessionProvider session={session}>
      <RecoilRoot>{children}</RecoilRoot>
    </SessionProvider>
  );
}
