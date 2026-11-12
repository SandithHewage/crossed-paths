import BottomNav from '../components/BottomNav'
import { logEvent } from '../lib/presence'

export default function Map({ appState, zone, setBanner, pingSeen, setPingSeen }) {
  function handlePing() {
    const bannerZone = zone || 'Price Center'
    logEvent('banner_shown', { personId: 1, zone: bannerZone })
    setBanner({ personId: 1, zone: bannerZone })
  }
  return (
    <div className="flex-1 flex flex-col overflow-hidden" style={{ background: '#F5EBE0' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        <div className="px-5 pt-5 pb-2 shrink-0">
          <p style={{ fontSize: 11, fontWeight: 600, color: '#9B8C84', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Now</p>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: '#16112B', letterSpacing: '-0.4px', marginTop: 2 }}>Campus Map</h2>
        </div>

        <div style={{ flex: 1, margin: '0 22px 18px', borderRadius: 16, overflow: 'hidden', border: '1px solid #D6CCC2', position: 'relative' }}>
          {/* Actual map image */}
          <img
            src="/ucsd-price-center-map.png"
            alt="Price Center map"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />

          {/* Kelly ping — tappable pink circle */}
          {appState?.connected?.[1] && !pingSeen && (
            <button
              onClick={handlePing}
              style={{
                position: 'absolute',
                left: '62%',
                top: '38%',
                transform: 'translate(-50%, -50%)',
                width: 180, height: 180, borderRadius: '50%',
                background: 'rgba(236, 72, 153, 0.25)',
                border: '3px solid rgba(255,255,255,0.3)',
                boxShadow: '0 2px 12px rgba(236,72,153,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
                animation: 'map-pulse-pink 2s ease-out infinite',
              }}
            >
              <span style={{ fontSize: 15, fontWeight: 700, color: 'white', lineHeight: 1 }}>Kelly</span>
            </button>
          )}

          {/* Blue dot overlay — Triton Fountain */}
          {/* Triton Fountain is roughly 46% from left, 62% from top in the image */}
          <div style={{
            position: 'absolute',
            left: '50%',
            top: '87%',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
          }}>
            <div style={{
              width: 14, height: 14,
              borderRadius: '50%',
              background: '#4285F4',
              border: '2.5px solid white',
              boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
            }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: '#16112B', background: 'rgba(255,255,255,0.85)', padding: '2px 7px', borderRadius: 4 }}>You</span>
          </div>
        </div>

      </div>

      <style>{`
        @keyframes map-pulse-pink {
          0%, 100% { box-shadow: 0 2px 12px rgba(236,72,153,0.4); }
          50%       { box-shadow: 0 2px 24px rgba(236,72,153,0.75); }
        }
      `}</style>

      <BottomNav />
    </div>
  )
}
