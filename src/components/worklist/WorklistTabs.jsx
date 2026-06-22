// One component per file — WorklistTabs
import { useApp } from '@/context/AppContext'

export default function WorklistTabs({ pfx }) {
  const { activeTab, setTab, darkMode } = useApp()
  const tab = activeTab[pfx]

  return (
    <div className="flex mb-2">
      {['upcoming', 'completed'].map(t => (
        <button
          key={t}
          onClick={() => setTab(pfx, t)}
          className={`px-4 py-2 text-[13px] capitalize transition-all border-b-[2.5px] -mb-px
            ${tab === t
              ? `font-semibold border-brand-blue ${darkMode ? 'text-brand-blue' : 'text-brand-blue'}`
              : `font-medium border-transparent ${darkMode ? 'text-dark-muted hover:text-dark-secondary' : 'text-clinical-muted hover:text-clinical-slate'}`
            }`}
        >
          {t}
        </button>
      ))}
    </div>
  )
}
