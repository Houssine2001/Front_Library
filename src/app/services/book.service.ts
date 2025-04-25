import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Book } from '../models/Book'; // Attention à la casse (book vs Book)
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private apiUrl1 = `${environment.apiUrl}/api/books`;
  private apiUrl = `${environment.apiUrl}/api/book`;


  constructor(private http: HttpClient) { }
  
  getBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.apiUrl1}/all`)
      .pipe(
        catchError(error => {
          console.error('Error fetching books:', error);
          return throwError(() => error);
        })
      );
  }

  // Récupérer tous les livres
  getBookse(): Observable<Book[]> {
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