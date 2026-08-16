import { AnimatePresence, motion } from 'framer-motion'
import { useTypewriter } from '../../hooks/useTypewriter'
import './Modifications.css'

const BEAT = "Abba's model works. He set up the three equations, stepped through 150 seconds, and got three curves. But he made two shortcuts along the way. He used the simplest possible way to step through time. And he treated gravity as if it was the same everywhere, from the launchpad all the way up to 58 km. We wanted to see what would change if we fixed both."

const RK4_INTRO = "Euler works by looking once at how the rocket is changing right now, then taking a step in that direction. RK4 is a bit smarter. It looks four times in each step: once at the start, twice in the middle, and once at the end. Then it takes an average that weights the middle looks more heavily than the ends. Same equations, same rocket, but the answer stays much closer to the truth. The error shrinks by a factor of about ten thousand at our step size."

const GRAVITY_INTRO = "Gravity is not really 9.81 everywhere. It weakens the further you are from the centre of the Earth. Abba's rocket climbs to about 58 km before burnout, and at that height gravity is nearly two percent weaker than it was at the pad. Not a huge change, but it is a real one, and it shows up in every acceleration calculation Abba made. We replaced his fixed 9.81 with the actual physical law: gravity falls off as the inverse square of the distance from the centre of the Earth."

const RK4_STEPS = [
  { label: 'k₁',  code: 'f(t, y)',                    note: 'the first look, at the very start of the step' },
  { label: 'k₂',  code: 'f(t + Δt/2, y + Δt·k₁/2)',    note: 'a look at the middle, using k₁ to guess where we are' },
  { label: 'k₃',  code: 'f(t + Δt/2, y + Δt·k₂/2)',    note: 'another look at the middle, this time using k₂' },
  { label: 'k₄',  code: 'f(t + Δt,   y + Δt·k₃)',      note: 'the fourth look, at the very end of the step' },
  { label: 'y[n+1]', code: 'y[n] + Δt/6·(k₁ + 2k₂ + 2k₃ + k₄)', note: 'average them, weighting the middle looks twice as much' },
]

const MODS = [
  {
    tag:  'CHANGE 01',
    title: 'A better way to step through time',
    what:  "Abba used Euler's method, which looks at how the rocket is changing once per step and takes off in that direction. We used RK4, which looks four times per step and averages the answers. Everything else is identical.",
    why:   "Because the rocket's mass, speed, and drag are all changing at once, a single look at the start of the step can miss what happens later in the step. Four looks catch that. Over 1,500 steps those small misses add up, and RK4 keeps the answer honest.",
    equation: 'y[n+1] = y[n] + (Δt/6)·(k₁ + 2k₂ + 2k₃ + k₄)',
  },
  {
    tag:  'CHANGE 02',
    title: 'Gravity that actually changes with height',
    what:  "Abba held gravity fixed at 9.81 m/s² for the whole flight. We used the real physical law: gravity gets weaker the higher the rocket climbs, following an inverse square.",
    why:   "Every step of the simulation asks the same question: thrust minus drag minus gravity, divided by mass. If the gravity number is slightly wrong, so is the acceleration, so is the velocity, so is the height at the next step. Using real gravity keeps every step honest.",
    equation: 'g(h) = g₀ · (R / (R + h))²   ·   R = 6,371,000 m',
  },
]

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, delay },
})

