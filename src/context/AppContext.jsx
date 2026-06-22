import { createContext, useContext, useReducer, useCallback } from 'react'
import { MOCK_PATIENTS, USERS } from '@/data/mockData'

const AppContext = createContext(null)

const initialState = {
  // Auth (replaced by real OAuth in production)
  role: 'doctor',
  user: USERS.doctor,
  darkMode: false,

  // Patients — in production fetch from API in usePatients hook
  patients: MOCK_PATIENTS,

  // Active tab per view prefix
  activeTab: { d: 'upcoming', n: 'upcoming' },

  // Open modals — null = closed, value = patientId or true
  modals: {
    triageBrief: null,
    videoRoom:   null,
    postConsult: null,
    nurseRoom:   null,
    support:     false,
  },
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_ROLE':
      return { ...state, role: action.payload, user: USERS[action.payload] }

    case 'TOGGLE_DARK':
      return { ...state, darkMode: !state.darkMode }

    case 'UPDATE_PATIENT_STATUS':
      return {
        ...state,
        patients: {
          ...state.patients,
          [action.pid]: { ...state.patients[action.pid], status: action.status },
        },
      }

    case 'SET_PATIENTS':
      return { ...state, patients: action.payload }

    case 'SET_TAB':
      return { ...state, activeTab: { ...state.activeTab, [action.pfx]: action.tab } }

    case 'OPEN_MODAL':
      return { ...state, modals: { ...state.modals, [action.modal]: action.payload ?? true } }

    case 'CLOSE_MODAL':
      return { ...state, modals: { ...state.modals, [action.modal]: null } }

    default:
      return state
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  const setRole    = useCallback(role  => dispatch({ type: 'SET_ROLE',    payload: role }),  [])
  const toggleDark = useCallback(()    => dispatch({ type: 'TOGGLE_DARK' }),                 [])
  const setTab     = useCallback((pfx, tab) => dispatch({ type: 'SET_TAB', pfx, tab }),      [])
  const openModal  = useCallback((modal, payload) => dispatch({ type: 'OPEN_MODAL', modal, payload }), [])
  const closeModal = useCallback(modal => dispatch({ type: 'CLOSE_MODAL', modal }),           [])

  const updatePatientStatus = useCallback((pid, status) => {
    dispatch({ type: 'UPDATE_PATIENT_STATUS', pid, status })
    // In production also call: updateAppointmentStatus(pid, status)
  }, [])

  const setPatients = useCallback(patients => dispatch({ type: 'SET_PATIENTS', payload: patients }), [])

  const patients = state.patients
  const allPatients = Object.values(patients)
  const seenCount = allPatients.filter(p => p.status === 'completed').length

  return (
    <AppContext.Provider value={{
      ...state,
      allPatients,
      seenCount,
      setRole,
      toggleDark,
      setTab,
      openModal,
      closeModal,
      updatePatientStatus,
      setPatients,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside AppProvider')
  return ctx
}
