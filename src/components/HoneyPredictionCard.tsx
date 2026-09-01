import React from 'react'
import { Sparkles, TrendingUp, Check, AlertTriangle, ChevronRight, Scale } from 'lucide-react'

interface Factor {
  label: string
  status: 'positive' | 'warning' | 'neutral'
}

interface HoneyPredictionCardProps {
  predictedRange?: string
  confidence?: number
  trendText?: string
  potentialLabel?: string
  factors?: Factor[]
  onViewDetails?: () => void
  className?: string
}

export default function HoneyPredictionCard({
  predictedRange = '18–22 kg',
  confidence = 87,
  trendText = '↑ 12% vs last season',
  potentialLabel = 'High Potential',
  factors = [
    { label: 'High bee foraging activity', status: 'positive' },
    { label: 'Abundant nearby floral bloom', status: 'positive' },
    { label: 'Stable brood core temperature', status: 'positive' },
    { label: 'Slight humidity variance', status: 'warning' },
  ],
  onViewDetails,
  className = '',
}: HoneyPredictionCardProps) {
  return (
    <div
      className={`glass-panel rounded-3xl border border-white/10 p-5 lg:p-6 flex flex-col justify-between transition-all duration-300 hover:border-white/20 hover:bg-white/5 relative overflow-hidden group ${className}`}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#fbbf24]/10 rounded-full blur-[40px] pointer-events-none group-hover:bg-[#fbbf24]/20 transition-all" />
      
      <div className="relative z-10">
        {/* Top badge row */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#d97706]/20 border border-[#d97706]/30 flex items-center justify-center flex-shrink-0 shadow-[0_0_15px_rgba(217,119,6,0.2)]">
              <Scale size={20} className="text-[#fbbf24]" />
            </div>
            <div>
              <div className="text-sm font-bold text-white uppercase tracking-wider">Honey Production</div>
              <div className="text-[11px] text-white/50 font-medium">Seasonal Yield Forecast</div>
            </div>
          </div>

          <span className="text-[10px] font-bold tracking-widest px-2 py-1 rounded bg-white/5 text-white/60 border border-white/10 uppercase">
            Simulated Model
          </span>
        </div>

        {/* Prediction Main metric */}
        <div className="bg-[#fbbf24]/10 border border-[#fbbf24]/30 rounded-2xl p-4 mb-4 shadow-[inset_0_0_20px_rgba(251,191,36,0.05)] relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#fbbf24]/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
          
          <div className="flex items-baseline justify-between mb-2">
            <span className="font-mono-data text-3xl lg:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] filter drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]">
              {predictedRange}
            </span>
            <span className="text-[10px] font-bold tracking-wider uppercase text-[#4ade80] bg-[#4ade80]/10 border border-[#4ade80]/20 px-2 py-0.5 rounded flex items-center gap-1 shadow-[0_0_10px_rgba(74,222,128,0.2)]">
              <TrendingUp size={12} />
              {trendText}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs mt-1">
            <span className="font-bold text-[#fbbf24] uppercase tracking-wider">{potentialLabel}</span>
            <span className="text-white/60 flex items-center gap-1.5 font-medium">
              <Sparkles size={12} className="text-[#a78bfa]" />
              AI Confidence: <strong className="text-white">{confidence}%</strong>
            </span>
          </div>
        </div>

        {/* Influencing factors */}
        <div className="space-y-2 mb-4">
          <div className="text-[10px] font-bold tracking-widest text-white/40 uppercase">Influencing Colony Factors:</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {factors.map((f, i) => (
              <div
                key={i}
                className="flex items-center gap-2 text-xs px-2.5 py-1.5 rounded-lg bg-black/20 border border-white/5"
              >
                {f.status === 'positive' ? (
                  <Check size={12} className="text-[#4ade80] flex-shrink-0" />
                ) : f.status === 'warning' ? (
                  <AlertTriangle size={12} className="text-[#fbbf24] flex-shrink-0" />
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-white/40 flex-shrink-0" />
                )}
                <span className="text-white/70 font-medium truncate">{f.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      {onViewDetails && (
        <button
          onClick={onViewDetails}
          className="w-full flex items-center justify-center gap-1.5 pt-3 border-t border-white/10 text-xs font-bold uppercase tracking-wider text-[#fbbf24] hover:text-white transition-colors relative z-10"
        >
          <span>View Production Analysis</span>
          <ChevronRight size={14} />
        </button>
      )}
    </div>
  )
}
