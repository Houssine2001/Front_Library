import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Event } from '../models/Event';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = 'http://localhost:8083/library';

  constructor(private http: HttpClient) {}

  getAllEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.apiUrl}/all`);
  }

  getEventById(id: number): Observable<Event> {
    return this.http.get<Event>(`${this.apiUrl}/${id}`);
  }

  reserveEvent(eventId: number, userId: string, userPhoneNumber: string): Observable<Event> {
    const params = new HttpParams()
      .set('userId', userId)
      .set('userPhoneNumber', userPhoneNumber);
    return this.http.post<Event>(`${this.apiUrl}/${eventId}/reserve`, null, { params });
  }

  addEvent(event: Event): Observable<Event> {
    const formattedEvent = {
      title: event.title,
      description: event.description,
      date: event.date.endsWith(':00') ? event.date : event.date + ':00',
      location: event.location,
      maxParticipants: Number(event.maxParticipants), // Convert to number
      currentParticipants: Number(event.currentParticipants) // Convert to number
    };
    console.log('Request Body:', JSON.stringify(formattedEvent, null, 2));
    return this.http.post<Event>(`${this.apiUrl}/add`, formattedEvent, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
  updateEvent(event: Event): Observable<Event> {
    return this.http.put<Event>(`${this.apiUrl}/update`, event);
  }

  deleteEvent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }
}