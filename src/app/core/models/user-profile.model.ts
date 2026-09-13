export interface UserProfile {
  id: number;
  name: string;
  username: string;
  email: string;
  avatarUrl: string | null;
}

export interface UpdateProfileRequest {
  name: string;
  username: string;
}
