import request from 'umi-request';
import { moduleByIdResponseResult, moduleModalDataProps } from './type';

export function getModule(params?: { page: number; size: number }) {
  return request<{
    total: number;
    data: Array<moduleByIdResponseResult>;
  }>('/api/module', {
    params,
  });
}

export async function createModule(params: moduleModalDataProps) {
  return request('/api/module', {
    method: 'post',
    data: params,
  });
}

export function putModule(params: moduleModalDataProps & { id: string }) {
  const { id, ...rest } = params;
  return request(`/api/module/${id}`, {
    method: 'put',
    data: rest,
  });
}

export function delModule(id: string) {
  return request(`/api/module/${id}`, {
    method: 'delete',
  });
}
