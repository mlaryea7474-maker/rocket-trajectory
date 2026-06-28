import { motion } from 'framer-motion'
import { Sun, Moon } from 'lucide-react'
import './Header.css'

interface HeaderProps {
  theme: 'light' | 'dark'
  onToggleTheme: () => void
}

export default function Header({ theme, onToggleTheme }: HeaderProps) {
  return (
    <>
      <header className="dash-header">
        <div className="header-left">
          <div className="terminal-bar">
            <div className="terminal-dots">
              <span className="dot red" />
              <span className="dot yellow" />
              <span className="dot green" />
            </div>
            <span className="terminal-path">~/de/mth355/abba-2018</span>
          </div>

          <h1 className="header-title">
            <span className="bracket">[</span>
            ROCKET TRAJECTORY
            <span className="bracket">]</span>
            <span className="title-suffix">COMMAND CENTER</span>
          </h1>

          <div className="title-underline">
            <div className="uline-bar" />
            <div className="uline-diamond" />
            <div className="uline-bar" />
          </div>
        </div>

        <div className="header-right">
          <button className="theme-toggle" onClick={onToggleTheme}>
            {theme === 'light' ? <Moon size={13} /> : <Sun size={13} />}
            <span>{theme === 'light' ? 'DARK::MODE' : 'LIGHT::MODE'}</span>
          </button>
          <div className="status-pill">
            <span className="status-dot" />
            <span className="status-label">ANALYSIS ACTIVE</span>
          </div>
        </div>
      </header>

      {/* HUD Corners */}
      {[
        { cls: 'hud-tl', text: 'SYSTEM::ONLINE',  bar: true },
        { cls: 'hud-tr', text: 'UPLINK::SECURE',  bar: true },
        { cls: 'hud-bl', text: 'CHANNEL::ACTIVE', bar: false },
        { cls: 'hud-br', text: 'TLS::1.3',        bar: false },
      ].map(({ cls, text, bar }, i) => (
        <motion.div
          key={cls}
          className={`hud-corner ${cls}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 + i * 0.1 }}
        >
          <div className={`hud-bracket ${cls.includes('tr') || cls.includes('br') ? 'flip-h' : ''} ${cls.includes('bl') || cls.includes('br') ? 'flip-v' : ''}`} />
          <span className="hud-text">{text}</span>
          {bar && <div className="hud-bar" />}
        </motion.div>
      ))}
    </>
  )
}
