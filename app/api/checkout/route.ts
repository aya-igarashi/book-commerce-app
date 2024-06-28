// 必要なモジュールをインポート
import { NextResponse } from 'next/server'; // Next.js のレスポンスオブジェクト
import Stripe from 'stripe'; // Stripe API を使用するためのモジュール

// 環境変数 STRIPE_SECRET_KEY が定義されているか確認
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not defined'); // 定義されていない場合、エラーメッセージを投げる
}

// Stripe インスタンスを作成
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  // Stripe の API キーを使用して初期化
});

// POST リクエストを処理する非同期関数を定義
export async function POST(request: Request): Promise<Response> {
  try {
    // リクエストのボディを JSON として解析し、変数に代入
    const { title, price, bookId, userId } = await request.json() as { title: string; price: number, bookId: string; userId: string };

    // Stripe チェックアウトセッションを作成
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'], // 支払い方法としてカードを指定
      metadata: {
        bookId: bookId, // メタデータに bookId を追加
      },
      client_reference_id: userId, // クライアント参照 ID に userId を設定
      line_items: [ // 購入アイテムを設定
        {
          price_data: { // 価格データ
            currency: 'jpy', // 通貨を日本円に設定
            product_data: { // 商品データ
              name: title, // 商品名を設定
            },
            unit_amount: price, // 商品の単価を設定
          },
          quantity: 1, // 購入数を1に設定
        },
      ],
      mode: 'payment', // 決済モードを支払いに設定
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/book/checkout-success?session_id={CHECKOUT_SESSION_ID}`, // 成功時のリダイレクトURL
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}`, // キャンセル時のリダイレクトURL
    });

    // 成功した場合、セッションの URL を JSON 形式で返す
    return NextResponse.json({ checkout_url: session.url });

  } catch (error) {
    // エラーハンドリング
    const err = error as Stripe.StripeRawError; // エラーを Stripe のエラーとしてキャスト
    return NextResponse.json({ error: err.message }, { status: 500 }); // エラーメッセージとステータスコードを返す
  }
}
