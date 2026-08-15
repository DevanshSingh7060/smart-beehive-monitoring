import React from 'react'
import { LucideIcon, ArrowRight, ArrowDown, Sparkles, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react'
import StatusBadge, { StatusType } from './StatusBadge'

export interface SensorActionStep {
  sensorName: string
  reading: string
  readingUnit?: string
  status: StatusType | string
  statusLabel?: string
  icon: LucideIcon
  iconColor: string
  aiInterpretation: string
  recommendation: string
  actionType: 'none' | 'action-needed' | 'urgent'
  onAction?: () => void
}

interface SensorActionFlowProps {
  flows: SensorActionStep[]
  title?: string
  subtitle?: string
  className?: string
}

export default function SensorActionFlow({
  flows,
  title = 'Sensor → AI Insight → Action Pipeline',
  subtitle = 'How live hardware telemetry translates directly into beekeeper decisions',
  className = '',
}: SensorActionFlowProps) {
  return (
    <div className={`bg-white rounded-2xl border border-[#e8e3db] p-5 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-4">
        <div>
          <h3 className="font-display font-semibold text-[#1c1917] text-base">{title}</h3>
          {subtitle && <p className="text-xs text-[#78716c] mt-0.5">{subtitle}</p>}
        </div>
        <span className="text-[10px] text-[#7c3aed] bg-[#faf5ff] border border-[#ddd6fe] px-2.5 py-1 rounded-full font-medium inline-flex items-center gap-1 w-fit">
          <Sparkles size={10} />
          Automated Decision Engine
        </span>
      </div>

      <div className="space-y-3">
        {flows.map((flow, index) => {
          const Icon = flow.icon
          const isWarning = flow.actionType === 'action-needed' || flow.actionType === 'urgent'

          return (
            <div
              key={index}
              className={`rounded-xl border p-3.5 transition-all
              ${isWarning ? 'bg-[#fffbeb]/50 border-[#fde68a]' : 'bg-[#fcfbf9] border-[#e8e3db]'}`}
            >
              {/* Desktop 3-column row / Mobile 3-step stack */}
              <div className="grid grid-cols-1 md:grid-cols-11 gap-3 items-center">
                {/* 1. Sensor Data (cols 3) */}
                <div className="md:col-span-3 flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${flow.iconColor}18` }}
                  >
                    <Icon size={16} style={{ color: flow.iconColor }} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs text-[#78716c] font-medium truncate">{flow.sensorName}</div>
                    <div className="flex items-baseline gap-1">
                      <span className="font-mono-data text-lg font-bold text-[#1c1917]">{flow.reading}</span>
                      {flow.readingUnit && <span className="text-xs text-[#78716c]">{flow.readingUnit}</span>}
                      <StatusBadge status={flow.status} label={flow.statusLabel} size="sm" className="ml-1" />
                    </div>
                  </div>
                </div>

                {/* Arrow connector */}
                <div className="hidden md:flex md:col-span-1 justify-center text-[#a09890]">
                  <ArrowRight size={14} />
                </div>
                <div className="flex md:hidden justify-center text-[#a09890] -my-1">
                  <ArrowDown size={14} />
                </div>

                {/* 2. AI Interpretation (cols 3) */}
                <div className="md:col-span-3 bg-white border border-[#e8e3db] rounded-lg p-2.5">
                  <div className="text-[10px] font-semibold text-[#7c3aed] flex items-center gap-1 uppercase tracking-wider mb-0.5">
                    <Sparkles size={10} /> ✦ AI Analysis
                  </div>
                  <div className="text-xs text-[#44403c] leading-snug">
                    {flow.aiInterpretation}
                  </div>
                </div>

                {/* Arrow connector */}
                <div className="hidden md:flex md:col-span-1 justify-center text-[#a09890]">
                  <ArrowRight size={14} />
                </div>
                <div className="flex md:hidden justify-center text-[#a09890] -my-1">
                  <ArrowDown size={14} />
                </div>

                {/* 3. Recommended Action (cols 3) */}
                <div
                  className={`md:col-span-3 rounded-lg p-2.5 border
                  ${isWarning ? 'bg-[#fef2f2] border-[#fecaca]' : 'bg-[#f0fdf4] border-[#bbf7d0]'}`}
                >
                  <div
                    className="text-[10px] font-semibold flex items-center gap-1 uppercase tracking-wider mb-0.5"
                    style={{ color: isWarning ? '#dc2626' : '#16a34a' }}
                  >
                    {isWarning ? <AlertTriangle size={10} /> : <CheckCircle2 size={10} />}
                    {isWarning ? '⚠ Action Required' : '✓ Recommendation'}
                  </div>
                  <div
                    className="text-xs font-medium leading-snug"
                    style={{ color: isWarning ? '#991b1b' : '#166534' }}
                  >
                    {flow.recommendation}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
