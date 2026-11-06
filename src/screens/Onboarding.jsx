import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const AppLogo = () => (
  <div
    className="w-[72px] h-[72px] flex items-center justify-center"
    style={{ borderRadius: 20, background: '#D5BDAF' }}
  >
    <svg width="38" height="38" viewBox="0 0 38 38" fill="none">
      <circle cx="8" cy="29" r="4" fill="white" fillOpacity="0.9"/>
      <circle cx="30" cy="9" r="4" fill="white" fillOpacity="0.5"/>
      <path d="M8 29 C 12 22, 26 16, 30 9" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none"/>
      <path d="M8 9 C 12 16, 26 22, 30 29" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.35"/>
    </svg>
  </div>
)

const features = [
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16112B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
        <circle cx="12" cy="10" r="3"/>
      </svg>
    ),
    text: 'Zone-based only, your exact location is never shared',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16112B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
      </svg>
    ),
    text: 'Fully anonymous until you both choose to connect',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16112B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
    ),
    text: 'Weekly summaries of who you keep crossing paths with',
  },
]

function PhoneScreen({ onContinue }) {
  const [mode, setMode] = useState('email') // 'email' or 'phone'
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')

  const formatted = (val) => {
    const digits = val.replace(/\D/g, '').slice(0, 10)
    if (digits.length <= 3) return digits
    if (digits.length <= 6) return `(${digits.slice(0,3)}) ${digits.slice(3)}`
    return `(${digits.slice(0,3)}) ${digits.slice(3,6)}-${digits.slice(6)}`
  }

  const handlePhoneChange = (e) => setPhone(formatted(e.target.value))
  const digits = phone.replace(/\D/g, '')
  const isValidEmail = email.endsWith('@ucsd.edu') && email.split('@')[0].length > 0
  const isValidPhone = digits.length === 10

  return (
    <div className="flex-1 flex flex-col justify-between px-6 pb-8 pt-4">
      <div className="flex flex-col items-center mt-10 gap-8">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center gap-5"
        >
          <AppLogo />
          <div className="text-center">
            <h1 style={{ fontSize: 28, fontWeight: 700, color: '#16112B', letterSpacing: '-0.5px', lineHeight: 1.2 }}>
              Crossed Paths
            </h1>
            <p style={{ marginTop: 10, fontSize: 15, color: '#6B5C55', lineHeight: 1.6 }}>
              Meet the people you already<br />keep seeing around campus.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18, duration: 0.4 }}
          className="w-full flex flex-col gap-2"
        >
          {features.map((f, i) => (
            <div
              key={i}
              className="flex items-start gap-3 px-4 py-3.5"
              style={{ background: '#EDEDE9', borderRadius: 14, border: '1px solid #D6CCC2' }}
            >
              <div className="mt-0.5 shrink-0">{f.icon}</div>
              <p style={{ fontSize: 13.5, color: '#6B5C55', lineHeight: 1.5 }}>{f.text}</p>
            </div>
          ))}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.32, duration: 0.4 }}
        className="flex flex-col gap-3"
      >
        <AnimatePresence mode="wait">
          {mode === 'email' ? (
            <motion.div key="email"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@ucsd.edu"
                style={{
                  width: '100%', padding: '15px 16px', borderRadius: 14,
                  background: '#EDEDE9', border: '1.5px solid #D6CCC2',
                  fontSize: 15, color: '#16112B', fontWeight: 500,
                  outline: 'none', boxSizing: 'border-box',
                }}
              />
            </motion.div>
          ) : (
            <motion.div key="phone"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{ position: 'relative' }}
            >
              <span style={{
                position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)',
                fontSize: 15, color: '#16112B', fontWeight: 500, pointerEvents: 'none',
              }}>+1</span>
              <input
                type="tel"
                value={phone}
                onChange={handlePhoneChange}
                placeholder="(555) 000-0000"
                style={{
                  width: '100%', padding: '15px 16px 15px 42px', borderRadius: 14,
                  background: '#EDEDE9', border: '1.5px solid #D6CCC2',
                  fontSize: 15, color: '#16112B', fontWeight: 500,
                  outline: 'none', boxSizing: 'border-box',
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => (mode === 'email' ? isValidEmail : isValidPhone) && onContinue()}
          style={{
            width: '100%', padding: '15px 0', borderRadius: 14,
            background: (mode === 'email' ? isValidEmail : isValidPhone) ? '#D5BDAF' : '#E3D5CA',
            color: '#16112B', fontSize: 15, fontWeight: 600,
            letterSpacing: '-0.1px', border: '1px solid #D6CCC2',
            cursor: (mode === 'email' ? isValidEmail : isValidPhone) ? 'pointer' : 'default',
            transition: 'background 0.2s',
          }}
        >
          {mode === 'email' ? 'Verify with UCSD email' : 'Continue with phone number'}
        </button>

        <p style={{ textAlign: 'center', fontSize: 12, color: '#9B8C84', lineHeight: 1.5 }}>
          {mode === 'email'
            ? "We'll send a verification link to confirm you're part of UCSD"
            : "We'll send a verification code. Your phone number will never be shared."}
        </p>

        <button
          onClick={() => setMode(mode === 'email' ? 'phone' : 'email')}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#9B8C84', fontSize: 13, textDecoration: 'underline',
            padding: 0, marginTop: 4,
          }}
        >
          {mode === 'email' ? 'Continue with phone number instead' : 'Use UCSD email instead'}
        </button>
      </motion.div>
    </div>
  )
}

