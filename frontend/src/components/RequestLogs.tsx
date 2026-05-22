import type { RequestLog } from '../lib/types'

type RequestLogsProps = {
  logs: RequestLog[]
}

export function RequestLogs({ logs }: RequestLogsProps) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-4 py-3">
        <h2 className="text-base font-semibold">Recent request logs</h2>
        <p className="text-sm text-slate-500">{logs.length} captured requests</p>
      </div>
      {logs.length === 0 ? (
        <div className="p-4">
          <div className="rounded-md border border-dashed border-slate-300 px-4 py-10 text-center text-sm text-slate-500">
            Send a mock request to capture logs.
          </div>
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {logs.map((log) => (
            <article className="p-4" key={log.id}>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-md bg-slate-100 px-2 py-1 font-mono text-xs font-semibold text-slate-700">
                  {log.method}
                </span>
                <span className="font-mono text-sm text-slate-700">{log.path}</span>
                <span
                  className={
                    log.matchedEndpointId
                      ? 'rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700'
                      : 'rounded-full bg-rose-100 px-2 py-1 text-xs font-medium text-rose-700'
                  }
                >
                  {log.matchedEndpointId ? 'matched' : 'unmatched'}
                </span>
              </div>
              <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-500">
                <span>{new Date(log.timestamp).toLocaleString()}</span>
                {log.matchedEndpointId && <span>{log.matchedEndpointId}</span>}
              </div>
              {log.requestBody !== null && (
                <pre className="mt-3 max-h-32 overflow-auto rounded-md bg-slate-950 p-3 font-mono text-xs leading-5 text-slate-100">
                  {JSON.stringify(log.requestBody, null, 2)}
                </pre>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
