// One component per file — SupportModal
import { useState } from 'react'
import { useApp }   from '@/context/AppContext'
import FormField    from '@/components/common/FormField'

const ISSUE_TYPES = [
  { value: 'technical', label: 'Technical issue'       },
  { value: 'video',     label: 'Video / audio problem' },
  { value: 'patient',   label: 'Patient data issue'    },
  { value: 'access',    label: 'Access / login issue'  },
  { value: 'other',     label: 'Other'                 },
]

export default function SupportModal({ showToast }) {
  const { modals, closeModal, user, darkMode } = useApp()
  const [form, setForm] = useState({ type: 'technical', subject: '', body: '' })

  if (!modals.support) return null

  const handleSubmit = () => {
    const subj = encodeURIComponent(`[Digital Application] ${form.subject}`)
    const body = encodeURIComponent(
      `User: ${user.name}\nRole: ${user.role_label}\nType: ${form.type}\nTime: ${new Date().toLocaleString('en-GB')}\n\nIssue:\n${form.body}\n\n---\nCareConnect Teleconsultation Portal`
    )
    window.location.href = `mailto:support@aimed.health?subject=${subj}&body=${body}`
    closeModal('support')
    showToast?.('Support email opened — ticket will be assigned on receipt')
  }

  const modal = darkMode ? 'bg-dark-surface' : 'bg-white'
  const inputCls = 'cc-input'

  return (
    <div className="fixed inset-0 bg-black/45 z-50 flex items-center justify-center p-5">
      <div className={`${modal} rounded-xl w-[420px] max-w-[95vw] p-6 shadow-[0_24px_64px_rgba(9,22,43,0.2)]`}>
        <div className="flex justify-between items-center mb-5">
          <h2 className={`text-base font-bold font-jakarta ${darkMode ? 'text-dark-text' : 'text-clinical-navy'}`}>
            Help &amp; Support
          </h2>
          <button onClick={() => closeModal('support')} className="text-xl text-clinical-muted hover:text-clinical-navy leading-none">×</button>
        </div>

        <FormField label="Issue type">
          <select
            className={inputCls}
            value={form.type}
            onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
          >
            {ISSUE_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </FormField>

        <FormField label="Subject">
          <input
            className={inputCls}
            value={form.subject}
            onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
            placeholder="Brief description of the issue"
          />
        </FormField>

        <FormField label="Details">
          <textarea
            className={`${inputCls} resize-y min-h-[80px] leading-relaxed`}
            value={form.body}
            onChange={e => setForm(f => ({ ...f, body: e.target.value }))}
            placeholder="Describe what happened and steps to reproduce…"
          />
        </FormField>

        <div className="flex justify-end gap-2 mt-2">
          <button
            onClick={() => closeModal('support')}
            className={`px-4 py-2 rounded-md text-sm border transition-colors
              ${darkMode ? 'bg-white/5 text-dark-muted border-white/10 hover:bg-white/10' : 'bg-white text-clinical-slate border-clinical-border hover:bg-gray-50'}`}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded-md text-sm font-semibold bg-brand-blue text-white hover:bg-brand-blue-hover transition-colors"
          >
            Send to Support
          </button>
        </div>

        <p className="text-[10.5px] text-clinical-muted text-center mt-3">
          A ticket will be assigned to the Digital Application support team
        </p>
      </div>
    </div>
  )
}
