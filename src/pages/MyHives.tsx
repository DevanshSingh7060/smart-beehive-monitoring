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
    score >= 90 ? '#16a34a' : score >= 75 ? '#d97706' : score >= 50 ? '#f59e0b' : '#dc2626'

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#f0ede8" strokeWidth="4.5" />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="4.5"
        strokeDasharray={`${filled} ${c}`}
        strokeLinecap="round"
      />
    </svg>
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-[#e8e3db] rounded-2xl p-4 lg:p-5">
        <div>
          <h2 className="font-display text-xl lg:text-2xl font-bold text-[#1c1917]">
            My Connected Apiaries & Hives
          </h2>
          <p className="text-xs text-[#78716c] mt-0.5">
            Monitor colony health, sensor telemetry, and honey production across all locations.
          </p>
        </div>

        <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#d97706] hover:bg-[#b45309] text-white text-xs font-semibold shadow transition-colors self-start sm:self-auto">
          <Plus size={14} /> Add New Hive Node
        </button>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white border border-[#e8e3db] rounded-2xl p-3.5">
        <div className="relative w-full sm:w-80">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a09890]" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search hive name or location…"
            className="w-full pl-9 pr-4 py-1.5 rounded-xl border border-[#e8e3db] bg-[#f7f5f0] text-xs text-[#1c1917] placeholder:text-[#a09890] outline-none focus:border-[#d97706] focus:bg-white transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
          {/* Status Filter buttons */}
          <div className="flex bg-[#f7f5f0] border border-[#e8e3db] rounded-xl p-1">
            {[
              { id: 'all', label: `All (${allHives.length})` },
              { id: 'healthy', label: 'Healthy' },
              { id: 'attention', label: 'Attention' },
              { id: 'critical', label: 'Critical' },
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setStatusFilter(f.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all
                ${statusFilter === f.id ? 'bg-[#1c1917] text-white' : 'text-[#78716c] hover:text-[#1c1917]'}`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-[#e8e3db] bg-[#f7f5f0] text-xs font-medium text-[#1c1917] outline-none focus:border-[#d97706]"
          >
            <option value="health">Sort: Health Score</option>
            <option value="weight">Sort: Weight</option>
            <option value="temperature">Sort: Temperature</option>
            <option value="name">Sort: Name</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map(h => (
          <div
            key={h.id}
            className="bg-white rounded-2xl border border-[#e8e3db] p-5 hover:border-[#d97706]/40 hover:shadow-md transition-all duration-200 group flex flex-col justify-between"
          >
            <div>
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="font-display font-bold text-base text-[#1c1917] group-hover:text-[#d97706] transition-colors">
                    {h.name}
                  </div>
                  <div className="text-[#78716c] text-xs mt-0.5">{h.location}</div>
                </div>
                <StatusBadge status={h.status} size="sm" />
              </div>

              {/* Health Score Overview */}
              <div className="flex items-center gap-4 mb-4 p-3 rounded-xl bg-[#fcfbf9] border border-[#e8e3db]">
                <div className="relative flex-shrink-0">
                  <HealthRing score={h.healthScore} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-mono-data text-xs font-bold text-[#1c1917]">
                      {h.healthScore}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-[#78716c]">Colony Health Index</div>
                  <div className="font-semibold text-xs text-[#1c1917] mt-0.5">
                    {h.status === 'healthy' ? 'Optimal Brood Homeostasis' : h.status === 'critical' ? 'Urgent Intervention Needed' : 'Monitoring Thermal Fluctuation'}
                  </div>
                  <div className="text-[10px] text-[#78716c] mt-0.5">
                    Swarm Risk: <strong className="text-[#16a34a]">{h.swarmingRisk}</strong>
                  </div>
                </div>
              </div>

              {/* Sensor Grid */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                {[
                  { icon: Thermometer, label: 'Brood Temp', value: `${h.temperature}°C`, color: '#d97706' },
                  { icon: Droplets, label: 'Humidity', value: `${h.humidity}%`, color: '#2563eb' },
                  { icon: Weight, label: 'Total Weight', value: `${h.weight} kg`, color: '#7c3aed' },
                  { icon: Activity, label: 'Bee Activity', value: h.beeActivity, color: '#16a34a' },
                ].map(m => (
                  <div key={m.label} className="flex items-center gap-2 p-2 rounded-xl bg-[#f7f5f0] border border-[#e8e3db]/60">
                    <m.icon size={13} style={{ color: m.color }} />
                    <div className="min-w-0">
                      <div className="text-[#78716c] text-[10px] truncate">{m.label}</div>
                      <div className="font-mono-data text-xs font-semibold text-[#1c1917]">{m.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-[#f0ede8]">
              <div>
                <div className="text-[#a09890] text-[10px]">Synced {h.lastUpdated}</div>
                <div
                  className="text-[11px] font-semibold mt-0.5"
                  style={{ color: h.weightChange >= 0 ? '#16a34a' : '#dc2626' }}
                >
                  {h.weightChange >= 0 ? '+' : ''}{h.weightChange} kg this week
                </div>
              </div>

              <button
                onClick={() => navigate(`/hives/${h.id}`)}
                className="flex items-center gap-1 text-xs font-semibold text-[#d97706] hover:text-[#b45309] group-hover:translate-x-0.5 transition-all"
              >
                <span>View Telemetry</span>
                <ChevronRight size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
