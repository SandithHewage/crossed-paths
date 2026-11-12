import { useState } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import PhoneShell from './components/PhoneShell'
import SayHiBanner from './components/SayHiBanner'
import Onboarding from './screens/Onboarding'
import WeeklyPaths from './screens/WeeklyPaths'
import OverlapDetail from './screens/OverlapDetail'
import Messages from './screens/Messages'
import Chat from './screens/Chat'
import SayHi from './screens/SayHi'
import Log from './screens/Log'
import Map from './screens/Map'

function FadeIn({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
      style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
    >
      {children}
    </motion.div>
  )
}

export default function App() {
  const [appState, setAppState] = useState({ connected: {} })
  const [chats, setChats] = useState({})
  const [openToday] = useState(true)
  const [zone, setZone] = useState(null)
  const [banner, setBanner] = useState(null)
  const [pingSeen, setPingSeen] = useState(false)
  const location = useLocation()

  return (
    <div className="phone-wrapper">
    <PhoneShell>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Navigate to="/onboarding" replace />} />
            <Route path="/onboarding" element={<FadeIn><Onboarding /></FadeIn>} />
            <Route path="/weekly" element={<FadeIn><WeeklyPaths zone={zone} setZone={setZone} /></FadeIn>} />
            <Route path="/overlap/:id" element={<FadeIn><OverlapDetail appState={appState} setAppState={setAppState} /></FadeIn>} />
            <Route path="/messages" element={<FadeIn><Messages appState={appState} chats={chats} /></FadeIn>} />
            <Route path="/chat/:id" element={<FadeIn><Chat chats={chats} setChats={setChats} /></FadeIn>} />
            <Route path="/sayhi/:id" element={<FadeIn><SayHi appState={appState} zone={zone} setPingSeen={setPingSeen} /></FadeIn>} />
            <Route path="/map" element={<FadeIn><Map appState={appState} zone={zone} setBanner={setBanner} pingSeen={pingSeen} setPingSeen={setPingSeen} /></FadeIn>} />
            <Route path="/log" element={<Log />} />
          </Routes>
        </AnimatePresence>
        <SayHiBanner banner={banner} setBanner={setBanner} />
      </div>
    </PhoneShell>
    </div>
  )
}
