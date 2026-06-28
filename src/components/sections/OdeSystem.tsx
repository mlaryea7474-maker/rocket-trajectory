import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import './OdeSystem.css'

const BEAT = "Before he could solve anything, Abba had to describe exactly what was happening to the rocket at every moment in flight. He wrote down three coupled differential equations: one tracking altitude, one tracking velocity, and one tracking mass. Everything that follows in this paper flows from these three lines."

const BRIDGE_TEXT = "When drag and thrust are removed and mass is held constant, this system collapses into two simple equations with a closed-form solution. That is the projectile model, and 45° is its answer. When all three equations are kept in full with the Saturn V's parameters, the system cannot be solved analytically. It has to be stepped through numerically, one small increment of time at a time. Both paths start from the same three lines above."

const EQUATIONS = [
  {
    index: '01',
    lhs: 'dh/dt',
    rhs: '= v(t)',
    meaning: 'Altitude increases at the rate of the rocket\'s current velocity. The faster it moves upward, the faster it climbs.',
  },
  {
    index: '02',
    lhs: 'dv/dt',
    rhs: '= F(t)/M(t) − g − D(v,h)/M(t)',
    meaning: 'Velocity changes based on three competing forces: thrust pushing upward, gravity pulling down, and drag resisting motion. All three are divided by the current mass, which is shrinking every second.',
  },
  {
    index: '03',
    lhs: 'dm/dt',
    rhs: '= −ṁ',
    meaning: 'Mass decreases at a constant rate as propellant is consumed. At 13,000 kg per second, the Saturn V loses nearly half its mass in two and a half minutes.',
  },
]

const VARIABLES = [
  { sym: 'h(t)',    def: 'altitude above ground',       unit: 'metres' },
  { sym: 'v(t)',    def: 'vertical velocity',            unit: 'm / s' },
  { sym: 'M(t)',    def: 'total vehicle mass',           unit: 'kg' },
  { sym: 'F(t)',    def: 'engine thrust force',          unit: 'Newtons' },
  { sym: 'D(v,h)', def: 'atmospheric drag',             unit: '½ρCdAv²' },
  { sym: 'g',       def: 'gravitational acceleration',   unit: '9.81 m/s²' },
  { sym: 'ṁ',       def: 'propellant mass flow rate',   unit: '13,000 kg/s' },
]

function useStream(text: string, trigger: boolean) {
  const [idx, setIdx] = useState(0)
  useEffect(() => {
    if (!trigger || idx >= text.length) return
    const t = setTimeout(() => setIdx(i => i + 1), 18)
    return () => clearTimeout(t)
  }, [trigger, idx, text.length])
  return { display: text.slice(0, idx), done: idx >= text.length }
}

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, delay },
})

export default function OdeSystem() {
  const [beatIdx, setBeatIdx] = useState(0)
  const beatDone = beatIdx >= BEAT.length

  const [equationsActive, setEquationsActive] = useState(false)
  const [varsActive,      setVarsActive]      = useState(false)
  const [bridgeActive,    setBridgeActive]    = useState(false)

  const bridge = useStream(BRIDGE_TEXT, bridgeActive)

  /* beat stream */
  useEffect(() => {
    if (beatDone) return
    const t = setTimeout(() => setBeatIdx(i => i + 1), 16)
    return () => clearTimeout(t)
  }, [beatIdx, beatDone])

  /* beat done → equations */
  useEffect(() => {
    if (!beatDone) return
    const t = setTimeout(() => setEquationsActive(true), 400)
    return () => clearTimeout(t)
  }, [beatDone])

  /* equations active → variables (3 rows × 150ms stagger + buffer) */
  useEffect(() => {
    if (!equationsActive) return
    const t = setTimeout(() => setVarsActive(true), 900)
    return () => clearTimeout(t)
  }, [equationsActive])

  /* vars active → bridge (7 cards × 70ms stagger + buffer) */
  useEffect(() => {
    if (!varsActive) return
    const t = setTimeout(() => setBridgeActive(true), 900)
    return () => clearTimeout(t)
  }, [varsActive])

  return (
    <div className="ode-page">

      {/* Header */}
      <motion.div className="section-header" {...fadeUp(0)}>
        <div>
          <h2 className="section-h2">
            <span className="bracket">[</span>THE ODE SYSTEM<span className="bracket">]</span>
          </h2>
          <p className="section-sub">The three equations that govern the rocket's flight</p>
        </div>
        <span className="section-tag">COUPLED::ODES · THREE VARIABLES</span>
      </motion.div>

      {/* Narrative beat */}
      <motion.div className="ode-beat" {...fadeUp(0.05)}>
        <p className="beat-line">
          {BEAT.slice(0, beatIdx)}
          <span className="stream-cursor" />
        </p>
      </motion.div>

      {/* The three equations */}
      <AnimatePresence>
        {equationsActive && (
          <motion.div
            key="equations"
            className="ode-equations"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <div className="ode-eq-header">
              <span className="chart-tag">THE SYSTEM</span>
              <span className="ode-eq-sub">three coupled equations, all changing simultaneously</span>
            </div>
            {EQUATIONS.map((eq, i) => (
              <motion.div
                key={eq.index}
                className="ode-eq-row"
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.15 }}
              >
                <span className="ode-eq-index">{eq.index}</span>
                <div className="ode-eq-math">
                  <span className="ode-lhs">{eq.lhs}</span>
                  <span className="ode-rhs">{eq.rhs}</span>
                </div>
                <p className="ode-eq-meaning">{eq.meaning}</p>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Variable definitions */}
      <AnimatePresence>
        {varsActive && (
          <motion.div
            key="vars"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <div style={{ marginBottom: '0.75rem' }}>
              <span className="section-tag">VARIABLES DEFINED</span>
            </div>
            <div className="ode-vars-grid">
              {VARIABLES.map((v, i) => (
                <motion.div
                  key={v.sym}
                  className="ode-var-card card"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                >
                  <div className="ode-var-sym">{v.sym}</div>
                  <div className="ode-var-def">{v.def}</div>
                  <div className="ode-var-unit">{v.unit}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bridge card */}
      <AnimatePresence>
        {bridgeActive && (
          <motion.div
            key="bridge"
            className="ode-bridge card"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <span className="section-tag">TWO PATHS</span>
            <p className="ode-bridge-text" style={{ marginTop: '0.75rem' }}>
              {bridge.display}
              {!bridge.done && <span className="stream-cursor" />}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}
