import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { people } from '../data/people'
import BottomNav from '../components/BottomNav'

const ChevronRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D5BDAF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18l6-6-6-6"/>
  </svg>
)

export default function WeeklyPaths() {
  const navigate = useNavigate()
  const [paused, setPaused] = useState(false)

  return (
    <div className="flex-1 flex flex-col overflow-hidden" style={{ background: '#F5EBE0' }}>
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
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            background: '#D5BDAF',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 13, fontWeight: 700, color: '#16112B',
          }}>
            S
          </div>
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
              transition={{ delay: i * 0.06 }}
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

        {/* Tracking status */}
        <div className="px-5 mt-4 mb-6">
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: '#EDEDE9', borderRadius: 12, padding: '10px 14px',
            border: '1px solid #D6CCC2',
          }}>
            <span style={{
              width: 7, height: 7, borderRadius: '50%', flexShrink: 0,
              background: paused ? '#FBBF24' : '#34D399',
            }} className={paused ? 'pulse-fast' : 'animate-pulse'} />
            <p style={{ fontSize: 12, color: '#6B5C55', fontWeight: 500, flex: 1 }}>
              {paused ? 'Tracking paused · UCSD campus' : 'Tracking active · UCSD campus'}
            </p>
            <button
              onClick={() => setPaused(p => !p)}
              style={{ fontSize: 12, color: '#9B8C84', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              {paused ? 'Resume' : 'Pause'}
            </button>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
