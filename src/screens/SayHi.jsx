import { useState, useEffect } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { people } from '../data/people'
import { sendWave, onWaveBack, logEvent } from '../lib/presence'

const BackIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16112B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 18l-6-6 6-6"/>
  </svg>
)

const NOT_NOW_REASONS = ['Busy', 'Not today', 'Not them']

export default function SayHi({ appState, setPingSeen }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const zone = location.state?.zone ?? 'campus'
  const person = people.find(p => p.id === Number(id))

  const [phase, setPhase] = useState('invite')
  const [showReasons, setShowReasons] = useState(false)

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

  const firstName = person.name.split(' ')[0]

  return (
    <div className="flex-1 flex flex-col overflow-hidden" style={{ background: '#F5EBE0' }}>
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

      {/* Content area — visuals only, no buttons */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>

        {/* INVITE content */}
        {phase === 'invite' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '36px 20px 20px' }}>
            <div style={{ position: 'relative' }}>
              <img src="/bear.png" alt={person.name} style={{
                width: 88, height: 88, borderRadius: '50%', objectFit: 'cover',
                border: '3px solid #C9906E',
              }} />
              <span style={{
                position: 'absolute', bottom: 2, right: 2,
                width: 16, height: 16, borderRadius: '50%',
                background: '#34D399', border: '2.5px solid #F5EBE0',
              }} />
            </div>
            <p style={{ fontSize: 20, fontWeight: 700, color: '#16112B', marginTop: 14 }}>{person.name}</p>
            <p style={{ fontSize: 13, color: '#9B8C84', marginTop: 3 }}>{person.major}</p>

            <div style={{
              display: 'flex', alignItems: 'center', gap: 5,
              background: '#FEF3C7', border: '1px solid #FDE68A',
              borderRadius: 999, padding: '5px 12px', marginTop: 10,
            }}>
              <span style={{ fontSize: 12 }}>⏱</span>
              <p style={{ fontSize: 12, fontWeight: 600, color: '#92400E' }}>Free to meet for the next 10 min</p>
            </div>

            <p style={{ fontSize: 12, color: '#9B8C84', marginTop: 8 }}>
              {person.crossCount} paths crossed this week
            </p>

            <div style={{
              marginTop: 28, width: '100%',
              background: '#EDEDE9', border: '1px solid #D6CCC2',
              borderRadius: 16, padding: '18px 20px',
            }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: '#16112B', marginBottom: 12, letterSpacing: '0.03em' }}>How waving works</p>
              {[
                'She only finds out if she waves back.',
                'Your location is only shared after you both match.',
              ].map((text, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: i === 0 ? 8 : 0 }}>
                  <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#9B8C84', marginTop: 5, flexShrink: 0 }} />
                  <p style={{ fontSize: 13, color: '#6B5C55', lineHeight: 1.4 }}>{text}</p>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* WAITING content */}
        {phase === 'waiting' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{
              width: 56, height: 56, borderRadius: '50%', background: '#34D399',
              boxShadow: '0 0 0 12px rgba(52,211,153,0.15)',
              display: 'block',
              animation: 'pulse 1.5s ease-in-out infinite',
            }} />
            <p style={{ fontSize: 18, fontWeight: 700, color: '#16112B', marginTop: 24 }}>
              Waiting for {firstName}...
            </p>
            <p style={{ fontSize: 13, color: '#9B8C84', marginTop: 8, textAlign: 'center', maxWidth: 220 }}>
              Only shows up if she waves back
            </p>
          </div>
        )}

        {/* REVEAL content */}
        {phase === 'reveal' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 20px' }}>
            <img src="/bear.png" alt={person.name} style={{
              width: 96, height: 96, borderRadius: '50%', objectFit: 'cover',
              border: '3px solid #C9906E',
            }} />
            <p style={{ fontSize: 22, fontWeight: 700, color: '#16112B', marginTop: 16 }}>{firstName} waved!</p>
            <span style={{
              display: 'inline-block', marginTop: 8,
              fontSize: 12, fontWeight: 600, color: '#065F46',
              background: '#D1FAE5', border: '1px solid #A7F3D0',
              padding: '4px 14px', borderRadius: 999,
            }}>
              She's close by
            </span>

            <div style={{
              marginTop: 24, width: '100%',
              background: '#EDEDE9', border: '1px solid #D6CCC2',
              borderRadius: 16, padding: '18px 20px', textAlign: 'center',
            }}>
              <p style={{ fontSize: 15, fontWeight: 600, color: '#16112B' }}>She's at Starbucks</p>
              <p style={{ fontSize: 12, color: '#9B8C84', marginTop: 6 }}>
                Price Center, ground floor.
              </p>
            </div>
          </div>
        )}

        {/* CONFIRM content */}
        {phase === 'followup' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 32px' }}>
            <svg width="200" height="150" viewBox="0 0 200 150" fill="none">
              {/* Kelly — lavender */}
              <rect x="12" y="88" width="62" height="52" rx="22" fill="#D4CFFB"/>
              <circle cx="43" cy="74" r="28" fill="#D4CFFB"/>
              {/* Kelly cheeks */}
              <circle cx="30" cy="80" r="7" fill="#C4B5F7" opacity="0.5"/>
              <circle cx="56" cy="80" r="7" fill="#C4B5F7" opacity="0.5"/>
              {/* Kelly eyes */}
              <circle cx="35" cy="70" r="3.5" fill="#3B2EA0"/>
              <circle cx="51" cy="70" r="3.5" fill="#3B2EA0"/>
              <circle cx="36" cy="69" r="1" fill="white"/>
              <circle cx="52" cy="69" r="1" fill="white"/>
              {/* Kelly smile */}
              <path d="M35 82 Q43 90 51 82" stroke="#3B2EA0" strokeWidth="2.2" strokeLinecap="round" fill="none"/>
              {/* Kelly arm */}
              <path d="M74 105 Q95 98 102 95" stroke="#B8ADEE" strokeWidth="6" strokeLinecap="round"/>

              {/* You — warm tan */}
              <rect x="126" y="88" width="62" height="52" rx="22" fill="#E3D5CA"/>
              <circle cx="157" cy="74" r="28" fill="#E3D5CA"/>
              {/* You cheeks */}
              <circle cx="144" cy="80" r="7" fill="#D5BDAF" opacity="0.6"/>
              <circle cx="170" cy="80" r="7" fill="#D5BDAF" opacity="0.6"/>
              {/* You eyes */}
              <circle cx="149" cy="70" r="3.5" fill="#6B5C55"/>
              <circle cx="165" cy="70" r="3.5" fill="#6B5C55"/>
              <circle cx="150" cy="69" r="1" fill="white"/>
              <circle cx="166" cy="69" r="1" fill="white"/>
              {/* You smile */}
              <path d="M149 82 Q157 90 165 82" stroke="#6B5C55" strokeWidth="2.2" strokeLinecap="round" fill="none"/>
              {/* You arm */}
              <path d="M126 105 Q105 98 98 95" stroke="#D5BDAF" strokeWidth="6" strokeLinecap="round"/>

              {/* Heart in the middle */}
              <path d="M100 88 C100 83 93 80 93 86 C93 92 100 98 100 98 C100 98 107 92 107 86 C107 80 100 83 100 88Z" fill="#FBBF24" opacity="0.85"/>

            </svg>
            <p style={{ fontSize: 20, fontWeight: 700, color: '#16112B', marginTop: 20, textAlign: 'center' }}>You said hi to {firstName}!</p>
            <p style={{ fontSize: 13, color: '#9B8C84', marginTop: 6, textAlign: 'center' }}>at Starbucks, Price Center</p>
          </div>
        )}

      </div>

      {/* Action bar — always at bottom */}
      <div style={{ flexShrink: 0, padding: '16px 20px 36px', borderTop: '1px solid #D6CCC2', background: '#F5EBE0' }}>

        {/* INVITE: main actions */}
        {phase === 'invite' && !showReasons && (
          <>
            <button onClick={handleWave} style={{
              width: '100%', padding: '14px',
              background: '#D5BDAF', border: '1px solid #C4A898',
              borderRadius: 14, fontSize: 15, fontWeight: 600, color: '#16112B',
              cursor: 'pointer',
            }}>
              Wave
            </button>
          </>
        )}

        {/* INVITE: not-now reasons */}
        {phase === 'invite' && showReasons && (
          <>
            <p style={{ fontSize: 12, color: '#9B8C84', textAlign: 'center', marginBottom: 8 }}>What's up?</p>
            {NOT_NOW_REASONS.map(r => (
              <button key={r} onClick={() => handleNotNowPick(r)} style={{
                width: '100%', padding: '11px', marginBottom: 6,
                background: 'transparent', border: '1px solid #D6CCC2',
                borderRadius: 12, fontSize: 13, color: '#16112B',
                cursor: 'pointer',
              }}>
                {r}
              </button>
            ))}
            <button onClick={() => setShowReasons(false)} style={{
              width: '100%', padding: '10px', marginTop: 2,
              background: 'transparent', border: 'none',
              fontSize: 13, color: '#9B8C84', cursor: 'pointer',
            }}>
              Back
            </button>
          </>
        )}


        {/* REVEAL actions */}
        {phase === 'reveal' && (
          <button onClick={() => { logEvent('said_hi', { personId: person.id }); setPhase('followup') }} style={{

            width: '100%', padding: '14px',
            background: '#D5BDAF', border: '1px solid #C4A898',
            borderRadius: 14, fontSize: 15, fontWeight: 600, color: '#16112B',
            cursor: 'pointer',
          }}>
            Go say hi
          </button>
        )}

        {/* CONFIRM actions */}
        {phase === 'followup' && (
          <button onClick={() => {
            logEvent('followup_answer', { answer: 'Said hi!', personId: person.id })
            setPingSeen?.(true)
            navigate('/chat/1', { state: { fromNudge: true, outcome: 'said_hi' } })
          }} style={{
            width: '100%', padding: '14px',
            background: '#D5BDAF', border: '1px solid #C4A898',
            borderRadius: 14, cursor: 'pointer',
            fontSize: 15, fontWeight: 600, color: '#16112B',
          }}>
            Continue
          </button>
        )}

      </div>
    </div>
  )
}
