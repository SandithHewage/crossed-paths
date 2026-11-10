import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { people } from '../data/people'
import BottomNav from '../components/BottomNav'

const ChevronRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9B8C84" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18l6-6-6-6"/>
  </svg>
)

export default function WeeklyPaths({ openToday, setOpenToday }) {
  const navigate = useNavigate()
  const [paused, setPaused] = useState(false)
  const [showProfile, setShowProfile] = useState(false)

  return (
    <div className="flex-1 flex flex-col overflow-hidden" style={{ background: '#F5EBE0', position: 'relative' }}>
      <div className="flex-1 overflow-y-auto scrollable">

        {/* Header */}
        <div className="px-5 pt-5 pb-1 flex items-center justify-between">
          <div>
            <p style={{ fontSize: 11, fontWeight: 600, color: '#9B8C84', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              This past week
            </p>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: '#16112B', letterSpacing: '-0.4px', marginTop: 2 }}>
              Your Paths
            </h2>
          </div>
          <button
            onClick={() => setShowProfile(true)}
            style={{
              width: 48, height: 48, borderRadius: '50%',
              background: 'transparent', border: '2px solid #D4A574', cursor: 'pointer',
              padding: 0, overflow: 'hidden',
            }}
          >
            <img src="/kitty.png" alt="Sophie" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </button>
        </div>

        {/* Stats */}
        <div className="px-5 mt-4 flex gap-3">
          {[
            { value: '38', label: 'Paths crossed' },
            { value: '5',  label: 'Regulars' },
          ].map((s) => (
            <div key={s.label} style={{
              flex: 1, background: '#EDEDE9',
              borderRadius: 14, padding: '14px 16px',
              border: '1px solid #D6CCC2',
            }}>
              <p style={{ fontSize: 26, fontWeight: 700, color: '#16112B', letterSpacing: '-0.5px' }}>{s.value}</p>
              <p style={{ fontSize: 12, color: '#9B8C84', marginTop: 1 }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Section label */}
        <div className="px-5 mt-5 mb-2 flex items-center justify-between">
          <p style={{ fontSize: 13, fontWeight: 600, color: '#16112B' }}>Regulars</p>
          <p style={{ fontSize: 12, color: '#9B8C84' }}>5+ times this week</p>
        </div>

        {/* People list */}
        <div className="px-5 flex flex-col gap-2">
          {people.map((person, i) => (
            <motion.button
              key={person.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              onClick={() => navigate(`/overlap/${person.id}`)}
              style={{
                width: '100%',
                display: 'flex', alignItems: 'center', gap: 12,
                background: '#EDEDE9',
                borderRadius: 14, padding: '12px 14px',
                border: '1px solid #D6CCC2',
                cursor: 'pointer', textAlign: 'left',
              }}
            >
              <div style={{
                width: 40, height: 40, borderRadius: '50%',
                background: person.avatarBg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 700, color: person.avatarText, flexShrink: 0,
              }}>
                {person.initials}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: '#16112B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {person.major}
                </p>
                <p style={{ fontSize: 12, color: '#9B8C84', marginTop: 1 }}>
                  {person.year} · crossed {person.crossCount}×
                </p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                <span style={{
                  fontSize: 12, fontWeight: 700, color: '#16112B',
                  background: '#E3D5CA', padding: '2px 8px', borderRadius: 999,
                }}>
                  {person.score}
                </span>
                <ChevronRight />
              </div>
            </motion.button>
          ))}
        </div>

        <div className="mb-6" />
      </div>

      <AnimatePresence>
        {showProfile && (
          <div
            onClick={() => setShowProfile(false)}
            style={{
              position: 'absolute', inset: 0,
              background: 'rgba(44,35,32,0.35)', zIndex: 20,
              display: 'flex', alignItems: 'flex-end',
            }}
          >
            <motion.div
              onClick={e => e.stopPropagation()}
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 36, mass: 0.8 }}
              style={{
                width: '100%', background: '#F5EBE0', borderRadius: '24px 24px 0 0',
                padding: '32px 24px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center',
              }}
            >
              <img src="/kitty.png" alt="Sophie" style={{
                width: 100, height: 100, borderRadius: '50%', objectFit: 'cover', marginBottom: 16,
                border: '3px solid #D4A574',
              }} />
              <p style={{ fontSize: 14, fontWeight: 600, color: '#16112B', marginBottom: 2 }}>Sophie</p>
              <p style={{ fontSize: 13, color: '#9B8C84', marginBottom: 24 }}>You</p>

              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {/* Free to meet toggle */}
                <button
                  onClick={() => setOpenToday(v => !v)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    background: '#EDEDE9', borderRadius: 14, padding: '12px 16px',
                    border: '1px solid #D6CCC2', cursor: 'pointer', textAlign: 'left', width: '100%',
                  }}
                >
                  <span style={{
                    width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                    background: openToday ? '#34D399' : '#D6CCC2',
                  }} />
                  <p style={{ fontSize: 13, color: '#16112B', fontWeight: 500, flex: 1 }}>Free to meet</p>
                  <span style={{
                    fontSize: 12, fontWeight: 600,
                    color: openToday ? '#065F46' : '#9B8C84',
                    background: openToday ? '#D1FAE5' : '#E3D5CA',
                    padding: '3px 10px', borderRadius: 999,
                    border: `1px solid ${openToday ? '#A7F3D0' : '#D6CCC2'}`,
                  }}>
                    {openToday ? 'On' : 'Off'}
                  </span>
                </button>

                {/* Tracking status */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  background: '#EDEDE9', borderRadius: 14, padding: '12px 16px',
                  border: '1px solid #D6CCC2',
                }}>
                  <span style={{
                    width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                    background: paused ? '#FBBF24' : '#34D399',
                  }} className={paused ? 'pulse-fast' : 'animate-pulse'} />
                  <p style={{ fontSize: 13, color: '#16112B', fontWeight: 500, flex: 1 }}>
                    {paused ? 'Tracking paused' : 'Tracking live'} · UCSD campus
                  </p>
                  <button
                    onClick={() => setPaused(p => !p)}
                    style={{ fontSize: 12, color: '#9B8C84', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}
                  >
                    {paused ? 'Resume' : 'Pause'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <BottomNav />
    </div>
  )
}
