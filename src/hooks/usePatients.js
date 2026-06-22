import { useState, useEffect, useCallback } from 'react'
import { fetchTodayAppointments } from '@/services/api'
import { MOCK_PATIENTS } from '@/data/mockData'

/**
 * usePatients
 * Fetches today's appointment list from the API.
 * Falls back to mock data if API is unavailable (dev mode).
 *
 * In production: remove the mock fallback and handle loading/error states in UI.
 */
export function usePatients() {
  const [patients, setPatients] = useState(MOCK_PATIENTS)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchTodayAppointments()
      // API should return { [id]: patientObject } shape
      setPatients(data)
    } catch (err) {
      console.warn('API unavailable — using mock data:', err.message)
      setError(err.message)
      setPatients(MOCK_PATIENTS) // fallback
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetch()
    // Poll every 30 seconds for real-time updates
    const interval = setInterval(fetch, 30_000)
    return () => clearInterval(interval)
  }, [fetch])

  return { patients, loading, error, refetch: fetch }
}
