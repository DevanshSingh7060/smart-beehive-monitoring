import { useState } from 'react'
import { FileText, Download, Share2, RefreshCw, CheckCircle2 } from 'lucide-react'

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
        <div className="bg-white rounded-2xl border border-[#e8e3db] p-5">
          <h2 className="font-display font-semibold text-[#1c1917] text-base mb-4">Report Configuration</h2>

          <div className="mb-4">
            <label className="block text-xs font-medium text-[#1c1917] mb-2">Report Type</label>
            <div className="space-y-1.5">
              {reportTypes.map(r => (
                <label key={r.id} className={`flex items-start gap-2.5 p-2.5 rounded-xl cursor-pointer border transition-all ${reportType === r.id ? 'border-[#d97706]/40 bg-[#fffbeb]' : 'border-transparent hover:bg-[#f7f5f0]'}`}>
                  <input type="radio" name="report" value={r.id} checked={reportType === r.id} onChange={() => setReportType(r.id)} className="mt-0.5 accent-[#d97706]" />
                  <div>
                    <div className="text-xs font-medium text-[#1c1917]">{r.label}</div>
                    <div className="text-[#78716c] text-[10px]">{r.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-xs font-medium text-[#1c1917] mb-1.5">Hive</label>
            <select value={hive} onChange={e => setHive(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#e8e3db] bg-white text-sm text-[#1c1917] outline-none focus:border-[#d97706]">
              <option value="all">All Hives</option>
              <option value="A01">Hive A-01</option>
              <option value="A02">Hive A-02</option>
              <option value="B01">Hive B-01</option>
              <option value="B02">Hive B-02</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-5">
            <div>
              <label className="block text-xs font-medium text-[#1c1917] mb-1.5">From</label>
              <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#e8e3db] bg-white text-sm text-[#1c1917] outline-none focus:border-[#d97706]" />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#1c1917] mb-1.5">To</label>
              <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#e8e3db] bg-white text-sm text-[#1c1917] outline-none focus:border-[#d97706]" />
            </div>
          </div>

          <button onClick={generate} disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-[#d97706] hover:bg-[#b45309] text-white text-sm font-medium py-2.5 rounded-xl transition-all disabled:opacity-70">
            {loading ? (
              <>
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
                  <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
                Generating…
              </>
            ) : (
              <><FileText size={15} /> Generate Report</>
            )}
          </button>
        </div>

        {/* Preview */}
        <div className="xl:col-span-2">
          {generated ? (
            <div className="bg-white rounded-2xl border border-[#e8e3db] overflow-hidden">
              {/* Report header */}
              <div className="bg-[#1c1917] p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
                        <polygon points="16,2 28,9 28,23 16,30 4,23 4,9" fill="#d97706" opacity="0.2" stroke="#d97706" strokeWidth="1.5" />
                        <circle cx="16" cy="15" r="3" fill="#d97706" />
                      </svg>
                      <span className="text-[#d97706] text-xs font-medium tracking-wider uppercase">HiveSense AI</span>
                    </div>
                    <h3 className="font-display text-xl font-semibold text-white">{rt?.label}</h3>
                    <p className="text-white/50 text-sm mt-1">
                      {hive === 'all' ? 'All Hives' : `Hive ${hive}`} · {dateFrom} to {dateTo}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 bg-[#16a34a]/20 text-[#4ade80] px-2.5 py-1 rounded-lg text-xs font-medium">
                    <CheckCircle2 size={12} /> Generated
                  </div>
                </div>
              </div>

              <div className="p-5 space-y-5">
                {/* Summary */}
                <div>
                  <h4 className="font-display font-semibold text-[#1c1917] text-sm mb-3">Executive Summary</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { label: 'Avg Health Score', value: '87.8%', color: '#16a34a' },
                      { label: 'Avg Temperature', value: '34.1°C', color: '#d97706' },
                      { label: 'Weight Change', value: '+2.4 kg', color: '#7c3aed' },
                      { label: 'Active Alerts', value: '3 total', color: '#dc2626' },
                    ].map(s => (
                      <div key={s.label} className="bg-[#f7f5f0] rounded-xl p-3 border border-[#e8e3db]">
                        <div className="font-mono-data text-lg font-medium" style={{ color: s.color }}>{s.value}</div>
                        <div className="text-[#78716c] text-[11px] mt-0.5">{s.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Hive summary table */}
                <div>
                  <h4 className="font-display font-semibold text-[#1c1917] text-sm mb-3">Hive Performance</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-[#e8e3db]">
                          {['Hive', 'Health', 'Avg Temp', 'Avg Humidity', 'Weight Δ', 'Alerts', 'Status'].map(h => (
                            <th key={h} className="text-left py-2 px-2 text-[#78716c] font-medium">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { name: 'Hive A-01', health: '94%', temp: '34.2°C', hum: '62%', weight: '+1.2 kg', alerts: 0, status: 'Healthy', sc: '#16a34a' },
                          { name: 'Hive A-02', health: '72%', temp: '36.4°C', hum: '69%', weight: '-1.4 kg', alerts: 2, status: 'Attention', sc: '#d97706' },
                          { name: 'Hive B-01', health: '81%', temp: '34.8°C', hum: '65%', weight: '+0.3 kg', alerts: 1, status: 'Monitor', sc: '#d97706' },
                          { name: 'Hive B-02', health: '89%', temp: '33.9°C', hum: '60%', weight: '+0.8 kg', alerts: 0, status: 'Healthy', sc: '#16a34a' },
                        ].map(r => (
                          <tr key={r.name} className="border-b border-[#f7f5f0] hover:bg-[#fafaf8]">
                            <td className="py-2.5 px-2 font-medium text-[#1c1917]">{r.name}</td>
                            <td className="py-2.5 px-2 font-mono-data font-medium" style={{ color: r.sc }}>{r.health}</td>
                            <td className="py-2.5 px-2 font-mono-data text-[#1c1917]">{r.temp}</td>
                            <td className="py-2.5 px-2 font-mono-data text-[#1c1917]">{r.hum}</td>
                            <td className="py-2.5 px-2 font-mono-data" style={{ color: r.weight.startsWith('+') ? '#16a34a' : '#dc2626' }}>{r.weight}</td>
                            <td className="py-2.5 px-2 font-mono-data text-[#1c1917]">{r.alerts}</td>
                            <td className="py-2.5 px-2"><span className="px-2 py-0.5 rounded-full text-[10px] font-medium" style={{ color: r.sc, backgroundColor: `${r.sc}12` }}>{r.status}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 pt-2 border-t border-[#f0ede8]">
                  <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#d97706] hover:bg-[#b45309] text-white text-xs font-medium transition-colors">
                    <Download size={13} /> Download PDF
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#e8e3db] bg-white text-xs text-[#78716c] hover:border-[#d97706]/40 transition-colors">
                    <Download size={13} /> Export CSV
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#e8e3db] bg-white text-xs text-[#78716c] hover:border-[#d97706]/40 transition-colors">
                    <Share2 size={13} /> Share
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-[#e8e3db] h-full min-h-[400px] flex flex-col items-center justify-center text-center p-10">
              <div className="w-16 h-16 rounded-2xl bg-[#f7f5f0] border border-[#e8e3db] flex items-center justify-center mb-4">
                <FileText size={24} className="text-[#d4cfc7]" />
              </div>
              <div className="font-display font-semibold text-[#1c1917] text-base mb-1">No report generated yet</div>
              <div className="text-[#78716c] text-sm max-w-xs">Configure your report parameters on the left and click &quot;Generate Report&quot; to create a detailed summary.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
