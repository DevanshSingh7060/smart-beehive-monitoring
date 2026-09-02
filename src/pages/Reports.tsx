import { useState } from 'react'
import { FileText, Download, Share2, RefreshCw, CheckCircle2, Calendar, FileBox } from 'lucide-react'

const reportTypes = [
  { id: 'daily', label: 'Daily Hive Report', desc: 'Sensor readings and events for a single day' },
  { id: 'weekly', label: 'Weekly Hive Report', desc: 'Week-over-week trends and comparisons' },
  { id: 'monthly', label: 'Monthly Hive Report', desc: 'Monthly performance summary' },
  { id: 'health', label: 'Health Report', desc: 'Hive health scores and AI analysis' },
  { id: 'productivity', label: 'Productivity Report', desc: 'Weight trends and honey production estimates' },
  { id: 'alert', label: 'Alert Report', desc: 'Full alert history and resolution status' },
  { id: 'ai', label: 'AI Analysis Report', desc: 'AI behavioral analysis and risk assessments' },
]

export default function Reports() {
  const [reportType, setReportType] = useState('weekly')
  const [hive, setHive] = useState('all')
  const [generated, setGenerated] = useState(false)
  const [loading, setLoading] = useState(false)
  const [dateFrom, setDateFrom] = useState('2026-08-01')
  const [dateTo, setDateTo] = useState('2026-08-08')

  const generate = async () => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 1400))
    setLoading(false)
    setGenerated(true)
  }

  const rt = reportTypes.find(r => r.id === reportType)

  return (
    <div className="space-y-6">

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Configuration */}
        <div className="glass-panel border border-[var(--border-subtle)] p-6 rounded-3xl h-fit">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[var(--border-subtle)]">
            <div className="p-2 bg-[#fbbf24]/10 rounded-lg text-[#fbbf24]">
              <FileBox size={18} />
            </div>
            <h2 className="font-display font-bold text-[var(--text-primary)] text-lg tracking-wide">Report Config</h2>
          </div>

          <div className="mb-6">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-[var(--text-tertiary)] mb-3">Report Type</label>
            <div className="space-y-2">
              {reportTypes.map(r => (
                <label key={r.id} className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer border transition-all ${reportType === r.id ? 'border-[#fbbf24]/40 bg-[#fbbf24]/10 shadow-[0_0_10px_rgba(251,191,36,0.1)]' : 'border-transparent hover:bg-[var(--bg-card-hover)]'}`}>
                  <input type="radio" name="report" value={r.id} checked={reportType === r.id} onChange={() => setReportType(r.id)} className="mt-1 accent-[#fbbf24]" />
                  <div>
                    <div className={`text-sm font-bold tracking-wide transition-colors ${reportType === r.id ? 'text-[#fbbf24]' : 'text-[var(--text-primary)]'}`}>{r.label}</div>
                    <div className="text-[var(--text-tertiary)] text-[10px] font-medium uppercase tracking-wider mt-0.5">{r.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-[var(--text-tertiary)] mb-2">Target Scope</label>
            <select value={hive} onChange={e => setHive(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-input)] text-sm font-bold tracking-wide text-[var(--text-primary)] outline-none focus:border-[#fbbf24]/50 focus:bg-[#fbbf24]/5 transition-all custom-select shadow-inner">
              <option value="all" className="text-[var(--bg-main)]">All Connected Hives</option>
              <option value="A01" className="text-[var(--bg-main)]">Hive A-01 (South Orchard)</option>
              <option value="A02" className="text-[var(--bg-main)]">Hive A-02 (West Meadow)</option>
              <option value="B01" className="text-[var(--bg-main)]">Hive B-01 (North Pasture)</option>
              <option value="B02" className="text-[var(--bg-main)]">Hive B-02 (East Grove)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-[var(--text-tertiary)] mb-2">Start Date</label>
              <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-input)] text-sm font-bold tracking-wide text-[var(--text-primary)] outline-none focus:border-[#fbbf24]/50 focus:bg-[#fbbf24]/5 transition-all shadow-inner custom-date" />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-[var(--text-tertiary)] mb-2">End Date</label>
              <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-input)] text-sm font-bold tracking-wide text-[var(--text-primary)] outline-none focus:border-[#fbbf24]/50 focus:bg-[#fbbf24]/5 transition-all shadow-inner custom-date" />
            </div>
          </div>

          <button onClick={generate} disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-[#fbbf24] hover:bg-[#fbbf24]/90 text-[var(--bg-main)] text-sm font-bold uppercase tracking-wider py-3.5 rounded-xl transition-all disabled:opacity-70 shadow-[0_0_15px_rgba(251,191,36,0.3)]">
            {loading ? (
              <>
                <RefreshCw size={16} className="animate-spin" />
                Processing Data…
              </>
            ) : (
              <><FileText size={16} /> Generate Report</>
            )}
          </button>
        </div>

        {/* Preview */}
        <div className="xl:col-span-2">
          {generated ? (
            <div className="glass-panel-elevated rounded-3xl border border-[var(--border-subtle)] overflow-hidden animate-in zoom-in-95 duration-500 shadow-2xl relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#fbbf24]/10 rounded-full blur-[80px] pointer-events-none" />

              {/* Report header */}
              <div className="bg-black/60 backdrop-blur-md p-8 border-b border-[var(--border-subtle)] relative z-10">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
                        <polygon points="16,2 28,9 28,23 16,30 4,23 4,9" fill="#fbbf24" opacity="0.2" stroke="#fbbf24" strokeWidth="1.5" />
                        <circle cx="16" cy="15" r="3" fill="#fbbf24" />
                      </svg>
                      <span className="text-[#fbbf24] text-xs font-bold tracking-widest uppercase">HiveSense OS</span>
                    </div>
                    <h3 className="font-display text-2xl lg:text-3xl font-bold text-[var(--text-primary)] tracking-wide">{rt?.label}</h3>
                    <div className="flex items-center gap-2 text-[var(--text-tertiary)] text-xs font-bold uppercase tracking-wider mt-2">
                      <Calendar size={14} />
                      <span>{dateFrom} — {dateTo}</span>
                      <span className="text-[var(--text-muted)] px-1">|</span>
                      <span className="text-[var(--text-secondary)]">{hive === 'all' ? 'All Connected Hives' : `Node ${hive}`}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 bg-[#4ade80]/10 border border-[#4ade80]/20 text-[#4ade80] px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest shadow-[0_0_10px_rgba(74,222,128,0.1)] self-start">
                    <CheckCircle2 size={14} /> Ready
                  </div>
                </div>
              </div>

              <div className="p-8 space-y-8 relative z-10">
                {/* Summary */}
                <div>
                  <h4 className="font-display font-bold text-[var(--text-primary)] text-lg tracking-wide mb-4">Executive Summary</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                      { label: 'Avg Health Score', value: '87.8%', color: '#4ade80', glow: 'rgba(74,222,128,0.1)' },
                      { label: 'Avg Temperature', value: '34.1°C', color: '#fbbf24', glow: 'rgba(251,191,36,0.1)' },
                      { label: 'Total Weight Δ', value: '+2.4 kg', color: '#a78bfa', glow: 'rgba(167,139,250,0.1)' },
                      { label: 'Active Alerts', value: '3 Critical', color: '#ef4444', glow: 'rgba(239,68,68,0.1)' },
                    ].map(s => (
                      <div key={s.label} className="bg-[var(--bg-input)] rounded-2xl p-4 border border-[var(--border-subtle)] shadow-inner" style={{ boxShadow: `inset 0 0 20px ${s.glow}` }}>
                        <div className="font-mono-data text-2xl font-bold tracking-wide" style={{ color: s.color }}>{s.value}</div>
                        <div className="text-[var(--text-tertiary)] text-[10px] font-bold uppercase tracking-widest mt-1">{s.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Hive summary table */}
                <div>
                  <h4 className="font-display font-bold text-[var(--text-primary)] text-lg tracking-wide mb-4">Node Performance Index</h4>
                  <div className="overflow-x-auto bg-[var(--bg-input)] rounded-2xl border border-[var(--border-subtle)]">
                    <table className="w-full text-sm">
                      <thead className="bg-[var(--bg-card-hover)]">
                        <tr>
                          {['Identifier', 'Health Index', 'Avg Temp', 'Avg Hum', 'Weight Δ', 'Alerts', 'Status'].map(h => (
                            <th key={h} className="text-left py-3 px-4 text-[10px] font-bold uppercase tracking-widest text-[var(--text-tertiary)]">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {[
                          { name: 'Hive A-01', health: '94%', temp: '34.2°C', hum: '62%', weight: '+1.2 kg', alerts: 0, status: 'Optimal', sc: '#4ade80' },
                          { name: 'Hive A-02', health: '72%', temp: '36.4°C', hum: '69%', weight: '-1.4 kg', alerts: 2, status: 'Attention', sc: '#fbbf24' },
                          { name: 'Hive B-01', health: '81%', temp: '34.8°C', hum: '65%', weight: '+0.3 kg', alerts: 1, status: 'Monitor', sc: '#fbbf24' },
                          { name: 'Hive B-02', health: '89%', temp: '33.9°C', hum: '60%', weight: '+0.8 kg', alerts: 0, status: 'Optimal', sc: '#4ade80' },
                        ].map(r => (
                          <tr key={r.name} className="hover:bg-[var(--bg-card-hover)] transition-colors">
                            <td className="py-3 px-4 font-bold text-[var(--text-primary)]">{r.name}</td>
                            <td className="py-3 px-4 font-mono-data font-bold tracking-wide" style={{ color: r.sc }}>{r.health}</td>
                            <td className="py-3 px-4 font-mono-data font-bold text-[var(--text-secondary)]">{r.temp}</td>
                            <td className="py-3 px-4 font-mono-data font-bold text-[var(--text-secondary)]">{r.hum}</td>
                            <td className="py-3 px-4 font-mono-data font-bold" style={{ color: r.weight.startsWith('+') ? '#4ade80' : '#ef4444' }}>{r.weight}</td>
                            <td className="py-3 px-4 font-mono-data font-bold text-[var(--text-secondary)]">{r.alerts}</td>
                            <td className="py-3 px-4">
                              <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest" style={{ color: r.sc, backgroundColor: `${r.sc}15`, border: `1px solid ${r.sc}30` }}>{r.status}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-4 pt-6 border-t border-[var(--border-subtle)]">
                  <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#fbbf24] hover:bg-[#fbbf24]/90 text-[var(--bg-main)] text-xs font-bold uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(251,191,36,0.3)]">
                    <Download size={16} /> Download PDF
                  </button>
                  <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--bg-card-hover)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-xs font-bold uppercase tracking-wider transition-all">
                    <Download size={16} className="text-[var(--text-tertiary)]" /> Export CSV
                  </button>
                  <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--bg-card-hover)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-xs font-bold uppercase tracking-wider transition-all ml-auto">
                    <Share2 size={16} className="text-[#a78bfa]" /> Share Secure Link
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-panel border border-[var(--border-subtle)] rounded-3xl h-full min-h-[500px] flex flex-col items-center justify-center text-center p-10 relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none" />
              
              <div className="w-20 h-20 rounded-3xl bg-[var(--bg-input)] border border-[var(--border-subtle)] flex items-center justify-center mb-6 shadow-inner relative z-10">
                <FileText size={32} className="text-[var(--text-muted)]" />
              </div>
              <div className="font-display font-bold text-2xl text-[var(--text-primary)] tracking-wide mb-2 relative z-10">Awaiting Generation</div>
              <div className="text-[var(--text-tertiary)] text-sm font-medium max-w-sm relative z-10">Select your telemetry scope and timeframe from the config panel, then initialize the report generation.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
