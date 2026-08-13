import { useState, useRef, useEffect } from 'react'
import { BrainCircuit, Send, Mic, Trash2, Sparkles, TrendingUp, Thermometer, AlertTriangle, Scale } from 'lucide-react'

const insightCards = [
  {
    icon: BrainCircuit, color: '#16a34a', bg: '#f0fdf4', border: '#16a34a20',
    title: 'Hive Health', confidence: 96,
    body: 'Your hive is currently healthy based on environmental and behavioral indicators. All sensor readings are within expected parameters.',
    risk: null, riskLabel: 'Healthy',
  },
  {
    icon: AlertTriangle, color: '#d97706', bg: '#fffbeb', border: '#d9770620',
    title: 'Swarming Risk', confidence: 89,
    body: 'Swarming risk is currently low. Buzzing and movement patterns remain within normal ranges. No preparation behaviors detected.',
    risk: 12, riskLabel: 'Low Risk',
  },
  {
    icon: Thermometer, color: '#2563eb', bg: '#eff6ff', border: '#2563eb20',
    title: 'Environmental Analysis', confidence: 97,
    body: 'Temperature (34.2°C) and humidity (62%) are stable and within the configured optimal range. Atmospheric pressure is nominal.',
    risk: null, riskLabel: 'Optimal',
  },
  {
    icon: Scale, color: '#7c3aed', bg: '#faf5ff', border: '#7c3aed20',
    title: 'Productivity Insight', confidence: 92,
    body: 'Hive weight has increased by +1.8% over the past 7 days, indicating positive colony activity and potential honey accumulation.',
    risk: null, riskLabel: 'Trending Up',
  },
]

const riskIndicators = [
  { label: 'Swarming Risk', level: 'Low', pct: 12, color: '#16a34a', reason: 'Normal buzzing patterns, stable population', confidence: 89 },
  { label: 'Queenlessness Risk', level: 'Low', pct: 6, color: '#16a34a', reason: 'Regular brood patterns detected', confidence: 94 },
  { label: 'Disease Pattern Risk', level: 'Low', pct: 8, color: '#16a34a', reason: 'No abnormal behavioral markers', confidence: 91 },
  { label: 'Environmental Stress', level: 'Low', pct: 14, color: '#16a34a', reason: 'All conditions within optimal range', confidence: 96 },
  { label: 'Disturbance Risk', level: 'Moderate', pct: 31, color: '#d97706', reason: 'Slightly elevated vibration detected', confidence: 76 },
]

const initialMessages = [
  {
    role: 'assistant' as const,
    text: "Hello! I'm the HiveSense AI Assistant. I can help you understand your hive data, explain sensor readings, and provide insights about bee behavior. What would you like to know?",
  },
  {
    role: 'user' as const,
    text: "Why did Hive A-02 lose weight yesterday?",
  },
  {
    role: 'assistant' as const,
    text: "Hive A-02 experienced a 1.4 kg decrease in weight over the previous 24 hours. This occurred alongside elevated buzzing activity (82 dB vs normal 60–65 dB) and increased bee movement patterns.\n\nThese changes may indicate:\n• Increased colony activity with higher energy expenditure\n• Possible preparation behaviors associated with swarming\n• Reduced foraging returns in the area\n\nConsider reviewing the hive's recent trends in the Analytics section and scheduling an inspection when appropriate. The swarming risk indicator is currently at 74% for this hive.",
  },
]

const suggestions = [
  "Is my hive healthy?",
  "Why did the hive weight change?",
  "Is there a swarming risk?",
  "What changed in the last 24 hours?",
  "Explain today's alerts.",
  "Compare my hives.",
]

const aiResponses: Record<string, string> = {
  "Is my hive healthy?": "Based on current sensor readings for Hive A-01: Health Score is 94/100, which is in the Healthy range. Temperature (34.2°C) and humidity (62%) are both within optimal parameters. Hive weight has been trending upward (+1.8% this week). Bee activity is High, with 124 bees detected in the last camera snapshot. No critical alerts are active for this hive.",
  "Is there a swarming risk?": "For Hive A-01, the estimated swarming risk is currently Low at 12%. Buzzing patterns remain within normal range (67 dB), and no unusual movement signatures have been detected. However, Hive A-02 shows a High swarming risk (74%) — elevated buzzing, decreased weight, and atypical movement patterns were all detected in the last 8 hours. I recommend inspecting Hive A-02 soon.",
  "What changed in the last 24 hours?": "In the past 24 hours across your apiary:\n\n🔴 Hive A-02: Weight decreased by 1.4 kg. Buzzing activity rose to 82 dB. Swarming risk elevated to High.\n\n🟡 Hive B-01: Vibration sensor detected an unusual pattern at 9:45 AM. Readings have since stabilized.\n\n🟢 Hive A-01 and B-02: Both performing within expected parameters. Weight trending upward.",
  "Explain today's alerts.": "There are 2 active alerts today:\n\n1. 🔴 Critical — Possible Swarming Behavior (Hive A-02): Detected at 10:32 AM with 89% AI confidence. Elevated buzzing, unusual movement, and -1.4 kg weight drop triggered this alert. Immediate inspection recommended.\n\n2. 🟡 Warning — Unusual Vibration (Hive B-01): Detected at 9:45 AM with 76% confidence. Vibration sensor recorded irregular patterns. Monitor closely.",
}

