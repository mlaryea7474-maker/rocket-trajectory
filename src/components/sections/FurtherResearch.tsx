import { motion } from 'framer-motion'
import './FurtherResearch.css'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, delay },
})

const BEAT = "We took Abba's model as far as we could inside a web page. But there is still plenty we left out. Both Abba and us made shortcuts to keep the maths manageable. Here are the four biggest ones we would open up next, if we had more time. Each of them keeps the same idea of three equations changing together. They just add more physics or a smarter way to step through time."

const DIRECTIONS = [
  {
    tag: '01',
    title: 'Let the rocket tip over instead of going straight up',
    body:
      "A real Saturn V does not fly straight up. Shortly after launch it tips slightly to the side and lets gravity pull it into a curve, gradually turning vertical speed into horizontal speed. This is what actually gets a rocket into orbit. To model it, we would add a new variable, the tilt angle, and a new equation for how that angle changes over time. The three equations would become five, and the flight would end sideways in space instead of upside down over the ocean.",
    difficulty: 'Adds two more equations',
  },
  {
    tag: '02',
    title: 'Break the Saturn V into its three real stages',
    body:
      "Abba treated the Saturn V as if it were one big engine burning for 150 seconds straight. In real life it was three separate rockets stacked on top of each other. The first stage burned for 168 seconds, then dropped off. The second stage lit up, burned for six minutes, and dropped off. Then the third stage finished the job. Modelling that means the mass suddenly jumps down at each separation, and the thrust and burn rate change too, which turns a smooth simulation into three connected ones.",
    difficulty: 'Makes the mass equation switch in pieces',
  },
  {
    tag: '03',
    title: 'Let thrust change with height too',
    body:
      "Engines produce more thrust in space than at sea level. It happens because at ground level the air outside the nozzle pushes back against the exhaust, so some of the engine's push is wasted. As the rocket climbs and the air thins, that resistance disappears and the same engine gets stronger. Adding this into the model links the atmosphere to the thrust term and makes the acceleration curve rise a bit through the flight in a way Abba's model cannot capture.",
    difficulty: 'Links the air to the engine',
  },
  {
    tag: '04',
    title: 'Let the solver choose its own step size',
    body:
      "Right now our RK4 takes the same size step for the entire flight. But some parts of the flight are calm and easy to simulate, and other parts, like engine cutoff or stage separation, need much smaller steps to stay accurate. A smarter solver called Dormand-Prince (this is what MATLAB uses for its ode45) checks its own error at every step and shrinks or grows the step size to match. Same accuracy, less wasted work.",
    difficulty: 'A solver that adjusts as it goes',
  },
]

export default function FurtherResearch() {
  return (
    <div className="fr-page">

      {/* Header */}
      <motion.div className="section-header" {...fadeUp(0)}>
        <div>
          <h2 className="section-h2">
            <span className="bracket">[</span>FURTHER RESEARCH<span className="bracket">]</span>
          </h2>
          <p className="section-sub">What we would do next if we had more time: four ways this model could grow</p>
        </div>
        <span className="section-tag">WHAT WE WOULD DO NEXT</span>
      </motion.div>

      {/* Opening beat */}
      <motion.div className="fr-beat" {...fadeUp(0.05)}>
        <p className="beat-line">{BEAT}</p>
      </motion.div>

      {/* Directions */}
      <div className="fr-list">
        {DIRECTIONS.map((d, i) => (
          <motion.div
            key={d.tag}
            className="fr-item"
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + i * 0.1 }}
          >
            <div className="fr-item-head">
              <span className="fr-item-num">{d.tag}</span>
              <div className="fr-item-title-row">
                <h3 className="fr-item-title">{d.title}</h3>
                <span className="fr-item-diff">{d.difficulty}</span>
              </div>
            </div>
            <p className="fr-item-body">{d.body}</p>
          </motion.div>
        ))}
      </div>

      {/* Closing note */}
      <motion.div className="fr-close" {...fadeUp(0.55)}>
        <span className="section-tag">TO CLOSE</span>
        <p className="beat-line" style={{ marginTop: '0.5rem' }}>
          Every one of these next steps keeps the same idea Abba started with. Write down what is
          changing with time. Break time into small steps. Solve one small step at a time. The
          equations get longer, the physics gets richer, and the solver has to keep up, but the
          shape of the problem never really changes. That is what studying differential equations
          means: once you know the pattern, everything else is just adding more of it.
        </p>
      </motion.div>

    </div>
  )
}
