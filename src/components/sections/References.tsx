import { motion } from 'framer-motion'
import './References.css'

const REFS = [
  {
    num: '01',
    authors: 'Abba, G.',
    year: '2018',
    title: 'Modeling Rocket Flight Trajectory',
    source: 'Carleton College, MTH 355 Differential Equations',
    note: 'The primary source. All three governing equations, the Euler stepping method, the Saturn V parameters, and Figures 3 through 7 are taken directly from this paper.',
  },
  {
    num: '02',
    authors: 'NASA',
    year: '1969',
    title: 'Saturn V Launch Vehicle Flight Evaluation Report — AS-506 Apollo 11 Mission',
    source: 'NASA Technical Report MPR-SAT-FE-69-9',
    note: 'Source for Saturn V physical parameters: launch mass 2,900,000 kg, liftoff thrust 34,000,000 N, propellant flow rate 13,000 kg/s.',
  },
  {
    num: '03',
    authors: 'Press, W. H., Teukolsky, S. A., Vetterling, W. T., Flannery, B. P.',
    year: '2007',
    title: 'Numerical Recipes: The Art of Scientific Computing (3rd ed.)',
    source: 'Cambridge University Press',
    note: 'Reference for Runge-Kutta methods including the RK4 algorithm used in our modifications. Chapter 17 covers ordinary differential equation solvers.',
  },
  {
    num: '04',
    authors: 'Burden, R. L., Faires, J. D.',
    year: '2010',
    title: 'Numerical Analysis (9th ed.)',
    source: 'Brooks/Cole, Cengage Learning',
    note: 'Standard reference for Euler\'s method and its error analysis, used to verify our claim that RK4 reduces local truncation error from O(Δt) to O(Δt⁴).',
  },
  {
    num: '05',
    authors: 'U.S. Standard Atmosphere',
    year: '1976',
    title: 'U.S. Standard Atmosphere, 1976',
    source: 'NOAA, NASA, USAF — Document NOAA-S/T-76-1562',
    note: 'Basis for the exponential atmospheric density model ρ(h) = ρ₀ · exp(−h / H) with scale height H = 8,500 m used in the drag calculation.',
  },
  {
    num: '06',
    authors: 'Newton, I.',
    year: '1687',
    title: 'Philosophiæ Naturalis Principia Mathematica',
    source: 'Royal Society',
    note: 'Source for the inverse-square law of gravitation g(h) = g₀(R / (R + h))² applied in our variable-gravity modification.',
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
