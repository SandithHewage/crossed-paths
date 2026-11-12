import { useNavigate, useLocation } from 'react-router-dom'

const PathsIcon = ({ active }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <circle cx="5" cy="19" r="2" stroke={active ? '#16112B' : '#9B8C84'} strokeWidth="1.8"/>
    <circle cx="19" cy="5" r="2" stroke={active ? '#16112B' : '#9B8C84'} strokeWidth="1.8"/>
    <path d="M7 17.5C9 14 12 12 12 12S15 10 17 6.5" stroke={active ? '#16112B' : '#9B8C84'} strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
)

const SmileyIcon = ({ active }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10"
      stroke={active ? '#16112B' : '#9B8C84'} strokeWidth="1.8"
      fill={active ? '#E3D5CA' : 'none'}
    />
    <path d="M8 14s1.5 2 4 2 4-2 4-2"
      stroke={active ? '#16112B' : '#9B8C84'} strokeWidth="1.8" strokeLinecap="round"
    />
    <circle cx="9" cy="10" r="1" fill={active ? '#16112B' : '#9B8C84'} />
    <circle cx="15" cy="10" r="1" fill={active ? '#16112B' : '#9B8C84'} />
  </svg>
)

const MapIcon = ({ active }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"
      stroke={active ? '#16112B' : '#9B8C84'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
      fill={active ? '#E3D5CA' : 'none'}
    />
    <line x1="8" y1="2" x2="8" y2="18" stroke={active ? '#16112B' : '#9B8C84'} strokeWidth="1.8" strokeLinecap="round"/>
    <line x1="16" y1="6" x2="16" y2="22" stroke={active ? '#16112B' : '#9B8C84'} strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
)

const tabs = [
  { label: 'Paths',    path: '/weekly',   Icon: PathsIcon },
  { label: 'Map',      path: '/map',      Icon: MapIcon },
  { label: 'Matches', path: '/messages', Icon: SmileyIcon },
]

export default function BottomNav() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  return (
    <div
      className="shrink-0 flex"
      style={{
        borderTop: '1px solid #D6CCC2',
        background: 'rgba(245,235,224,0.95)',
        backdropFilter: 'blur(12px)',
      }}
    >
      {tabs.map(({ label, path, Icon }) => {
        const isActive = (path) => {
          if (path === '/weekly') return pathname.startsWith('/weekly') || pathname.startsWith('/overlap')
          if (path === '/messages') return pathname.startsWith('/messages') || pathname.startsWith('/chat')
          return pathname.startsWith(path)
        }
        const active = isActive(path)
        return (
          <button
            key={path}
            onClick={() => navigate(path)}
            className="flex-1 flex flex-col items-center gap-1 py-3"
          >
            <Icon active={active} />
            <span
              className="text-[10px] font-semibold tracking-wide"
              style={{ color: active ? '#16112B' : '#9B8C84' }}
            >
              {label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
