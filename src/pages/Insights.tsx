import React, { useState } from 'react'
import { Sparkles, BrainCircuit, Activity, BarChart2 } from 'lucide-react'
import AIInsights from './AIInsights'
import Analytics from './Analytics'

export default function Insights() {
  const [activeTab, setActiveTab] = useState<'ai' | 'analytics'>('ai')

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-[1500px] mx-auto">
      {/* Unified Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-[#e8e3db] rounded-2xl p-4 lg:p-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-[#7c3aed] bg-[#faf5ff] border border-[#ddd6fe] px-2 py-0.5 rounded-md flex items-center gap-1">
              <Sparkles size={11} />
              Apiary Intelligence
            </span>
          </div>
          <h2 className="font-display text-xl lg:text-2xl font-bold text-[#1c1917]">
            Insights & Analytics
          </h2>
          <p className="text-xs text-[#78716c] mt-0.5">
            Deep dive into historical telemetry, AI predictions, and actionable recommendations.
          </p>
        </div>

        {/* Top Navigation Tabs */}
        <div className="flex bg-[#f7f5f0] border border-[#e8e3db] rounded-xl p-1 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('ai')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2
            ${
              activeTab === 'ai'
                ? 'bg-white text-[#1c1917] shadow-sm'
                : 'text-[#78716c] hover:text-[#1c1917]'
            }`}
          >
            <BrainCircuit size={16} />
            AI Intelligence
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2
            ${
              activeTab === 'analytics'
                ? 'bg-white text-[#1c1917] shadow-sm'
                : 'text-[#78716c] hover:text-[#1c1917]'
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
          <div className="-mx-4 lg:-mx-6 -my-4 lg:-my-6">
            <AIInsights />
          </div>
        ) : (
          <div className="-mx-4 lg:-mx-6 -my-4 lg:-my-6">
            <Analytics />
          </div>
        )}
      </div>
    </div>
  )
}
