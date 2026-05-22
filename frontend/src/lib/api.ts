import type { MockEndpoint, MockEndpointInput, RequestLog } from './types'

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000'

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  })

  if (!response.ok) {
    const body = await response.json().catch(() => null)
    throw new Error(body?.detail ?? `Request failed with ${response.status}`)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return response.json() as Promise<T>
}

export function listEndpoints() {
  return request<MockEndpoint[]>('/admin/endpoints')
}

export function saveEndpoint(endpoint: MockEndpointInput) {
  return request<MockEndpoint>('/admin/endpoints', {
    body: JSON.stringify(endpoint),
    method: 'POST',
  })
}

export function updateEndpoint(endpointId: string, endpoint: MockEndpointInput) {
  return request<MockEndpoint>(`/admin/endpoints/${endpointId}`, {
    body: JSON.stringify(endpoint),
    method: 'PUT',
  })
}

export function deleteEndpoint(endpointId: string) {
  return request<void>(`/admin/endpoints/${endpointId}`, { method: 'DELETE' })
}

export function listLogs() {
  return request<RequestLog[]>('/admin/logs')
}
