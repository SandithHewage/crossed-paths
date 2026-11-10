import { useState, useEffect, useRef } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import PhoneShell from './components/PhoneShell'
import SayHiBanner from './components/SayHiBanner'
import Onboarding from './screens/Onboarding'
import WeeklyPaths from './screens/WeeklyPaths'
import OverlapDetail from './screens/OverlapDetail'
import Matches from './screens/Matches'
import Messages from './screens/Messages'
import Chat from './screens/Chat'
import SayHi from './screens/SayHi'
import Log from './screens/Log'
import { logEvent } from './lib/presence'

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
  const [zone, setZone] = useState(null)
  const [banner, setBanner] = useState(null)
  const bannerFiredRef = useRef(false)
  const location = useLocation()

  // Fire banner ~10-14s after Kelly connects, only once
  useEffect(() => {
    if (!openToday || !appState.connected?.[1] || bannerFiredRef.current) return
    const delay = 10000 + Math.random() * 4000
    const t = setTimeout(() => {
      bannerFiredRef.current = true
      const bannerZone = zone || 'Geisel Library'
      logEvent('banner_shown', { personId: 1, zone: bannerZone })
      setBanner({ personId: 1, zone: bannerZone })
    }, delay)
    return () => clearTimeout(t)
  }, [openToday, appState.connected?.[1]]) // eslint-disable-line

  return (
    <div className="phone-wrapper">
    <PhoneShell>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Navigate to="/onboarding" replace />} />
            <Route path="/onboarding" element={<FadeIn><Onboarding /></FadeIn>} />
            <Route path="/weekly" element={<FadeIn><WeeklyPaths openToday={openToday} setOpenToday={setOpenToday} zone={zone} setZone={setZone} /></FadeIn>} />
            <Route path="/overlap/:id" element={<FadeIn><OverlapDetail appState={appState} setAppState={setAppState} /></FadeIn>} />
            <Route path="/matches" element={<FadeIn><Matches appState={appState} /></FadeIn>} />
            <Route path="/messages" element={<FadeIn><Messages appState={appState} chats={chats} /></FadeIn>} />
            <Route path="/chat/:id" element={<FadeIn><Chat chats={chats} setChats={setChats} /></FadeIn>} />
            <Route path="/sayhi/:id" element={<FadeIn><SayHi appState={appState} zone={zone} /></FadeIn>} />
            <Route path="/log" element={<Log />} />
          </Routes>
        </AnimatePresence>
        <SayHiBanner banner={banner} setBanner={setBanner} />
      </div>
    </PhoneShell>
    </div>
  )
}
