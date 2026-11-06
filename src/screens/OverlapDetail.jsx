import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, useParams } from 'react-router-dom'
import { people } from '../data/people'
import BottomNav from '../components/BottomNav'

function ScoreArc({ score }) {
  const size = 100
  const cx = 50, cy = 50, r = 38
  const circ = 2 * Math.PI * r
  const offset = circ - (score / 100) * circ

  return (
    <div style={{ position: 'relative', width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ position: 'absolute', transform: 'rotate(-90deg)' }}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#E3D5CA" strokeWidth="9"/>
        <circle cx={cx} cy={cy} r={r} fill="none"
          stroke="#D5BDAF" strokeWidth="9"
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        />
      </svg>
      <div style={{ textAlign: 'center', zIndex: 1 }}>
        <p style={{ fontSize: 22, fontWeight: 700, color: '#16112B', lineHeight: 1 }}>{score}</p>
        <p style={{ fontSize: 10, color: '#9B8C84', marginTop: 2, fontWeight: 500 }}>score</p>
      </div>
    </div>
  )
}

const BackIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16112B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 18l-6-6 6-6"/>
  </svg>
)

export default function OverlapDetail({ appState, setAppState }) {
  const { id } = useParams()
  const person = people.find(p => p.id === Number(id))
  const navigate = useNavigate()
  const [connected, setConnected] = useState(appState?.connected?.[person?.id])
  const [showMatch, setShowMatch] = useState(false)
  const [opener, setOpener] = useState("hey! i think i've seen you around geisel a few times lol, glad we matched")

  if (!person) return null

  function handleConnect() {
    setConnected(true)
    setAppState(prev => ({ ...prev, connected: { ...prev.connected, [person.id]: true } }))
    if (person.id === 1) setTimeout(() => setShowMatch(true), 500)
  }

  const freq = Math.round(person.score * 0.4)
  const cons = Math.round(person.score * 0.35)
  const sched = person.score - freq - cons

  return (
    <div className="flex-1 flex flex-col overflow-hidden" style={{ background: '#F5EBE0', position: 'relative', zIndex: 0 }}>
      <div className="flex-1 overflow-y-auto scrollable">

        <div className="flex items-center gap-3 px-5 pt-5 pb-3">
          <button onClick={() => navigate(-1)} style={{
            width: 32, height: 32, borderRadius: '50%',
            background: '#EDEDE9', border: '1px solid #D6CCC2',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          }}>
            <BackIcon />
          </button>
          <p style={{ fontSize: 15, fontWeight: 600, color: '#16112B' }}>Path Overlap</p>
        </div>

        <div className="px-5">
          <div style={{ background: '#EDEDE9', borderRadius: 16, padding: '16px', border: '1px solid #D6CCC2' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 48, height: 48, borderRadius: 12, background: person.avatarBg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14, fontWeight: 700, color: person.avatarText, flexShrink: 0,
              }}>
                {person.initials}
              </div>
              <div>
                <p style={{ fontSize: 15, fontWeight: 600, color: '#16112B' }}>{person.major}</p>
                <p style={{ fontSize: 13, color: '#9B8C84' }}>{person.year}</p>
              </div>
              <div style={{ marginLeft: 'auto' }}>
                <span style={{
                  fontSize: 12, color: '#6B5C55', background: '#F5EBE0',
                  padding: '4px 10px', borderRadius: 999, fontWeight: 500,
                  border: '1px solid #D6CCC2', whiteSpace: 'nowrap',
                }}>
                  {person.crossCount}× this week
                </span>
              </div>
            </div>

            <div style={{ height: 1, background: '#D6CCC2', margin: '14px 0' }} />

            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <ScoreArc score={person.score} />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { label: 'Frequency', value: freq, max: 40 },
                  { label: 'Consistency', value: cons, max: 35 },
                  { label: 'Schedule', value: sched, max: 25 },
                ].map((row) => (
                  <div key={row.label}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 11, color: '#9B8C84' }}>{row.label}</span>
                      <span style={{ fontSize: 11, fontWeight: 600, color: '#6B5C55' }}>{row.value}/{row.max}</span>
                    </div>
                    <div style={{ height: 4, background: '#E3D5CA', borderRadius: 99 }}>
                      <div style={{ height: '100%', borderRadius: 99, background: '#D5BDAF', width: `${(row.value / row.max) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="px-5 mt-4">
          <p style={{ fontSize: 13, fontWeight: 600, color: '#16112B', marginBottom: 8 }}>Where you overlap</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {person.overlaps.map((o, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.08 + i * 0.07 }}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  background: '#EDEDE9', borderRadius: 12, padding: '12px 14px',
                  border: '1px solid #D6CCC2',
                }}
              >
                <div>
                  <p style={{ fontSize: 13.5, fontWeight: 600, color: '#16112B' }}>{o.location}</p>
                  <p style={{ fontSize: 12, color: '#9B8C84', marginTop: 1 }}>{o.days}</p>
                </div>
                <span style={{
                  fontSize: 12, fontWeight: 500, color: '#16112B',
                  background: '#E3D5CA', padding: '4px 10px', borderRadius: 999,
                }}>
                  {o.time}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="px-5 mt-5 mb-6">
          {connected ? (
            person.id === 1 ? (
              <button onClick={() => navigate(`/chat/${person.id}`)} style={{
                width: '100%', padding: '14px 0', borderRadius: 14,
                background: '#D5BDAF', color: '#16112B',
                fontSize: 14, fontWeight: 600, border: '1px solid #D6CCC2', cursor: 'pointer',
              }}>
                Message Kelly
              </button>
            ) : (
              <div style={{
                width: '100%', padding: '14px 0', borderRadius: 14,
                background: '#E3D5CA', color: '#16112B',
                fontSize: 14, fontWeight: 600, textAlign: 'center',
                border: '1px solid #D6CCC2',
              }}>
                Request sent
              </div>
            )
          ) : (
            <button onClick={handleConnect} style={{
              width: '100%', padding: '15px 0', borderRadius: 14,
              background: '#D5BDAF', color: '#16112B',
              fontSize: 15, fontWeight: 600, border: '1px solid #D6CCC2', cursor: 'pointer',
            }}>
              Connect
            </button>
          )}
          <p style={{ textAlign: 'center', fontSize: 12, color: '#9B8C84', marginTop: 8 }}>
            They'll only see your name if they connect too.
          </p>
        </div>
      </div>

      <AnimatePresence>
        {showMatch && (
          <div
            onClick={() => setShowMatch(false)}
            style={{
              position: 'absolute', inset: 0,
              background: 'rgba(44,35,32,0.35)',
              display: 'flex', alignItems: 'flex-end', zIndex: 20,
            }}
          >
            <motion.div
              onClick={e => e.stopPropagation()}
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 36, mass: 0.8 }}
              style={{ width: '100%', background: '#F5EBE0', borderRadius: '24px 24px 0 0', padding: '28px 24px 36px' }}
            >
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
                <div style={{ position: 'relative', width: 96, height: 56 }}>
                  <img
                    src="/kitty.png"
                    alt="Sophie"
                    style={{
                      position: 'absolute', left: 0, top: 0, width: 56, height: 56, borderRadius: '50%',
                      objectFit: 'cover', border: '2px solid #D4A574',
                    }}
                  />
                  <img
                    src="/bear.png"
                    alt={person.name}
                    style={{
                      position: 'absolute', right: 0, top: 0, width: 56, height: 56, borderRadius: '50%',
                      objectFit: 'cover', border: '2px solid #C9906E',
                    }}
                  />
                </div>
              </div>

              <p style={{ textAlign: 'center', fontSize: 11, fontWeight: 600, color: '#9B8C84', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>
                It's a match
              </p>
              <h2 style={{ textAlign: 'center', fontSize: 22, fontWeight: 700, color: '#16112B', letterSpacing: '-0.3px', marginBottom: 4 }}>
                Meet Kelly
              </h2>
              <p style={{ textAlign: 'center', fontSize: 13, color: '#9B8C84', marginBottom: 18 }}>
                {person.major} · {person.year}
              </p>

              <div style={{ background: '#EDEDE9', borderRadius: 12, padding: '12px 14px', marginBottom: 18, border: '1px solid #D6CCC2' }}>
                <p style={{ fontSize: 11, fontWeight: 600, color: '#9B8C84', marginBottom: 6 }}>Suggested opener</p>
                <textarea
                  value={opener}
                  onChange={e => setOpener(e.target.value)}
                  style={{
                    width: '100%', fontSize: 13.5, color: '#16112B', lineHeight: 1.5,
                    background: 'transparent', border: 'none',
                    outline: 'none', resize: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
                    minHeight: 56,
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  onClick={() => { setShowMatch(false); navigate('/chat/1', { state: { opener } }) }}
                  style={{
                    flex: 1, padding: '13px 0', borderRadius: 12,
                    background: '#D5BDAF', color: '#16112B',
                    fontSize: 14, fontWeight: 600, border: '1px solid #D6CCC2', cursor: 'pointer',
                  }}
                >
                  Send a message
                </button>
                <button
                  onClick={() => setShowMatch(false)}
                  style={{
                    padding: '13px 20px', borderRadius: 12,
                    background: '#EDEDE9', color: '#6B5C55',
                    fontSize: 14, fontWeight: 600, border: '1px solid #D6CCC2', cursor: 'pointer',
                  }}
                >
                  Later
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <BottomNav />
    </div>
  )
}
