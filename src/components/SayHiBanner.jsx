import { AnimatePresence, motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { logEvent } from '../lib/presence'

export default function SayHiBanner({ banner, setBanner }) {
  const navigate = useNavigate()

  function handleTap() {
    logEvent('banner_tapped', { personId: banner.personId, zone: banner.zone })
    navigate(`/sayhi/${banner.personId}`, { state: { zone: banner.zone } })
    setBanner(null)
  }

  function handleDismiss(e) {
    e.stopPropagation()
    logEvent('banner_dismissed', { personId: banner.personId })
    setBanner(null)
  }

  return (
    <AnimatePresence>
      {banner && (
        <motion.div
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -80, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 36 }}
          onClick={handleTap}
          style={{
            position: 'absolute', top: 0, left: 0, right: 0, zIndex: 30,
            padding: '12px 16px',
            background: '#EDEDE9',
            borderBottom: '1px solid #D6CCC2',
            display: 'flex', alignItems: 'center', gap: 10,
            cursor: 'pointer',
          }}
        >
          <span style={{
            width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
            background: '#34D399',
            boxShadow: '0 0 0 2px rgba(52,211,153,0.3)',
            animation: 'pulse 1.5s ease-in-out infinite',
          }} />
          <p style={{ flex: 1, fontSize: 13, fontWeight: 500, color: '#16112B' }}>
            Kelly is nearby in {banner.zone}
          </p>
          <button
            onClick={handleDismiss}
            style={{
              width: 24, height: 24, borderRadius: '50%',
              background: '#D6CCC2', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, color: '#9B8C84', flexShrink: 0,
            }}
          >
            ×
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
