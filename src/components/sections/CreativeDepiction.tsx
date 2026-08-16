import { motion } from 'framer-motion'
import './CreativeDepiction.css'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay },
})

export default function CreativeDepiction() {
  return (
    <div className="cd-page">

      {/* Header */}
      <motion.div className="section-header" {...fadeUp(0)}>
        <div>
          <h2 className="section-h2">
            <span className="bracket">[</span>CREATIVE DEPICTION<span className="bracket">]</span>
          </h2>
          <p className="section-sub">The whole project in one picture: the rocket, the equations, and both paths it can take</p>
        </div>
        <span className="section-tag">THE PROJECT, DRAWN</span>
      </motion.div>

      {/* The visual */}
      <motion.div className="cd-canvas" {...fadeUp(0.1)}>
        <svg viewBox="0 0 800 480" className="cd-svg" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">

          {/* HUD grid */}
          <defs>
            <pattern id="cdgrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(220,20,60,0.05)" strokeWidth="0.5" />
            </pattern>
            <radialGradient id="cdglow" cx="50%" cy="80%" r="50%">
              <stop offset="0%"  stopColor="rgba(220,20,60,0.35)" />
              <stop offset="100%" stopColor="rgba(220,20,60,0)" />
            </radialGradient>
            <linearGradient id="cdrocket" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"  stopColor="rgba(220,20,60,0.9)" />
              <stop offset="100%" stopColor="rgba(220,20,60,0.4)" />
            </linearGradient>
            <linearGradient id="cdearth" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"  stopColor="rgba(6,6,10,0.9)" />
              <stop offset="100%" stopColor="rgba(220,20,60,0.15)" />
            </linearGradient>
          </defs>
          <rect width="800" height="480" fill="url(#cdgrid)" />

          {/* Ground horizon glow */}
          <ellipse cx="400" cy="470" rx="500" ry="90" fill="url(#cdglow)" />

          {/* Earth curvature */}
          <path
            d="M -100 470 Q 400 380 900 470 L 900 480 L -100 480 Z"
            fill="url(#cdearth)"
            stroke="rgba(220,20,60,0.35)"
            strokeWidth="1.5"
          />

          {/* HUD brackets top-left / top-right / bottom-left / bottom-right */}
          <g stroke="rgba(220,20,60,0.5)" strokeWidth="1" fill="none">
            <path d="M 12 12 L 40 12 M 12 12 L 12 40" />
            <path d="M 788 12 L 760 12 M 788 12 L 788 40" />
            <path d="M 12 468 L 40 468 M 12 468 L 12 440" />
            <path d="M 788 468 L 760 468 M 788 468 L 788 440" />
          </g>

          {/* Corner labels */}
          <text x="20" y="30" fill="rgba(220,20,60,0.65)" fontSize="9" fontFamily="JetBrains Mono" letterSpacing="0.1em">SATURN V · ABBA 2018</text>
          <text x="780" y="30" fill="rgba(220,20,60,0.65)" fontSize="9" fontFamily="JetBrains Mono" letterSpacing="0.1em" textAnchor="end">MOD 01 · RK4</text>
          <text x="20" y="460" fill="rgba(220,20,60,0.65)" fontSize="9" fontFamily="JetBrains Mono" letterSpacing="0.1em">MOD 02 · g(h)</text>
          <text x="780" y="460" fill="rgba(220,20,60,0.65)" fontSize="9" fontFamily="JetBrains Mono" letterSpacing="0.1em" textAnchor="end">MTH221 · DE PROJECT</text>

          {/* Two ascent trajectories: Euler (dashed, drifted) vs RK4 (solid, correct) */}
          {/* Both go from launchpad (400, 460) upward */}

          {/* RK4 trajectory, smooth and accurate */}
          <path
            id="cd-rk4-anim-path"
            d="M 400 460 Q 380 320 340 180 T 260 40"
            fill="none"
            stroke="#dc143c"
            strokeWidth="2.5"
            strokeLinecap="round"
            className="cd-rk4-path"
          />

          {/* Euler trajectory, dashed, drifts a bit off */}
          <path
            id="cd-euler-anim-path"
            d="M 400 460 Q 386 320 356 180 T 300 40"
            fill="none"
            stroke="rgba(255,255,255,0.45)"
            strokeWidth="1.5"
            strokeDasharray="6 4"
            strokeLinecap="round"
            className="cd-euler-path"
          />


          {/* Trajectory labels */}
          <text x="240" y="55" fill="#dc143c" fontSize="10" fontFamily="JetBrains Mono" letterSpacing="0.06em">RK4</text>
          <text x="310" y="55" fill="rgba(255,255,255,0.55)" fontSize="10" fontFamily="JetBrains Mono" letterSpacing="0.06em">EULER</text>

          {/* Small launchpad base marker showing origin */}
          <g transform="translate(400 460)">
            <rect x="-14" y="0" width="28" height="4" fill="rgba(220,20,60,0.5)" stroke="#dc143c" strokeWidth="0.6" />
            <line x1="-18" y1="4" x2="18" y2="4" stroke="#dc143c" strokeWidth="1" />
            <text x="0" y="18" fill="rgba(220,20,60,0.7)" fontSize="8" fontFamily="JetBrains Mono" textAnchor="middle" letterSpacing="0.15em">LAUNCHPAD</text>
          </g>

          {/* The rocket, animated up the RK4 path — geometry centered on origin so animateMotion places it correctly */}
          <g className="cd-flying-rocket">
            {/* body */}
            <rect x="-10" y="-21" width="20" height="42" fill="url(#cdrocket)" stroke="#dc143c" strokeWidth="1.2" rx="2" />
            {/* nose */}
            <path d="M -10 -21 L 0 -35 L 10 -21 Z" fill="rgba(220,20,60,0.7)" stroke="#dc143c" strokeWidth="1.2" />
            {/* fins */}
            <path d="M -10 11 L -18 25 L -10 23 Z" fill="rgba(220,20,60,0.4)" stroke="#dc143c" strokeWidth="1" />
            <path d="M  10 11 L  18 25 L  10 23 Z" fill="rgba(220,20,60,0.4)" stroke="#dc143c" strokeWidth="1" />
            {/* window */}
            <circle cx="0" cy="-9" r="3" fill="rgba(6,6,10,0.9)" stroke="#dc143c" strokeWidth="0.8" />
            {/* stage marker */}
            <line x1="-10" y1="3" x2="10" y2="3" stroke="#dc143c" strokeWidth="0.6" strokeDasharray="1 1.5" />
            {/* trailing flame */}
            <path d="M -6 21 Q 0 39 6 21 Q 0 57 -6 21 Z" fill="rgba(220,20,60,0.6)">
              <animate attributeName="opacity" values="0.55;1;0.55" dur="0.28s" repeatCount="indefinite" />
              <animate attributeName="d"
                values="M -6 21 Q 0 39 6 21 Q 0 57 -6 21 Z;
                        M -6 21 Q 0 44 6 21 Q 0 65 -6 21 Z;
                        M -6 21 Q 0 39 6 21 Q 0 57 -6 21 Z"
                dur="0.28s" repeatCount="indefinite" />
            </path>
            <path d="M -3 21 Q 0 33 3 21 Q 0 47 -3 21 Z" fill="rgba(255,120,120,0.5)">
              <animate attributeName="opacity" values="0.4;0.9;0.4" dur="0.2s" repeatCount="indefinite" />
            </path>
            {/* Motion along the RK4 path, loops forever */}
            <animateMotion dur="7s" repeatCount="indefinite" rotate="0">
              <mpath href="#cd-rk4-anim-path" />
            </animateMotion>
          </g>

          {/* ODE system watermark on the right */}
          <g transform="translate(560 130)" opacity="0.55">
            <text x="0" y="0"   fill="rgba(255,255,255,0.7)" fontSize="14" fontFamily="JetBrains Mono" letterSpacing="0.05em">dh/dt = v</text>
            <text x="0" y="24"  fill="rgba(255,255,255,0.7)" fontSize="14" fontFamily="JetBrains Mono" letterSpacing="0.05em">dv/dt = F/M − g(h) − D/M</text>
            <text x="0" y="48"  fill="rgba(255,255,255,0.7)" fontSize="14" fontFamily="JetBrains Mono" letterSpacing="0.05em">dm/dt = −ṁ</text>
            <line x1="-14" y1="-10" x2="-14" y2="56" stroke="rgba(220,20,60,0.7)" strokeWidth="2" />
            <text x="0" y="74" fill="rgba(220,20,60,0.75)" fontSize="9" fontFamily="JetBrains Mono" letterSpacing="0.15em">THE ODE SYSTEM</text>
          </g>

          {/* RK4 endpoint marker at (260, 40): pulsing red dot where the flying rocket arrives */}
          <g transform="translate(260 40)" className="cd-endpoint-rk4">
            <circle cx="0" cy="0" r="10" fill="rgba(220,20,60,0.15)">
              <animate attributeName="r" values="8;14;8" dur="1.6s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.35;0.05;0.35" dur="1.6s" repeatCount="indefinite" />
            </circle>
            <circle cx="0" cy="0" r="3" fill="#dc143c" />
          </g>
          <text x="260" y="18" fill="#dc143c" fontSize="10" fontFamily="JetBrains Mono" letterSpacing="0.08em" textAnchor="middle">RK4 says: here</text>

          {/* Euler endpoint at (300, 40): dashed circle where Euler wrongly predicts */}
          <g transform="translate(300 40)" className="cd-endpoint-euler">
            <circle cx="0" cy="0" r="8" fill="none" stroke="rgba(245,240,230,0.55)" strokeWidth="1" strokeDasharray="2 2" />
            <circle cx="0" cy="0" r="2" fill="rgba(245,240,230,0.6)" />
          </g>
          <text x="308" y="18" fill="rgba(245,240,230,0.6)" fontSize="10" fontFamily="JetBrains Mono" letterSpacing="0.08em">Euler says: here</text>

          {/* Gap indicator between the two endpoints */}
          <line x1="266" y1="40" x2="292" y2="40" stroke="rgba(220,20,60,0.4)" strokeWidth="0.8" strokeDasharray="2 2" />
          <text x="279" y="35" fill="rgba(220,20,60,0.7)" fontSize="8" fontFamily="JetBrains Mono" textAnchor="middle" letterSpacing="0.08em">the gap</text>

          {/* Real-world consequence callout, anchored bottom-left of the SVG */}
          <g transform="translate(50 300)" className="cd-realworld">
            <text x="0" y="0" fill="rgba(220,20,60,0.75)" fontSize="9" fontFamily="JetBrains Mono" letterSpacing="0.15em">IN REAL LIFE</text>
            <line x1="0" y1="8" x2="180" y2="8" stroke="rgba(220,20,60,0.35)" strokeWidth="0.8" />
            <text x="0" y="26"  fill="rgba(245,240,230,0.75)" fontSize="10" fontFamily="JetBrains Mono">that gap is where the</text>
            <text x="0" y="42"  fill="rgba(245,240,230,0.75)" fontSize="10" fontFamily="JetBrains Mono">rocket physically ends up.</text>
            <text x="0" y="66"  fill="rgba(245,240,230,0.55)" fontSize="9"  fontFamily="JetBrains Mono">a wrong solver means</text>
            <text x="0" y="80"  fill="rgba(245,240,230,0.55)" fontSize="9"  fontFamily="JetBrains Mono">the satellite misses orbit,</text>
            <text x="0" y="94"  fill="rgba(245,240,230,0.55)" fontSize="9"  fontFamily="JetBrains Mono">the lander misses the moon,</text>
            <text x="0" y="108" fill="rgba(245,240,230,0.55)" fontSize="9"  fontFamily="JetBrains Mono">the probe misses mars.</text>
          </g>

          {/* Altitude scale on the left */}
          <g transform="translate(50 60)">
            <text x="0" y="0"  fill="rgba(220,20,60,0.6)" fontSize="8" fontFamily="JetBrains Mono" letterSpacing="0.1em">h · km</text>
            <line x1="30" y1="20"  x2="30" y2="380" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
            <line x1="26" y1="20"  x2="34" y2="20"  stroke="rgba(255,255,255,0.2)" strokeWidth="0.8" />
            <text x="10" y="24" fill="rgba(255,255,255,0.35)" fontSize="8" fontFamily="JetBrains Mono">60</text>
            <line x1="26" y1="140" x2="34" y2="140" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
            <text x="10" y="144" fill="rgba(255,255,255,0.3)" fontSize="8" fontFamily="JetBrains Mono">40</text>
            <line x1="26" y1="260" x2="34" y2="260" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
            <text x="10" y="264" fill="rgba(255,255,255,0.3)" fontSize="8" fontFamily="JetBrains Mono">20</text>
            <line x1="26" y1="380" x2="34" y2="380" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8" />
            <text x="16" y="384" fill="rgba(255,255,255,0.35)" fontSize="8" fontFamily="JetBrains Mono">0</text>
          </g>

        </svg>
      </motion.div>

      {/* Caption block */}
      <motion.div className="cd-caption" {...fadeUp(0.2)}>
        <div className="cd-cap-header">
          <span className="chart-tag">HOW TO READ THE PICTURE</span>
        </div>
        <div className="cd-cap-body">
          <p>
            <span className="cd-cap-lead">At the bottom:</span>
            the Saturn V lifts off from the pad, the same rocket Abba wrote about, 2.9 million
            kilograms sitting on 34 million Newtons of thrust, burning 13,000 kilograms of fuel every
            second.
          </p>
          <p>
            <span className="cd-cap-lead">Two lines going up:</span>
            the solid red curve is the path RK4 traces out. The dashed white curve is the path
            Abba's Euler method traces out. Same rocket, same three equations, but two different
            ways of stepping through time.
          </p>
          <p>
            <span className="cd-cap-lead">Two rockets at the top:</span>
            the small red rocket is where RK4 says the Saturn V ends up after 150 seconds. The dashed
            white circle right next to it is where Euler says it ends up. Same launch, same fuel, but
            the two methods disagree, and the little dashed line labelled "the gap" is exactly how
            far apart they are.
          </p>
          <p>
            <span className="cd-cap-lead">Why the gap actually matters:</span>
            this is not just a number on a chart. That gap is a real distance in the sky. If you were
            actually launching this rocket and your guidance computer used Abba's Euler method to
            decide when to cut the engines, the rocket would physically end up in the dashed-white
            spot instead of the red one. A few metres per second of error at engine cutoff turns into
            hundreds of kilometres of missed target by the time the rocket coasts to where it is
            going. A satellite misses the orbit it was aiming for. A lander misses the moon. A probe
            misses Mars. This is why picking the right way to step through time is not an academic
            detail. It is the difference between hitting the target and missing it entirely.
          </p>
          <p>
            <span className="cd-cap-lead">On the right:</span>
            the three equations that decide everything. Height changes at the rate of speed. Speed
            depends on the thrust pushing up, the drag pushing down, and gravity pulling down, all
            divided by whatever mass is left. Mass drops as fuel burns.
          </p>
        </div>
      </motion.div>

    </div>
  )
}
