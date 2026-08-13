import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { ArrowLeft, RefreshCw, Download, Settings, Thermometer, Droplets, Gauge, Wind, Weight, Activity, Volume2, Cpu, Server, Wifi, Zap, ChevronRight, BrainCircuit } from 'lucide-react'
import { hives, temperatureHistory, humidityHistory, weightHistory, buzzingHistory, vibrationHistory } from '../data/mockData'

function HealthRing({ score, size = 80 }: { score: number; size?: number }) {
  const r = size / 2 - 7
  const c = 2 * Math.PI * r
  const filled = (score / 100) * c
  const color = score >= 90 ? '#16a34a' : score >= 75 ? '#d97706' : score >= 50 ? '#f59e0b' : '#dc2626'
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#f0ede8" strokeWidth="6" />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="6"
        strokeDasharray={`${filled} ${c}`} strokeLinecap="round" />
    </svg>
  )
}

function ScoreBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1.5">
        <span className="text-[#78716c]">{label}</span>
        <span className="font-mono-data font-medium text-[#1c1917]">{value}%</span>
      </div>
      <div className="h-1.5 bg-[#f0ede8] rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${value}%`, backgroundColor: color }} />
      </div>
    </div>
  )
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#1c1917] text-white px-3 py-2 rounded-lg text-xs shadow-xl">
      <div className="text-white/50 mb-1">{label}</div>
      <div className="font-mono-data font-medium">{payload[0].value}</div>
    </div>
  )
}

