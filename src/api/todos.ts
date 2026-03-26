import { apiClient } from './client';

export type TodoStatus = 'PENDING' | 'DONE';

export interface TodoRequest {
  title: string;
  description?: string;
  status?: TodoStatus;
  estimatedDate?: string;
}

export interface TodoImageResponse {
  id: string;
  imageUrl: string;
  originalFilename: string;
  uploadedBy: string;
  uploadedAt: string;
}

export interface TodoResponse {
  id: string;
  coupleId: string;
  title: string;
  description?: string;
  status: TodoStatus;
  estimatedDate?: string;
  images: TodoImageResponse[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

const h = (coupleId: string) => ({ 'X-Couple-Id': coupleId });

export const todosApi = {
  list: (coupleId: string, status?: TodoStatus) =>
    apiClient
      .get<TodoResponse[]>('/api/todos', {
        headers: h(coupleId),
        params: status ? { status } : undefined,
      })
      .then((r) => r.data),

  get: (coupleId: string, id: string) =>
    apiClient.get<TodoResponse>(`/api/todos/${id}`, { headers: h(coupleId) }).then((r) => r.data),

  create: (coupleId: string, data: TodoRequest) =>
    apiClient.post<TodoResponse>('/api/todos', data, { headers: h(coupleId) }).then((r) => r.data),

  update: (coupleId: string, id: string, data: TodoRequest) =>
    apiClient
      .put<TodoResponse>(`/api/todos/${id}`, data, { headers: h(coupleId) })
      .then((r) => r.data),

  delete: (coupleId: string, id: string) =>
    apiClient.delete(`/api/todos/${id}`, { headers: h(coupleId) }),

  uploadImage: (coupleId: string, todoId: string, form: FormData) =>
    apiClient
      .post<TodoImageResponse>(`/api/todos/${todoId}/images`, form, {
        headers: { ...h(coupleId), 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data),

  deleteImage: (coupleId: string, todoId: string, imageId: string) =>
    apiClient.delete(`/api/todos/${todoId}/images/${imageId}`, { headers: h(coupleId) }),
};
