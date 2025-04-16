export interface Book {
  id: number| null;
  title: string;
  author: string;
  genre: string;
  isbn: string;
  description: string;
  price: number;
  quantity: number;
}