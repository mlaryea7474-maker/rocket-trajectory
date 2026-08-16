import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ComposedChart, Area, XAxis, YAxis,
  CartesianGrid, ReferenceLine, ReferenceDot, Tooltip, ResponsiveContainer, Label,
} from 'recharts'
import './AfricaAdvantage.css'

const SITES = [
  { name: 'Libreville',     country: 'Gabon',         lat: 0.4,  continent: 'africa'  },
  { name: 'Kampala',        country: 'Uganda',        lat: 0.3,  continent: 'africa'  },
  { name: 'Nairobi',        country: 'Kenya',         lat: 1.3,  continent: 'africa'  },
  { name: 'Malindi',        country: 'Kenya',         lat: 3.0,  continent: 'africa'  },
  { name: 'Lagos',          country: 'Nigeria',       lat: 6.5,  continent: 'africa'  },
  { name: 'Accra',          country: 'Ghana',         lat: 7.9,  continent: 'africa'  },
  { name: 'Dakar',          country: 'Senegal',       lat: 14.7, continent: 'africa'  },
  { name: 'Kourou',         country: 'French Guiana', lat: 5.2,  continent: 'western' },
  { name: 'Cape Canaveral', country: 'USA · SpaceX',  lat: 28.5, continent: 'western' },
  { name: 'Tanegashima',    country: 'Japan',         lat: 30.4, continent: 'western' },
  { name: 'Vandenberg',     country: 'USA',           lat: 34.6, continent: 'western' },
  { name: 'Jiuquan',        country: 'China',         lat: 40.6, continent: 'western' },
  { name: 'Baikonur',       country: 'Kazakhstan',    lat: 46.0, continent: 'western' },
  { name: 'Plesetsk',       country: 'Russia',        lat: 62.8, continent: 'western' },
]

const G0  = 9.81
const ISP = 311
const M0  = 80000

function vrot(lat: number) {
  return 465.1 * Math.cos((lat * Math.PI) / 180)
}

function propellantSaved(deltaV: number) {
  return Math.round(M0 * (1 - Math.exp(-deltaV / (ISP * G0))))
}

// Smooth cosine curve data, 0.5° steps so 28.5° (Cape Canaveral) is exact
const CURVE_DATA = Array.from({ length: 181 }, (_, i) => ({
  lat: i * 0.5,
  vrot: parseFloat(vrot(i * 0.5).toFixed(2)),
}))


const BEAT = "The formula is simple. The closer to the equator, the more of Earth's rotation a rocket inherits for free. Every metre per second here is a metre per second that does not need to come from propellant."

function useStream(text: string) {
  return { display: text, done: true }
}

function useSiteStream(text: string, _key: string) {
  return text
}

function siteExplanation(site: { name: string; country: string; lat: number; continent: string }, advSpaceX: number, myVrot: number, propSaved: number): string {
  const isAfrica = site.continent === 'africa'
  const spaceXVrot = vrot(28.5)

  if (isAfrica) {
    return `${site.name}, ${site.country} sits at ${site.lat}°N, only ${site.lat.toFixed(1)} degrees from the equator. ` +
      `At this latitude Earth's rotation delivers ${myVrot.toFixed(1)} m/s of free velocity to every rocket that launches here. ` +
      `SpaceX at Cape Canaveral collects ${spaceXVrot.toFixed(1)} m/s from its 28.5° position. ` +
      `The gap is ${advSpaceX.toFixed(1)} m/s, velocity that would otherwise have to come from burning propellant. ` +
      `For an 80,000 kg rocket at Isp = 311 s, that translates to approximately ${propSaved.toLocaleString()} kg of propellant saved per launch.`
  } else {
    const behind = (-advSpaceX).toFixed(1)
    return `${site.name}, ${site.country} lies at ${site.lat}°, ${(site.lat - 28.5).toFixed(1)}° further from the equator than Cape Canaveral. ` +
      `Earth's rotation provides ${myVrot.toFixed(1)} m/s here, compared to ${spaceXVrot.toFixed(1)} m/s at the SpaceX launch site. ` +
      `That is ${behind} m/s less free velocity, meaning rockets launched from ${site.name} must burn more propellant to reach the same orbit. ` +
      `Geography imposes a permanent cost that no engine improvement can fully eliminate.`
  }
}

function ChartTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null
  const d = payload[0]?.payload
  if (!d) return null
  const site = SITES.find(s => Math.abs(s.lat - d.lat) < 0.3)
  return (
    <div className="aa-tooltip">
      <div className="aa-tip-lat">{d.lat?.toFixed(1)}° latitude</div>
      <div className="aa-tip-vrot">{d.vrot?.toFixed(1)} <span>m/s</span></div>
      {site && <div className="aa-tip-name">{site.name}, {site.country}</div>}
    </div>
  )
}

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, delay },
})


export default function AfricaAdvantage() {
  const [lat, setLat]       = useState(7.9)
  const [selected, setSelected] = useState('Accra')
  const [chartReady] = useState(true)
  const narrative = useStream(BEAT)

  function pickSite(name: string) {
    const site = SITES.find(s => s.name === name)
    if (site) { setSelected(name); setLat(site.lat) }
  }

  function onSlider(val: number) {
    setLat(val)
    const nearest = SITES.reduce((a, b) =>
      Math.abs(b.lat - val) < Math.abs(a.lat - val) ? b : a
    )
    setSelected(nearest.name)
  }

  const myVrot      = vrot(lat)
  const spacexVrot  = vrot(28.5)
  const advSpaceX   = myVrot - spacexVrot
  const propSaved   = advSpaceX > 0 ? propellantSaved(advSpaceX) : 0

  const selectedSite   = SITES.find(s => s.name === selected) || SITES[5]
  const explanationText = siteExplanation(selectedSite, advSpaceX, myVrot, propSaved)
  const siteExpl        = useSiteStream(explanationText, selected)

  // Selected site scatter point


  return (
    <div className="aa-page">

      {/* Header */}
      <motion.div className="section-header" {...fadeUp(0)}>
        <div>
          <h2 className="section-h2">
            <span className="bracket">[</span>AFRICA'S LAUNCH ADVANTAGE<span className="bracket">]</span>
          </h2>
          <p className="section-sub">Earth's rotation as free velocity · select a site or drag the slider</p>
        </div>
        <span className="section-tag">GEOGRAPHY::PHYSICS</span>
      </motion.div>

      {/* Live formula + controls */}
      <motion.div className="aa-live-card" {...fadeUp(0.05)}>
        <div className="aa-formula-header">
          <span className="chart-tag">LIVE COMPUTATION</span>
          <code className="aa-formula-eq">
            v<sub>rot</sub>({lat.toFixed(1)}°) = 465.1 × cos({lat.toFixed(1)}°) = <span className="aa-formula-result">{myVrot.toFixed(1)} m/s</span>
          </code>
        </div>

        <div className="aa-controls">
          <select
            className="aa-select"
            value={selected}
            onChange={e => pickSite(e.target.value)}
          >
            <optgroup label="── AFRICA ──">
              {SITES.filter(s => s.continent === 'africa').map(s => (
                <option key={s.name} value={s.name}>{s.name}, {s.country} · {s.lat}°N</option>
              ))}
            </optgroup>
            <optgroup label="── WESTERN / INTERNATIONAL ──">
              {SITES.filter(s => s.continent === 'western').map(s => (
                <option key={s.name} value={s.name}>{s.name}, {s.country} · {s.lat}°</option>
              ))}
            </optgroup>
          </select>

          <div className="aa-slider-wrap">
            <span className="aa-slider-label">0° Equator</span>
            <input
              type="range" min={0} max={90} step={0.1} value={lat}
              onChange={e => onSlider(parseFloat(e.target.value))}
              className="aa-slider"
            />
            <span className="aa-slider-label">90° Pole</span>
          </div>
        </div>

        {/* Live telemetry */}
        <div className="aa-telemetry">
          <div className="aa-telem-block">
            <div className="data-label">Latitude</div>
            <div className="data-value">{lat.toFixed(1)}°</div>
          </div>
          <div className="aa-telem-block">
            <div className="data-label">Rotation Boost</div>
            <div className="data-value" style={{ color: 'var(--red)' }}>{myVrot.toFixed(1)} m/s</div>
          </div>
          <div className="aa-telem-block">
            <div className="data-label">vs SpaceX [Cape Canaveral]</div>
            <div className="data-value" style={{ color: advSpaceX >= 0 ? 'var(--red)' : 'rgba(255,255,255,0.3)' }}>
              {advSpaceX >= 0 ? '+' : ''}{advSpaceX.toFixed(1)} m/s
            </div>
          </div>
          <div className="aa-telem-block">
            <div className="data-label">Prop. saved vs SpaceX</div>
            <div className="data-value" style={{ color: 'var(--red)' }}>
              {advSpaceX > 0 ? `~${propellantSaved(advSpaceX).toLocaleString()} kg` : 'n/a'}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Narrative */}
      <motion.div className="sv-beat" {...fadeUp(0.1)}>
        <p className="beat-line">
          {narrative.display}
        </p>
      </motion.div>

      {/* Chart */}
      <AnimatePresence>
        {chartReady && (
          <motion.div
            key="chart"
            className="chart-card"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="chart-label">
              <span className="chart-tag">v<sub>rot</sub>(φ) = 465.1 × cos(φ) · all sites plotted on the curve</span>
            </div>

            <div className="aa-chart-wrap">
              <ResponsiveContainer width="100%" height={320}>
                <ComposedChart data={CURVE_DATA} margin={{ top: 16, right: 24, bottom: 32, left: 8 }}>
                  <defs>
                    <linearGradient id="curveGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="rgba(220,20,60,0.18)" />
                      <stop offset="100%" stopColor="rgba(220,20,60,0)" />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.05)"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="lat"
                    type="number"
                    domain={[0, 90]}
                    tickCount={10}
                    tick={{ fontFamily: 'var(--font-mono)', fontSize: 10, fill: 'rgba(255,255,255,0.3)' }}
                    axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                    tickLine={false}
                  >
                    <Label value="Latitude (°)" position="insideBottom" offset={-18}
                      style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fill: 'rgba(255,255,255,0.25)', letterSpacing: '0.1em' }} />
                  </XAxis>

                  <YAxis
                    dataKey="vrot"
                    type="number"
                    domain={[0, 470]}
                    tickCount={6}
                    tick={{ fontFamily: 'var(--font-mono)', fontSize: 10, fill: 'rgba(255,255,255,0.3)' }}
                    axisLine={false}
                    tickLine={false}
                    width={40}
                  >
                    <Label value="m/s" angle={-90} position="insideLeft" offset={12}
                      style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fill: 'rgba(255,255,255,0.25)' }} />
                  </YAxis>


                  <Tooltip
                    content={(props: any) => <ChartTooltip {...props} />}
                    cursor={{ stroke: 'rgba(220,20,60,0.25)', strokeWidth: 1 }}
                  />

                  {/* SpaceX Cape Canaveral reference line */}
                  <ReferenceLine
                    x={28.5}
                    stroke="rgba(255,255,255,0.22)"
                    strokeDasharray="4 3"
                    label={{ value: 'SpaceX [Cape Canaveral]', position: 'insideTopRight',
                      style: { fontFamily: 'var(--font-mono)', fontSize: 9, fill: 'rgba(255,255,255,0.3)' } }}
                  />

                  {/* Selected site vertical line */}
                  <ReferenceLine
                    x={parseFloat(lat.toFixed(1))}
                    stroke="rgba(220,20,60,0.5)"
                    strokeWidth={1.5}
                  />

                  {/* Cosine curve, area fill */}
                  <Area
                    dataKey="vrot"
                    type="monotone"
                    stroke="rgba(220,20,60,0.7)"
                    strokeWidth={2}
                    fill="url(#curveGrad)"
                    dot={false}
                    activeDot={false}
                    isAnimationActive={true}
                    animationDuration={900}
                  />

                  {/* Selected site dot, moves with slider/selector */}
                  <ReferenceDot
                    x={parseFloat(lat.toFixed(1))}
                    y={parseFloat(myVrot.toFixed(2))}
                    r={7}
                    fill="var(--red)"
                    stroke="rgba(255,255,255,0.7)"
                    strokeWidth={2}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            <div className="aa-chart-legend">
              <span><span className="aa-dot selected-dot" />Selected: {selected} · {myVrot.toFixed(1)} m/s</span>
              <span><span className="aa-dot line" />SpaceX [Cape Canaveral] · 408.8 m/s</span>
              <span className="aa-legend-note">drag slider or pick site to move cursor</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Site-specific dynamic explanation */}
      <AnimatePresence mode="wait">
        {chartReady && (
          <motion.div
            key={selected}
            className="aa-site-explain"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
          >
            <div className="aa-explain-header">
              <span className="chart-tag">{selected.toUpperCase()} · {SITES.find(s => s.name === selected)?.country.toUpperCase()}</span>
              <span className="aa-explain-lat">{lat.toFixed(1)}°</span>
            </div>
            <p className="aa-explain-text">
              {siteExpl}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}
