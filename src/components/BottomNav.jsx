import { useNavigate, useLocation } from 'react-router-dom'

const PathsIcon = ({ active }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <circle cx="5" cy="19" r="2" stroke={active ? '#16112B' : '#9B8C84'} strokeWidth="1.8"/>
    <circle cx="19" cy="5" r="2" stroke={active ? '#16112B' : '#9B8C84'} strokeWidth="1.8"/>
    <path d="M7 17.5C9 14 12 12 12 12S15 10 17 6.5" stroke={active ? '#16112B' : '#9B8C84'} strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
)

const HeartIcon = ({ active }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
      stroke={active ? '#16112B' : '#9B8C84'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
      fill={active ? '#E3D5CA' : 'none'}
    />
  </svg>
)

const ChatIcon = ({ active }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
      stroke={active ? '#16112B' : '#9B8C84'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
      fill={active ? '#E3D5CA' : 'none'}
    />
  </svg>
)

const tabs = [
  { label: 'Paths',    path: '/weekly',   Icon: PathsIcon },
  { label: 'Matches',  path: '/matches',  Icon: HeartIcon },
  { label: 'Messages', path: '/messages', Icon: ChatIcon },
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
