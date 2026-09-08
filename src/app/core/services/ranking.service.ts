import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { RankingEntryResponse } from '../models/ranking.model';

@Injectable({ providedIn: 'root' })
export class RankingService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  getClubRanking(clubId: number): Observable<RankingEntryResponse[]> {
    return this.http.get<RankingEntryResponse[]>(`${this.apiUrl}/clubs/${clubId}/ranking`);
  }

  getMyRanking(clubId: number): Observable<RankingEntryResponse> {
    return this.http.get<RankingEntryResponse>(`${this.apiUrl}/clubs/${clubId}/ranking/me`);
  }
}
