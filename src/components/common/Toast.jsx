// One component per file — Toast notification

export default function Toast({ toast, onHide }) {
  if (!toast) return null

  const colors = {
    success: 'bg-clinical-success',
    error:   'bg-clinical-danger',
    info:    'bg-brand-blue',
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-lg text-white text-sm font-medium shadow-blue animate-fade-in ${colors[toast.type] || colors.success}`}>
      {toast.type === 'success' && '✓'}
      {toast.type === 'error'   && '✗'}
      {toast.message}
      <button onClick={onHide} className="ml-2 opacity-70 hover:opacity-100 text-base leading-none">×</button>
    </div>
  )
}
