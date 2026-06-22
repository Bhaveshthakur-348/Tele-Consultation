// One component per file — StatusBadge
import { STATUS_CONFIG } from '@/data/mockData'

export default function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status]
  if (!cfg) return null

  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-clinical-slate dark:text-dark-secondary">
      <span
        className="w-2 h-2 rounded-full flex-shrink-0"
        style={{ background: cfg.dot }}
      />
      {cfg.label}
    </span>
  )
}
