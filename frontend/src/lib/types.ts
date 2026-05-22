export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export type MockEndpointInput = {
  name: string
  method: HttpMethod
  path: string
  statusCode: number
  responseBody: Record<string, unknown>
  enabled: boolean
}

export type MockEndpoint = MockEndpointInput & {
  id: string
  createdAt: string
  updatedAt: string
}

export type RequestLog = {
  id: string
  method: string
  path: string
  requestBody: unknown
  matchedEndpointId: string | null
  timestamp: string
}
