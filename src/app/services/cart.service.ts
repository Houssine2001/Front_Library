import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { CartItem } from '../models/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'http://localhost:8084/api/cart';

  constructor(private http: HttpClient) { }

  getCart(userId: number): Observable<CartItem[]> {
    return this.http.get<CartItem[]>(`${this.apiUrl}/user/${userId}`);
  }

  addToCart(userId: number, bookId: number, quantity: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, { userId, bookId, quantity });
  }

 
  // Remove an item from the cart
  removeItemFromCart(userId: number, bookId: number): Observable<any> {
    if (!userId || !bookId) {
      return throwError('UserId and BookId are required');
    }
    return this.http.delete<any>(`${this.apiUrl}/remove/item?userId=${userId}&bookId=${bookId}`).pipe(
      catchError(error => {
        console.error('Error removing item from cart:', error);
        return throwError('Failed to remove item from cart');
      })
    );
  }

  applyDiscount(userId: number, promoCode: string): Observable<{ subtotal: number, tax: number, shipping: number, total: number, items: any[] }> {
    return this.http.put<{ subtotal: number, tax: number, shipping: number, total: number, items: any[] }>(
      `${this.apiUrl}/apply-discount?userId=${userId}&promoCode=${promoCode}`,
      {}
    );
  }

  clearCart(): Observable<any> {
    const userId = 1; // Example user ID
    return this.http.delete<any>(`${this.apiUrl}/remove/all?userId=${userId}`);
  }
  
  
  updateQuantity(userId: number, bookId: number, quantity: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/update`, { userId, bookId, quantity });
  }

  // Mise à jour de calculateTotal pour renvoyer un objet contenant le total et les détails des articles
 


  calculateTotal(userId: number): Observable<{ subtotal: number, tax: number, shipping: number, total: number, items: any[] }> {
    return this.http.get<{ subtotal: number, tax: number, shipping: number, total: number, items: any[] }>(`${this.apiUrl}/total?userId=${userId}`);
  }
  
}