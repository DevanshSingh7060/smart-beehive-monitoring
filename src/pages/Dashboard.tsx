import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts'
import {
  Thermometer, Droplets, Weight, Activity, Volume2, Wind,
  Gauge, BrainCircuit, AlertTriangle, CheckCircle2, XCircle,
  TrendingUp, TrendingDown, Minus, ChevronRight, Zap, Grid3x3,
} from 'lucide-react'
import {
  hives, temperatureHistory, humidityHistory, weightHistory,
  activityHistory, alerts,
} from '../data/mockData'

function KpiCard({ label, value, unit, sub, trend, icon: Icon, color = '#d97706' }: {
  label: string; value: string | number; unit?: string; sub?: string;
  trend?: { dir: 'up' | 'down' | 'flat'; text: string }; icon: React.ElementType; color?: string
}) {
  const TrendIcon = trend?.dir === 'up' ? TrendingUp : trend?.dir === 'down' ? TrendingDown : Minus
  const trendColor = trend?.dir === 'up' ? '#16a34a' : trend?.dir === 'down' ? '#dc2626' : '#78716c'
  return (
    <div className="bg-white rounded-2xl border border-[#e8e3db] p-5 hover:border-[#d97706]/30 hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between mb-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color}15` }}>
          <Icon size={16} style={{ color }} />
        </div>
        {trend && (
          <div className="flex items-center gap-1" style={{ color: trendColor }}>
            <TrendIcon size={12} />
            <span className="text-xs font-medium">{trend.text}</span>
          </div>
        )}
      </div>
      <div className="flex items-end gap-1 mb-1">
        <span className="font-mono-data text-2xl font-medium text-[#1c1917]">{value}</span>
        {unit && <span className="text-[#78716c] text-sm mb-0.5">{unit}</span>}
      </div>
      <div className="text-[#1c1917] text-xs font-medium">{label}</div>
      {sub && <div className="text-[#78716c] text-[11px] mt-0.5">{sub}</div>}
    </div>
  )
}

function HealthRing({ score, size = 64 }: { score: number; size?: number }) {
  const r = size / 2 - 6
  const c = 2 * Math.PI * r
  const filled = (score / 100) * c
  const color = score >= 90 ? '#16a34a' : score >= 75 ? '#d97706' : score >= 50 ? '#f59e0b' : '#dc2626'
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#f0ede8" strokeWidth="5" />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="5"
        strokeDasharray={`${filled} ${c}`} strokeLinecap="round" />
    </svg>
  )
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { color: string; bg: string; label: string }> = {
    healthy: { color: '#16a34a', bg: '#f0fdf4', label: 'Healthy' },
    attention: { color: '#d97706', bg: '#fffbeb', label: 'Attention' },
    warning: { color: '#d97706', bg: '#fffbeb', label: 'Monitor' },
    critical: { color: '#dc2626', bg: '#fef2f2', label: 'Critical' },
  }
  const s = map[status] ?? map.healthy
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium border"
      style={{ color: s.color, backgroundColor: s.bg, borderColor: `${s.color}30` }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: s.color }} />
      {s.label}
    </span>
  )
}

const sensorData = [
  { label: 'Temperature', value: '34.2', unit: '°C', status: 'Normal', trend: '↑ 0.4°C', icon: Thermometer, color: '#d97706', data: temperatureHistory },
  { label: 'Humidity', value: '62', unit: '%', status: 'Optimal', trend: '↓ 2%', icon: Droplets, color: '#2563eb', data: humidityHistory },
  { label: 'Hive Weight', value: '42.8', unit: 'kg', status: 'Normal', trend: '↑ 1.2 kg', icon: Weight, color: '#7c3aed', data: weightHistory.map(d => ({ time: d.date, value: d.value })) },
  { label: 'Bee Activity', value: '87', unit: '%', status: 'High', trend: 'Active', icon: Activity, color: '#16a34a', data: activityHistory.map(d => ({ time: d.time, value: d.value })) },
  { label: 'Buzzing', value: '67', unit: 'dB', status: 'Normal', trend: 'Stable', icon: Volume2, color: '#0891b2', data: [] },
  { label: 'Vibration', value: '0.13', unit: 'g', status: 'Normal', trend: 'Stable', icon: Activity, color: '#78716c', data: [] },
  { label: 'Air Quality', value: 'Good', unit: '', status: 'VOC: 78', trend: 'Stable', icon: Wind, color: '#16a34a', data: [] },
  { label: 'Pressure', value: '1008', unit: 'hPa', status: 'Normal', trend: 'Stable', icon: Gauge, color: '#d97706', data: [] },
]

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#1c1917] text-white px-3 py-2 rounded-lg text-xs shadow-xl">
      <div className="text-white/50 mb-1">{label}</div>
      <div className="font-mono-data font-medium">{payload[0].value}{payload[0].unit ?? ''}</div>
    </div>
  )
}

