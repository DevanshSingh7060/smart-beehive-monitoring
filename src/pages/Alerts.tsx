import { useState } from 'react'
import { AlertTriangle, CheckCircle2, Info, X, Eye, Check, ChevronRight, Filter, Search } from 'lucide-react'
import { alerts } from '../data/mockData'

const allAlerts = [
  ...alerts,
  {
    id: 5, severity: 'warning', type: 'Temperature Spike Detected',
    hive: 'Hive B-02', hiveId: 'B02', time: '6:30 AM', status: 'Resolved',
    confidence: 88,
    reason: 'Temperature briefly exceeded the maximum threshold of 36°C before returning to normal.',
    readings: { temperature: 36.8, humidity: 64, weight: 0.1, buzzing: 'Normal', activity: 'Normal' },
  },
  {
    id: 6, severity: 'info', type: 'Hive Data Synchronized',
    hive: 'All Hives', hiveId: 'ALL', time: '5:00 AM', status: 'Resolved',
    confidence: 100,
    reason: 'Scheduled synchronization completed successfully. All sensor data is up to date.',
    readings: { temperature: 33.4, humidity: 60, weight: 0, buzzing: 'Normal', activity: 'Low' },
  },
]

export default function Alerts() {
  const [tab, setTab] = useState('All')
  const [selected, setSelected] = useState<typeof allAlerts[0] | null>(null)
  const [search, setSearch] = useState('')

  const tabs = ['All', 'Critical', 'Warning', 'Resolved']

  const filtered = allAlerts.filter(a => {
    const matchTab = tab === 'All' ? true
      : tab === 'Critical' ? a.severity === 'critical'
      : tab === 'Warning' ? (a.severity === 'warning')
      : a.status === 'Resolved'
    const matchSearch = a.type.toLowerCase().includes(search.toLowerCase()) || a.hive.toLowerCase().includes(search.toLowerCase())
    return matchTab && matchSearch
  })

  const sevConfig = {
    critical: { color: '#dc2626', bg: '#fef2f2', border: '#dc262625', icon: AlertTriangle, label: 'Critical' },
    warning: { color: '#d97706', bg: '#fffbeb', border: '#d9770625', icon: AlertTriangle, label: 'Warning' },
    info: { color: '#2563eb', bg: '#eff6ff', border: '#2563eb25', icon: Info, label: 'Info' },
  }

  return (
    <div className="p-4 lg:p-6 max-w-[1600px]">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-semibold text-[#1c1917]">Alerts</h1>
        <p className="text-[#78716c] text-sm mt-1">Monitor and manage hive alerts across your apiary.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Alert list */}
        <div className="xl:col-span-2">
          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a09890]" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search alerts…"
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#e8e3db] bg-white text-sm text-[#1c1917] placeholder:text-[#a09890] outline-none focus:border-[#d97706] transition-colors" />
            </div>
            <button className="flex items-center gap-2 px-3 py-2 rounded-xl border border-[#e8e3db] bg-white text-sm text-[#78716c] hover:border-[#d97706]/40 transition-colors">
              <Filter size={14} /> Filter
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-4 bg-[#f7f5f0] p-1 rounded-xl border border-[#e8e3db]">
            {tabs.map(t => {
              const count = allAlerts.filter(a =>
                t === 'All' ? true : t === 'Critical' ? a.severity === 'critical'
                : t === 'Warning' ? a.severity === 'warning' : a.status === 'Resolved'
              ).length
              return (
                <button key={t} onClick={() => setTab(t)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium transition-all ${tab === t ? 'bg-white text-[#1c1917] shadow-sm' : 'text-[#78716c]'}`}>
                  {t}
                  {count > 0 && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold
                      ${tab === t
                        ? t === 'Critical' ? 'bg-[#dc2626] text-white' : t === 'Warning' ? 'bg-[#d97706] text-white' : 'bg-[#e8e3db] text-[#1c1917]'
                        : 'bg-[#e8e3db] text-[#78716c]'
                      }`}>
                      {count}
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          {/* Alert cards */}
          <div className="space-y-2">
            {filtered.map(a => {
              const sc = sevConfig[a.severity as keyof typeof sevConfig] ?? sevConfig.info
              const IconComp = sc.icon
              const isSelected = selected?.id === a.id
              return (
                <div key={a.id}
                  onClick={() => setSelected(isSelected ? null : a)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all duration-150 ${isSelected ? 'ring-2 ring-[#d97706]/40' : 'hover:shadow-sm'}`}
                  style={{ borderColor: sc.border, backgroundColor: sc.bg }}>
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${sc.color}15` }}>
                      <IconComp size={13} style={{ color: sc.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-semibold" style={{ color: sc.color }}>{sc.label}</span>
                            <span className="text-xs font-medium text-[#1c1917]">{a.type}</span>
                          </div>
                          <div className="text-[#78716c] text-[11px] mt-0.5">{a.hive} · {a.time}</div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border
                            ${a.status === 'Active' ? 'text-[#dc2626] bg-[#fef2f2] border-[#dc262630]' : 'text-[#16a34a] bg-[#f0fdf4] border-[#16a34a30]'}`}>
                            {a.status}
                          </span>
                        </div>
                      </div>
                      {isSelected && (
                        <div className="mt-3 text-[#78716c] text-xs leading-relaxed">{a.reason}</div>
                      )}
                    </div>
                    <ChevronRight size={14} className="text-[#a09890] flex-shrink-0 mt-0.5" style={{ transform: isSelected ? 'rotate(90deg)' : '', transition: 'transform 0.15s' }} />
                  </div>
                </div>
              )
            })}
            {filtered.length === 0 && (
              <div className="text-center py-12 text-[#78716c] text-sm">
                <CheckCircle2 size={32} className="mx-auto mb-2 text-[#16a34a] opacity-50" />
                No active alerts. Your hives look good.
              </div>
            )}
          </div>
        </div>

        {/* Alert Detail */}
        <div className="bg-white rounded-2xl border border-[#e8e3db] p-5">
          {selected ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-semibold text-[#1c1917] text-sm">Alert Detail</h2>
                <button onClick={() => setSelected(null)} className="text-[#a09890] hover:text-[#1c1917]"><X size={16} /></button>
              </div>
              {(() => {
                const sc = sevConfig[selected.severity as keyof typeof sevConfig] ?? sevConfig.info
                return (
                  <>
                    <div className="p-3 rounded-xl mb-4 border" style={{ borderColor: sc.border, backgroundColor: sc.bg }}>
                      <div className="text-xs font-semibold mb-1" style={{ color: sc.color }}>{sc.label}</div>
                      <div className="font-display font-semibold text-[#1c1917] text-sm">{selected.type}</div>
                    </div>
                    <div className="space-y-2.5 mb-4 text-xs">
                      {[
                        { label: 'Hive', value: selected.hive },
                        { label: 'Detected', value: selected.time },
                        { label: 'Status', value: selected.status },
                        { label: 'AI Confidence', value: `${selected.confidence}%` },
                      ].map(r => (
                        <div key={r.label} className="flex justify-between py-1.5 border-b border-[#f7f5f0] last:border-0">
                          <span className="text-[#78716c]">{r.label}</span>
                          <span className="font-medium text-[#1c1917]">{r.value}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mb-4">
                      <div className="text-xs font-medium text-[#1c1917] mb-2">AI Assessment</div>
                      <p className="text-[#78716c] text-xs leading-relaxed">{selected.reason}</p>
                    </div>
                    <div className="mb-4">
                      <div className="text-xs font-medium text-[#1c1917] mb-2">Related Sensor Readings</div>
                      <div className="space-y-1.5">
                        {Object.entries(selected.readings).map(([k, v]) => (
                          <div key={k} className="flex justify-between text-xs py-1 border-b border-[#f7f5f0] last:border-0">
                            <span className="text-[#78716c] capitalize">{k}</span>
                            <span className="font-mono-data font-medium text-[#1c1917]">{String(v)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <button className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-[#16a34a]/8 border border-[#16a34a]/20 text-[#16a34a] text-xs font-medium hover:bg-[#16a34a]/15 transition-colors">
                        <Check size={12} /> Acknowledge
                      </button>
                      <button className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-[#f7f5f0] border border-[#e8e3db] text-[#78716c] text-xs font-medium hover:border-[#d97706]/40 transition-colors">
                        <Eye size={12} /> View Hive
                      </button>
                    </div>
                  </>
                )
              })()}
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <AlertTriangle size={28} className="text-[#d4cfc7] mb-3" />
              <div className="font-display font-medium text-[#1c1917] text-sm mb-1">Alert Details</div>
              <div className="text-[#78716c] text-xs">Select an alert to view its full details and take action.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
