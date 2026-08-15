import React, { useState } from 'react'
import {
  Thermometer,
  Droplets,
  Weight,
  Activity,
  Volume2,
  Wind,
  TrendingUp,
  Sparkles,
  Layers,
  ChevronRight,
  Filter,
} from 'lucide-react'
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'
import StatusBadge from '../components/StatusBadge'
import {
  temperatureHistory,
  humidityHistory,
  weightHistory,
  activityHistory,
  hives,
} from '../data/mockData'

const CustomChartTooltip = ({ active, payload, label, unit }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#1c1917] text-white px-3 py-2 rounded-xl text-xs shadow-xl border border-white/10">
      <div className="text-white/50 text-[10px] mb-0.5">{label}</div>
      <div className="font-mono-data font-bold text-sm text-[#fbbf24]">
        {payload[0].value} {unit || ''}
      </div>
    </div>
  )
}

export default function Analytics() {
  const [selectedHive, setSelectedHive] = useState('A01')
  const [timeRange, setTimeRange] = useState('24H')
  const [activeMetric, setActiveMetric] = useState<'temp' | 'humidity' | 'weight' | 'activity' | 'audio'>('temp')

  const metricConfigs = {
    temp: {
      title: 'Brood Nest Thermoregulation',
      question: 'Is brood nest thermoregulation steady within the optimal larval zone?',
      color: '#d97706',
      unit: '°C',
      data: temperatureHistory,
      minRef: 32,
      maxRef: 36,
      refLabel: 'Brood Incubation Target (32–36°C)',
      status: 'Normal · Stable',
      summary: 'The colony maintains tight internal climate control despite external ambient variations.',
    },
    humidity: {
      title: 'Internal Colony Humidity',
      question: 'Is relative humidity avoiding mold risks while maintaining larval hydration?',
      color: '#2563eb',
      unit: '%',
      data: humidityHistory,
      minRef: 50,
      maxRef: 75,
      refLabel: 'Safe RH Band (50–75%)',
      status: 'Optimal',
      summary: 'Moisture levels indicate normal evaporative honey curing with no condensation danger.',
    },
    weight: {
      title: 'Hive Weight & Nectar Accumulation',
      question: 'How much honey has the colony accumulated this week?',
      color: '#7c3aed',
      unit: 'kg',
      data: weightHistory.map(w => ({ time: w.time, value: w.value })),
      minRef: 35,
      maxRef: 50,
      refLabel: 'Harvestable Baseline (45 kg)',
      status: 'Growing (+1.2 kg)',
      summary: 'Continuous positive weight gain aligns with peak mustard bloom availability.',
    },
    activity: {
      title: 'Foraging Flight Dynamics',
      question: 'What are the peak forager traffic hours at the hive entrance?',
      color: '#16a34a',
      unit: '%',
      data: activityHistory,
      minRef: 60,
      maxRef: 95,
      refLabel: 'Active Flight Range',
      status: 'High Throughput',
      summary: 'Forager traffic peaks between 9:00 AM and 1:00 PM matching high solar irradiance.',
    },
    audio: {
      title: 'Acoustic Power & Frequency Spectrum',
      question: 'Are there acoustic signs of queen piping, queenlessness, or swarming preparation?',
      color: '#0891b2',
      unit: 'dB',
      data: [
        { time: '00:00', value: 58 },
        { time: '04:00', value: 56 },
        { time: '08:00', value: 64 },
        { time: '12:00', value: 72 },
        { time: '16:00', value: 68 },
        { time: '20:00', value: 61 },
      ],
      minRef: 50,
      maxRef: 80,
      refLabel: 'Nominal Buzzing Band',
      status: 'Calm Baseline',
      summary: 'Dominant frequency rests at 210–240 Hz. Swarm piping frequencies (450 Hz) are absent.',
    },
  }

  const current = metricConfigs[activeMetric]

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-[1500px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-[#e8e3db] rounded-2xl p-4 lg:p-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-[#d97706] tracking-wider uppercase">
              Deep Analytics
            </span>
            <span className="text-[#a09890]">·</span>
            <span className="text-xs text-[#78716c]">Historical Sensor Telemetry</span>
          </div>
          <h2 className="font-display text-xl lg:text-2xl font-bold text-[#1c1917]">
            Apiary Sensor Dynamics & Correlations
          </h2>
          <p className="text-xs text-[#78716c] mt-0.5">
            Evaluate longitudinal trends, environmental correlations, and colony micro-climate performance.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={selectedHive}
            onChange={e => setSelectedHive(e.target.value)}
            className="bg-[#f7f5f0] border border-[#e8e3db] text-xs font-semibold px-3 py-2 rounded-xl outline-none focus:border-[#d97706]"
          >
            {hives.map(h => (
              <option key={h.id} value={h.id}>
                {h.name} ({h.location})
              </option>
            ))}
          </select>

          <div className="flex bg-[#f7f5f0] border border-[#e8e3db] rounded-xl p-1">
            {['24H', '7D', '30D', 'Season'].map(r => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all
                ${timeRange === r ? 'bg-[#1c1917] text-white' : 'text-[#78716c] hover:text-[#1c1917]'}`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Metric Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {[
          { id: 'temp', label: 'Temperature', icon: Thermometer, color: '#d97706', val: '34.2°C' },
          { id: 'humidity', label: 'Humidity', icon: Droplets, color: '#2563eb', val: '62%' },
          { id: 'weight', label: 'Hive Weight', icon: Weight, color: '#7c3aed', val: '42.8 kg' },
          { id: 'activity', label: 'Foraging Traffic', icon: Activity, color: '#16a34a', val: '87%' },
          { id: 'audio', label: 'Audio Frequency', icon: Volume2, color: '#0891b2', val: '67 dB' },
        ].map(tab => {
          const Icon = tab.icon
          const isActive = activeMetric === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveMetric(tab.id as any)}
              className={`p-3.5 rounded-2xl border text-left transition-all
              ${
                isActive
                  ? 'bg-white border-[#d97706] shadow-md ring-2 ring-[#d97706]/15'
                  : 'bg-white border-[#e8e3db] hover:border-[#d97706]/40 hover:bg-[#fafaf8]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${tab.color}15` }}
                >
                  <Icon size={15} style={{ color: tab.color }} />
                </div>
                {isActive && (
                  <span className="w-2 h-2 rounded-full bg-[#d97706]" />
                )}
              </div>
              <div className="text-[11px] font-medium text-[#78716c]">{tab.label}</div>
              <div className="font-mono-data text-base font-bold text-[#1c1917] mt-0.5">{tab.val}</div>
            </button>
          )
        })}
      </div>

      {/* Main Focus Chart Card */}
      <div className="bg-white rounded-2xl border border-[#e8e3db] p-5 lg:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#f0ede8]">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display font-bold text-lg text-[#1c1917]">{current.title}</h3>
              <StatusBadge status="normal" label={current.status} size="sm" />
            </div>
            <p className="text-xs text-[#78716c] mt-0.5">{current.question}</p>
          </div>
          <div className="text-xs text-[#78716c] bg-[#f7f5f0] border border-[#e8e3db] px-3 py-1.5 rounded-xl self-start sm:self-auto">
            {current.summary}
          </div>
        </div>

        {/* Big Chart Area */}
        <div className="h-72 sm:h-80 -mx-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={current.data}>
              <defs>
                <linearGradient id="analyticsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={current.color} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={current.color} stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0ede8" vertical={false} />
              <XAxis
                dataKey="time"
                tick={{ fontSize: 11, fill: '#a09890' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#a09890' }}
                axisLine={false}
                tickLine={false}
                width={38}
              />
              <Tooltip content={<CustomChartTooltip unit={current.unit} />} />
              {current.minRef && (
                <ReferenceLine
                  y={current.minRef}
                  stroke="#16a34a"
                  strokeDasharray="4 2"
                  label={{
                    value: current.refLabel,
                    fill: '#16a34a',
                    fontSize: 10,
                    position: 'insideTopLeft',
                  }}
                />
              )}
              {current.maxRef && (
                <ReferenceLine y={current.maxRef} stroke="#d97706" strokeDasharray="4 2" />
              )}
              <Area
                type="monotone"
                dataKey="value"
                unit={current.unit}
                stroke={current.color}
                strokeWidth={2.5}
                fill="url(#analyticsGrad)"
                dot={false}
                activeDot={{ r: 6, fill: current.color, stroke: '#fff', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Environmental Correlations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl border border-[#e8e3db] p-5">
          <h4 className="font-display font-semibold text-sm text-[#1c1917] mb-1">
            Brood Temp vs Ambient Solar
          </h4>
          <p className="text-xs text-[#78716c] mb-3">Thermoregulatory efficiency correlation</p>
          <div className="p-3 rounded-xl bg-[#fcfbf9] border border-[#e8e3db] space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-[#78716c]">Ambient Temp Range:</span>
              <span className="font-mono-data font-semibold">18.4°C – 32.1°C</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#78716c]">Internal Core Variance:</span>
              <span className="font-mono-data font-semibold text-[#16a34a]">±0.4°C (Tight)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#78716c]">Correlation Factor:</span>
              <span className="font-semibold text-[#16a34a]">r = 0.12 (High Insulation)</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#e8e3db] p-5">
          <h4 className="font-display font-semibold text-sm text-[#1c1917] mb-1">
            Flight Traffic vs Sun Hours
          </h4>
          <p className="text-xs text-[#78716c] mb-3">Forager departure window response</p>
          <div className="p-3 rounded-xl bg-[#fcfbf9] border border-[#e8e3db] space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-[#78716c]">Peak Flight Window:</span>
              <span className="font-semibold text-[#1c1917]">9:00 AM – 1:00 PM</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#78716c]">Light Intensity Trigger:</span>
              <span className="font-mono-data font-semibold">45,000 Lux</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#78716c]">Efficiency Index:</span>
              <span className="font-semibold text-[#16a34a]">94% Foraging Rate</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#e8e3db] p-5">
          <h4 className="font-display font-semibold text-sm text-[#1c1917] mb-1">
            Weight Gain vs Audio Frequency
          </h4>
          <p className="text-xs text-[#78716c] mb-3">Comb building & nectar curing activity</p>
          <div className="p-3 rounded-xl bg-[#fcfbf9] border border-[#e8e3db] space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-[#78716c]">Nighttime Curing Hum:</span>
              <span className="font-mono-data font-semibold">62 dB (Active Evaporation)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#78716c]">Net Daily Accumulation:</span>
              <span className="font-mono-data font-semibold text-[#16a34a]">+0.32 kg / day</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#78716c]">Comb Occupancy:</span>
              <span className="font-semibold text-[#d97706]">78% Super Filled</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
