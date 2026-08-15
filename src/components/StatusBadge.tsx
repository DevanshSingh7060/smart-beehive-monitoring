import React from 'react'
import { CheckCircle2, AlertTriangle, AlertCircle, Sparkles, Info, Radio } from 'lucide-react'

export type StatusType = 
  | 'healthy' 
  | 'normal' 
  | 'attention' 
  | 'warning' 
  | 'critical' 
  | 'ai' 
  | 'ai-insight' 
  | 'info' 
  | 'live' 
  | 'offline'

interface StatusBadgeProps {
  status: StatusType | string
  label?: string
  size?: 'sm' | 'md' | 'lg'
  showIcon?: boolean
  className?: string
}

export default function StatusBadge({
  status,
  label,
  size = 'md',
  showIcon = true,
  className = '',
}: StatusBadgeProps) {
  const normStatus = status.toLowerCase()

  let color = '#16a34a'
  let bg = '#f0fdf4'
  let border = '#bbf7d0'
  let defaultLabel = '✓ NORMAL'
  let Icon = CheckCircle2

  if (normStatus === 'healthy' || normStatus === 'normal' || normStatus === 'optimal' || normStatus === 'good') {
    color = '#16a34a'
    bg = '#f0fdf4'
    border = '#bbf7d0'
    defaultLabel = '✓ NORMAL'
    Icon = CheckCircle2
  } else if (normStatus === 'attention' || normStatus === 'warning' || normStatus === 'monitor') {
    color = '#d97706'
    bg = '#fffbeb'
    border = '#fde68a'
    defaultLabel = '⚠ ATTENTION'
    Icon = AlertTriangle
  } else if (normStatus === 'critical' || normStatus === 'danger' || normStatus === 'urgent') {
    color = '#dc2626'
    bg = '#fef2f2'
    border = '#fecaca'
    defaultLabel = '● CRITICAL'
    Icon = AlertCircle
  } else if (normStatus === 'ai' || normStatus === 'ai-insight' || normStatus === 'ai insight') {
    color = '#7c3aed'
    bg = '#faf5ff'
    border = '#ddd6fe'
    defaultLabel = '✦ AI INSIGHT'
    Icon = Sparkles
  } else if (normStatus === 'live' || normStatus === 'online') {
    color = '#16a34a'
    bg = '#f0fdf4'
    border = '#bbf7d0'
    defaultLabel = '● LIVE'
    Icon = Radio
  } else if (normStatus === 'info' || normStatus === 'resolved') {
    color = '#2563eb'
    bg = '#eff6ff'
    border = '#bfdbfe'
    defaultLabel = 'ℹ INFO'
    Icon = Info
  } else {
    color = '#78716c'
    bg = '#f5f5f4'
    border = '#e7e5e4'
    defaultLabel = status.toUpperCase()
    Icon = Info
  }

  const displayText = label || defaultLabel

  const sizeClasses = {
    sm: 'text-[10px] px-1.5 py-0.5 gap-1',
    md: 'text-[11px] px-2.5 py-0.5 gap-1.5',
    lg: 'text-xs px-3 py-1 gap-1.5',
  }[size]

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border transition-all select-none ${sizeClasses} ${className}`}
      style={{
        color,
        backgroundColor: bg,
        borderColor: border,
      }}
    >
      {showIcon && <Icon size={size === 'sm' ? 10 : size === 'md' ? 12 : 14} className="flex-shrink-0" />}
      <span className="tracking-tight leading-none">{displayText}</span>
    </span>
  )
}
