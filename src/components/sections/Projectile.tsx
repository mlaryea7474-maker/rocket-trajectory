import { useMemo, useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ComposedChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine
} from 'recharts'
import './Projectile.css'

const V0 = 20
const G = 9.81
const ANGLES = [15, 30, 45, 60, 75]
const LINE_COLORS: Record<number, string> = {
  15: 'rgba(220,20,60,0.25)',
  30: 'rgba(220,20,60,0.45)',
  45: '#dc143c',
  60: 'rgba(220,20,60,0.45)',
  75: 'rgba(220,20,60,0.25)',
}

function yAtX(x: number, deg: number) {
  const th = (deg * Math.PI) / 180
  return x * Math.tan(th) - (G * x * x) / (2 * V0 * V0 * Math.cos(th) ** 2)
}

function rangeAtDeg(deg: number) {
  const th = (deg * Math.PI) / 180
  return (V0 * V0 * Math.sin(2 * th)) / G
}

function buildTrajectoryData() {
  const xMax = (V0 * V0) / G
  return Array.from({ length: 200 }, (_, i) => {
    const x = parseFloat(((i / 199) * xMax).toFixed(3))
    const pt: Record<string, number | null> = { x }
    ANGLES.forEach(deg => {
      if (x > rangeAtDeg(deg) + 0.01) {
        pt[`a${deg}`] = null
      } else {
        pt[`a${deg}`] = parseFloat(Math.max(0, yAtX(x, deg)).toFixed(3))
      }
    })
    return pt
  })
}

function buildRangeData() {
  return Array.from({ length: 91 }, (_, deg) => {
    const th = (deg * Math.PI) / 180
    return {
      angle: deg,
      range: parseFloat(((V0 * V0 * Math.sin(2 * th)) / G).toFixed(2))
    }
  })
}

function ChartTip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="chart-tip">
      <div className="tip-label">x = {label} m</div>
      {payload.map((p: any) => p.value !== null && (
        <div key={p.dataKey} className="tip-row">
          <span style={{ color: p.color }}>{p.dataKey.replace('a', 'θ=')}°</span>
          <span>{p.value} m</span>
        </div>
      ))}
    </div>
  )
}

const BEAT = "He started simple. He fired the projectile at 20 m/s and plotted the trajectory at every angle: 15°, 30°, 45°, 60°, and 75°, to see which one traveled furthest."

const CONCLUSION_TEXT = "He found 45° every time. Clean geometry, one equation, no computer needed. He had solved the simple model. Now for the actual rocket."

function useStream(text: string, trigger: boolean) {
  const [idx, setIdx] = useState(0)
  useEffect(() => {
    if (!trigger || idx >= text.length) return
    const t = setTimeout(() => setIdx(i => i + 1), 20)
    return () => clearTimeout(t)
  }, [trigger, idx, text.length])
  return { display: text.slice(0, idx), done: idx >= text.length }
}

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, delay },
})

