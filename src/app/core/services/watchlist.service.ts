import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { WatchlistItemResponse } from '../models/watchlist.model';
import { Page } from '../models/page.model';

@Injectable({ providedIn: 'root' })
export class WatchlistService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  getMyWatchlist(page: number, size: number): Observable<Page<WatchlistItemResponse>> {
    return this.http.get<Page<WatchlistItemResponse>>(
      `${this.apiUrl}/watchlist?page=${page}&size=${size}`,
    );
  }

  addToWatchlist(movieId: number): Observable<WatchlistItemResponse> {
    return this.http.post<WatchlistItemResponse>(`${this.apiUrl}/watchlist`, { movieId });
  }

  removeFromWatchlist(movieId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/watchlist/${movieId}`);
  }

  isInWatchlist(movieId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/watchlist/${movieId}/exists`);
  }
}
