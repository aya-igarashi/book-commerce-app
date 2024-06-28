// "use client"; // もしこのコンポーネントがクライアントサイドで実行される場合はコメントアウトを外す

// 必要なモジュールをインポート
import { getServerSession, User } from "next-auth"; // next-authからサーバーセッションとユーザータイプをインポート
import { getAllBooks } from "./lib/microcms/client"; // 全ての本を取得する関数をインポート
import { BookType } from "./types/types"; // 本のタイプをインポート
import { nextAuthOptions } from "./lib/next-auth/options"; // next-authのオプションをインポート
import Book from "./components/Book"; // コンポーネントのスペルミスを修正
import { Purchase } from "@prisma/client";

// 非同期関数としてHomeコンポーネントを定義
export default async function Home() {
  // 全ての本を取得
  const { contents }: { contents: BookType[] } = await getAllBooks();
  // サーバーセッションを取得
  const session = await getServerSession(nextAuthOptions);
  // セッションからユーザー情報を取得
  const user: User | undefined = session?.user;

  const purchaseBookIds: string[] = await (async () => {
    if (user) {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/purchases/${user.id}`, // 環境変数を使ってAPIのURLを構築
          { cache: "no-store" } // SSR
        );

        // レスポンスの内容をログに記録
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const purchasesData: Purchase[] = await response.json(); // レスポンスをJSONとして解析
          console.log(purchasesData); // 購入データをコンソールにログ

          return purchasesData.map(purchase => purchase.bookId);
        } else {
          // レスポンスがJSONでない場合の処理
          const text = await response.text();
          console.error("レスポンスがJSONではありません:", text);
        }
      } catch (error) {
        console.error("購入履歴の取得中にエラーが発生しました:", error);
      }
    }
    return [];
  })();

  // JSXを返す
  return (
    <>
      <main className="flex flex-wrap justify-center items-center md:mt-32 mt-20">
        <h2 className="text-center w-full font-bold text-3xl mb-2">
          Book Commerce
        </h2>
        {contents.map((book: BookType) => (
          <Book key={book.id} book={book} isPurchased={purchaseBookIds.includes(book.id)} /> // 本ごとにBookコンポーネントをレンダリング
        ))}
      </main>
    </>
  );
}
