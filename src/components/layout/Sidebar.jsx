// One component per file — Sidebar
import { LogOut, Sun, Moon } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useApp } from '@/context/AppContext'

const DOCTOR_NAV = [
  { icon: '📹', label: 'Teleconsultation', path: '/' },
  { icon: '📅', label: 'Schedule',         path: null },
  { icon: '📝', label: 'Clinical Notes',   path: null },
  { icon: '🎧', label: 'Help & Support',   action: 'support' },
]

const NURSE_NAV = [
  { icon: '🩺', label: 'Triage Queue',  path: '/nurse' },
  { icon: '👥', label: 'Waiting Room',  path: null },
  { icon: '🎧', label: 'Help & Support', action: 'support' },
]

export default function Sidebar() {
  const { role, user, darkMode, toggleDark, setRole, openModal } = useApp()
  const navigate  = useNavigate()
  const location  = useLocation()
  const navItems  = role === 'doctor' ? DOCTOR_NAV : NURSE_NAV

  const handleNav = (item) => {
    if (item.action === 'support') { openModal('support'); return }
    if (item.path) navigate(item.path)
  }

  const handleLogout = () => {
    if (window.confirm('Log out of CareConnect?')) {
      sessionStorage.clear()
      navigate('/login')
    }
  }

  const sb  = darkMode ? 'bg-dark-sidebar border-dark-border' : 'bg-white border-clinical-border'
  const hd  = darkMode ? 'border-white/10' : 'border-clinical-border'
  const div = darkMode ? 'border-white/10' : 'border-clinical-border'

  return (
    <aside className={`w-56 min-h-screen flex flex-col flex-shrink-0 border-r ${sb}`}>
      {/* Header */}
      <div className={`px-4 pt-4 pb-3 border-b border-t-[3px] border-t-brand-blue relative ${hd}`}>
        {/* Theme toggle */}
        <button
          onClick={toggleDark}
          className={`absolute top-4 right-3 p-0.5 rounded ${darkMode ? 'text-white/40 hover:text-white/70' : 'text-clinical-muted hover:text-clinical-slate'}`}
        >
          {darkMode ? <Sun size={14} /> : <Moon size={14} />}
        </button>

        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg logo-gradient flex items-center justify-center flex-shrink-0">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="white">
              <rect x="5" y="0" width="4" height="14" rx="1.5" />
              <rect x="0" y="5" width="14" height="4" rx="1.5" />
            </svg>
          </div>
          <span className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-clinical-navy'}`}>
            CareConnect
          </span>
        </div>

        {/* Role badge */}
        <span className={`inline-block mt-2 text-[10.5px] font-medium px-2.5 py-0.5 rounded-full ${
          role === 'doctor'
            ? 'bg-blue-100 text-brand-blue'
            : 'bg-purple-100 text-clinical-purple'
        }`}>
          {role === 'doctor' ? 'Doctor Portal' : 'Nurse Portal'}
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-1.5">
        {navItems.map(item => {
          const isActive = item.path && location.pathname === item.path
          return (
            <button
              key={item.label}
              onClick={() => handleNav(item)}
              className={`flex items-center gap-2.5 w-full px-4 py-2.5 text-[12.5px] transition-all text-left
                ${isActive
                  ? (darkMode ? 'bg-brand-blue/20 text-white border-l-2 border-brand-blue font-semibold' : 'sb-active')
                  : (darkMode ? 'text-white/65 hover:bg-white/5 hover:text-white' : 'text-clinical-muted hover:bg-gray-50 hover:text-clinical-slate')
                } border-l-2 border-transparent`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </button>
          )
        })}
      </nav>

      {/* Dev role switcher — REMOVE in production (auth handles this) */}
      <div className={`p-2.5 border-t ${div}`}>
        <div className={`flex rounded-lg p-0.5 gap-0.5 ${darkMode ? 'bg-white/5' : 'bg-gray-100'}`}>
          {['doctor', 'nurse'].map(r => (
            <button
              key={r}
              onClick={() => { setRole(r); navigate(r === 'nurse' ? '/nurse' : '/') }}
              className={`flex-1 py-1.5 rounded-md text-[11px] font-medium transition-all capitalize
                ${role === r ? 'bg-brand-blue text-white font-semibold' : (darkMode ? 'text-white/40' : 'text-clinical-muted')}`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className={`flex items-center gap-2.5 px-4 py-3 text-[12.5px] transition-all border-t ${div}
          ${darkMode ? 'text-white/60 hover:text-white/85 hover:bg-white/5' : 'text-clinical-muted hover:text-clinical-slate hover:bg-gray-50'}`}
      >
        <LogOut size={14} className="opacity-70" />
        Log out
      </button>

      {/* Powered by */}
      <div className={`flex items-center gap-1.5 px-4 pb-3 pt-2 border-t ${div}`}>
        <div className="w-1.5 h-1.5 rounded-full logo-gradient" />
        <span className={`text-[10px] ${darkMode ? 'text-white/25' : 'text-gray-300'}`}>
          Powered by <strong>AImed</strong>
        </span>
      </div>
    </aside>
  )
}
