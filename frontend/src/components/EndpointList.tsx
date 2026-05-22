import { Pencil, Trash2 } from 'lucide-react'
import type { MockEndpoint } from '../lib/types'

type EndpointListProps = {
  endpoints: MockEndpoint[]
  onDelete: (endpointId: string) => void
  onEdit: (endpoint: MockEndpoint) => void
}

export function EndpointList({ endpoints, onDelete, onEdit }: EndpointListProps) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-4 py-3">
        <h2 className="text-base font-semibold">Configured endpoints</h2>
        <p className="text-sm text-slate-500">{endpoints.length} mock routes</p>
      </div>
      {endpoints.length === 0 ? (
        <div className="p-4">
          <div className="rounded-md border border-dashed border-slate-300 px-4 py-12 text-center text-sm text-slate-500">
            Create an endpoint to start mocking API responses.
          </div>
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {endpoints.map((endpoint) => (
            <article className="p-4" key={endpoint.id}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-md bg-cyan-50 px-2 py-1 font-mono text-xs font-semibold text-cyan-800">
                      {endpoint.method}
                    </span>
                    <span className="truncate font-mono text-sm text-slate-700">
                      {endpoint.path}
                    </span>
                    <span
                      className={
                        endpoint.enabled
                          ? 'rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700'
                          : 'rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-500'
                      }
                    >
                      {endpoint.enabled ? 'enabled' : 'disabled'}
                    </span>
                  </div>
                  <h3 className="mt-2 truncate text-sm font-semibold text-slate-950">
                    {endpoint.name}
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">
                    Returns {endpoint.statusCode}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-300 text-slate-600 hover:bg-slate-50"
                    onClick={() => onEdit(endpoint)}
                    title="Edit endpoint"
                    type="button"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-300 text-slate-600 hover:bg-rose-50 hover:text-rose-700"
                    onClick={() => onDelete(endpoint.id)}
                    title="Delete endpoint"
                    type="button"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
