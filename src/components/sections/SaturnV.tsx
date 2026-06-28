import { useMemo, useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts'
import './SaturnV.css'

const M0      = 2_900_000
const F       = 34_000_000
const MDOT    = 13_000
const G       = 9.81
const CD      = 0.5
const AREA    = 78.5
const RHO0    = 1.225
const H_SCALE = 8500
const DT      = 0.1
const T_MAX   = 150

function buildSaturnData() {
  let h = 0, v = 0, m = M0
  const data: { t: number; h: number; v: number; a: number }[] = []

  for (let t = 0; t <= T_MAX; t = parseFloat((t + DT).toFixed(1))) {
    const rho  = RHO0 * Math.exp(-h / H_SCALE)
    const drag = 0.5 * rho * CD * AREA * v * Math.abs(v)
    const acc  = (F - drag) / m - G

    data.push({
      t,
      h: parseFloat((h / 1000).toFixed(2)),
      v: parseFloat(v.toFixed(1)),
      a: parseFloat(acc.toFixed(2)),
    })

    h += v * DT
    v += acc * DT
    m  = Math.max(m - MDOT * DT, M0 - MDOT * T_MAX)
    if (h < 0) break
  }

  return data
}

const BEAT = "He then modeled the real rocket. The Saturn V: 2.9 million kilograms, 34 million Newtons of thrust, burning 13,000 kg of propellant every second. He stepped through 150 seconds of flight and measured three things."

const CONCLUSION_TEXT = "He got three curves. Unlike the projectile, nothing here was predictable in advance. The mass was shrinking, the drag was shifting, every step changed the next. This is what numerical methods produce when the math has no clean answer. Next: how he built it."

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

function ChartTip({ active, payload, label, unit }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="chart-tip">
      <div className="tip-label">t = {label} s</div>
      <div className="tip-row">
        <span style={{ color: '#dc143c' }}>{payload[0]?.name}</span>
        <span>{payload[0]?.value} {unit}</span>
      </div>
    </div>
  )
}

