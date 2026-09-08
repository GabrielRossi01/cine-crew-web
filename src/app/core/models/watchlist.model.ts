import { MovieSummary } from './movie.model';

export interface WatchlistItemResponse {
  id: number;
  movie: MovieSummary;
  addedAt: string;
}

export interface AddToWatchlistRequest {
  movieId: number;
}
