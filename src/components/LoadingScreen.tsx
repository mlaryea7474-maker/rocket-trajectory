import { useEffect } from 'react'
import { motion } from 'framer-motion'
import './LoadingScreen.css'

interface Props { onComplete: () => void }

export default function LoadingScreen({ onComplete }: Props) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2800)
    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <motion.div
      className="loading-page"
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.4 }}
    >
      <div className="loading-grid" />

      <div className="loader-container">
        <div className="loader-ring" />
        <div className="loader-ring" />
        <div className="loader-ring" />
        <div className="loader-core" />
      </div>

      <h2 className="loading-title">INITIALIZING TRAJECTORY ANALYSIS</h2>
      <p className="loading-sub">loading simulation parameters...</p>

      <div className="progress-track">
        <motion.div
          className="progress-fill"
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: 2.5, ease: 'easeInOut' }}
        />
      </div>

      <div className="loading-tags">
        <span>ABBA 2018</span>
        <span className="sep">::</span>
        <span>ODE ANALYSIS</span>
        <span className="sep">::</span>
        <span>MTH 355</span>
      </div>
    </motion.div>
  )
}
