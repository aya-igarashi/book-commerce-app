import { nextAuthOptions } from "@/app/lib/next-auth/options";
// nextAuthOptions: NextAuthの設定オプションを含むオブジェクトをインポートしています。
import NextAuth from "next-auth/next";
// NextAuthのメイン関数をインポートしています。この関数は認証の設定を行うために使用されます。

// NextAuth関数を呼び出し、nextAuthOptionsを渡して、handlerという変数に結果を格納しています。このhandlerは、認証リクエストを処理するためのエンドポイントハンドラです。
const handler = NextAuth(nextAuthOptions);

// handlerをHTTPメソッドGETおよびPOSTとしてエクスポートしています。これにより、Next.jsがこれらのHTTPリクエストを処理するためのエンドポイントを自動的に設定します。
export { handler as GET, handler as POST };