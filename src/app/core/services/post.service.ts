import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CreatePostRequest, PostResponse } from '../models/post.model';
import { Page } from '../models/page.model';

@Injectable({ providedIn: 'root' })
export class PostService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  createPost(eventId: number, request: CreatePostRequest): Observable<PostResponse> {
    return this.http.post<PostResponse>(`${this.apiUrl}/events/${eventId}/posts`, request);
  }

  getClubFeed(clubId: number, page: number, size: number): Observable<Page<PostResponse>> {
    return this.http.get<Page<PostResponse>>(
      `${this.apiUrl}/clubs/${clubId}/feed?page=${page}&size=${size}`,
    );
  }

  getPostById(postId: number): Observable<PostResponse> {
    return this.http.get<PostResponse>(`${this.apiUrl}/posts/${postId}`);
  }

  deletePost(postId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/posts/${postId}`);
  }
}
