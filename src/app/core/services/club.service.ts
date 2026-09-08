import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ClubResponse,
  CreateClubRequest,
  ClubMemberResponse,
  InviteResponse,
} from '../models/club.model';

@Injectable({ providedIn: 'root' })
export class ClubService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  getMyClubs(): Observable<ClubResponse[]> {
    return this.http.get<ClubResponse[]>(`${this.apiUrl}/clubs`);
  }

  getClubById(clubId: number): Observable<ClubResponse> {
    return this.http.get<ClubResponse>(`${this.apiUrl}/clubs/${clubId}`);
  }

  createClub(request: CreateClubRequest): Observable<ClubResponse> {
    return this.http.post<ClubResponse>(`${this.apiUrl}/clubs`, request);
  }

  getMembers(clubId: number): Observable<ClubMemberResponse[]> {
    return this.http.get<ClubMemberResponse[]>(`${this.apiUrl}/clubs/${clubId}/members`);
  }

  removeMember(clubId: number, memberUserId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/clubs/${clubId}/members/${memberUserId}`);
  }

  createInvite(clubId: number): Observable<InviteResponse> {
    return this.http.post<InviteResponse>(`${this.apiUrl}/clubs/${clubId}/invite`, {});
  }

  joinClub(inviteCode: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/clubs/join/${inviteCode}`, {});
  }
}
