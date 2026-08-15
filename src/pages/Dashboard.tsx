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

export default function Dashboard() {
  const navigate = useNavigate()
  const [activeTrendMetric, setActiveTrendMetric] = useState<'Temperature' | 'Humidity' | 'Activity'>('Temperature')
  const [timeRange, setTimeRange] = useState('24H')
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-[#e8e3db] rounded-2xl p-4 lg:p-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-[#d97706] tracking-wider uppercase">
              Apiary Overview
            </span>
            <span className="text-[#a09890]">·</span>
            <span className="text-xs text-[#78716c]">4 Active Hives Monitored</span>
          </div>
          <h2 className="font-display text-xl lg:text-2xl font-bold text-[#1c1917]">
            Good Morning, Disha
          </h2>
          <p className="text-xs text-[#78716c] mt-0.5">
            Your colony is actively foraging with stable internal conditions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#16a34a]/8 border border-[#16a34a]/25 text-[#16a34a] text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-[#16a34a] live-dot" />
            <span>All Systems Normal</span>
          </div>
          <button
            onClick={() => navigate('/ai')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1c1917] hover:bg-[#292524] text-white text-xs font-medium transition-colors"
          >
            <Sparkles size={13} className="text-[#fbbf24]" />
            <span>Ask AI Assistant</span>
          </button>
        </div>
      </div>

      {/* 2. Priority Alert Banner (Prioritized single alert or All Clear) */}
      {!dismissedAlert && primaryAlert ? (
        <div className="bg-[#fffbeb] border border-[#fde68a] rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#d97706]/15 flex items-center justify-center flex-shrink-0 mt-0.5">
              <AlertTriangle size={18} className="text-[#d97706]" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-0.5">
                <span className="text-[10px] font-bold text-[#d97706] bg-white border border-[#fde68a] px-2 py-0.5 rounded-md uppercase">
                  ⚠ Attention Needed · {primaryAlert.hive}
                </span>
                <span className="text-xs font-semibold text-[#1c1917]">
                  {primaryAlert.type}
                </span>
                <span className="text-[11px] text-[#78716c]">({primaryAlert.time})</span>
              </div>
              <p className="text-xs text-[#57534e] leading-snug">
                {primaryAlert.reason}
              </p>
              <div className="text-[11px] font-medium text-[#b45309] mt-1 flex items-center gap-1">
                <Sparkles size={11} className="text-[#7c3aed]" />
                <strong>AI Recommendation:</strong> Inspect brood box ventilation and check entrance traffic.
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
            <button
              onClick={() => navigate('/alerts')}
              className="px-3 py-1.5 rounded-xl bg-[#d97706] hover:bg-[#b45309] text-white text-xs font-semibold transition-colors"
            >
              View Details →
            </button>
            <button
              onClick={() => setDismissedAlert(true)}
              className="px-3 py-1.5 rounded-xl bg-white border border-[#e8e3db] text-[#78716c] hover:text-[#1c1917] text-xs font-medium transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-2xl p-3.5 px-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 size={18} className="text-[#16a34a] flex-shrink-0" />
            <div className="text-xs font-medium text-[#166534]">
              <strong>✓ No critical issues:</strong> All hives are operating within optimal environmental and acoustic thresholds.
            </div>
          </div>
          <span className="text-[11px] text-[#16a34a] font-medium hidden sm:inline">
            Confidence: 96%
          </span>
        </div>
      )}

      {/* 3. Hero Overall Hive Health & AI Daily Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Overall Hive Health (Hero Card - cols 5) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-[#e8e3db] p-5 flex flex-col justify-between hover:border-[#d97706]/30 transition-all">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#16a34a]/15 flex items-center justify-center">
                  <Activity size={16} className="text-[#16a34a]" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-base text-[#1c1917]">
                    Overall Hive Health
                  </h3>
                  <div className="text-[11px] text-[#78716c]">Primary Hive A-01 · North Field</div>
                </div>
              </div>
              <StatusBadge status="healthy" label="✓ HEALTHY" />
            </div>

            <div className="flex items-center gap-5 my-3 p-3.5 bg-[#fcfbf9] border border-[#e8e3db] rounded-xl">
              <div className="relative flex-shrink-0">
                <HealthRing score={primaryHive.healthScore} size={82} />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-mono-data text-2xl font-extrabold text-[#1c1917] leading-none">
                    {primaryHive.healthScore}
                  </span>
                  <span className="text-[9px] text-[#78716c] font-medium">/ 100</span>
                </div>
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#16a34a]">
                  <TrendingUp size={14} />
                  <span>↑ Improving (+3 pts this week)</span>
                </div>
                <p className="text-xs text-[#57534e] leading-snug">
                  Optimal brood homeostasis based on <strong>6 active IoT parameters</strong>.
                </p>
                <div className="text-[10px] text-[#78716c] pt-1">
                  AI Assessment Confidence: <strong className="text-[#1c1917]">96%</strong>
                </div>
              </div>
            </div>

            {/* Quick parameter meters */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 rounded-lg bg-[#f7f5f0] border border-[#e8e3db]">
                <div className="text-[10px] text-[#78716c]">Env Health</div>
                <div className="font-mono-data font-semibold text-[#16a34a] mt-0.5">
                  {primaryHive.envHealth}%
                </div>
              </div>
              <div className="p-2 rounded-lg bg-[#f7f5f0] border border-[#e8e3db]">
                <div className="text-[10px] text-[#78716c]">Behavior</div>
                <div className="font-mono-data font-semibold text-[#16a34a] mt-0.5">
                  {primaryHive.behavioralHealth}%
                </div>
              </div>
              <div className="p-2 rounded-lg bg-[#f7f5f0] border border-[#e8e3db]">
                <div className="text-[10px] text-[#78716c]">Stability</div>
                <div className="font-mono-data font-semibold text-[#16a34a] mt-0.5">
                  {primaryHive.stability}%
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate('/ai')}
            className="w-full flex items-center justify-center gap-1.5 mt-4 pt-3 border-t border-[#f0ede8] text-xs font-semibold text-[#d97706] hover:text-[#b45309] transition-colors"
          >
            <span>View Full AI Intelligence Breakdown</span>
            <ChevronRight size={14} />
          </button>
        </div>

        {/* AI Daily Summary & Action Center (cols 7) */}
        <div className="lg:col-span-7 bg-[#1c1917] rounded-2xl p-5 text-white flex flex-col justify-between relative overflow-hidden shadow-md">
          {/* Subtle background pattern */}
          <div className="absolute right-0 top-0 w-48 h-48 bg-[#d97706]/10 rounded-full blur-3xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#d97706]/20 border border-[#d97706]/40 flex items-center justify-center">
                  <Sparkles size={16} className="text-[#fbbf24]" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-base text-white">
                    ✦ AI Daily Colony Summary
                  </h3>
                  <div className="text-[10px] text-white/50">Continuous Edge Diagnostics</div>
                </div>
              </div>
              <span className="text-[10px] font-bold text-[#fbbf24] bg-[#d97706]/20 border border-[#d97706]/30 px-2 py-0.5 rounded-md uppercase">
                Synchronized
              </span>
            </div>

            {/* Concise 2-3 line summary */}
            <div className="p-3.5 bg-white/5 rounded-xl border border-white/10 mb-4">
              <p className="text-xs sm:text-sm text-white/90 leading-relaxed font-normal">
                "Your colony is healthy today. Temperature (34.2°C) and relative humidity (62%) are in the ideal brood zone, with high foraging throughput. No immediate beekeeper intervention is needed."
              </p>
            </div>

            {/* AI Highlight pills */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-2">
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/8 flex items-center gap-2.5">
                <div className="w-2 h-2 rounded-full bg-[#16a34a]" />
                <div>
                  <div className="text-[10px] text-white/50">Queen Status</div>
                  <div className="text-xs font-semibold text-white">Normal (94% conf)</div>
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/8 flex items-center gap-2.5">
                <div className="w-2 h-2 rounded-full bg-[#16a34a]" />
                <div>
                  <div className="text-[10px] text-white/50">Swarming Risk</div>
                  <div className="text-xs font-semibold text-white">Low (12% index)</div>
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/8 flex items-center gap-2.5">
                <div className="w-2 h-2 rounded-full bg-[#d97706]" />
                <div>
                  <div className="text-[10px] text-white/50">Honey Gain</div>
                  <div className="text-xs font-semibold text-white">+1.2 kg this week</div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-white/10 gap-3">
            <span className="text-[11px] text-white/50">
              Next scheduled diagnostic run in 4 min
            </span>
            <button
              onClick={() => navigate('/ai')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#d97706] hover:bg-[#b45309] text-white text-xs font-semibold transition-colors"
            >
              <span>Explore AI Insights</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* 4. Daily Essential Metrics (6 Standardized Cards) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-display font-semibold text-base text-[#1c1917]">
              Daily Essential Metrics
            </h3>
            <p className="text-xs text-[#78716c]">
              Key real-time sensor parameters and colony activity
            </p>
          </div>
          <button
            onClick={() => navigate('/analytics')}
            className="text-xs text-[#d97706] font-semibold hover:text-[#b45309] flex items-center gap-1"
          >
            Detailed Sensor Analytics <ChevronRight size={13} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
          {/* Temperature */}
          <MetricCard
            title="Brood Temperature"
            value="34.2"
            unit="°C"
            status="normal"
            statusLabel="Normal"
            trend={{ dir: 'up', text: '↑ 0.4°C today' }}
            aiSummary="Optimal brood nest range (32–36°C)."
            icon={Thermometer}
            iconColor="#d97706"
            sparklineData={temperatureHistory}
            onViewDetails={() => setActiveDetailModal('Temperature')}
          />

          {/* Humidity */}
          <MetricCard
            title="Internal Humidity"
            value="62"
            unit="%"
            status="normal"
            statusLabel="Optimal"
            trend={{ dir: 'down', text: '↓ 2% from morning' }}
            aiSummary="Safe evaporation; no condensation danger."
            icon={Droplets}
            iconColor="#2563eb"
            sparklineData={humidityHistory}
            onViewDetails={() => setActiveDetailModal('Humidity')}
          />

          {/* Bee Activity */}
          <MetricCard
            title="Bee Flight Activity"
            value="87"
            unit="%"
            status="normal"
            statusLabel="Active"
            trend={{ dir: 'up', text: '↑ 124 bees counted' }}
            aiSummary="High flight traffic at hive entrance."
            icon={Activity}
            iconColor="#16a34a"
            sparklineData={activityHistory}
            onViewDetails={() => setActiveDetailModal('Activity')}
          />

          {/* Hive Weight */}
          <MetricCard
            title="Hive Total Weight"
            value="42.8"
            unit="kg"
            status="normal"
            statusLabel="Growing"
            trend={{ dir: 'up', text: '+1.2 kg (7 days)' }}
            aiSummary="Steady accumulation of nectar and brood."
            icon={Weight}
            iconColor="#7c3aed"
            sparklineData={weightHistory.map(w => ({ value: w.value }))}
            onViewDetails={() => setActiveDetailModal('Weight')}
          />

          {/* Audio Buzzing */}
          <MetricCard
            title="Acoustic Buzzing"
            value="67"
            unit="dB"
            status="normal"
            statusLabel="Stable"
            trend={{ dir: 'flat', text: 'Nominal frequency' }}
            aiSummary="Calm worker hum; no queen piping."
            icon={Volume2}
            iconColor="#0891b2"
            onViewDetails={() => setActiveDetailModal('Buzzing')}
          />

          {/* Air Quality / VOC */}
          <MetricCard
            title="Air Quality / VOC"
            value="78"
            unit="idx"
            status="normal"
            statusLabel="Good"
            trend={{ dir: 'flat', text: 'Clean air flow' }}
            aiSummary="Low volatile organic compound count."
            icon={Wind}
            iconColor="#16a34a"
            onViewDetails={() => setActiveDetailModal('AirQuality')}
          />
        </div>
      </div>

      {/* 5. Honey Prediction, Foraging Intelligence & Live Camera Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Honey Prediction Card */}
        <HoneyPredictionCard
          predictedRange="18–22 kg"
          confidence={87}
          trendText="↑ 12% vs last cycle"
          onViewDetails={() => navigate('/ai')}
        />

        {/* Foraging Intelligence Card */}
        <ForagingCard
          condition="Excellent"
          bestWindow="9:00 AM – 1:00 PM"
          onViewDetails={() => navigate('/analytics')}
        />

        {/* Camera Live Preview Card */}
        <div className="bg-white rounded-2xl border border-[#e8e3db] p-5 flex flex-col justify-between hover:border-[#d97706]/40 transition-all">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#2563eb]/10 flex items-center justify-center flex-shrink-0">
                  <Camera size={16} className="text-[#2563eb]" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-[#1c1917]">Live Entrance Camera</div>
                  <div className="text-[10px] text-[#78716c]">Hive A-01 · 1080p 24FPS</div>
                </div>
              </div>
              <StatusBadge status="live" label="● LIVE" size="sm" />
            </div>

            {/* Video preview thumbnail */}
            <div
              onClick={() => navigate('/camera')}
              className="relative aspect-[16/9] rounded-xl bg-[#1c1917] overflow-hidden cursor-pointer group mb-3 border border-[#e8e3db]"
            >
              {/* Honeycomb grid overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-10">
                <Layers size={48} className="text-white" />
              </div>

              {/* Simulated Detection Box */}
              <div className="absolute border border-[#16a34a] rounded px-1 text-[9px] text-[#16a34a] bg-black/40 font-mono-data left-1/4 top-1/3">
                Bee Cluster 96%
              </div>

              {/* Center Play indicator */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:scale-110 group-hover:bg-[#d97706] text-white transition-all">
                  <Play size={16} className="ml-0.5" />
                </div>
              </div>

              <div className="absolute bottom-2 left-2 right-2 flex justify-between text-[10px] text-white/70 bg-black/50 px-2 py-1 rounded backdrop-blur-sm">
                <span>124 Bees Active</span>
                <span>CV Confidence: 94%</span>
              </div>
            </div>

            <div className="text-[11px] text-[#57534e]">
              Computer vision confirms steady worker foraging with no swarming cluster behavior.
            </div>
          </div>

          <button
            onClick={() => navigate('/camera')}
            className="w-full flex items-center justify-center gap-1 pt-2.5 mt-2 border-t border-[#f0ede8] text-xs font-semibold text-[#d97706] hover:text-[#b45309] transition-colors"
          >
            <span>Open Live Video Feed</span>
            <ChevronRight size={13} />
          </button>
        </div>
      </div>

      {/* 6. Sensor → AI → Action Interactive Flow */}
      <SensorActionFlow
        flows={actionFlows}
        title="Sensor → AI Interpretation → Action Model"
        subtitle="Visualizing how live telemetry informs automated AI recommendations"
      />

      {/* 7. Quick Environmental Trends Chart */}
      <div className="bg-white rounded-2xl border border-[#e8e3db] p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="font-display font-semibold text-base text-[#1c1917]">
              Environmental & Activity Dynamics
            </h3>
            <p className="text-xs text-[#78716c]">
              Historical tracking with automated safe-zone reference lines
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Metric Switcher */}
            <div className="flex bg-[#f7f5f0] rounded-xl p-1 border border-[#e8e3db]">
              {(['Temperature', 'Humidity', 'Activity'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTrendMetric(tab)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all
                  ${
                    activeTrendMetric === tab
                      ? 'bg-white text-[#1c1917] shadow-sm'
                      : 'text-[#78716c] hover:text-[#1c1917]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Time range */}
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
        </div>

        {/* Chart area */}
        <div className="h-56 sm:h-64 -mx-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={currentTrend.data}>
              <defs>
                <linearGradient id="dashTrendGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={currentTrend.color} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={currentTrend.color} stopOpacity={0.0} />
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
                width={36}
              />
              <Tooltip content={<CustomChartTooltip />} />
              {currentTrend.refLineMin && (
                <ReferenceLine
                  y={currentTrend.refLineMin}
                  stroke="#16a34a"
                  strokeDasharray="4 2"
                  strokeOpacity={0.6}
                  label={{
                    value: currentTrend.refLabel,
                    fill: '#16a34a',
                    fontSize: 10,
                    position: 'insideTopRight',
                  }}
                />
              )}
              {currentTrend.refLineMax && (
                <ReferenceLine
                  y={currentTrend.refLineMax}
                  stroke="#d97706"
                  strokeDasharray="4 2"
                  strokeOpacity={0.6}
                />
              )}
              <Area
                type="monotone"
                dataKey="value"
                unit={currentTrend.unit}
                stroke={currentTrend.color}
                strokeWidth={2.5}
                fill="url(#dashTrendGrad)"
                dot={false}
                activeDot={{ r: 5, fill: currentTrend.color, stroke: '#fff', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
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
