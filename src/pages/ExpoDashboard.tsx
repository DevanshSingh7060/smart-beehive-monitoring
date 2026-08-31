import { useMemo } from "react"
import {
  Thermometer,
  Droplets,
  Weight,
  Wind,
  Gauge,
  Play,
  Pause,
  RotateCcw,
  Activity,
  Cpu,
  Radio,
  Zap,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceArea,
  Legend,
} from "recharts"
import useSimulation from "../hooks/useSimulation"
import type { TelemetryReading } from "../hooks/useSimulation"

/* ─────────────────── Helpers ─────────────────── */

function formatTimestamp(ts: string) {
  const d = new Date(ts)
  return d.toLocaleString("en-GB", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function shortTime(ts: string) {
  const d = new Date(ts)
  return d.toLocaleString("en-GB", {
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function broodStatus(temp: number): {
  label: string
  color: string
  bg: string
} {
  if (temp >= 34.5 && temp <= 35.5)
    return { label: "Optimal", color: "#16a34a", bg: "#16a34a15" }
  if (temp < 34.5)
    return { label: "Chilled", color: "#2563eb", bg: "#2563eb15" }
  return { label: "Overheating", color: "#dc2626", bg: "#dc262615" }
}

function humidityStatus(h: number): {
  label: string
  color: string
  bg: string
} {
  if (h >= 50 && h <= 65)
    return { label: "Optimal", color: "#16a34a", bg: "#16a34a15" }
  if (h < 50) return { label: "Low", color: "#d97706", bg: "#d9770615" }
  return { label: "High", color: "#2563eb", bg: "#2563eb15" }
}

/* ─────────────────── Tooltip ─────────────────── */

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#1c1917] text-white px-3 py-2.5 rounded-xl text-xs shadow-2xl border border-white/10 min-w-[140px]">
      <div className="text-white/50 text-[10px] mb-1.5 font-medium">
        {label}
      </div>
      {payload.map((p: any, i: number) => (
        <div key={i} className="flex items-center gap-2 py-0.5">
          <span
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ backgroundColor: p.color }}
          />
          <span className="text-white/70 text-[10px]">{p.name}:</span>
          <span className="font-mono-data font-bold text-sm text-[#fbbf24] ml-auto">
            {typeof p.value === "number" ? p.value.toFixed(1) : p.value}
          </span>
        </div>
      ))}
    </div>
  )
}

/* ─────────────────── Main Component ─────────────────── */

export default function ExpoDashboard() {
  const sim = useSimulation()
  const { currentReading: r, previousReading: prev, history } = sim

  // Prepare chart data — limit to last 48 points for readability
  const chartData = useMemo(() => {
    const slice = history.slice(-72)
    return slice.map((d: TelemetryReading) => ({
      time: shortTime(d.timestamp),
      brood_temp: d.brood_temp,
      ambient_temp: d.ambient_temp,
      t_i_1: d.t_i_1,
      t_i_2: d.t_i_2,
      t_i_3: d.t_i_3,
      t_i_4: d.t_i_4,
      t_i_5: d.t_i_5,
      weight_kg: d.weight_kg,
      humidity: d.humidity,
      pressure: d.pressure,
    }))
  }, [history])

  const brood = broodStatus(r.brood_temp)
  const humid = humidityStatus(r.humidity)

  return (
    <div className="p-4 lg:p-6 space-y-5 max-w-[1500px] mx-auto pb-mobile-nav">
      {/* ════════════════ SECTION 4: Alert Banner ════════════════ */}
      {sim.mode === "swarming" && sim.isSwarmEvent ? (
        <div className="alert-pulse rounded-2xl border-2 border-[#dc2626]/40 bg-gradient-to-r from-[#dc2626]/10 via-[#fef2f2] to-[#dc2626]/10 p-4 flex items-center gap-3 shadow-lg shadow-red-100">
          <div className="w-10 h-10 rounded-xl bg-[#dc2626]/15 flex items-center justify-center flex-shrink-0">
            <AlertTriangle size={22} className="text-[#dc2626]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-bold text-[#dc2626]">
              🚨 Alert: Swarming Event Detected
            </div>
            <div className="text-xs text-[#991b1b] mt-0.5">
              Sudden weight reduction &amp; temperature rise detected at{" "}
              {r.event ? formatTimestamp(r.event) : "unknown time"}. Immediate
              inspection recommended.
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-[#16a34a]/30 bg-gradient-to-r from-[#16a34a]/5 via-[#f0fdf4] to-[#16a34a]/5 p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#16a34a]/10 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 size={22} className="text-[#16a34a]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-bold text-[#16a34a]">
              Colony Status: Healthy
            </div>
            <div className="text-xs text-[#166534] mt-0.5">
              Active thermoregulation confirmed. All sensor readings within
              nominal range.
            </div>
          </div>
        </div>
      )}

      {/* ════════════════ SECTION 1: Header & Controls ════════════════ */}
      <div className="bg-white rounded-2xl border border-[#e8e3db] shadow-sm p-5 lg:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Left: Title & Live badge */}
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <h1 className="font-display text-xl lg:text-2xl font-bold text-[#1c1917] tracking-tight">
                SmartHive Expo
              </h1>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#d97706]/10 border border-[#d97706]/25">
                <span className="w-1.5 h-1.5 rounded-full bg-[#d97706] live-dot" />
                <span className="text-[#d97706] text-[10px] font-bold uppercase tracking-wider">
                  Live Telemetry
                </span>
              </div>
            </div>
            <p className="text-xs text-[#78716c]">
              Real-time IoT sensor simulation ·{" "}
              <span className="font-mono-data text-[#57534e]">
                {formatTimestamp(r.timestamp)}
              </span>
            </p>
          </div>

          {/* Right: Mode Switcher & Playback */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            {/* Mode Toggle */}
            <div className="flex rounded-xl bg-[#f7f5f0] border border-[#e8e3db] p-1">
              <button
                onClick={() => sim.setMode("normal")}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                  sim.mode === "normal"
                    ? "bg-[#1c1917] text-white shadow-sm"
                    : "text-[#78716c] hover:text-[#1c1917]"
                }`}
              >
                🐝 Normal Hive
              </button>
              <button
                onClick={() => sim.setMode("swarming")}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                  sim.mode === "swarming"
                    ? "bg-[#dc2626] text-white shadow-sm"
                    : "text-[#78716c] hover:text-[#1c1917]"
                }`}
              >
                🚨 Swarming Event
              </button>
            </div>

            {/* Playback Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => (sim.playing ? sim.pause() : sim.play())}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
                  sim.playing
                    ? "bg-[#57534e] hover:bg-[#44403c] text-white"
                    : "bg-[#d97706] hover:bg-[#b45309] text-white"
                }`}
              >
                {sim.playing ? (
                  <Pause size={14} />
                ) : (
                  <Play size={14} />
                )}
                {sim.playing ? "Pause" : "Play"}
              </button>

              <button
                onClick={sim.reset}
                className="p-2 rounded-xl border border-[#e8e3db] hover:bg-[#f7f5f0] text-[#78716c] transition-colors"
                title="Reset"
              >
                <RotateCcw size={14} />
              </button>

              {/* Progress */}
              <div className="hidden sm:flex items-center gap-2 ml-1">
                <div className="w-32 h-1.5 rounded-full bg-[#f0ede8] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#d97706] transition-all duration-300"
                    style={{ width: `${sim.progress}%` }}
                  />
                </div>
                <span className="font-mono-data text-[10px] text-[#78716c] w-16 text-right">
                  {sim.currentIndex + 1}/{sim.dataset.length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Progress Bar */}
        <div className="sm:hidden mt-3">
          <div className="w-full h-1.5 rounded-full bg-[#f0ede8] overflow-hidden">
            <div
              className="h-full rounded-full bg-[#d97706] transition-all duration-300"
              style={{ width: `${sim.progress}%` }}
            />
          </div>
          <div className="flex justify-between mt-1">
            <span className="font-mono-data text-[10px] text-[#78716c]">
              {sim.currentIndex + 1} of {sim.dataset.length} readings
            </span>
            <span className="font-mono-data text-[10px] text-[#57534e]">
              {formatTimestamp(r.timestamp)}
            </span>
          </div>
        </div>
      </div>

      {/* ════════════════ SECTION 2: Metric Cards ════════════════ */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 lg:gap-4">
        {/* Brood Temperature */}
        <div className="glass-panel rounded-2xl p-4 lg:p-5 card-hover-effect shadow-sm">
          <div className="flex items-center gap-1.5 mb-3">
            <div className="w-7 h-7 rounded-lg bg-[#d97706]/10 flex items-center justify-center">
              <Thermometer size={15} className="text-[#d97706]" />
            </div>
            <span className="text-[11px] text-[#78716c] font-medium">
              Core Brood
            </span>
          </div>
          <div className="font-mono-data text-2xl lg:text-3xl font-bold text-[#1c1917] mb-1.5">
            {r.brood_temp.toFixed(1)}
            <span className="text-sm font-normal text-[#a8a29e] ml-0.5">
              °C
            </span>
          </div>
          <div
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider"
            style={{ color: brood.color, backgroundColor: brood.bg }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: brood.color }}
            />
            {brood.label}
          </div>
          <div className="text-[10px] text-[#a8a29e] mt-2">
            Optimal: 34.5–35.5°C
          </div>
        </div>

        {/* Ambient Temperature */}
        <div className="glass-panel rounded-2xl p-4 lg:p-5 card-hover-effect shadow-sm">
          <div className="flex items-center gap-1.5 mb-3">
            <div className="w-7 h-7 rounded-lg bg-[#2563eb]/10 flex items-center justify-center">
              <Wind size={15} className="text-[#2563eb]" />
            </div>
            <span className="text-[11px] text-[#78716c] font-medium">
              Ambient
            </span>
          </div>
          <div className="font-mono-data text-2xl lg:text-3xl font-bold text-[#1c1917] mb-1.5">
            {r.ambient_temp.toFixed(1)}
            <span className="text-sm font-normal text-[#a8a29e] ml-0.5">
              °C
            </span>
          </div>
          <div className="text-[10px] text-[#78716c] mt-1">
            External environment
          </div>
        </div>

        {/* Hive Weight */}
        <div className="glass-panel rounded-2xl p-4 lg:p-5 card-hover-effect shadow-sm">
          <div className="flex items-center gap-1.5 mb-3">
            <div className="w-7 h-7 rounded-lg bg-[#7c3aed]/10 flex items-center justify-center">
              <Weight size={15} className="text-[#7c3aed]" />
            </div>
            <span className="text-[11px] text-[#78716c] font-medium">
              Hive Weight
            </span>
          </div>
          <div className="font-mono-data text-2xl lg:text-3xl font-bold text-[#1c1917] mb-1.5">
            {r.weight_kg.toFixed(1)}
            <span className="text-sm font-normal text-[#a8a29e] ml-0.5">
              kg
            </span>
          </div>
          {sim.weightDelta !== 0 && (
            <div
              className={`text-xs font-semibold ${
                sim.weightDelta > 0 ? "text-[#16a34a]" : "text-[#dc2626]"
              }`}
            >
              {sim.weightDelta > 0 ? "↑" : "↓"}{" "}
              {Math.abs(sim.weightDelta).toFixed(2)} kg
            </div>
          )}
        </div>

        {/* Humidity */}
        <div className="glass-panel rounded-2xl p-4 lg:p-5 card-hover-effect shadow-sm">
          <div className="flex items-center gap-1.5 mb-3">
            <div className="w-7 h-7 rounded-lg bg-[#0891b2]/10 flex items-center justify-center">
              <Droplets size={15} className="text-[#0891b2]" />
            </div>
            <span className="text-[11px] text-[#78716c] font-medium">
              Humidity
            </span>
          </div>
          <div className="font-mono-data text-2xl lg:text-3xl font-bold text-[#1c1917] mb-1.5">
            {r.humidity.toFixed(1)}
            <span className="text-sm font-normal text-[#a8a29e] ml-0.5">
              %
            </span>
          </div>
          <div
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider"
            style={{ color: humid.color, backgroundColor: humid.bg }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: humid.color }}
            />
            {humid.label}
          </div>
          <div className="text-[10px] text-[#a8a29e] mt-2">
            Optimal: 50–65%
          </div>
        </div>

        {/* Pressure */}
        <div className="glass-panel rounded-2xl p-4 lg:p-5 card-hover-effect shadow-sm col-span-2 sm:col-span-1">
          <div className="flex items-center gap-1.5 mb-3">
            <div className="w-7 h-7 rounded-lg bg-[#78716c]/10 flex items-center justify-center">
              <Gauge size={15} className="text-[#78716c]" />
            </div>
            <span className="text-[11px] text-[#78716c] font-medium">
              Pressure
            </span>
          </div>
          <div className="font-mono-data text-2xl lg:text-3xl font-bold text-[#1c1917] mb-1.5">
            {r.pressure.toFixed(0)}
            <span className="text-sm font-normal text-[#a8a29e] ml-0.5">
              hPa
            </span>
          </div>
          <div className="text-[10px] text-[#78716c] mt-1">
            Atmospheric
          </div>
        </div>
      </div>

      {/* ════════════════ SECTION 3: Charts ════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Chart 1: Thermoregulation */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#e8e3db] p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display font-semibold text-base text-[#1c1917]">
                🌡️ Thermoregulation
              </h3>
              <p className="text-[11px] text-[#78716c] mt-0.5">
                Brood core vs. ambient temperature with individual probe
                readings
              </p>
            </div>
            <div className="flex items-center gap-3 text-[10px] text-[#78716c]">
              <span className="flex items-center gap-1">
                <span className="w-3 h-0.5 bg-[#d97706] rounded" /> Brood
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-0.5 bg-[#2563eb] rounded" /> Ambient
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-0.5 bg-[#d4d4d8] rounded" /> Probes
              </span>
            </div>
          </div>
          <div className="h-64 lg:h-72 -mx-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <defs>
                  <linearGradient
                    id="broodGrad"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#d97706" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#d97706" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#f0ede8"
                  vertical={false}
                />
                {/* Optimal brood zone reference band */}
                {chartData.length > 1 && (
                  <ReferenceArea
                    y1={34.5}
                    y2={35.5}
                    fill="#16a34a"
                    fillOpacity={0.06}
                    label={{
                      value: "Optimal 34.5–35.5°C",
                      position: "insideTopRight",
                      fontSize: 9,
                      fill: "#16a34a",
                    }}
                  />
                )}
                <XAxis
                  dataKey="time"
                  tick={{ fontSize: 10, fill: "#a09890" }}
                  axisLine={false}
                  tickLine={false}
                  interval="preserveStartEnd"
                />
                <YAxis
                  domain={["dataMin - 3", "dataMax + 3"]}
                  tick={{ fontSize: 10, fill: "#a09890" }}
                  axisLine={false}
                  tickLine={false}
                  width={36}
                />
                <Tooltip content={<ChartTooltip />} />
                {/* Individual probes — subtle */}
                <Line
                  type="monotone"
                  dataKey="t_i_1"
                  name="Probe 1"
                  stroke="#d4d4d8"
                  strokeWidth={1}
                  dot={false}
                  strokeDasharray="2 2"
                />
                <Line
                  type="monotone"
                  dataKey="t_i_2"
                  name="Probe 2"
                  stroke="#d4d4d8"
                  strokeWidth={1}
                  dot={false}
                  strokeDasharray="2 2"
                />
                <Line
                  type="monotone"
                  dataKey="t_i_3"
                  name="Probe 3"
                  stroke="#d4d4d8"
                  strokeWidth={1}
                  dot={false}
                  strokeDasharray="2 2"
                />
                {sim.mode === "swarming" && (
                  <>
                    <Line
                      type="monotone"
                      dataKey="t_i_4"
                      name="Probe 4"
                      stroke="#e4e4e7"
                      strokeWidth={1}
                      dot={false}
                      strokeDasharray="2 2"
                    />
                    <Line
                      type="monotone"
                      dataKey="t_i_5"
                      name="Probe 5"
                      stroke="#e4e4e7"
                      strokeWidth={1}
                      dot={false}
                      strokeDasharray="2 2"
                    />
                  </>
                )}
                {/* Ambient — dashed blue */}
                <Line
                  type="monotone"
                  dataKey="ambient_temp"
                  name="Ambient"
                  stroke="#2563eb"
                  strokeWidth={2}
                  strokeDasharray="6 3"
                  dot={false}
                />
                {/* Brood — bold amber */}
                <Line
                  type="monotone"
                  dataKey="brood_temp"
                  name="Brood Core"
                  stroke="#d97706"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{
                    r: 5,
                    fill: "#d97706",
                    stroke: "#fff",
                    strokeWidth: 2,
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Hive Weight & Foraging */}
        <div className="bg-white rounded-2xl border border-[#e8e3db] p-5 shadow-sm">
          <div className="mb-4">
            <h3 className="font-display font-semibold text-base text-[#1c1917]">
              ⚖️ Hive Weight &amp; Foraging
            </h3>
            <p className="text-[11px] text-[#78716c] mt-0.5">
              Diurnal nectar gain / sudden weight changes
            </p>
          </div>
          <div className="h-56 lg:h-64 -mx-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient
                    id="weightAreaGrad"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#7c3aed" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#f0ede8"
                  vertical={false}
                />
                <XAxis
                  dataKey="time"
                  tick={{ fontSize: 10, fill: "#a09890" }}
                  axisLine={false}
                  tickLine={false}
                  interval="preserveStartEnd"
                />
                <YAxis
                  domain={["dataMin - 0.5", "dataMax + 0.5"]}
                  tick={{ fontSize: 10, fill: "#a09890" }}
                  axisLine={false}
                  tickLine={false}
                  width={36}
                />
                <Tooltip content={<ChartTooltip />} />
                <Area
                  type="monotone"
                  dataKey="weight_kg"
                  name="Weight"
                  stroke="#7c3aed"
                  strokeWidth={2.5}
                  fill="url(#weightAreaGrad)"
                  dot={false}
                  activeDot={{
                    r: 5,
                    fill: "#7c3aed",
                    stroke: "#fff",
                    strokeWidth: 2,
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Environmental — Humidity & Pressure */}
        <div className="bg-white rounded-2xl border border-[#e8e3db] p-5 shadow-sm">
          <div className="mb-4">
            <h3 className="font-display font-semibold text-base text-[#1c1917]">
              🌤️ Environmental Trends
            </h3>
            <p className="text-[11px] text-[#78716c] mt-0.5">
              Humidity &amp; barometric pressure
            </p>
          </div>
          <div className="h-56 lg:h-64 -mx-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#f0ede8"
                  vertical={false}
                />
                <XAxis
                  dataKey="time"
                  tick={{ fontSize: 10, fill: "#a09890" }}
                  axisLine={false}
                  tickLine={false}
                  interval="preserveStartEnd"
                />
                <YAxis
                  yAxisId="left"
                  domain={["dataMin - 5", "dataMax + 5"]}
                  tick={{ fontSize: 10, fill: "#0891b2" }}
                  axisLine={false}
                  tickLine={false}
                  width={36}
                  label={{
                    value: "% RH",
                    angle: -90,
                    position: "insideLeft",
                    fontSize: 9,
                    fill: "#0891b2",
                  }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  domain={["dataMin - 2", "dataMax + 2"]}
                  tick={{ fontSize: 10, fill: "#a8a29e" }}
                  axisLine={false}
                  tickLine={false}
                  width={42}
                  label={{
                    value: "hPa",
                    angle: 90,
                    position: "insideRight",
                    fontSize: 9,
                    fill: "#a8a29e",
                  }}
                />
                <Tooltip content={<ChartTooltip />} />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="humidity"
                  name="Humidity"
                  stroke="#0891b2"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{
                    r: 4,
                    fill: "#0891b2",
                    stroke: "#fff",
                    strokeWidth: 2,
                  }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="pressure"
                  name="Pressure"
                  stroke="#a8a29e"
                  strokeWidth={1.5}
                  strokeDasharray="4 2"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ════════════════ SECTION 5: Hardware Card ════════════════ */}
      <div className="bg-white rounded-2xl border border-[#e8e3db] p-5 lg:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            {/* Hex icon */}
            <div className="w-12 h-12 rounded-xl bg-[#1c1917] flex items-center justify-center flex-shrink-0">
              <Cpu size={22} className="text-[#fbbf24]" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-base text-[#1c1917] mb-1">
                Hardware Integration Status
              </h3>
              <p className="text-xs text-[#57534e] leading-relaxed">
                <span className="font-semibold text-[#1c1917]">
                  Telemetry Source:
                </span>{" "}
                ESP32 IoT Node (Dual-core Xtensa LX6, Wi-Fi + BLE)
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#16a34a]/10 border border-[#16a34a]/20 flex-shrink-0">
            <Radio size={12} className="text-[#16a34a]" />
            <span className="text-[10px] font-bold text-[#16a34a] uppercase tracking-wider">
              Connected · Simulated
            </span>
          </div>
        </div>

        {/* Sensor grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5 pt-5 border-t border-[#f0ede8]">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-[#f7f5f0] border border-[#e8e3db]">
            <Thermometer size={16} className="text-[#d97706] flex-shrink-0" />
            <div>
              <div className="text-xs font-semibold text-[#1c1917]">
                DS18B20 Brood Probes
              </div>
              <div className="text-[10px] text-[#78716c]">
                Multi-point (3–5 probes) · ±0.5°C accuracy
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-[#f7f5f0] border border-[#e8e3db]">
            <Droplets size={16} className="text-[#0891b2] flex-shrink-0" />
            <div>
              <div className="text-xs font-semibold text-[#1c1917]">
                DHT22 Ambient Sensor
              </div>
              <div className="text-[10px] text-[#78716c]">
                Temperature + Humidity · 2s sampling
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-[#f7f5f0] border border-[#e8e3db]">
            <Weight size={16} className="text-[#7c3aed] flex-shrink-0" />
            <div>
              <div className="text-xs font-semibold text-[#1c1917]">
                HX711 Load-cell Scale
              </div>
              <div className="text-[10px] text-[#78716c]">
                50kg capacity · 0.01kg resolution
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
