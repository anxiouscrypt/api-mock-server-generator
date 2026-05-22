import { useEffect, useState } from 'react'
import { EndpointForm } from './components/EndpointForm'
import { EndpointList } from './components/EndpointList'
import { listEndpoints, saveEndpoint, updateEndpoint, deleteEndpoint } from './lib/api'
import type { MockEndpoint, MockEndpointInput } from './lib/types'

function App() {
  const [endpoints, setEndpoints] = useState<MockEndpoint[]>([])
  const [editingEndpoint, setEditingEndpoint] = useState<MockEndpoint | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    void refreshEndpoints()
  }, [])

  async function refreshEndpoints() {
    try {
      setEndpoints(await listEndpoints())
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load endpoints')
    }
  }

  async function handleSubmit(payload: MockEndpointInput) {
    try {
      if (editingEndpoint) {
        await updateEndpoint(editingEndpoint.id, payload)
      } else {
        await saveEndpoint(payload)
      }
      setEditingEndpoint(null)
      await refreshEndpoints()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save endpoint')
    }
  }

  async function handleDelete(endpointId: string) {
    try {
      await deleteEndpoint(endpointId)
      if (editingEndpoint?.id === endpointId) {
        setEditingEndpoint(null)
      }
      await refreshEndpoints()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not delete endpoint')
    }
  }

  return (
    <main className="min-h-screen bg-[#f4f6f8] px-4 py-5 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-5 border-b border-slate-200 pb-4">
          <p className="text-sm font-medium text-cyan-700">API Mock Server Generator</p>
          <h1 className="text-2xl font-semibold text-slate-950">
            Define mock endpoints and keep integration work moving
          </h1>
          {error && <p className="mt-2 text-sm text-rose-700">{error}</p>}
        </header>
        <div className="grid gap-4 lg:grid-cols-[420px_minmax(0,1fr)]">
          <EndpointForm
            editingEndpoint={editingEndpoint}
            onCancel={() => setEditingEndpoint(null)}
            onSubmit={handleSubmit}
          />
          <EndpointList
            endpoints={endpoints}
            onDelete={handleDelete}
            onEdit={setEditingEndpoint}
          />
        </div>
      </div>
    </main>
  )
}

export default App
