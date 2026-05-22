import { Clipboard } from 'lucide-react'

type CurlCommandProps = {
  command: string
}

export function CurlCommand({ command }: CurlCommandProps) {
  return (
    <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className="text-sm font-semibold text-slate-800">curl</p>
        <button
          className="inline-flex h-8 items-center gap-2 rounded-md border border-slate-300 bg-white px-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
          onClick={() => void navigator.clipboard.writeText(command)}
          type="button"
        >
          <Clipboard className="h-3.5 w-3.5" />
          Copy
        </button>
      </div>
      <pre className="overflow-x-auto whitespace-pre-wrap font-mono text-xs leading-5 text-slate-700">
        {command}
      </pre>
    </div>
  )
}
