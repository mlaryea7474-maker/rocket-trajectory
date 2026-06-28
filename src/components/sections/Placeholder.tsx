import { motion } from 'framer-motion'
import { Sigma, TrendingUp, Rocket, Wrench, FileText } from 'lucide-react'

const CONFIG: Record<string, { icon: React.ReactNode; label: string; sub: string }> = {
  'ode-system':  { icon: <Sigma size={40} />,       label: 'ODE SYSTEM',        sub: 'The three governing equations of rocket flight' },
  'projectile':  { icon: <TrendingUp size={40} />,  label: 'PROJECTILE MODEL',  sub: 'Figure 3 — Trajectory fan at multiple launch angles' },
  'saturn-v':    { icon: <Rocket size={40} />,       label: 'SATURN V',          sub: 'Figure 5 — Euler simulation: height · velocity · acceleration' },
  'model':       { icon: <Wrench size={40} />,       label: 'MODEL EXPLANATION', sub: 'Euler method · Force breakdown · Parameter sensitivity' },
  'references':  { icon: <FileText size={40} />,     label: 'REFERENCES',        sub: 'Abba 2018 · Full bibliography' },
}

export default function Placeholder({ id }: { id: string }) {
  const cfg = CONFIG[id] ?? { icon: null, label: id.toUpperCase(), sub: '' }
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        minHeight: '60vh', gap: '1.25rem', textAlign: 'center',
        color: 'rgba(255,255,255,0.35)',
      }}
    >
      <div style={{ color: '#dc143c', opacity: 0.5 }}>{cfg.icon}</div>
      <h3 style={{ fontFamily: "'Oswald', sans-serif", fontSize: '1.4rem', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.5)' }}>
        [ {cfg.label} ]
      </h3>
      <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.75rem', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.05em' }}>
        {cfg.sub}
      </p>
      <div style={{
        fontFamily: "'JetBrains Mono', monospace", fontSize: '0.65rem',
        color: 'rgba(220,20,60,0.4)', border: '1px solid rgba(220,20,60,0.2)',
        padding: '0.3rem 0.8rem', letterSpacing: '0.12em',
      }}>
        SECTION LOADING...
      </div>
    </motion.div>
  )
}