export default function Dashboard() {
  const [envTab, setEnvTab] = useState('Temperature')
  const [timeRange, setTimeRange] = useState('24H')
  const navigate = useNavigate()

  const envData = {
    Temperature: temperatureHistory,
    Humidity: humidityHistory,
    Pressure: [],
    'Air Quality': [],
  }
  const envColor: Record<string, string> = {
    Temperature: '#d97706', Humidity: '#2563eb', Pressure: '#7c3aed', 'Air Quality': '#16a34a',
  }

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-[1600px]">
      {/* Welcome header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-[#1c1917]">Good Morning, Disha</h1>
          <p className="text-[#78716c] text-sm mt-1">Here&apos;s what&apos;s happening across your apiary today.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-[11px]">
          <div className="flex items-center gap-1.5 text-[#78716c] bg-white border border-[#e8e3db] px-3 py-1.5 rounded-lg">
            <span>Fri, 8 Aug 2026</span>
          </div>
          <div className="flex items-center gap-1.5 bg-[#16a34a]/8 border border-[#16a34a]/20 text-[#16a34a] px-3 py-1.5 rounded-lg font-medium">
            <span className="w-1.5 h-1.5 bg-[#16a34a] rounded-full live-dot" />
            All Systems Operational
          </div>
          <div className="text-[#78716c] bg-white border border-[#e8e3db] px-3 py-1.5 rounded-lg">
            Synced 10s ago
          </div>
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        <KpiCard label="Total Hives" value={12} sub="10 healthy · 2 alerts" icon={Grid3x3} trend={{ dir: 'flat', text: 'Stable' }} />
        <KpiCard label="Healthy Hives" value={10} sub="83% of apiary" icon={CheckCircle2} color="#16a34a" trend={{ dir: 'flat', text: 'Stable' }} />
        <KpiCard label="Active Alerts" value={2} sub="1 critical, 1 warning" icon={AlertTriangle} color="#dc2626" trend={{ dir: 'up', text: '+1 today' }} />
        <KpiCard label="Avg Weight" value="42.8" unit="kg" sub="+1.8% this week" icon={Weight} color="#7c3aed" trend={{ dir: 'up', text: '+1.8%' }} />
        <KpiCard label="Avg Temperature" value="34.2" unit="°C" sub="Within normal range" icon={Thermometer} color="#d97706" trend={{ dir: 'up', text: '+0.4°C' }} />
        <KpiCard label="Avg Humidity" value="62" unit="%" sub="Optimal" icon={Droplets} color="#2563eb" trend={{ dir: 'down', text: '-2%' }} />
      </div>

      {/* Hive health overview */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display font-semibold text-[#1c1917] text-base">Hive Health Overview</h2>
          <button onClick={() => navigate('/hives')} className="text-[#d97706] text-xs font-medium flex items-center gap-1 hover:text-[#b45309]">
            View all hives <ChevronRight size={13} />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
          {hives.map(h => (
            <div key={h.id} className="bg-white rounded-2xl border border-[#e8e3db] p-4 hover:border-[#d97706]/30 hover:shadow-md transition-all duration-200 cursor-pointer"
              onClick={() => navigate(`/hives/${h.id}`)}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="font-display font-semibold text-[#1c1917] text-sm">{h.name}</div>
                  <div className="text-[#78716c] text-[11px] mt-0.5">{h.location}</div>
                </div>
                <StatusBadge status={h.status} />
              </div>
              <div className="flex items-center gap-3 mb-3">
                <div className="relative">
                  <HealthRing score={h.healthScore} size={56} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-mono-data text-[13px] font-medium text-[#1c1917]">{h.healthScore}</span>
                  </div>
                </div>
                <div className="flex-1 space-y-1.5">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-[#78716c]">Temp</span>
                    <span className="font-mono-data font-medium text-[#1c1917]">{h.temperature}°C</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-[#78716c]">Humidity</span>
                    <span className="font-mono-data font-medium text-[#1c1917]">{h.humidity}%</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-[#78716c]">Weight</span>
                    <span className="font-mono-data font-medium text-[#1c1917]">{h.weight} kg</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-[#78716c]">Activity:</span>
                  <span className="text-[11px] font-medium" style={{ color: h.beeActivity === 'High' || h.beeActivity === 'Very High' ? '#d97706' : '#16a34a' }}>{h.beeActivity}</span>
                </div>
                <span className="text-[#a09890] text-[10px]">Updated {h.lastUpdated}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Environmental Trends chart */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-[#e8e3db] p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <h2 className="font-display font-semibold text-[#1c1917] text-base">Environmental Conditions</h2>
            <div className="flex items-center gap-2">
              <div className="flex bg-[#f7f5f0] rounded-lg p-0.5 border border-[#e8e3db]">
                {['24H', '7D', '30D', '90D'].map(r => (
                  <button key={r} onClick={() => setTimeRange(r)}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${timeRange === r ? 'bg-white text-[#1c1917] shadow-sm' : 'text-[#78716c]'}`}>
                    {r}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="flex gap-1 mb-4">
            {Object.keys(envData).map(tab => (
              <button key={tab} onClick={() => setEnvTab(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${envTab === tab ? 'text-white shadow-sm' : 'text-[#78716c] hover:text-[#1c1917]'}`}
                style={envTab === tab ? { backgroundColor: envColor[tab] } : {}}>
                {tab}
              </button>
            ))}
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={envData[envTab as keyof typeof envData].length ? envData[envTab as keyof typeof envData] : temperatureHistory}>
              <defs>
                <linearGradient id="envGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={envColor[envTab]} stopOpacity={0.15} />
                  <stop offset="95%" stopColor={envColor[envTab]} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0ede8" />
              <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#a09890' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#a09890' }} axisLine={false} tickLine={false} width={32} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="value" stroke={envColor[envTab]} strokeWidth={2}
                fill="url(#envGrad)" dot={false} activeDot={{ r: 4, fill: envColor[envTab] }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* AI Assessment */}
        <div className="bg-[#1c1917] rounded-2xl p-5 flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-xl bg-[#d97706]/20 flex items-center justify-center">
              <BrainCircuit size={15} className="text-[#d97706]" />
            </div>
            <div>
              <div className="font-display font-semibold text-white text-sm">AI Health Assessment</div>
              <div className="text-white/40 text-[10px]">Hive A-01 · Confidence 96%</div>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-4 p-3 bg-white/5 rounded-xl border border-white/8">
            <div className="relative">
              <HealthRing score={94} size={64} />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-mono-data text-[15px] font-medium text-white">94</span>
              </div>
            </div>
            <div>
              <div className="text-[#16a34a] font-display font-semibold text-lg">Healthy</div>
              <div className="text-white/50 text-xs">Overall hive status</div>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="w-1.5 h-1.5 bg-[#d97706] rounded-full" />
                <span className="text-[#d97706] text-[11px]">AI Confidence: 96%</span>
              </div>
            </div>
          </div>

          <p className="text-white/60 text-xs leading-relaxed mb-4 flex-1">
            Your hive is showing healthy environmental conditions and normal activity patterns. Temperature and humidity are within expected range, and hive weight has increased steadily over the past 7 days.
          </p>

          <button onClick={() => navigate('/ai')} className="w-full flex items-center justify-center gap-2 bg-[#d97706] hover:bg-[#b45309] text-white text-xs font-medium py-2.5 rounded-xl transition-colors">
            View AI Analysis <ChevronRight size={13} />
          </button>
        </div>
      </div>

      {/* Sensor grid + alerts row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Sensor cards */}
        <div className="xl:col-span-2">
          <h2 className="font-display font-semibold text-[#1c1917] text-base mb-3">Real-Time Sensor Monitoring</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {sensorData.map(s => (
              <div key={s.label} className="bg-white rounded-xl border border-[#e8e3db] p-3.5 hover:border-[#d97706]/30 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <s.icon size={14} style={{ color: s.color }} />
                  <span className="text-[10px] text-[#78716c]">{s.status}</span>
                </div>
                <div className="font-mono-data text-xl font-medium text-[#1c1917]">
                  {s.value}<span className="text-[#78716c] text-sm font-normal ml-0.5">{s.unit}</span>
                </div>
                <div className="text-[#1c1917] text-[11px] font-medium mt-0.5">{s.label}</div>
                <div className="text-[#a09890] text-[10px] mt-0.5">{s.trend}</div>
                {s.data.length > 0 && (
                  <div className="mt-2 -mx-0.5">
                    <ResponsiveContainer width="100%" height={32}>
                      <LineChart data={s.data}>
                        <Line type="monotone" dataKey="value" stroke={s.color} strokeWidth={1.5} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Recent Alerts */}
        <div className="bg-white rounded-2xl border border-[#e8e3db] p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-[#1c1917] text-base">Recent Alerts</h2>
            <button onClick={() => navigate('/alerts')} className="text-[#d97706] text-xs font-medium hover:text-[#b45309]">View all</button>
          </div>
          <div className="space-y-3">
            {alerts.slice(0, 4).map(a => {
              const isC = a.severity === 'critical'
              const isI = a.severity === 'info'
              const col = isC ? '#dc2626' : isI ? '#2563eb' : '#d97706'
              const bg = isC ? '#fef2f2' : isI ? '#eff6ff' : '#fffbeb'
              return (
                <div key={a.id} className="flex gap-3 p-3 rounded-xl border transition-colors cursor-pointer hover:border-[#d97706]/30"
                  style={{ borderColor: `${col}20`, backgroundColor: bg }}>
                  <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: col }} />
                  <div className="flex-1 min-w-0">
                    <div className="text-[#1c1917] text-xs font-medium leading-snug">{a.type}</div>
                    <div className="text-[11px] mt-0.5" style={{ color: col }}>{a.hive}</div>
                    <div className="text-[#a09890] text-[10px] mt-0.5">{a.time} · {a.status}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Bee Activity + Weight chart */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-[#e8e3db] p-5">
          <div className="flex items-center justify-between mb-1">
            <h2 className="font-display font-semibold text-[#1c1917] text-base">Bee Activity</h2>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-[#16a34a] rounded-full live-dot" />
              <span className="text-[#16a34a] text-[11px] font-medium">HIGH</span>
            </div>
          </div>
          <div className="flex gap-4 mb-4">
            <div><div className="font-mono-data text-xl font-medium text-[#1c1917]">124</div><div className="text-[#78716c] text-[11px]">Bees Detected</div></div>
            <div><div className="font-mono-data text-xl font-medium text-[#1c1917]">87<span className="text-sm">%</span></div><div className="text-[#78716c] text-[11px]">Activity Score</div></div>
            <div><div className="font-mono-data text-xl font-medium text-[#1c1917]">67<span className="text-sm">dB</span></div><div className="text-[#78716c] text-[11px]">Buzzing</div></div>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={activityHistory}>
              <defs>
                <linearGradient id="actGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#16a34a" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0ede8" />
              <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#a09890' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#a09890' }} axisLine={false} tickLine={false} width={28} domain={[0, 100]} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="value" stroke="#16a34a" strokeWidth={2} fill="url(#actGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl border border-[#e8e3db] p-5">
          <div className="flex items-center justify-between mb-1">
            <h2 className="font-display font-semibold text-[#1c1917] text-base">Hive Weight & Productivity</h2>
            <div className="flex items-center gap-1 text-[#16a34a] text-xs font-medium">
              <TrendingUp size={13} /> +1.8%
            </div>
          </div>
          <div className="flex gap-4 mb-4">
            <div><div className="font-mono-data text-xl font-medium text-[#1c1917]">42.8<span className="text-sm"> kg</span></div><div className="text-[#78716c] text-[11px]">Current Weight</div></div>
            <div><div className="font-mono-data text-xl font-medium text-[#16a34a]">+1.2<span className="text-sm"> kg</span></div><div className="text-[#78716c] text-[11px]">This Week</div></div>
            <div><div className="font-mono-data text-xl font-medium text-[#d97706]">+0.9<span className="text-sm"> kg</span></div><div className="text-[#78716c] text-[11px]">Est. Honey Gain</div></div>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={weightHistory}>
              <defs>
                <linearGradient id="wGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.12} />
                  <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0ede8" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#a09890' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#a09890' }} axisLine={false} tickLine={false} width={36} domain={[40, 44]} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="value" stroke="#7c3aed" strokeWidth={2} fill="url(#wGrad)" dot={{ r: 3, fill: '#7c3aed' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
