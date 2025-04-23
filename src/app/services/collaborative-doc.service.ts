import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CollaborativeDoc, DocVersion } from '../models/collaborative-doc.model';

@Injectable({
  providedIn: 'root'
})
export class CollaborativeDocService {
  private apiUrl = 'http://localhost:3000/api/docs';
  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
  });

  constructor(private http: HttpClient) { }

  private getUserId(): string {
    return localStorage.getItem('userId') || 'current-user-id';
  }

  private transformDocForBackend(doc: CollaborativeDoc): any {
    return {
      title: doc.title,
      content: doc.content,
      bookId: doc.bookId || 'default-book-id', // TODO: Get actual book ID
      ownerId: doc.author || this.getUserId(),
      collaborators: doc.collaborators.map(userId => ({
        userId,
        permission: 'read'
      })),
      lastModifiedBy: this.getUserId()
    };
  }

  getAllDocs(): Observable<CollaborativeDoc[]> {
    return this.http.get<CollaborativeDoc[]>(`${this.apiUrl}?userId=${this.getUserId()}`, { headers: this.headers });
  }

  getDocById(id: string): Observable<CollaborativeDoc> {
    return this.http.get<CollaborativeDoc>(`${this.apiUrl}/${id}?userId=${this.getUserId()}`, { headers: this.headers });
  }

  createDoc(doc: CollaborativeDoc): Observable<CollaborativeDoc> {
    const backendDoc = this.transformDocForBackend(doc);
    return this.http.post<CollaborativeDoc>(this.apiUrl, backendDoc, { headers: this.headers });
  }

  updateDoc(id: string, doc: CollaborativeDoc): Observable<CollaborativeDoc> {
    const backendDoc = this.transformDocForBackend(doc);
    return this.http.put<CollaborativeDoc>(`${this.apiUrl}/${id}`, backendDoc, { headers: this.headers });
  }

  deleteDoc(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}?userId=${this.getUserId()}`, { headers: this.headers });
  }

  addCollaborator(docId: string, userId: string): Observable<CollaborativeDoc> {
    return this.http.post<CollaborativeDoc>(`${this.apiUrl}/${docId}/collaborators`, { 
      userId,
      currentUserId: this.getUserId()
    }, { headers: this.headers });
  }

  removeCollaborator(docId: string, userId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${docId}/collaborators/${userId}?currentUserId=${this.getUserId()}`, { headers: this.headers });
  }

  getDocVersions(id: string): Observable<DocVersion[]> {
    return this.http.get<DocVersion[]>(`${this.apiUrl}/${id}/versions?userId=${this.getUserId()}`, { headers: this.headers });
  }

  createDocVersion(id: string, version: DocVersion): Observable<DocVersion> {
    const versionWithUserId = { ...version, userId: this.getUserId() };
    return this.http.post<DocVersion>(`${this.apiUrl}/${id}/versions`, versionWithUserId, { headers: this.headers });
  }

  getDocVersionById(id: string, versionId: string): Observable<DocVersion> {
    return this.http.get<DocVersion>(`${this.apiUrl}/${id}/versions/${versionId}?userId=${this.getUserId()}`, { headers: this.headers });
  }

  restoreDocVersion(id: string, versionId: string): Observable<CollaborativeDoc> {
    return this.http.post<CollaborativeDoc>(`${this.apiUrl}/${id}/versions/${versionId}/restore`, { 
      userId: this.getUserId()
    }, { headers: this.headers });
  }

  downloadDocPdf(id: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}/pdf?userId=${this.getUserId()}`, { 
      headers: this.headers,
      responseType: 'blob' 
    });
  }
} 