import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { people } from '../data/people'
import { sendWave, onWaveBack, logEvent } from '../lib/presence'

const BackIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16112B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 18l-6-6 6-6"/>
  </svg>
)

const NOT_NOW_REASONS = ['Busy', 'Not today', 'Not them']

export default function SayHi({ appState }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const zone = location.state?.zone ?? 'campus'
  const person = people.find(p => p.id === Number(id))

  const [phase, setPhase] = useState('invite')
  const [showReasons, setShowReasons] = useState(false)
  const [selectedOpener, setSelectedOpener] = useState(null)

  useEffect(() => {
    if (phase !== 'waiting') return
    onWaveBack(() => {
      logEvent('wave_back_received', { personId: Number(id) })
      setPhase('reveal')
    })
  }, [phase, id])

  if (!person) return null

  function handleWave() {
    logEvent('wave_sent', { personId: person.id })
    sendWave(person.id)
    setPhase('waiting')
  }

  function handleTextFirst() {
    logEvent('text_first', { personId: person.id })
    navigate('/chat/1', { state: { fromNudge: true } })
  }

  function handleNotNowPick(reason) {
    logEvent('not_now', { reason, personId: person.id })
    navigate('/weekly')
  }

  function handleOpenerTap(text) {
    logEvent('opener_tapped', { text, personId: person.id })
    setSelectedOpener(text)
  }

  const openers = person.overlaps?.length >= 2 ? [
    `Aren't you in ${person.overlaps[0].location}?`,
    `I think we keep crossing at ${person.overlaps[1].location}`,
    `Hi, I'm Sophie`,
  ] : [`Hi, I'm Sophie`]

  return (
    <div className="flex-1 flex flex-col overflow-hidden" style={{ background: '#F5EBE0', position: 'relative' }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '12px 16px',
        background: '#EDEDE9', borderBottom: '1px solid #D6CCC2', flexShrink: 0,
      }}>
        <button onClick={() => navigate('/weekly')} style={{
          width: 30, height: 30, borderRadius: '50%',
          background: '#F5EBE0', border: '1px solid #D6CCC2',
          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
        }}>
          <BackIcon />
        </button>
        <p style={{ fontSize: 15, fontWeight: 600, color: '#16112B', flex: 1 }}>Say Hi</p>
      </div>

      <div className="flex-1 overflow-y-auto scrollable" style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        <AnimatePresence mode="wait">

          {/* INVITE PHASE */}
          {phase === 'invite' && (
            <motion.div key="invite"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
            >
              {/* Card */}
              <div style={{
                background: '#EDEDE9', borderRadius: 16, padding: '20px',
                border: '1px solid #D6CCC2',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                  <img src="/bear.png" alt={person.name} style={{
                    width: 52, height: 52, borderRadius: '50%', objectFit: 'cover',
                    border: '2px solid #C9906E',
                  }} />
                  <div>
                    <p style={{ fontSize: 16, fontWeight: 700, color: '#16112B' }}>{person.name}</p>
                    <p style={{ fontSize: 13, color: '#9B8C84' }}>{person.major}</p>
                  </div>
                </div>
                <p style={{ fontSize: 14, color: '#16112B', lineHeight: 1.5 }}>
                  You and {person.name} are both in <strong>{zone}</strong>
                </p>
                <p style={{ fontSize: 13, color: '#9B8C84', marginTop: 6 }}>
                  {person.crossCount} paths crossed this week
                </p>
              </div>

              {/* Wave button */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <button onClick={handleWave} style={{
                  width: '100%', padding: '14px',
                  background: '#D5BDAF', border: '1px solid #C4A898',
                  borderRadius: 14, fontSize: 15, fontWeight: 600, color: '#16112B',
                  cursor: 'pointer',
                }}>
                  Wave
                </button>
                <p style={{ textAlign: 'center', fontSize: 12, color: '#9B8C84' }}>
                  Kelly only finds out if you both wave
                </p>
              </div>

              {/* Text first */}
              <button onClick={handleTextFirst} style={{
                width: '100%', padding: '12px',
                background: 'transparent', border: '1px solid #D6CCC2',
                borderRadius: 14, fontSize: 14, fontWeight: 500, color: '#16112B',
                cursor: 'pointer',
              }}>
                Text first instead
              </button>

              {/* Not now */}
              {!showReasons ? (
                <button onClick={() => setShowReasons(true)} style={{
                  width: '100%', padding: '10px',
                  background: 'transparent', border: 'none',
                  fontSize: 13, color: '#9B8C84', cursor: 'pointer',
                }}>
                  Not now
                </button>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <p style={{ fontSize: 12, color: '#9B8C84', textAlign: 'center' }}>What's up?</p>
                  {NOT_NOW_REASONS.map(r => (
                    <button key={r} onClick={() => handleNotNowPick(r)} style={{
                      width: '100%', padding: '11px',
                      background: 'transparent', border: '1px solid #D6CCC2',
                      borderRadius: 12, fontSize: 13, color: '#16112B',
                      cursor: 'pointer',
                    }}>
                      {r}
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* WAITING PHASE */}
          {phase === 'waiting' && (
            <motion.div key="waiting"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, paddingTop: 40 }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
                <span style={{
                  width: 16, height: 16, borderRadius: '50%', background: '#34D399',
                  boxShadow: '0 0 0 4px rgba(52,211,153,0.2)',
                  animation: 'pulse 1.5s ease-in-out infinite',
                }} />
                <p style={{ fontSize: 16, fontWeight: 600, color: '#16112B' }}>Waiting for Kelly...</p>
                <p style={{ fontSize: 13, color: '#9B8C84', textAlign: 'center', maxWidth: 220 }}>
                  Kelly only finds out if you both wave
                </p>
              </div>
              <button onClick={() => {
                logEvent('wave_cancelled', { personId: person.id })
                navigate('/weekly')
              }} style={{
                padding: '10px 24px',
                background: 'transparent', border: '1px solid #D6CCC2',
                borderRadius: 12, fontSize: 13, color: '#9B8C84', cursor: 'pointer',
              }}>
                Cancel
              </button>
            </motion.div>
          )}

          {/* REVEAL PHASE */}
          {phase === 'reveal' && (
            <motion.div key="reveal"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
            >
              {/* Match card */}
              <div style={{
                background: '#EDEDE9', borderRadius: 16, padding: '24px 20px',
                border: '1px solid #D6CCC2', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
              }}>
                <img src="/bear.png" alt={person.name} style={{
                  width: 72, height: 72, borderRadius: '50%', objectFit: 'cover',
                  border: '3px solid #C9906E',
                }} />
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: 17, fontWeight: 700, color: '#16112B' }}>{person.name}</p>
                  <p style={{ fontSize: 13, color: '#9B8C84' }}>{person.major}</p>
                </div>
                <p style={{ fontSize: 14, color: '#16112B', fontWeight: 600 }}>You both waved.</p>
              </div>

              <p style={{ fontSize: 14, color: '#16112B', textAlign: 'center' }}>
                Look for <strong>{person.name}</strong>, {person.major}.
              </p>

              {/* Opener chips */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <p style={{ fontSize: 12, color: '#9B8C84', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Openers</p>
                {openers.map(text => (
                  <button key={text} onClick={() => handleOpenerTap(text)} style={{
                    padding: '10px 14px', textAlign: 'left',
                    background: selectedOpener === text ? '#D5BDAF' : '#EDEDE9',
                    border: `1px solid ${selectedOpener === text ? '#C4A898' : '#D6CCC2'}`,
                    borderRadius: 12, fontSize: 13, color: '#16112B', cursor: 'pointer',
                    transition: 'background 0.15s',
                  }}>
                    "{text}"
                  </button>
                ))}
              </div>

              {/* CTA buttons */}
              <button onClick={() => {
                logEvent('said_hi', { personId: person.id })
                setPhase('followup')
              }} style={{
                width: '100%', padding: '14px',
                background: '#D5BDAF', border: '1px solid #C4A898',
                borderRadius: 14, fontSize: 15, fontWeight: 600, color: '#16112B',
                cursor: 'pointer',
              }}>
                I said hi
              </button>
              <button onClick={() => {
                logEvent('couldnt_find', { personId: person.id })
                setPhase('followup')
              }} style={{
                width: '100%', padding: '12px',
                background: 'transparent', border: '1px solid #D6CCC2',
                borderRadius: 14, fontSize: 14, color: '#9B8C84', cursor: 'pointer',
              }}>
                Couldn't find them
              </button>
            </motion.div>
          )}

          {/* FOLLOWUP PHASE */}
          {phase === 'followup' && (
            <motion.div key="followup"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              style={{ display: 'flex', flexDirection: 'column', gap: 14 }}
            >
              <p style={{ fontSize: 17, fontWeight: 700, color: '#16112B', textAlign: 'center', marginBottom: 4 }}>
                How did it go?
              </p>
              {[
                { label: 'Said hi!', outcome: 'said_hi' },
                { label: 'Almost', outcome: 'almost' },
                { label: 'Missed them', outcome: 'missed' },
              ].map(opt => (
                <button key={opt.label} onClick={() => {
                  logEvent('followup_answer', { answer: opt.label, personId: person.id })
                  navigate('/chat/1', { state: { fromNudge: true, outcome: opt.outcome } })
                }} style={{
                  width: '100%', padding: '13px',
                  background: '#EDEDE9', border: '1px solid #D6CCC2',
                  borderRadius: 14, fontSize: 14, fontWeight: 500, color: '#16112B',
                  cursor: 'pointer',
                }}>
                  {opt.label}
                </button>
              ))}
              <button onClick={() => {
                navigate('/chat/1', { state: { fromNudge: true, outcome: null } })
              }} style={{
                width: '100%', padding: '14px', marginTop: 4,
                background: '#D5BDAF', border: '1px solid #C4A898',
                borderRadius: 14, fontSize: 15, fontWeight: 600, color: '#16112B',
                cursor: 'pointer',
              }}>
                Message Kelly
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  )
}
