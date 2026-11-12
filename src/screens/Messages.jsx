import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { people } from '../data/people'
import BottomNav from '../components/BottomNav'

export default function Messages({ appState, chats }) {
  const navigate = useNavigate()
  const matched = people.filter(p => appState?.connected?.[p.id])
  const [selected, setSelected] = useState(null)

  return (
    <div className="flex-1 flex flex-col overflow-hidden" style={{ background: '#F5EBE0', position: 'relative' }}>
      <div className="flex-1 overflow-y-auto scrollable">
        <div style={{ padding: '20px 20px 4px' }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: '#9B8C84', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Connections</p>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: '#16112B', letterSpacing: '-0.4px', marginTop: 2 }}>Matches</h2>
        </div>

        {matched.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 80, padding: '0 32px', textAlign: 'center' }}>
            <div style={{
              width: 56, height: 56, borderRadius: '50%',
              background: '#E3D5CA', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14,
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16112B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <path d="M8 14s1.5 2 4 2 4-2 4-2" strokeLinecap="round"/>
                <circle cx="9" cy="10" r="1" fill="#16112B" stroke="none"/>
                <circle cx="15" cy="10" r="1" fill="#16112B" stroke="none"/>
              </svg>
            </div>
            <p style={{ fontSize: 15, fontWeight: 600, color: '#16112B' }}>No matches yet</p>
            <p style={{ fontSize: 13, color: '#9B8C84', marginTop: 6, lineHeight: 1.5 }}>
              Open to saying hi with someone from your paths to match.
            </p>
          </div>
        ) : (
          <div style={{ padding: '12px 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {matched.map((person, i) => (
              <motion.button key={person.id}
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                onClick={() => setSelected(person)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                  background: '#EDEDE9', borderRadius: 14, padding: '14px',
                  border: '1px solid #D6CCC2', cursor: 'pointer', textAlign: 'left',
                }}
              >
                <img
                  src="/bear.png"
                  alt={person.name}
                  style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: '2px solid #C9906E' }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: '#16112B' }}>{person.name}</p>
                  <p style={{ fontSize: 12, color: '#9B8C84', marginTop: 2 }}>{person.major}</p>
                  {person.traits && (
                    <p style={{ fontSize: 11, color: '#B5A99F', marginTop: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {person.traits.join(' · ')}
                    </p>
                  )}
                </div>
                <div style={{ flexShrink: 0, textAlign: 'right' }}>
                  <span style={{
                    fontSize: 11, color: '#6B5C55', background: '#F5EBE0',
                    padding: '3px 9px', borderRadius: 999, border: '1px solid #D6CCC2',
                    whiteSpace: 'nowrap',
                  }}>
                    {person.crossCount}x
                  </span>
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </div>

      {/* Detail bottom sheet */}
      <AnimatePresence>
        {selected && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
              style={{ position: 'absolute', inset: 0, background: 'rgba(44,35,32,0.35)', zIndex: 20 }}
            />
            <motion.div
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 36, mass: 0.8 }}
              style={{
                position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 30,
                background: '#F5EBE0', borderRadius: '24px 24px 0 0',
                padding: '28px 24px 36px',
                maxHeight: '80%', overflowY: 'auto',
                scrollbarWidth: 'none',
              }}
            >
              {/* Handle */}
              <div style={{ width: 36, height: 4, borderRadius: 999, background: '#D6CCC2', margin: '0 auto 20px' }} />

              {/* Avatar + name */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 20 }}>
                <img
                  src="/bear.png"
                  alt={selected.name}
                  style={{ width: 72, height: 72, borderRadius: '50%', objectFit: 'cover', border: '3px solid #C9906E', marginBottom: 12 }}
                />
                <p style={{ fontSize: 20, fontWeight: 700, color: '#16112B', letterSpacing: '-0.3px' }}>{selected.name}</p>
                <p style={{ fontSize: 13, color: '#9B8C84', marginTop: 3 }}>{selected.major} · {selected.year}</p>
                <p style={{ marginTop: 10, fontSize: 13, color: '#9B8C84' }}>
                  <span style={{ fontWeight: 700, color: '#16112B' }}>{selected.crossCount}</span> paths crossed this week
                </p>
              </div>

              {/* Traits */}
              {selected.traits && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center', marginBottom: 20 }}>
                  {selected.traits.map((t, i) => (
                    <span key={i} style={{
                      fontSize: 12, color: '#6B5C55',
                      background: '#EDEDE9', border: '1px solid #D6CCC2',
                      borderRadius: 999, padding: '5px 12px',
                    }}>
                      {t}
                    </span>
                  ))}
                </div>
              )}

              {/* Overlaps */}
              <p style={{ fontSize: 12, fontWeight: 600, color: '#16112B', marginBottom: 8, letterSpacing: '0.03em' }}>Where you cross paths</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 24 }}>
                {selected.overlaps.map((o, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    background: '#EDEDE9', borderRadius: 12, padding: '10px 14px',
                    border: '1px solid #D6CCC2',
                  }}>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 600, color: '#16112B' }}>{o.location}</p>
                      <p style={{ fontSize: 11, color: '#9B8C84', marginTop: 1 }}>{o.days}</p>
                    </div>
                    <span style={{ fontSize: 12, color: '#6B5C55', background: '#F5EBE0', padding: '3px 10px', borderRadius: 999, border: '1px solid #D6CCC2' }}>
                      {o.time}
                    </span>
                  </div>
                ))}
              </div>

              {/* Message button */}
              <button
                onClick={() => { setSelected(null); navigate(`/chat/${selected.id}`) }}
                style={{
                  width: '100%', padding: '14px 0', borderRadius: 14,
                  background: '#D5BDAF', color: '#16112B',
                  fontSize: 15, fontWeight: 600, border: '1px solid #C4A898', cursor: 'pointer',
                }}
              >
                Message {selected.name.split(' ')[0]}
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <BottomNav />
    </div>
  )
}
