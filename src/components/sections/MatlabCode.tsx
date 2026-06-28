import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import './MatlabCode.css'

const BEAT_A    = "This is the MATLAB code that replicates "
const BEAT_LINK = "Sani Abba"
const BEAT_B    = "'s Saturn V simulation. It uses the paper's exact parameters: 2.9 million kilograms, 34 million Newtons of thrust, 13,000 kilograms of propellant burned every second. Euler's method steps through 150 seconds of powered flight at 0.1-second intervals and produces three figures matching the paper."
const BEAT      = BEAT_A + BEAT_LINK + BEAT_B
const PAPER_URL = "https://www.researchgate.net/publication/347711217_Modeling_Rocket_Flight_Trajectory"

function renderBeat(idx: number) {
  if (idx <= BEAT_A.length) {
    return <>{BEAT_A.slice(0, idx)}</>
  }
  const linkProgress = idx - BEAT_A.length
  if (linkProgress <= BEAT_LINK.length) {
    return (
      <>
        {BEAT_A}
        <a href={PAPER_URL} target="_blank" rel="noopener noreferrer" className="beat-link">
          {BEAT_LINK.slice(0, linkProgress)}
        </a>
      </>
    )
  }
  return (
    <>
      {BEAT_A}
      <a href={PAPER_URL} target="_blank" rel="noopener noreferrer" className="beat-link">
        {BEAT_LINK}
      </a>
      {BEAT_B.slice(0, idx - BEAT_A.length - BEAT_LINK.length)}
    </>
  )
}

const CODE = `%% ============================================================
%% MATLAB Implementation — Saturn V Trajectory Simulation

%% Constants 
g0 = 9.81;        % gravitational acceleration (m/s²)
rho0 = 1.225;       % air density at sea level (kg/m³)
Hs= 8500;        % atmospheric scale height (m)

%%Saturn V Parameters (Abba 2018) 
T= 34000000;    % thrust (N)
massFlow = 13000;   % propellant mass flow rate (kg/s)
Cd = 0.5;         % drag coefficient
A= 78.5;        % cross-sectional area (m²)
m0= 2900000;     % initial mass (kg)

%%Initial Conditions
h= 0;
v= 0;
m= m0;
t= 0;
dt= 0.1;
tMax= 150;

%% Storage
Time = [];
Height= [];
Velocity= [];
Acceleration = [];

%% Euler Integration Loop
while t <= tMax
    rho= rho0 * exp(-h / Hs);             % atmospheric density at altitude
    D = 0.5 * rho * Cd * A * v * abs(v); % aerodynamic drag
    acc= (T - D) / m - g0;                % net acceleration

    Time(end+1)= t;
    Height(end+1) = h / 1000;         % metres → km
    Velocity(end+1) = v;
    Acceleration(end+1) = acc;

    h = h + dt * v;
    v = v + dt * acc;
    m = max(m - dt * massFlow, m0 - massFlow * tMax);
    t = t + dt;
end

%% Figure 1: Altitude vs Time
figure(1)
plot(Time, Height, 'r', 'LineWidth', 2)
xlabel('Time (s)')
ylabel('Altitude (km)')
title('Saturn V Altitude vs Time — Replication of Abba (2018)')
grid on

%% Figure 2: Velocity vs Time
figure(2)
plot(Time, Velocity, 'r', 'LineWidth', 2)
xlabel('Time (s)')
ylabel('Velocity (m/s)')
title('Saturn V Velocity vs Time — Replication of Abba (2018)')
grid on

%%Figure 3: Acceleration vs Time 
figure(3)
plot(Time, Acceleration, 'r', 'LineWidth', 2)
xlabel('Time (s)')
ylabel('Acceleration (m/s²)')
title('Saturn V Acceleration vs Time — Replication of Abba (2018)')
grid on`

function renderHighlighted(code: string) {
  const lines = code.split('\n')
  return lines.map((line, i) => {
    const ci = line.indexOf('%')
    if (ci === -1) return <div key={i} className="code-line">{line || ' '}</div>
    if (ci === 0)  return <div key={i} className="code-line"><span className="code-comment">{line}</span></div>
    return (
      <div key={i} className="code-line">
        <span>{line.slice(0, ci)}</span>
        <span className="code-comment">{line.slice(ci)}</span>
      </div>
    )
  })
}

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, delay },
})

export default function MatlabCode() {
  const [beatIdx,     setBeatIdx]     = useState(0)
  const beatDone = beatIdx >= BEAT.length

  const [codeActive,  setCodeActive]  = useState(false)
  const [codeIdx,     setCodeIdx]     = useState(0)
  const codeDone = codeIdx >= CODE.length

  const [copied, setCopied] = useState(false)
  function copyCode() {
    navigator.clipboard.writeText(CODE)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  /* beat stream */
  useEffect(() => {
    if (beatDone) return
    const t = setTimeout(() => setBeatIdx(i => i + 1), 18)
    return () => clearTimeout(t)
  }, [beatIdx, beatDone])

  /* beat done → show code block */
  useEffect(() => {
    if (!beatDone) return
    const t = setTimeout(() => setCodeActive(true), 400)
    return () => clearTimeout(t)
  }, [beatDone])

  /* code stream */
  useEffect(() => {
    if (!codeActive || codeDone) return
    const t = setTimeout(() => setCodeIdx(i => i + 1), 6)
    return () => clearTimeout(t)
  }, [codeActive, codeIdx, codeDone])

  return (
    <div className="matlab-page">

      {/* Header */}
      <motion.div className="section-header" {...fadeUp(0)}>
        <div>
          <h2 className="section-h2">
            <span className="bracket">[</span>MATLAB IMPLEMENTATION<span className="bracket">]</span>
          </h2>
          <p className="section-sub">Saturn V Replication · Euler Method · Three Figures · Abba 2018</p>
        </div>
        <span className="section-tag">ABBA 2018 · MTH355</span>
      </motion.div>

      {/* Narrative beat */}
      <motion.div className="matlab-beat" {...fadeUp(0.05)}>
        <p className="beat-line">
          {renderBeat(beatIdx)}
          {!beatDone && <span className="stream-cursor" />}
        </p>
      </motion.div>

      {/* Code terminal */}
      <AnimatePresence>
        {codeActive && (
          <motion.div
            key="code"
            className="code-terminal"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <div className="code-header-bar">
              <span className="code-label">[ MATLAB ]</span>
              <span className="code-divider">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</span>
              <span className="code-meta">rocket_trajectory.m</span>
              <button className={`copy-btn${copied ? ' copied' : ''}`} onClick={copyCode}>
                {copied ? 'COPIED' : 'COPY'}
              </button>
            </div>
            <pre className="code-body">
              {renderHighlighted(CODE.slice(0, codeIdx))}
              {!codeDone && <span className="stream-cursor" />}
            </pre>
            <div className="code-footer-bar">
              <span>LINES: {CODE.slice(0, codeIdx).split('\n').length} / {CODE.split('\n').length}</span>
              <span>{codeDone ? 'COMPLETE' : 'WRITING...'}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}
