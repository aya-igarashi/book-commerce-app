import { getServerSession, User } from "next-auth";
import Image from "next/image";
import { nextAuthOptions } from "../lib/next-auth/options";
import { BookType, Purchase } from "../types/types";
import { getDetailBook } from "../lib/microcms/client";
import PurchaseDetailBook from "../components/PurchaseDetailBook";

export default async function ProfilePage() {
  const session = await getServerSession(nextAuthOptions);
  const user = session?.user as User;

  const purchasesDetailBooks: BookType[] = await (async () => {
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
          console.log(purchasesData); //

          return await Promise.all(purchasesData.map(async (purchase) => {
            return await getDetailBook(purchase.bookId);
          }));
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

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">プロフィール</h1>

      <div className="bg-white shadow-md rounded p-4">
        <div className="flex items-center">
          <Image
            priority
            src={user.image || "/default_icon.png"}
            alt="user profile_icon"
            width={60}
            height={60}
            className="rounded-t-md"
          />
          <h2 className="text-lg ml-4 font-semibold">お名前：{user.name}</h2>
        </div>
      </div>

      <span className="font-medium text-lg mb-4 mt-4 block">購入した記事</span>
      <div className="flex items-center gap-6">
        {purchasesDetailBooks.map((book: BookType) => (
          <PurchaseDetailBook
            key={book.id}
            book={book}
          />
        ))}
      </div>
    </div>
  );
}
