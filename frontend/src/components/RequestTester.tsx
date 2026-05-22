import { useMemo, useState } from 'react'
import { Play } from 'lucide-react'
import { API_BASE_URL } from '../lib/api'
import type { MockEndpoint } from '../lib/types'
import { CurlCommand } from './CurlCommand'
import { JsonEditor } from './JsonEditor'

type RequestTesterProps = {
  endpoints: MockEndpoint[]
  onRequestComplete: () => void
}

type TestResult = {
  status: number
  body: unknown
}

export function RequestTester({
  endpoints,
  onRequestComplete,
}: RequestTesterProps) {
  const [selectedId, setSelectedId] = useState('')
  const [requestBody, setRequestBody] = useState('{\n  "sample": true\n}')
  const [result, setResult] = useState<TestResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const selectedEndpoint = useMemo(
    () => endpoints.find((endpoint) => endpoint.id === selectedId) ?? endpoints[0],
    [endpoints, selectedId],
  )

  const mockUrl = selectedEndpoint
    ? `${API_BASE_URL}/mock${selectedEndpoint.path}`
    : `${API_BASE_URL}/mock/orders`

  const curlCommand = selectedEndpoint
    ? buildCurlCommand(mockUrl, selectedEndpoint, requestBody)
    : 'Create an endpoint to generate a curl command.'

  async function sendRequest() {
    if (!selectedEndpoint) {
      setError('Create an endpoint before testing requests.')
      return
    }

    setError(null)
    setResult(null)

    try {
      const init: RequestInit = {
        method: selectedEndpoint.method,
      }

      if (selectedEndpoint.method !== 'GET' && requestBody.trim()) {
        init.headers = { 'Content-Type': 'application/json' }
        init.body = requestBody
      }

      const response = await fetch(mockUrl, init)
      const text = await response.text()
      const body = text ? parseBody(text) : null
      setResult({ status: response.status, body })
      onRequestComplete()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not send test request')
    }
  }

  return (
    <section className="rounded-lg border border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-4 py-3">
        <h2 className="text-base font-semibold">Request tester</h2>
        <p className="text-sm text-slate-500">Call the generated `/mock` route.</p>
      </div>
      <div className="space-y-4 p-4">
        <label className="block text-sm font-medium">
          Endpoint
          <select
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-cyan-500"
            onChange={(event) => setSelectedId(event.target.value)}
            value={selectedEndpoint?.id ?? ''}
          >
            {endpoints.length === 0 && <option value="">No endpoints</option>}
            {endpoints.map((endpoint) => (
              <option key={endpoint.id} value={endpoint.id}>
                {endpoint.method} {endpoint.path}
              </option>
            ))}
          </select>
        </label>
        {selectedEndpoint?.method !== 'GET' && (
          <div>
            <p className="mb-1 text-sm font-medium">Request body</p>
            <JsonEditor value={requestBody} onChange={setRequestBody} />
          </div>
        )}
        <button
          className="inline-flex h-10 items-center gap-2 rounded-md bg-cyan-700 px-3 text-sm font-medium text-white hover:bg-cyan-800"
          onClick={sendRequest}
          type="button"
        >
          <Play className="h-4 w-4" />
          Send request
        </button>
        <CurlCommand command={curlCommand} />
        {error && <p className="text-sm text-rose-700">{error}</p>}
        {result && (
          <div className="rounded-md border border-slate-200 p-3">
            <p className="text-sm font-semibold text-slate-800">
              Response status: {result.status}
            </p>
            <pre className="mt-2 max-h-72 overflow-auto rounded-md bg-slate-950 p-3 font-mono text-xs leading-5 text-slate-100">
              {JSON.stringify(result.body, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </section>
  )
}

function parseBody(text: string) {
  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

function buildCurlCommand(
  mockUrl: string,
  endpoint: MockEndpoint,
  requestBody: string,
) {
  const lines = [`curl -X ${endpoint.method} '${mockUrl}'`]

  if (endpoint.method !== 'GET' && requestBody.trim()) {
    lines.push("  -H 'Content-Type: application/json'")
    lines.push(`  --data '${requestBody.replaceAll("'", "'\\''")}'`)
  }

  return lines.join(' \\\n')
}