export default function Modifications() {
  const beat    = useTypewriter(BEAT)
  const rk4     = useTypewriter(RK4_INTRO)
  const gravity = useTypewriter(GRAVITY_INTRO)

  return (
    <div className="mods-page">

      {/* Header */}
      <motion.div className="section-header" {...fadeUp(0)}>
        <div>
          <h2 className="section-h2">
            <span className="bracket">[</span>OUR MODIFICATIONS<span className="bracket">]</span>
          </h2>
          <p className="section-sub">Two things we changed about how Abba solved the problem</p>
        </div>
        <span className="section-tag">WHAT WE CHANGED</span>
      </motion.div>

      {/* Opening beat */}
      <motion.div className="mods-beat" {...fadeUp(0.05)}>
        <p className="beat-line">{beat.display}</p>
      </motion.div>

      {/* Two-mod overview grid */}
      <AnimatePresence>
        {true && (
          <motion.div
            key="mod-grid"
            className="mods-grid"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            {MODS.map((m, i) => (
              <motion.div
                key={m.tag}
                className="mod-card"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.15 }}
              >
                <div className="mod-tag">{m.tag}</div>
                <h3 className="mod-title">{m.title}</h3>
                <div className="mod-block">
                  <span className="mod-label">WHAT WE DID</span>
                  <p className="mod-text">{m.what}</p>
                </div>
                <div className="mod-block">
                  <span className="mod-label">WHY IT MATTERS</span>
                  <p className="mod-text">{m.why}</p>
                </div>
                <code className="mod-eq">{m.equation}</code>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* RK4 deep dive */}
      <AnimatePresence>
        {true && (
          <motion.div
            key="rk4"
            className="mods-deep"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <div className="mods-deep-header">
              <span className="chart-tag">HOW RK4 ACTUALLY WORKS</span>
              <span className="mods-deep-sub">four looks per step, applied to Abba's three equations</span>
            </div>
            <p className="beat-line" style={{ marginBottom: '1rem' }}>{rk4.display}</p>

            <div className="rk4-steps">
              {RK4_STEPS.map((s, i) => (
                <motion.div
                  key={s.label}
                  className={`rk4-row ${i === RK4_STEPS.length - 1 ? 'final' : ''}`}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.1 }}
                >
                  <span className="rk4-label">{s.label}</span>
                  <code className="rk4-code">= {s.code}</code>
                  <span className="rk4-note">· {s.note}</span>
                </motion.div>
              ))}
            </div>

            <div className="mods-error-strip">
              <div className="err-block">
                <div className="data-label">Euler error grows like</div>
                <div className="data-value" style={{ color: 'rgba(255,255,255,0.4)' }}>Δt</div>
              </div>
              <div className="err-arrow">→</div>
              <div className="err-block">
                <div className="data-label">RK4 error grows like</div>
                <div className="data-value" style={{ color: 'var(--red)' }}>Δt⁴</div>
              </div>
              <div className="err-arrow">·</div>
              <div className="err-block">
                <div className="data-label">At Δt = 0.1s that means RK4 is about</div>
                <div className="data-value" style={{ color: 'var(--red)' }}>10,000× closer</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gravity deep dive */}
      <AnimatePresence>
        {true && (
          <motion.div
            key="grav"
            className="mods-deep"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <div className="mods-deep-header">
              <span className="chart-tag">HOW MUCH GRAVITY ACTUALLY CHANGES</span>
              <span className="mods-deep-sub">gravity at four different heights, computed from Newton's law</span>
            </div>
            <p className="beat-line" style={{ marginBottom: '1rem' }}>{gravity.display}</p>

            <div className="grav-strip">
              <div className="grav-block">
                <div className="data-label">On the launchpad</div>
                <div className="data-value" style={{ color: 'var(--red)' }}>9.810 m/s²</div>
                <div className="grav-note">the number Abba used the whole flight</div>
              </div>
              <div className="grav-block">
                <div className="data-label">20 km up</div>
                <div className="data-value">9.749 m/s²</div>
                <div className="grav-note">a little more than half a percent weaker</div>
              </div>
              <div className="grav-block">
                <div className="data-label">60 km up (where Saturn V ends up)</div>
                <div className="data-value">9.626 m/s²</div>
                <div className="grav-note">almost two percent weaker</div>
              </div>
              <div className="grav-block">
                <div className="data-label">200 km up (space station height)</div>
                <div className="data-value">9.209 m/s²</div>
                <div className="grav-note">six percent weaker</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bridge to results */}
      <motion.div className="mods-bridge card" {...fadeUp(0.2)}>
        <span className="section-tag">WHAT COMES NEXT</span>
        <p className="beat-line" style={{ marginTop: '0.5rem' }}>
          Those are the two changes. Same three equations Abba wrote down, same rocket, same 150
          seconds. In the next section we ran both his method and ours side by side, and you can drag
          the step size to see for yourself where they start to disagree.
        </p>
      </motion.div>

    </div>
  )
}
