import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from '../models/order';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = `${environment.apiUrl}/api/orders`;

  constructor(private http: HttpClient) { }
/*
  placeOrder(userId: number): Observable<Order> {
    return this.http.post<Order>(`${this.apiUrl}/place`, { userId });
  }
*/


getLastOrder(userId: number): Observable<Order> {
  return this.http.get<Order>(`${this.apiUrl}/last?userId=${userId}`);
}

// Modifier la méthode placeOrder pour attendre un number (l'ID de commande)
placeOrder(userId: number): Observable<number> {
  return this.http.post<number>(`${this.apiUrl}/place`, { userId });
}

// Ajouter une méthode pour récupérer la commande complète
getOrder(orderId: number): Observable<Order> {
  return this.http.get<Order>(`${this.apiUrl}/${orderId}`);
}

downloadInvoice(orderId: number): Observable<Blob> {
  return this.http.get(`${this.apiUrl}/download-invoice/${orderId}`, { responseType: 'blob' });
}

  
getOrderStatus(orderId: number): Observable<string> {
  return this.http.get<string>(`${this.apiUrl}/status?orderId=${orderId}`);
}

cancelOrder(orderId: number): Observable<string> {
  // Spécifiez responseType: 'text' pour traiter la réponse comme une chaîne de caractères
  return this.http.put(`${this.apiUrl}/cancel`, { orderId }, { responseType: 'text' });
}

  
}
