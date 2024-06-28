"use client";

import { SessionProvider } from "next-auth/react";
import { FC, PropsWithChildren } from "react";

// SessionProviderがサーバー側で呼び出せないためクライアント側で呼び出すためのファイル
export const NextAuthProvider: FC<PropsWithChildren> = ({ children }) => {
  return <SessionProvider>{children}</SessionProvider>;
}