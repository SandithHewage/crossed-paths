import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import PhoneShell from './components/PhoneShell'
import Onboarding from './screens/Onboarding'
import WeeklyPaths from './screens/WeeklyPaths'
import OverlapDetail from './screens/OverlapDetail'
import Matches from './screens/Matches'
import Messages from './screens/Messages'
import Chat from './screens/Chat'

export default function App() {
  const [appState, setAppState] = useState({ connected: {} })
  const [chats, setChats] = useState({})

  return (
    <div className="phone-wrapper">
    <PhoneShell>
      <Routes>
        <Route path="/" element={<Navigate to="/onboarding" replace />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/weekly" element={<WeeklyPaths />} />
        <Route path="/overlap/:id" element={<OverlapDetail appState={appState} setAppState={setAppState} />} />
        <Route path="/matches" element={<Matches appState={appState} />} />
        <Route path="/messages" element={<Messages appState={appState} chats={chats} />} />
        <Route path="/chat/:id" element={<Chat chats={chats} setChats={setChats} />} />
      </Routes>
    </PhoneShell>
    </div>
  )
}