export default function AIInsights() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState(initialMessages)
  const [thinking, setThinking] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, thinking])

  const sendMessage = async (text: string) => {
    if (!text.trim()) return
    const userMsg = { role: 'user' as const, text }
    setMessages(m => [...m, userMsg])
    setInput('')
    setThinking(true)
    await new Promise(r => setTimeout(r, 900 + Math.random() * 600))
    const resp = aiResponses[text] ?? "That's a great question about your hive data. Based on current readings from your apiary, everything appears to be within normal parameters. For Hive A-01, the health score is 94 and conditions are stable. If you'd like me to analyze a specific metric or hive, just let me know."
    setMessages(m => [...m, { role: 'assistant', text: resp }])
    setThinking(false)
  }

  return (
    <div className="p-4 lg:p-6 max-w-[1600px] space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-[#1c1917]">AI Insights</h1>
        <p className="text-[#78716c] text-sm mt-1">Understand what your hive data means.</p>
      </div>

      {/* Insight cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {insightCards.map(c => (
          <div key={c.title} className="rounded-2xl border p-5 transition-all hover:shadow-md" style={{ borderColor: c.border, backgroundColor: c.bg }}>
            <div className="flex items-start justify-between mb-3">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${c.color}15` }}>
                <c.icon size={15} style={{ color: c.color }} />
              </div>
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full border" style={{ color: c.color, borderColor: `${c.color}30`, backgroundColor: 'white' }}>
                {c.riskLabel}
              </span>
            </div>
            <div className="font-display font-semibold text-[#1c1917] text-sm mb-2">{c.title}</div>
            <p className="text-[#78716c] text-xs leading-relaxed mb-3">{c.body}</p>
            <div className="flex items-center gap-1.5">
              <Sparkles size={10} style={{ color: c.color }} />
              <span className="text-[10px]" style={{ color: c.color }}>AI Confidence: {c.confidence}%</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Risk indicators */}
        <div className="bg-white rounded-2xl border border-[#e8e3db] p-5">
          <h2 className="font-display font-semibold text-[#1c1917] text-base mb-1">AI Risk Indicators</h2>
          <p className="text-[#78716c] text-xs mb-4">Estimated risks — not guaranteed diagnoses. AI confidence shown per indicator.</p>
          <div className="space-y-4">
            {riskIndicators.map(r => (
              <div key={r.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-[#1c1917]">{r.label}</span>
                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full" style={{ color: r.color, backgroundColor: `${r.color}12` }}>{r.level}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono-data text-sm font-medium" style={{ color: r.color }}>{r.pct}%</span>
                    <span className="text-[#a09890] text-[10px] ml-1">est. risk</span>
                  </div>
                </div>
                <div className="h-1.5 bg-[#f0ede8] rounded-full overflow-hidden mb-1">
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${r.pct}%`, backgroundColor: r.color }} />
                </div>
                <div className="flex justify-between text-[10px] text-[#a09890]">
                  <span>{r.reason}</span>
                  <span>Confidence: {r.confidence}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Chat */}
        <div className="bg-white rounded-2xl border border-[#e8e3db] flex flex-col" style={{ minHeight: '480px', maxHeight: '560px' }}>
          <div className="flex items-center gap-2 p-4 border-b border-[#f0ede8]">
            <div className="w-8 h-8 rounded-xl bg-[#d97706]/10 flex items-center justify-center">
              <BrainCircuit size={14} className="text-[#d97706]" />
            </div>
            <div>
              <div className="font-display font-semibold text-[#1c1917] text-sm">HiveSense AI Assistant</div>
              <div className="text-[#78716c] text-[10px]">Ask questions about your hive data</div>
            </div>
            <button onClick={() => setMessages(initialMessages.slice(0, 1))} className="ml-auto text-[#a09890] hover:text-[#78716c] transition-colors">
              <Trash2 size={13} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed whitespace-pre-line
                  ${m.role === 'user'
                    ? 'bg-[#d97706] text-white rounded-br-sm'
                    : 'bg-[#f7f5f0] text-[#1c1917] rounded-bl-sm border border-[#e8e3db]'
                  }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {thinking && (
              <div className="flex justify-start">
                <div className="bg-[#f7f5f0] border border-[#e8e3db] px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1.5 items-center">
                  {[0, 1, 2].map(i => (
                    <span key={i} className="w-1.5 h-1.5 bg-[#a09890] rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Suggestions */}
          <div className="px-4 pb-2 flex gap-1.5 overflow-x-auto">
            {suggestions.slice(0, 4).map(s => (
              <button key={s} onClick={() => sendMessage(s)}
                className="flex-shrink-0 px-2.5 py-1 rounded-lg bg-[#f7f5f0] border border-[#e8e3db] text-[#78716c] text-[10px] hover:border-[#d97706]/40 hover:text-[#d97706] transition-colors">
                {s}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="p-3 border-t border-[#f0ede8]">
            <div className="flex items-center gap-2 bg-[#f7f5f0] rounded-xl border border-[#e8e3db] px-3 py-2">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage(input)}
                placeholder="Ask about your hive data…"
                className="flex-1 bg-transparent text-xs text-[#1c1917] placeholder:text-[#a09890] outline-none"
              />
              <button className="text-[#a09890] hover:text-[#78716c]"><Mic size={13} /></button>
              <button onClick={() => sendMessage(input)} disabled={!input.trim()}
                className="w-6 h-6 rounded-lg bg-[#d97706] flex items-center justify-center text-white disabled:opacity-40 transition-opacity">
                <Send size={11} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