export default function Projectile() {
  const trajectoryData = useMemo(buildTrajectoryData, [])
  const rangeData = useMemo(buildRangeData, [])

  const [beatIdx,          setBeatIdx]          = useState(0)
  const beatDone = beatIdx >= BEAT.length

  const [fig3Active,       setFig3Active]       = useState(false)
  const [fig4Active,       setFig4Active]       = useState(false)
  const [conclusionActive, setConclusionActive] = useState(false)

  const conclusion = useStream(CONCLUSION_TEXT, conclusionActive)

  /* beat stream */
  useEffect(() => {
    if (beatDone) return
    const t = setTimeout(() => setBeatIdx(i => i + 1), 22)
    return () => clearTimeout(t)
  }, [beatIdx, beatDone])

  /* beat done → fig 3 */
  useEffect(() => {
    if (!beatDone) return
    const t = setTimeout(() => setFig3Active(true), 400)
    return () => clearTimeout(t)
  }, [beatDone])

  /* fig3 active → fig 4 (after chart animates: 1400ms + buffer) */
  useEffect(() => {
    if (!fig3Active) return
    const t = setTimeout(() => setFig4Active(true), 1800)
    return () => clearTimeout(t)
  }, [fig3Active])

  /* fig4 active → conclusion (after chart animates: 1600ms + buffer) */
  useEffect(() => {
    if (!fig4Active) return
    const t = setTimeout(() => setConclusionActive(true), 2000)
    return () => clearTimeout(t)
  }, [fig4Active])

  return (
    <div className="proj-page">

      {/* Header */}
      <motion.div className="section-header" {...fadeUp(0)}>
        <div>
          <h2 className="section-h2">
            <span className="bracket">[</span>PROJECTILE MODEL<span className="bracket">]</span>
          </h2>
          <p className="section-sub">Figure Replication · Simple Model · v₀ = 20 m/s</p>
        </div>
        <span className="section-tag">MODEL::01 · ANALYTICAL</span>
      </motion.div>

      {/* Narrative beat */}
      <motion.div className="proj-beat" {...fadeUp(0.05)}>
        <p className="beat-line">
          {BEAT.slice(0, beatIdx)}
          <span className="stream-cursor" />
        </p>
      </motion.div>

      {/* Fig 3 — Trajectory fan */}
      <AnimatePresence>
        {fig3Active && (
          <motion.div
            key="fig3"
            className="chart-card"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <div className="chart-label">
              <span className="chart-tag">FIG. 3</span>
              <span className="chart-title">Trajectory fan: same speed, every angle</span>
            </div>
            <div className="chart-legend">
              {ANGLES.map(a => (
                <span key={a} className="legend-item" style={{ color: LINE_COLORS[a] }}>
                  {a === 45 ? <strong>45° ← winner</strong> : `${a}°`}
                </span>
              ))}
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <ComposedChart data={trajectoryData} margin={{ top: 8, right: 20, bottom: 20, left: 10 }}>
                <CartesianGrid stroke="rgba(220,20,60,0.07)" strokeDasharray="3 3" />
                <XAxis
                  dataKey="x"
                  type="number"
                  domain={[0, 41]}
                  tickCount={7}
                  stroke="rgba(255,255,255,0.15)"
                  tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10, fontFamily: 'JetBrains Mono' }}
                  tickFormatter={(v: number) => `${v.toFixed(0)}m`}
                  label={{ value: 'Range (m)', position: 'insideBottom', offset: -10, fill: 'rgba(255,255,255,0.25)', fontSize: 10, fontFamily: 'JetBrains Mono' }}
                />
                <YAxis
                  domain={[0, 22]}
                  tickCount={6}
                  stroke="rgba(255,255,255,0.15)"
                  tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10, fontFamily: 'JetBrains Mono' }}
                  tickFormatter={(v: number) => `${v}m`}
                  label={{ value: 'Height (m)', angle: -90, position: 'insideLeft', fill: 'rgba(255,255,255,0.25)', fontSize: 10, fontFamily: 'JetBrains Mono' }}
                />
                <Tooltip content={<ChartTip />} />
                {ANGLES.map(deg => (
                  <Line
                    key={deg}
                    type="monotone"
                    dataKey={`a${deg}`}
                    stroke={LINE_COLORS[deg]}
                    strokeWidth={deg === 45 ? 2.5 : 1.2}
                    dot={false}
                    connectNulls={false}
                    isAnimationActive
                    animationDuration={1400}
                    animationEasing="ease-out"
                  />
                ))}
              </ComposedChart>
            </ResponsiveContainer>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fig 4 — Range vs angle */}
      <AnimatePresence>
        {fig4Active && (
          <motion.div
            key="fig4"
            className="chart-card"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <div className="chart-label">
              <span className="chart-tag">FIG. 4</span>
              <span className="chart-title">Range at every angle: the peak is 45°</span>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <ComposedChart data={rangeData} margin={{ top: 8, right: 20, bottom: 20, left: 10 }}>
                <CartesianGrid stroke="rgba(220,20,60,0.07)" strokeDasharray="3 3" />
                <XAxis
                  dataKey="angle"
                  tickCount={10}
                  stroke="rgba(255,255,255,0.15)"
                  tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10, fontFamily: 'JetBrains Mono' }}
                  tickFormatter={(v: number) => `${v}°`}
                  label={{ value: 'Launch angle (°)', position: 'insideBottom', offset: -10, fill: 'rgba(255,255,255,0.25)', fontSize: 10, fontFamily: 'JetBrains Mono' }}
                />
                <YAxis
                  tickCount={6}
                  stroke="rgba(255,255,255,0.15)"
                  tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10, fontFamily: 'JetBrains Mono' }}
                  tickFormatter={(v: number) => `${v}m`}
                  label={{ value: 'Range (m)', angle: -90, position: 'insideLeft', fill: 'rgba(255,255,255,0.25)', fontSize: 10, fontFamily: 'JetBrains Mono' }}
                />
                <Tooltip
                  contentStyle={{ background: '#0a0a0e', border: '1px solid rgba(220,20,60,0.3)', fontFamily: 'JetBrains Mono', fontSize: 11 }}
                  labelStyle={{ color: 'rgba(255,255,255,0.4)' }}
                  itemStyle={{ color: '#dc143c' }}
                  formatter={(v: number) => [`${v} m`, 'range']}
                  labelFormatter={(l: number) => `θ = ${l}°`}
                />
                <ReferenceLine
                  x={45}
                  stroke="rgba(220,20,60,0.5)"
                  strokeDasharray="4 4"
                  label={{ value: '45°', fill: '#dc143c', fontSize: 11, fontFamily: 'JetBrains Mono' }}
                />
                <Line
                  type="monotone"
                  dataKey="range"
                  stroke="#dc143c"
                  strokeWidth={1.5}
                  dot={false}
                  isAnimationActive
                  animationDuration={1600}
                  animationEasing="ease-out"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Conclusion */}
      <AnimatePresence>
        {conclusionActive && (
          <motion.div
            key="conclusion"
            className="proj-conclusion card"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <span className="section-tag">RESULT</span>
            <p className="beat-line">
              {conclusion.display}
              {!conclusion.done && <span className="stream-cursor" />}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}
