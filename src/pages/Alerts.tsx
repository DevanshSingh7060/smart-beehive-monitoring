import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Bell,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Search,
  Check,
  ChevronRight,
  Filter,
  ShieldAlert,
  ArrowUpRight,
} from 'lucide-react'
import StatusBadge from '../components/StatusBadge'
import { alerts as mockAlerts } from '../data/mockData'

const detailedAlerts = [
  {
    id: 1,
    hive: 'Hive A-02',
    hiveId: 'A02',
    type: 'High Internal Temperature',
    severity: 'critical' as const,
    time: '12m ago',
    metric: 'Temperature: 36.4°C (Expected: 33.0–35.0°C)',
    reason:
      'Internal brood nest temperature has exceeded safe threshold by 1.4°C during high ambient noon heat.',
    aiReasoning:
      'Sensor correlation with LIS3DH accelerometer shows elevated worker fanning frequency, but top ventilation is insufficient for the solar load.',
    action: 'Open upper ventilation vent and check if shade board is displaced.',
    status: 'active',
  },
  {
    id: 2,
    hive: 'Hive B-01',
    hiveId: 'B01',
    type: 'Humidity Variance',
    severity: 'warning' as const,
    time: '1h ago',
    metric: 'Humidity: 74% (Optimal: 55–65%)',
    reason:
      'Internal moisture levels elevated above 70% for 3 consecutive hours following morning rain.',
    aiReasoning:
      'Mild condensation risk detected near the bottom board. Colony is active and clearing entrance puddles.',
    action: 'Inspect bottom board mesh for blockages or damp debris.',
    status: 'active',
  },
  {
    id: 3,
    hive: 'Hive C-02',
    hiveId: 'C02',
    type: 'Weight Loss Anomaly',
    severity: 'critical' as const,
    time: '2h ago',
    metric: 'Weight Delta: -2.1 kg (48 hrs)',
    reason:
      'Unexpected sharp weight decline not correlated with honey extraction or normal forage expenditure.',
    aiReasoning:
      'Possible robbing event or unmonitored partial swarm emergence detected by audio frequency drop.',
    action: 'Conduct physical frame inspection immediately and reduce entrance width.',
    status: 'active',
  },
  {
    id: 4,
    hive: 'Hive A-01',
    hiveId: 'A01',
    type: 'Entrance Congestion Resolved',
    severity: 'resolved' as const,
    time: '4h ago',
    metric: 'Traffic: 124 bees/min (Optimal)',
    reason: 'Morning flight bottleneck cleared after entrance reducer was adjusted.',
    aiReasoning: 'Computer vision confirms free bidirectional flight lanes.',
    action: 'No further action required.',
    status: 'resolved',
  },
]

