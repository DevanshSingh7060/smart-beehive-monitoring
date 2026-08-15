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
      className={`bg-white rounded-2xl border border-[#e8e3db] p-5 flex flex-col justify-between transition-all duration-200 hover:border-[#d97706]/40 hover:shadow-sm ${className}`}
    >
      <div>
        {/* Top badge row */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#d97706]/15 flex items-center justify-center flex-shrink-0">
              <Scale size={16} className="text-[#d97706]" />
            </div>
            <div>
              <div className="text-xs font-semibold text-[#1c1917]">Honey Production</div>
              <div className="text-[10px] text-[#78716c]">Seasonal Yield Forecast</div>
            </div>
          </div>

          {/* Simulated / Demo badge */}
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-[#f5f5f4] text-[#78716c] border border-[#e7e5e4]">
            Simulated Model
          </span>
        </div>

        {/* Prediction Main metric */}
        <div className="bg-[#fffbeb] border border-[#fde68a] rounded-xl p-3.5 mb-3">
          <div className="flex items-baseline justify-between mb-1">
            <span className="font-mono-data text-2xl lg:text-3xl font-bold text-[#b45309]">
              {predictedRange}
            </span>
            <span className="text-xs font-semibold text-[#16a34a] bg-[#f0fdf4] border border-[#bbf7d0] px-2 py-0.5 rounded-full flex items-center gap-1">
              <TrendingUp size={11} />
              {trendText}
            </span>
          </div>

          <div className="flex items-center justify-between text-[11px]">
            <span className="font-medium text-[#d97706]">{potentialLabel}</span>
            <span className="text-[#78716c] flex items-center gap-1">
              <Sparkles size={10} className="text-[#7c3aed]" />
              AI Confidence: <strong className="text-[#1c1917]">{confidence}%</strong>
            </span>
          </div>
        </div>

        {/* Influencing factors */}
        <div className="space-y-1.5 mb-3">
          <div className="text-[11px] font-medium text-[#78716c]">Influencing Colony Factors:</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {factors.map((f, i) => (
              <div
                key={i}
                className="flex items-center gap-1.5 text-[11px] px-2 py-1 rounded-lg bg-[#f7f5f0] border border-[#e8e3db]"
              >
                {f.status === 'positive' ? (
                  <Check size={11} className="text-[#16a34a] flex-shrink-0" />
                ) : f.status === 'warning' ? (
                  <AlertTriangle size={11} className="text-[#d97706] flex-shrink-0" />
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#78716c] flex-shrink-0" />
                )}
                <span className="text-[#44403c] truncate">{f.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      {onViewDetails && (
        <button
          onClick={onViewDetails}
          className="w-full flex items-center justify-center gap-1 pt-2.5 mt-1 border-t border-[#f0ede8] text-xs font-medium text-[#d97706] hover:text-[#b45309] transition-colors"
        >
          <span>View Production Analysis</span>
          <ChevronRight size={13} />
        </button>
      )}
    </div>
  )
}
