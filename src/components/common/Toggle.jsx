// One component per file — Toggle (consent switches, settings)

export default function Toggle({ value, onChange, label, sub }) {
  return (
    <div className="flex items-center justify-between p-3 border border-clinical-border rounded-lg mb-2.5 dark:border-white/10">
      <div>
        <div className="text-sm font-medium text-clinical-navy dark:text-dark-text">{label}</div>
        {sub && <div className="text-xs text-clinical-muted mt-0.5">{sub}</div>}
      </div>
      <button
        type="button"
        onClick={onChange}
        className={`relative w-9 h-5 rounded-full transition-colors duration-150 flex-shrink-0 ${value ? 'bg-brand-blue' : 'bg-clinical-border'}`}
      >
        <span
          className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all duration-150 ${value ? 'left-[19px]' : 'left-0.5'}`}
        />
      </button>
    </div>
  )
}
