import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  // Notes
  getNotes(params?: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/notes`, { params });
  }

  getNoteById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/notes/${id}`);
  }

  createNote(note: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/notes`, note);
  }

  updateNote(id: string, note: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/notes/${id}`, note);
  }

  deleteNote(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/notes/${id}`);
  }

  getNoteVersions(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/notes/${id}/versions`);
  }

  // Summaries
  getSummaries(params?: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/summaries`, { params });
  }

  getSummaryById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/summaries/${id}`);
  }

  createSummary(summary: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/summaries`, summary);
  }

  updateSummary(id: string, summary: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/summaries/${id}`, summary);
  }

  deleteSummary(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/summaries/${id}`);
  }

  likeSummary(id: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/summaries/${id}/like`, {});
  }

  // Collaborative Documents
  getDocs(params?: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/docs`, { params });
  }

  getDocById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/docs/${id}`);
  }

  createDoc(doc: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/docs`, doc);
  }

  updateDoc(id: string, doc: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/docs/${id}`, doc);
  }

  deleteDoc(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/docs/${id}`);
  }

  addCollaborator(docId: string, userId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/docs/${docId}/collaborators`, { userId });
  }

  removeCollaborator(docId: string, userId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/docs/${docId}/collaborators/${userId}`);
  }

  // Comments
  createComment(comment: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/comments`, comment);
  }

  getComments(documentType: string, documentId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/comments/${documentType}/${documentId}`);
  }

  getCommentById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/comments/${id}`);
  }

  updateComment(id: string, comment: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/comments/${id}`, comment);
  }

  deleteComment(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/comments/${id}`);
  }

  likeComment(id: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/comments/${id}/like`, {});
  }

  // PDF Downloads
  downloadNotePdf(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/notes/${id}/pdf`, { responseType: 'blob' });
  }

  downloadSummaryPdf(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/summaries/${id}/pdf`, { responseType: 'blob' });
  }

  downloadDocPdf(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/docs/${id}/pdf`, { responseType: 'blob' });
  }

  // Document Versions
  getDocVersions(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/docs/${id}/versions`);
  }

  restoreDocVersion(docId: string, versionId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/docs/${docId}/versions/${versionId}/restore`, {});
  }
} 