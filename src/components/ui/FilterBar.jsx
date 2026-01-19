export default function FilterBar({ filters }) {
  return (
    <div className="flex flex-wrap gap-3 items-center mb-4">
      {filters.map((filter) => (
        <div key={filter.id} className="flex items-center gap-2">
          {filter.label && (
            <span className="text-xs font-medium text-slate-500">
              {filter.label}
            </span>
          )}
          {filter.type === 'select' && (
            <select
              value={filter.value}
              onChange={(e) => filter.onChange(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            >
              {filter.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          )}
          {filter.type === 'segmented' && (
            <div className="flex gap-1">
              {filter.options.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => filter.onChange(opt.value)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    filter.value === opt.value
                      ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/25'
                      : 'bg-white text-slate-600 border border-slate-200 hover:border-emerald-300'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}


