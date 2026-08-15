import React, { useState } from 'react'
import { Sparkles, Check, ChevronRight, AlertTriangle, ArrowUpRight, ShieldCheck } from 'lucide-react'

export type RecommendationPriority = 'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW'

interface AIRecommendationProps {
  id?: string | number
  priority: RecommendationPriority
  title: string
  issue: string
  action: string
  confidence?: number
  reasoning?: string
  metricImpact?: string
  reviewed?: boolean
  onMarkReviewed?: () => void
  onActionClick?: () => void
  className?: string
}

export default function AIRecommendationCard({
  priority,
  title,
  issue,
  action,
  confidence = 92,
  reasoning,
  metricImpact,
  reviewed: initialReviewed = false,
  onMarkReviewed,
  onActionClick,
  className = '',
}: AIRecommendationProps) {
  const [reviewed, setReviewed] = useState(initialReviewed)
  const [showReasoning, setShowReasoning] = useState(false)

  const priorityStyles: Record<RecommendationPriority, { badgeBg: string; badgeText: string; borderColor: string; dot: string }> = {
    URGENT: {
      badgeBg: '#fef2f2',
      badgeText: '#dc2626',
      borderColor: '#fca5a5',
      dot: '#dc2626',
    },
    HIGH: {
      badgeBg: '#fffbeb',
      badgeText: '#d97706',
      borderColor: '#fcd34d',
      dot: '#d97706',
    },
    MEDIUM: {
      badgeBg: '#eff6ff',
      badgeText: '#2563eb',
      borderColor: '#bfdbfe',
      dot: '#2563eb',
    },
    LOW: {
      badgeBg: '#f0fdf4',
      badgeText: '#16a34a',
      borderColor: '#bbf7d0',
      dot: '#16a34a',
    },
  }

  const style = priorityStyles[priority] || priorityStyles.MEDIUM

  const handleReviewToggle = () => {
    setReviewed(!reviewed)
    if (onMarkReviewed) onMarkReviewed()
  }

  return (
    <div
      className={`rounded-2xl border transition-all duration-200 bg-white p-4 lg:p-5 flex flex-col justify-between
      ${reviewed ? 'opacity-65 border-[#e8e3db] bg-[#fafaf8]' : 'border-[#e8e3db] hover:border-[#d97706]/30 hover:shadow-sm'} ${className}`}
    >
      <div>
        {/* Header */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2">
            <span
              className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-md border uppercase inline-flex items-center gap-1.5"
              style={{
                backgroundColor: style.badgeBg,
                color: style.badgeText,
                borderColor: style.borderColor,
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: style.dot }} />
              {priority} PRIORITY
            </span>
            <span className="text-[10px] font-medium text-[#7c3aed] bg-[#faf5ff] border border-[#ddd6fe] px-2 py-0.5 rounded-md flex items-center gap-1">
              <Sparkles size={9} />
              AI {confidence}%
            </span>
          </div>

          {reviewed && (
            <span className="text-[11px] font-medium text-[#16a34a] flex items-center gap-1">
              <ShieldCheck size={13} />
              Reviewed
            </span>
          )}
        </div>

        {/* Title & Issue */}
        <h4 className="font-display font-semibold text-[#1c1917] text-sm lg:text-base leading-snug mb-1">
          {title}
        </h4>
        <p className="text-xs text-[#78716c] leading-relaxed mb-3">
          {issue}
        </p>

        {/* Recommended Action Box */}
        <div className="bg-[#f7f5f0] border border-[#e8e3db] rounded-xl p-3 mb-3">
          <div className="text-[10px] font-semibold tracking-wider text-[#d97706] uppercase mb-0.5">
            Recommended Action
          </div>
          <div className="text-xs font-medium text-[#1c1917] leading-snug">
            {action}
          </div>
          {metricImpact && (
            <div className="text-[10px] text-[#78716c] mt-1">
              Expected effect: <span className="text-[#16a34a] font-medium">{metricImpact}</span>
            </div>
          )}
        </div>

        {/* Expandable Reasoning */}
        {reasoning && (
          <div className="mb-3">
            <button
              onClick={() => setShowReasoning(!showReasoning)}
              className="text-[11px] text-[#78716c] hover:text-[#1c1917] font-medium flex items-center gap-1 transition-colors"
            >
              {showReasoning ? 'Hide AI Reasoning' : 'Why this recommendation? →'}
            </button>
            {showReasoning && (
              <div className="mt-2 text-xs text-[#57534e] bg-white border border-[#e8e3db] rounded-xl p-3 leading-relaxed">
                {reasoning}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="flex items-center gap-2 pt-2 border-t border-[#f0ede8]">
        <button
          onClick={handleReviewToggle}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl text-xs font-medium border transition-colors
          ${reviewed
            ? 'bg-white border-[#e8e3db] text-[#78716c] hover:bg-[#f7f5f0]'
            : 'bg-[#16a34a]/10 border-[#16a34a]/30 text-[#16a34a] hover:bg-[#16a34a]/20'
          }`}
        >
          <Check size={12} />
          {reviewed ? 'Mark as Pending' : 'Mark as Reviewed'}
        </button>

        {onActionClick && (
          <button
            onClick={onActionClick}
            className="flex items-center justify-center gap-1 py-1.5 px-3 rounded-xl text-xs font-medium bg-[#1c1917] text-white hover:bg-[#292524] transition-colors"
          >
            <span>Take Action</span>
            <ArrowUpRight size={12} />
          </button>
        )}
      </div>
    </div>
  )
}
