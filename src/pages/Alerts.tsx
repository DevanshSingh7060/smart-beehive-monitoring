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
    <div className="space-y-6 max-w-[1500px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel-elevated rounded-3xl p-6 lg:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#ef4444]/10 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-[10px] font-bold tracking-widest uppercase text-[#ef4444] bg-[#ef4444]/10 border border-[#ef4444]/30 px-2 py-0.5 rounded flex items-center gap-1.5 shadow-[0_0_10px_rgba(239,68,68,0.2)]">
              <ShieldAlert size={12} />
              Incident Resolution Center
            </span>
            <span className="text-[var(--text-muted)]">·</span>
            <span className="text-xs font-bold tracking-wider uppercase text-[var(--text-tertiary)]">Prioritized Triage</span>
          </div>
          <h2 className="font-display text-2xl lg:text-3xl font-bold text-[var(--text-primary)] ai-glow-text">
            Active Apiary Alerts
          </h2>
          <p className="text-sm text-[var(--text-tertiary)] mt-1 font-medium">
            Automated sensor anomalies translated into actionable interventions.
          </p>
        </div>

        {/* Status indicator pills */}
        <div className="flex flex-col sm:flex-row items-center gap-3 relative z-10 mt-4 sm:mt-0">
          <div className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-[#ef4444]/10 border border-[#ef4444]/30 text-[#ef4444] text-sm font-bold tracking-wider uppercase flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
            <AlertCircle size={16} />
            <span>{criticalCount} Critical</span>
          </div>
          <div className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-[#fbbf24]/10 border border-[#fbbf24]/30 text-[#fbbf24] text-sm font-bold tracking-wider uppercase flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(251,191,36,0.15)]">
            <AlertTriangle size={16} />
            <span>{activeCount - criticalCount} Attention</span>
          </div>
        </div>
      </div>

      {/* Controls Bar: Search & Tabs */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 glass-panel border border-[var(--border-subtle)] rounded-2xl p-4 relative z-10">
        <div className="flex bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-xl p-1 w-full sm:w-auto shadow-inner">
          {[
            { id: 'all', label: `All Alerts (${alertsList.length})` },
            { id: 'critical', label: `Critical (${criticalCount})` },
            { id: 'warning', label: 'Warnings' },
            { id: 'resolved', label: 'Resolved History' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterTab(tab.id as any)}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold tracking-wider uppercase transition-all
              ${
                filterTab === tab.id
                  ? 'bg-[var(--bg-card-hover)] text-[var(--text-primary)] shadow-[0_0_10px_rgba(255,255,255,0.1)]'
                  : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search alerts or hives…"
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-input)] text-sm font-medium text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none focus:border-[#fbbf24]/50 focus:bg-[#fbbf24]/5 transition-all shadow-inner"
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
              className={`rounded-3xl border p-6 lg:p-8 transition-all duration-300 relative overflow-hidden group
              ${
                isResolved
                  ? 'opacity-50 grayscale-[50%] border-[var(--border-subtle)] glass-panel'
                  : isCritical
                  ? 'bg-[#ef4444]/5 border-[#ef4444]/30 shadow-[0_0_20px_rgba(239,68,68,0.1)] backdrop-blur-md'
                  : 'bg-[#fbbf24]/5 border-[#fbbf24]/30 shadow-[0_0_20px_rgba(251,191,36,0.1)] backdrop-blur-md'
              }`}
            >
              {isCritical && !isResolved && (
                 <div className="absolute top-0 right-0 w-32 h-32 bg-[#ef4444]/10 rounded-full blur-[40px] pointer-events-none group-hover:bg-[#ef4444]/20 transition-all" />
              )}
              
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 relative z-10">
                {/* Left info */}
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-3 flex-wrap">
                    <StatusBadge
                      status={isResolved ? 'resolved' : alert.severity}
                      label={isResolved ? '✓ RESOLVED' : isCritical ? '● CRITICAL' : '⚠ ATTENTION'}
                      size="sm"
                    />
                    <span className="font-bold tracking-wide text-sm text-[var(--text-primary)]">{alert.hive}</span>
                    <span className="text-[var(--text-muted)]">·</span>
                    <span className="text-xs font-bold tracking-wider uppercase text-[var(--text-tertiary)]">{alert.time}</span>
                  </div>

                  <div>
                    <h3 className="font-display font-bold text-xl text-[var(--text-primary)] mb-1">
                      {alert.type}
                    </h3>
                    <div className="font-mono-data text-sm text-[#fbbf24] font-bold tracking-wide">
                      {alert.metric}
                    </div>
                  </div>

                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed font-medium">
                    {alert.reason}
                  </p>

                  {/* AI Root-Cause Analysis Box */}
                  <div className="bg-[#a78bfa]/10 border border-[#a78bfa]/20 rounded-2xl p-4 shadow-inner relative overflow-hidden">
                     <div className="absolute inset-0 bg-gradient-to-tr from-[#a78bfa]/5 to-transparent pointer-events-none" />
                    <div className="text-[10px] font-bold text-[#c4b5fd] uppercase tracking-widest flex items-center gap-1.5 mb-2">
                      <Sparkles size={12} className="text-[#a78bfa]" /> ✦ AI Root Cause Diagnosis
                    </div>
                    <p className="text-sm font-medium text-[var(--text-secondary)] leading-snug relative z-10">
                      {alert.aiReasoning}
                    </p>
                  </div>

                  {/* Recommended Action */}
                  <div className="bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center gap-3 shadow-inner">
                    <div className="text-[11px] font-bold text-[#fbbf24] uppercase tracking-widest flex-shrink-0">
                      Action Required:
                    </div>
                    <div className="text-sm font-semibold text-[var(--text-secondary)]">
                      {alert.action}
                    </div>
                  </div>
                </div>

                {/* Right Action Buttons */}
                <div className="flex lg:flex-col items-center justify-end gap-3 flex-shrink-0 pt-4 lg:pt-0 border-t border-[var(--border-subtle)] lg:border-t-0 w-full lg:w-auto">
                  <button
                    onClick={() => handleResolve(alert.id)}
                    className={`w-full lg:w-48 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all
                    ${
                      isResolved
                        ? 'bg-[var(--bg-card-hover)] border border-[var(--border-subtle)] text-[var(--text-tertiary)] hover:bg-[var(--bg-card-hover)] hover:text-[var(--text-primary)]'
                        : 'bg-[#4ade80]/10 border border-[#4ade80]/30 text-[#4ade80] hover:bg-[#4ade80]/20 shadow-[0_0_15px_rgba(74,222,128,0.15)]'
                    }`}
                  >
                    <Check size={16} />
                    <span>{isResolved ? 'Re-open Incident' : 'Mark Resolved'}</span>
                  </button>

                  <button
                    onClick={() => navigate(`/hives/${alert.hiveId}`)}
                    className="w-full lg:w-48 px-4 py-3 rounded-xl bg-[var(--bg-card-hover)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-medium)] text-[var(--text-primary)] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-inner"
                  >
                    <span>View Telemetry</span>
                    <ArrowUpRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          )
        })}

        {filtered.length === 0 && (
          <div className="glass-panel-elevated rounded-3xl border border-[var(--border-subtle)] p-12 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-2xl bg-[#4ade80]/20 border border-[#4ade80]/40 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(74,222,128,0.2)]">
              <CheckCircle2 size={32} className="text-[#4ade80]" />
            </div>
            <h3 className="font-display font-bold text-xl text-[var(--text-primary)] tracking-wide">
              No Alerts In This Category
            </h3>
            <p className="text-sm font-medium text-[var(--text-tertiary)] mt-2">
              All hive parameters are operating within optimal tolerances.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
