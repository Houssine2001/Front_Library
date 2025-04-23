export interface Book {
  _id?: string;
  title: string;
  author: string;
  isbn: string;
  description: string;
  publishedYear: number;
  quantity: number;
  available: boolean;
} 