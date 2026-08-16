import { useState, useMemo } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, ReferenceLine,
} from 'recharts'
import './Results.css'

// Saturn V parameters (Abba's)
const M0      = 2_900_000
const F       = 34_000_000
const MDOT    = 13_000
const G0      = 9.81
const R_EARTH = 6_371_000
const CD      = 0.5
const AREA    = 78.5
const RHO0    = 1.225
const H_SCALE = 8500
const T_MAX   = 150

type State = { h: number; v: number; m: number }

// Gravity (constant or altitude-varying)
function g(h: number, varyGravity: boolean) {
  return varyGravity ? G0 * (R_EARTH / (R_EARTH + h)) ** 2 : G0
}

// Right-hand side of the ODE system: y = [h, v, m]
function rhs(_t: number, y: State, varyGravity: boolean): State {
  const rho  = RHO0 * Math.exp(-y.h / H_SCALE)
  const drag = 0.5 * rho * CD * AREA * y.v * Math.abs(y.v)
  const acc  = (F - drag) / y.m - g(y.h, varyGravity)
  return { h: y.v, v: acc, m: -MDOT }
}

// Add helper
function add(y: State, k: State, s: number): State {
  return { h: y.h + s * k.h, v: y.v + s * k.v, m: y.m + s * k.m }
}

// Forward Euler step
function eulerStep(t: number, y: State, dt: number, varyGravity: boolean): State {
  const k = rhs(t, y, varyGravity)
  return add(y, k, dt)
}

// RK4 step
function rk4Step(t: number, y: State, dt: number, varyGravity: boolean): State {
  const k1 = rhs(t,          y,                      varyGravity)
  const k2 = rhs(t + dt/2,   add(y, k1, dt/2),       varyGravity)
  const k3 = rhs(t + dt/2,   add(y, k2, dt/2),       varyGravity)
  const k4 = rhs(t + dt,     add(y, k3, dt),         varyGravity)
  return {
    h: y.h + (dt/6) * (k1.h + 2*k2.h + 2*k3.h + k4.h),
    v: y.v + (dt/6) * (k1.v + 2*k2.v + 2*k3.v + k4.v),
    m: y.m + (dt/6) * (k1.m + 2*k2.m + 2*k3.m + k4.m),
  }
}

type Method = 'euler' | 'rk4'
function integrate(method: Method, dt: number, varyGravity: boolean) {
  let y: State = { h: 0, v: 0, m: M0 }
  let t = 0
  const step = method === 'euler' ? eulerStep : rk4Step
  const data: { t: number; h: number; v: number; a: number }[] = []
  const mFinal = M0 - MDOT * T_MAX
  while (t <= T_MAX + 1e-9) {
    const grav = g(y.h, varyGravity)
    const rho  = RHO0 * Math.exp(-y.h / H_SCALE)
    const drag = 0.5 * rho * CD * AREA * y.v * Math.abs(y.v)
    const acc  = (F - drag) / y.m - grav
    data.push({ t: parseFloat(t.toFixed(2)), h: y.h/1000, v: y.v, a: acc })
    const yn = step(t, y, dt, varyGravity)
    y = { ...yn, m: Math.max(yn.m, mFinal) }
    t = parseFloat((t + dt).toFixed(6))
  }
  return data
}

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, delay },
})

const BEAT = "We ran Abba's method and our method against each other. Same rocket, same three equations, same 150 seconds. The only difference is how we step through time and whether gravity changes with height. The charts below run both simulations right now in your browser, so you can drag the step size and watch what happens."

