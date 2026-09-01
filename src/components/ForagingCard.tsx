import React from 'react'
import { Flower2, Sun, Wind, CloudRain, Clock, ChevronRight } from 'lucide-react'
import StatusBadge from './StatusBadge'

interface ForagingCardProps {
  condition?: string
  floralStatus?: string
  bestWindow?: string
  temperature?: string
  windSpeed?: string
  rainProb?: string
  sunHours?: string
  onViewDetails?: () => void
  className?: string
}

export default function ForagingCard({
  condition = 'Excellent',
  floralStatus = 'High Bloom Density',
  bestWindow = '9:00 AM – 1:00 PM',
  temperature = '26°C',
  windSpeed = '8 km/h',
  rainProb = '0%',
  sunHours = '9.2 hrs',
  onViewDetails,
  className = '',
}: ForagingCardProps) {
  return (
    <div
      className={`glass-panel rounded-3xl border border-white/10 p-5 lg:p-6 flex flex-col justify-between transition-all duration-300 hover:border-white/20 hover:bg-white/5 relative overflow-hidden group ${className}`}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#ec4899]/10 rounded-full blur-[40px] pointer-events-none group-hover:bg-[#ec4899]/20 transition-all" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#db2777]/20 border border-[#db2777]/30 flex items-center justify-center flex-shrink-0 shadow-[0_0_15px_rgba(219,39,119,0.2)]">
              <Flower2 size={20} className="text-[#f472b6]" />
            </div>
            <div>
              <div className="text-sm font-bold text-white uppercase tracking-wider">Flowering & Foraging</div>
              <div className="text-[11px] text-white/50 font-medium">Surrounding Eco-conditions</div>
            </div>
          </div>
          <StatusBadge status="optimal" label={`✓ ${condition.toUpperCase()}`} size="sm" />
        </div>

        {/* Highlighted Window */}
        <div className="bg-[#be185d]/10 border border-[#be185d]/30 rounded-2xl p-4 mb-4 shadow-[inset_0_0_20px_rgba(190,24,93,0.05)] relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#be185d]/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />

          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold tracking-widest uppercase text-[#f472b6] flex items-center gap-1.5">
              <Clock size={14} /> Optimal Flight Window
            </span>
            <span className="text-[10px] font-bold tracking-wider text-[#fbcfe8] bg-[#be185d]/40 px-2 py-0.5 rounded border border-[#be185d]/50 uppercase shadow-[0_0_10px_rgba(190,24,93,0.2)]">
              Peak Pollen
            </span>
          </div>
          <div className="font-mono-data text-xl lg:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#f472b6] to-[#fbcfe8] filter drop-shadow-[0_0_8px_rgba(244,114,182,0.4)]">
            {bestWindow}
          </div>
          <div className="text-xs text-[#fbcfe8]/70 mt-1 font-medium">
            {floralStatus} · Mustard & Acacia blooming
          </div>
        </div>

        {/* Environmental Indicators */}
        <div className="grid grid-cols-4 gap-2 mb-4 text-center">
          <div className="glass-panel border border-white/10 rounded-xl p-2 bg-black/20">
            <Sun size={14} className="text-[#fbbf24] mx-auto mb-1" />
            <div className="font-mono-data text-xs font-bold text-white">{temperature}</div>
            <div className="text-[9px] font-bold tracking-wider uppercase text-white/40 mt-0.5">Ambient</div>
          </div>
          <div className="glass-panel border border-white/10 rounded-xl p-2 bg-black/20">
            <Wind size={14} className="text-[#60a5fa] mx-auto mb-1" />
            <div className="font-mono-data text-xs font-bold text-white">{windSpeed}</div>
            <div className="text-[9px] font-bold tracking-wider uppercase text-white/40 mt-0.5">Wind</div>
          </div>
          <div className="glass-panel border border-white/10 rounded-xl p-2 bg-black/20">
            <CloudRain size={14} className="text-[#22d3ee] mx-auto mb-1" />
            <div className="font-mono-data text-xs font-bold text-white">{rainProb}</div>
            <div className="text-[9px] font-bold tracking-wider uppercase text-white/40 mt-0.5">Rain</div>
          </div>
          <div className="glass-panel border border-white/10 rounded-xl p-2 bg-black/20">
            <Sun size={14} className="text-[#fbbf24] mx-auto mb-1" />
            <div className="font-mono-data text-xs font-bold text-white">{sunHours}</div>
            <div className="text-[9px] font-bold tracking-wider uppercase text-white/40 mt-0.5">Sunlight</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      {onViewDetails && (
        <button
          onClick={onViewDetails}
          className="w-full flex items-center justify-center gap-1.5 pt-3 border-t border-white/10 text-xs font-bold uppercase tracking-wider text-[#f472b6] hover:text-[#fbcfe8] transition-colors relative z-10"
        >
          <span>View Foraging Intelligence</span>
          <ChevronRight size={14} />
        </button>
      )}
    </div>
  )
}
