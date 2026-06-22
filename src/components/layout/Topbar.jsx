// One component per file — Topbar
import { useState, useEffect, useRef } from 'react'
import { useApp } from '@/context/AppContext'
import { format } from 'date-fns'

export default function Topbar({ onSupportClick }) {
  const { role, user, seenCount, darkMode, openModal } = useApp()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  const today = format(new Date(), 'EEEE, d MMMM yyyy')
  const title = role === 'doctor' ? "Today's Appointments" : 'Triage Queue'

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const topbar = darkMode ? 'bg-dark-topbar border-dark-border' : 'bg-white border-clinical-border'
  const dropdown = darkMode ? 'bg-dark-surface border-dark-border' : 'bg-white border-clinical-border'

  return (
    <header className={`h-[72px] flex items-center justify-between px-6 border-b flex-shrink-0 ${topbar}`}>
      {/* Title */}
      <div>
        <h1 className={`text-xl font-extrabold font-jakarta tracking-tight leading-none
          ${darkMode ? 'text-white' : 'text-brand-blue'}`}>
          {title}
        </h1>
        <div className="flex items-center gap-2 mt-1">
          <span className={`text-[12.5px] ${darkMode ? 'text-dark-muted' : 'text-clinical-slate'}`}>
            {today}
          </span>
          {seenCount > 0 && (
            <span className="text-[11px] font-semibold text-clinical-success">
              · {seenCount} seen today
            </span>
          )}
        </div>
      </div>

      {/* User menu */}
      <div ref={menuRef} className="relative">
        <button
          onClick={() => setMenuOpen(v => !v)}
          className="flex items-center gap-2.5 cursor-pointer"
        >
          <div className="text-right">
            <div className={`text-sm font-semibold ${darkMode ? 'text-dark-text' : 'text-clinical-navy'}`}>
              {user.name}
            </div>
            <div className={`text-[11.5px] ${darkMode ? 'text-dark-muted' : 'text-clinical-muted'}`}>
              {user.role_label}
            </div>
          </div>
          <div className="w-9 h-9 rounded-full logo-gradient flex items-center justify-center text-[11.5px] font-bold text-white flex-shrink-0">
            {user.initials}
          </div>
        </button>

        {menuOpen && (
          <div className={`absolute top-[calc(100%+10px)] right-0 min-w-[210px] rounded-xl border shadow-blue z-40 overflow-hidden ${dropdown}`}>
            <div className={`px-4 py-3 border-b ${darkMode ? 'bg-brand-blue/10 border-dark-border' : 'bg-gray-50 border-clinical-border'}`}>
              <div className={`text-sm font-bold font-jakarta ${darkMode ? 'text-dark-text' : 'text-clinical-navy'}`}>
                {user.name}
              </div>
              <div className={`text-xs mt-0.5 ${darkMode ? 'text-dark-muted' : 'text-clinical-muted'}`}>
                {user.role_label} · {role === 'doctor' ? 'Doctor' : 'Nurse'}
              </div>
            </div>
            <button
              onClick={() => { setMenuOpen(false); openModal('support') }}
              className={`flex items-center gap-2.5 w-full px-4 py-2.5 text-[12.5px] text-left transition-colors
                ${darkMode ? 'text-dark-secondary hover:bg-white/5 hover:text-dark-text' : 'text-clinical-slate hover:bg-blue-50 hover:text-brand-blue'}`}
            >
              🎧 Help &amp; Support
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
