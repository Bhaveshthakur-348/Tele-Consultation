// One component per file — WorklistRow
import Avatar      from '@/components/common/Avatar'
import StatusBadge from '@/components/common/StatusBadge'
import { useApp }  from '@/context/AppContext'

function parseTime(t = '') {
  const [h, m] = t.split(':').map(Number)
  if (isNaN(h)) return '—'
  const suffix = h >= 12 ? 'PM' : 'AM'
  const h12 = h > 12 ? h - 12 : h || 12
  return `${h12}:${String(m).padStart(2, '0')} ${suffix}`
}

export default function WorklistRow({ patient, role }) {
  const { openModal, darkMode } = useApp()
  const { id, name, mrn, age, schedule, status } = patient

  // CTA per role × status
  let cta = null
  if (role === 'doctor') {
    if (status === 'triage_done') {
      cta = (
        <button
          onClick={() => openModal('videoRoom', id)}
          className="btn-primary shadow-blue-sm"
        >
          Join
        </button>
      )
    } else if (status === 'in_consult') {
      cta = (
        <button
          onClick={() => openModal('videoRoom', id)}
          className="btn-primary"
        >
          Rejoin
        </button>
      )
    } else {
      cta = <button disabled className="btn-join-off">Join</button>
    }
  } else {
    // Nurse
    if (status === 'waiting') {
      cta = (
        <button
          onClick={() => openModal('nurseRoom', id)}
          className="bg-clinical-border text-clinical-slate border border-[#D1D9E6] px-3.5 py-1.5 rounded text-xs dark:bg-white/5 dark:text-dark-muted dark:border-white/10"
        >
          Start Triage
        </button>
      )
    } else if (status === 'triage_done') {
      cta = (
        <span className="text-xs font-medium px-3 py-1 rounded bg-blue-100 text-brand-blue">
          Triaged
        </span>
      )
    }
  }

  return (
    <div
      className={`wl-row group ${darkMode ? 'border-white/5 hover:bg-white/5' : 'hover:bg-blue-50'}`}
    >
      {/* Patient name + MRN */}
      <div className="flex items-center gap-2.5 pr-3 py-2 min-w-0">
        <Avatar age={age} />
        <div className="min-w-0">
          <div className={`text-[13px] font-semibold font-jakarta truncate
            ${darkMode ? 'text-dark-text' : 'text-clinical-navy'}`}>
            {name}
          </div>
          <div className={`text-[11px] mt-0.5 ${darkMode ? 'text-dark-muted/70' : 'text-clinical-muted'}`}>
            MRN {mrn}
          </div>
        </div>
      </div>

      {/* Scheduled time */}
      <div className={`px-3 text-[12.5px] ${darkMode ? 'text-dark-secondary' : 'text-clinical-slate'}`}>
        {parseTime(schedule)}
      </div>

      {/* Status */}
      <div className="px-3">
        <StatusBadge status={status} />
      </div>

      {/* Actions */}
      <div className="pl-6 pr-0 py-1.5 flex items-center gap-3 justify-end">
        {role === 'doctor' && status !== 'waiting' && (
          <button
            onClick={() => openModal('triageBrief', id)}
            className="btn-link mr-2"
          >
            Triage Brief
          </button>
        )}
        {cta}
      </div>
    </div>
  )
}
