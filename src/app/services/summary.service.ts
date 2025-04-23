import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Summary, SummaryVersion } from '../models/summary.model';

@Injectable({
  providedIn: 'root'
})
export class SummaryService {
  private apiUrl = 'http://localhost:3000/api/summaries';
  private headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  constructor(private http: HttpClient) { }

  private handleError(error: HttpErrorResponse) {
    console.error('SummaryService error:', error);
    let errorMessage = 'Une erreur est survenue';
    
    if (error.status === 0) {
      errorMessage = 'Impossible de se connecter au serveur. Veuillez vérifier que le serveur est en cours d\'exécution.';
    } else if (error.error instanceof ErrorEvent) {
      errorMessage = `Erreur côté client: ${error.error.message}`;
    } else {
      errorMessage = `Erreur serveur (${error.status}): ${error.error?.message || error.message}`;
    }
    
    return throwError(() => new Error(errorMessage));
  }

  getAllSummaries(): Observable<Summary[]> {
    return this.http.get<Summary[]>(this.apiUrl, { headers: this.headers })
      .pipe(catchError(this.handleError));
  }

  getSummaryById(id: string): Observable<Summary> {
    return this.http.get<Summary>(`${this.apiUrl}/${id}`, { headers: this.headers })
      .pipe(catchError(this.handleError));
  }

  createSummary(summary: Summary): Observable<Summary> {
    console.log('Creating summary with data:', summary);
    return this.http.post<Summary>(this.apiUrl, summary, { headers: this.headers })
      .pipe(catchError(this.handleError));
  }

  updateSummary(id: string, summary: Summary): Observable<Summary> {
    return this.http.put<Summary>(`${this.apiUrl}/${id}`, summary, { headers: this.headers })
      .pipe(catchError(this.handleError));
  }

  deleteSummary(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.headers })
      .pipe(catchError(this.handleError));
  }

  likeSummary(id: string): Observable<Summary> {
    return this.http.post<Summary>(`${this.apiUrl}/${id}/like`, {}, { headers: this.headers })
      .pipe(catchError(this.handleError));
  }

  getSummaryVersions(id: string): Observable<SummaryVersion[]> {
    return this.http.get<SummaryVersion[]>(`${this.apiUrl}/${id}/versions`, { headers: this.headers })
      .pipe(catchError(this.handleError));
  }

  downloadSummaryPdf(id: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}/pdf`, { 
      headers: this.headers,
      responseType: 'blob' 
    }).pipe(catchError(this.handleError));
  }
} 