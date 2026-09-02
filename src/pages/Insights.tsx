import React, { useState } from 'react'
import { Sparkles, BrainCircuit, Activity, BarChart2 } from 'lucide-react'
import AIInsights from './AIInsights'
import Analytics from './Analytics'

export default function Insights() {
  const [activeTab, setActiveTab] = useState<'ai' | 'analytics'>('ai')

  return (
    <div className="p-4 lg:p-6 lg:px-8 space-y-6 max-w-[1600px] mx-auto text-gray-200">
      {/* Unified Header */}
      <div className="glass-panel-elevated rounded-3xl p-6 lg:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute -left-10 -top-10 w-40 h-40 bg-[#7c3aed]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[10px] font-bold text-[#a78bfa] uppercase tracking-wider flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#7c3aed]/10 border border-[#7c3aed]/20 ai-glow-border">
              <Sparkles size={12} className="text-[#a78bfa]" />
              APIARY INTELLIGENCE
            </span>
          </div>
          <h2 className="font-display text-2xl lg:text-3xl font-bold text-[var(--text-primary)] tracking-tight">
            Insights & Analytics
          </h2>
          <p className="text-sm text-[var(--text-tertiary)] mt-1.5 max-w-xl leading-relaxed">
            Historical telemetry, AI predictions, and actionable recommendations.
          </p>
        </div>

        {/* Top Navigation Tabs */}
        <div className="flex glass-panel border border-[var(--border-subtle)] rounded-2xl p-1.5 self-start lg:self-auto relative z-10">
          <button
            onClick={() => setActiveTab('ai')}
            className={`px-5 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'ai'
                ? 'bg-[#7c3aed]/20 text-[#c4b5fd] shadow-[0_0_15px_rgba(124,58,237,0.2)] border border-[#7c3aed]/30'
                : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
            }`}
          >
            <BrainCircuit size={16} />
            AI Intelligence
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-5 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'analytics'
                ? 'bg-[#d97706]/20 text-[#fbbf24] shadow-[0_0_15px_rgba(217,119,6,0.15)] border border-[#d97706]/30'
                : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
            }`}
          >
            <BarChart2 size={16} />
            Deep Analytics
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="bg-transparent">
        {activeTab === 'ai' ? (
          <div>
            <AIInsights />
          </div>
        ) : (
          <div>
            <Analytics />
          </div>
        )}
      </div>
    </div>
  )
}
