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
      className={`bg-white rounded-2xl border border-[#e8e3db] p-5 flex flex-col justify-between transition-all duration-200 hover:border-[#d97706]/40 hover:shadow-sm ${className}`}
    >
      <div>
        {/* Header */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#ec4899]/10 flex items-center justify-center flex-shrink-0">
              <Flower2 size={16} className="text-[#db2777]" />
            </div>
            <div>
              <div className="text-xs font-semibold text-[#1c1917]">Flowering & Foraging</div>
              <div className="text-[10px] text-[#78716c]">Surrounding Eco-conditions</div>
            </div>
          </div>
          <StatusBadge status="optimal" label={`✓ ${condition.toUpperCase()}`} size="sm" />
        </div>

        {/* Highlighted Window */}
        <div className="bg-[#fdf2f8]/60 border border-[#fbcfe8] rounded-xl p-3 mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-semibold text-[#9d174d] flex items-center gap-1.5">
              <Clock size={12} /> Optimal Flight Window
            </span>
            <span className="text-[10px] font-medium text-[#be185d] bg-white px-2 py-0.5 rounded-full border border-[#fbcfe8]">
              Peak Pollen
            </span>
          </div>
          <div className="font-mono-data text-lg font-bold text-[#831843]">
            {bestWindow}
          </div>
          <div className="text-[11px] text-[#9d174d]/80 mt-0.5">
            {floralStatus} · Mustard & Acacia blooming
          </div>
        </div>

        {/* Environmental Indicators */}
        <div className="grid grid-cols-4 gap-1.5 mb-2 text-center">
          <div className="bg-[#f7f5f0] border border-[#e8e3db] rounded-xl p-2">
            <Sun size={13} className="text-[#d97706] mx-auto mb-0.5" />
            <div className="font-mono-data text-xs font-semibold text-[#1c1917]">{temperature}</div>
            <div className="text-[9px] text-[#78716c]">Ambient</div>
          </div>
          <div className="bg-[#f7f5f0] border border-[#e8e3db] rounded-xl p-2">
            <Wind size={13} className="text-[#2563eb] mx-auto mb-0.5" />
            <div className="font-mono-data text-xs font-semibold text-[#1c1917]">{windSpeed}</div>
            <div className="text-[9px] text-[#78716c]">Wind</div>
          </div>
          <div className="bg-[#f7f5f0] border border-[#e8e3db] rounded-xl p-2">
            <CloudRain size={13} className="text-[#0891b2] mx-auto mb-0.5" />
            <div className="font-mono-data text-xs font-semibold text-[#1c1917]">{rainProb}</div>
            <div className="text-[9px] text-[#78716c]">Rain</div>
          </div>
          <div className="bg-[#f7f5f0] border border-[#e8e3db] rounded-xl p-2">
            <Sun size={13} className="text-[#f59e0b] mx-auto mb-0.5" />
            <div className="font-mono-data text-xs font-semibold text-[#1c1917]">{sunHours}</div>
            <div className="text-[9px] text-[#78716c]">Sunlight</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      {onViewDetails && (
        <button
          onClick={onViewDetails}
          className="w-full flex items-center justify-center gap-1 pt-2.5 mt-1 border-t border-[#f0ede8] text-xs font-medium text-[#d97706] hover:text-[#b45309] transition-colors"
        >
          <span>View Foraging Intelligence</span>
          <ChevronRight size={13} />
        </button>
      )}
    </div>
  )
}
