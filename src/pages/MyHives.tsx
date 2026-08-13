import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Plus, SlidersHorizontal, Thermometer, Droplets, Weight, Activity, ChevronRight } from 'lucide-react'
import { hives } from '../data/mockData'

function HealthRing({ score, size = 52 }: { score: number; size?: number }) {
  const r = size / 2 - 5
  const c = 2 * Math.PI * r
  const filled = (score / 100) * c
  const color = score >= 90 ? '#16a34a' : score >= 75 ? '#d97706' : score >= 50 ? '#f59e0b' : '#dc2626'
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#f0ede8" strokeWidth="4.5" />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="4.5"
        strokeDasharray={`${filled} ${c}`} strokeLinecap="round" />
    </svg>
  )
}

const statusConfig: Record<string, { color: string; bg: string; label: string }> = {
  healthy: { color: '#16a34a', bg: '#f0fdf4', label: 'Healthy' },
  attention: { color: '#d97706', bg: '#fffbeb', label: 'Attention' },
  warning: { color: '#d97706', bg: '#fffbeb', label: 'Monitor' },
  critical: { color: '#dc2626', bg: '#fef2f2', label: 'Critical' },
}

const allHives = [
  ...hives,
  {
    id: 'C01', name: 'Hive C-01', location: 'South Orchard', status: 'healthy',
    healthScore: 91, temperature: 33.8, humidity: 61, weight: 39.4,
    beeActivity: 'Normal', swarmingRisk: 'Low', queenStatus: 'Normal',
    lastUpdated: '30s ago', weightChange: +0.4, buzzing: 58, vibration: 0.09, pressure: 1009, airQuality: 'Good', vocIndex: 72,
    swarmingRiskPct: 7, queenlessRisk: 3, diseaseRisk: 5,
    envHealth: 93, behavioralHealth: 89, productivity: 91, stability: 94,
  },
  {
    id: 'C02', name: 'Hive C-02', location: 'West Meadow', status: 'critical',
    healthScore: 44, temperature: 28.1, humidity: 82, weight: 35.2,
    beeActivity: 'Low', swarmingRisk: 'Low', queenStatus: 'Unknown',
    lastUpdated: '2h ago', weightChange: -2.1, buzzing: 31, vibration: 0.06, pressure: 1006, airQuality: 'Poor', vocIndex: 156,
    swarmingRiskPct: 14, queenlessRisk: 68, diseaseRisk: 55,
    envHealth: 41, behavioralHealth: 38, productivity: 45, stability: 50,
  },
]

