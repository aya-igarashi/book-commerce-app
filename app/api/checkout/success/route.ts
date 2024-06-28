// Prisma クライアントをインポートしてデータベース接続を提供
import prisma from "@/app/lib/prisma";
import { Purchase } from "@/app/types/types";
// Next.js のレスポンスオブジェクトをインポート
import { NextResponse } from "next/server";
// Stripe モジュールをインポートして Stripe API を使用
import Stripe from "stripe";

// 環境変数 STRIPE_SECRET_KEY が定義されているか確認
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not defined'); // 定義されていない場合はエラーメッセージを投げる
}

// Stripe インスタンスを作成
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
});

// リクエストボディの型定義
interface RequestBody {
  sessionId: string;
}

// POST リクエストを処理する非同期関数を定義
export async function POST(request: Request): Promise<Response> {
  // リクエストのボディを JSON として解析し、sessionId を取得
  const { sessionId }: RequestBody = await request.json();

  try {
    // Stripe セッションを取得
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // session.metadata が存在するか確認
    if (!session.metadata || !session.client_reference_id) {
      return NextResponse.json({ error: 'Session metadata or client_reference_id is missing' }, { status: 400 });
    }

    // 既存の購入履歴をチェックするためのクエリを実行
    const existingPurchase = await prisma.purchase.findFirst({
      where: {
        userId: session.client_reference_id as string, // セッションからユーザーIDを取得して条件に使用
        bookId: session.metadata.bookId as string, // セッションから書籍IDを取得して条件に使用
      }
    });

    if (!existingPurchase) {
      // データベースに保存する購入履歴のデータを準備
      const purchaseData: Purchase = {
        userId: session.client_reference_id as string,
        bookId: session.metadata.bookId as string,
      };

      // Prisma クライアントを使用して購入履歴をデータベースに保存
      const purchase = await prisma.purchase.create({
        data: purchaseData,
      });
      console.log(purchase);
      return NextResponse.json({ purchase });

    } else {
      return NextResponse.json({ messege: "既に購入済みです。" });
    }

  } catch (error) {
    // エラーハンドリング
    const err = error as Stripe.StripeRawError; // エラーを Stripe のエラーとしてキャスト
    return NextResponse.json({ error: err.message }, { status: 500 }); // エラーメッセージを JSON フォーマットで返す
  }
}
