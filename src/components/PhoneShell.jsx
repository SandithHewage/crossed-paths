import { useState, useEffect } from 'react'

function LiveTime() {
  const [time, setTime] = useState(() =>
    new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
  )
  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }))
    }, 10000)
    return () => clearInterval(id)
  }, [])
  return <span>{time}</span>
}

export default function PhoneShell({ children }) {
  return (
    <div
      className="relative flex flex-col overflow-hidden"
      style={{
        width: 390,
        height: 844,
        borderRadius: 52,
        background: '#F5EBE0',
        boxShadow: '0 32px 80px rgba(100,75,55,0.18), 0 2px 0 rgba(255,255,255,0.6) inset',
        border: '1px solid rgba(255,255,255,0.5)',
      }}
    >
      {/* Status bar */}
      <div
        className="shrink-0 flex justify-between items-center px-9 text-[11px] font-semibold"
        style={{ paddingTop: 14, paddingBottom: 6, color: '#16112B' }}
      >
        <LiveTime />
        <div className="flex items-center gap-[5px]" style={{ color: '#16112B' }}>
          {/* Signal */}
          <svg width="17" height="12" viewBox="0 0 17 12" fill="currentColor">
            <rect x="0"    y="7" width="3" height="5"  rx="0.8" opacity="0.3"/>
            <rect x="4.5"  y="5" width="3" height="7"  rx="0.8" opacity="0.5"/>
            <rect x="9"    y="3" width="3" height="9"  rx="0.8" opacity="0.7"/>
            <rect x="13.5" y="0" width="3" height="12" rx="0.8"/>
          </svg>
          {/* WiFi — cleaner fan shape */}
          <svg width="16" height="13" viewBox="0 0 16 13" fill="none">
            <circle cx="8" cy="11.5" r="1.5" fill="currentColor"/>
            <path d="M4.8 8.5a4.5 4.5 0 0 1 6.4 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
            <path d="M2.2 5.8a8 8 0 0 1 11.6 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.45"/>
          </svg>
          {/* Battery */}
          <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
            <rect x="0.5" y="0.5" width="21" height="11" rx="3" stroke="currentColor" strokeOpacity="0.35"/>
            <rect x="2" y="2" width="16" height="8" rx="1.5" fill="currentColor"/>
            <path d="M22.5 4v4a1.5 1.5 0 000-4z" fill="currentColor" fillOpacity="0.4"/>
          </svg>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {children}
      </div>
    </div>
  )
}
