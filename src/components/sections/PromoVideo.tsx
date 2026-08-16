import { motion } from 'framer-motion'
import './PromoVideo.css'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, delay },
})

export default function PromoVideo() {
  return (
    <div className="pv-page">

      <motion.div className="section-header" {...fadeUp(0)}>
        <div>
          <h2 className="section-h2">
            <span className="bracket">[</span>PROMO VIDEO<span className="bracket">]</span>
          </h2>
          <p className="section-sub">Introductory video for the project</p>
        </div>
        <span className="section-tag">VIDEO · INTRO</span>
      </motion.div>

      <motion.div className="pv-player-wrap" {...fadeUp(0.05)}>
        <div className="pv-player-header">
          <span className="pv-footer-label">CE 122 · ROCKET TRAJECTORY · PROMO</span>
        </div>
        <video
          className="pv-video"
          src="/promo.mp4"
          controls
          playsInline
          preload="metadata"
        />
      </motion.div>

    </div>
  )
}
