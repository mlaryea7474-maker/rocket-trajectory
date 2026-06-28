import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import './ModelExplanation.css'

const BEAT = "The Saturn V model had a different goal entirely. He was not searching for an optimal angle. He was asking what actually happens during the first 150 seconds of powered flight in a rocket this large, and the only way to find out was to simulate it, one small step at a time."

const IDEA_TEXT = "Three things were changing simultaneously throughout the flight: height, velocity, and mass. Each one fed into the next. Velocity determined how fast the rocket climbed. Mass determined how hard it could accelerate. Drag shifted with every metre of altitude gained. No single formula could hold all of that at once, so Abba broke time into steps of 0.1 seconds and computed the state of the rocket at each one. He used Euler's method, one of the simplest numerical techniques in existence."

const WHY_TEXT = "Each step is small enough that the errors stay negligible. Over 1,500 steps the computation builds into three complete curves: how high the rocket climbed, how fast it moved, and how hard it accelerated across the full burn. Not an angle. Not a single number. A picture of what a real flight looks like."

const CONCLUSION_TEXT = "That is the full contrast. The projectile had one clean answer: 45°, written in two lines on a chalkboard, no computer needed. The Saturn V needed 1,500 iterations just to describe what it did. Abba showed both cases, and the line between them is exactly where mathematics stops being solvable by hand and needs a machine to finish the job."

const EULER_STEPS = [
  { code: 'h[n+1] = h[n] + Δt · v[n]',        note: 'position updates from velocity' },
  { code: 'v[n+1] = v[n] + Δt · a[n]',        note: 'velocity updates from acceleration' },
  { code: 'm[n+1] = m[n] − Δt · ṁ',           note: 'mass decreases as fuel burns' },
  { code: 'a[n]   = (F − D − M·g) / M',        note: 'acceleration from net force' },
]

const FORCES = [
  {
    tag:   'THRUST',
    label: 'F',
    value: '34,000,000 N',
    desc:  'He set thrust to 34 million Newtons, constant while the engines burned, then zero the moment the fuel ran out at 150 seconds.',
  },
  {
    tag:   'DRAG',
    label: 'D = ½ρCₐAv²',
    value: 'varies with speed & altitude',
    desc:  'He modeled drag as proportional to velocity squared. As the rocket climbed, air got thinner, so drag fell even as speed rose.',
  },
  {
    tag:   'GRAVITY',
    label: 'g',
    value: '9.81 m/s²',
    desc:  'He held gravity constant at 9.81 m/s² pulling downward the entire flight, the force that had to be overcome at every step.',
  },
]

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

export default function ModelExplanation() {
  const [beatIdx,   setBeatIdx]   = useState(0)
  const beatDone = beatIdx >= BEAT.length

  const [ideaActive,       setIdeaActive]       = useState(false)
  const [loopActive,       setLoopActive]       = useState(false)
  const [forcesActive,     setForcesActive]     = useState(false)
  const [whyActive,        setWhyActive]        = useState(false)
  const [conclusionActive, setConclusionActive] = useState(false)

  const idea       = useStream(IDEA_TEXT,       ideaActive)
  const why        = useStream(WHY_TEXT,        whyActive)
  const conclusion = useStream(CONCLUSION_TEXT, conclusionActive)

  /* beat stream */
  useEffect(() => {
    if (beatDone) return
    const t = setTimeout(() => setBeatIdx(i => i + 1), 20)
    return () => clearTimeout(t)
  }, [beatIdx, beatDone])

  /* beat done → idea */
  useEffect(() => {
    if (!beatDone) return
    const t = setTimeout(() => setIdeaActive(true), 400)
    return () => clearTimeout(t)
  }, [beatDone])

  /* idea done → loop equations */
  useEffect(() => {
    if (!idea.done || !ideaActive) return
    const t = setTimeout(() => setLoopActive(true), 400)
    return () => clearTimeout(t)
  }, [idea.done, ideaActive])

  /* loop active → forces (allow all 4 equations to stagger in first) */
  useEffect(() => {
    if (!loopActive) return
    const t = setTimeout(() => setForcesActive(true), 900)
    return () => clearTimeout(t)
  }, [loopActive])

  /* forces active → why it works (allow 3 cards to stagger in) */
  useEffect(() => {
    if (!forcesActive) return
    const t = setTimeout(() => setWhyActive(true), 900)
    return () => clearTimeout(t)
  }, [forcesActive])

  /* why done → conclusion */
  useEffect(() => {
    if (!why.done || !whyActive) return
    const t = setTimeout(() => setConclusionActive(true), 400)
    return () => clearTimeout(t)
  }, [why.done, whyActive])

  return (
    <div className="me-page">

      {/* Header */}
      <motion.div className="section-header" {...fadeUp(0)}>
        <div>
          <h2 className="section-h2">
            <span className="bracket">[</span>MODEL EXPLANATION<span className="bracket">]</span>
          </h2>
          <p className="section-sub">Simulating 150 seconds of real flight · Euler's method applied to the Saturn V</p>
        </div>
        <span className="section-tag">EULER::METHOD · FORCES</span>
      </motion.div>

      {/* Narrative beat */}
      <motion.div className="me-beat" {...fadeUp(0.05)}>
        <p className="beat-line">
          {BEAT.slice(0, beatIdx)}
          <span className="stream-cursor" />
        </p>
      </motion.div>

      {/* What Euler's method is */}
      <AnimatePresence>
        {ideaActive && (
          <motion.div
            key="idea"
            className="me-card card"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <span className="section-tag">THE QUESTION</span>
            <p className="me-prose" style={{ marginTop: '0.75rem' }}>
              {idea.display}
              {!idea.done && <span className="stream-cursor" />}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* The four update equations */}
      <AnimatePresence>
        {loopActive && (
          <motion.div
            key="loop"
            className="me-equations"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <div className="eq-header">
              <span className="chart-tag">THE LOOP</span>
              <span className="eq-header-sub">repeated every Δt = 0.1 s</span>
            </div>
            {EULER_STEPS.map((step, i) => (
              <motion.div
                key={i}
                className="eq-row"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.15 }}
              >
                <span className="eq-index">{String(i + 1).padStart(2, '0')}</span>
                <code className="eq-code">{step.code}</code>
                <span className="eq-note">← {step.note}</span>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Three forces */}
      <AnimatePresence>
        {forcesActive && (
          <motion.div
            key="forces"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <div style={{ marginBottom: '0.75rem' }}>
              <span className="section-tag">THREE FORCES HE MODELED</span>
            </div>
            <div className="forces-grid">
              {FORCES.map((f, i) => (
                <motion.div
                  key={f.tag}
                  className="force-card card"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.15 }}
                >
                  <div className="force-tag">{f.tag}</div>
                  <div className="force-label">{f.label}</div>
                  <div className="force-value">{f.value}</div>
                  <p className="force-desc">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Why it works */}
      <AnimatePresence>
        {whyActive && (
          <motion.div
            key="why"
            className="me-card card"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <span className="section-tag">WHY IT WORKS</span>
            <p className="me-prose" style={{ marginTop: '0.75rem' }}>
              {why.display}
              {!why.done && <span className="stream-cursor" />}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Final conclusion */}
      <AnimatePresence>
        {conclusionActive && (
          <motion.div
            key="conclusion"
            className="me-conclusion card"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <span className="section-tag">CONCLUSION</span>
            <p className="me-prose" style={{ marginTop: '0.75rem' }}>
              {conclusion.display}
              {!conclusion.done && <span className="stream-cursor" />}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}
