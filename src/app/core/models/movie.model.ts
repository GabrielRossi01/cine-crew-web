export interface MovieResponse {
  id: number;
  tmdbId: number;
  title: string;
  posterUrl: string | null;
  releaseYear: number | null;
}

export interface MovieSearchResult {
  tmdbId: number;
  title: string;
  posterUrl: string | null;
  releaseDate: string | null;
}

export interface MovieSummary {
  id: number;
  title: string;
  posterUrl: string | null;
  releaseYear: number | null;
}
