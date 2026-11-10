import { useState, useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import PhoneShell from './components/PhoneShell'
import NearbyNudge from './components/NearbyNudge'
import Onboarding from './screens/Onboarding'
import WeeklyPaths from './screens/WeeklyPaths'
import OverlapDetail from './screens/OverlapDetail'
import Matches from './screens/Matches'
import Messages from './screens/Messages'
import Chat from './screens/Chat'

function FadeIn({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
    >
      {children}
    </motion.div>
  )
}

export default function App() {
  const [appState, setAppState] = useState({ connected: {} })
  const [chats, setChats] = useState({})
  const [openToday, setOpenToday] = useState(false)
  const [nudge, setNudge] = useState({ active: false, personId: null })
  const location = useLocation()

  // Auto-trigger nudge when Kelly connects back and Sophie is open today
  useEffect(() => {
    if (openToday && appState.connected?.[1] && !nudge.active) { // eslint-disable-line
      const timer = setTimeout(() => {
        setNudge({ active: true, personId: 1 })
      }, 4000)
      return () => clearTimeout(timer)
    }
  }, [openToday, appState.connected?.[1]]) // eslint-disable-line

  return (
    <div className="phone-wrapper">
    <PhoneShell>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Navigate to="/onboarding" replace />} />
            <Route path="/onboarding" element={<FadeIn><Onboarding /></FadeIn>} />
            <Route path="/weekly" element={<FadeIn><WeeklyPaths openToday={openToday} setOpenToday={setOpenToday} /></FadeIn>} />
            <Route path="/overlap/:id" element={<FadeIn><OverlapDetail appState={appState} setAppState={setAppState} /></FadeIn>} />
            <Route path="/matches" element={<FadeIn><Matches appState={appState} /></FadeIn>} />
            <Route path="/messages" element={<FadeIn><Messages appState={appState} chats={chats} /></FadeIn>} />
            <Route path="/chat/:id" element={<FadeIn><Chat chats={chats} setChats={setChats} /></FadeIn>} />
          </Routes>
        </AnimatePresence>
        <NearbyNudge nudge={nudge} setNudge={setNudge} />
      </div>
    </PhoneShell>
    </div>
  )
}
