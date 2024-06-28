// next-auth.d.ts
import NextAuth, { DefaultSession } from "next-auth";

// next-auth モジュールを拡張してカスタムフィールドを追加
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}
