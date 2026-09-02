import React, { useState } from 'react'
import { Server, Settings as SettingsIcon, Camera as CameraIcon, FileText } from 'lucide-react'
import Settings from './Settings'
import Camera from './Camera'
import Reports from './Reports'

export default function System() {
  const [activeTab, setActiveTab] = useState<'settings' | 'camera' | 'reports'>('settings')

  return (
    <div className="p-4 lg:p-6 lg:px-8 space-y-6 max-w-[1600px] mx-auto text-gray-200">
      {/* Unified Header */}
      <div className="glass-panel-elevated rounded-3xl p-6 lg:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute -left-10 -top-10 w-40 h-40 bg-[#16a34a]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[10px] font-bold text-[#4ade80] uppercase tracking-wider flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#16a34a]/10 border border-[#16a34a]/20">
              <Server size={12} className="text-[#4ade80]" />
              SYSTEM ARCHITECTURE
            </span>
          </div>
          <h2 className="font-display text-2xl lg:text-3xl font-bold text-[var(--text-primary)] tracking-tight">
            System & Diagnostics
          </h2>
          <p className="text-sm text-[var(--text-tertiary)] mt-1.5 max-w-xl leading-relaxed">
            Manage your apiary hardware, generated reports, camera feeds, and core settings.
          </p>
        </div>

        {/* Top Navigation Tabs */}
        <div className="flex glass-panel border border-[var(--border-subtle)] rounded-2xl p-1.5 self-start lg:self-auto relative z-10 flex-wrap gap-1">
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'settings'
                ? 'bg-[#d97706]/20 text-[#fbbf24] shadow-[0_0_15px_rgba(217,119,6,0.15)] border border-[#d97706]/30'
                : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
            }`}
          >
            <SettingsIcon size={16} />
            Settings & IoT
          </button>
          <button
            onClick={() => setActiveTab('camera')}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'camera'
                ? 'bg-[#38bdf8]/20 text-[#7dd3fc] shadow-[0_0_15px_rgba(56,189,248,0.15)] border border-[#38bdf8]/30'
                : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
            }`}
          >
            <CameraIcon size={16} />
            Camera
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'reports'
                ? 'bg-[#a78bfa]/20 text-[#d8b4fe] shadow-[0_0_15px_rgba(167,139,250,0.15)] border border-[#a78bfa]/30'
                : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
            }`}
          >
            <FileText size={16} />
            Reports
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="w-full">
        {activeTab === 'settings' && <Settings />}
        {activeTab === 'camera' && <Camera />}
        {activeTab === 'reports' && <Reports />}
      </div>
    </div>
  )
}
