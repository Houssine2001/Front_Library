import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:3000/api';
  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
  });

  constructor(private http: HttpClient) {}

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Une erreur est survenue';
    
    if (error.status === 403) {
      errorMessage = 'Accès refusé. Veuillez vous connecter ou vérifier vos permissions.';
    } else if (error.status === 401) {
      errorMessage = 'Non autorisé. Veuillez vous connecter.';
    } else if (error.error instanceof ErrorEvent) {
      errorMessage = `Erreur côté client: ${error.error.message}`;
    } else {
      errorMessage = `Erreur serveur (${error.status}): ${error.error?.message || error.message}`;
    }
    
    console.error('API Error:', error);
    return throwError(() => new Error(errorMessage));
  }

  // Documents
  getDocs(): Observable<any> {
    return this.http.get(`${this.apiUrl}/docs`, { headers: this.headers })
      .pipe(catchError(this.handleError));
  }

  getDocById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/docs/${id}`, { headers: this.headers })
      .pipe(catchError(this.handleError));
  }

  createDoc(doc: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/docs`, doc, { headers: this.headers })
      .pipe(catchError(this.handleError));
  }

  updateDoc(id: string, doc: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/docs/${id}`, doc, { headers: this.headers })
      .pipe(catchError(this.handleError));
  }

  deleteDoc(id: string, userId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/docs/${id}?userId=${userId}`, { headers: this.headers })
      .pipe(catchError(this.handleError));
  }

  getDocVersions(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/docs/${id}/versions`, { headers: this.headers })
      .pipe(catchError(this.handleError));
  }

  restoreDocVersion(docId: string, versionId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/docs/${docId}/versions/${versionId}/restore`, {}, { headers: this.headers })
      .pipe(catchError(this.handleError));
  }

  downloadDocPdf(id: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/docs/${id}/pdf`, { 
      headers: this.headers,
      responseType: 'blob' 
    }).pipe(catchError(this.handleError));
  }

  // Notes
  getNotes(): Observable<any> {
    return this.http.get(`${this.apiUrl}/notes`, { headers: this.headers })
      .pipe(catchError(this.handleError));
  }

  getNoteById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/notes/${id}`, { headers: this.headers })
      .pipe(catchError(this.handleError));
  }

  createNote(note: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/notes`, note, { headers: this.headers })
      .pipe(catchError(this.handleError));
  }

  updateNote(id: string, note: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/notes/${id}`, note, { headers: this.headers })
      .pipe(catchError(this.handleError));
  }

  deleteNote(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/notes/${id}`, { headers: this.headers })
      .pipe(catchError(this.handleError));
  }

  getNoteVersions(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/notes/${id}/versions`, { headers: this.headers })
      .pipe(catchError(this.handleError));
  }

  // Summaries
  getSummaries(params?: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/summaries`, { 
      headers: this.headers,
      params 
    }).pipe(catchError(this.handleError));
  }

  getSummaryById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/summaries/${id}`, { headers: this.headers })
      .pipe(catchError(this.handleError));
  }

  createSummary(summary: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/summaries`, summary, { headers: this.headers })
      .pipe(catchError(this.handleError));
  }

  updateSummary(id: string, summary: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/summaries/${id}`, summary, { headers: this.headers })
      .pipe(catchError(this.handleError));
  }

  deleteSummary(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/summaries/${id}`, { headers: this.headers })
      .pipe(catchError(this.handleError));
  }

  likeSummary(id: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/summaries/${id}/like`, {}, { headers: this.headers })
      .pipe(catchError(this.handleError));
  }

  downloadSummaryPdf(id: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/summaries/${id}/pdf`, { 
      headers: this.headers,
      responseType: 'blob' 
    }).pipe(catchError(this.handleError));
  }

  // Comments
  createComment(comment: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/comments`, comment, { headers: this.headers })
      .pipe(catchError(this.handleError));
  }

  getComments(documentType: string, documentId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/comments/${documentType}/${documentId}`, { headers: this.headers })
      .pipe(catchError(this.handleError));
  }

  getCommentById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/comments/${id}`, { headers: this.headers })
      .pipe(catchError(this.handleError));
  }

  updateComment(id: string, comment: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/comments/${id}`, comment, { headers: this.headers })
      .pipe(catchError(this.handleError));
  }

  deleteComment(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/comments/${id}`, { headers: this.headers })
      .pipe(catchError(this.handleError));
  }

  likeComment(id: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/comments/${id}/like`, {}, { headers: this.headers })
      .pipe(catchError(this.handleError));
  }

  // PDF Downloads
  downloadNotePdf(id: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/notes/${id}/pdf`, { 
      headers: this.headers,
      responseType: 'blob' 
    }).pipe(catchError(this.handleError));
  }
} 