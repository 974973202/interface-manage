import request from 'umi-request';
import { interfaceByIdResponseResult } from './type';

export function getInterface(params?: any) {
  return request<{
    total: number;
    data: Array<interfaceByIdResponseResult>;
  }>('/api/interface', {
    params: params,
  });
}

export function createInterface(params: any) {
  return request('/api/interface', {
    method: 'post',
    data: params,
  });
}

export function putInterface(params: any) {
  const { id, ...rest } = params;
  return request(`/api/interface/${id}`, {
    method: 'put',
    data: rest,
  });
}

export function delInterface(id: string) {
  return request(`/api/interface/${id}`, {
    method: 'delete',
  });
}
