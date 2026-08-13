import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, AlertCircle, ArrowRight } from 'lucide-react'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [remember, setRemember] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})

  const validate = () => {
    const e: { email?: string; password?: string } = {}
    if (!email) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Enter a valid email address'
    if (!password) e.password = 'Password is required'
    else if (password.length < 6) e.password = 'Password must be at least 6 characters'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 1200))
    setLoading(false)
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen flex bg-[#f7f5f0]">
      {/* Left branding panel */}
      <div className="hidden lg:flex flex-col justify-between w-[52%] bg-[#1c1917] p-12 relative overflow-hidden">
        {/* Honeycomb pattern bg */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.04]" viewBox="0 0 400 400">
          {Array.from({ length: 8 }).map((_, row) =>
            Array.from({ length: 6 }).map((_, col) => {
              const x = col * 66 + (row % 2 === 1 ? 33 : 0)
              const y = row * 58
              const pts = Array.from({ length: 6 }, (_, i) => {
                const a = (Math.PI / 3) * i - Math.PI / 6
                return `${x + 28 * Math.cos(a)},${y + 28 * Math.sin(a)}`
              }).join(' ')
              return <polygon key={`${row}-${col}`} points={pts} fill="none" stroke="white" strokeWidth="1" />
            })
          )}
        </svg>

        <div>
          <div className="flex items-center gap-3 mb-16">
            <svg width="36" height="36" viewBox="0 0 32 32" fill="none">
              <polygon points="16,2 28,9 28,23 16,30 4,23 4,9" fill="#d97706" opacity="0.2" stroke="#d97706" strokeWidth="1.5" />
              <polygon points="16,7 23,11 23,19 16,23 9,19 9,11" fill="none" stroke="#d97706" strokeWidth="1" opacity="0.7" />
              <circle cx="16" cy="15" r="3" fill="#d97706" />
              <line x1="16" y1="7" x2="16" y2="11" stroke="#fbbf24" strokeWidth="1.2" />
              <line x1="23" y1="11" x2="20" y2="13" stroke="#fbbf24" strokeWidth="1.2" />
              <line x1="23" y1="19" x2="20" y2="17" stroke="#fbbf24" strokeWidth="1.2" />
              <line x1="16" y1="23" x2="16" y2="19" stroke="#fbbf24" strokeWidth="1.2" />
              <line x1="9" y1="19" x2="12" y2="17" stroke="#fbbf24" strokeWidth="1.2" />
              <line x1="9" y1="11" x2="12" y2="13" stroke="#fbbf24" strokeWidth="1.2" />
            </svg>
            <div>
              <div className="font-display font-semibold text-white text-lg leading-none">HiveSense</div>
              <div className="text-[#d97706] text-[10px] font-medium tracking-widest uppercase mt-0.5">AI Platform</div>
            </div>
          </div>

          <h1 className="font-display text-4xl xl:text-5xl font-semibold text-white leading-[1.15] mb-6">
            Monitor Your Hives.<br />
            <span className="text-[#d97706]">Protect Your Colony.</span>
          </h1>
          <p className="text-white/50 text-base leading-relaxed max-w-sm">
            Real-time environmental monitoring, AI-powered bee behavior analysis, and intelligent hive insights — all in one platform.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Hives Monitored', value: '2,400+' },
            { label: 'Data Points/Day', value: '86K' },
            { label: 'AI Accuracy', value: '96.4%' },
          ].map(s => (
            <div key={s.label} className="bg-white/5 rounded-xl p-4 border border-white/8">
              <div className="font-mono-data text-[#d97706] text-xl font-medium mb-1">{s.value}</div>
              <div className="text-white/40 text-xs">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right login panel */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex items-center gap-2.5 mb-8 lg:hidden">
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
              <polygon points="16,2 28,9 28,23 16,30 4,23 4,9" fill="#d97706" opacity="0.15" stroke="#d97706" strokeWidth="1.5" />
              <circle cx="16" cy="15" r="3" fill="#d97706" />
            </svg>
            <div className="font-display font-semibold text-[#1c1917] text-base">HiveSense AI</div>
          </div>

          <h2 className="font-display text-2xl font-semibold text-[#1c1917] mb-1">Welcome back</h2>
          <p className="text-[#78716c] text-sm mb-8">Sign in to your apiary dashboard</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[#1c1917] text-xs font-medium mb-1.5">Email address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="disha@apiary.com"
                className={`w-full px-3.5 py-2.5 rounded-xl border bg-white text-[#1c1917] text-sm placeholder:text-[#c4bdb6] outline-none transition-all
                  ${errors.email ? 'border-[#dc2626] ring-2 ring-[#dc2626]/15' : 'border-[#e8e3db] focus:border-[#d97706] focus:ring-2 focus:ring-[#d97706]/15'}`}
              />
              {errors.email && (
                <div className="flex items-center gap-1 mt-1.5">
                  <AlertCircle size={12} className="text-[#dc2626]" />
                  <span className="text-[#dc2626] text-xs">{errors.email}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-[#1c1917] text-xs font-medium mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full px-3.5 py-2.5 pr-10 rounded-xl border bg-white text-[#1c1917] text-sm placeholder:text-[#c4bdb6] outline-none transition-all
                    ${errors.password ? 'border-[#dc2626] ring-2 ring-[#dc2626]/15' : 'border-[#e8e3db] focus:border-[#d97706] focus:ring-2 focus:ring-[#d97706]/15'}`}
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a09890] hover:text-[#78716c]">
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.password && (
                <div className="flex items-center gap-1 mt-1.5">
                  <AlertCircle size={12} className="text-[#dc2626]" />
                  <span className="text-[#dc2626] text-xs">{errors.password}</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={e => setRemember(e.target.checked)}
                  className="w-3.5 h-3.5 rounded border-[#d4cfc7] accent-[#d97706]"
                />
                <span className="text-[#78716c] text-xs">Remember me</span>
              </label>
              <button type="button" className="text-[#d97706] text-xs font-medium hover:text-[#b45309]">
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-[#d97706] hover:bg-[#b45309] text-white font-medium text-sm py-2.5 rounded-xl transition-all disabled:opacity-70 mt-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
                    <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                  Signing in…
                </span>
              ) : (
                <>Sign in <ArrowRight size={15} /></>
              )}
            </button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-[#e8e3db]" />
            <span className="text-[#a09890] text-xs">or</span>
            <div className="flex-1 h-px bg-[#e8e3db]" />
          </div>

          <button className="w-full flex items-center justify-center gap-2.5 border border-[#e8e3db] bg-white hover:bg-[#f7f5f0] text-[#1c1917] text-sm font-medium py-2.5 rounded-xl transition-all">
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <p className="text-center text-[#78716c] text-xs mt-6">
            Don&apos;t have an account?{' '}
            <button className="text-[#d97706] font-medium hover:text-[#b45309]">Create account</button>
          </p>
        </div>
      </div>
    </div>
  )
}
