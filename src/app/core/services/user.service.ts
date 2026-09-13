import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import {
  UpdateProfileRequest,
  UserProfile,
} from '../models/user-profile.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  getMyProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(
      `${this.apiUrl}/users/me`,
    );
  }

  updateMyProfile(
    request: UpdateProfileRequest,
  ): Observable<UserProfile> {
    return this.http.patch<UserProfile>(
      `${this.apiUrl}/users/me`,
      request,
    );
  }

  removeAvatar(): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/users/me/avatar`,
    );
  }
}
