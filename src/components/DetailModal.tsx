import React, { useEffect } from 'react'
import { X } from 'lucide-react'

interface DetailModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  subtitle?: string
  badge?: React.ReactNode
  children: React.ReactNode
  footerActions?: React.ReactNode
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl'
}

export default function DetailModal({
  isOpen,
  onClose,
  title,
  subtitle,
  badge,
  children,
  footerActions,
  maxWidth = 'md',
}: DetailModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const widthClass = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  }[maxWidth]

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#1c1917]/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal / Bottom sheet */}
      <div
        className={`relative w-full ${widthClass} bg-white rounded-t-3xl sm:rounded-2xl border border-[#e8e3db] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] sm:max-h-[85vh] z-10 animate-in slide-in-from-bottom duration-250`}
      >
        {/* Mobile pull indicator */}
        <div className="sm:hidden flex justify-center pt-2.5 pb-1">
          <div className="w-12 h-1 bg-[#d4cfc7] rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-start justify-between p-4 sm:p-5 border-b border-[#f0ede8]">
          <div className="flex-1 min-w-0 pr-3">
            <div className="flex items-center gap-2 flex-wrap mb-0.5">
              <h3 className="font-display font-semibold text-lg text-[#1c1917] truncate">
                {title}
              </h3>
              {badge}
            </div>
            {subtitle && (
              <p className="text-xs text-[#78716c] truncate">
                {subtitle}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-[#f7f5f0] border border-[#e8e3db] text-[#78716c] hover:text-[#1c1917] hover:bg-[#ede9e3] flex items-center justify-center transition-colors flex-shrink-0"
          >
            <X size={15} />
          </button>
        </div>

        {/* Body content */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-4">
          {children}
        </div>

        {/* Footer actions */}
        {footerActions && (
          <div className="p-4 sm:p-5 border-t border-[#f0ede8] bg-[#fcfbf9] flex items-center justify-end gap-2">
            {footerActions}
          </div>
        )}
      </div>
    </div>
  )
}
