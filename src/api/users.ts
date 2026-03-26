import { apiClient } from './client';

export interface UserProfileRequest {
  displayName: string;
  avatarUrl?: string;
}

export interface UserProfileResponse {
  id: string;
  displayName: string;
  avatarUrl?: string;
  coupleId?: string;
}

export interface CoupleResponse {
  id: string;
  memberOneId: string;
  memberTwoId?: string;
  status: 'PENDING' | 'ACTIVE';
}

export interface InviteLinkResponse {
  inviteUrl: string;
  token: string;
  expiresAt: string;
}

export const usersApi = {
  createProfile: (data: UserProfileRequest) =>
    apiClient.post<UserProfileResponse>('/api/users/profile', data).then((r) => r.data),

  getProfile: () =>
    apiClient.get<UserProfileResponse>('/api/users/profile').then((r) => r.data),

  updateProfile: (data: UserProfileRequest) =>
    apiClient.put<UserProfileResponse>('/api/users/profile', data).then((r) => r.data),

  createCouple: () =>
    apiClient.post<InviteLinkResponse>('/api/users/couples').then((r) => r.data),

  getMyCouple: (coupleId: string) =>
    apiClient
      .get<CoupleResponse>('/api/users/couples/me', { headers: { 'X-Couple-Id': coupleId } })
      .then((r) => r.data),

  generateInvite: (coupleId: string) =>
    apiClient
      .post<InviteLinkResponse>('/api/users/couples/invite', null, {
        headers: { 'X-Couple-Id': coupleId },
      })
      .then((r) => r.data),

  joinCouple: (token: string) =>
    apiClient.post<CoupleResponse>(`/api/users/couples/join/${token}`).then((r) => r.data),

  leaveCouple: () => apiClient.delete('/api/users/couples/leave'),
};
