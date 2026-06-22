// One component per file — LoginPage
// Replace with OAuth2 / SAML SSO redirect in production
import { useNavigate } from 'react-router-dom'

export default function LoginPage() {
  const navigate = useNavigate()

  const handleLogin = (role) => {
    // In production: redirect to Azure AD / Okta SSO
    // sessionStorage.setItem('cc_token', jwtFromOAuth)
    navigate(role === 'nurse' ? '/nurse' : '/')
  }

  return (
    <div className="min-h-screen bg-clinical-bg flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-clinical p-10 w-[380px]">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl logo-gradient flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 14 14" fill="white">
              <rect x="5" y="0" width="4" height="14" rx="1.5"/>
              <rect x="0" y="5" width="14" height="4" rx="1.5"/>
            </svg>
          </div>
          <div>
            <div className="text-lg font-bold font-jakarta text-clinical-navy">CareConnect</div>
            <div className="text-xs text-clinical-muted">Teleconsultation Portal</div>
          </div>
        </div>

        <h1 className="text-xl font-bold font-jakarta text-clinical-navy mb-2">Sign in</h1>
        <p className="text-sm text-clinical-muted mb-6">
          Use your institutional credentials to access the portal.
        </p>

        {/* Dev-only role picker — replace with SSO button in production */}
        <div className="space-y-3">
          <button
            onClick={() => handleLogin('doctor')}
            className="w-full btn-primary py-3 text-sm rounded-lg"
          >
            Continue as Doctor (dev)
          </button>
          <button
            onClick={() => handleLogin('nurse')}
            className="w-full py-3 text-sm rounded-lg border border-clinical-border text-clinical-slate hover:bg-gray-50 transition-colors"
          >
            Continue as Nurse (dev)
          </button>
        </div>

        <p className="text-[11px] text-clinical-muted text-center mt-6">
          For clinical use only · © 2026 AImed Health Technologies
        </p>
      </div>
    </div>
  )
}
