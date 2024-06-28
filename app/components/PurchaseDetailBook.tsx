import React from "react";
import Link from "next/link";
import Image from "next/image";
import { BookType } from "../types/types";

type PurchaseDetailBookProps = {
  book: BookType // 修正: プロパティ名を`book`に変更
}

const PurchaseDetailBook = ({ book }: PurchaseDetailBookProps) => {
  return (
    <Link
      href={`/book/${book.id}`} // 書籍の詳細ページへのリンク
      className="cursor-pointer shadow-2xl duration-300 hover:translate-y-1 hover:shadow-none"
    >
      <Image
        priority
        src={book.thumbnail.url}
        alt={book.title}
        width={450}
        height={350}
        className="rounded-t-md object-cover" // object-coverを追加してアスペクト比を保つ
        style={{ width: 'auto', height: 'auto' }} // アスペクト比を保つためのスタイルを追加
      />
      <div className="px-4 py-4 bg-slate-100 rounded-b-md">
        <h2 className="text-lg font-semibold">{book.title}</h2>
        <p className="mt-2 text-md text-slate-700">値段：{book.price}円</p>
      </div>
    </Link>
  );
};

export default PurchaseDetailBook;