function LocationScreen({ onContinue }) {
  return (
    <div className="flex-1 flex flex-col justify-between px-6 pb-8 pt-4">
      <div className="flex flex-col items-center mt-14 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-[88px] h-[88px] flex items-center justify-center"
          style={{ borderRadius: 24, background: '#E3D5CA' }}
        >
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#16112B" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="text-center"
        >
          <h2 style={{ fontSize: 24, fontWeight: 700, color: '#16112B', letterSpacing: '-0.4px', lineHeight: 1.25 }}>
            Allow location access
          </h2>
          <p style={{ marginTop: 10, fontSize: 14.5, color: '#6B5C55', lineHeight: 1.65 }}>
            Crossed Paths uses your location to detect when you're in the same zone as someone else, not to track your exact position.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="w-full flex flex-col gap-2.5"
        >
          {[
            { label: 'Zone-based detection', desc: "Only knows you're in the same general area" },
            { label: 'Never shared with others', desc: 'Other users never see your coordinates' },
            { label: 'Background access needed', desc: 'So crossings are detected even when app is closed' },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3 px-4 py-3"
              style={{ background: '#EDEDE9', borderRadius: 14, border: '1px solid #D6CCC2' }}>
              <div className="mt-0.5 shrink-0 w-5 h-5 rounded-full flex items-center justify-center"
                style={{ background: '#E3D5CA' }}>
                <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6l3 3 5-5" stroke="#16112B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <p style={{ fontSize: 13.5, fontWeight: 600, color: '#16112B', lineHeight: 1.4 }}>{item.label}</p>
                <p style={{ fontSize: 12.5, color: '#9B8C84', lineHeight: 1.4 }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.4 }}
        className="flex flex-col gap-3"
      >
        <button
          onClick={onContinue}
          style={{
            width: '100%', padding: '15px 0', borderRadius: 14,
            background: '#D5BDAF', color: '#16112B', fontSize: 15,
            fontWeight: 600, letterSpacing: '-0.1px', border: '1px solid #D6CCC2', cursor: 'pointer',
          }}
        >
          Allow location access
        </button>
      </motion.div>
    </div>
  )
}

export default function Onboarding() {
  const navigate = useNavigate()
  const [step, setStep] = useState('phone')

  return (
    <AnimatePresence mode="wait">
      {step === 'phone' ? (
        <motion.div key="phone" className="flex-1 flex flex-col"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
        >
          <PhoneScreen onContinue={() => setStep('location')} />
        </motion.div>
      ) : (
        <motion.div key="location" className="flex-1 flex flex-col"
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <LocationScreen onContinue={() => navigate('/weekly')} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
