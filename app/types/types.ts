type BookType = {
  id: string;
  title: string;
  content: string;
  price: number;
  thumbnail: { url: string };
  createdAt: string;
  updatedAt: string;
}

// 購入履歴の型定義
interface Purchase {
  userId: string;
  bookId: string;
}



export type { BookType, Purchase };