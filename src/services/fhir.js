/**
 * FHIR R4 Resource Builders
 * Builds standards-compliant resources for SAP S/4HANA Healthcare or Cerner Millennium.
 * All 7 UAE DoH post-consultation items are covered.
 *
 * Submission: POST as a Transaction Bundle (atomic — all succeed or all fail).
 * Endpoint:   POST https://your-sap.com/fhir/R4/
 *             POST https://fhir-ehr.cerner.com/r4/
 */

import { API_CONFIG } from '@/data/mockData'

// ─── 1. Encounter (metadata) ───────────────────────────────────────────────────
export const buildEncounter = ({ patient, doctor, facility, startTime, endTime }) => ({
  resourceType: 'Encounter',
  status: 'finished',
  class: {
    system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
    code: 'VR',
    display: 'Virtual',
  },
  type: [{ coding: [{ code: 'telehealth-video', display: 'Telehealth Video Consultation' }] }],
  subject: { reference: `Patient/${patient.mrn}`, display: patient.name },
  participant: [{ individual: { reference: `Practitioner/${doctor.id}`, display: doctor.name } }],
  period: { start: startTime, end: endTime },
  serviceProvider: { reference: `Organization/${facility.id}` },
  identifier: [{ system: 'https://aimed.health/identifiers/encounter', value: `ENC-${Date.now()}` }],
})

// ─── 2. Consent ───────────────────────────────────────────────────────────────
export const buildConsent = ({ patient, doctor, consentToTreat, consentToRecord, method, timestamp }) => ({
  resourceType: 'Consent',
  status: 'active',
  scope: {
    coding: [{ system: 'http://terminology.hl7.org/CodeSystem/consentscope', code: 'treatment' }],
  },
  category: [{ coding: [{ code: 'telehealth-consent', display: 'Telehealth Consultation Consent' }] }],
  patient: { reference: `Patient/${patient.mrn}`, display: patient.name },
  dateTime: timestamp || new Date().toISOString(), // MUST be server-side for legal validity
  performer: [{ reference: `Practitioner/${doctor.id}` }],
  sourceAttachment: { title: `Consent method: ${method}`, creation: timestamp },
  provision: {
    type: consentToTreat ? 'permit' : 'deny',
    purpose: [{ code: 'TREAT' }, { code: 'ETREAT' }],
    extension: [{
      url: 'https://aimed.health/fhir/extensions/consent-to-record',
      valueBoolean: consentToRecord,
    }],
  },
})

// ─── 3. Clinical Note (ClinicalImpression) ────────────────────────────────────
export const buildClinicalNote = ({ patient, doctor, encounterId, complaint, icd10Code, icd10Display, hpi, assessment, plan, followUp }) => ({
  resourceType: 'ClinicalImpression',
  status: 'completed',
  description: complaint,
  subject: { reference: `Patient/${patient.mrn}` },
  encounter: { reference: `Encounter/${encounterId}` },
  assessor: { reference: `Practitioner/${doctor.id}` },
  date: new Date().toISOString(),
  finding: [{
    itemCodeableConcept: {
      coding: [{ system: 'http://hl7.org/fhir/sid/icd-10', code: icd10Code, display: icd10Display }],
    },
  }],
  note: [
    { text: `HPI: ${hpi}` },
    { text: `Assessment: ${assessment}` },
    { text: `Plan: ${plan}` },
    { text: `Follow-up: ${followUp}` },
  ],
})

// ─── 4. Triage Vitals (Observation × N) ───────────────────────────────────────
export const buildVitalObservation = ({ patient, encounterId, nurseId, loincCode, display, value, unit }) => ({
  resourceType: 'Observation',
  status: 'final',
  category: [{ coding: [{ system: 'http://terminology.hl7.org/CodeSystem/observation-category', code: 'vital-signs' }] }],
  code: { coding: [{ system: 'http://loinc.org', code: loincCode, display }] },
  subject: { reference: `Patient/${patient.mrn}` },
  encounter: { reference: `Encounter/${encounterId}` },
  performer: [{ reference: `Practitioner/${nurseId}` }],
  effectiveDateTime: new Date().toISOString(),
  valueQuantity: { value, unit, system: 'http://unitsofmeasure.org' },
})

