// One component per file — TriageBriefModal
import { useApp }    from '@/context/AppContext'
import { VITALS_META } from '@/data/mockData'

export default function TriageBriefModal() {
  const { modals, closeModal, patients, darkMode } = useApp()
  const pid     = modals.triageBrief
  const patient = pid ? patients[pid] : null

  if (!patient) return null

  const modal = darkMode ? 'bg-dark-surface' : 'bg-white'
  const hdBorder = darkMode ? 'border-dark-border' : 'border-clinical-border'
  const cell = darkMode ? 'bg-dark-topbar' : 'bg-gray-50'
  const noteBox = darkMode ? 'bg-dark-topbar border-yellow-900/30' : 'bg-amber-50 border-amber-200'

  return (
    <div className="fixed inset-0 bg-black/45 z-50 flex items-center justify-center p-5">
      <div className={`${modal} rounded-xl w-[520px] max-w-[95vw] p-6 shadow-[0_24px_64px_rgba(9,22,43,0.2)]`}>
        {/* Header */}
        <div className={`flex justify-between items-start mb-4 pb-4 border-b ${hdBorder}`}>
          <div>
            <h2 className={`text-base font-bold font-jakarta ${darkMode ? 'text-dark-text' : 'text-clinical-navy'}`}>
              Triage Brief
            </h2>
            <div className={`text-xs mt-1 ${darkMode ? 'text-dark-muted' : 'text-clinical-muted'}`}>
              {patient.name} · {patient.mrn} · ESI {patient.esi} · {patient.complaint}
            </div>
          </div>
          <button
            onClick={() => closeModal('triageBrief')}
            className={`text-xl leading-none ${darkMode ? 'text-dark-muted hover:text-dark-text' : 'text-clinical-muted hover:text-clinical-navy'}`}
          >
            ×
          </button>
        </div>

        {/* Vitals grid */}
        {patient.vitals && Object.keys(patient.vitals).length > 0 && (
          <div className="grid grid-cols-3 gap-2 mb-4">
            {VITALS_META.filter(v => patient.vitals[v.key] !== undefined).map(v => {
              const val  = patient.vitals[v.key]
              const isCrit = v.critical?.(val)
              return (
                <div key={v.key} className={`${cell} rounded-lg p-2.5`}>
                  <div className="text-[10.5px] text-clinical-muted mb-1">{v.label}</div>
                  <div className={`text-base font-semibold ${isCrit ? 'text-clinical-danger' : darkMode ? 'text-dark-text' : 'text-clinical-navy'}`}>
                    {val}
                  </div>
                  <div className="text-[10px] text-clinical-muted">{v.unit}</div>
                </div>
              )
            })}
          </div>
        )}

        {/* Nurse notes */}
        {patient.nurseNotes && (
          <div className={`border rounded-lg p-3 text-sm leading-relaxed ${noteBox} ${darkMode ? 'text-dark-secondary' : 'text-amber-900'}`}>
            <strong>Nurse notes:</strong> {patient.nurseNotes}
          </div>
        )}
      </div>
    </div>
  )
}