export default function SaturnV() {
  const data = useMemo(buildSaturnData, [])

  const [beatIdx,          setBeatIdx]          = useState(0)
  const beatDone = beatIdx >= BEAT.length

  const [altActive,        setAltActive]        = useState(false)
  const [velActive,        setVelActive]        = useState(false)
  const [accActive,        setAccActive]        = useState(false)
  const [conclusionActive, setConclusionActive] = useState(false)

  const conclusion = useStream(CONCLUSION_TEXT, conclusionActive)

  const axisProps = {
    stroke: 'rgba(255,255,255,0.15)',
    tick: { fill: 'rgba(255,255,255,0.3)', fontSize: 10, fontFamily: 'JetBrains Mono' },
  }

  /* beat stream */
  useEffect(() => {
    if (beatDone) return
    const t = setTimeout(() => setBeatIdx(i => i + 1), 22)
    return () => clearTimeout(t)
  }, [beatIdx, beatDone])

  /* beat done → altitude chart */
  useEffect(() => {
    if (!beatDone) return
    const t = setTimeout(() => setAltActive(true), 400)
    return () => clearTimeout(t)
  }, [beatDone])

  /* altitude active → velocity chart (after 1600ms animation + buffer) */
  useEffect(() => {
    if (!altActive) return
    const t = setTimeout(() => setVelActive(true), 2000)
    return () => clearTimeout(t)
  }, [altActive])

  /* velocity active → acceleration chart */
  useEffect(() => {
    if (!velActive) return
    const t = setTimeout(() => setAccActive(true), 2200)
    return () => clearTimeout(t)
  }, [velActive])

  /* acceleration active → conclusion */
  useEffect(() => {
    if (!accActive) return
    const t = setTimeout(() => setConclusionActive(true), 2400)
    return () => clearTimeout(t)
  }, [accActive])

  return (
    <div className="sv-page">

      {/* Header */}
      <motion.div className="section-header" {...fadeUp(0)}>
        <div>
          <h2 className="section-h2">
            <span className="bracket">[</span>SATURN V SIMULATION<span className="bracket">]</span>
          </h2>
          <p className="section-sub">Figure Replication · ODE Model · Euler Method · Δt = 0.1 s</p>
        </div>
        <span className="section-tag">MODEL::02 · NUMERICAL</span>
      </motion.div>

      {/* Narrative beat */}
      <motion.div className="sv-beat" {...fadeUp(0.05)}>
        <p className="beat-line">
          {BEAT.slice(0, beatIdx)}
          <span className="stream-cursor" />
        </p>
      </motion.div>

      {/* Chart 1 — Altitude */}
      <AnimatePresence>
        {altActive && (
          <motion.div
            key="alt"
            className="chart-card"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <div className="chart-label">
              <span className="chart-tag">ALTITUDE</span>
              <span className="chart-title">How high it went: climbs to ~58 km in 150 seconds</span>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={data} margin={{ top: 8, right: 20, bottom: 20, left: 10 }}>
                <CartesianGrid stroke="rgba(220,20,60,0.07)" strokeDasharray="3 3" />
                <XAxis dataKey="t" {...axisProps}
                  label={{ value: 'Time (s)', position: 'insideBottom', offset: -10, fill: 'rgba(255,255,255,0.25)', fontSize: 10, fontFamily: 'JetBrains Mono' }}
                />
                <YAxis {...axisProps}
                  label={{ value: 'h (km)', angle: -90, position: 'insideLeft', fill: 'rgba(255,255,255,0.25)', fontSize: 10, fontFamily: 'JetBrains Mono' }}
                />
                <Tooltip content={(p) => <ChartTip {...p} unit="km" />} />
                <Line type="monotone" dataKey="h" name="altitude" stroke="#dc143c" strokeWidth={2} dot={false}
                  isAnimationActive animationDuration={1600} animationEasing="ease-out" />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chart 2 — Velocity */}
      <AnimatePresence>
        {velActive && (
          <motion.div
            key="vel"
            className="chart-card"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <div className="chart-label">
              <span className="chart-tag">VELOCITY</span>
              <span className="chart-title">How fast it moved: accelerates as mass burns off</span>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={data} margin={{ top: 8, right: 20, bottom: 20, left: 10 }}>
                <CartesianGrid stroke="rgba(220,20,60,0.07)" strokeDasharray="3 3" />
                <XAxis dataKey="t" {...axisProps}
                  label={{ value: 'Time (s)', position: 'insideBottom', offset: -10, fill: 'rgba(255,255,255,0.25)', fontSize: 10, fontFamily: 'JetBrains Mono' }}
                />
                <YAxis {...axisProps}
                  label={{ value: 'v (m/s)', angle: -90, position: 'insideLeft', fill: 'rgba(255,255,255,0.25)', fontSize: 10, fontFamily: 'JetBrains Mono' }}
                />
                <Tooltip content={(p) => <ChartTip {...p} unit="m/s" />} />
                <Line type="monotone" dataKey="v" name="velocity" stroke="#e53935" strokeWidth={2} dot={false}
                  isAnimationActive animationDuration={1800} animationEasing="ease-out" />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chart 3 — Acceleration */}
      <AnimatePresence>
        {accActive && (
          <motion.div
            key="acc"
            className="chart-card"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <div className="chart-label">
              <span className="chart-tag">ACCELERATION</span>
              <span className="chart-title">How hard it pushed: spikes as the rocket gets lighter</span>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={data} margin={{ top: 8, right: 20, bottom: 20, left: 10 }}>
                <CartesianGrid stroke="rgba(220,20,60,0.07)" strokeDasharray="3 3" />
                <XAxis dataKey="t" {...axisProps}
                  label={{ value: 'Time (s)', position: 'insideBottom', offset: -10, fill: 'rgba(255,255,255,0.25)', fontSize: 10, fontFamily: 'JetBrains Mono' }}
                />
                <YAxis {...axisProps}
                  label={{ value: 'a (m/s²)', angle: -90, position: 'insideLeft', fill: 'rgba(255,255,255,0.25)', fontSize: 10, fontFamily: 'JetBrains Mono' }}
                />
                <Tooltip content={(p) => <ChartTip {...p} unit="m/s²" />} />
                <Line type="monotone" dataKey="a" name="acceleration" stroke="#ff6b6b" strokeWidth={2} dot={false}
                  isAnimationActive animationDuration={2000} animationEasing="ease-out" />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Conclusion */}
      <AnimatePresence>
        {conclusionActive && (
          <motion.div
            key="conclusion"
            className="sv-conclusion card"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <span className="section-tag">OBSERVATION</span>
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
