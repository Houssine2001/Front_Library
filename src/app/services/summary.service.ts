import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Summary, SummaryVersion } from '../models/summary.model';

@Injectable({
  providedIn: 'root'
})
export class SummaryService {
  private apiUrl = 'http://localhost:8080/api/summaries';

  constructor(private http: HttpClient) { }

  getAllSummaries(): Observable<Summary[]> {
    return this.http.get<Summary[]>(this.apiUrl);
  }

  getSummaryById(id: string): Observable<Summary> {
    return this.http.get<Summary>(`${this.apiUrl}/${id}`);
  }

  createSummary(summary: Summary): Observable<Summary> {
    return this.http.post<Summary>(this.apiUrl, summary);
  }

  updateSummary(id: string, summary: Summary): Observable<Summary> {
    return this.http.put<Summary>(`${this.apiUrl}/${id}`, summary);
  }

  deleteSummary(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  likeSummary(id: string): Observable<Summary> {
    return this.http.post<Summary>(`${this.apiUrl}/${id}/like`, {});
  }

  getSummaryVersions(id: string): Observable<SummaryVersion[]> {
    return this.http.get<SummaryVersion[]>(`${this.apiUrl}/${id}/versions`);
  }

  downloadSummaryPdf(id: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}/pdf`, { responseType: 'blob' });
  }
} 