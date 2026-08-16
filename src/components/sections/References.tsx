import { motion } from 'framer-motion'
import './References.css'

const REFS = [
  {
    num: '01',
    authors: 'Abba, G.',
    year: '2018',
    title: 'Modeling Rocket Flight Trajectory',
    source: 'Carleton College, MTH 355 Differential Equations',
    note: 'The sole source for this project. All three governing equations, the Euler stepping method, the Saturn V parameters, and Figures 3 through 7 are taken directly from this paper. Our modifications build on top of the model Abba established here.',
  },
]

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, delay },
})

export default function References() {
  return (
    <div className="refs-page">

      <motion.div className="section-header" {...fadeUp(0)}>
        <div>
          <h2 className="section-h2">
            <span className="bracket">[</span>REFERENCES<span className="bracket">]</span>
          </h2>
          <p className="section-sub">Sources cited in this analysis</p>
        </div>
        <span className="section-tag">CITATIONS</span>
      </motion.div>

      <div className="refs-list">
        {REFS.map((r, i) => (
          <motion.div
            key={r.num}
            className="ref-item"
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.08 + i * 0.09 }}
          >
            <div className="ref-num">{r.num}</div>
            <div className="ref-body">
              <div className="ref-citation">
                <span className="ref-authors">{r.authors}</span>
                <span className="ref-year"> ({r.year}). </span>
                <span className="ref-title">{r.title}. </span>
                <span className="ref-source">{r.source}.</span>
              </div>
              <p className="ref-note">{r.note}</p>
            </div>
          </motion.div>
        ))}
      </div>

    </div>
  )
}
