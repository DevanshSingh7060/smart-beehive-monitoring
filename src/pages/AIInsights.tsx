import React, { useState } from 'react'
import {
  Sparkles,
  Send,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  BrainCircuit,
  Scale,
  Flower2,
  Thermometer,
  Droplets,
  Activity,
  Wind,
  Volume2,
  ShieldAlert,
  Bot,
  User,
  ChevronRight,
  Filter,
  Check,
} from 'lucide-react'
import StatusBadge from '../components/StatusBadge'
import AIRecommendationCard, { RecommendationPriority } from '../components/AIRecommendationCard'
import HoneyPredictionCard from '../components/HoneyPredictionCard'
import ForagingCard from '../components/ForagingCard'
import DetailModal from '../components/DetailModal'
import { hives } from '../data/mockData'

const initialRecommendations = [
  {
    id: 1,
    priority: 'HIGH' as RecommendationPriority,
    title: 'Hive A-02 Brood Thermal Spike',
    issue: 'Temperature rose to 36.4°C during peak noon hours (+1.8°C above optimal colony baseline).',
    action: 'Inspect top hive entrance ventilation and ensure shading is unobstructed.',
    confidence: 94,
    reasoning:
      'Ambient external temperature exceeded 32°C while hive vibration indicated excessive fanning activity by workers.',
    metricImpact: 'Restores brood nest to 34.0–35.0°C within 3 hours.',
    reviewed: false,
  },
  {
    id: 2,
    priority: 'MEDIUM' as RecommendationPriority,
    title: 'Hive B-01 Foraging Optimization',
    issue: 'High floral nectar flow detected within 1.5 km radius, but entrance traffic is constrained.',
    action: 'Remove entrance reducer to expand forager flight lanes for morning peak window.',
    confidence: 89,
    reasoning:
      'Surrounding mustard bloom density is at peak (92%). Widening entrance prevents flight bottleneck between 9 AM and 1 PM.',
    metricImpact: '+0.4 kg/day additional honey accumulation rate.',
    reviewed: false,
  },
  {
    id: 3,
    priority: 'LOW' as RecommendationPriority,
    title: 'Hive A-01 Super Box Addition',
    issue: 'Steady weight gain (+1.2 kg in 7 days) indicates 80% brood frame occupancy.',
    action: 'Prepare a honey super box for installation within next 5 days.',
    confidence: 91,
    reasoning:
      'Acoustic spectrum indicates active comb construction; honey reserves are nearing threshold for next chamber.',
    metricImpact: 'Prevents mid-season swarming impulse by providing comb expansion room.',
    reviewed: true,
  },
]

const promptChips = [
  'Is Hive A-01 ready for harvest?',
  'Why did Hive A-02 temp spike?',
  'What is the swarming risk?',
  'Best foraging window tomorrow?',
]

