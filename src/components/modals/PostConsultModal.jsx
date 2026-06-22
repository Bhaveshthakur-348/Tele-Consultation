// One component per file — PostConsultModal
import { useState, useEffect } from 'react'
import { useApp }              from '@/context/AppContext'
import Toggle                  from '@/components/common/Toggle'
import FormField               from '@/components/common/FormField'
import {
  buildEncounter, buildConsent, buildClinicalNote,
  buildAllVitals, buildESI, buildMedicationRequest,
  buildServiceRequest, buildTransactionBundle, submitToHIS,
} from '@/services/fhir'

const TABS = [
  { id: 1, label: '1 · Consent'           },
  { id: 2, label: '2 · Clinical Note'     },
  { id: 3, label: '3 · Prescriptions'     },
  { id: 4, label: '4 · Orders & Referrals'},
  { id: 5, label: '5 · Review & Submit'   },
]

const FOLLOW_UP_OPTIONS = [
  'No follow-up required', '1 week', '2 weeks', '1 month', '3 months', 'As needed / PRN',
]

const SPECIALTIES = [
  '', 'Cardiology', 'Pulmonology', 'Neurology', 'Endocrinology',
  'Orthopedics', 'Dermatology', 'Psychiatry', 'Other',
]

export default function PostConsultModal({ showToast }) {
  const { modals, closeModal, patients, user, updatePatientStatus, darkMode } = useApp()
  const pid     = modals.postConsult
  const patient = pid ? patients[pid] : null

  const [tab,        setTab]       = useState(1)
  const [submitting, setSubmitting]= useState(false)
  const [consent, setConsent] = useState({ treat: true, record: true, idVerified: true, method: 'verbal' })
  const [note,    setNote]    = useState({ complaint: '', icd10: '', hpi: '', assessment: '', plan: '', followUp: 'No follow-up required' })
  const [meds,    setMeds]    = useState([])
  const [noMeds,  setNoMeds]  = useState(false)
  const [orders,  setOrders]  = useState({ labs: '', radiology: '', refSpec: '', refPriority: 'routine', refReason: '', noOrders: false })

  useEffect(() => {
    if (patient) {
      setNote(n => ({ ...n, complaint: patient.complaint || '' }))
      setTab(1)
      setSubmitting(false)
      setMeds([])
    }
  }, [patient])

  if (!patient) return null

  const addMed = () => setMeds(m => [...m, { name: '', dose: '', freq: 'OD' }])
  const delMed = i => setMeds(m => m.filter((_, idx) => idx !== i))
  const upMed  = (i, k, v) => setMeds(m => m.map((med, idx) => idx === i ? { ...med, [k]: v } : med))

  const handleSubmit = async () => {
    if (!note.complaint || !note.plan) {
      alert('Chief complaint and management plan are required before submitting.')
      return
    }
    setSubmitting(true)
    try {
      const now = new Date().toISOString()
      const resources = [
        buildEncounter({ patient, doctor: { id: user.id, name: user.name }, facility: { id: 'AIMED-HEALTH' }, startTime: now, endTime: now }),
        buildConsent({ patient, doctor: { id: user.id }, consentToTreat: consent.treat, consentToRecord: consent.record, method: consent.method, timestamp: now }),
        buildClinicalNote({ patient, doctor: { id: user.id }, encounterId: `ENC-${Date.now()}`, complaint: note.complaint, icd10Code: note.icd10.split(' ')[0], icd10Display: note.icd10, hpi: note.hpi, assessment: note.assessment, plan: note.plan, followUp: note.followUp }),
        ...buildAllVitals({ patient, encounterId: `ENC-${Date.now()}`, nurseId: 'NU-001', vitals: patient.vitals }),
        buildESI({ patient, encounterId: `ENC-${Date.now()}`, esi: patient.esi, nurseId: 'NU-001', nurseNotes: patient.nurseNotes }),
      ]
      if (!noMeds) meds.forEach(m => resources.push(buildMedicationRequest({ patient, doctor: { id: user.id }, encounterId: `ENC-${Date.now()}`, medication: m })))
      if (!orders.noOrders) {
        if (orders.labs)    resources.push(buildServiceRequest({ patient, doctor: { id: user.id }, encounterId: `ENC-${Date.now()}`, type: 'laboratory', description: orders.labs }))
        if (orders.radiology) resources.push(buildServiceRequest({ patient, doctor: { id: user.id }, encounterId: `ENC-${Date.now()}`, type: 'imaging', description: orders.radiology }))
        if (orders.refSpec) resources.push(buildServiceRequest({ patient, doctor: { id: user.id }, encounterId: `ENC-${Date.now()}`, type: 'referral', description: orders.refReason || orders.refSpec, specialty: orders.refSpec, reason: orders.refReason, priority: orders.refPriority }))
      }

      const bundle = buildTransactionBundle(resources)
      console.log('[FHIR Bundle]', bundle) // remove in production
      // await submitToHIS(bundle)           // uncomment when HIS is live

      await new Promise(r => setTimeout(r, 1200)) // simulate API delay
      updatePatientStatus(pid, 'completed')
      closeModal('postConsult')
      showToast?.(`${patient.name} — Documentation submitted to HIS`)
    } catch (err) {
      console.error('HIS error:', err)
      showToast?.(`Submission failed: ${err.message}`, 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const m = darkMode
  const modal  = m ? 'bg-dark-surface' : 'bg-white'
  const hd     = m ? 'border-dark-border' : 'border-clinical-border'
  const info   = m ? 'bg-brand-blue/10 border-brand-blue/25 text-blue-300' : 'bg-blue-50 border-brand-blue/25 text-blue-800'
  const inp    = 'cc-input'
  const footer = m ? 'bg-dark-topbar border-dark-border' : 'bg-gray-50 border-clinical-border'

  return (
    <div className="fixed inset-0 bg-black/45 z-50 flex items-center justify-center p-5">
      <div className={`${modal} rounded-xl w-[720px] max-w-[95vw] max-h-[88vh] flex flex-col overflow-hidden shadow-[0_24px_64px_rgba(9,22,43,.2)]`}>

        {/* Header */}
        <div className={`px-6 pt-5 pb-0 border-b flex-shrink-0 ${hd}`}>
          <div className="flex justify-between mb-4">
            <div>
              <h2 className={`text-base font-bold font-jakarta ${m ? 'text-dark-text' : 'text-clinical-navy'}`}>
                Post Consultation Documentation
              </h2>
              <p className="text-xs text-clinical-muted mt-0.5">
                {patient.name} · {patient.mrn} · UAE DoH requires submission within 24hrs
              </p>
            </div>
            <button onClick={() => closeModal('postConsult')} className="text-xl text-clinical-muted leading-none">×</button>
          </div>

          {/* Tabs */}
          <div className="flex">
            {TABS.map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-3.5 py-2 text-[12.5px] whitespace-nowrap border-b-[2.5px] -mb-px transition-all
                  ${tab === t.id
                    ? `font-semibold border-brand-blue ${m ? 'text-brand-blue' : 'text-brand-blue'}`
                    : `font-medium border-transparent ${m ? 'text-dark-muted' : 'text-clinical-muted'}`}`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">

          {/* TAB 1 — Consent */}
          {tab === 1 && (
            <div>
              <div className={`text-[12.5px] border-l-[3px] border-brand-blue px-3 py-2.5 rounded mb-4 leading-relaxed ${info}`}>
                UAE DoH Telehealth Policy 2023 requires encounter-specific consent documented per consultation.
              </div>
              <Toggle value={consent.treat}      onChange={() => setConsent(c => ({...c, treat: !c.treat}))}      label="Telehealth consultation consent"    sub="Patient verbally confirmed agreement to remote consultation" />
              <Toggle value={consent.record}     onChange={() => setConsent(c => ({...c, record: !c.record}))}    label="Consent to record"                  sub="Patient acknowledged session may be recorded and stored in HIS" />
              <Toggle value={consent.idVerified} onChange={() => setConsent(c => ({...c, idVerified: !c.idVerified}))} label="Identity verified"             sub="Patient identity confirmed via Emirates ID or passport" />
              <FormField label="Consent method">
                <select className={inp} value={consent.method} onChange={e => setConsent(c => ({...c, method: e.target.value}))}>
                  <option value="verbal">Verbal — confirmed on call</option>
                  <option value="digital">Digital — signed via patient portal</option>
                  <option value="written">Written — scanned and uploaded</option>
                </select>
              </FormField>
              <FormField label="Timestamp (auto — server-side)">
                <input className={inp} readOnly value={new Date().toLocaleString('en-GB')} style={{ color: '#94A3B8' }} />
              </FormField>
            </div>
          )}

          {/* TAB 2 — Clinical Note */}
          {tab === 2 && (
            <div>
              <div className="grid grid-cols-2 gap-3 mb-1">
                <FormField label="Chief complaint" required>
                  <input className={inp} value={note.complaint} onChange={e => setNote(n => ({...n, complaint: e.target.value}))} placeholder="e.g. Chest pain × 3 days" />
                </FormField>
                <FormField label="ICD-10 Diagnosis code" required>
                  <input className={inp} value={note.icd10} onChange={e => setNote(n => ({...n, icd10: e.target.value}))} placeholder="e.g. I20.9 — Angina pectoris" />
                </FormField>
              </div>
              <FormField label="History of presenting illness">
                <textarea className={`${inp} resize-y min-h-[72px] leading-relaxed`} value={note.hpi} onChange={e => setNote(n => ({...n, hpi: e.target.value}))} placeholder="Onset, duration, character, associated symptoms…" />
              </FormField>
              <FormField label="Assessment & findings">
                <textarea className={`${inp} resize-y min-h-[72px] leading-relaxed`} value={note.assessment} onChange={e => setNote(n => ({...n, assessment: e.target.value}))} placeholder="Clinical assessment…" />
              </FormField>
              <FormField label="Management plan" required>
                <textarea className={`${inp} resize-y min-h-[72px] leading-relaxed`} value={note.plan} onChange={e => setNote(n => ({...n, plan: e.target.value}))} placeholder="Treatment plan, lifestyle advice, medication changes…" />
              </FormField>
              <div className="grid grid-cols-2 gap-3">
                <FormField label="Follow-up">
                  <select className={inp} value={note.followUp} onChange={e => setNote(n => ({...n, followUp: e.target.value}))}>
                    {FOLLOW_UP_OPTIONS.map(f => <option key={f}>{f}</option>)}
                  </select>
                </FormField>
                <FormField label="Consultation type">
                  <select className={inp}>
                    <option>Telehealth — Video</option>
                    <option>Telehealth — Audio only</option>
                  </select>
                </FormField>
              </div>
            </div>
          )}

          {/* TAB 3 — Prescriptions */}
          {tab === 3 && (
            <div>
              <div className={`text-[12.5px] border-l-[3px] border-brand-blue px-3 py-2.5 rounded mb-4 leading-relaxed ${info}`}>
                E-prescriptions are transmitted to the UAE Nabidh network. Prescriber license auto-attached from session.
              </div>

              {/* Meds header */}
              {meds.length > 0 && (
                <div className="grid gap-2 mb-1" style={{ gridTemplateColumns: '1fr 90px 90px 28px' }}>
                  {['Medication', 'Dose', 'Frequency', ''].map(h => (
                    <div key={h} className="text-[10px] uppercase tracking-wider text-clinical-muted font-semibold pb-1">{h}</div>
                  ))}
                </div>
              )}

              {meds.map((med, i) => (
                <div key={i} className="grid gap-2 mb-2 items-center" style={{ gridTemplateColumns: '1fr 90px 90px 28px' }}>
                  <input className={inp} value={med.name} onChange={e => upMed(i, 'name', e.target.value)} placeholder="Medication name" />
                  <input className={inp} value={med.dose} onChange={e => upMed(i, 'dose', e.target.value)} placeholder="250mg" />
                  <select className={inp} value={med.freq} onChange={e => upMed(i, 'freq', e.target.value)}>
                    {['OD','BD','TDS','QID','PRN'].map(f => <option key={f}>{f}</option>)}
                  </select>
                  <button onClick={() => delMed(i)} className="w-6 h-6 rounded bg-red-50 text-clinical-danger text-sm flex items-center justify-center hover:bg-red-100">×</button>
                </div>
              ))}

              <button
                onClick={addMed}
                className="flex items-center gap-1.5 text-[12.5px] text-brand-blue py-2 border-t border-dashed border-clinical-border w-full mt-1"
              >
                ＋ Add medication
              </button>

              <div className="mt-4">
                <Toggle value={noMeds} onChange={() => setNoMeds(v => !v)} label="No medications prescribed this encounter" sub="Skip prescription" />
              </div>
            </div>
          )}

          {/* TAB 4 — Orders & Referrals */}
          {tab === 4 && (
            <div>
              <FormField label="Laboratory investigations">
                <textarea className={`${inp} resize-y min-h-[56px] leading-relaxed`} value={orders.labs} onChange={e => setOrders(o => ({...o, labs: e.target.value}))} placeholder="e.g. FBC, CMP, HbA1c, Lipid profile, Troponin…" />
              </FormField>
              <FormField label="Radiology / Imaging">
                <textarea className={`${inp} resize-y min-h-[56px] leading-relaxed`} value={orders.radiology} onChange={e => setOrders(o => ({...o, radiology: e.target.value}))} placeholder="e.g. CXR, ECG, Echo, CT chest…" />
              </FormField>
              <FormField label="Specialist referral">
                <div className="grid grid-cols-2 gap-3 mb-2">
                  <select className={inp} value={orders.refSpec} onChange={e => setOrders(o => ({...o, refSpec: e.target.value}))}>
                    {SPECIALTIES.map(s => <option key={s} value={s}>{s || 'No referral'}</option>)}
                  </select>
                  <select className={inp} value={orders.refPriority} onChange={e => setOrders(o => ({...o, refPriority: e.target.value}))}>
                    <option value="routine">Routine (4 weeks)</option>
                    <option value="urgent">Urgent (1 week)</option>
                    <option value="asap">Emergency (24 hrs)</option>
                  </select>
                </div>
                <textarea className={`${inp} resize-y min-h-[56px] leading-relaxed`} value={orders.refReason} onChange={e => setOrders(o => ({...o, refReason: e.target.value}))} placeholder="Reason for referral / clinical summary for receiving specialist…" />
              </FormField>
              <Toggle value={orders.noOrders} onChange={() => setOrders(o => ({...o, noOrders: !o.noOrders}))} label="No orders or referrals this encounter" sub="Skip this section" />
            </div>
          )}

          {/* TAB 5 — Review & Submit */}
          {tab === 5 && (
            <div>
              <div className={`text-[12.5px] border-l-[3px] border-brand-blue px-3 py-2.5 rounded mb-4 leading-relaxed ${info}`}>
                Once submitted, this encounter record is locked in the HIS. Amendments require a formal addendum request.
              </div>

              {[
                ['Telehealth consent',   consent.treat    ? '✓ Captured'                         : '— Not confirmed'],
                ['Consent to record',    consent.record   ? '✓ Captured'                         : '— Skipped'],
                ['Chief complaint',      note.complaint   || '—'],
                ['ICD-10',               note.icd10       || '—'],
                ['Management plan',      note.plan        ? note.plan.slice(0, 60) + '…'          : '—'],
                ['Follow-up',            note.followUp    || '—'],
                ['Medications',          noMeds           ? '— Skipped' : meds.length ? `${meds.length} medication(s)` : '— None'],
                ['Lab orders',           orders.noOrders || !orders.labs       ? '— Skipped' : '✓ Captured'],
                ['Radiology',            orders.noOrders || !orders.radiology  ? '— Skipped' : '✓ Captured'],
                ['Specialist referral',  orders.noOrders || !orders.refSpec    ? '— Skipped' : orders.refSpec],
              ].map(([label, val]) => (
                <div key={label} className={`flex justify-between py-2 border-b text-sm last:border-b-0 ${m ? 'border-white/5' : 'border-gray-100'}`}>
                  <span className="text-[11.5px] font-medium text-clinical-muted w-44 flex-shrink-0">{label}</span>
                  <span className={`text-right flex-1 ${val.startsWith('✓') ? 'text-clinical-success' : val.startsWith('—') ? 'text-clinical-muted' : (m ? 'text-dark-text' : 'text-clinical-navy')}`}>
                    {val}
                  </span>
                </div>
              ))}

              {/* FHIR resources preview */}
              <div className="mt-4 p-3.5 bg-blue-50 dark:bg-brand-blue/10 border border-brand-blue/20 rounded-lg">
                <div className="text-[11.5px] font-semibold text-brand-blue mb-2">FHIR R4 Resources to be submitted</div>
                <div className="grid grid-cols-2 gap-1.5 text-[11px] text-brand-blue">
                  <span>✓ Encounter (metadata)</span>
                  <span>✓ Consent (telehealth)</span>
                  <span>✓ ClinicalImpression (note)</span>
                  <span>✓ Observation × vitals</span>
                  <span>✓ RiskAssessment (ESI)</span>
                  <span className={!noMeds && meds.length ? 'text-brand-blue' : 'text-clinical-muted'}>
                    {!noMeds && meds.length ? '✓' : '○'} MedicationRequest
                  </span>
                  <span className={!orders.noOrders && orders.labs ? 'text-brand-blue' : 'text-clinical-muted'}>
                    {!orders.noOrders && orders.labs ? '✓' : '○'} ServiceRequest (labs)
                  </span>
                  <span className={!orders.noOrders && orders.refSpec ? 'text-brand-blue' : 'text-clinical-muted'}>
                    {!orders.noOrders && orders.refSpec ? '✓' : '○'} ReferralRequest
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`px-6 py-3.5 border-t flex items-center justify-between flex-shrink-0 ${footer}`}>
          <span className="text-[11px] text-clinical-muted">
            Step {tab} of {TABS.length} · {TABS[tab - 1].label.split('·')[1]?.trim()}
          </span>
          <div className="flex gap-2">
            {tab > 1 && (
              <button
                onClick={() => setTab(t => t - 1)}
                className={`px-4 py-2 rounded-md text-sm border transition-colors
                  ${m ? 'bg-white/5 text-dark-muted border-white/10 hover:bg-white/10' : 'bg-white text-clinical-slate border-clinical-border hover:bg-gray-50'}`}
              >
                Back
              </button>
            )}
            {tab < 5 ? (
              <button
                onClick={() => setTab(t => t + 1)}
                className="px-5 py-2 rounded-md text-sm font-semibold bg-brand-blue text-white hover:bg-brand-blue-hover transition-colors"
              >
                Next →
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className={`px-5 py-2 rounded-md text-sm font-semibold text-white transition-colors ${submitting ? 'bg-clinical-muted cursor-not-allowed' : 'bg-clinical-success hover:bg-emerald-700'}`}
              >
                {submitting ? 'Submitting…' : 'Submit to HIS'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
