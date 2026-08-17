import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Thermometer,
  Droplets,
  Activity,
  Weight,
  Volume2,
  Wind,
  Gauge,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  Camera,
  Play,
  ArrowUpRight,
  Layers,
  Zap,
} from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'
import StatusBadge from '../components/StatusBadge'
import MetricCard from '../components/MetricCard'
import HoneyPredictionCard from '../components/HoneyPredictionCard'
import ForagingCard from '../components/ForagingCard'
import SensorActionFlow, { SensorActionStep } from '../components/SensorActionFlow'
import DetailModal from '../components/DetailModal'
import {
  hives,
  temperatureHistory,
  humidityHistory,
  weightHistory,
  activityHistory,
  alerts,
} from '../data/mockData'

function HealthRing({ score, size = 76 }: { score: number; size?: number }) {
  const r = size / 2 - 6
  const c = 2 * Math.PI * r
  const filled = (score / 100) * c
  const color =
    score >= 90 ? '#16a34a' : score >= 75 ? '#d97706' : score >= 50 ? '#f59e0b' : '#dc2626'

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#f0ede8" strokeWidth="6" />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="6"
        strokeDasharray={`${filled} ${c}`}
        strokeLinecap="round"
      />
    </svg>
  )
}

const CustomChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#1c1917] text-white px-3 py-2 rounded-xl text-xs shadow-xl border border-white/10">
      <div className="text-white/50 text-[10px] mb-0.5">{label}</div>
      <div className="font-mono-data font-bold text-sm text-[#fbbf24]">
        {payload[0].value}
        {payload[0].unit ?? ''}
      </div>
    </div>
  )
}

