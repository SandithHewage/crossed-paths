import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { people } from '../data/people'
import BottomNav from '../components/BottomNav'
import { logEvent } from '../lib/presence'

const ADJECTIVES = ['Sleepy', 'Fluffy', 'Tiny', 'Cozy', 'Clumsy', 'Bouncy', 'Soft', 'Silly', 'Fuzzy', 'Shy']
const ANIMALS = ['Otter', 'Hamster', 'Bunny', 'Hedgehog', 'Duckling', 'Corgi', 'Koala', 'Chipmunk', 'Lamb', 'Fennec']
const anonName = (id) => `${ADJECTIVES[id % ADJECTIVES.length]} ${ANIMALS[id % ANIMALS.length]}`

const ChevronRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9B8C84" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18l6-6-6-6"/>
  </svg>
)

// Aggregate overlap locations weighted by crossCount
const locationCounts = {}
people.forEach(p => {
  p.overlaps.forEach(o => {
    locationCounts[o.location] = (locationCounts[o.location] || 0) + p.crossCount
  })
})
const hotspots = Object.entries(locationCounts).sort((a, b) => b[1] - a[1]).slice(0, 5)
const maxHeat = hotspots[0]?.[1] || 1

export default function WeeklyPaths({ zone, setZone }) {
  const navigate = useNavigate()
  const [paused, setPaused] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const profile = JSON.parse(localStorage.getItem('userProfile') || '{}')
  const displayName = profile.name || 'Sophie'
  const displayMajor = profile.major || null
  const displayTraits = (profile.traits || []).filter(t => t.trim())
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
          <button onClick={() => setShowProfile(true)}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            <img src="/kitty.png" alt="Sophie" style={{ width: 44, height: 44, borderRadius: '50%', border: '2px solid #D4A574', objectFit: 'cover' }} />
            <p style={{ fontSize: 9, color: '#9B8C84', fontWeight: 500 }}>Profile</p>
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


        {/* Hotspot heatmap */}
        <div className="px-5 mt-5">
          <p style={{ fontSize: 13, fontWeight: 600, color: '#16112B', marginBottom: 10 }}>Where you cross paths most</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {hotspots.map(([location, count], i) => {
              const pct = (count / maxHeat) * 100
              const opacity = 0.25 + (pct / 100) * 0.75
              return (
                <motion.div key={location}
                  initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  style={{ display: 'flex', alignItems: 'center', gap: 10 }}
                >
                  <p style={{ fontSize: 12, color: '#6B5C55', width: 128, flexShrink: 0 }}>{location}</p>
                  <div style={{ flex: 1, height: 8, background: '#E3D5CA', borderRadius: 99, overflow: 'hidden' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ delay: i * 0.06 + 0.1, duration: 0.5, ease: 'easeOut' }}
                      style={{
                        height: '100%', borderRadius: 99,
                        background: `rgba(197, 148, 110, ${opacity})`,
                      }}
                    />
                  </div>
                  <p style={{ fontSize: 11, color: '#9B8C84', width: 24, textAlign: 'right', flexShrink: 0 }}>{count}×</p>
                </motion.div>
              )
            })}
          </div>
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
                  {anonName(person.id)}
                </p>
                <p style={{ fontSize: 12, color: '#9B8C84', marginTop: 1 }}>
                  {person.year} · crossed {person.crossCount}×
                </p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#16112B' }}>{person.score}</p>
                  <p style={{ fontSize: 10, color: '#9B8C84' }}>score</p>
                </div>
                <ChevronRight />
              </div>
            </motion.button>
          ))}
        </div>

        <div className="mb-6" />
      </div>

      {/* Profile sheet */}
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
              <img src="/kitty.png" alt="Profile" style={{
                width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', marginBottom: 14,
                border: '3px solid #D4A574',
              }} />
              <p style={{ fontSize: 17, fontWeight: 700, color: '#16112B', marginBottom: 2 }}>{displayName}</p>
              {displayMajor && (
                <p style={{ fontSize: 13, color: '#6B5C55', marginBottom: 4 }}>{displayMajor}</p>
              )}
              <p style={{ fontSize: 12, color: '#9B8C84', marginBottom: displayTraits.length ? 14 : 24 }}>UCSD · You</p>

              {displayTraits.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center', marginBottom: 20 }}>
                  {displayTraits.map((t, i) => (
                    <span key={i} style={{
                      fontSize: 12, fontWeight: 500, color: '#6B5C55',
                      background: '#EDEDE9', border: '1px solid #D6CCC2',
                      padding: '5px 12px', borderRadius: 999,
                    }}>{t}</span>
                  ))}
                </div>
              )}

              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
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
