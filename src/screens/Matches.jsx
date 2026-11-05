import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { people } from '../data/people'
import BottomNav from '../components/BottomNav'

export default function Matches({ appState }) {
  const navigate = useNavigate()
  const matched = people.filter(p => appState?.connected?.[p.id])

  return (
    <div className="flex-1 flex flex-col overflow-hidden" style={{ background: '#F5EBE0' }}>
      <div className="flex-1 overflow-y-auto scrollable">
        <div style={{ padding: '20px 20px 4px' }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: '#16112B', letterSpacing: '-0.4px' }}>Matches</h2>
          <p style={{ fontSize: 13, color: '#9B8C84', marginTop: 2 }}>Mutual connections this week</p>
        </div>

        {matched.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 80, padding: '0 32px', textAlign: 'center' }}>
            <div style={{
              width: 56, height: 56, borderRadius: '50%',
              background: '#E3D5CA', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14,
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16112B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </div>
            <p style={{ fontSize: 15, fontWeight: 600, color: '#16112B' }}>No matches yet</p>
            <p style={{ fontSize: 13, color: '#9B8C84', marginTop: 6, lineHeight: 1.5 }}>
              Connect with someone from your paths and wait for them to connect back.
            </p>
            <button onClick={() => navigate('/weekly')} style={{
              marginTop: 20, padding: '11px 24px', borderRadius: 12,
              background: '#D5BDAF', color: '#16112B',
              fontSize: 14, fontWeight: 600, border: '1px solid #D6CCC2', cursor: 'pointer',
            }}>
              View your paths
            </button>
          </div>
        ) : (
          <div style={{ padding: '12px 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {matched.map((person, i) => (
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
                      width: 40, height: 40, borderRadius: '50%',
                      objectFit: 'cover', flexShrink: 0, border: '1px solid #D6CCC2',
                    }}
                  />
                ) : (
                  <div style={{
                    width: 40, height: 40, borderRadius: '50%', background: person.avatarBg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 20, flexShrink: 0,
                  }}>
                    😊
                  </div>
                )}
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: '#16112B' }}>{person.name}</p>
                  <p style={{ fontSize: 12, color: '#9B8C84' }}>{person.major} · {person.year}</p>
                </div>
                <span style={{
                  fontSize: 11, fontWeight: 600, color: '#6B5C55',
                  background: '#E3D5CA', padding: '3px 10px', borderRadius: 999,
                }}>
                  Matched
                </span>
              </motion.button>
            ))}
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  )
}
