import { CartItem } from './cart-item';

export interface Order {
  id: number;
  items: CartItem[];
  totalAmount: number;
  status: string;
}