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
  'Is Hive A-01 ready for honey harvest?',
  'Why did Hive A-02 temperature spike?',
  'What is the swarming risk across all hives?',
  'What is the optimal foraging window tomorrow?',
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
      } else if (text.toLowerCase().includes('spike') || text.toLowerCase().includes('temperature') || text.toLowerCase().includes('a-02')) {
        reply =
          '🌡 **Hive A-02 Analysis:** The temperature reached 36.4°C at 1:15 PM due to high ambient heat (31.8°C) and direct sun exposure. Worker fanning compensated effectively. Recommendation: Adjust entrance reducer or add a shade board.'
      } else if (text.toLowerCase().includes('swarm')) {
        reply =
          '🐝 **Swarming Assessment:** Swarm probability across all 4 hives is currently LOW (average 11%). Acoustic spectrum shows no queen piping signals (300–500 Hz), and vibration telemetry is in the calm 0.08–0.12g baseline.'
      } else if (text.toLowerCase().includes('foraging') || text.toLowerCase().includes('window')) {
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
        <div className="flex bg-[#f7f5f0] border border-[#e8e3db] rounded-xl p-1 self-start sm:self-auto mb-4 w-fit">
          {[
            { id: 'overview', label: 'Intelligence Overview' },
            { id: 'recommendations', label: `Action Items (${recommendations.filter(r => !r.reviewed).length})` },
            { id: 'assistant', label: 'Ask AI Assistant' },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all
              ${
                activeTab === t.id
                  ? 'bg-white text-[#1c1917] shadow-sm'
                  : 'text-[#78716c] hover:text-[#1c1917]'
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
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* AI Health Composite Score (cols 5) */}
            <div className="lg:col-span-5 bg-white rounded-2xl border border-[#e8e3db] p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-[#7c3aed]/15 flex items-center justify-center">
                      <BrainCircuit size={17} className="text-[#7c3aed]" />
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-base text-[#1c1917]">
                        AI Colony Health Index
                      </h3>
                      <div className="text-[11px] text-[#78716c]">Comprehensive Health Score</div>
                    </div>
                  </div>
                  <StatusBadge status="ai" label="✦ 94% CONFIDENCE" />
                </div>

                <div className="p-4 bg-[#faf5ff] border border-[#ddd6fe] rounded-xl mb-4 text-center">
                  <div className="text-xs font-semibold text-[#7c3aed] uppercase tracking-wider mb-1">
                    Overall Colony Health Rating
                  </div>
                  <div className="font-mono-data text-4xl lg:text-5xl font-extrabold text-[#1c1917] mb-1">
                    92 <span className="text-lg text-[#78716c] font-normal">/ 100</span>
                  </div>
                  <div className="inline-flex items-center gap-1 text-xs font-semibold text-[#16a34a] bg-[#f0fdf4] border border-[#bbf7d0] px-2.5 py-0.5 rounded-full">
                    <CheckCircle2 size={12} />
                    <span>Colony is Stable & High Producing</span>
                  </div>
                </div>

                <p className="text-xs text-[#57534e] leading-relaxed">
                  Evaluated across <strong>12 IoT parameters</strong> including brood thermodynamics, acoustic power spectrum, vibration stability, entrance flight vectors, and ambient flora availability.
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-[#f0ede8] flex items-center justify-between text-xs">
                <span className="text-[#78716c]">Edge Model: HiveSense-LLM v2.4</span>
                <span className="font-mono-data text-[#16a34a] font-semibold">● 0.08s latency</span>
              </div>
            </div>

            {/* AI Key Health Factors List (cols 7) */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-[#e8e3db] p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-display font-semibold text-base text-[#1c1917]">
                    Diagnostic Factor Breakdown
                  </h3>
                  <p className="text-xs text-[#78716c]">
                    Current health metrics evaluated against machine-learned apiary baselines
                  </p>
                </div>
                <span className="text-xs font-medium text-[#78716c]">6 Key Signals</span>
              </div>

              <div className="space-y-2.5">
                {[
                  {
                    icon: Thermometer,
                    color: '#d97706',
                    label: 'Thermoregulation Stability',
                    value: '34.2°C',
                    status: 'Normal · Brood Ideal',
                    score: 98,
                    desc: 'Internal brood core maintained within 33–35°C band with minimal deviation.',
                  },
                  {
                    icon: Droplets,
                    color: '#2563eb',
                    label: 'Humidity Homeostasis',
                    value: '62% RH',
                    status: 'Optimal Range',
                    score: 94,
                    desc: 'Moisture level prevents mold while keeping larval hydration adequate.',
                  },
                  {
                    icon: Activity,
                    color: '#16a34a',
                    label: 'Bee Foraging Throughput',
                    value: 'High Flight',
                    status: 'Active (124 bees)',
                    score: 91,
                    desc: 'Computer vision confirms sustained pollen collection and flight return rates.',
                  },
                  {
                    icon: Volume2,
                    color: '#0891b2',
                    label: 'Acoustic Colony Harmony',
                    value: '67 dB / 220 Hz',
                    status: 'Calm Worker Hum',
                    score: 95,
                    desc: 'Audio spectrum shows normal worker buzz; queen piping frequencies absent.',
                  },
                  {
                    icon: Wind,
                    color: '#16a34a',
                    label: 'Hive Airflow & VOC Index',
                    value: '78 index',
                    status: 'Good Ventilation',
                    score: 92,
                    desc: 'Safe volatile compound concentration with active convective air circulation.',
                  },
                  {
                    icon: Flower2,
                    color: '#db2777',
                    label: 'External Foraging Environment',
                    value: 'High Bloom',
                    status: 'Excellent Nectar',
                    score: 89,
                    desc: 'Weather and local vegetation offer prime flight windows between 9 AM and 1 PM.',
                  },
                ].map((factor, i) => {
                  const Icon = factor.icon
                  return (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-[#fcfbf9] border border-[#e8e3db] hover:border-[#d97706]/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: `${factor.color}15` }}
                        >
                          <Icon size={16} style={{ color: factor.color }} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-[#1c1917]">
                              {factor.label}
                            </span>
                            <span className="text-[10px] font-bold text-[#16a34a] bg-[#f0fdf4] border border-[#bbf7d0] px-1.5 py-0.2 rounded">
                              {factor.score}%
                            </span>
                          </div>
                          <p className="text-[11px] text-[#78716c] line-clamp-1">{factor.desc}</p>
                        </div>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between text-right pl-11 sm:pl-0">
                        <span className="font-mono-data text-xs font-bold text-[#1c1917]">
                          {factor.value}
                        </span>
                        <span className="text-[10px] text-[#78716c]">{factor.status}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Forward Looking Predictions: Honey & Foraging */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-display font-semibold text-base text-[#1c1917]">
                  Predictive Colony Intelligence
                </h3>
                <p className="text-xs text-[#78716c]">
                  Machine learning projections for production capacity and environmental forage
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
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
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-display font-semibold text-base text-[#1c1917]">
                  Prioritized AI Recommendations
                </h3>
                <p className="text-xs text-[#78716c]">
                  Recommended beekeeper interventions ordered by operational urgency
                </p>
              </div>
              <button
                onClick={() => setActiveTab('recommendations')}
                className="text-xs text-[#d97706] font-semibold hover:text-[#b45309] flex items-center gap-1"
              >
                View All Recommendations <ChevronRight size={13} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3 bg-white border border-[#e8e3db] rounded-2xl p-4">
            <div className="flex items-center gap-2">
              <Filter size={15} className="text-[#78716c]" />
              <span className="text-xs font-semibold text-[#1c1917]">Filter by Status:</span>
              <div className="flex gap-1.5">
                {(['all', 'pending', 'reviewed'] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => setRecFilter(f)}
                    className={`px-3 py-1 rounded-xl text-xs font-medium capitalize transition-all
                    ${
                      recFilter === f
                        ? 'bg-[#1c1917] text-white'
                        : 'bg-[#f7f5f0] text-[#78716c] hover:text-[#1c1917]'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <span className="text-xs text-[#78716c]">
              Showing {filteredRecs.length} of {recommendations.length} action items
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
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
        <div className="bg-white rounded-2xl border border-[#e8e3db] overflow-hidden flex flex-col h-[650px]">
          {/* Assistant Header */}
          <div className="p-4 bg-[#1c1917] text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#d97706]/20 border border-[#d97706]/40 flex items-center justify-center">
                <Bot size={20} className="text-[#fbbf24]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-bold text-sm text-white">HiveSense AI Copilot</h3>
                  <span className="bg-[#16a34a] text-white text-[9px] font-bold px-1.5 py-0.2 rounded uppercase">
                    Connected
                  </span>
                </div>
                <div className="text-[11px] text-white/50">
                  Trained on apiary thermodynamics, entomology & acoustic analysis
                </div>
              </div>
            </div>

            <div className="text-xs text-white/60 hidden sm:block">
              Telemetry Context: <strong className="text-white">All 4 Hives Active</strong>
            </div>
          </div>

          {/* Quick Prompt Chips */}
          <div className="p-3 bg-[#fcfbf9] border-b border-[#e8e3db] flex items-center gap-2 overflow-x-auto">
            <span className="text-[11px] font-semibold text-[#78716c] flex-shrink-0 flex items-center gap-1">
              <Sparkles size={11} className="text-[#7c3aed]" />
              Suggestions:
            </span>
            {promptChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(chip)}
                className="px-3 py-1 bg-white border border-[#e8e3db] hover:border-[#d97706]/50 rounded-full text-xs text-[#44403c] hover:text-[#1c1917] whitespace-nowrap transition-colors flex-shrink-0"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#f7f5f0]/50">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-3 max-w-2xl ${m.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0
                  ${m.role === 'user' ? 'bg-[#d97706] text-white' : 'bg-[#1c1917] text-[#fbbf24]'}`}
                >
                  {m.role === 'user' ? <User size={15} /> : <Bot size={15} />}
                </div>
                <div
                  className={`rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed shadow-sm
                  ${
                    m.role === 'user'
                      ? 'bg-[#d97706] text-white rounded-tr-none'
                      : 'bg-white border border-[#e8e3db] text-[#1c1917] rounded-tl-none'
                  }`}
                >
                  <p className="whitespace-pre-line">{m.text}</p>
                  <span
                    className={`text-[10px] mt-1 block ${
                      m.role === 'user' ? 'text-white/70' : 'text-[#a09890]'
                    }`}
                  >
                    {m.time}
                  </span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3 max-w-md">
                <div className="w-8 h-8 rounded-xl bg-[#1c1917] text-[#fbbf24] flex items-center justify-center flex-shrink-0">
                  <Bot size={15} />
                </div>
                <div className="bg-white border border-[#e8e3db] rounded-2xl rounded-tl-none p-3.5 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#d97706] animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-[#d97706] animate-bounce [animation-delay:0.2s]" />
                  <span className="w-2 h-2 rounded-full bg-[#d97706] animate-bounce [animation-delay:0.4s]" />
                  <span className="text-xs text-[#78716c] ml-1">Analyzing telemetry…</span>
                </div>
              </div>
            )}
          </div>

          {/* Chat Input Bar */}
          <div className="p-3 bg-white border-t border-[#e8e3db]">
            <form
              onSubmit={e => {
                e.preventDefault()
                handleSendMessage()
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={e => setInputMessage(e.target.value)}
                placeholder="Ask about colony health, temperature spikes, or honey harvesting…"
                className="flex-1 px-4 py-2.5 rounded-xl border border-[#e8e3db] bg-[#f7f5f0] text-xs sm:text-sm text-[#1c1917] placeholder:text-[#a09890] outline-none focus:border-[#d97706] focus:bg-white transition-all"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isTyping}
                className="px-4 py-2.5 rounded-xl bg-[#d97706] hover:bg-[#b45309] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <span>Send</span>
                <Send size={13} />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
