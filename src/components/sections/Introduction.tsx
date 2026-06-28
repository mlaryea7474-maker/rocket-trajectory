import { useState, useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import './Introduction.css'

/* ─── Mission briefing ─────────────────────────────────── */
const STORY = [
  "October 2018. Carleton College. Sani Abba writes one question on the board: fire a projectile at 20 m/s, and find the angle that sends it the furthest distance possible.",
  "No one answers. He turns back to the board and works it out himself; if you ignore drag and ignore thrust, the projectile follows a perfect parabola, and two equations are all you need to show that 45° sends it further than any other angle. The answer is clean, exact, and requires nothing more than a pen and paper.",
  "Then he asks a harder question: what if it is not a simple projectile at all, what if it is an actual rocket? He brings up the Saturn V, the vehicle that carried humans to the Moon, which weighed 2.9 million kilograms on the launchpad, generated 34 million Newtons of thrust at ignition, and burned through 13,000 kilograms of propellant every single second of its ascent.",
  "At that scale, nothing stays constant;the mass shrinks as fuel burns away, the thrust follows a burn profile, and the drag on the rocket changes with both its speed and the density of the air at its current altitude. The clean 45° answer that worked for the simple projectile breaks down completely, and there is no single equation you can write on a chalkboard and solve.",
  "Abba set out to solve both.",
]

const LEFT_TEXT  = "He modelled the projectile by ignoring drag and thrust entirely, which reduced the problem to a clean parabolic arc. When he plotted the trajectory at every angle, 45° sent the projectile further than any other, every single time."
const RIGHT_TEXT = "The Saturn V changed every assumption he had made. With mass burning off at 13,000 kilograms every second and drag shifting with every metre of the climb, every variable in the problem was constantly changing. There was no neat formula that could predict where it would end up."
const CONCLUSION = "What Abba showed is worth understanding. Not every problem has a neat formula for an answer. The simple projectile does: one equation, 45°, and you are done. The real rocket does not. Too many things are changing at the same time for any single formula to keep up. When that happens, you do not give up on the problem. You break time into tiny pieces, solve it one small step at a time, and let the answer build itself. That is what this paper is about."

/* ─── Stream hook — trigger-based ─────────────────────── */
function useStream(text: string, trigger: boolean) {
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    if (!trigger || idx >= text.length) return
    const t = setTimeout(() => setIdx(i => i + 1), 22)
    return () => clearTimeout(t)
  }, [trigger, idx, text.length])

  return { display: text.slice(0, idx), done: idx >= text.length }
}

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, delay },
})

/* ─── Parabola ─────────────────────────────────────────── */
function ParabolaViz({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 200 115" className="contrast-svg" xmlns="http://www.w3.org/2000/svg">
      <line x1="2" y1="108" x2="198" y2="108" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
      <line x1="5"   y1="104" x2="5"   y2="112" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
      <line x1="195" y1="104" x2="195" y2="112" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
      <path
        d="M 5,108 Q 100,8 195,108"
        fill="none"
        stroke="#dc143c"
        strokeWidth="2"
        className={`parabola-path${active ? ' draw' : ''}`}
      />
      <text x="100" y="4" fill="rgba(220,20,60,0.9)" fontSize="7" textAnchor="middle" fontFamily="JetBrains Mono">45°</text>
      <line x1="100" y1="6" x2="100" y2="10" stroke="rgba(220,20,60,0.5)" strokeWidth="1" />
      {active && (
        <circle r="4" fill="#dc143c" opacity="0.9">
          <animateMotion dur="1.5s" fill="freeze" path="M 5,108 Q 100,8 195,108" />
        </circle>
      )}
      <text x="100" y="116" fill="rgba(255,255,255,0.22)" fontSize="6.5" textAnchor="middle" fontFamily="JetBrains Mono">range = 40.7 m</text>
    </svg>
  )
}

/* ─── Rocket ───────────────────────────────────────────── */
function RocketViz({ active }: { active: boolean }) {
  const [alt, setAlt] = useState(0)

  useEffect(() => {
    if (!active) return
    let cur = 0
    const id = setInterval(() => {
      cur += 500
      setAlt(Math.min(cur, 58000))
      if (cur >= 58000) clearInterval(id)
    }, 50)
    return () => clearInterval(id)
  }, [active])

  return (
    <div className={`rocket-wrap${active ? ' rise' : ''}`}>
      <div className="alt-counter">{(alt / 1000).toFixed(1)} km</div>
      <svg viewBox="0 0 60 115" className="rocket-svg" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="30" cy="58" rx="11" ry="24" fill="rgba(220,20,60,0.1)" stroke="#dc143c" strokeWidth="1.5" />
        <path d="M 19,57 Q 30,12 41,57" fill="rgba(220,20,60,0.2)" stroke="#dc143c" strokeWidth="1.5" />
        <path d="M 19,74 L 9,94 L 19,84"  fill="rgba(220,20,60,0.15)" stroke="#dc143c" strokeWidth="1" />
        <path d="M 41,74 L 51,94 L 41,84" fill="rgba(220,20,60,0.15)" stroke="#dc143c" strokeWidth="1" />
        <circle cx="30" cy="52" r="5" fill="rgba(220,20,60,0.08)" stroke="#dc143c" strokeWidth="1" />
        <path d="M 22,83 Q 30,98 38,83 Q 30,112 22,83" fill="rgba(220,20,60,0.5)" className={active ? 'flame' : ''} />
        <path d="M 25,83 Q 30,93 35,83 Q 30,104 25,83" fill="rgba(255,80,80,0.4)" className={active ? 'flame-inner' : ''} />
      </svg>
    </div>
  )
}

