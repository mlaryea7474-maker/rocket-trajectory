import { motion } from 'framer-motion'
import { BookOpen, Sigma, TrendingUp, Rocket, Wrench, Terminal } from 'lucide-react'

function CubeIcon() {
  return (
    <svg viewBox="0 0 100 100" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
      {/* Top face */}
      <polygon points="50,8 88,28 50,48 12,28" fill="rgba(255,255,255,0.15)" stroke="currentColor" />
      {/* Left face */}
      <polygon points="12,28 50,48 50,88 12,68" fill="rgba(255,255,255,0.06)" stroke="currentColor" />
      {/* Right face */}
      <polygon points="88,28 50,48 50,88 88,68" fill="rgba(255,255,255,0.1)" stroke="currentColor" />
      {/* Center vertical edge */}
      <line x1="50" y1="48" x2="50" y2="88" stroke="currentColor" />
    </svg>
  )
}
import './Sidebar.css'

export type Section = 'introduction' | 'ode-system' | 'projectile' | 'saturn-v' | 'model' | 'references'

const NAV_ITEMS: { id: Section; label: string; icon: React.ReactNode; sub: string }[] = [
  { id: 'introduction', label: 'Introduction',       icon: <BookOpen size={16} />,    sub: 'Problem Overview' },
  { id: 'ode-system',   label: 'ODE System',         icon: <Sigma size={16} />,       sub: 'The Equations' },
  { id: 'projectile',   label: 'Projectile Model',   icon: <TrendingUp size={16} />,  sub: 'Fig. 3 · Trajectory Fan' },
  { id: 'saturn-v',     label: 'Saturn V',           icon: <Rocket size={16} />,      sub: 'Fig. 5 · Euler Sim' },
  { id: 'model',        label: 'Model Explanation',  icon: <Wrench size={16} />,      sub: 'Euler · Forces · Sensitivity' },
  { id: 'references',   label: 'MATLAB Code',        icon: <Terminal size={16} />,    sub: 'Euler Loop · Launch from Ghana' },
]

interface Props {
  activeSection: Section
  onNavigate: (s: Section) => void
}

export default function Sidebar({ activeSection, onNavigate }: Props) {
  return (
    <motion.aside
      className="sidebar"
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="sidebar-glow" />

      {/* Identity panel */}
      <div className="sidebar-identity">
        <motion.div className="sidebar-icon" whileHover={{ scale: 1.05 }}>
          <CubeIcon />
        </motion.div>
        <div className="sidebar-title">TRAJECTORY<br />ANALYSIS</div>
        <div className="sidebar-subtitle">Differential Equations</div>
      </div>

      {/* Navigation */}
      <nav>
        <ul className="nav-list">
          {NAV_ITEMS.map((item, i) => (
            <motion.li
              key={item.id}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 + i * 0.06 }}
            >
              <button
                className={`nav-btn ${activeSection === item.id ? 'active' : ''}`}
                onClick={() => onNavigate(item.id)}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-text">
                  <span className="nav-label">{item.label}</span>
                  <span className="nav-sub">{item.sub}</span>
                </span>
                {activeSection === item.id && (
                  <motion.div className="nav-indicator" layoutId="indicator" />
                )}
              </button>
            </motion.li>
          ))}
        </ul>
      </nav>

      {/* Citation footer */}
      <div className="sidebar-footer">
        <div className="footer-line" />
        <p className="footer-cite">Abba, G. (2018)</p>
        <p className="footer-cite">Modeling Rocket Flight</p>
        <p className="footer-cite muted">Carleton College · MTH 355</p>
      </div>
    </motion.aside>
  )
}
