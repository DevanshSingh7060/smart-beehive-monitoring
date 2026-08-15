import React, { useState, useEffect } from 'react'
import {
  Camera as CameraIcon,
  Play,
  Pause,
  Maximize2,
  Download,
  RotateCw,
  Sparkles,
  Eye,
  EyeOff,
  Activity,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Radio,
  Sliders,
} from 'lucide-react'
import StatusBadge from '../components/StatusBadge'
import { hives } from '../data/mockData'

const sampleDetections = [
  { id: 1, type: 'Forager Bee', x: 28, y: 35, conf: 96, label: 'Pollen Carrier' },
  { id: 2, type: 'Forager Bee', x: 42, y: 55, conf: 94, label: 'Entering Hive' },
  { id: 3, type: 'Guard Bee', x: 68, y: 62, conf: 97, label: 'Entrance Guard' },
  { id: 4, type: 'Forager Bee', x: 52, y: 28, conf: 91, label: 'Exiting Flight' },
  { id: 5, type: 'Worker Cluster', x: 78, y: 44, conf: 98, label: 'Ventilation Fan' },
]

export default function Camera() {
  const [selectedHive, setSelectedHive] = useState(hives[0].id)
  const [isPlaying, setIsPlaying] = useState(true)
  const [showOverlays, setShowOverlays] = useState(true)
  const [showHeatmap, setShowHeatmap] = useState(false)
  const [beeCount, setBeeCount] = useState(124)
  const [snapshotTaken, setSnapshotTaken] = useState(false)
  const [snapshots, setSnapshots] = useState([
    { id: 1, time: '10:45 AM', count: 128, label: 'High Morning Flight' },
    { id: 2, time: '09:30 AM', count: 114, label: 'Pollen Peak' },
    { id: 3, time: '08:15 AM', count: 86, label: 'Early Emergence' },
  ])

  // Real-time bee count fluctuation simulation
  useEffect(() => {
    if (!isPlaying) return
    const interval = setInterval(() => {
      setBeeCount(c => Math.max(90, Math.min(160, c + Math.floor(Math.random() * 7) - 3)))
    }, 2800)
    return () => clearInterval(interval)
  }, [isPlaying])

  const handleTakeSnapshot = () => {
    setSnapshotTaken(true)
    const newSnap = {
      id: Date.now(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      count: beeCount,
      label: 'Manual Snapshot',
    }
    setSnapshots([newSnap, ...snapshots.slice(0, 4)])
    setTimeout(() => setSnapshotTaken(false), 2000)
  }

  const activeHiveObj = hives.find(h => h.id === selectedHive) || hives[0]

  return (
    <div className="p-4 lg:p-6 space-y-5 max-w-[1500px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-[#e8e3db] rounded-2xl p-4 lg:p-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-[#2563eb] bg-[#eff6ff] border border-[#bfdbfe] px-2 py-0.5 rounded-md flex items-center gap-1">
              <CameraIcon size={11} />
              Computer Vision
            </span>
            <span className="text-[#a09890]">·</span>
            <span className="text-xs text-[#78716c]">High-Speed Optical Telemetry</span>
          </div>
          <h2 className="font-display text-xl lg:text-2xl font-bold text-[#1c1917]">
            Live Entrance Camera & CV Analytics
          </h2>
          <p className="text-xs text-[#78716c] mt-0.5">
            Real-time bee counting, swarming trajectory analysis, and entrance traffic classification.
          </p>
        </div>

        {/* Hive selector & Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={selectedHive}
            onChange={e => setSelectedHive(e.target.value)}
            className="bg-[#f7f5f0] border border-[#e8e3db] text-xs font-semibold px-3 py-2 rounded-xl outline-none focus:border-[#d97706]"
          >
            {hives.map(h => (
              <option key={h.id} value={h.id}>
                {h.name} ({h.location})
              </option>
            ))}
          </select>
          <StatusBadge status="live" label="● 1080P 24FPS" />
        </div>
      </div>

      {/* Main Video Viewport & Controls */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        {/* Live Feed Container (cols 8) */}
        <div className="xl:col-span-8 space-y-3">
          <div className="relative aspect-[16/9] bg-[#12100e] rounded-2xl border border-[#e8e3db] overflow-hidden shadow-lg group">
            {/* Visual background simulation */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#1c1917] via-[#292524] to-[#1c1917] opacity-90" />

            {/* Honeycomb lattice texture */}
            <div className="absolute inset-0 opacity-10 flex items-center justify-center">
              <Layers size={140} className="text-white" />
            </div>

            {/* Live Camera Overlays (Bounding boxes) */}
            {showOverlays &&
              sampleDetections.map(box => (
                <div
                  key={box.id}
                  className="absolute border border-[#16a34a] rounded bg-[#16a34a]/15 p-1 transition-all duration-300 pointer-events-none"
                  style={{
                    left: `${box.x}%`,
                    top: `${box.y}%`,
                    width: '18%',
                    height: '22%',
                  }}
                >
                  <div className="absolute -top-5 left-0 bg-[#16a34a] text-white text-[9px] font-mono-data font-bold px-1.5 py-0.2 rounded shadow whitespace-nowrap">
                    {box.label} ({box.conf}%)
                  </div>
                </div>
              ))}

            {/* Simulated Heatmap glow */}
            {showHeatmap && (
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 via-amber-500/30 to-green-500/20 mix-blend-screen pointer-events-none" />
            )}

            {/* Live Feed Top Metadata */}
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-xs text-white z-10">
              <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-xl border border-white/10">
                <span className="w-2 h-2 rounded-full bg-[#16a34a] live-dot" />
                <span className="font-semibold">{activeHiveObj.name} Live Stream</span>
                <span className="text-white/40">|</span>
                <span className="font-mono-data text-[#fbbf24]">{beeCount} Bees In Frame</span>
              </div>

              <div className="bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-xl border border-white/10 font-mono-data text-[11px] text-white/80">
                Jetson Nano · 41ms CV
              </div>
            </div>

            {/* Center Pause Indicator if stopped */}
            {!isPlaying && (
              <div className="absolute inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-10">
                <div className="text-center text-white">
                  <Pause size={32} className="mx-auto mb-2 text-[#d97706]" />
                  <div className="text-sm font-semibold">Live Stream Paused</div>
                </div>
              </div>
            )}

            {/* Bottom Overlay Controls Bar */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2 z-10">
              <div className="flex items-center gap-2 bg-black/70 backdrop-blur-md p-1.5 rounded-xl border border-white/10">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                  title={isPlaying ? 'Pause Feed' : 'Resume Feed'}
                >
                  {isPlaying ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
                </button>

                <button
                  onClick={() => setShowOverlays(!showOverlays)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors
                  ${showOverlays ? 'bg-[#16a34a] text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}
                >
                  {showOverlays ? <Eye size={12} /> : <EyeOff size={12} />}
                  <span>CV AI Boxes</span>
                </button>

                <button
                  onClick={() => setShowHeatmap(!showHeatmap)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors hidden sm:flex
                  ${showHeatmap ? 'bg-[#d97706] text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}
                >
                  <Activity size={12} />
                  <span>Traffic Heatmap</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleTakeSnapshot}
                  className="px-3 py-2 rounded-xl bg-[#d97706] hover:bg-[#b45309] text-white text-xs font-semibold flex items-center gap-1.5 shadow transition-colors"
                >
                  <CameraIcon size={13} />
                  <span>{snapshotTaken ? 'Saved!' : 'Capture Snapshot'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Stream telemetry banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="bg-white border border-[#e8e3db] rounded-xl p-3 text-center">
              <div className="text-[10px] text-[#78716c]">Current Active Count</div>
              <div className="font-mono-data text-xl font-bold text-[#1c1917] mt-0.5">
                {beeCount}
              </div>
            </div>
            <div className="bg-white border border-[#e8e3db] rounded-xl p-3 text-center">
              <div className="text-[10px] text-[#78716c]">Entrance Traffic</div>
              <div className="font-semibold text-xs text-[#16a34a] mt-1.5">
                ✓ Heavy Foraging
              </div>
            </div>
            <div className="bg-white border border-[#e8e3db] rounded-xl p-3 text-center">
              <div className="text-[10px] text-[#78716c]">Swarming Cluster Risk</div>
              <div className="font-semibold text-xs text-[#16a34a] mt-1.5">
                Low (11% index)
              </div>
            </div>
            <div className="bg-white border border-[#e8e3db] rounded-xl p-3 text-center">
              <div className="text-[10px] text-[#78716c]">Camera Telemetry</div>
              <div className="font-mono-data text-xs text-[#78716c] mt-1.5">
                1080p · 24fps
              </div>
            </div>
          </div>
        </div>

        {/* Real-Time Computer Vision Intelligence (cols 4) */}
        <div className="xl:col-span-4 space-y-4">
          {/* AI Vision Diagnosis */}
          <div className="bg-white rounded-2xl border border-[#e8e3db] p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-[#7c3aed]" />
                <h3 className="font-display font-semibold text-sm text-[#1c1917]">
                  Computer Vision Diagnostics
                </h3>
              </div>
              <span className="text-[10px] font-bold text-[#16a34a] bg-[#f0fdf4] border border-[#bbf7d0] px-2 py-0.5 rounded">
                Normal State
              </span>
            </div>

            <p className="text-xs text-[#57534e] leading-relaxed bg-[#faf5ff] border border-[#ddd6fe] p-3 rounded-xl mb-4">
              AI model detects steady bidirectional flight paths. Pollen sac color indexing confirms high mustard & brassica foraging throughput.
            </p>

            <div className="space-y-2">
              <div className="flex justify-between text-xs py-1.5 border-b border-[#f0ede8]">
                <span className="text-[#78716c]">Pollen Carriers:</span>
                <span className="font-mono-data font-semibold text-[#1c1917]">68% of foragers</span>
              </div>
              <div className="flex justify-between text-xs py-1.5 border-b border-[#f0ede8]">
                <span className="text-[#78716c]">Entrance Congestion:</span>
                <span className="font-semibold text-[#16a34a]">Nominal (Flow is open)</span>
              </div>
              <div className="flex justify-between text-xs py-1.5 border-b border-[#f0ede8]">
                <span className="text-[#78716c]">Predator/Wasp Detection:</span>
                <span className="font-semibold text-[#16a34a]">None Detected (0)</span>
              </div>
              <div className="flex justify-between text-xs py-1.5">
                <span className="text-[#78716c]">CV Model Version:</span>
                <span className="font-mono-data text-[#78716c]">BeeYOLOv9-Edge</span>
              </div>
            </div>
          </div>

          {/* Recent Automated Snapshots */}
          <div className="bg-white rounded-2xl border border-[#e8e3db] p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display font-semibold text-sm text-[#1c1917]">
                Captured Activity Clips
              </h3>
              <span className="text-[11px] text-[#78716c]">{snapshots.length} snapshots</span>
            </div>

            <div className="space-y-2">
              {snapshots.map(snap => (
                <div
                  key={snap.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-[#fcfbf9] border border-[#e8e3db] hover:border-[#d97706]/30 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#2563eb]/10 flex items-center justify-center text-[#2563eb]">
                      <CameraIcon size={14} />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-[#1c1917]">{snap.label}</div>
                      <div className="text-[10px] text-[#78716c]">{snap.time}</div>
                    </div>
                  </div>
                  <div className="font-mono-data text-xs font-bold text-[#d97706]">
                    {snap.count} bees
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
