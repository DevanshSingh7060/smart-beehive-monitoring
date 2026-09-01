import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search,
  Plus,
  SlidersHorizontal,
  Thermometer,
  Droplets,
  Weight,
  Activity,
  ChevronRight,
  TrendingUp,
} from 'lucide-react'
import StatusBadge from '../components/StatusBadge'
import { hives } from '../data/mockData'

function HealthRing({ score, size = 56 }: { score: number; size?: number }) {
  const r = size / 2 - 5
  const c = 2 * Math.PI * r
  const filled = (score / 100) * c
  const color =
    score >= 90 ? '#4ade80' : score >= 75 ? '#fbbf24' : score >= 50 ? '#f59e0b' : '#ef4444'

  return (
    <div className="relative">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90 filter drop-shadow-[0_0_8px_rgba(0,0,0,0.5)]">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4.5" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="4.5"
          strokeDasharray={`${filled} ${c}`}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      {/* Subtle glow behind the ring */}
      <div 
        className="absolute inset-0 rounded-full blur-[10px] opacity-20 pointer-events-none"
        style={{ backgroundColor: color }}
      />
    </div>
  )
}

const allHives = [
  ...hives,
  {
    id: 'C01',
    name: 'Hive C-01',
    location: 'South Orchard',
    status: 'healthy',
    healthScore: 91,
    temperature: 33.8,
    humidity: 61,
    weight: 39.4,
    beeActivity: 'Normal',
    swarmingRisk: 'Low',
    queenStatus: 'Normal',
    lastUpdated: '30s ago',
    weightChange: +0.4,
    buzzing: 58,
    vibration: 0.09,
    pressure: 1009,
    airQuality: 'Good',
    vocIndex: 72,
    swarmingRiskPct: 7,
    queenlessRisk: 3,
    diseaseRisk: 5,
    envHealth: 93,
    behavioralHealth: 89,
    productivity: 91,
    stability: 94,
  },
  {
    id: 'C02',
    name: 'Hive C-02',
    location: 'West Meadow',
    status: 'critical',
    healthScore: 44,
    temperature: 28.1,
    humidity: 82,
    weight: 35.2,
    beeActivity: 'Low',
    swarmingRisk: 'Low',
    queenStatus: 'Unknown',
    lastUpdated: '2h ago',
    weightChange: -2.1,
    buzzing: 31,
    vibration: 0.06,
    pressure: 1006,
    airQuality: 'Poor',
    vocIndex: 156,
    swarmingRiskPct: 14,
    queenlessRisk: 68,
    diseaseRisk: 55,
    envHealth: 41,
    behavioralHealth: 38,
    productivity: 45,
    stability: 50,
  },
]

