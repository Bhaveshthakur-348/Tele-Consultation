// One component per file — WorklistMatrix
import { useApp }         from '@/context/AppContext'
import WorklistTabs       from './WorklistTabs'
import WorklistHeader     from './WorklistHeader'
import WorklistRow        from './WorklistRow'
import CompletedRow       from './CompletedRow'
import { STATUS_ORDER }   from '@/data/mockData'

export default function WorklistMatrix({ role }) {
  const { patients, activeTab, darkMode } = useApp()
  const pfx = role === 'doctor' ? 'd' : 'n'
  const tab = activeTab[pfx]

  const allPts  = Object.values(patients)
  const upcoming = allPts
    .filter(p => p.status !== 'completed')
    .sort((a, b) => {
      const oa = STATUS_ORDER[a.status] ?? 3
      const ob = STATUS_ORDER[b.status] ?? 3
      return oa !== ob ? oa - ob : a.schedule.localeCompare(b.schedule)
    })
  const completed = allPts
    .filter(p => p.status === 'completed')
    .sort((a, b) => a.schedule.localeCompare(b.schedule))

  const rows = tab === 'upcoming' ? upcoming : completed

  const matrix = darkMode
    ? 'bg-[#1C2E45] border-white/8'
    : 'bg-white border-clinical-border'

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <WorklistTabs pfx={pfx} />

      <div className={`flex flex-col flex-1 min-h-0 border rounded overflow-hidden ${matrix}`}>
        <WorklistHeader />

        {/* Scrollable rows */}
        <div className="flex-1 overflow-y-auto">
          {rows.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-2">
              <div className="text-2xl opacity-30">{tab === 'upcoming' ? '✓' : '—'}</div>
              <div className={`text-sm font-medium ${darkMode ? 'text-dark-secondary' : 'text-clinical-slate'}`}>
                {tab === 'upcoming' ? 'All done for today' : 'No completed appointments yet'}
              </div>
            </div>
          ) : (
            rows.map(pt =>
              tab === 'upcoming'
                ? <WorklistRow    key={pt.id} patient={pt} role={role} />
                : <CompletedRow   key={pt.id} patient={pt} role={role} />
            )
          )}
        </div>
      </div>
    </div>
  )
}
