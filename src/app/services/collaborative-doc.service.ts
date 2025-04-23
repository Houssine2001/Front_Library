import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CollaborativeDoc, DocVersion } from '../models/collaborative-doc.model';

@Injectable({
  providedIn: 'root'
})
export class CollaborativeDocService {
  private apiUrl = 'http://localhost:8080/api/docs';

  constructor(private http: HttpClient) { }

  getAllDocs(): Observable<CollaborativeDoc[]> {
    return this.http.get<CollaborativeDoc[]>(this.apiUrl);
  }

  getDocById(id: string): Observable<CollaborativeDoc> {
    return this.http.get<CollaborativeDoc>(`${this.apiUrl}/${id}`);
  }

  createDoc(doc: CollaborativeDoc): Observable<CollaborativeDoc> {
    return this.http.post<CollaborativeDoc>(this.apiUrl, doc);
  }

  updateDoc(id: string, doc: CollaborativeDoc): Observable<CollaborativeDoc> {
    return this.http.put<CollaborativeDoc>(`${this.apiUrl}/${id}`, doc);
  }

  deleteDoc(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  addCollaborator(docId: string, userId: string): Observable<CollaborativeDoc> {
    return this.http.post<CollaborativeDoc>(`${this.apiUrl}/${docId}/collaborators`, { userId });
  }

  removeCollaborator(docId: string, userId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${docId}/collaborators/${userId}`);
  }

  getDocVersions(id: string): Observable<DocVersion[]> {
    return this.http.get<DocVersion[]>(`${this.apiUrl}/${id}/versions`);
  }

  createDocVersion(id: string, version: DocVersion): Observable<DocVersion> {
    return this.http.post<DocVersion>(`${this.apiUrl}/${id}/versions`, version);
  }

  getDocVersionById(id: string, versionId: string): Observable<DocVersion> {
    return this.http.get<DocVersion>(`${this.apiUrl}/${id}/versions/${versionId}`);
  }

  restoreDocVersion(id: string, versionId: string): Observable<CollaborativeDoc> {
    return this.http.post<CollaborativeDoc>(`${this.apiUrl}/${id}/versions/${versionId}/restore`, {});
  }

  downloadDocPdf(id: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}/pdf`, { responseType: 'blob' });
  }
} 