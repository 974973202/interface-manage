import request from 'umi-request';
import { versionModalDataProps, versionByIdResponseResult } from './type';

export function getVersion(params?: { page: number; size: number }) {
  return request<{
    total: number;
    data: Array<versionByIdResponseResult>;
  }>('/api/version', {
    params: params,
  });
}

export function getVersionDetail(id: string) {
  return request<versionByIdResponseResult>(`/api/version/${id}`);
}

export function createVersion(params: versionModalDataProps) {
  return request('/api/version', {
    method: 'post',
    data: params,
  });
}

export function putVersion(params: versionModalDataProps & { id: string }) {
  const { id, ...rest } = params;
  return request(`/api/version/${id}`, {
    method: 'put',
    data: rest,
  });
}

export function delVersion(id: string) {
  return request(`/api/version/${id}`, {
    method: 'delete',
  });
}
