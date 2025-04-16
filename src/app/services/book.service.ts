import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Book } from '../models/Book'; // Attention à la casse (book vs Book)

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private apiUrl = 'http://localhost:8080/api/books'; // Ton port, ajuste à 8080 si nécessaire

  constructor(private http: HttpClient) { }

  // Récupérer tous les livres
  getBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(this.apiUrl); // Appel à /api/books
  }

  // Récupérer un livre par ID
  getBookById(id: number): Observable<Book> {
    return this.http.get<Book>(`${this.apiUrl}/${id}`);
  }

  // Ajouter un livre
  createBook(book: Book): Observable<Book> {
    return this.http.post<Book>(this.apiUrl, book);
  }

  // Modifier un livre
  updateBook(id: number, book: Book): Observable<Book> {
    return this.http.put<Book>(`${this.apiUrl}/${id}`, book);
  }

  // Supprimer un livre
  deleteBook(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Trier les livres par prix
  getBooksSortedByPrice(sort: string, minPrice?: number, maxPrice?: number): Observable<Book[]> {
    let url = `${this.apiUrl}/sorted-by-price?sort=${sort}`;
    if (minPrice !== undefined) url += `&minPrice=${minPrice}`;
    if (maxPrice !== undefined) url += `&maxPrice=${maxPrice}`;
    return this.http.get<Book[]>(url);
  }
}