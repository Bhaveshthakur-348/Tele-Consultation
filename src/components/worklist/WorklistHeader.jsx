// One component per file — WorklistHeader
import { useApp } from '@/context/AppContext'

export default function WorklistHeader() {
  const { darkMode } = useApp()

  return (
    <div
      className={`grid px-4 border-b-[1.5px]
        ${darkMode ? 'bg-[#172640] border-white/10' : 'bg-[#F8F8F9] border-clinical-border'}`}
      style={{ gridTemplateColumns: '1fr 110px 140px 200px' }}
    >
      {['Patient', 'Scheduled', 'Status', ''].map(h => (
        <div
          key={h}
          className={`py-2.5 px-3 text-[10.5px] font-semibold uppercase tracking-[.07em]
            ${darkMode ? 'text-[#4A6080]' : 'text-[#9AA3B0]'}`}
        >
          {h}
        </div>
      ))}
    </div>
  )
}
