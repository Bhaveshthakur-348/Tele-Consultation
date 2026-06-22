import { useState, useCallback } from 'react'
import { getVideoToken, endVideoSession } from '@/services/api'

/**
 * useConsultation
 * Manages video session lifecycle.
 * Connects to LiveKit when token is available.
 *
 * Install LiveKit:  npm install @livekit/components-react livekit-client
 */
export function useConsultation() {
  const [session, setSession]   = useState(null) // { token, roomName, serverUrl, patientId }
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState(null)

  const joinRoom = useCallback(async (patientId, role = 'doctor') => {
    setLoading(true)
    setError(null)
    try {
      const data = await getVideoToken(patientId, role)
      setSession({ ...data, patientId })
      // In production, connect LiveKit here:
      // const room = new Room()
      // await room.connect(data.serverUrl, data.token)
    } catch (err) {
      console.error('Failed to join room:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const leaveRoom = useCallback(async () => {
    if (session?.sessionId) {
      await endVideoSession(session.sessionId).catch(console.error)
    }
    setSession(null)
  }, [session])

  return { session, loading, error, joinRoom, leaveRoom }
}
