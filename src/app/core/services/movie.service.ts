import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MovieSearchResult, MovieResponse } from '../models/movie.model';

@Injectable({ providedIn: 'root' })
export class MovieService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  searchMovies(query: string, page: number): Observable<MovieSearchResult[]> {
    return this.http.get<MovieSearchResult[]>(
      `${this.apiUrl}/movies/search?query=${query}&page=${page}`,
    );
  }

  importMovie(tmdbId: number): Observable<MovieResponse> {
    return this.http.post<MovieResponse>(`${this.apiUrl}/movies/import/${tmdbId}`, {});
  }
}
