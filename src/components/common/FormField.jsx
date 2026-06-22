// One component per file — FormField wrapper

export default function FormField({ label, required = false, children }) {
  return (
    <div className="mb-4">
      <label className="block text-[10px] font-semibold uppercase tracking-widest text-clinical-muted mb-1.5">
        {label}
        {required && <span className="text-clinical-danger ml-1">*</span>}
      </label>
      {children}
    </div>
  )
}
