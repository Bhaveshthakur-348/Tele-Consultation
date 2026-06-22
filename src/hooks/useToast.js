import { useState, useCallback } from 'react'

/**
 * useToast
 * Simple toast notification system.
 * Renders via <Toast /> component in MainLayout.
 */
export function useToast() {
  const [toast, setToast] = useState(null) // { message, type }

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3500)
  }, [])

  const hideToast = useCallback(() => setToast(null), [])

  return { toast, showToast, hideToast }
}