export default function Results() {
  const [dt, setDt]                   = useState(0.5)
  const [varyGravity, setVaryGravity] = useState(true)

  const euler = useMemo(() => integrate('euler', dt, varyGravity), [dt, varyGravity])
  const rk4   = useMemo(() => integrate('rk4',   dt, varyGravity), [dt, varyGravity])

  // Merge for side-by-side charts (index-aligned)
  const merged = useMemo(() => {
    const n = Math.min(euler.length, rk4.length)
    return Array.from({ length: n }, (_, i) => ({
      t: euler[i].t,
      h_eu: euler[i].h, h_rk: rk4[i].h,
      v_eu: euler[i].v, v_rk: rk4[i].v,
      a_eu: euler[i].a, a_rk: rk4[i].a,
      err_h: Math.abs(euler[i].h - rk4[i].h),
      err_v: Math.abs(euler[i].v - rk4[i].v),
    }))
  }, [euler, rk4])

  const finalEu = euler[euler.length - 1]
  const finalRk = rk4[rk4.length - 1]
  const diffH   = finalEu.h - finalRk.h
  const diffV   = finalEu.v - finalRk.v

  const axisProps = {
    stroke: 'rgba(255,255,255,0.1)',
    tick: { fill: 'rgba(255,255,255,0.3)', fontSize: 10, fontFamily: 'JetBrains Mono' },
  }

  return (
    <div className="res-page">

      {/* Header */}
      <motion.div className="section-header" {...fadeUp(0)}>
        <div>
          <h2 className="section-h2">
            <span className="bracket">[</span>OUR RESULTS<span className="bracket">]</span>
          </h2>
          <p className="section-sub">What happens when you run Abba's method and ours side by side</p>
        </div>
        <span className="section-tag">SIDE BY SIDE</span>
      </motion.div>

      {/* Narrative */}
      <motion.div className="res-beat" {...fadeUp(0.05)}>
        <p className="beat-line">{BEAT}</p>
      </motion.div>

      {/* Controls */}
      <motion.div className="res-controls" {...fadeUp(0.1)}>
        <div className="res-ctrl-block">
          <div className="ctrl-label">HOW BIG EACH TIME STEP IS</div>
          <div className="ctrl-slider-wrap">
            <input
              type="range" min={0.05} max={2.0} step={0.05} value={dt}
              onChange={e => setDt(parseFloat(e.target.value))}
              className="res-slider"
            />
            <span className="ctrl-value">{dt.toFixed(2)} s</span>
          </div>
          <div className="ctrl-hint">smaller steps means more work, but more accurate. drag it wider to see Euler fall apart.</div>
        </div>

        <div className="res-ctrl-block">
          <div className="ctrl-label">WHICH GRAVITY TO USE</div>
          <div className="ctrl-toggle-wrap">
            <button
              className={`ctrl-toggle ${!varyGravity ? 'active' : ''}`}
              onClick={() => setVaryGravity(false)}
            >
              ABBA'S CONSTANT 9.81
            </button>
            <button
              className={`ctrl-toggle ${varyGravity ? 'active' : ''}`}
              onClick={() => setVaryGravity(true)}
            >
              REAL GRAVITY THAT CHANGES WITH HEIGHT
            </button>
          </div>
          <div className="ctrl-hint">switch between Abba's fixed gravity and the real, height-dependent version</div>
        </div>
      </motion.div>

      {/* Live summary strip */}
      <motion.div className="res-summary" {...fadeUp(0.15)}>
        <div className="sum-block">
          <div className="data-label">Steps taken to finish the flight</div>
          <div className="data-value">{euler.length}</div>
        </div>
        <div className="sum-block">
          <div className="data-label">How high Abba's method said it got</div>
          <div className="data-value">{finalEu.h.toFixed(1)} km</div>
        </div>
        <div className="sum-block">
          <div className="data-label">How high RK4 said it got</div>
          <div className="data-value" style={{ color: 'var(--red)' }}>{finalRk.h.toFixed(1)} km</div>
        </div>
        <div className="sum-block">
          <div className="data-label">Height gap between the two answers</div>
          <div className="data-value" style={{ color: Math.abs(diffH) > 0.5 ? 'var(--red)' : 'rgba(255,255,255,0.5)' }}>
            {diffH >= 0 ? '+' : ''}{diffH.toFixed(2)} km
          </div>
        </div>
        <div className="sum-block">
          <div className="data-label">Speed gap at burnout</div>
          <div className="data-value" style={{ color: Math.abs(diffV) > 5 ? 'var(--red)' : 'rgba(255,255,255,0.5)' }}>
            {diffV >= 0 ? '+' : ''}{diffV.toFixed(1)} m/s
          </div>
        </div>
      </motion.div>

      {/* Altitude chart */}
      <AnimatePresence>
        <motion.div key="alt" className="chart-card" {...fadeUp(0.2)}>
          <div className="chart-label">
            <span className="chart-tag">HEIGHT OVER TIME</span>
            <span className="chart-title">Widen the step size and watch the dashed Euler line drift away from RK4</span>
          </div>
          <ResponsiveContainer width="100%" height={230}>
            <LineChart data={merged} margin={{ top: 8, right: 20, bottom: 22, left: 12 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" />
              <XAxis dataKey="t" {...axisProps}
                label={{ value: 'Time (s)', position: 'insideBottom', offset: -10, fill: 'rgba(255,255,255,0.25)', fontSize: 10, fontFamily: 'JetBrains Mono' }} />
              <YAxis {...axisProps}
                label={{ value: 'km', angle: -90, position: 'insideLeft', fill: 'rgba(255,255,255,0.25)', fontSize: 10, fontFamily: 'JetBrains Mono' }} />
              <Tooltip
                contentStyle={{ background: '#0a0a0e', border: '1px solid rgba(220,20,60,0.3)', fontFamily: 'JetBrains Mono', fontSize: 11 }}
                labelStyle={{ color: 'rgba(255,255,255,0.4)' }}
                formatter={(v: any, name: any) => [`${(+v).toFixed(2)} km`, name === 'h_eu' ? 'Euler' : 'RK4']}
                labelFormatter={(l) => `t = ${l} s`}
              />
              <Legend wrapperStyle={{ fontFamily: 'JetBrains Mono', fontSize: 10 }} />
              <Line type="monotone" dataKey="h_eu" name="Euler" stroke="rgba(255,255,255,0.5)" strokeWidth={1.5} dot={false} isAnimationActive={false} strokeDasharray="4 3" />
              <Line type="monotone" dataKey="h_rk" name="RK4"   stroke="#dc143c" strokeWidth={2} dot={false} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </AnimatePresence>

      {/* Velocity chart */}
      <AnimatePresence>
        <motion.div key="vel" className="chart-card" {...fadeUp(0.25)}>
          <div className="chart-label">
            <span className="chart-tag">SPEED OVER TIME</span>
            <span className="chart-title">Small errors at every step pile up — the longer the flight, the wider the gap</span>
          </div>
          <ResponsiveContainer width="100%" height={230}>
            <LineChart data={merged} margin={{ top: 8, right: 20, bottom: 22, left: 12 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" />
              <XAxis dataKey="t" {...axisProps} label={{ value: 'Time (s)', position: 'insideBottom', offset: -10, fill: 'rgba(255,255,255,0.25)', fontSize: 10, fontFamily: 'JetBrains Mono' }} />
              <YAxis {...axisProps} label={{ value: 'm/s', angle: -90, position: 'insideLeft', fill: 'rgba(255,255,255,0.25)', fontSize: 10, fontFamily: 'JetBrains Mono' }} />
              <Tooltip
                contentStyle={{ background: '#0a0a0e', border: '1px solid rgba(220,20,60,0.3)', fontFamily: 'JetBrains Mono', fontSize: 11 }}
                labelStyle={{ color: 'rgba(255,255,255,0.4)' }}
                formatter={(v: any, name: any) => [`${(+v).toFixed(1)} m/s`, name === 'v_eu' ? 'Euler' : 'RK4']}
                labelFormatter={(l) => `t = ${l} s`}
              />
              <Legend wrapperStyle={{ fontFamily: 'JetBrains Mono', fontSize: 10 }} />
              <Line type="monotone" dataKey="v_eu" name="Euler" stroke="rgba(255,255,255,0.5)" strokeWidth={1.5} dot={false} isAnimationActive={false} strokeDasharray="4 3" />
              <Line type="monotone" dataKey="v_rk" name="RK4"   stroke="#dc143c" strokeWidth={2} dot={false} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </AnimatePresence>

      {/* Error chart */}
      <AnimatePresence>
        <motion.div key="err" className="chart-card" {...fadeUp(0.3)}>
          <div className="chart-label">
            <span className="chart-tag">HOW FAR APART THE TWO ANSWERS ARE</span>
            <span className="chart-title">The gap between Abba's answer and ours, plotted over time</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={merged} margin={{ top: 8, right: 20, bottom: 22, left: 12 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" />
              <XAxis dataKey="t" {...axisProps} label={{ value: 'Time (s)', position: 'insideBottom', offset: -10, fill: 'rgba(255,255,255,0.25)', fontSize: 10, fontFamily: 'JetBrains Mono' }} />
              <YAxis {...axisProps} yAxisId="left" label={{ value: '|Δh| km', angle: -90, position: 'insideLeft', fill: 'rgba(255,255,255,0.25)', fontSize: 10, fontFamily: 'JetBrains Mono' }} />
              <YAxis {...axisProps} yAxisId="right" orientation="right" label={{ value: '|Δv| m/s', angle: 90, position: 'insideRight', fill: 'rgba(255,255,255,0.25)', fontSize: 10, fontFamily: 'JetBrains Mono' }} />
              <Tooltip
                contentStyle={{ background: '#0a0a0e', border: '1px solid rgba(220,20,60,0.3)', fontFamily: 'JetBrains Mono', fontSize: 11 }}
                labelStyle={{ color: 'rgba(255,255,255,0.4)' }}
              />
              <Legend wrapperStyle={{ fontFamily: 'JetBrains Mono', fontSize: 10 }} />
              <ReferenceLine yAxisId="left" y={0} stroke="rgba(255,255,255,0.1)" />
              <Line yAxisId="left"  type="monotone" dataKey="err_h" name="|Δh| km"   stroke="#dc143c" strokeWidth={1.8} dot={false} isAnimationActive={false} />
              <Line yAxisId="right" type="monotone" dataKey="err_v" name="|Δv| m/s"  stroke="rgba(255,255,255,0.55)" strokeWidth={1.5} dot={false} isAnimationActive={false} strokeDasharray="3 3" />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </AnimatePresence>

      {/* Interpretation */}
      <motion.div className="res-interp card" {...fadeUp(0.35)}>
        <span className="section-tag">WHAT THE CHARTS ARE SAYING</span>
        <div className="interp-body">
          <p>
            <span className="interp-tag">Small steps (0.05 seconds):</span>
            both methods almost agree. The two lines sit right on top of each other. When the step is
            this fine, even the simple Euler method has almost no room to go wrong.
          </p>
          <p>
            <span className="interp-tag">Medium steps (0.5 seconds):</span>
            Abba's Euler line starts to visibly pull away from the RK4 line by the end of the flight.
            The simulation still runs, but the numbers it produces are noticeably off. This is roughly
            where a fast, cheap simulation lives.
          </p>
          <p>
            <span className="interp-tag">Big steps (2 seconds):</span>
            Euler falls apart. It might over-shoot, wobble, or diverge completely. RK4 stays calm at
            the same step size because it looks four times per step instead of once. This is the whole
            point of using a better method — it keeps working when the simple one gives up.
          </p>
          <p>
            <span className="interp-tag">Switching gravity:</span>
            when you turn on real height-dependent gravity, the final speed drops by a few metres per
            second. Small, but it matters. It means the rocket does not have to fight as hard against
            gravity near the top of its climb — which is what actually happens in real flight.
          </p>
        </div>
      </motion.div>

    </div>
  )
}
