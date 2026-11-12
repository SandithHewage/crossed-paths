import { AnimatePresence, motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { logEvent } from '../lib/presence'

export default function SayHiBanner({ banner, setBanner }) {
  const navigate = useNavigate()

  function handleSayHi() {
    logEvent('banner_tapped', { personId: banner.personId, zone: banner.zone })
    navigate(`/sayhi/${banner.personId}`, { state: { zone: banner.zone } })
    setBanner(null)
  }

  function handleDismiss() {
    logEvent('banner_dismissed', { personId: banner.personId })
    setBanner(null)
  }

  return (
    <AnimatePresence>
      {banner && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
            onClick={handleDismiss}
            style={{
              position: 'absolute', inset: 0,
              background: 'rgba(44,35,32,0.45)', zIndex: 25,
            }}
          />

          {/* Bottom sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 36, mass: 0.8 }}
            style={{
              position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 30,
              background: '#F5EBE0', borderRadius: '24px 24px 0 0',
              padding: '28px 24px 40px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0,
            }}
          >
            {/* Pulse dot */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>
              <span style={{
                width: 8, height: 8, borderRadius: '50%',
                background: '#34D399',
                boxShadow: '0 0 0 3px rgba(52,211,153,0.25)',
                animation: 'pulse 1.5s ease-in-out infinite',
                display: 'inline-block',
              }} />
              <p style={{ fontSize: 11, fontWeight: 600, color: '#34D399', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Nearby now
              </p>
            </div>

            {/* Avatar */}
            <img src="/bear.png" alt="Kelly" style={{
              width: 80, height: 80, borderRadius: '50%', objectFit: 'cover',
              border: '3px solid #C9906E', marginBottom: 14,
            }} />

            {/* Name + zone */}
            <p style={{ fontSize: 20, fontWeight: 700, color: '#16112B', letterSpacing: '-0.3px', marginBottom: 24 }}>
              Kelly's at Price Center
            </p>

            {/* CTA */}
            <button onClick={handleSayHi} style={{
              width: '100%', padding: '15px 0', borderRadius: 14,
              background: '#D5BDAF', color: '#16112B',
              fontSize: 15, fontWeight: 700, border: '1px solid #C4A898',
              cursor: 'pointer', marginBottom: 10,
            }}>
              Say Hi
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
