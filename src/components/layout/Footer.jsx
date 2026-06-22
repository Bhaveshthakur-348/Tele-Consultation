// One component per file — Footer
import { useApp } from '@/context/AppContext'

export default function Footer() {
  const { darkMode } = useApp()

  return (
    <footer className={`h-9 flex items-center justify-between px-5 flex-shrink-0 border-t text-[10.5px]
      ${darkMode ? 'bg-dark-topbar border-dark-border text-dark-muted' : 'bg-white border-clinical-border text-clinical-muted'}`}>
      <span>© 2026 AImed Health Technologies</span>
      <span className={darkMode ? 'text-dark-muted/50' : 'text-gray-300'}>For clinical use only</span>
    </footer>
  )
}
