import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GithubProvider from "next-auth/providers/github";
import { NextAuthOptions } from "next-auth";
import prisma from "../prisma";

export const nextAuthOptions: NextAuthOptions = {
  debug: false,
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: { // セッションとユーザ情報を返す設定 //関数の使い方はnextauthドキュメント参照
    session: ({ session, user }) => {
      return {
        ...session,
        user: {
          ...session.user,
          id: user.id,
        }
      }
    }
  }
};

// nextAuthOptionsのインポート:

// nextAuthOptionsは、NextAuthの設定オプションを含むオブジェクトです。
// NextAuthのインポートとハンドラーの設定:

// NextAuth関数を使用して認証ハンドラーを作成し、GETおよびPOSTメソッドにエクスポートします。
// PrismaAdapterとGithubProviderの設定:

// PrismaAdapterはPrismaをNextAuthのデータベースアダプターとして使用します。
// GithubProviderはGitHub認証プロバイダーを設定します。
// callbacks設定:

// セッション情報をカスタマイズするためのコールバック関数を設定します。ここでは、セッション情報にユーザーIDを追加しています。