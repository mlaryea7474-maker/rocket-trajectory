import { motion } from 'framer-motion'
import './Background.css'

export default function Background() {
  return (
    <div className="jarvis-bg">
      <div className="grid-layer" />
      <div className="radial-pulse" />
      <motion.div
        className="scan-line"
        animate={{ top: ['0%', '100%'] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
      />
      <div className="watermark">[ ROCKET ODE ANALYSIS ]</div>
    </div>
  )
}