export default function MyHives() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('health')
  const [statusFilter, setStatusFilter] = useState('all')

  const filtered = allHives
    .filter(
      h =>
        h.name.toLowerCase().includes(search.toLowerCase()) ||
        h.location.toLowerCase().includes(search.toLowerCase())
    )
    .filter(h => {
      if (statusFilter === 'healthy') return h.status === 'healthy'
      if (statusFilter === 'attention') return h.status === 'attention' || h.status === 'warning'
      if (statusFilter === 'critical') return h.status === 'critical'
      return true
    })
    .sort((a, b) => {
      if (sortBy === 'health') return b.healthScore - a.healthScore
      if (sortBy === 'weight') return b.weight - a.weight
      if (sortBy === 'temperature') return b.temperature - a.temperature
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      return 0
    })

  return (
    <div className="p-4 lg:p-6 max-w-[1500px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel-elevated rounded-3xl p-6 lg:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#fbbf24]/10 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative z-10">
          <h2 className="font-display text-2xl lg:text-3xl font-bold text-white ai-glow-text mb-1">
            My Connected Apiaries
          </h2>
          <p className="text-sm text-white/50 font-medium">
            Monitor colony health, sensor telemetry, and honey production across all locations.
          </p>
        </div>

        <button className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#fbbf24]/20 hover:bg-[#fbbf24]/30 border border-[#fbbf24]/40 text-[#fbbf24] text-sm font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(251,191,36,0.15)] transition-all self-start sm:self-auto relative z-10">
          <Plus size={16} /> Add New Hive Node
        </button>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 glass-panel border border-white/10 rounded-2xl p-4 relative z-10">
        <div className="relative w-full lg:w-96">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search hive name or location…"
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-white/10 bg-black/40 text-sm font-medium text-white placeholder:text-white/30 outline-none focus:border-[#fbbf24]/50 focus:bg-[#fbbf24]/5 transition-all shadow-inner"
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-4 w-full lg:w-auto">
          {/* Status Filter buttons */}
          <div className="flex bg-black/40 border border-white/5 rounded-xl p-1 shadow-inner w-full sm:w-auto overflow-x-auto">
            {[
              { id: 'all', label: `All (${allHives.length})` },
              { id: 'healthy', label: 'Healthy' },
              { id: 'attention', label: 'Attention' },
              { id: 'critical', label: 'Critical' },
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setStatusFilter(f.id)}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap
                ${statusFilter === f.id ? 'bg-white/15 text-white shadow-[0_0_10px_rgba(255,255,255,0.1)]' : 'text-white/50 hover:text-white/80 hover:bg-white/5'}`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="glass-panel border border-white/10 rounded-xl px-4 py-2 w-full sm:w-auto">
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="bg-transparent text-xs font-bold uppercase tracking-wider text-white outline-none cursor-pointer appearance-none w-full custom-select"
            >
              <option value="health" className="text-black">Sort: Health Score</option>
              <option value="weight" className="text-black">Sort: Weight</option>
              <option value="temperature" className="text-black">Sort: Temperature</option>
              <option value="name" className="text-black">Sort: Name</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filtered.map(h => (
          <div
            key={h.id}
            className="glass-panel rounded-3xl border border-white/10 p-6 hover:border-white/30 hover:bg-white/5 transition-all duration-300 group flex flex-col justify-between relative overflow-hidden"
          >
            {h.status === 'critical' && (
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#ef4444]/10 rounded-full blur-[40px] pointer-events-none group-hover:bg-[#ef4444]/20 transition-all" />
            )}
            
            <div className="relative z-10">
              {/* Header */}
              <div className="flex items-start justify-between mb-5">
                <div>
                  <div className="font-display font-bold text-lg text-white group-hover:text-[#fbbf24] transition-colors tracking-wide">
                    {h.name}
                  </div>
                  <div className="text-white/50 text-xs font-medium uppercase tracking-wider mt-1">{h.location}</div>
                </div>
                <StatusBadge status={h.status} size="sm" />
              </div>

              {/* Health Score Overview */}
              <div className="flex items-center gap-5 mb-6 p-4 rounded-2xl bg-black/30 border border-white/5 shadow-inner">
                <div className="relative flex-shrink-0">
                  <HealthRing score={h.healthScore} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-mono-data text-sm font-bold text-white">
                      {h.healthScore}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-white/40">Colony Health Index</div>
                  <div className="font-bold text-sm text-white/90 mt-1 leading-snug">
                    {h.status === 'healthy' ? 'Optimal Brood Homeostasis' : h.status === 'critical' ? 'Urgent Intervention Needed' : 'Monitoring Thermal Fluctuation'}
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-white/50 mt-1.5 flex items-center gap-1.5">
                    Swarm Risk: <strong className="text-[#4ade80] bg-[#4ade80]/10 px-1.5 py-0.5 rounded">{h.swarmingRisk}</strong>
                  </div>
                </div>
              </div>

              {/* Sensor Grid */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {[
                  { icon: Thermometer, label: 'Brood Temp', value: `${h.temperature}°C`, color: '#fbbf24' },
                  { icon: Droplets, label: 'Humidity', value: `${h.humidity}%`, color: '#60a5fa' },
                  { icon: Weight, label: 'Total Weight', value: `${h.weight} kg`, color: '#a78bfa' },
                  { icon: Activity, label: 'Bee Activity', value: h.beeActivity, color: '#4ade80' },
                ].map(m => (
                  <div key={m.label} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 group-hover:bg-white/10 transition-colors">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${m.color}15` }}>
                      <m.icon size={14} style={{ color: m.color }} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-white/40 text-[10px] font-bold uppercase tracking-wider truncate">{m.label}</div>
                      <div className="font-mono-data text-sm font-bold text-white mt-0.5">{m.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-white/10 relative z-10">
              <div>
                <div className="text-white/30 text-[10px] font-bold uppercase tracking-wider">Synced {h.lastUpdated}</div>
                <div
                  className="text-xs font-bold mt-1 tracking-wide"
                  style={{ color: h.weightChange >= 0 ? '#4ade80' : '#ef4444' }}
                >
                  {h.weightChange >= 0 ? '+' : ''}{h.weightChange} kg this week
                </div>
              </div>

              <button
                onClick={() => navigate(`/hives/${h.id}`)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold uppercase tracking-wider transition-all"
              >
                <span>View Node</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
