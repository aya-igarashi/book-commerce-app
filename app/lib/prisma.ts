// Prisma Clientのインスタンスを作成し、再利用可能な形でエクスポートするためのもの
// 、Next.jsのようなサーバーレス環境では、リクエストごとに新しいPrisma Clientのインスタンスを作成するのではなく、単一のインスタンスを共有することが推奨されます。

import { PrismaClient } from "@prisma/client"

// Prisma Clientのインスタンスを格納するための変数を宣言
let prisma: PrismaClient;

// // グローバルオブジェクトを型キャストして、新しいプロパティを持つようにする
const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined;
};

// lobalForPrisma.prismaが未定義（undefined）である場合、新しいPrismaClientインスタンスを作成し、globalForPrisma.prismaに代入
if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = new PrismaClient();
}
// グローバルオブジェクトに保存されているPrisma Clientのインスタンスを、ローカル変数prismaに代入
prisma = globalForPrisma.prisma;

export default prisma;

// 利点と背景
// サーバーレス環境でのパフォーマンス向上: サーバーレス環境（例: Vercel、AWS Lambda）では、リクエストごとに新しいデータベース接続を作成することが高コストになります。このアプローチにより、既存の接続を再利用し、接続オーバーヘッドを削減できます。
// シングルトンパターン: Prisma Clientのインスタンスをグローバルに保持することで、アプリケーション内で単一のインスタンスを共有するシングルトンパターンを実現しています。
// ランタイムに単一のprismaを持つために一度globalオブジェクトにキャストし重複がないかを確認する。
