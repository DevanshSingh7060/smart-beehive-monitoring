import { useState } from 'react'
import { User, Bell, Cpu, Shield, Sliders, Wifi, Save, CheckCircle2 } from 'lucide-react'

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-all duration-300 ${checked ? 'bg-[#d97706] shadow-[0_0_10px_rgba(217,119,6,0.3)]' : 'bg-white/10'}`}>
      <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-[18px]' : 'translate-x-[3px]'}`} />
    </button>
  )
}

function RangeInput({ label, min, max, value, unit, onChange }: { label: string; min: number; max: number; value: number; unit: string; onChange: (v: number) => void }) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between text-xs">
        <span className="text-white/60">{label}</span>
        <span className="font-mono-data font-medium text-[#fbbf24]">{value}{unit}</span>
      </div>
      <input type="range" min={min} max={max} value={value} onChange={e => onChange(Number(e.target.value))}
        className="w-full h-1.5 rounded-full bg-white/10 appearance-none cursor-pointer accent-[#d97706]" />
      <div className="flex justify-between text-[10px] text-white/40 font-mono-data">
        <span>{min}{unit}</span><span>{max}{unit}</span>
      </div>
    </div>
  )
}

const settingsTabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'sensors', label: 'Sensor Settings', icon: Cpu },
  { id: 'alerts', label: 'Alert Thresholds', icon: Bell },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'ai', label: 'AI Settings', icon: Sliders },
  { id: 'system', label: 'System', icon: Shield },
]

