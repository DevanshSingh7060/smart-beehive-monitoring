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

  const priorityStyles: Record<RecommendationPriority, { badgeBg: string; badgeText: string; borderColor: string; dot: string; shadow: string }> = {
    URGENT: {
      badgeBg: 'rgba(239, 68, 68, 0.1)',
      badgeText: '#ef4444',
      borderColor: 'rgba(239, 68, 68, 0.3)',
      dot: '#ef4444',
      shadow: '0 0 10px rgba(239, 68, 68, 0.2)',
    },
    HIGH: {
      badgeBg: 'rgba(251, 191, 36, 0.1)',
      badgeText: '#fbbf24',
      borderColor: 'rgba(251, 191, 36, 0.3)',
      dot: '#fbbf24',
      shadow: '0 0 10px rgba(251, 191, 36, 0.2)',
    },
    MEDIUM: {
      badgeBg: 'rgba(96, 165, 250, 0.1)',
      badgeText: '#60a5fa',
      borderColor: 'rgba(96, 165, 250, 0.3)',
      dot: '#60a5fa',
      shadow: '0 0 10px rgba(96, 165, 250, 0.2)',
    },
    LOW: {
      badgeBg: 'rgba(74, 222, 128, 0.1)',
      badgeText: '#4ade80',
      borderColor: 'rgba(74, 222, 128, 0.3)',
      dot: '#4ade80',
      shadow: '0 0 10px rgba(74, 222, 128, 0.1)',
    },
  }

  const style = priorityStyles[priority] || priorityStyles.MEDIUM

  const handleReviewToggle = () => {
    setReviewed(!reviewed)
    if (onMarkReviewed) onMarkReviewed()
  }

  return (
    <div
      className={`rounded-3xl border transition-all duration-300 glass-panel p-5 flex flex-col justify-between
      ${reviewed ? 'opacity-50 grayscale-[50%] border-[var(--border-subtle)]' : 'border-[var(--border-subtle)] hover:border-[var(--border-medium)] hover:bg-[var(--bg-card-hover)] shadow-lg'} ${className}`}
    >
      <div>
        {/* Header */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2.5">
            <span
              className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded border uppercase inline-flex items-center gap-1.5"
              style={{
                backgroundColor: style.badgeBg,
                color: style.badgeText,
                borderColor: style.borderColor,
                boxShadow: style.shadow
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full live-dot" style={{ backgroundColor: style.dot }} />
              {priority}
            </span>
            <span className="text-[10px] font-bold tracking-widest text-[#a78bfa] bg-[#a78bfa]/10 border border-[#a78bfa]/30 px-2 py-0.5 rounded uppercase flex items-center gap-1.5 shadow-[0_0_10px_rgba(167,139,250,0.15)]">
              <Sparkles size={10} />
              AI {confidence}%
            </span>
          </div>

          {reviewed && (
            <span className="text-[11px] font-bold tracking-wider uppercase text-[#4ade80] flex items-center gap-1">
              <ShieldCheck size={14} />
              Reviewed
            </span>
          )}
        </div>

        {/* Title & Issue */}
        <h4 className="font-display font-bold text-[var(--text-primary)] text-base leading-snug mb-2 flex items-start gap-2">
          {title}
        </h4>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-4">
          {issue}
        </p>

        {/* Recommended Action Box */}
        <div className="bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-2xl p-4 mb-4 shadow-inner relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-tr from-[#d97706]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="text-[10px] font-bold tracking-widest text-[#fbbf24] uppercase mb-1.5">
            Recommended Action
          </div>
          <div className="text-sm font-semibold text-[var(--text-primary)] leading-snug">
            {action}
          </div>
          {metricImpact && (
            <div className="text-[11px] text-[var(--text-tertiary)] mt-2 font-medium">
              Expected effect: <span className="text-[#4ade80]">{metricImpact}</span>
            </div>
          )}
        </div>

        {/* Expandable Reasoning */}
        {reasoning && (
          <div className="mb-4">
            <button
              onClick={() => setShowReasoning(!showReasoning)}
              className="text-[11px] font-bold tracking-wider uppercase text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] flex items-center gap-1 transition-colors"
            >
              {showReasoning ? 'Hide AI Reasoning' : 'Why this recommendation? →'}
            </button>
            {showReasoning && (
              <div className="mt-3 text-xs text-[var(--text-secondary)] bg-[var(--bg-card-hover)] border border-[var(--border-subtle)] rounded-xl p-3.5 leading-relaxed shadow-inner">
                {reasoning}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="flex items-center gap-3 pt-4 border-t border-[var(--border-subtle)] mt-auto">
        <button
          onClick={handleReviewToggle}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all
          ${reviewed
            ? 'bg-[var(--bg-card-hover)] border-[var(--border-subtle)] text-[var(--text-tertiary)] hover:bg-[var(--bg-card-hover)] hover:text-[var(--text-primary)]'
            : 'bg-[#4ade80]/10 border-[#4ade80]/30 text-[#4ade80] hover:bg-[#4ade80]/20 shadow-[0_0_15px_rgba(74,222,128,0.15)]'
          }`}
        >
          <Check size={14} />
          {reviewed ? 'Mark Pending' : 'Mark Reviewed'}
        </button>

        {onActionClick && (
          <button
            onClick={onActionClick}
            className="flex items-center justify-center gap-1.5 py-2 px-4 rounded-xl text-xs font-bold uppercase tracking-wider bg-[var(--bg-card-hover)] text-[var(--text-primary)] border border-[var(--border-medium)] hover:bg-[var(--bg-card-hover)] transition-all shadow-inner"
          >
            <span>Take Action</span>
            <ArrowUpRight size={14} />
          </button>
        )}
      </div>
    </div>
  )
}
