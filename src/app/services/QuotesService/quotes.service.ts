import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {catchError, map, Observable, throwError} from "rxjs";
import {Quote} from "../../models/Quote";

interface QuotableResponse {
  content: string;
  author: string;
  tags: string[];
}

@Injectable({
  providedIn: 'root'
})
export class QuoteService {
  private apiUrl = 'http://localhost:8888/taha-service/api/quotes';
  private quotableApiUrl = 'https://api.quotable.io/random';


  constructor(private http: HttpClient) {}

  getAllQuotes(category?: string): Observable<Quote[]> {
    let params = new HttpParams();
    if (category) {
      params = params.set('category', category);
    }
    return this.http.get<Quote[]>(this.apiUrl, { params }).pipe(
      catchError(this.handleError)
    );
  }

  addQuote(quote: Quote, userId: number): Observable<Quote> {
    return this.http.post<Quote>(`${this.apiUrl}/${userId}`, quote).pipe(
      catchError(this.handleError)
    );
  }

  deleteQuote(id: any): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  getRandomQuote(): Observable<Quote> {
    return this.http.get<QuotableResponse>(this.quotableApiUrl).pipe(
      map(response => ({
        text: response.content,
        author: response.author,
        category: response.tags && response.tags.length > 0 ? response.tags[0] : ''
      }))
    );
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(() => new Error('Something went wrong; please try again later.'));
  }
}
