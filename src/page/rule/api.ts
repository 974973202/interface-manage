import request from 'umi-request';
import {
  rulesByIdResponseResult,
  rulesModalDataProps,
} from '../interface/type';

export function getRules(params?: { page: number; size: number }) {
  return request<{
    total: number;
    data: Array<rulesByIdResponseResult>;
  }>('/api/rules', {
    params: params,
  });
}

export function getRulesById(id: string) {
  return request<rulesByIdResponseResult>(`/api/rules/${id}`);
}

export function createRules(params: rulesModalDataProps) {
  return request('/api/rules', {
    method: 'post',
    data: params,
  });
}

export function putRules(params: rulesModalDataProps & { id: string }) {
  const { id, ...rest } = params;
  return request(`/api/rules/${id}`, {
    method: 'put',
    data: {
      ...rest,
      data: Date.now(),
    },
  });
}

export function delRules(id: string) {
  return request(`/api/rules/${id}`, {
    method: 'delete',
  });
}
