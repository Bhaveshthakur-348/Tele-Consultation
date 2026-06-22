// One component per file — CompletedRow
import Avatar     from '@/components/common/Avatar'
import { useApp } from '@/context/AppContext'

function parseTime(t = '') {
  const [h, m] = t.split(':').map(Number)
  if (isNaN(h)) return '—'
  const suffix = h >= 12 ? 'PM' : 'AM'
  return `${h > 12 ? h - 12 : h || 12}:${String(m).padStart(2, '0')} ${suffix}`
}

export default function CompletedRow({ patient, role }) {
  const { openModal, darkMode } = useApp()

  return (
    <div className={`wl-row ${darkMode ? 'border-white/5' : ''}`}>
      {/* Patient */}
      <div className="flex items-center gap-2.5 pr-3 py-2 min-w-0">
        <Avatar age={patient.age} />
        <div className="min-w-0">
          <div className={`text-[13px] font-semibold font-jakarta truncate ${darkMode ? 'text-dark-text' : 'text-clinical-navy'}`}>
            {patient.name}
          </div>
          <div className={`text-[11px] mt-0.5 ${darkMode ? 'text-dark-muted/70' : 'text-clinical-muted'}`}>
            MRN {patient.mrn}
          </div>
        </div>
      </div>

      {/* Time */}
      <div className={`px-3 text-[12.5px] ${darkMode ? 'text-dark-secondary' : 'text-clinical-slate'}`}>
        {parseTime(patient.schedule)}
      </div>

      {/* Status */}
      <div className="px-3">
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-clinical-success">
          <span className="w-2 h-2 rounded-full bg-clinical-success" />
          Completed
        </span>
      </div>

      {/* Actions */}
      <div className="pl-6 pr-0 py-1.5 flex items-center gap-3 justify-end">
        {role === 'doctor' && (
          <button
            onClick={() => openModal('triageBrief', patient.id)}
            className="btn-link mr-2"
          >
            Triage Brief
          </button>
        )}
        <button className={`text-xs px-3 py-1.5 rounded border transition-colors
          ${darkMode ? 'bg-white/5 text-dark-muted border-white/10 hover:bg-white/10' : 'bg-white text-clinical-muted border-clinical-border hover:bg-gray-50'}`}>
          View in HIS
        </button>
      </div>
    </div>
  )
}
