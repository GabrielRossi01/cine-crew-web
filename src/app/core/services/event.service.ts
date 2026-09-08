import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { EventResponse, CreateEventRequest, UpdateEventStatusRequest } from '../models/event.model';

@Injectable({ providedIn: 'root' })
export class EventService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  getEventsByClub(clubId: number): Observable<EventResponse[]> {
    return this.http.get<EventResponse[]>(`${this.apiUrl}/clubs/${clubId}/events`);
  }

  getEventById(eventId: number): Observable<EventResponse> {
    return this.http.get<EventResponse>(`${this.apiUrl}/events/${eventId}`);
  }

  createEvent(clubId: number, request: CreateEventRequest): Observable<EventResponse> {
    return this.http.post<EventResponse>(`${this.apiUrl}/clubs/${clubId}/events`, request);
  }

  updateStatus(eventId: number, request: UpdateEventStatusRequest): Observable<EventResponse> {
    return this.http.patch<EventResponse>(`${this.apiUrl}/events/${eventId}/status`, request);
  }
}
