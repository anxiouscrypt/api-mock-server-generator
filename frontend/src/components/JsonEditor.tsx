type JsonEditorProps = {
  value: string
  onChange: (value: string) => void
}

export function JsonEditor({ value, onChange }: JsonEditorProps) {
  return (
    <textarea
      className="h-52 w-full resize-none rounded-md border border-slate-300 bg-slate-950 p-3 font-mono text-sm leading-6 text-slate-100 outline-none focus:border-cyan-500"
      onChange={(event) => onChange(event.target.value)}
      spellCheck={false}
      value={value}
    />
  )
}