export default function HiveDetails() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const hive = hives.find(h => h.id === id) ?? hives[0]
  const [chartTab, setChartTab] = useState('Temperature')
  const [timeRange, setTimeRange] = useState('24H')

  const chartData: Record<string, any[]> = {
    Temperature: temperatureHistory,
    Humidity: humidityHistory,
    Weight: weightHistory.map(d => ({ time: d.date, value: d.value })),
    Buzzing: buzzingHistory,
    Vibration: vibrationHistory,
    'Air Quality': temperatureHistory.map(d => ({ time: d.time, value: Math.round(d.value * 2.1) })),
  }
  const chartColor: Record<string, string> = {
    Temperature: '#d97706', Humidity: '#2563eb', Weight: '#7c3aed',
    Buzzing: '#0891b2', Vibration: '#78716c', 'Air Quality': '#16a34a',
  }

  const isHealthy = hive.status === 'healthy'
  const statusColor = hive.status === 'critical' ? '#dc2626' : hive.status === 'attention' || hive.status === 'warning' ? '#d97706' : '#16a34a'

  return (
    <div className="p-4 lg:p-6 max-w-[1600px] space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <button onClick={() => navigate('/hives')} className="flex items-center gap-1.5 text-[#78716c] hover:text-[#1c1917] text-sm transition-colors">
          <ArrowLeft size={16} /> My Hives
        </button>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-display text-2xl font-semibold text-[#1c1917]">{hive.name}</h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border"
              style={{ color: statusColor, backgroundColor: `${statusColor}10`, borderColor: `${statusColor}25` }}>
              <span className="w-1.5 h-1.5 rounded-full live-dot" style={{ backgroundColor: statusColor }} />
              {hive.status === 'healthy' ? 'Healthy' : hive.status === 'critical' ? 'Critical' : 'Attention'}
            </span>
          </div>
          <p className="text-[#78716c] text-sm mt-0.5">{hive.location} · Updated {hive.lastUpdated}</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#e8e3db] bg-white text-xs text-[#78716c] hover:border-[#d97706]/40 transition-colors">
            <RefreshCw size={13} /> Refresh
          </button>
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#e8e3db] bg-white text-xs text-[#78716c] hover:border-[#d97706]/40 transition-colors">
            <Download size={13} /> Export
          </button>
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#d97706] hover:bg-[#b45309] text-white text-xs font-medium transition-colors">
            <Settings size={13} /> Settings
          </button>
        </div>
      </div>

      {/* Metric overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-8 gap-3">
        {[
          { label: 'Temperature', value: `${hive.temperature}°C`, icon: Thermometer, color: '#d97706' },
          { label: 'Humidity', value: `${hive.humidity}%`, icon: Droplets, color: '#2563eb' },
          { label: 'Pressure', value: `${hive.pressure} hPa`, icon: Gauge, color: '#7c3aed' },
          { label: 'Air Quality', value: hive.airQuality, icon: Wind, color: '#16a34a' },
          { label: 'Weight', value: `${hive.weight} kg`, icon: Weight, color: '#7c3aed' },
          { label: 'Vibration', value: `${hive.vibration} g`, icon: Activity, color: '#78716c' },
          { label: 'Buzzing', value: `${hive.buzzing} dB`, icon: Volume2, color: '#0891b2' },
          { label: 'Bee Activity', value: hive.beeActivity, icon: Activity, color: '#16a34a' },
        ].map(m => (
          <div key={m.label} className="bg-white rounded-xl border border-[#e8e3db] p-3 text-center">
            <m.icon size={14} className="mx-auto mb-1.5" style={{ color: m.color }} />
            <div className="font-mono-data text-sm font-medium text-[#1c1917]">{m.value}</div>
            <div className="text-[#78716c] text-[10px] mt-0.5">{m.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Health panel */}
        <div className="bg-white rounded-2xl border border-[#e8e3db] p-5">
          <h2 className="font-display font-semibold text-[#1c1917] text-base mb-4">Health Assessment</h2>
          <div className="flex items-center gap-4 mb-5">
            <div className="relative">
              <HealthRing score={hive.healthScore} size={80} />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-mono-data text-xl font-medium text-[#1c1917]">{hive.healthScore}</span>
                <span className="text-[#78716c] text-[10px]">/100</span>
              </div>
            </div>
            <div>
              <div className="font-display font-semibold text-lg" style={{ color: statusColor }}>
                {isHealthy ? 'Healthy' : hive.status === 'critical' ? 'Critical' : 'Attention'}
              </div>
              <div className="text-[#78716c] text-xs mt-0.5">Overall score</div>
              <div className="flex items-center gap-1.5 mt-1.5">
                <span className="w-1.5 h-1.5 bg-[#d97706] rounded-full" />
                <span className="text-[11px] text-[#78716c]">AI Confidence: 96%</span>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <ScoreBar label="Environmental Health" value={hive.envHealth} color="#d97706" />
            <ScoreBar label="Behavioral Health" value={hive.behavioralHealth} color="#2563eb" />
            <ScoreBar label="Productivity" value={hive.productivity} color="#16a34a" />
            <ScoreBar label="Stability" value={hive.stability} color="#7c3aed" />
          </div>
        </div>

        {/* Sensor charts */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-[#e8e3db] p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <h2 className="font-display font-semibold text-[#1c1917] text-base">Sensor History</h2>
            <div className="flex bg-[#f7f5f0] rounded-lg p-0.5 border border-[#e8e3db]">
              {['24H', '7D', '30D', '90D'].map(r => (
                <button key={r} onClick={() => setTimeRange(r)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${timeRange === r ? 'bg-white text-[#1c1917] shadow-sm' : 'text-[#78716c]'}`}>
                  {r}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5 mb-4">
            {Object.keys(chartData).map(tab => (
              <button key={tab} onClick={() => setChartTab(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${chartTab === tab ? 'text-white' : 'text-[#78716c] hover:text-[#1c1917] bg-[#f7f5f0]'}`}
                style={chartTab === tab ? { backgroundColor: chartColor[tab] } : {}}>
                {tab}
              </button>
            ))}
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData[chartTab]}>
              <defs>
                <linearGradient id="detGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartColor[chartTab]} stopOpacity={0.15} />
                  <stop offset="95%" stopColor={chartColor[chartTab]} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0ede8" />
              <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#a09890' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#a09890' }} axisLine={false} tickLine={false} width={36} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="value" stroke={chartColor[chartTab]} strokeWidth={2}
                fill="url(#detGrad)" dot={false} activeDot={{ r: 4 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* AI Behavioral Analysis */}
        <div className="bg-white rounded-2xl border border-[#e8e3db] p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-xl bg-[#d97706]/10 flex items-center justify-center">
              <BrainCircuit size={15} className="text-[#d97706]" />
            </div>
            <h2 className="font-display font-semibold text-[#1c1917] text-base">AI Behavioral Analysis</h2>
          </div>
          <div className="space-y-3 mb-4">
            {[
              { label: 'Bee Activity', value: 'Normal', color: '#16a34a' },
              { label: 'Swarming Risk', value: `Low — ${hive.swarmingRiskPct}%`, color: hive.swarmingRiskPct > 50 ? '#dc2626' : hive.swarmingRiskPct > 25 ? '#d97706' : '#16a34a' },
              { label: 'Queenlessness Risk', value: `Low — ${hive.queenlessRisk}%`, color: hive.queenlessRisk > 50 ? '#dc2626' : '#16a34a' },
              { label: 'Abnormal Behavior', value: 'Not Detected', color: '#16a34a' },
              { label: 'Disease Risk', value: `Low — ${hive.diseaseRisk}%`, color: hive.diseaseRisk > 30 ? '#d97706' : '#16a34a' },
              { label: 'Detection Confidence', value: '94%', color: '#d97706' },
            ].map(r => (
              <div key={r.label} className="flex items-center justify-between py-2 border-b border-[#f7f5f0] last:border-0">
                <span className="text-[#78716c] text-xs">{r.label}</span>
                <span className="text-xs font-medium" style={{ color: r.color }}>{r.value}</span>
              </div>
            ))}
          </div>
          <button className="w-full flex items-center justify-center gap-2 text-xs font-medium text-[#d97706] hover:text-[#b45309] py-2 border border-[#d97706]/30 rounded-xl hover:bg-[#d97706]/5 transition-all">
            View Detailed AI Analysis <ChevronRight size={13} />
          </button>
        </div>

        {/* Device Status */}
        <div className="bg-white rounded-2xl border border-[#e8e3db] p-5">
          <h2 className="font-display font-semibold text-[#1c1917] text-base mb-4">Device Status</h2>
          <div className="space-y-3 mb-4">
            {[
              { name: 'NVIDIA Jetson Nano', type: 'Edge AI', status: 'Online', icon: Cpu, extra: 'CPU 42% · GPU 38% · Mem 61%' },
              { name: 'BME680', type: 'Temperature / Humidity / Pressure / VOC', status: 'Connected', icon: Thermometer, extra: 'Last reading: 10s ago' },
              { name: 'LIS3DH', type: 'Vibration / Accelerometer', status: 'Connected', icon: Activity, extra: 'Sampling: 200 Hz' },
              { name: 'INMP441', type: 'Audio Microphone', status: 'Connected', icon: Volume2, extra: 'Sampling: 44.1 kHz' },
              { name: 'Load Cell', type: 'Hive Weight', status: 'Connected', icon: Weight, extra: 'Calibrated · ±0.1 kg' },
              { name: 'Camera', type: 'Visual Monitoring', status: 'Connected', icon: Server, extra: '1080p · 24 FPS' },
            ].map(d => (
              <div key={d.name} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#f7f5f0] transition-colors">
                <div className="w-8 h-8 rounded-lg bg-[#f7f5f0] flex items-center justify-center flex-shrink-0">
                  <d.icon size={14} className="text-[#78716c]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-[#1c1917]">{d.name}</span>
                    <span className="flex items-center gap-1 text-[10px] font-medium text-[#16a34a]">
                      <span className="w-1 h-1 rounded-full bg-[#16a34a]" /> {d.status}
                    </span>
                  </div>
                  <div className="text-[#a09890] text-[10px] mt-0.5">{d.extra}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between p-3 bg-[#f7f5f0] rounded-xl text-xs">
            <div className="flex items-center gap-1.5 text-[#78716c]"><Wifi size={12} /> Network: Online</div>
            <div className="text-[#78716c]">Uptime: 4d 12h</div>
            <div className="text-[#78716c]">Sync: 10s ago</div>
          </div>
        </div>
      </div>
    </div>
  )
}