export default function Overview() {
  const navigate = useNavigate()
  const [activeTrendMetric, setActiveTrendMetric] = useState<'Weight'>('Weight')
  const [timeRange, setTimeRange] = useState('7D')
  const [activeDetailModal, setActiveDetailModal] = useState<string | null>(null)
  const [dismissedAlert, setDismissedAlert] = useState(false)

  // Primary active hive
  const primaryHive = hives[0]

  // Priority alert for home banner
  const primaryAlert = alerts[0]

  // Sensor -> AI -> Action flows
  const actionFlows: SensorActionStep[] = [
    {
      sensorName: 'Brood Temperature (BME680)',
      reading: `${primaryHive.temperature}`,
      readingUnit: '°C',
      status: 'normal',
      statusLabel: 'Normal · Stable',
      icon: Thermometer,
      iconColor: '#d97706',
      aiInterpretation: 'Internal colony core is thermo-regulated in the optimal 33–35°C band.',
      recommendation: 'No manual intervention required today.',
      actionType: 'none',
    },
    {
      sensorName: 'Relative Humidity',
      reading: `${primaryHive.humidity}`,
      readingUnit: '%',
      status: 'normal',
      statusLabel: 'Optimal',
      icon: Droplets,
      iconColor: '#2563eb',
      aiInterpretation: 'Condensation risk is very low; moisture evaporation rate is balanced.',
      recommendation: 'Maintain current hive top-vent configuration.',
      actionType: 'none',
    },
    {
      sensorName: 'Hive Acoustics (INMP441)',
      reading: `${primaryHive.buzzing}`,
      readingUnit: 'dB',
      status: 'normal',
      statusLabel: 'Calm',
      icon: Volume2,
      iconColor: '#0891b2',
      aiInterpretation: 'Frequency spectrum matches calm worker foraging (180–250 Hz fundamental).',
      recommendation: 'Queen presence verified; swarming risk is minimal (12%).',
      actionType: 'none',
    },
  ]

  const trendDataMap = {
    Temperature: {
      data: temperatureHistory,
      color: '#d97706',
      unit: '°C',
      refLineMin: 32,
      refLineMax: 36,
      refLabel: 'Brood Zone (32–36°C)',
    },
    Humidity: {
      data: humidityHistory,
      color: '#2563eb',
      unit: '%',
      refLineMin: 50,
      refLineMax: 75,
      refLabel: 'Optimal RH (50–75%)',
    },
    Activity: {
      data: activityHistory,
      color: '#16a34a',
      unit: '%',
      refLineMin: 60,
      refLineMax: 90,
      refLabel: 'Peak Foraging Target',
    },
  }

  const currentTrend = trendDataMap[activeTrendMetric]

  return (
    <div className="p-4 lg:p-6 space-y-5 max-w-[1500px] mx-auto">
      {/* 1. Header & Live Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#e8e3db]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="font-display text-xl lg:text-2xl font-bold text-[#1c1917]">
              SmartHive
            </h2>
            <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-[#16a34a]/10 border border-[#16a34a]/20">
              <span className="w-1.5 h-1.5 rounded-full bg-[#16a34a] live-dot" />
              <span className="text-[#16a34a] text-[10px] font-semibold uppercase tracking-wider">System Online</span>
            </div>
          </div>
          <h3 className="text-[#1c1917] font-semibold">Your Apiary</h3>
          <p className="text-xs text-[#78716c] mt-0.5">
            Last updated 12 sec ago
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-white border border-[#e8e3db] text-xs font-medium text-[#57534e]">
            <strong>4 Hives</strong> · <span className="text-[#16a34a]">3 Healthy</span> · <span className="text-[#d97706]">1 Needs Attention</span>
          </div>
        </div>
      </div>

      {/* 2. Priority Alert Banner (Attention Needed) */}
      {!dismissedAlert && primaryAlert ? (
        <div className="bg-white border border-[#e8e3db] shadow-sm rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-l-4 border-l-[#d97706]">
          <div className="flex items-start gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-[#d97706] uppercase tracking-wider">
                  Attention needed
                </span>
              </div>
              <div className="text-base font-semibold text-[#1c1917] mb-1">
                🟡 {primaryAlert.hive}
              </div>
              <p className="text-sm text-[#57534e]">
                {primaryAlert.reason}
              </p>
            </div>
          </div>

          <div className="flex-shrink-0">
            <button
              onClick={() => navigate('/hives/A02')}
              className="px-4 py-2 rounded-xl bg-[#f7f5f0] hover:bg-[#ede9e3] border border-[#e8e3db] text-[#1c1917] text-sm font-semibold transition-colors"
            >
              [ View Hive ]
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-[#e8e3db] shadow-sm rounded-2xl p-5 border-l-4 border-l-[#16a34a]">
          <div className="text-base font-semibold text-[#1c1917] mb-1">
            ✓ Nothing needs your attention
          </div>
          <p className="text-sm text-[#57534e]">
            All monitored hives are operating within expected conditions.
          </p>
        </div>
      )}

      {/* 3. Hive Health & Core Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Hive Health Card */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-[#e8e3db] p-6 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-lg text-[#1c1917]">🐝 Hive #01</h3>
              <StatusBadge status="healthy" label="● HEALTHY" />
            </div>
            
            <p className="text-sm text-[#1c1917] font-medium mb-2">
              Colony conditions are stable.
            </p>
            <p className="text-sm text-[#57534e]">
              No immediate action required.
            </p>
          </div>
          
          <div className="text-xs text-[#78716c] mt-6 pt-4 border-t border-[#f0ede8]">
            Last checked: 12 sec ago
          </div>
        </div>

        {/* 4 Core Metrics */}
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Temperature */}
          <div className="bg-white rounded-2xl border border-[#e8e3db] p-5 flex items-center justify-between shadow-sm">
            <div>
              <div className="flex items-center gap-1.5 mb-2 text-sm text-[#57534e]">
                <Thermometer size={16} className="text-[#d97706]" />
                <span>Temperature</span>
              </div>
              <div className="text-2xl font-bold text-[#1c1917] mb-1">
                34.2°C
              </div>
              <div className="text-sm text-[#16a34a] font-medium">
                Stable
              </div>
            </div>
          </div>

          {/* Humidity */}
          <div className="bg-white rounded-2xl border border-[#e8e3db] p-5 flex items-center justify-between shadow-sm">
            <div>
              <div className="flex items-center gap-1.5 mb-2 text-sm text-[#57534e]">
                <Droplets size={16} className="text-[#2563eb]" />
                <span>Humidity</span>
              </div>
              <div className="text-2xl font-bold text-[#1c1917] mb-1">
                64%
              </div>
              <div className="text-sm text-[#1c1917]">
                Normal
              </div>
            </div>
          </div>

          {/* Hive Weight */}
          <div className="bg-white rounded-2xl border border-[#e8e3db] p-5 flex items-center justify-between shadow-sm">
            <div>
              <div className="flex items-center gap-1.5 mb-2 text-sm text-[#57534e]">
                <Weight size={16} className="text-[#7c3aed]" />
                <span>Hive Weight</span>
              </div>
              <div className="text-2xl font-bold text-[#1c1917] mb-1">
                42.8 kg
              </div>
              <div className="text-sm text-[#d97706] font-medium">
                ↑ 1.2 kg this week
              </div>
            </div>
          </div>

          {/* Bee Activity */}
          <div className="bg-white rounded-2xl border border-[#e8e3db] p-5 flex items-center justify-between shadow-sm">
            <div>
              <div className="flex items-center gap-1.5 mb-2 text-sm text-[#57534e]">
                <Activity size={16} className="text-[#16a34a]" />
                <span>Bee Activity</span>
              </div>
              <div className="text-2xl font-bold text-[#1c1917] mb-1">
                Normal
              </div>
              <div className="text-sm text-[#16a34a] font-medium">
                Active
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 4. Insights & Trends Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Weight Trend Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#e8e3db] p-5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="font-display font-semibold text-base text-[#1c1917]">
                Weight Trend
              </h3>
              <p className="text-xs text-[#78716c]">
                Is the hive getting heavier or lighter?
              </p>
            </div>

            <div className="flex bg-[#f7f5f0] rounded-xl p-1 border border-[#e8e3db]">
              {['24H', '7D', '30D'].map(r => (
                <button
                  key={r}
                  onClick={() => setTimeRange(r)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all
                  ${
                    timeRange === r
                      ? 'bg-[#1c1917] text-white'
                      : 'text-[#78716c] hover:text-[#1c1917]'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="h-56 sm:h-64 -mx-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weightHistory}>
                <defs>
                  <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#7c3aed" stopOpacity={0.0} />
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
                  domain={['dataMin - 1', 'dataMax + 1']}
                  tick={{ fontSize: 11, fill: '#a09890' }}
                  axisLine={false}
                  tickLine={false}
                  width={40}
                />
                <Tooltip content={<CustomChartTooltip />} />
                <Area
                  type="monotone"
                  dataKey="value"
                  unit=" kg"
                  stroke="#7c3aed"
                  strokeWidth={2.5}
                  fill="url(#weightGrad)"
                  dot={false}
                  activeDot={{ r: 5, fill: '#7c3aed', stroke: '#fff', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Column: Smart Insights & Recent Activity */}
        <div className="space-y-5">
          {/* Smart Insights */}
          <div className="bg-[#fcfbf9] rounded-2xl border border-[#e8e3db] p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={16} className="text-[#d97706]" />
              <h3 className="font-display font-semibold text-base text-[#1c1917]">
                Smart Insights
              </h3>
            </div>
            
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <div className="mt-0.5 w-1.5 h-1.5 rounded-full bg-[#16a34a] flex-shrink-0" />
                <span className="text-sm text-[#57534e] leading-snug">
                  Steady weight gain indicates a successful nectar flow.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <div className="mt-0.5 w-1.5 h-1.5 rounded-full bg-[#16a34a] flex-shrink-0" />
                <span className="text-sm text-[#57534e] leading-snug">
                  Internal temperature remains optimally stable for brood rearing.
                </span>
              </li>
            </ul>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl border border-[#e8e3db] p-5 shadow-sm">
            <h3 className="font-display font-semibold text-base text-[#1c1917] mb-4">
              Recent Activity
            </h3>
            
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-2 h-2 rounded-full bg-[#d97706]" />
                  <div className="w-px h-full bg-[#f0ede8] mt-1" />
                </div>
                <div className="pb-4">
                  <div className="text-xs text-[#78716c] mb-0.5">Today, 8:45 AM</div>
                  <div className="text-sm text-[#1c1917] font-medium">Hive inspection completed</div>
                  <div className="text-xs text-[#57534e]">Queen spotted. Added new super.</div>
                </div>
              </div>
              
              <div className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-2 h-2 rounded-full bg-[#16a34a]" />
                </div>
                <div>
                  <div className="text-xs text-[#78716c] mb-0.5">Yesterday, 6:00 PM</div>
                  <div className="text-sm text-[#1c1917] font-medium">Weekly sensor sync</div>
                  <div className="text-xs text-[#57534e]">All telemetry verified.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 8. Interactive Detail Modal (For drill-down on tap) */}
      <DetailModal
        isOpen={!!activeDetailModal}
        onClose={() => setActiveDetailModal(null)}
        title={`${activeDetailModal} Telemetry & Diagnosis`}
        subtitle="Live IoT sensor reading from Hive A-01"
        badge={<StatusBadge status="normal" label="✓ NORMAL" size="sm" />}
        footerActions={
          <>
            <button
              onClick={() => {
                setActiveDetailModal(null)
                navigate('/analytics')
              }}
              className="px-4 py-2 rounded-xl bg-[#d97706] hover:bg-[#b45309] text-white text-xs font-semibold transition-colors"
            >
              Open Full Analytics →
            </button>
          </>
        }
      >
        {activeDetailModal && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-[#f7f5f0] border border-[#e8e3db]">
              <div className="text-xs text-[#78716c] mb-1">Current Measurement</div>
              <div className="font-mono-data text-3xl font-bold text-[#1c1917]">
                {activeDetailModal === 'Temperature'
                  ? '34.2°C'
                  : activeDetailModal === 'Humidity'
                  ? '62%'
                  : activeDetailModal === 'Activity'
                  ? '87%'
                  : activeDetailModal === 'Weight'
                  ? '42.8 kg'
                  : activeDetailModal === 'Buzzing'
                  ? '67 dB'
                  : '78 index'}
              </div>
              <div className="text-xs text-[#16a34a] font-medium mt-1">
                ✓ Value is inside healthy baseline threshold
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-[#1c1917] mb-2 uppercase tracking-wider">
                ✦ AI Clinical Interpretation
              </h4>
              <p className="text-xs text-[#57534e] leading-relaxed bg-[#faf5ff] border border-[#ddd6fe] p-3 rounded-xl">
                The readings for {activeDetailModal} show minimal thermal and acoustic volatility. The colony is regulating its internal environment autonomously without requiring feeder or ventilation modifications.
              </p>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-[#1c1917] mb-2 uppercase tracking-wider">
                Hardware Device Info
              </h4>
              <div className="text-xs text-[#78716c] space-y-1.5 bg-white border border-[#e8e3db] rounded-xl p-3">
                <div className="flex justify-between">
                  <span>Hardware Sensor:</span>
                  <span className="font-medium text-[#1c1917]">Bosch Sensortec BME680 / LIS3DH</span>
                </div>
                <div className="flex justify-between">
                  <span>Sampling Frequency:</span>
                  <span className="font-medium text-[#1c1917]">Every 10 seconds</span>
                </div>
                <div className="flex justify-between">
                  <span>Confidence Rating:</span>
                  <span className="font-medium text-[#16a34a]">98.2% calibrated</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </DetailModal>
    </div>
  )
}
