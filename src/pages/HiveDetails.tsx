import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Thermometer,
  Droplets,
  Weight,
  Activity,
  Volume2,
  Wind,
  Cpu,
  Camera,
  Layers,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Calendar,
  Plus,
  Radio,
  FileText,
} from 'lucide-react'
import StatusBadge from '../components/StatusBadge'
import MetricCard from '../components/MetricCard'
import SensorActionFlow, { SensorActionStep } from '../components/SensorActionFlow'
import { hives, temperatureHistory, humidityHistory } from '../data/mockData'

function HealthRing({ score, size = 68 }: { score: number; size?: number }) {
  const r = size / 2 - 5
  const c = 2 * Math.PI * r
  const filled = (score / 100) * c
  const color =
    score >= 90 ? '#16a34a' : score >= 75 ? '#d97706' : score >= 50 ? '#f59e0b' : '#dc2626'

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#f0ede8" strokeWidth="5" />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="5"
        strokeDasharray={`${filled} ${c}`}
        strokeLinecap="round"
      />
    </svg>
  )
}

export default function HiveDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const hive = hives.find(h => h.id === id) || hives[0]

  const [activeTab, setActiveTab] = useState<'telemetry' | 'hardware' | 'inspections'>('telemetry')
  const [inspections, setInspections] = useState([
    {
      id: 1,
      date: '2026-08-10',
      inspector: 'Disha Patel',
      queenSeen: true,
      broodPattern: 'Solid, healthy laying pattern',
      stores: 'High honey reserves',
      notes: 'Added super box #2. Colony is docile and actively drawing comb.',
    },
    {
      id: 2,
      date: '2026-07-27',
      inspector: 'Disha Patel',
      queenSeen: false,
      broodPattern: 'Fresh eggs & larvae present',
      stores: 'Medium stores',
      notes: 'No swarm cells detected. Cleaned bottom board entrance.',
    },
  ])
  const [newNote, setNewNote] = useState('')
  const [showAddNote, setShowAddNote] = useState(false)

  const handleAddInspection = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newNote.trim()) return
    const newItem = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      inspector: 'Disha Patel',
      queenSeen: true,
      broodPattern: 'Normal brood progression',
      stores: 'Adequate',
      notes: newNote,
    }
    setInspections([newItem, ...inspections])
    setNewNote('')
    setShowAddNote(false)
  }

  const hiveFlows: SensorActionStep[] = [
    {
      sensorName: 'Internal Core Temperature',
      reading: `${hive.temperature}`,
      readingUnit: '°C',
      status: hive.temperature > 35.5 ? 'attention' : 'normal',
      statusLabel: hive.temperature > 35.5 ? '⚠ Warm' : '✓ Normal',
      icon: Thermometer,
      iconColor: '#d97706',
      aiInterpretation:
        hive.temperature > 35.5
          ? 'Thermal spike detected during peak solar hours; worker fanning activated.'
          : 'Core brood temperature is regulated inside optimal 33–35°C band.',
      recommendation:
        hive.temperature > 35.5
          ? 'Adjust upper ventilation notch and inspect shade board.'
          : 'No intervention required today.',
      actionType: hive.temperature > 35.5 ? 'action-needed' : 'none',
    },
    {
      sensorName: 'Internal Humidity Sensor',
      reading: `${hive.humidity}`,
      readingUnit: '%',
      status: hive.humidity > 70 ? 'attention' : 'normal',
      statusLabel: hive.humidity > 70 ? '⚠ Moist' : '✓ Optimal',
      icon: Droplets,
      iconColor: '#2563eb',
      aiInterpretation: 'Safe relative humidity avoiding condensation near the brood perimeter.',
      recommendation: 'Maintain current hive configuration.',
      actionType: 'none',
    },
    {
      sensorName: 'Total Hive Weight',
      reading: `${hive.weight}`,
      readingUnit: 'kg',
      status: 'normal',
      statusLabel: `${hive.weightChange >= 0 ? '+' : ''}${hive.weightChange} kg/wk`,
      icon: Weight,
      iconColor: '#7c3aed',
      aiInterpretation: 'Positive nectar accumulation trajectory matches regional blossom cycle.',
      recommendation: 'Schedule next super box inspection within 7 days.',
      actionType: 'none',
    },
  ]

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-[1500px] mx-auto">
      {/* Back button & Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/hives')}
          className="flex items-center gap-1.5 text-xs font-semibold text-[#78716c] hover:text-[#1c1917] transition-colors"
        >
          <ArrowLeft size={14} /> Back to My Hives
        </button>
        <div className="text-xs text-[#78716c]">
          Hive ID: <strong className="text-[#1c1917]">{hive.id}</strong>
        </div>
      </div>

      {/* Hive Header Hero Card */}
      <div className="bg-white rounded-2xl border border-[#e8e3db] p-5 flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="relative flex-shrink-0">
            <HealthRing score={hive.healthScore} />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-mono-data text-sm font-bold text-[#1c1917]">
                {hive.healthScore}
              </span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="font-display font-bold text-xl text-[#1c1917]">{hive.name}</h2>
              <StatusBadge status={hive.status} size="sm" />
            </div>
            <p className="text-xs text-[#78716c]">
              Location: <strong>{hive.location}</strong> · Last Sync: {hive.lastUpdated}
            </p>
            <div className="flex items-center gap-3 text-xs mt-2">
              <span className="text-[#78716c]">
                Queen Status: <strong className="text-[#1c1917]">{hive.queenStatus}</strong>
              </span>
              <span className="text-[#a09890]">·</span>
              <span className="text-[#78716c]">
                Swarm Risk: <strong className="text-[#16a34a]">{hive.swarmingRisk} ({hive.swarmingRiskPct}%)</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Tab switchers */}
        <div className="flex bg-[#f7f5f0] border border-[#e8e3db] rounded-xl p-1 self-start md:self-auto">
          {[
            { id: 'telemetry', label: 'Live Telemetry' },
            { id: 'hardware', label: 'IoT Hardware' },
            { id: 'inspections', label: `Inspections (${inspections.length})` },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all
              ${
                activeTab === tab.id
                  ? 'bg-white text-[#1c1917] shadow-sm'
                  : 'text-[#78716c] hover:text-[#1c1917]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab 1: Live Telemetry */}
      {activeTab === 'telemetry' && (
        <div className="space-y-6">
          {/* 6 Essential Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="Core Temperature"
              value={hive.temperature}
              unit="°C"
              status={hive.temperature > 35.5 ? 'attention' : 'normal'}
              statusLabel={hive.temperature > 35.5 ? 'Warm' : 'Normal'}
              trend={{ dir: 'up', text: 'Brood zone' }}
              aiSummary="Steady incubation homeostasis."
              icon={Thermometer}
              iconColor="#d97706"
              sparklineData={temperatureHistory}
            />
            <MetricCard
              title="Internal Humidity"
              value={hive.humidity}
              unit="%"
              status={hive.humidity > 70 ? 'attention' : 'normal'}
              statusLabel={hive.humidity > 70 ? 'Moist' : 'Optimal'}
              trend={{ dir: 'down', text: 'Safe band' }}
              aiSummary="Normal evaporative curing."
              icon={Droplets}
              iconColor="#2563eb"
              sparklineData={humidityHistory}
            />
            <MetricCard
              title="Hive Scale Weight"
              value={hive.weight}
              unit="kg"
              status="normal"
              statusLabel={`${hive.weightChange >= 0 ? '+' : ''}${hive.weightChange} kg`}
              trend={{ dir: 'up', text: 'Weekly delta' }}
              aiSummary="Positive honey accumulation."
              icon={Weight}
              iconColor="#7c3aed"
            />
            <MetricCard
              title="Bee Flight Activity"
              value={hive.beeActivity}
              status="normal"
              statusLabel="Active"
              trend={{ dir: 'up', text: 'Peak flight' }}
              aiSummary="High pollen intake throughput."
              icon={Activity}
              iconColor="#16a34a"
            />
          </div>

          {/* Sensor -> AI -> Action Visual Flow */}
          <SensorActionFlow
            flows={hiveFlows}
            title={`${hive.name} Sensor-to-Action Diagnostics`}
            subtitle="Evaluating specific telemetry for this hive into concrete management decisions"
          />
        </div>
      )}

      {/* Tab 2: Hardware Device Telemetry */}
      {activeTab === 'hardware' && (
        <div className="bg-white rounded-2xl border border-[#e8e3db] p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#f0ede8]">
            <div>
              <h3 className="font-display font-semibold text-base text-[#1c1917]">
                Connected IoT Hardware Node
              </h3>
              <p className="text-xs text-[#78716c]">NVIDIA Jetson Nano Edge Unit + Multi-Sensor Array</p>
            </div>
            <StatusBadge status="live" label="● HARDWARE ONLINE" size="sm" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                name: 'BME680 Sensor',
                type: 'Internal Temperature, Humidity, Pressure, VOC',
                status: 'Optimal (10s sample)',
                rate: '100% Signal',
                color: '#d97706',
              },
              {
                name: 'LIS3DH Accelerometer',
                type: 'Hive Frame Vibration & Wing Fanning',
                status: 'Calibrated (200 Hz)',
                rate: '99.4% Signal',
                color: '#2563eb',
              },
              {
                name: 'INMP441 Microphone',
                type: 'Colony Acoustics & Piping Detection',
                status: 'Online (44.1 kHz)',
                rate: '99.8% Signal',
                color: '#0891b2',
              },
              {
                name: 'High-Precision Load Cell',
                type: 'Hive Weight Scale (Dual-Bridge)',
                status: 'Tared & Calibrated',
                rate: '100% Signal',
                color: '#7c3aed',
              },
              {
                name: 'Wide-Angle Optical Camera',
                type: 'Entrance Computer Vision (1080p 24FPS)',
                status: 'Real-time Streaming',
                rate: '41ms Latency',
                color: '#16a34a',
              },
              {
                name: 'Jetson Nano Edge AI Unit',
                type: 'Embedded Neural Network Inference',
                status: 'Firmware v2.4.1',
                rate: 'Temp: 44°C (Normal)',
                color: '#1c1917',
              },
            ].map(hw => (
              <div key={hw.name} className="p-4 rounded-xl bg-[#fcfbf9] border border-[#e8e3db] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-[#1c1917]">{hw.name}</span>
                  <span className="text-[10px] text-[#16a34a] font-bold bg-[#f0fdf4] border border-[#bbf7d0] px-2 py-0.5 rounded">
                    Online
                  </span>
                </div>
                <p className="text-xs text-[#78716c]">{hw.type}</p>
                <div className="flex justify-between text-[11px] text-[#57534e] pt-2 border-t border-[#f0ede8]">
                  <span>{hw.status}</span>
                  <span className="font-mono-data font-semibold">{hw.rate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Physical Inspections Log */}
      {activeTab === 'inspections' && (
        <div className="bg-white rounded-2xl border border-[#e8e3db] p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#f0ede8]">
            <div>
              <h3 className="font-display font-semibold text-base text-[#1c1917]">
                Beekeeper Physical Inspection Log
              </h3>
              <p className="text-xs text-[#78716c]">Combine on-site observations with continuous IoT data</p>
            </div>
            <button
              onClick={() => setShowAddNote(!showAddNote)}
              className="px-3 py-1.5 rounded-xl bg-[#d97706] hover:bg-[#b45309] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Plus size={13} />
              <span>Log Inspection</span>
            </button>
          </div>

          {showAddNote && (
            <form onSubmit={handleAddInspection} className="p-4 bg-[#f7f5f0] rounded-xl border border-[#e8e3db] space-y-3">
              <div className="text-xs font-bold text-[#1c1917]">New Inspection Record</div>
              <textarea
                value={newNote}
                onChange={e => setNewNote(e.target.value)}
                placeholder="Enter observations (e.g. brood comb coverage, queen spotting, honey stores, swarm cups)..."
                rows={3}
                className="w-full p-3 rounded-xl border border-[#e8e3db] bg-white text-xs text-[#1c1917] outline-none focus:border-[#d97706]"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddNote(false)}
                  className="px-3 py-1.5 rounded-xl bg-white border border-[#e8e3db] text-xs text-[#78716c]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-[#d97706] text-white text-xs font-semibold"
                >
                  Save Log
                </button>
              </div>
            </form>
          )}

          <div className="space-y-3">
            {inspections.map(item => (
              <div key={item.id} className="p-4 rounded-xl bg-[#fcfbf9] border border-[#e8e3db] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 font-semibold text-[#1c1917]">
                    <Calendar size={13} className="text-[#d97706]" />
                    <span>{item.date}</span>
                    <span className="text-[#a09890]">by</span>
                    <span>{item.inspector}</span>
                  </div>
                  <span className="text-[10px] text-[#16a34a] bg-[#f0fdf4] border border-[#bbf7d0] px-2 py-0.5 rounded font-bold">
                    {item.queenSeen ? '✓ Queen Spotted' : 'Queen Larvae Present'}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#57534e] bg-white p-2.5 rounded-lg border border-[#f0ede8]">
                  <div><strong>Brood Pattern:</strong> {item.broodPattern}</div>
                  <div><strong>Honey Stores:</strong> {item.stores}</div>
                </div>
                <p className="text-xs text-[#1c1917] leading-relaxed pt-1">{item.notes}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
