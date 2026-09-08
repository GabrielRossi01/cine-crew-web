import { UserSummary } from './user.model';

export interface PostResponse {
  id: number;
  eventId: number;
  author: UserSummary;
  imageUrl: string;
  caption: string | null;
  createdAt: string;
}

export interface CreatePostRequest {
  imageUrl: string;
  caption?: string;
}
