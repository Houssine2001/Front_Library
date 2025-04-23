import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comment } from '../models/comment.model';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private apiUrl = 'http://localhost:8080/api/comments';

  constructor(private http: HttpClient) { }

  createComment(comment: Comment): Observable<Comment> {
    return this.http.post<Comment>(this.apiUrl, comment);
  }

  getCommentsByDocument(documentType: string, documentId: string): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.apiUrl}/${documentType}/${documentId}`);
  }

  getCommentById(id: string): Observable<Comment> {
    return this.http.get<Comment>(`${this.apiUrl}/${id}`);
  }

  getReplies(commentId: string): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.apiUrl}/replies/${commentId}`);
  }

  updateComment(id: string, comment: Comment): Observable<Comment> {
    return this.http.put<Comment>(`${this.apiUrl}/${id}`, comment);
  }

  deleteComment(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  likeComment(id: string): Observable<Comment> {
    return this.http.post<Comment>(`${this.apiUrl}/${id}/like`, {});
  }
} 