import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Background from './components/Background'
import LoadingScreen from './components/LoadingScreen'
import Sidebar, { type Section } from './components/Sidebar'
import Header from './components/Header'
import Introduction from './components/sections/Introduction'
import OdeSystem from './components/sections/OdeSystem'
import Projectile from './components/sections/Projectile'
import SaturnV from './components/sections/SaturnV'
import ModelExplanation from './components/sections/ModelExplanation'
import MatlabCode from './components/sections/MatlabCode'
import Placeholder from './components/sections/Placeholder'
import './App.css'

type Theme = 'light' | 'dark'

export default function App() {
  const [loading, setLoading] = useState(true)
  const [activeSection, setActiveSection] = useState<Section>('introduction')
  const [theme, setTheme] = useState<Theme>('light')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light')

  return (
    <>
      <AnimatePresence>
        {loading && (
          <motion.div key="loading" style={{ position: 'fixed', inset: 0, zIndex: 9999 }}>
            <LoadingScreen onComplete={() => setLoading(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {!loading && (
        <div className="dashboard-page">
          <Background />
          <div className="dashboard-container">
            <Sidebar activeSection={activeSection} onNavigate={setActiveSection} />
            <main className="main-content">
              <Header theme={theme} onToggleTheme={toggleTheme} />
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSection}
                  className="section-content"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {activeSection === 'introduction' && <Introduction />}
                  {activeSection === 'ode-system' && <OdeSystem />}
                  {activeSection === 'projectile' && <Projectile />}
                  {activeSection === 'saturn-v' && <SaturnV />}
                  {activeSection === 'model' && <ModelExplanation />}
                  {activeSection === 'references' && <MatlabCode />}
                  {activeSection !== 'introduction' && activeSection !== 'ode-system' && activeSection !== 'projectile' && activeSection !== 'saturn-v' && activeSection !== 'model' && activeSection !== 'references' && <Placeholder id={activeSection} />}
                </motion.div>
              </AnimatePresence>
            </main>
          </div>
        </div>
      )}
    </>
  )
}
