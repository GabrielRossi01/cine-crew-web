import { UserSummary } from './user.model';

export interface ClubResponse {
  id: number;
  name: string;
  description: string | null;
  owner: UserSummary;
  createdAt: string;
}

export interface ClubMemberResponse {
  membershipId: number;
  user: UserSummary;
  role: ClubMemberRole;
  clubScore: number;
}

export type ClubMemberRole = 'ADMIN' | 'MEMBER';

export interface CreateClubRequest {
  name: string;
  description?: string;
}

export interface InviteResponse {
  inviteCode: string;
  inviteUrl: string;
  expiresAt: string;
}