export default function Settings() {
  const [tab, setTab] = useState('profile')
  const [saved, setSaved] = useState(false)

  const [thresholds, setThresholds] = useState({
    tempMin: 30, tempMax: 36,
    humidMin: 50, humidMax: 75,
    weightChange: 2.0,
    buzzingMax: 80,
    vibrationMax: 0.35,
  })

  const [notifs, setNotifs] = useState({ email: true, sms: false, push: true, dashboard: true })
  const [aiSettings, setAiSettings] = useState({ autoAnalysis: true, swarmDetection: true, queenDetection: true, diseaseDetection: true, confidence: 75 })

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="space-y-6 text-gray-200">
      {/* Settings Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel rounded-3xl p-6 lg:p-8 relative overflow-hidden">
        <div className="absolute -left-20 -top-20 w-60 h-60 bg-[#d97706]/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10">
          <h1 className="font-display text-2xl lg:text-3xl font-bold text-white">Settings</h1>
          <p className="text-white/50 text-sm mt-1.5">Manage your account, hives, and preferences.</p>
        </div>
        <div className="relative z-10">
          <button onClick={handleSave}
            className={`flex items-center justify-center min-w-[140px] gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              saved 
                ? 'bg-[#16a34a]/20 text-[#4ade80] border border-[#16a34a]/40 shadow-[0_0_15px_rgba(22,163,74,0.2)]' 
                : 'bg-[#d97706]/20 text-[#fbbf24] border border-[#d97706]/30 hover:bg-[#d97706]/30 shadow-[0_0_15px_rgba(217,119,6,0.15)]'
            }`}>
            {saved ? <><CheckCircle2 size={16} /> Saved!</> : <><Save size={16} /> Save Changes</>}
          </button>
        </div>
      </div>

      {/* Settings Layout Grid */}
      <div className="grid grid-cols-1 md:grid-cols-[220px_minmax(0,1fr)] lg:grid-cols-[260px_minmax(0,1fr)] gap-6 items-start">
        
        {/* Left Settings Navigation */}
        <div className="w-full glass-panel rounded-3xl p-3 border border-white/10">
          <nav className="space-y-1.5">
            {settingsTabs.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setTab(id)}
                className={`w-full min-h-[48px] flex items-center gap-3 px-4 rounded-2xl text-left text-sm font-semibold transition-all
                  ${tab === id 
                    ? 'bg-[#d97706]/20 text-[#fbbf24] border border-[#d97706]/30 shadow-[0_0_10px_rgba(217,119,6,0.1)]' 
                    : 'text-white/60 hover:text-white hover:bg-white/5 border border-transparent'}`}>
                <Icon size={18} />
                {label}
              </button>
            ))}
          </nav>
        </div>

        {/* Right Settings Content */}
        <div className="min-w-0 w-full glass-panel-elevated rounded-3xl p-6 lg:p-8">
          
          {tab === 'profile' && (
            <div className="space-y-6">
              <h2 className="font-display font-semibold text-white text-lg tracking-wide uppercase ai-glow-text mb-6 flex items-center gap-2">
                <User size={18} className="text-[#fbbf24]" /> Profile & Account
              </h2>
              
              <div className="flex items-center gap-5 pb-6 border-b border-white/10">
                <div className="w-20 h-20 rounded-2xl bg-[#d97706]/20 flex items-center justify-center border border-[#d97706]/30 shadow-[0_0_15px_rgba(217,119,6,0.15)] relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#d97706]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <User size={32} className="text-[#fbbf24]" />
                </div>
                <div>
                  <div className="font-display text-xl font-bold text-white tracking-tight">Disha Guglani</div>
                  <div className="text-white/60 text-sm mt-0.5">disha@apiary.com</div>
                  <span className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-[#d97706]/20 text-[#fbbf24] border border-[#d97706]/30">
                    Pro Account
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                {[
                  { label: 'Full Name', value: 'Disha Guglani', type: 'text' },
                  { label: 'Email Address', value: 'disha@apiary.com', type: 'email' },
                  { label: 'Organization', value: 'Guglani Apiaries', type: 'text' },
                  { label: 'Location', value: 'Gujarat, India', type: 'text' },
                ].map(f => (
                  <div key={f.label} className="flex flex-col">
                    <label className="text-xs font-semibold text-white/60 mb-2 uppercase tracking-wider">{f.label}</label>
                    <input type={f.type} defaultValue={f.value}
                      className="h-[48px] px-4 rounded-xl border border-white/10 bg-black/20 text-sm text-white outline-none focus:border-[#fbbf24]/50 focus:bg-[#d97706]/5 transition-all shadow-inner" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'sensors' && (
            <div className="space-y-6">
              <h2 className="font-display font-semibold text-white text-lg tracking-wide uppercase flex items-center gap-2 mb-6">
                <Cpu size={18} className="text-[#60a5fa]" /> Sensor Settings
              </h2>
              <div className="space-y-3">
                {[
                  { name: 'BME680', type: 'Temperature / Humidity / Pressure / VOC', status: 'Connected', rate: '10s', cal: 'Calibrated' },
                  { name: 'LIS3DH', type: 'Vibration / Accelerometer', status: 'Connected', rate: '200 Hz', cal: 'Calibrated' },
                  { name: 'INMP441', type: 'Microphone / Audio', status: 'Connected', rate: '44.1 kHz', cal: 'Calibrated' },
                  { name: 'Load Cell', type: 'Hive Weight', status: 'Connected', rate: '60s', cal: 'Calibrated' },
                  { name: 'Camera', type: 'Visual Monitoring', status: 'Connected', rate: '1/5s', cal: 'N/A' },
                ].map(s => (
                  <div key={s.name} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl glass-panel border border-white/10 hover:border-white/20 transition-all gap-4">
                    <div>
                      <div className="flex items-center gap-2.5">
                        <span className="text-sm font-bold text-white">{s.name}</span>
                        <span className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase text-[#4ade80] bg-[#4ade80]/10 border border-[#4ade80]/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] live-dot" />{s.status}
                        </span>
                      </div>
                      <div className="text-white/50 text-xs mt-1.5 font-medium">{s.type}</div>
                    </div>
                    <div className="sm:text-right text-xs bg-black/20 px-3 py-2 rounded-xl border border-white/5">
                      <div className="text-white font-mono-data font-medium">{s.rate}</div>
                      <div className="text-[#fbbf24] text-[10px] mt-0.5">{s.cal}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'alerts' && (
            <div className="space-y-6">
              <h2 className="font-display font-semibold text-white text-lg tracking-wide uppercase flex items-center gap-2">
                <Bell size={18} className="text-[#fbbf24]" /> Alert Thresholds
              </h2>
              <p className="text-white/50 text-sm">Configure when AI and system alerts are triggered for each hardware metric.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                <div className="space-y-8 glass-panel p-6 rounded-2xl border border-white/10">
                  <h3 className="text-xs font-bold text-white/40 uppercase tracking-wider mb-2">Climate & Environment</h3>
                  <RangeInput label="Min Temperature" min={25} max={34} value={thresholds.tempMin} unit="°C"
                    onChange={v => setThresholds(t => ({ ...t, tempMin: v }))} />
                  <RangeInput label="Max Temperature" min={34} max={42} value={thresholds.tempMax} unit="°C"
                    onChange={v => setThresholds(t => ({ ...t, tempMax: v }))} />
                  <RangeInput label="Min Humidity" min={30} max={60} value={thresholds.humidMin} unit="%"
                    onChange={v => setThresholds(t => ({ ...t, humidMin: v }))} />
                  <RangeInput label="Max Humidity" min={60} max={90} value={thresholds.humidMax} unit="%"
                    onChange={v => setThresholds(t => ({ ...t, humidMax: v }))} />
                </div>
                
                <div className="space-y-8 glass-panel p-6 rounded-2xl border border-white/10">
                   <h3 className="text-xs font-bold text-white/40 uppercase tracking-wider mb-2">Colony & Structure</h3>
                  <RangeInput label="Weight Change Threshold" min={0.5} max={5} value={thresholds.weightChange} unit=" kg"
                    onChange={v => setThresholds(t => ({ ...t, weightChange: v }))} />
                  <RangeInput label="Max Buzzing Intensity" min={60} max={100} value={thresholds.buzzingMax} unit=" dB"
                    onChange={v => setThresholds(t => ({ ...t, buzzingMax: v }))} />
                  <RangeInput label="Max Vibration Threshold" min={0.1} max={1} value={thresholds.vibrationMax} unit=" g"
                    onChange={v => setThresholds(t => ({ ...t, vibrationMax: v }))} />
                </div>
              </div>
            </div>
          )}

          {tab === 'notifications' && (
            <div className="space-y-6">
              <h2 className="font-display font-semibold text-white text-lg tracking-wide uppercase flex items-center gap-2 mb-6">
                <Bell size={18} className="text-[#38bdf8]" /> Notification Settings
              </h2>
              <div className="space-y-3">
                {[
                  { key: 'email' as const, label: 'Email Alerts', desc: 'Receive alert emails at disha@apiary.com' },
                  { key: 'sms' as const, label: 'SMS Alerts', desc: 'Text message alerts for critical events' },
                  { key: 'push' as const, label: 'Push Notifications', desc: 'Browser and mobile push notifications' },
                  { key: 'dashboard' as const, label: 'Dashboard Alerts', desc: 'In-app notification center and badges' },
                ].map(n => (
                  <div key={n.key} className="flex items-center justify-between p-4 rounded-2xl glass-panel border border-white/10 hover:border-white/20 transition-all">
                    <div>
                      <div className="text-sm font-semibold text-white mb-0.5">{n.label}</div>
                      <div className="text-white/50 text-xs">{n.desc}</div>
                    </div>
                    <Toggle checked={notifs[n.key]} onChange={v => setNotifs(p => ({ ...p, [n.key]: v }))} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'ai' && (
            <div className="space-y-6">
              <h2 className="font-display font-semibold text-white text-lg tracking-wide uppercase flex items-center gap-2 ai-glow-text mb-6">
                <Sliders size={18} className="text-[#a78bfa]" /> AI Settings
              </h2>
              <div className="space-y-3">
                {[
                  { key: 'autoAnalysis' as const, label: 'Automatic AI Analysis', desc: 'Run AI analysis automatically on new data' },
                  { key: 'swarmDetection' as const, label: 'Swarming Detection', desc: 'AI-powered swarming risk estimation' },
                  { key: 'queenDetection' as const, label: 'Queen Status Detection', desc: 'Detect possible queenlessness patterns' },
                  { key: 'diseaseDetection' as const, label: 'Disease Pattern Detection', desc: 'Monitor for abnormal behavioral patterns' },
                ].map(a => (
                  <div key={a.key} className="flex items-center justify-between p-4 rounded-2xl glass-panel border border-[#7c3aed]/10 hover:border-[#7c3aed]/30 transition-all bg-[#7c3aed]/5">
                    <div>
                      <div className="text-sm font-semibold text-white mb-0.5">{a.label}</div>
                      <div className="text-white/60 text-xs">{a.desc}</div>
                    </div>
                    <Toggle checked={aiSettings[a.key]} onChange={v => setAiSettings(p => ({ ...p, [a.key]: v }))} />
                  </div>
                ))}
              </div>
              <div className="pt-6 mt-6 border-t border-white/10">
                <RangeInput label="Minimum AI Confidence Threshold" min={50} max={99} value={aiSettings.confidence} unit="%"
                  onChange={v => setAiSettings(p => ({ ...p, confidence: v }))} />
                <p className="text-[#fbbf24] text-xs font-medium mt-3 bg-[#fbbf24]/10 p-3 rounded-xl border border-[#fbbf24]/20">
                  ⚠️ Alerts are only triggered when AI confidence exceeds this threshold.
                </p>
              </div>
            </div>
          )}

          {tab === 'system' && (
            <div className="space-y-6">
              <h2 className="font-display font-semibold text-white text-lg tracking-wide uppercase flex items-center gap-2 mb-6">
                <Shield size={18} className="text-[#16a34a]" /> System Settings
              </h2>
              
              <div className="p-6 glass-panel rounded-2xl border border-white/10 space-y-4">
                <div className="flex items-center gap-3 mb-4 border-b border-white/10 pb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#16a34a]/20 flex items-center justify-center border border-[#16a34a]/30">
                    <Server size={20} className="text-[#4ade80]" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">NVIDIA Jetson Nano</div>
                    <div className="text-xs text-[#4ade80] font-medium tracking-wide uppercase mt-0.5 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] live-dot"/> Edge AI Node
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                  {[
                    { label: 'Device Status', value: '🟢 Online' },
                    { label: 'CPU Usage', value: '42%' },
                    { label: 'GPU Usage', value: '38%' },
                    { label: 'Memory', value: '61% used (3.8 / 4 GB)' },
                    { label: 'Temperature', value: '48°C' },
                    { label: 'Uptime', value: '4 days, 12 hours' },
                    { label: 'Firmware', value: 'HiveSense OS v2.4.1' },
                    { label: 'Last Sync', value: '10 seconds ago' },
                  ].map(r => (
                    <div key={r.label} className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                      <span className="text-white/50">{r.label}</span>
                      <span className="font-mono-data font-semibold text-white">{r.value}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/20 bg-black/20 text-sm font-semibold text-white hover:border-[#fbbf24]/50 hover:bg-[#fbbf24]/10 transition-all shadow-inner">
                  <Wifi size={16} className="text-[#fbbf24]"/> Check Connection
                </button>
                <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/20 bg-black/20 text-sm font-semibold text-white hover:border-[#4ade80]/50 hover:bg-[#4ade80]/10 transition-all shadow-inner">
                  <Cpu size={16} className="text-[#4ade80]"/> Force Sync
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
