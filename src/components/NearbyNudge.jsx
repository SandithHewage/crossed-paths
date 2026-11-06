import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { people } from '../data/people'

export default function NearbyNudge({ nudge, setNudge, addLog }) {
  const navigate = useNavigate()

  if (!nudge.active) return null

  const person = people.find(p => p.id === nudge.personId)
  if (!person) return null

  const zone = person.overlaps[0]?.location ?? 'nearby'
  const contextLine = `Ask if they're heading to ${person.overlaps[0]?.location ?? 'campus'}`

  function dismiss() {
    addLog('nudge_dismissed', nudge.personId)
    setNudge({ active: false, personId: null, phase: 'nudge' })
  }

  function acceptNudge() {
    addLog('nudge_accepted', nudge.personId)
    setNudge(prev => ({ ...prev, phase: 'inperson' }))
  }

  function gotIt() {
    setNudge(prev => ({ ...prev, phase: 'followup' }))
  }

  function resolveFollowup(event) {
    addLog(event, nudge.personId)
    setNudge({ active: false, personId: null, phase: 'nudge' })
  }

  return (
    <AnimatePresence>
      <motion.div
        key={nudge.phase}
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 340, damping: 32, mass: 0.7 }}
        style={{
          position: 'absolute',
          bottom: 80,
          left: 16,
          right: 16,
          zIndex: 30,
          background: '#EDEDE9',
          borderRadius: 18,
          padding: '16px 18px',
          border: '1px solid #D6CCC2',
          boxShadow: '0 8px 32px rgba(22,17,43,0.18)',
        }}
      >
        {nudge.phase === 'nudge' && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div style={{
                width: 10, height: 10, borderRadius: '50%', background: '#34D399', flexShrink: 0,
                animation: 'pulse 1.5s ease-in-out infinite',
              }} />
              <p style={{ fontSize: 14, fontWeight: 700, color: '#16112B', flex: 1 }}>
                {person.name} is nearby · {zone}
              </p>
            </div>
            <p style={{ fontSize: 12.5, color: '#6B5C55', marginBottom: 14, lineHeight: 1.4 }}>
              You've crossed paths {person.crossCount}× this week — they're right nearby now.
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={acceptNudge}
                style={{
                  flex: 1, padding: '11px 0', borderRadius: 12,
                  background: '#D5BDAF', color: '#16112B',
                  fontSize: 14, fontWeight: 600, border: '1px solid #D6CCC2', cursor: 'pointer',
                }}
              >
                Say hi
              </button>
              <button
                onClick={dismiss}
                style={{
                  padding: '11px 18px', borderRadius: 12,
                  background: '#F5EBE0', color: '#9B8C84',
                  fontSize: 14, fontWeight: 500, border: '1px solid #D6CCC2', cursor: 'pointer',
                }}
              >
                Not now
              </button>
            </div>
          </>
        )}

        {nudge.phase === 'inperson' && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <span style={{ fontSize: 20 }}>👋</span>
              <p style={{ fontSize: 14, fontWeight: 700, color: '#16112B' }}>
                Go say hi to {person.name}!
              </p>
            </div>
            <p style={{ fontSize: 12.5, color: '#6B5C55', marginBottom: 14, lineHeight: 1.4 }}>
              {contextLine}
            </p>
            <button
              onClick={gotIt}
              style={{
                width: '100%', padding: '11px 0', borderRadius: 12,
                background: '#D5BDAF', color: '#16112B',
                fontSize: 14, fontWeight: 600, border: '1px solid #D6CCC2', cursor: 'pointer',
              }}
            >
              Got it
            </button>
          </>
        )}

        {nudge.phase === 'followup' && (
          <>
            <p style={{ fontSize: 14, fontWeight: 700, color: '#16112B', marginBottom: 12 }}>
              Did you say hi to {person.name}?
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <button
                onClick={() => resolveFollowup('met')}
                style={{
                  width: '100%', padding: '11px 0', borderRadius: 12,
                  background: '#D5BDAF', color: '#16112B',
                  fontSize: 14, fontWeight: 600, border: '1px solid #D6CCC2', cursor: 'pointer',
                }}
              >
                Yes, we met!
              </button>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => resolveFollowup('not_today')}
                  style={{
                    flex: 1, padding: '10px 0', borderRadius: 12,
                    background: '#F5EBE0', color: '#6B5C55',
                    fontSize: 13, fontWeight: 500, border: '1px solid #D6CCC2', cursor: 'pointer',
                  }}
                >
                  Not today
                </button>
                <button
                  onClick={() => resolveFollowup('missed')}
                  style={{
                    flex: 1, padding: '10px 0', borderRadius: 12,
                    background: '#F5EBE0', color: '#6B5C55',
                    fontSize: 13, fontWeight: 500, border: '1px solid #D6CCC2', cursor: 'pointer',
                  }}
                >
                  Missed them
                </button>
              </div>
            </div>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  )
}
