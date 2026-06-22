// One component per file — MainLayout
import { Outlet } from 'react-router-dom'
import { useEffect } from 'react'
import { useApp } from '@/context/AppContext'
import Sidebar from '@/components/layout/Sidebar'
import Topbar  from '@/components/layout/Topbar'
import Footer  from '@/components/layout/Footer'
import Toast   from '@/components/common/Toast'
import TriageBriefModal from '@/components/modals/TriageBriefModal'
import PostConsultModal from '@/components/modals/PostConsultModal'
import SupportModal     from '@/components/modals/SupportModal'
import { useToast } from '@/hooks/useToast'

export default function MainLayout() {
  const { darkMode } = useApp()
  const { toast, showToast, hideToast } = useToast()

  // Apply dark class to <html>
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  return (
    <div className={`flex h-screen overflow-hidden ${darkMode ? 'bg-dark-bg' : 'bg-clinical-bg'}`}>
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar />

        {/* Page content */}
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden px-3.5 pt-2.5">
          <Outlet context={{ showToast }} />
        </div>

        <Footer />
      </div>

      {/* Global modals */}
      <TriageBriefModal />
      <PostConsultModal showToast={showToast} />
      <SupportModal     showToast={showToast} />

      {/* Toast */}
      <Toast toast={toast} onHide={hideToast} />
    </div>
  )
}
