import { useState } from 'react'
import { User, Bell, Cpu, Shield, Sliders, Wifi, Save, CheckCircle2 } from 'lucide-react'

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${checked ? 'bg-[#d97706]' : 'bg-[#d4cfc7]'}`}>
      <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-[18px]' : 'translate-x-[2px]'}`} />
    </button>
  )
}

function RangeInput({ label, min, max, value, unit, onChange }: { label: string; min: number; max: number; value: number; unit: string; onChange: (v: number) => void }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs">
        <span className="text-[#78716c]">{label}</span>
        <span className="font-mono-data font-medium text-[#1c1917]">{value}{unit}</span>
      </div>
      <input type="range" min={min} max={max} value={value} onChange={e => onChange(Number(e.target.value))}
        className="w-full h-1.5 rounded-full bg-[#e8e3db] appearance-none cursor-pointer" />
      <div className="flex justify-between text-[10px] text-[#a09890]">
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
    <div className="p-4 lg:p-6 max-w-[1200px] space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-[#1c1917]">Settings</h1>
          <p className="text-[#78716c] text-sm mt-1">Manage your account, hives, and preferences.</p>
        </div>
        <button onClick={handleSave}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${saved ? 'bg-[#16a34a] text-white' : 'bg-[#d97706] hover:bg-[#b45309] text-white'}`}>
          {saved ? <><CheckCircle2 size={14} /> Saved!</> : <><Save size={14} /> Save Changes</>}
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-6">
        {/* Sidebar tabs */}
        <div className="sm:w-44 flex-shrink-0">
          <nav className="space-y-0.5">
            {settingsTabs.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setTab(id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left text-xs font-medium transition-all
                  ${tab === id ? 'bg-[#d97706]/10 text-[#d97706] border border-[#d97706]/20' : 'text-[#78716c] hover:text-[#1c1917] hover:bg-[#f7f5f0]'}`}>
                <Icon size={14} />
                {label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 bg-white rounded-2xl border border-[#e8e3db] p-5">
          {tab === 'profile' && (
            <div className="space-y-5">
              <h2 className="font-display font-semibold text-[#1c1917] text-base">Profile & Account</h2>
              <div className="flex items-center gap-4 pb-4 border-b border-[#f0ede8]">
                <div className="w-16 h-16 rounded-2xl bg-[#d97706]/12 flex items-center justify-center">
                  <User size={24} className="text-[#d97706]" />
                </div>
                <div>
                  <div className="font-display font-semibold text-[#1c1917]">Disha Patel</div>
                  <div className="text-[#78716c] text-sm">disha@apiary.com</div>
                  <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#d97706]/10 text-[#d97706] border border-[#d97706]/20">Pro Account</span>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: 'Full Name', value: 'Disha Patel', type: 'text' },
                  { label: 'Email Address', value: 'disha@apiary.com', type: 'email' },
                  { label: 'Organization', value: 'Patel Apiaries', type: 'text' },
                  { label: 'Location', value: 'Gujarat, India', type: 'text' },
                ].map(f => (
                  <div key={f.label}>
                    <label className="block text-xs font-medium text-[#1c1917] mb-1.5">{f.label}</label>
                    <input type={f.type} defaultValue={f.value}
                      className="w-full px-3 py-2 rounded-xl border border-[#e8e3db] bg-white text-sm text-[#1c1917] outline-none focus:border-[#d97706] transition-colors" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'sensors' && (
            <div className="space-y-4">
              <h2 className="font-display font-semibold text-[#1c1917] text-base">Sensor Settings</h2>
              <div className="space-y-3">
                {[
                  { name: 'BME680', type: 'Temperature / Humidity / Pressure / VOC', status: 'Connected', rate: '10s', cal: 'Calibrated' },
                  { name: 'LIS3DH', type: 'Vibration / Accelerometer', status: 'Connected', rate: '200 Hz', cal: 'Calibrated' },
                  { name: 'INMP441', type: 'Microphone / Audio', status: 'Connected', rate: '44.1 kHz', cal: 'Calibrated' },
                  { name: 'Load Cell', type: 'Hive Weight', status: 'Connected', rate: '60s', cal: 'Calibrated' },
                  { name: 'Camera', type: 'Visual Monitoring', status: 'Connected', rate: '1/5s', cal: 'N/A' },
                ].map(s => (
                  <div key={s.name} className="flex items-center justify-between p-3.5 rounded-xl border border-[#e8e3db] hover:bg-[#f7f5f0] transition-colors">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-[#1c1917]">{s.name}</span>
                        <span className="flex items-center gap-1 text-[10px] font-medium text-[#16a34a]">
                          <span className="w-1 h-1 rounded-full bg-[#16a34a]" />{s.status}
                        </span>
                      </div>
                      <div className="text-[#78716c] text-xs mt-0.5">{s.type}</div>
                    </div>
                    <div className="text-right text-xs">
                      <div className="text-[#1c1917] font-medium">{s.rate}</div>
                      <div className="text-[#78716c] text-[10px]">{s.cal}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'alerts' && (
            <div className="space-y-5">
              <h2 className="font-display font-semibold text-[#1c1917] text-base">Alert Thresholds</h2>
              <p className="text-[#78716c] text-xs">Configure when alerts are triggered for each sensor metric.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <RangeInput label="Min Temperature" min={25} max={34} value={thresholds.tempMin} unit="°C"
                    onChange={v => setThresholds(t => ({ ...t, tempMin: v }))} />
                  <RangeInput label="Max Temperature" min={34} max={42} value={thresholds.tempMax} unit="°C"
                    onChange={v => setThresholds(t => ({ ...t, tempMax: v }))} />
                  <RangeInput label="Min Humidity" min={30} max={60} value={thresholds.humidMin} unit="%"
                    onChange={v => setThresholds(t => ({ ...t, humidMin: v }))} />
                  <RangeInput label="Max Humidity" min={60} max={90} value={thresholds.humidMax} unit="%"
                    onChange={v => setThresholds(t => ({ ...t, humidMax: v }))} />
                </div>
                <div className="space-y-4">
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
            <div className="space-y-5">
              <h2 className="font-display font-semibold text-[#1c1917] text-base">Notification Settings</h2>
              <div className="space-y-3">
                {[
                  { key: 'email' as const, label: 'Email Alerts', desc: 'Receive alert emails at disha@apiary.com' },
                  { key: 'sms' as const, label: 'SMS Alerts', desc: 'Text message alerts for critical events' },
                  { key: 'push' as const, label: 'Push Notifications', desc: 'Browser and mobile push notifications' },
                  { key: 'dashboard' as const, label: 'Dashboard Alerts', desc: 'In-app notification center and badges' },
                ].map(n => (
                  <div key={n.key} className="flex items-center justify-between p-3.5 rounded-xl border border-[#e8e3db]">
                    <div>
                      <div className="text-sm font-medium text-[#1c1917]">{n.label}</div>
                      <div className="text-[#78716c] text-xs mt-0.5">{n.desc}</div>
                    </div>
                    <Toggle checked={notifs[n.key]} onChange={v => setNotifs(p => ({ ...p, [n.key]: v }))} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'ai' && (
            <div className="space-y-5">
              <h2 className="font-display font-semibold text-[#1c1917] text-base">AI Settings</h2>
              <div className="space-y-3">
                {[
                  { key: 'autoAnalysis' as const, label: 'Automatic AI Analysis', desc: 'Run AI analysis automatically on new data' },
                  { key: 'swarmDetection' as const, label: 'Swarming Detection', desc: 'AI-powered swarming risk estimation' },
                  { key: 'queenDetection' as const, label: 'Queen Status Detection', desc: 'Detect possible queenlessness patterns' },
                  { key: 'diseaseDetection' as const, label: 'Disease Pattern Detection', desc: 'Monitor for abnormal behavioral patterns' },
                ].map(a => (
                  <div key={a.key} className="flex items-center justify-between p-3.5 rounded-xl border border-[#e8e3db]">
                    <div>
                      <div className="text-sm font-medium text-[#1c1917]">{a.label}</div>
                      <div className="text-[#78716c] text-xs mt-0.5">{a.desc}</div>
                    </div>
                    <Toggle checked={aiSettings[a.key]} onChange={v => setAiSettings(p => ({ ...p, [a.key]: v }))} />
                  </div>
                ))}
              </div>
              <div className="pt-2">
                <RangeInput label="Minimum AI Confidence Threshold" min={50} max={99} value={aiSettings.confidence} unit="%"
                  onChange={v => setAiSettings(p => ({ ...p, confidence: v }))} />
                <p className="text-[#78716c] text-[11px] mt-1.5">Alerts are only triggered when AI confidence exceeds this threshold.</p>
              </div>
            </div>
          )}

          {tab === 'system' && (
            <div className="space-y-5">
              <h2 className="font-display font-semibold text-[#1c1917] text-base">System Settings</h2>
              <div className="p-4 bg-[#f7f5f0] rounded-xl border border-[#e8e3db] space-y-3">
                <div className="text-xs font-medium text-[#1c1917] mb-2">NVIDIA Jetson Nano — Edge AI Device</div>
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
                  <div key={r.label} className="flex justify-between text-xs border-b border-[#e8e3db] pb-2 last:border-0 last:pb-0">
                    <span className="text-[#78716c]">{r.label}</span>
                    <span className="font-mono-data font-medium text-[#1c1917]">{r.value}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <button className="flex items-center gap-2 px-3 py-2 rounded-xl border border-[#e8e3db] bg-white text-xs text-[#78716c] hover:border-[#d97706]/40 transition-colors">
                  <Wifi size={13} /> Check Connection
                </button>
                <button className="flex items-center gap-2 px-3 py-2 rounded-xl border border-[#e8e3db] bg-white text-xs text-[#78716c] hover:border-[#d97706]/40 transition-colors">
                  Force Sync
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
