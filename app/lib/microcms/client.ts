// BookType 型をインポート
import { BookType } from '@/app/types/types';
// microCMS のクライアントを作成するための関数をインポート
import { createClient } from 'microcms-js-sdk';

// microCMS のクライアントを作成
export const client = createClient({
  // サービスドメインを環境変数から取得
  serviceDomain: process.env.NEXT_PUBLIC_SERVICE_DOMAIN!,
  // APIキーを環境変数から取得
  apiKey: process.env.NEXT_PUBLIC_API_KEY!,
});

// 全ての本を取得する非同期関数を定義
export const getAllBooks = async () => {
  // クライアントを使って本のリストを取得し、BookType 型にキャスト
  const allBooks = await client.getList<BookType>({
    endpoint: "sai-e-books",
    // microcmsで投稿した内容が即時反映されるための設定
    customRequestInit: {
      cache: "no-store",
    }
  });
  // 取得した本のリストを返す
  return allBooks;
}

// 特定の本の詳細を取得する非同期関数を定義
export const getDetailBook = async (contentId: string) => {
  // クライアントを使って本の詳細を取得し、BookType 型にキャスト
  const detailBook = await client.getListDetail<BookType>({
    endpoint: "sai-e-books",
    contentId,
    customRequestInit: {
      cache: "no-store",
    }
  });
  // 取得した本の詳細を返す
  return detailBook;
}
