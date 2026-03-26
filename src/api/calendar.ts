import { apiClient } from './client';

export interface MenstrualCycleRequest {
  startDate: string;
  endDate?: string;
  approximateDurationDays?: number;
  notes?: string;
}

export interface MenstrualCycleResponse {
  id: string;
  coupleId: string;
  startDate: string;
  endDate?: string;
  approximateDurationDays?: number;
  notes?: string;
  createdBy: string;
  createdAt: string;
}

export interface MenstrualCyclePredictionResponse {
  predictedDate: string;
  averageCycleDuration: number;
  analyzedCycles: number;
}

export interface SexualActivityRequest {
  activityDate: string;
  usedCondom?: boolean;
  tookPill?: boolean;
  notes?: string;
}

export interface SexualActivityResponse {
  id: string;
  coupleId: string;
  activityDate: string;
  usedCondom: boolean;
  tookPill: boolean;
  notes?: string;
  createdBy: string;
  createdAt: string;
}

const h = (coupleId: string) => ({ 'X-Couple-Id': coupleId });

export const calendarApi = {
  cycles: {
    list: (coupleId: string) =>
      apiClient.get<MenstrualCycleResponse[]>('/api/calendar/cycles', { headers: h(coupleId) }).then((r) => r.data),
    current: (coupleId: string) =>
      apiClient.get<MenstrualCycleResponse>('/api/calendar/cycles/current', { headers: h(coupleId) }).then((r) => r.data),
    prediction: (coupleId: string) =>
      apiClient.get<MenstrualCyclePredictionResponse>('/api/calendar/cycles/prediction', { headers: h(coupleId) }).then((r) => r.data),
    create: (coupleId: string, data: MenstrualCycleRequest) =>
      apiClient.post<MenstrualCycleResponse>('/api/calendar/cycles', data, { headers: h(coupleId) }).then((r) => r.data),
    update: (coupleId: string, id: string, data: MenstrualCycleRequest) =>
      apiClient.put<MenstrualCycleResponse>(`/api/calendar/cycles/${id}`, data, { headers: h(coupleId) }).then((r) => r.data),
    delete: (coupleId: string, id: string) =>
      apiClient.delete(`/api/calendar/cycles/${id}`, { headers: h(coupleId) }),
  },
  activities: {
    list: (coupleId: string) =>
      apiClient.get<SexualActivityResponse[]>('/api/calendar/activities', { headers: h(coupleId) }).then((r) => r.data),
    byDateRange: (coupleId: string, from: string, to: string) =>
      apiClient
        .get<SexualActivityResponse[]>('/api/calendar/activities/by-date', {
          headers: h(coupleId),
          params: { from, to },
        })
        .then((r) => r.data),
    create: (coupleId: string, data: SexualActivityRequest) =>
      apiClient.post<SexualActivityResponse>('/api/calendar/activities', data, { headers: h(coupleId) }).then((r) => r.data),
    update: (coupleId: string, id: string, data: SexualActivityRequest) =>
      apiClient.put<SexualActivityResponse>(`/api/calendar/activities/${id}`, data, { headers: h(coupleId) }).then((r) => r.data),
    delete: (coupleId: string, id: string) =>
      apiClient.delete(`/api/calendar/activities/${id}`, { headers: h(coupleId) }),
  },
};