export default function MyHives() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('health')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const sorted = [...allHives]
    .filter(h => h.name.toLowerCase().includes(search.toLowerCase()) || h.location.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'health') return b.healthScore - a.healthScore
      if (sortBy === 'weight') return b.weight - a.weight
      if (sortBy === 'temperature') return b.temperature - a.temperature
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      return 0
    })

  return (
    <div className="p-4 lg:p-6 max-w-[1600px]">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-display text-2xl font-semibold text-[#1c1917]">My Hives</h1>
        <p className="text-[#78716c] text-sm mt-1">Monitor and manage all your connected beehives.</p>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a09890]" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search hives or locations…"
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#e8e3db] bg-white text-sm text-[#1c1917] placeholder:text-[#a09890] outline-none focus:border-[#d97706] transition-colors"
          />
        </div>
        <div className="flex items-center gap-2">
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="px-3 py-2 rounded-xl border border-[#e8e3db] bg-white text-sm text-[#1c1917] outline-none focus:border-[#d97706] transition-colors"
          >
            <option value="health">Sort: Health</option>
            <option value="weight">Sort: Weight</option>
            <option value="temperature">Sort: Temperature</option>
            <option value="name">Sort: Name</option>
          </select>
          <button className="flex items-center gap-2 px-3 py-2 rounded-xl border border-[#e8e3db] bg-white text-sm text-[#78716c] hover:border-[#d97706]/40 transition-colors">
            <SlidersHorizontal size={14} /> Filter
          </button>
          <button className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#d97706] hover:bg-[#b45309] text-white text-sm font-medium transition-colors">
            <Plus size={14} /> Add Hive
          </button>
        </div>
      </div>

      {/* Summary stats */}
      <div className="flex items-center gap-4 mb-5 text-sm">
        <span className="text-[#78716c]">{sorted.length} hives</span>
        <span className="w-px h-4 bg-[#e8e3db]" />
        <span className="flex items-center gap-1.5 text-[#16a34a]">
          <span className="w-2 h-2 rounded-full bg-[#16a34a]" />
          {allHives.filter(h => h.status === 'healthy').length} healthy
        </span>
        <span className="flex items-center gap-1.5 text-[#d97706]">
          <span className="w-2 h-2 rounded-full bg-[#d97706]" />
          {allHives.filter(h => h.status === 'attention' || h.status === 'warning').length} attention
        </span>
        <span className="flex items-center gap-1.5 text-[#dc2626]">
          <span className="w-2 h-2 rounded-full bg-[#dc2626]" />
          {allHives.filter(h => h.status === 'critical').length} critical
        </span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {sorted.map(h => {
          const s = statusConfig[h.status] ?? statusConfig.healthy
          return (
            <div key={h.id} className="bg-white rounded-2xl border border-[#e8e3db] p-5 hover:border-[#d97706]/30 hover:shadow-lg transition-all duration-200 group">
              {/* Card header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="font-display font-semibold text-[#1c1917]">{h.name}</div>
                  <div className="text-[#78716c] text-xs mt-0.5">{h.location}</div>
                </div>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium border"
                  style={{ color: s.color, backgroundColor: s.bg, borderColor: `${s.color}25` }}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: s.color }} />
                  {s.label}
                </span>
              </div>

              {/* Health score */}
              <div className="flex items-center gap-4 mb-4">
                <div className="relative">
                  <HealthRing score={h.healthScore} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-mono-data text-sm font-medium text-[#1c1917]">{h.healthScore}</span>
                  </div>
                </div>
                <div>
                  <div className="text-[#78716c] text-xs">Health Score</div>
                  <div className="font-display font-semibold text-base" style={{ color: s.color }}>{s.label}</div>
                  <div className="text-[#a09890] text-[11px] mt-0.5">Swarming: {h.swarmingRisk}</div>
                </div>
              </div>

              {/* Sensor grid */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                {[
                  { icon: Thermometer, label: 'Temperature', value: `${h.temperature}°C`, color: '#d97706' },
                  { icon: Droplets, label: 'Humidity', value: `${h.humidity}%`, color: '#2563eb' },
                  { icon: Weight, label: 'Weight', value: `${h.weight} kg`, color: '#7c3aed' },
                  { icon: Activity, label: 'Bee Activity', value: h.beeActivity, color: '#16a34a' },
                ].map(m => (
                  <div key={m.label} className="flex items-center gap-2 p-2 rounded-lg bg-[#f7f5f0]">
                    <m.icon size={12} style={{ color: m.color }} />
                    <div>
                      <div className="text-[#78716c] text-[10px]">{m.label}</div>
                      <div className="font-mono-data text-xs font-medium text-[#1c1917]">{m.value}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-[#f0ede8]">
                <div>
                  <div className="text-[#a09890] text-[11px]">Updated {h.lastUpdated}</div>
                  <div className="text-[11px] font-medium mt-0.5" style={{ color: h.weightChange >= 0 ? '#16a34a' : '#dc2626' }}>
                    {h.weightChange >= 0 ? '+' : ''}{h.weightChange} kg this week
                  </div>
                </div>
                <button onClick={() => navigate(`/hives/${h.id}`)}
                  className="flex items-center gap-1.5 text-xs font-medium text-[#d97706] hover:text-[#b45309] group-hover:translate-x-0.5 transition-all">
                  View Details <ChevronRight size={13} />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
