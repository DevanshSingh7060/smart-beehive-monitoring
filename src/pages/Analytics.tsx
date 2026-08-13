import { useState } from 'react'
import { AreaChart, Area, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import { temperatureHistory, humidityHistory, weeklyTemperature, weeklyWeight, buzzingHistory, vibrationHistory, activityHistory } from '../data/mockData'

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#1c1917] text-white px-3 py-2 rounded-lg text-xs shadow-xl">
      <div className="text-white/50 mb-1">{label}</div>
      {payload.map((p: any, i: number) => (
        <div key={i} className="font-mono-data font-medium" style={{ color: p.color ?? 'white' }}>
          {p.name}: {typeof p.value === 'number' ? p.value.toFixed(2) : p.value}
        </div>
      ))}
    </div>
  )
}

function ChartSection({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-[#e8e3db] p-5">
      <div className="mb-4">
        <h3 className="font-display font-semibold text-[#1c1917] text-base">{title}</h3>
        {subtitle && <p className="text-[#78716c] text-xs mt-0.5">{subtitle}</p>}
      </div>
      {children}
    </div>
  )
}

export default function Analytics() {
  const [hive, setHive] = useState('A01')
  const [period, setPeriod] = useState('7D')

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-[1600px]">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-[#1c1917]">Analytics</h1>
          <p className="text-[#78716c] text-sm mt-1">Understand long-term hive health, behavior, and productivity.</p>
        </div>
        <div className="flex items-center gap-2">
          <select value={hive} onChange={e => setHive(e.target.value)}
            className="px-3 py-2 rounded-xl border border-[#e8e3db] bg-white text-sm text-[#1c1917] outline-none focus:border-[#d97706]">
            <option value="A01">Hive A-01</option>
            <option value="A02">Hive A-02</option>
            <option value="B01">Hive B-01</option>
            <option value="B02">Hive B-02</option>
          </select>
          <div className="flex bg-[#f7f5f0] rounded-xl p-0.5 border border-[#e8e3db]">
            {['24H', '7D', '30D', '90D'].map(r => (
              <button key={r} onClick={() => setPeriod(r)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${period === r ? 'bg-white text-[#1c1917] shadow-sm' : 'text-[#78716c]'}`}>
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Temperature */}
      <ChartSection title="Temperature Over Time" subtitle="Compared against optimal range (32–36°C)">
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={weeklyTemperature.slice(0, period === '24H' ? 13 : period === '7D' ? 7 : 28)}>
            <defs>
              <linearGradient id="tGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#d97706" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#d97706" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0ede8" />
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#a09890' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: '#a09890' }} axisLine={false} tickLine={false} width={36} domain={[28, 38]} />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={32} stroke="#16a34a" strokeDasharray="4 2" strokeOpacity={0.5} label={{ value: 'Min', fill: '#16a34a', fontSize: 9 }} />
            <ReferenceLine y={36} stroke="#d97706" strokeDasharray="4 2" strokeOpacity={0.5} label={{ value: 'Max', fill: '#d97706', fontSize: 9 }} />
            <Area type="monotone" dataKey="avg" stroke="#d97706" strokeWidth={2} fill="url(#tGrad)" dot={false} name="Avg" />
            <Line type="monotone" dataKey="min" stroke="#2563eb" strokeWidth={1} dot={false} strokeDasharray="3 2" name="Min" />
            <Line type="monotone" dataKey="max" stroke="#dc2626" strokeWidth={1} dot={false} strokeDasharray="3 2" name="Max" />
          </AreaChart>
        </ResponsiveContainer>
        <div className="flex gap-4 mt-2 text-[11px]">
          {[{ label: 'Average', color: '#d97706' }, { label: 'Min', color: '#2563eb' }, { label: 'Max', color: '#dc2626' }].map(l => (
            <div key={l.label} className="flex items-center gap-1.5">
              <div className="w-3 h-0.5 rounded" style={{ backgroundColor: l.color }} />
              <span className="text-[#78716c]">{l.label}</span>
            </div>
          ))}
        </div>
      </ChartSection>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Humidity */}
        <ChartSection title="Humidity Over Time" subtitle="Optimal range: 50–75%">
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={humidityHistory}>
              <defs>
                <linearGradient id="hGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.12} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0ede8" />
              <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#a09890' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#a09890' }} axisLine={false} tickLine={false} width={28} domain={[50, 80]} />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={75} stroke="#d97706" strokeDasharray="3 2" strokeOpacity={0.5} />
              <ReferenceLine y={50} stroke="#2563eb" strokeDasharray="3 2" strokeOpacity={0.4} />
              <Area type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={2} fill="url(#hGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartSection>

        {/* Weight Trend */}
        <ChartSection title="Hive Weight Trend" subtitle="Estimated honey production based on weight gain">
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={weeklyWeight}>
              <defs>
                <linearGradient id="wwGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.12} />
                  <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0ede8" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#a09890' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#a09890' }} axisLine={false} tickLine={false} width={36} domain={[38, 46]} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="value" stroke="#7c3aed" strokeWidth={2} fill="url(#wwGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
          <div className="mt-2 p-2 bg-[#f7f5f0] rounded-lg text-[11px] text-[#78716c] italic">
            ℹ Honey production estimate is based on weight trends and is not a direct measurement.
          </div>
        </ChartSection>

        {/* Buzzing */}
        <ChartSection title="Bee Buzzing Activity" subtitle="Audio intensity in decibels">
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={buzzingHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0ede8" />
              <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#a09890' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#a09890' }} axisLine={false} tickLine={false} width={28} domain={[20, 90]} />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={80} stroke="#dc2626" strokeDasharray="3 2" strokeOpacity={0.6} label={{ value: 'Abnormal', fill: '#dc2626', fontSize: 9 }} />
              <Bar dataKey="value" fill="#0891b2" radius={[3, 3, 0, 0]} opacity={0.8} name="dB" />
            </BarChart>
          </ResponsiveContainer>
        </ChartSection>

        {/* Bee Activity Score */}
        <ChartSection title="Bee Activity Score" subtitle="Daily activity pattern — 0 (low) to 100 (high)">
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={activityHistory}>
              <defs>
                <linearGradient id="aGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#16a34a" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0ede8" />
              <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#a09890' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#a09890' }} axisLine={false} tickLine={false} width={28} domain={[0, 100]} />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={80} stroke="#d97706" strokeDasharray="3 2" strokeOpacity={0.5} label={{ value: 'High', fill: '#d97706', fontSize: 9 }} />
              <Area type="monotone" dataKey="value" stroke="#16a34a" strokeWidth={2} fill="url(#aGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartSection>
      </div>

      {/* Correlations */}
      <div className="bg-white rounded-2xl border border-[#e8e3db] p-5">
        <h3 className="font-display font-semibold text-[#1c1917] text-base mb-1">Sensor Correlations</h3>
        <p className="text-[#78716c] text-xs mb-4">Detected relationships between environmental and behavioral metrics.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
          {[
            { a: 'Temperature', b: 'Buzzing', strength: 'Strong positive', pct: 82, color: '#d97706' },
            { a: 'Humidity', b: 'Bee Activity', strength: 'Moderate negative', pct: 58, color: '#2563eb' },
            { a: 'Weight', b: 'Bee Activity', strength: 'Moderate positive', pct: 64, color: '#7c3aed' },
            { a: 'Buzzing', b: 'Swarming Risk', strength: 'Strong positive', pct: 91, color: '#dc2626' },
          ].map(c => (
            <div key={c.a} className="p-3 rounded-xl bg-[#f7f5f0] border border-[#e8e3db]">
              <div className="text-xs font-medium text-[#1c1917] mb-1">{c.a} ↔ {c.b}</div>
              <div className="h-1.5 bg-[#e8e3db] rounded-full overflow-hidden mb-1.5">
                <div className="h-full rounded-full" style={{ width: `${c.pct}%`, backgroundColor: c.color }} />
              </div>
              <div className="flex justify-between text-[10px]">
                <span className="text-[#78716c]">{c.strength}</span>
                <span className="font-mono-data font-medium" style={{ color: c.color }}>{c.pct}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