export default function Alerts() {
  const navigate = useNavigate()
  const [alertsList, setAlertsList] = useState(detailedAlerts)
  const [filterTab, setFilterTab] = useState<'all' | 'critical' | 'warning' | 'resolved'>('all')
  const [search, setSearch] = useState('')

  const handleResolve = (id: number) => {
    setAlertsList(list =>
      list.map(a => (a.id === id ? { ...a, status: a.status === 'resolved' ? 'active' : 'resolved' } : a))
    )
  }

  const filtered = alertsList
    .filter(a => {
      if (filterTab === 'critical') return a.severity === 'critical' && a.status === 'active'
      if (filterTab === 'warning') return a.severity === 'warning' && a.status === 'active'
      if (filterTab === 'resolved') return a.status === 'resolved'
      return true
    })
    .filter(
      a =>
        a.hive.toLowerCase().includes(search.toLowerCase()) ||
        a.type.toLowerCase().includes(search.toLowerCase()) ||
        a.reason.toLowerCase().includes(search.toLowerCase())
    )

  const activeCount = alertsList.filter(a => a.status === 'active').length
  const criticalCount = alertsList.filter(a => a.severity === 'critical' && a.status === 'active').length

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-[1500px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-[#e8e3db] rounded-2xl p-4 lg:p-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-[#dc2626] bg-[#fef2f2] border border-[#fecaca] px-2 py-0.5 rounded-md flex items-center gap-1">
              <ShieldAlert size={11} />
              Incident Resolution Center
            </span>
            <span className="text-[#a09890]">·</span>
            <span className="text-xs text-[#78716c]">Prioritized Incident Triage</span>
          </div>
          <h2 className="font-display text-xl lg:text-2xl font-bold text-[#1c1917]">
            Active Apiary Alerts & Interventions
          </h2>
          <p className="text-xs text-[#78716c] mt-0.5">
            Automated sensor anomalies translated into actionable beekeeper steps.
          </p>
        </div>

        {/* Status indicator pills */}
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-[#fef2f2] border border-[#fecaca] text-[#dc2626] text-xs font-bold flex items-center gap-1.5">
            <AlertCircle size={14} />
            <span>{criticalCount} Critical</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-[#fffbeb] border border-[#fde68a] text-[#d97706] text-xs font-bold flex items-center gap-1.5">
            <AlertTriangle size={14} />
            <span>{activeCount - criticalCount} Attention</span>
          </div>
        </div>
      </div>

      {/* Controls Bar: Search & Tabs */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white border border-[#e8e3db] rounded-2xl p-3.5">
        <div className="flex bg-[#f7f5f0] border border-[#e8e3db] rounded-xl p-1 w-full sm:w-auto">
          {[
            { id: 'all', label: `All Alerts (${alertsList.length})` },
            { id: 'critical', label: `Critical (${criticalCount})` },
            { id: 'warning', label: 'Warnings' },
            { id: 'resolved', label: 'Resolved History' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterTab(tab.id as any)}
              className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-semibold transition-all
              ${
                filterTab === tab.id
                  ? 'bg-white text-[#1c1917] shadow-sm'
                  : 'text-[#78716c] hover:text-[#1c1917]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a09890]" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search alerts or hives…"
            className="w-full pl-9 pr-4 py-1.5 rounded-xl border border-[#e8e3db] bg-[#f7f5f0] text-xs text-[#1c1917] placeholder:text-[#a09890] outline-none focus:border-[#d97706] focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Alerts Grid */}
      <div className="space-y-4">
        {filtered.map(alert => {
          const isCritical = alert.severity === 'critical' && alert.status === 'active'
          const isResolved = alert.status === 'resolved'

          return (
            <div
              key={alert.id}
              className={`rounded-2xl border p-5 transition-all bg-white
              ${
                isResolved
                  ? 'opacity-70 border-[#e8e3db] bg-[#fafaf8]'
                  : isCritical
                  ? 'border-[#fca5a5] shadow-sm ring-1 ring-[#dc2626]/10'
                  : 'border-[#fde68a]'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                {/* Left info */}
                <div className="flex-1 space-y-2.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <StatusBadge
                      status={isResolved ? 'resolved' : alert.severity}
                      label={isResolved ? '✓ RESOLVED' : isCritical ? '● CRITICAL' : '⚠ ATTENTION'}
                      size="sm"
                    />
                    <span className="font-semibold text-xs text-[#1c1917]">{alert.hive}</span>
                    <span className="text-[#a09890]">·</span>
                    <span className="text-[11px] text-[#78716c]">{alert.time}</span>
                  </div>

                  <div>
                    <h3 className="font-display font-bold text-base text-[#1c1917]">
                      {alert.type}
                    </h3>
                    <div className="font-mono-data text-xs text-[#b45309] font-semibold mt-0.5">
                      {alert.metric}
                    </div>
                  </div>

                  <p className="text-xs text-[#57534e] leading-relaxed">
                    {alert.reason}
                  </p>

                  {/* AI Root-Cause Analysis Box */}
                  <div className="bg-[#faf5ff] border border-[#ddd6fe] rounded-xl p-3">
                    <div className="text-[10px] font-bold text-[#7c3aed] uppercase tracking-wider flex items-center gap-1 mb-1">
                      <Sparkles size={11} /> ✦ AI Root Cause Diagnosis
                    </div>
                    <p className="text-xs text-[#4c1d95] leading-snug">
                      {alert.aiReasoning}
                    </p>
                  </div>

                  {/* Recommended Action */}
                  <div className="bg-[#f7f5f0] border border-[#e8e3db] rounded-xl p-3 flex items-start gap-2">
                    <div className="text-xs font-semibold text-[#d97706] uppercase tracking-wider flex-shrink-0 mt-0.5">
                      Action Required:
                    </div>
                    <div className="text-xs font-medium text-[#1c1917]">
                      {alert.action}
                    </div>
                  </div>
                </div>

                {/* Right Action Buttons */}
                <div className="flex lg:flex-col items-center justify-end gap-2 flex-shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-[#f0ede8]">
                  <button
                    onClick={() => handleResolve(alert.id)}
                    className={`w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors
                    ${
                      isResolved
                        ? 'bg-white border border-[#e8e3db] text-[#78716c] hover:bg-[#f7f5f0]'
                        : 'bg-[#16a34a] hover:bg-[#15803d] text-white'
                    }`}
                  >
                    <Check size={13} />
                    <span>{isResolved ? 'Re-open Incident' : 'Mark Resolved'}</span>
                  </button>

                  <button
                    onClick={() => navigate(`/hives/${alert.hiveId}`)}
                    className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#1c1917] hover:bg-[#292524] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>View Hive Telemetry</span>
                    <ArrowUpRight size={13} />
                  </button>
                </div>
              </div>
            </div>
          )
        })}

        {filtered.length === 0 && (
          <div className="bg-white rounded-2xl border border-[#e8e3db] p-12 text-center">
            <CheckCircle2 size={36} className="text-[#16a34a] mx-auto mb-2" />
            <h3 className="font-display font-bold text-base text-[#1c1917]">
              No Alerts In This Category
            </h3>
            <p className="text-xs text-[#78716c] mt-1">
              All hive parameters are operating within normal tolerances.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
