import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import PhoneShell from './components/PhoneShell'
import NearbyNudge from './components/NearbyNudge'
import Onboarding from './screens/Onboarding'
import WeeklyPaths from './screens/WeeklyPaths'
import OverlapDetail from './screens/OverlapDetail'
import Matches from './screens/Matches'
import Messages from './screens/Messages'
import Chat from './screens/Chat'

export default function App() {
  const [appState, setAppState] = useState({ connected: {} })
  const [chats, setChats] = useState({})
  const [openToday, setOpenToday] = useState(false)
  const [nudge, setNudge] = useState({ active: false, personId: null, phase: 'nudge' })

  // Auto-trigger nudge when Kelly connects back and Sophie is open today
  useEffect(() => {
    if (openToday && appState.connected?.[1] && !nudge.active) {
      const timer = setTimeout(() => {
        setNudge({ active: true, personId: 1, phase: 'nudge' })
      }, 4000)
      return () => clearTimeout(timer)
    }
  }, [openToday, appState.connected?.[1]]) // eslint-disable-line

  return (
    <div className="phone-wrapper">
    <PhoneShell>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Routes>
          <Route path="/" element={<Navigate to="/onboarding" replace />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/weekly" element={<WeeklyPaths openToday={openToday} setOpenToday={setOpenToday} />} />
          <Route path="/overlap/:id" element={<OverlapDetail appState={appState} setAppState={setAppState} />} />
          <Route path="/matches" element={<Matches appState={appState} />} />
          <Route path="/messages" element={<Messages appState={appState} chats={chats} />} />
          <Route path="/chat/:id" element={<Chat chats={chats} setChats={setChats} />} />
        </Routes>
        <NearbyNudge nudge={nudge} setNudge={setNudge} />
      </div>
    </PhoneShell>
    </div>
  )
}
