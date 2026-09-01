import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, AlertCircle, ArrowRight, Hexagon } from 'lucide-react'

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
    <div className="min-h-screen flex bg-black">
      {/* Left branding panel */}
      <div className="hidden lg:flex flex-col justify-between w-[55%] p-12 relative overflow-hidden">
        {/* Deep Dark Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#12100e] via-black to-[#1a1500]" />
        
        {/* Glow Effects */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#fbbf24]/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[#a78bfa]/5 rounded-full blur-[150px] pointer-events-none" />

        {/* Honeycomb pattern bg */}
        <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" viewBox="0 0 400 400">
          {Array.from({ length: 12 }).map((_, row) =>
            Array.from({ length: 8 }).map((_, col) => {
              const x = col * 66 + (row % 2 === 1 ? 33 : 0)
              const y = row * 58
              const pts = Array.from({ length: 6 }, (_, i) => {
                const a = (Math.PI / 3) * i - Math.PI / 6
                return `${x + 28 * Math.cos(a)},${y + 28 * Math.sin(a)}`
              }).join(' ')
              return <polygon key={`${row}-${col}`} points={pts} fill="none" stroke="#fbbf24" strokeWidth="0.5" />
            })
          )}
        </svg>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <svg width="40" height="40" viewBox="0 0 32 32" fill="none">
              <polygon points="16,2 28,9 28,23 16,30 4,23 4,9" fill="#fbbf24" opacity="0.2" stroke="#fbbf24" strokeWidth="1.5" />
              <polygon points="16,7 23,11 23,19 16,23 9,19 9,11" fill="none" stroke="#fbbf24" strokeWidth="1" opacity="0.7" />
              <circle cx="16" cy="15" r="3" fill="#fbbf24" />
              <line x1="16" y1="7" x2="16" y2="11" stroke="#fbbf24" strokeWidth="1.2" />
              <line x1="23" y1="11" x2="20" y2="13" stroke="#fbbf24" strokeWidth="1.2" />
              <line x1="23" y1="19" x2="20" y2="17" stroke="#fbbf24" strokeWidth="1.2" />
              <line x1="16" y1="23" x2="16" y2="19" stroke="#fbbf24" strokeWidth="1.2" />
              <line x1="9" y1="19" x2="12" y2="17" stroke="#fbbf24" strokeWidth="1.2" />
              <line x1="9" y1="11" x2="12" y2="13" stroke="#fbbf24" strokeWidth="1.2" />
            </svg>
            <div>
              <div className="font-display font-bold text-white text-xl tracking-wide leading-none">HiveSense</div>
              <div className="text-[#fbbf24] text-[10px] font-bold tracking-widest uppercase mt-1">OS Platform</div>
            </div>
          </div>

          <h1 className="font-display text-4xl xl:text-6xl font-bold text-white leading-[1.1] mb-6 tracking-wide">
            Monitor Hives.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#fbbf24] to-[#f59e0b]">
              Protect The Colony.
            </span>
          </h1>
          <p className="text-white/60 text-lg leading-relaxed max-w-md font-medium">
            Real-time environmental telemetry, AI-powered edge vision, and intelligent swarm prediction — unified in one dark mode interface.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-5 relative z-10">
          {[
            { label: 'Hives Monitored', value: '2,400+', color: '#fbbf24' },
            { label: 'Data Points/Day', value: '86K', color: '#4ade80' },
            { label: 'AI Precision', value: '96.4%', color: '#a78bfa' },
          ].map(s => (
            <div key={s.label} className="glass-panel border border-white/10 rounded-2xl p-5 hover:bg-white/5 transition-colors">
              <div className="font-mono-data text-2xl font-bold mb-1" style={{ color: s.color }}>{s.value}</div>
              <div className="text-white/50 text-[10px] font-bold uppercase tracking-widest">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right login panel */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative overflow-hidden bg-[#0a0a0a]">
        <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-[#fbbf24]/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="w-full max-w-md relative z-10">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden justify-center">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <polygon points="16,2 28,9 28,23 16,30 4,23 4,9" fill="#fbbf24" opacity="0.2" stroke="#fbbf24" strokeWidth="1.5" />
              <circle cx="16" cy="15" r="3" fill="#fbbf24" />
            </svg>
            <div className="font-display font-bold text-white text-xl tracking-wide">HiveSense OS</div>
          </div>

          <div className="glass-panel-elevated border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl">
            <h2 className="font-display text-3xl font-bold text-white mb-2">Initialize Session</h2>
            <p className="text-white/50 text-sm font-medium mb-8">Authenticate to access your apiary dashboard.</p>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-white/50 mb-2">Secure Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="disha@apiary.com"
                  className={`w-full px-4 py-3.5 rounded-xl border bg-black/50 text-white text-sm font-medium placeholder:text-white/20 outline-none transition-all shadow-inner
                    ${errors.email ? 'border-[#ef4444] ring-2 ring-[#ef4444]/20' : 'border-white/10 focus:border-[#fbbf24]/50 focus:bg-[#fbbf24]/5'}`}
                />
                {errors.email && (
                  <div className="flex items-center gap-1.5 mt-2">
                    <AlertCircle size={14} className="text-[#ef4444]" />
                    <span className="text-[#ef4444] text-xs font-bold">{errors.email}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-white/50 mb-2">Encryption Key</label>
                <div className="relative">
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`w-full px-4 py-3.5 pr-12 rounded-xl border bg-black/50 text-white text-sm font-medium placeholder:text-white/20 outline-none transition-all shadow-inner
                      ${errors.password ? 'border-[#ef4444] ring-2 ring-[#ef4444]/20' : 'border-white/10 focus:border-[#fbbf24]/50 focus:bg-[#fbbf24]/5'}`}
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors">
                    {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <div className="flex items-center gap-1.5 mt-2">
                    <AlertCircle size={14} className="text-[#ef4444]" />
                    <span className="text-[#ef4444] text-xs font-bold">{errors.password}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2.5 cursor-pointer group">
                  <div className="relative flex items-center justify-center">
                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={e => setRemember(e.target.checked)}
                      className="peer appearance-none w-4 h-4 rounded border border-white/20 bg-black/50 checked:bg-[#fbbf24] checked:border-[#fbbf24] transition-all cursor-pointer"
                    />
                    <div className="absolute pointer-events-none opacity-0 peer-checked:opacity-100 text-black">
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                        <path d="M1 4L3.5 6.5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                  <span className="text-white/50 text-xs font-bold uppercase tracking-wider group-hover:text-white/80 transition-colors">Remember Node</span>
                </label>
                <button type="button" className="text-[#fbbf24] text-xs font-bold uppercase tracking-wider hover:text-[#fbbf24]/80 transition-colors">
                  Reset Key?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-[#fbbf24] hover:bg-[#fbbf24]/90 text-black font-bold text-sm uppercase tracking-wider py-4 rounded-xl transition-all disabled:opacity-70 mt-4 shadow-[0_0_20px_rgba(251,191,36,0.3)]"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
                      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                    Authenticating…
                  </span>
                ) : (
                  <>Connect <ArrowRight size={16} /></>
                )}
              </button>
            </form>

            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-white/30 text-[10px] font-bold uppercase tracking-widest">or</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            <button className="w-full flex items-center justify-center gap-3 border border-white/10 bg-white/5 hover:bg-white/10 text-white text-sm font-bold tracking-wide py-3.5 rounded-xl transition-all">
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              SSO Login
            </button>
          </div>
          
          <p className="text-center text-white/40 text-xs font-bold uppercase tracking-wider mt-8">
            New node deployment?{' '}
            <button className="text-[#fbbf24] hover:text-white transition-colors">Register Hub</button>
          </p>
        </div>
      </div>
    </div>
  )
}
