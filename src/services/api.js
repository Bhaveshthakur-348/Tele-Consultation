import axios from 'axios'
import { API_CONFIG } from '@/data/mockData'

const api = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

// Attach JWT on every request
api.interceptors.request.use(config => {
  const token = sessionStorage.getItem('cc_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Redirect on 401
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      sessionStorage.removeItem('cc_token')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

// ─── Appointments ─────────────────────────────────────────────────────────────
export const fetchTodayAppointments = () =>
  api.get('/appointments/today').then(r => r.data)

export const updateAppointmentStatus = (patientId, status) =>
  api.patch(`/appointments/${patientId}/status`, { status }).then(r => r.data)

// ─── Triage ───────────────────────────────────────────────────────────────────
export const saveTriage = (patientId, payload) =>
  api.post(`/triage/${patientId}`, payload).then(r => r.data)

export const completeTriage = (patientId) =>
  api.post(`/triage/${patientId}/complete`).then(r => r.data)

export const getTriageBrief = (patientId) =>
  api.get(`/triage/${patientId}/brief`).then(r => r.data)

// ─── Video ────────────────────────────────────────────────────────────────────
// Returns { token, roomName, serverUrl } for LiveKit SDK
export const getVideoToken = (patientId, role) =>
  api.post('/video/token', { patientId, role }).then(r => r.data)

export const endVideoSession = (sessionId) =>
  api.post(`/video/sessions/${sessionId}/end`).then(r => r.data)

// ─── Post Consultation ────────────────────────────────────────────────────────
// Accepts FHIR Transaction Bundle, submits to HIS
export const submitPostConsult = (bundle) =>
  api.post('/post-consult/submit', bundle).then(r => r.data)

export const savePostConsultDraft = (patientId, draft) =>
  api.post(`/post-consult/${patientId}/draft`, draft).then(r => r.data)

export const getPostConsultDraft = (patientId) =>
  api.get(`/post-consult/${patientId}/draft`).then(r => r.data)

// ─── Recordings ───────────────────────────────────────────────────────────────
// Returns a 15-minute pre-signed URL (backend generates, validates RBAC, logs access)
export const getRecordingStreamUrl = (encounterId) =>
  api.get(`/recordings/${encounterId}/stream-url`).then(r => r.data)

// ─── Support ──────────────────────────────────────────────────────────────────
export const createSupportTicket = (ticket) =>
  api.post('/support/tickets', ticket).then(r => r.data)

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const login = (credentials) =>
  api.post('/auth/login', credentials).then(r => r.data)

export const logout = () =>
  api.post('/auth/logout')

export const getMe = () =>
  api.get('/auth/me').then(r => r.data)

export default api
