import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { people } from '../data/people'
import BottomNav from '../components/BottomNav'

export default function Messages({ appState, chats }) {
  const navigate = useNavigate()
  const matched = people.filter(p => appState?.connected?.[p.id])

  return (
    <div className="flex-1 flex flex-col overflow-hidden" style={{ background: '#F5EBE0' }}>
      <div className="flex-1 overflow-y-auto scrollable">
        <div style={{ padding: '20px 20px 4px' }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: '#16112B', letterSpacing: '-0.4px' }}>Messages</h2>
        </div>

        {matched.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 80, padding: '0 32px', textAlign: 'center' }}>
            <div style={{
              width: 56, height: 56, borderRadius: '50%',
              background: '#E3D5CA', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14,
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16112B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
            </div>
            <p style={{ fontSize: 15, fontWeight: 600, color: '#16112B' }}>No messages yet</p>
            <p style={{ fontSize: 13, color: '#9B8C84', marginTop: 6, lineHeight: 1.5 }}>
              Match with someone from your paths to start a conversation.
            </p>
          </div>
        ) : (
          <div style={{ padding: '12px 20px', display: 'flex', flexDirection: 'column', gap: 2 }}>
            {matched.map((person, i) => {
              const history = chats?.[person.id] ?? []
              const last = history[history.length - 1]
              return (
                <motion.button key={person.id}
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  onClick={() => navigate(`/chat/${person.id}`)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                    background: '#EDEDE9', borderRadius: 14, padding: '12px 14px',
                    border: '1px solid #D6CCC2', cursor: 'pointer', textAlign: 'left',
                  }}
                >
                  {person.profileImage ? (
                    <img
                      src={person.profileImage}
                      alt={person.name}
                      style={{
                        width: 42, height: 42, borderRadius: '50%',
                        objectFit: 'cover', flexShrink: 0, border: '1px solid #D6CCC2',
                      }}
                    />
                  ) : (
                    <div style={{
                      width: 42, height: 42, borderRadius: '50%', background: person.avatarBg,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 13, fontWeight: 700, color: person.avatarText, flexShrink: 0,
                    }}>
                      {person.initials}
                    </div>
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 14, fontWeight: 600, color: '#16112B' }}>{person.name}</p>
                    <p style={{ fontSize: 12, color: '#9B8C84', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {last ? last.text : 'Say hi!'}
                    </p>
                  </div>
                  <span style={{ fontSize: 11, color: '#D5BDAF', flexShrink: 0 }}>{last?.time ?? 'Today'}</span>
                </motion.button>
              )
            })}
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  )
}