/* ─── Main ─────────────────────────────────────────────── */
export default function Introduction() {
  const [paraIndex, setParaIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const streamEndRef = useRef<HTMLDivElement>(null)
  const streamingDone = paraIndex >= STORY.length

  // Sequential flags
  const [showContrast,    setShowContrast]    = useState(false)
  const [leftActive,      setLeftActive]      = useState(false)
  const [rightActive,     setRightActive]     = useState(false)
  const [conclusionActive, setConclusionActive] = useState(false)

  const left       = useStream(LEFT_TEXT,  leftActive)
  const right      = useStream(RIGHT_TEXT, rightActive)
  const conclusion = useStream(CONCLUSION, conclusionActive)

  /* briefing stream */
  useEffect(() => {
    if (streamingDone) return
    const current = STORY[paraIndex]
    if (charIndex >= current.length) {
      const id = setTimeout(() => { setParaIndex(p => p + 1); setCharIndex(0) }, 300)
      return () => clearTimeout(id)
    }
    const id = setTimeout(() => setCharIndex(c => c + 1), 16)
    return () => clearTimeout(id)
  }, [paraIndex, charIndex, streamingDone])

  useEffect(() => {
    streamEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [paraIndex])

  /* step 1: briefing done → show contrast + start left */
  useEffect(() => {
    if (!streamingDone) return
    const t = setTimeout(() => { setShowContrast(true); setLeftActive(true) }, 500)
    return () => clearTimeout(t)
  }, [streamingDone])

  /* step 2: left done → start right */
  useEffect(() => {
    if (!left.done || !leftActive) return
    const t = setTimeout(() => setRightActive(true), 450)
    return () => clearTimeout(t)
  }, [left.done, leftActive])

  /* step 3: right done → start conclusion */
  useEffect(() => {
    if (!right.done || !rightActive) return
    const t = setTimeout(() => setConclusionActive(true), 500)
    return () => clearTimeout(t)
  }, [right.done, rightActive])

  const displayedParas = STORY.map((text, i) => {
    if (i < paraIndex) return text
    if (i === paraIndex) return text.slice(0, charIndex)
    return null
  })

  return (
    <div className="intro-page">

      {/* Header */}
      <motion.div className="section-header" {...fadeUp(0)}>
        <div>
          <h2 className="section-h2">
            <span className="bracket">[</span>INTRODUCTION TO THE PROBLEM<span className="bracket">]</span>
          </h2>
          <p className="section-sub">Modeling Rocket Flight Trajectory · Abba 2018</p>
        </div>
        <span className="section-tag">REALTIME::ODE_ANALYSIS</span>
      </motion.div>

      {/* Mission briefing */}
      <motion.div className="story-terminal" {...fadeUp(0.05)}>
        <div className="story-header-bar">
          <span className="story-label">[ MISSION BRIEFING ]</span>
          <span className="story-divider">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</span>
          <span className="story-classify">CLASSIFIED // ABBA-2018-MTH355</span>
        </div>
        <div className="story-body">
          {displayedParas.map((text, i) =>
            text !== null && text.length > 0 ? (
              <p key={i} className="story-para">
                {text}
                {(i === paraIndex && !streamingDone) || (streamingDone && i === STORY.length - 1)
                  ? <span className="stream-cursor" /> : null}
              </p>
            ) : null
          )}
          <div ref={streamEndRef} />
        </div>
        <div className="story-footer-bar">
          <span>[ END OF BRIEFING ]</span>
          <span>ACCESS LEVEL: MTH355 // CLEARANCE: GRANTED</span>
        </div>
      </motion.div>

      {/* Contrast panel — appears only after briefing finishes */}
      <AnimatePresence>
        {showContrast && (
          <motion.div
            key="contrast"
            className="contrast-panel"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <div className="contrast-header">
              <span className="story-label">[ TWO MODELS ]</span>
              <span className="story-divider">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</span>
            </div>

            <div className="contrast-body">
              {/* Left — simple model */}
              <div className="contrast-side">
                <div className="contrast-tag">SIMPLE PROJECTILE</div>
                <ParabolaViz active={leftActive} />
                <p className="contrast-text">
                  {left.display}
                  {leftActive && !left.done && <span className="stream-cursor" />}
                </p>
              </div>

              <div className="contrast-divider" />

              {/* Right — real rocket */}
              <div className="contrast-side">
                <div className="contrast-tag">SATURN V</div>
                <RocketViz active={rightActive} />
                <p className="contrast-text">
                  {right.display}
                  {rightActive && !right.done && <span className="stream-cursor" />}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Conclusion — streams in after both models are shown */}
      <AnimatePresence>
        {conclusionActive && (
          <motion.div
            key="conclusion"
            className="intro-conclusion"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <div className="intro-conclusion-bar">
              <span className="story-label">[ SIGNIFICANCE ]</span>
            </div>
            <p className="intro-conclusion-text">
              {conclusion.display}
              {!conclusion.done && <span className="stream-cursor" />}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}
