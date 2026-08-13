import { useState } from 'react'
import { Play, Pause, Maximize2, Camera as CameraIcon, Circle, ZoomIn, ChevronDown, Wifi, BrainCircuit } from 'lucide-react'

export default function Camera() {
  const [playing, setPlaying] = useState(true)
  const [hive, setHive] = useState('A01')
  const [showBboxes, setShowBboxes] = useState(true)

  return (
    <div className="p-4 lg:p-6 max-w-[1600px] space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-[#1c1917]">Camera Monitoring</h1>
          <p className="text-[#78716c] text-sm mt-1">Live visual monitoring with AI object detection.</p>
        </div>
        <div className="flex items-center gap-2">
          <select value={hive} onChange={e => setHive(e.target.value)}
            className="px-3 py-2 rounded-xl border border-[#e8e3db] bg-white text-sm text-[#1c1917] outline-none focus:border-[#d97706]">
            <option value="A01">Hive A-01 — North Field</option>
            <option value="A02">Hive A-02 — South Garden</option>
            <option value="B01">Hive B-01 — East Meadow</option>
            <option value="B02">Hive B-02 — West Grove</option>
          </select>
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#16a34a]/8 border border-[#16a34a]/20">
            <span className="w-1.5 h-1.5 rounded-full bg-[#16a34a] live-dot" />
            <span className="text-[#16a34a] text-xs font-medium">Live</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Camera feed */}
        <div className="xl:col-span-2">
          <div className="bg-[#1c1917] rounded-2xl overflow-hidden relative aspect-video">
            {/* Feed placeholder with honeycomb SVG pattern */}
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-full h-full opacity-[0.03]" viewBox="0 0 800 450">
                {Array.from({ length: 10 }).map((_, row) =>
                  Array.from({ length: 8 }).map((_, col) => {
                    const x = col * 88 + (row % 2 === 1 ? 44 : 0)
                    const y = row * 78
                    const pts = Array.from({ length: 6 }, (_, i) => {
                      const a = (Math.PI / 3) * i - Math.PI / 6
                      return `${x + 38 * Math.cos(a)},${y + 38 * Math.sin(a)}`
                    }).join(' ')
                    return <polygon key={`${row}-${col}`} points={pts} fill="none" stroke="white" strokeWidth="1" />
                  })
                )}
              </svg>
              <div className="text-center z-10">
                <div className="w-16 h-16 rounded-2xl bg-white/8 border border-white/10 flex items-center justify-center mx-auto mb-4">
                  <CameraIcon size={28} className="text-white/50" />
                </div>
                <div className="text-white/50 text-sm font-medium">Camera Feed — Hive {hive}</div>
                <div className="text-white/25 text-xs mt-1">1920×1080 · 24 FPS · H.264</div>
              </div>
            </div>

            {/* AI detection boxes (simulated) */}
            {showBboxes && (
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute border-2 border-[#d97706] rounded" style={{ left: '28%', top: '38%', width: '14%', height: '22%' }}>
                  <span className="absolute -top-5 left-0 bg-[#d97706] text-white text-[10px] px-1.5 py-0.5 rounded whitespace-nowrap font-medium">Bee cluster 94%</span>
                </div>
                <div className="absolute border-2 border-[#16a34a] rounded" style={{ left: '55%', top: '42%', width: '10%', height: '16%' }}>
                  <span className="absolute -top-5 left-0 bg-[#16a34a] text-white text-[10px] px-1.5 py-0.5 rounded whitespace-nowrap font-medium">Normal 96%</span>
                </div>
                <div className="absolute border-2 border-[#2563eb] rounded" style={{ left: '42%', top: '55%', width: '8%', height: '14%' }}>
                  <span className="absolute -top-5 left-0 bg-[#2563eb] text-white text-[10px] px-1.5 py-0.5 rounded whitespace-nowrap font-medium">Queen 72%</span>
                </div>
              </div>
            )}

            {/* Status overlay top */}
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 bg-black/50 text-white px-2 py-1 rounded-lg text-[11px] font-medium backdrop-blur-sm">
                  <span className="w-1.5 h-1.5 bg-[#dc2626] rounded-full live-dot" />
                  LIVE
                </div>
                <div className="bg-black/40 text-white/70 px-2 py-1 rounded-lg text-[10px] backdrop-blur-sm">24 FPS</div>
              </div>
              <div className="flex items-center gap-1.5 bg-black/50 text-white px-2.5 py-1 rounded-lg text-[10px] backdrop-blur-sm">
                <BrainCircuit size={10} className="text-[#d97706]" /> AI Active
              </div>
            </div>

            {/* Bee count overlay */}
            <div className="absolute bottom-14 left-3 grid grid-cols-2 gap-2">
              {[
                { label: 'Bees Detected', value: '124' },
                { label: 'Activity', value: 'High' },
                { label: 'AI Confidence', value: '94%' },
              ].map(s => (
                <div key={s.label} className="bg-black/50 text-white px-2.5 py-1.5 rounded-lg backdrop-blur-sm">
                  <div className="font-mono-data text-sm font-medium">{s.value}</div>
                  <div className="text-white/50 text-[10px]">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Controls */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button onClick={() => setPlaying(!playing)}
                  className="w-8 h-8 rounded-lg bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-colors backdrop-blur-sm">
                  {playing ? <Pause size={14} /> : <Play size={14} />}
                </button>
                <button onClick={() => setShowBboxes(!showBboxes)}
                  className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-colors backdrop-blur-sm ${showBboxes ? 'bg-[#d97706]/80 text-white' : 'bg-white/15 text-white hover:bg-white/25'}`}>
                  AI Boxes
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button className="w-8 h-8 rounded-lg bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-colors backdrop-blur-sm">
                  <CameraIcon size={13} />
                </button>
                <button className="w-8 h-8 rounded-lg bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-colors backdrop-blur-sm">
                  <Circle size={13} className="text-[#dc2626]" />
                </button>
                <button className="w-8 h-8 rounded-lg bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-colors backdrop-blur-sm">
                  <ZoomIn size={13} />
                </button>
                <button className="w-8 h-8 rounded-lg bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-colors backdrop-blur-sm">
                  <Maximize2 size={13} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* AI Visual Analysis */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-[#e8e3db] p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-[#d97706]/10 flex items-center justify-center">
                <BrainCircuit size={13} className="text-[#d97706]" />
              </div>
              <h2 className="font-display font-semibold text-[#1c1917] text-sm">AI Visual Analysis</h2>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Bee Count', value: '124', status: 'Normal', color: '#16a34a' },
                { label: 'Bee Activity', value: 'High', status: 'Active', color: '#d97706' },
                { label: 'Crowding', value: 'Normal', status: 'Normal', color: '#16a34a' },
                { label: 'Abnormal Movement', value: 'Not Detected', status: 'Clear', color: '#16a34a' },
                { label: 'Possible Swarming', value: 'Low', status: '12% risk', color: '#16a34a' },
                { label: 'AI Confidence', value: '94%', status: 'High', color: '#d97706' },
              ].map(r => (
                <div key={r.label} className="flex items-center justify-between py-2 border-b border-[#f7f5f0] last:border-0">
                  <span className="text-[#78716c] text-xs">{r.label}</span>
                  <div className="text-right">
                    <div className="font-mono-data text-xs font-medium" style={{ color: r.color }}>{r.value}</div>
                    <div className="text-[#a09890] text-[10px]">{r.status}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#e8e3db] p-4">
            <div className="text-xs font-medium text-[#1c1917] mb-3">Detection Classes</div>
            <div className="space-y-2">
              {[
                { cls: 'Worker Bees', count: 118, pct: 95, color: '#d97706' },
                { cls: 'Forager Bees', count: 34, pct: 27, color: '#2563eb' },
                { cls: 'Possible Queen', count: 1, pct: 1, color: '#7c3aed' },
                { cls: 'Capped Brood', count: 12, pct: 10, color: '#16a34a' },
              ].map(d => (
                <div key={d.cls}>
                  <div className="flex justify-between text-[10px] mb-1">
                    <span className="text-[#78716c]">{d.cls}</span>
                    <span className="font-mono-data text-[#1c1917]">{d.count}</span>
                  </div>
                  <div className="h-1 bg-[#f0ede8] rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${d.pct}%`, backgroundColor: d.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