export default function AIInsights() {
  const [activeTab, setActiveTab] = useState<'overview' | 'recommendations' | 'assistant'>('overview')
  const [recFilter, setRecFilter] = useState<'all' | 'pending' | 'reviewed'>('all')
  const [recommendations, setRecommendations] = useState(initialRecommendations)
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: 'Hello Disha! I am your HiveSense AI Assistant. I continuously evaluate telemetry across all 4 hives. Ask me about colony health, swarm detection, thermal stability, or honey yields.',
      time: 'Just now',
    },
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputMessage
    if (!text.trim()) return

    const newMsgs = [...messages, { role: 'user', text, time: 'Just now' }]
    setMessages(newMsgs)
    setInputMessage('')
    setIsTyping(true)

    setTimeout(() => {
      let reply =
        'Based on real-time sensor analysis, your hives are exhibiting stable colony dynamics. Brood core temperature is steady at 34.2°C, and acoustics indicate a fertile queen with low swarming impulse (12%).'

      if (text.toLowerCase().includes('harvest') || text.toLowerCase().includes('honey')) {
        reply =
          '🍯 **Honey Harvest Forecast:** Hive A-01 currently holds 42.8 kg total weight with an estimated harvestable yield of 18–22 kg. Honey moisture index is stabilizing. Recommended harvest window: Next 10–14 days during dry weather.'
      } else if (text.toLowerCase().includes('spike') || text.toLowerCase().includes('temp') || text.toLowerCase().includes('a-02')) {
        reply =
          '🌡 **Hive A-02 Analysis:** The temperature reached 36.4°C at 1:15 PM due to high ambient heat (31.8°C) and direct sun exposure. Worker fanning compensated effectively. Recommendation: Adjust entrance reducer or add a shade board.'
      } else if (text.toLowerCase().includes('swarm')) {
        reply =
          '🐝 **Swarming Assessment:** Swarm probability across all 4 hives is currently LOW (average 11%). Acoustic spectrum shows no queen piping signals (300–500 Hz), and vibration telemetry is in the calm 0.08–0.12g baseline.'
      } else if (text.toLowerCase().includes('forag') || text.toLowerCase().includes('window')) {
        reply =
          '🌸 **Foraging Intelligence:** Tomorrow morning between 9:00 AM and 1:00 PM will offer optimal foraging conditions (25–27°C, low wind < 9 km/h, 0% precipitation). Mustard and acacia blooms are active within 1.2 km.'
      }

      setMessages(prev => [...prev, { role: 'assistant', text: reply, time: 'Just now' }])
      setIsTyping(false)
    }, 900)
  }

  const filteredRecs = recommendations.filter(r => {
    if (recFilter === 'pending') return !r.reviewed
    if (recFilter === 'reviewed') return r.reviewed
    return true
  })

  return (
    <div className="space-y-6">

        {/* Top Navigation Tabs */}
        <div className="flex glass-panel border border-white/10 rounded-2xl p-1.5 self-start sm:self-auto mb-6 w-fit shadow-lg">
          {[
            { id: 'overview', label: 'Intelligence Overview' },
            { id: 'recommendations', label: `Action Items (${recommendations.filter(r => !r.reviewed).length})` },
            { id: 'assistant', label: 'Ask AI Assistant' },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold tracking-wide uppercase transition-all
              ${
                activeTab === t.id
                  ? 'bg-white/10 text-white shadow-[0_0_10px_rgba(255,255,255,0.1)] border border-white/20'
                  : 'text-white/50 hover:text-white/80 border border-transparent hover:bg-white/5'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

      {/* View: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Top Grid: Health Assessment & Factors */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* AI Health Composite Score (cols 5) */}
            <div className="lg:col-span-5 glass-panel-elevated rounded-3xl p-6 lg:p-8 flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute -left-20 -top-20 w-64 h-64 bg-[#7c3aed]/10 rounded-full blur-[60px] pointer-events-none group-hover:bg-[#7c3aed]/20 transition-all duration-700" />
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#7c3aed]/20 flex items-center justify-center border border-[#7c3aed]/30 shadow-[0_0_15px_rgba(124,58,237,0.2)]">
                      <BrainCircuit size={24} className="text-[#a78bfa]" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-lg text-white ai-glow-text tracking-wide uppercase">
                        AI Colony Health
                      </h3>
                      <div className="text-xs font-semibold text-white/50 tracking-wider uppercase mt-1">Composite Score</div>
                    </div>
                  </div>
                  <StatusBadge status="ai" label="✦ 94% CONF" />
                </div>

                <div className="p-6 bg-black/40 border border-[#7c3aed]/20 rounded-2xl mb-6 text-center shadow-inner relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#7c3aed]/10 to-transparent opacity-50" />
                  
                  <div className="relative z-10">
                    <div className="text-xs font-bold text-[#a78bfa] uppercase tracking-widest mb-2">
                      Overall Rating
                    </div>
                    <div className="font-mono-data text-5xl lg:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-[#a78bfa] mb-3 filter drop-shadow-[0_0_10px_rgba(167,139,250,0.5)]">
                      92 <span className="text-2xl text-white/40 font-bold">/100</span>
                    </div>
                    <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-[#4ade80] bg-[#4ade80]/10 border border-[#4ade80]/20 px-3 py-1 rounded-full uppercase shadow-[0_0_10px_rgba(74,222,128,0.2)]">
                      <CheckCircle2 size={14} />
                      <span>Stable & Producing</span>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-white/60 leading-relaxed font-medium">
                  Evaluated across <strong className="text-white">12 IoT parameters</strong> including brood thermodynamics, acoustic power spectrum, vibration stability, entrance flight vectors, and ambient flora availability.
                </p>
              </div>

              <div className="pt-5 mt-6 border-t border-white/10 flex items-center justify-between text-xs relative z-10 font-bold tracking-wider uppercase text-white/40">
                <span>Model: HiveSense-v2.4</span>
                <span className="font-mono-data text-[#4ade80] flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] live-dot" /> 0.08s</span>
              </div>
            </div>

            {/* AI Key Health Factors List (cols 7) */}
            <div className="lg:col-span-7 glass-panel rounded-3xl p-6 lg:p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-display font-bold text-lg text-white uppercase tracking-wide">
                    Diagnostic Breakdown
                  </h3>
                  <p className="text-sm text-white/50 mt-1 font-medium">
                    Current health metrics evaluated against apiary baselines
                  </p>
                </div>
                <span className="text-xs font-bold tracking-widest uppercase text-white/40 bg-white/5 px-3 py-1 rounded-lg border border-white/10">6 Signals</span>
              </div>

              <div className="space-y-3">
                {[
                  {
                    icon: Thermometer,
                    color: '#fbbf24',
                    bg: 'rgba(251,191,36,0.1)',
                    border: 'rgba(251,191,36,0.2)',
                    label: 'Thermoregulation',
                    value: '34.2°C',
                    status: 'Brood Ideal',
                    score: 98,
                    desc: 'Internal brood core maintained within 33–35°C band.',
                  },
                  {
                    icon: Droplets,
                    color: '#60a5fa',
                    bg: 'rgba(96,165,250,0.1)',
                    border: 'rgba(96,165,250,0.2)',
                    label: 'Humidity Homeostasis',
                    value: '62% RH',
                    status: 'Optimal',
                    score: 94,
                    desc: 'Moisture level prevents mold while hydrating larvae.',
                  },
                  {
                    icon: Activity,
                    color: '#4ade80',
                    bg: 'rgba(74,222,128,0.1)',
                    border: 'rgba(74,222,128,0.2)',
                    label: 'Foraging Throughput',
                    value: 'High Flight',
                    status: 'Active (124/m)',
                    score: 91,
                    desc: 'Sustained pollen collection and flight return rates.',
                  },
                  {
                    icon: Volume2,
                    color: '#22d3ee',
                    bg: 'rgba(34,211,238,0.1)',
                    border: 'rgba(34,211,238,0.2)',
                    label: 'Acoustic Harmony',
                    value: '67 dB / 220Hz',
                    status: 'Calm Hum',
                    score: 95,
                    desc: 'Audio spectrum shows normal worker buzz.',
                  },
                  {
                    icon: Wind,
                    color: '#4ade80',
                    bg: 'rgba(74,222,128,0.1)',
                    border: 'rgba(74,222,128,0.2)',
                    label: 'Airflow & VOC Index',
                    value: '78 index',
                    status: 'Good Vent.',
                    score: 92,
                    desc: 'Safe volatile compound concentration with active flow.',
                  },
                  {
                    icon: Flower2,
                    color: '#f472b6',
                    bg: 'rgba(244,114,182,0.1)',
                    border: 'rgba(244,114,182,0.2)',
                    label: 'Foraging Environment',
                    value: 'High Bloom',
                    status: 'Prime Nectar',
                    score: 89,
                    desc: 'Weather and vegetation offer prime flight windows.',
                  },
                ].map((factor, i) => {
                  const Icon = factor.icon
                  return (
                    <div
                      key={i}
                      className="p-3.5 lg:p-4 rounded-2xl bg-black/20 border border-white/5 hover:border-white/20 hover:bg-white/5 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110"
                          style={{ backgroundColor: factor.bg, border: `1px solid ${factor.border}` }}
                        >
                          <Icon size={18} style={{ color: factor.color }} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2.5 mb-1">
                            <span className="text-sm font-bold text-white tracking-wide">
                              {factor.label}
                            </span>
                            <span className="text-[10px] font-bold tracking-widest text-[#4ade80] bg-[#4ade80]/10 border border-[#4ade80]/30 px-1.5 py-0.5 rounded shadow-[0_0_10px_rgba(74,222,128,0.1)]">
                              {factor.score}%
                            </span>
                          </div>
                          <p className="text-xs text-white/50 font-medium line-clamp-1">{factor.desc}</p>
                        </div>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between text-right pl-14 sm:pl-0">
                        <span className="font-mono-data text-sm font-bold text-white mb-0.5">
                          {factor.value}
                        </span>
                        <span className="text-[10px] font-bold tracking-wider uppercase text-white/40">{factor.status}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Forward Looking Predictions: Honey & Foraging */}
          <div>
            <div className="flex items-center justify-between mb-4 mt-8">
              <div>
                <h3 className="font-display font-bold text-lg text-white uppercase tracking-wide">
                  Predictive Intelligence
                </h3>
                <p className="text-sm text-white/50 font-medium mt-1">
                  Machine learning projections for production capacity and environmental forage
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <HoneyPredictionCard
                predictedRange="18–22 kg"
                confidence={87}
                trendText="↑ 12% vs last season"
              />
              <ForagingCard condition="Excellent" bestWindow="9:00 AM – 1:00 PM" />
            </div>
          </div>

          {/* Action Recommendations Preview */}
          <div>
            <div className="flex items-center justify-between mb-4 mt-8">
              <div>
                <h3 className="font-display font-bold text-lg text-white uppercase tracking-wide flex items-center gap-2">
                  <AlertTriangle size={18} className="text-[#fbbf24]"/>
                  Prioritized Recommendations
                </h3>
                <p className="text-sm text-white/50 font-medium mt-1">
                  Beekeeper interventions ordered by operational urgency
                </p>
              </div>
              <button
                onClick={() => setActiveTab('recommendations')}
                className="text-xs font-bold uppercase tracking-wider text-[#fbbf24] hover:text-white flex items-center gap-1 transition-colors bg-[#fbbf24]/10 border border-[#fbbf24]/20 px-3 py-1.5 rounded-lg"
              >
                View All <ChevronRight size={14} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recommendations.slice(0, 3).map(rec => (
                <AIRecommendationCard
                  key={rec.id}
                  {...rec}
                  onMarkReviewed={() => {
                    setRecommendations(recs =>
                      recs.map(r => (r.id === rec.id ? { ...r, reviewed: !r.reviewed } : r))
                    )
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* View: Recommendations Full List */}
      {activeTab === 'recommendations' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between gap-4 glass-panel border border-white/10 rounded-2xl p-5">
            <div className="flex items-center gap-3">
              <Filter size={18} className="text-[#fbbf24]" />
              <span className="text-sm font-bold uppercase tracking-wider text-white">Filter by Status:</span>
              <div className="flex gap-2">
                {(['all', 'pending', 'reviewed'] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => setRecFilter(f)}
                    className={`px-4 py-1.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all
                    ${
                      recFilter === f
                        ? 'bg-white text-black shadow-[0_0_10px_rgba(255,255,255,0.3)]'
                        : 'bg-white/5 text-white/60 hover:text-white border border-white/10 hover:bg-white/10'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <span className="text-xs font-bold uppercase tracking-wider text-white/40 bg-black/30 px-3 py-1.5 rounded-lg border border-white/5">
              Showing {filteredRecs.length} of {recommendations.length} action items
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecs.map(rec => (
              <AIRecommendationCard
                key={rec.id}
                {...rec}
                onMarkReviewed={() => {
                  setRecommendations(recs =>
                    recs.map(r => (r.id === rec.id ? { ...r, reviewed: !r.reviewed } : r))
                  )
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* View: AI Chat Assistant */}
      {activeTab === 'assistant' && (
        <div className="glass-panel-elevated rounded-3xl border border-white/10 overflow-hidden flex flex-col h-[700px] shadow-2xl relative">
          
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#7c3aed]/5 rounded-full blur-[100px] pointer-events-none" />

          {/* Assistant Header */}
          <div className="p-5 lg:p-6 bg-black/40 border-b border-white/10 flex items-center justify-between relative z-10 backdrop-blur-md">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#a78bfa]/20 border border-[#a78bfa]/40 flex items-center justify-center shadow-[0_0_20px_rgba(167,139,250,0.2)] relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#a78bfa]/20 to-transparent rounded-2xl" />
                <Bot size={24} className="text-[#c4b5fd] relative z-10" />
              </div>
              <div>
                <div className="flex items-center gap-2.5 mb-1">
                  <h3 className="font-display font-bold text-lg text-white tracking-wide ai-glow-text">HiveSense Copilot</h3>
                  <span className="bg-[#4ade80]/10 border border-[#4ade80]/30 text-[#4ade80] text-[10px] font-bold tracking-widest px-2 py-0.5 rounded shadow-[0_0_10px_rgba(74,222,128,0.2)] uppercase flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] live-dot"/>
                    Connected
                  </span>
                </div>
                <div className="text-xs font-medium text-white/50">
                  Trained on apiary thermodynamics, entomology & acoustic analysis
                </div>
              </div>
            </div>

            <div className="text-xs font-bold uppercase tracking-wider text-white/40 hidden sm:block bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg">
              Telemetry Context: <strong className="text-[#a78bfa]">All 4 Hives Active</strong>
            </div>
          </div>

          {/* Quick Prompt Chips */}
          <div className="p-4 bg-black/20 border-b border-white/5 flex items-center gap-3 overflow-x-auto relative z-10">
            <span className="text-[10px] font-bold tracking-widest uppercase text-white/40 flex-shrink-0 flex items-center gap-1.5">
              <Sparkles size={12} className="text-[#a78bfa]" />
              Suggestions:
            </span>
            {promptChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(chip)}
                className="px-4 py-1.5 bg-white/5 border border-white/10 hover:border-[#a78bfa]/50 hover:bg-[#a78bfa]/10 rounded-full text-xs font-semibold text-white/70 hover:text-white whitespace-nowrap transition-all"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-6 overflow-y-auto space-y-6 relative z-10">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-4 max-w-[85%] ${m.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
              >
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg border
                  ${m.role === 'user' ? 'bg-[#fbbf24]/20 text-[#fbbf24] border-[#fbbf24]/30' : 'bg-black/60 text-[#a78bfa] border-white/10'}`}
                >
                  {m.role === 'user' ? <User size={18} /> : <Bot size={18} />}
                </div>
                <div
                  className={`rounded-2xl p-4 sm:p-5 text-sm leading-relaxed border backdrop-blur-md shadow-xl
                  ${
                    m.role === 'user'
                      ? 'bg-[#fbbf24]/10 text-white border-[#fbbf24]/20 rounded-tr-sm'
                      : 'bg-black/40 border-white/10 text-gray-200 rounded-tl-sm'
                  }`}
                >
                  <p className="whitespace-pre-line font-medium text-[13px] sm:text-[14px]">{m.text}</p>
                  <span
                    className={`text-[10px] mt-2 block font-bold uppercase tracking-widest ${
                      m.role === 'user' ? 'text-[#fbbf24]/60' : 'text-white/40'
                    }`}
                  >
                    {m.time}
                  </span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-4 max-w-md">
                <div className="w-10 h-10 rounded-2xl bg-black/60 border border-white/10 text-[#a78bfa] flex items-center justify-center flex-shrink-0 shadow-lg">
                  <Bot size={18} />
                </div>
                <div className="bg-black/40 border border-white/10 rounded-2xl rounded-tl-sm p-4 flex items-center gap-2 backdrop-blur-md">
                  <span className="w-2 h-2 rounded-full bg-[#a78bfa] animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-[#a78bfa] animate-bounce [animation-delay:0.2s]" />
                  <span className="w-2 h-2 rounded-full bg-[#a78bfa] animate-bounce [animation-delay:0.4s]" />
                  <span className="text-xs font-bold tracking-widest uppercase text-white/50 ml-2">Analyzing telemetry…</span>
                </div>
              </div>
            )}
          </div>

          {/* Chat Input Bar */}
          <div className="p-4 lg:p-5 bg-black/60 border-t border-white/10 backdrop-blur-xl relative z-10">
            <form
              onSubmit={e => {
                e.preventDefault()
                handleSendMessage()
              }}
              className="flex items-center gap-3 max-w-5xl mx-auto"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={e => setInputMessage(e.target.value)}
                placeholder="Ask about colony health, temperature spikes, or honey harvesting…"
                className="flex-1 px-5 py-3.5 rounded-2xl border border-white/10 bg-white/5 text-sm text-white placeholder:text-white/30 outline-none focus:border-[#a78bfa]/50 focus:bg-[#a78bfa]/5 transition-all shadow-inner font-medium"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isTyping}
                className="px-6 py-3.5 rounded-2xl bg-[#a78bfa]/20 border border-[#a78bfa]/40 hover:bg-[#a78bfa]/30 text-[#c4b5fd] text-sm font-bold uppercase tracking-wider flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(167,139,250,0.15)]"
              >
                <span>Send</span>
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
