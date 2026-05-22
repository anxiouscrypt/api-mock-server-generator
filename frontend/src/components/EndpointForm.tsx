import { useEffect, useState } from 'react'
import { Save, X } from 'lucide-react'
import { JsonEditor } from './JsonEditor'
import type { HttpMethod, MockEndpoint, MockEndpointInput } from '../lib/types'

const methods: HttpMethod[] = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']

const emptyEndpoint: MockEndpointInput = {
  name: 'Create Order',
  method: 'POST',
  path: '/orders',
  statusCode: 201,
  responseBody: {
    id: 'order_123',
    status: 'PAID',
  },
  enabled: true,
}

type EndpointFormProps = {
  editingEndpoint: MockEndpoint | null
  onCancel: () => void
  onSubmit: (endpoint: MockEndpointInput) => void
}

export function EndpointForm({
  editingEndpoint,
  onCancel,
  onSubmit,
}: EndpointFormProps) {
  const [form, setForm] = useState<MockEndpointInput>(emptyEndpoint)
  const [responseText, setResponseText] = useState(
    JSON.stringify(emptyEndpoint.responseBody, null, 2),
  )
  const [jsonError, setJsonError] = useState<string | null>(null)

  useEffect(() => {
    const next = editingEndpoint ?? emptyEndpoint
    setForm(next)
    setResponseText(JSON.stringify(next.responseBody, null, 2))
    setJsonError(null)
  }, [editingEndpoint])

  function update<K extends keyof MockEndpointInput>(
    key: K,
    value: MockEndpointInput[K],
  ) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  function submit() {
    try {
      const parsed = JSON.parse(responseText) as Record<string, unknown>
      setJsonError(null)
      onSubmit({ ...form, responseBody: parsed })
    } catch (error) {
      setJsonError(error instanceof Error ? error.message : 'Invalid JSON')
    }
  }

  return (
    <section className="rounded-lg border border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-4 py-3">
        <h2 className="text-base font-semibold">
          {editingEndpoint ? 'Edit endpoint' : 'Endpoint builder'}
        </h2>
        <p className="text-sm text-slate-500">Define the response your client should receive.</p>
      </div>
      <div className="space-y-4 p-4">
        <label className="block text-sm font-medium">
          Name
          <input
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-cyan-500"
            onChange={(event) => update('name', event.target.value)}
            value={form.name}
          />
        </label>
        <div className="grid grid-cols-[130px_minmax(0,1fr)] gap-3">
          <label className="block text-sm font-medium">
            Method
            <select
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-cyan-500"
              onChange={(event) => update('method', event.target.value as HttpMethod)}
              value={form.method}
            >
              {methods.map((method) => (
                <option key={method}>{method}</option>
              ))}
            </select>
          </label>
          <label className="block text-sm font-medium">
            Path
            <input
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 font-mono outline-none focus:border-cyan-500"
              onChange={(event) => update('path', event.target.value)}
              value={form.path}
            />
          </label>
        </div>
        <div className="grid grid-cols-[130px_minmax(0,1fr)] gap-3">
          <label className="block text-sm font-medium">
            Status
            <input
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-cyan-500"
              min={100}
              max={599}
              onChange={(event) => update('statusCode', Number(event.target.value))}
              type="number"
              value={form.statusCode}
            />
          </label>
          <label className="mt-7 flex items-center gap-2 text-sm font-medium">
            <input
              checked={form.enabled}
              onChange={(event) => update('enabled', event.target.checked)}
              type="checkbox"
            />
            Enabled
          </label>
        </div>
        <div>
          <p className="mb-1 text-sm font-medium">JSON response body</p>
          <JsonEditor value={responseText} onChange={setResponseText} />
          {jsonError && <p className="mt-2 text-sm text-rose-700">{jsonError}</p>}
        </div>
        <div className="flex gap-2">
          <button
            className="inline-flex h-10 items-center gap-2 rounded-md bg-slate-950 px-3 text-sm font-medium text-white hover:bg-slate-800"
            onClick={submit}
            type="button"
          >
            <Save className="h-4 w-4" />
            {editingEndpoint ? 'Update' : 'Create'}
          </button>
          {editingEndpoint && (
            <button
              className="inline-flex h-10 items-center gap-2 rounded-md border border-slate-300 px-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
              onClick={onCancel}
              type="button"
            >
              <X className="h-4 w-4" />
              Cancel
            </button>
          )}
        </div>
      </div>
    </section>
  )
}
