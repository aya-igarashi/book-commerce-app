import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";

// 購入履歴検索API
export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  const userId = params.userId;

  try {
    // ユーザーIDで購入履歴を検索
    const purchases = await prisma.purchase.findMany({
      where: { userId: userId },
    });
    // 購入履歴をJSON形式で返す
    return NextResponse.json(purchases);
  } catch (err) {
    if (err instanceof Error) {
      // エラーが発生した場合のエラーハンドリング
      return NextResponse.json({ error: 'Failed to fetch purchase history', details: err.message }, { status: 500 });
    } else {
      // エラーがインスタンスでない場合の処理
      return NextResponse.json({ error: 'Unknown error occurred' }, { status: 500 });
    }
  }
}
