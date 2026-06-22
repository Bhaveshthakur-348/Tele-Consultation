// ─── Mock Patients ─────────────────────────────────────────────────────────────
// Replace with API fetch in production.
// Shape mirrors FHIR Patient + Encounter + Observation resources.

export const MOCK_PATIENTS = {
  P001: {
    id: 'P001', name: 'Mohammed Al-Farsi', age: '45M', gender: 'M',
    mrn: 'MRN-10031', complaint: 'Chest Pain', esi: 3,
    status: 'completed', schedule: '09:00', chat: [],
    vitals: { bpSys: 142, bpDia: 90, hr: 88, spo2: 96, temp: 37.2, rr: 16, pain: 6, wt: 84, ht: 175 },
    nurseNotes: 'Central chest tightness × 3 days. BP elevated. ESI 3 assigned.', admitted: false,
  },
  P002: {
    id: 'P002', name: 'Sara Al-Mansouri', age: '32F', gender: 'F',
    mrn: 'MRN-10032', complaint: 'Hypertension F/U', esi: 4,
    status: 'completed', schedule: '09:30', chat: [],
    vitals: { bpSys: 155, bpDia: 95, hr: 76, spo2: 99, temp: 36.8, rr: 14, pain: 1, wt: 62, ht: 162 },
    nurseNotes: 'Routine HTN follow-up. Medication compliance queried.', admitted: false,
  },
  P003: {
    id: 'P003', name: 'Hessa Al-Blooshi', age: '29F', gender: 'F',
    mrn: 'MRN-10033', complaint: 'Migraine', esi: 4,
    status: 'completed', schedule: '10:00', chat: [],
    vitals: { bpSys: 118, bpDia: 72, hr: 80, spo2: 99, temp: 36.6, rr: 14, pain: 7, wt: 58, ht: 165 },
    nurseNotes: 'Recurring migraine episode. Photosensitive. No fever.', admitted: false,
  },
  P004: {
    id: 'P004', name: 'Yousef Al-Hamdan', age: '58M', gender: 'M',
    mrn: 'MRN-10034', complaint: 'Shortness of Breath', esi: 2,
    status: 'triage_done', schedule: '11:00', chat: [],
    vitals: { bpSys: 138, bpDia: 88, hr: 98, spo2: 93, temp: 37.0, rr: 22, pain: 5, wt: 91, ht: 178 },
    nurseNotes: 'SpO₂ 93% on room air. Mild dyspnoea at rest. ESI 2 assigned.', admitted: false,
  },
  P005: {
    id: 'P005', name: 'Fatima Al-Zahra', age: '41F', gender: 'F',
    mrn: 'MRN-10035', complaint: 'Severe Headache', esi: 3,
    status: 'triage_done', schedule: '11:30', chat: [],
    vitals: { bpSys: 168, bpDia: 104, hr: 86, spo2: 98, temp: 37.1, rr: 16, pain: 8, wt: 70, ht: 160 },
    nurseNotes: 'Sudden onset severe headache. BP markedly elevated.', admitted: false,
  },
  P006: {
    id: 'P006', name: 'Tariq Al-Nasser', age: '63M', gender: 'M',
    mrn: 'MRN-10036', complaint: 'Dizziness & Near Syncope', esi: 2,
    status: 'waiting', schedule: '12:00', chat: [],
    vitals: {}, nurseNotes: '', admitted: false,
  },
}

// ─── Status Config ─────────────────────────────────────────────────────────────
export const STATUS_CONFIG = {
  waiting:    { label: 'Awaiting triage', dot: '#F59E0B', text: '#B45309' },
  triage_done:{ label: 'Ready',           dot: '#0062FF', text: '#0062FF' },
  in_consult: { label: 'In Consult',      dot: '#6236FF', text: '#6236FF' },
  completed:  { label: 'Completed',       dot: '#00B277', text: '#00B277' },
}

// ─── User personas (replaced by auth in production) ────────────────────────────
export const USERS = {
  doctor: { id: 'DR-SARAH-001', name: 'Dr. Sarah Al-Rashid', role_label: 'Cardiologist', initials: 'SA' },
  nurse:  { id: 'NU-LAYLA-001', name: 'Nurse Layla Hassan',  role_label: 'Senior Nurse',  initials: 'LH' },
}

// ─── API / Integration URLs (override via .env.local) ─────────────────────────
export const API_CONFIG = {
  baseURL:    import.meta.env.VITE_API_URL     || 'https://api.careconnect.aimed.health',
  sapURL:     import.meta.env.VITE_SAP_URL     || 'https://sap-hana.aimed.health/fhir/R4',
  cernerURL:  import.meta.env.VITE_CERNER_URL  || 'https://fhir-ehr.cerner.com/r4',
  nabidh:     import.meta.env.VITE_NABIDH_URL  || 'https://nabidh.uaehealth.ae/fhir/R4',
  livekit:    import.meta.env.VITE_LIVEKIT_URL || 'wss://livekit.careconnect.aimed.health',
}

// ─── Sort order for upcoming patients ─────────────────────────────────────────
export const STATUS_ORDER = { in_consult: 0, triage_done: 1, waiting: 2 }

// ─── Vitals reference ranges ───────────────────────────────────────────────────
export const VITALS_META = [
  { key: 'bpSys',  label: 'BP Sys',  unit: 'mmHg', critical: v => v > 180 || v < 80  },
  { key: 'bpDia',  label: 'BP Dia',  unit: 'mmHg', critical: v => v > 110 || v < 50  },
  { key: 'hr',     label: 'HR',      unit: 'bpm',  critical: v => v > 120 || v < 40  },
  { key: 'spo2',   label: 'SpO₂',    unit: '%',    critical: v => v < 94              },
  { key: 'temp',   label: 'Temp',    unit: '°C',   critical: v => v > 38.5 || v < 35 },
  { key: 'rr',     label: 'RR',      unit: '/min', critical: v => v > 25 || v < 10   },
  { key: 'pain',   label: 'Pain',    unit: '/10',  critical: v => v >= 8              },
]
