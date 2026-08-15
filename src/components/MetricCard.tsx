import React from 'react'
import { LucideIcon, TrendingUp, TrendingDown, Minus, ChevronRight, Sparkles } from 'lucide-react'
import StatusBadge, { StatusType } from './StatusBadge'
import { LineChart, Line, ResponsiveContainer } from 'recharts'

interface TrendData {
  dir: 'up' | 'down' | 'flat'
  text: string
}

interface SparkPoint {
  time?: string
  value: number
}

interface MetricCardProps {
  id?: string
  title: string
  value: string | number
  unit?: string
  status?: StatusType | string
  statusLabel?: string
  trend?: TrendData
  aiSummary?: string
  icon: LucideIcon
  iconColor?: string
  sparklineData?: SparkPoint[]
  onViewDetails?: () => void
  className?: string
  interactive?: boolean
}

export default function MetricCard({
  title,
  value,
  unit,
  status = 'normal',
  statusLabel,
  trend,
  aiSummary,
  icon: Icon,
  iconColor = '#d97706',
  sparklineData,
  onViewDetails,
  className = '',
  interactive = true,
}: MetricCardProps) {
  const TrendIcon = trend?.dir === 'up' ? TrendingUp : trend?.dir === 'down' ? TrendingDown : Minus
  const trendColor = trend?.dir === 'up' ? '#16a34a' : trend?.dir === 'down' ? '#dc2626' : '#78716c'

  return (
    <div
      onClick={interactive && onViewDetails ? onViewDetails : undefined}
      className={`bg-white rounded-2xl border border-[#e8e3db] p-4 flex flex-col justify-between transition-all duration-200 
      ${interactive && onViewDetails ? 'cursor-pointer hover:border-[#d97706]/40 hover:shadow-md hover:-translate-y-0.5 group' : ''} ${className}`}
    >
      <div>
        {/* Header: Icon & Status */}
        <div className="flex items-center justify-between mb-3">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: `${iconColor}15` }}
          >
            <Icon size={16} style={{ color: iconColor }} />
          </div>
          {status && <StatusBadge status={status} label={statusLabel} size="sm" />}
        </div>

        {/* Title */}
        <div className="text-[#78716c] text-xs font-medium tracking-tight mb-1">
          {title}
        </div>

        {/* Value + Unit */}
        <div className="flex items-baseline gap-1 mb-1">
          <span className="font-mono-data text-2xl lg:text-3xl font-semibold text-[#1c1917] tracking-tight">
            {value}
          </span>
          {unit && (
            <span className="text-[#78716c] text-sm font-medium">
              {unit}
            </span>
          )}
        </div>

        {/* Trend Indicator */}
        {trend && (
          <div className="flex items-center gap-1 text-[11px] font-medium mb-2.5" style={{ color: trendColor }}>
            <TrendIcon size={12} className="flex-shrink-0" />
            <span>{trend.text}</span>
          </div>
        )}

        {/* Mini Sparkline Chart */}
        {sparklineData && sparklineData.length > 0 && (
          <div className="h-8 -mx-1 my-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sparklineData}>
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={iconColor}
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* AI micro-summary / Short Interpretation */}
        {aiSummary && (
          <div className="bg-[#f7f5f0] border border-[#e8e3db] rounded-xl px-2.5 py-1.5 mt-2 flex items-start gap-1.5">
            <Sparkles size={11} className="text-[#7c3aed] flex-shrink-0 mt-0.5" />
            <p className="text-[11px] text-[#44403c] leading-tight line-clamp-2">
              {aiSummary}
            </p>
          </div>
        )}
      </div>

      {/* Footer trigger */}
      {onViewDetails && (
        <div className="pt-3 mt-3 border-t border-[#f0ede8] flex items-center justify-between">
          <span className="text-[11px] text-[#d97706] font-medium group-hover:text-[#b45309] flex items-center gap-1 transition-colors">
            View Details
            <ChevronRight size={12} className="transition-transform group-hover:translate-x-0.5" />
          </span>
          <span className="text-[10px] text-[#a09890]">Real-time telemetry</span>
        </div>
      )}
    </div>
  )
}