export const buildAllVitals = ({ patient, encounterId, nurseId, vitals }) => {
  const LOINC = [
    { key: 'bpSys', code: '55284-4', display: 'Blood pressure systolic',  unit: 'mmHg' },
    { key: 'hr',    code: '8867-4',  display: 'Heart rate',               unit: '/min' },
    { key: 'spo2',  code: '59408-5', display: 'SpO2',                     unit: '%'    },
    { key: 'temp',  code: '8310-5',  display: 'Body temperature',         unit: 'Cel'  },
    { key: 'rr',    code: '9279-1',  display: 'Respiratory rate',         unit: '/min' },
    { key: 'pain',  code: '72514-3', display: 'Pain severity (0-10)',     unit: '{score}' },
  ]
  return LOINC
    .filter(v => vitals[v.key] !== undefined)
    .map(v => buildVitalObservation({ patient, encounterId, nurseId, loincCode: v.code, display: v.display, value: vitals[v.key], unit: v.unit }))
}

// ─── 5. ESI (RiskAssessment) ──────────────────────────────────────────────────
export const buildESI = ({ patient, encounterId, esi, nurseId, nurseNotes }) => ({
  resourceType: 'RiskAssessment',
  status: 'final',
  subject: { reference: `Patient/${patient.mrn}` },
  encounter: { reference: `Encounter/${encounterId}` },
  performer: { reference: `Practitioner/${nurseId}` },
  occurrenceDateTime: new Date().toISOString(),
  prediction: [{
    outcome: { coding: [{ code: `ESI-${esi}`, display: `Emergency Severity Index Level ${esi}` }] },
    qualitativeRisk: { coding: [{ code: ['', 'critical', 'emergent', 'urgent', 'less-urgent', 'non-urgent'][esi] }] },
  }],
  note: [{ text: nurseNotes }],
})

// ─── 6. Medication Request ────────────────────────────────────────────────────
export const buildMedicationRequest = ({ patient, doctor, encounterId, medication }) => ({
  resourceType: 'MedicationRequest',
  status: 'active',
  intent: 'order',
  medicationCodeableConcept: {
    coding: [{ system: 'https://moh.gov.ae/drug-formulary', code: medication.drugCode || '', display: medication.name }],
    text: medication.name,
  },
  subject: { reference: `Patient/${patient.mrn}` },
  encounter: { reference: `Encounter/${encounterId}` },
  requester: { reference: `Practitioner/${doctor.id}` },
  authoredOn: new Date().toISOString(),
  dosageInstruction: [{
    text: `${medication.dose} ${medication.freq}`,
    timing: { code: { text: medication.freq } },
  }],
  extension: [{ url: 'https://nabidh.uaehealth.ae/extensions/nabidh-routing', valueBoolean: true }],
})

// ─── 7. Service Request (Lab / Radiology / Referral) ─────────────────────────
export const buildServiceRequest = ({ patient, doctor, encounterId, type, description, priority = 'routine', specialty, reason }) => ({
  resourceType: 'ServiceRequest',
  status: 'active',
  intent: 'order',
  priority,
  category: [{ coding: [{ code: type }] }], // 'laboratory' | 'imaging' | 'referral'
  code: { text: description },
  subject: { reference: `Patient/${patient.mrn}` },
  encounter: { reference: `Encounter/${encounterId}` },
  requester: { reference: `Practitioner/${doctor.id}` },
  authoredOn: new Date().toISOString(),
  ...(type === 'referral' && {
    performer: [{ display: specialty }],
    reasonCode: [{ text: reason }],
  }),
})

// ─── 8. Media (Recording reference — file lives in Azure Blob / S3) ────────────
export const buildMediaReference = ({ patient, encounterId, recordingId, duration, storageUri }) => ({
  resourceType: 'Media',
  status: 'completed',
  type: { coding: [{ code: 'video', display: 'Telehealth Recording' }] },
  subject: { reference: `Patient/${patient.mrn}` },
  encounter: { reference: `Encounter/${encounterId}` },
  createdDateTime: new Date().toISOString(),
  duration,
  content: {
    contentType: 'video/mp4',
    title: `Recording-${recordingId}`,
    // Internal reference only — NEVER a public URL
    url: `internal://recordings/${recordingId}`,
  },
  extension: [{
    url: 'https://aimed.health/fhir/extensions/storage-uri',
    valueString: storageUri,
  }],
})

// ─── Transaction Bundle ────────────────────────────────────────────────────────
export const buildTransactionBundle = (resources) => ({
  resourceType: 'Bundle',
  type: 'transaction',
  timestamp: new Date().toISOString(),
  entry: resources.map(resource => ({
    resource,
    request: { method: 'POST', url: resource.resourceType },
  })),
})

// ─── Submit to HIS ────────────────────────────────────────────────────────────
export const submitToHIS = async (bundle) => {
  const res = await fetch(`${API_CONFIG.sapURL}/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/fhir+json',
      Authorization: `Bearer ${sessionStorage.getItem('cc_token')}`,
    },
    body: JSON.stringify(bundle),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.issue?.[0]?.details?.text || `HIS error ${res.status}`)
  }
  return res.json()
}
