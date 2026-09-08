import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AddParticipantRequest, EventBalanceResponse } from '../models/event.model';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  addParticipant(eventId: number, request: AddParticipantRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/events/${eventId}/participants`, request);
  }

  confirmPayment(eventId: number, participantUserId: number): Observable<void> {
    return this.http.patch<void>(
      `${this.apiUrl}/events/${eventId}/participants/${participantUserId}/pay`,
      {},
    );
  }

  getBalance(eventId: number): Observable<EventBalanceResponse> {
    return this.http.get<EventBalanceResponse>(`${this.apiUrl}/events/${eventId}/balance`);
  }
}
