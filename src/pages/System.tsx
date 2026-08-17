import React, { useState } from 'react'
import { Server, Settings as SettingsIcon, Camera as CameraIcon, FileText } from 'lucide-react'
import Settings from './Settings'
import Camera from './Camera'
import Reports from './Reports'

export default function System() {
  const [activeTab, setActiveTab] = useState<'settings' | 'camera' | 'reports'>('settings')

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-7 space-y-7">
      {/* Unified Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-[#e8e3db] rounded-2xl p-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-[#16a34a] bg-[#f0fdf4] border border-[#bbf7d0] px-2 py-0.5 rounded-md flex items-center gap-1">
              <Server size={11} />
              System Architecture
            </span>
          </div>
          <h2 className="font-display text-xl lg:text-2xl font-bold text-[#1c1917]">
            System & Diagnostics
          </h2>
          <p className="text-xs text-[#78716c] mt-0.5">
            Manage your apiary hardware, generated reports, camera feeds, and core settings.
          </p>
        </div>

        {/* Top Navigation Tabs */}
        <div className="flex bg-[#f7f5f0] border border-[#e8e3db] rounded-xl p-1 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2
            ${
              activeTab === 'settings'
                ? 'bg-white text-[#1c1917] shadow-sm'
                : 'text-[#78716c] hover:text-[#1c1917]'
            }`}
          >
            <SettingsIcon size={16} />
            Settings & IoT
          </button>
          <button
            onClick={() => setActiveTab('camera')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2
            ${
              activeTab === 'camera'
                ? 'bg-white text-[#1c1917] shadow-sm'
                : 'text-[#78716c] hover:text-[#1c1917]'
            }`}
          >
            <CameraIcon size={16} />
            Camera
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2
            ${
              activeTab === 'reports'
                ? 'bg-white text-[#1c1917] shadow-sm'
                : 'text-[#78716c] hover:text-[#1c1917]'
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
