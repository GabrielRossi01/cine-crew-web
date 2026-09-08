import { UserSummary } from './user.model';

export type EventStatus = 'OPEN' | 'SETTLED' | 'CANCELLED';
export type PaymentStatus = 'PENDING' | 'PAID' | 'CANCELLED';

export interface EventResponse {
  id: number;
  movieTitle: string;
  posterUrl: string | null;
  sessionDateTime: string;
  cinemaName: string;
  totalAmount: number;
  status: EventStatus;
  organizer: UserSummary;
}

export interface CreateEventRequest {
  movieTitle: string;
  tmdbId?: number;
  posterUrl?: string;
  sessionDateTime: string;
  cinemaName: string;
  totalAmount: number;
  participantUserIds: number[];
}

export interface UpdateEventStatusRequest {
  status: EventStatus;
}

export interface AddParticipantRequest {
  userId: number;
  amountOwed: number;
}

export interface EventBalanceResponse {
  eventId: number;
  totalAmount: number;
  totalPaid: number;
  totalPending: number;
  participants: ParticipantBalance[];
}

export interface ParticipantBalance {
  userId: number;
  name: string;
  amountOwed: number;
  paymentStatus: PaymentStatus;
  paidAt: string | null;
}
