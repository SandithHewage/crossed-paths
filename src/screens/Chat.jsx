import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { people } from '../data/people'
import BottomNav from '../components/BottomNav'

const BackIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16112B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 18l-6-6 6-6"/>
  </svg>
)

const SendIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16112B" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"/>
    <polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
)

const WORKER_URL = 'https://xpath-chat.scabsonline.workers.dev'

const HANNAH_SYSTEM = `You are Hannah, a 4th-year Cog Sci Neuroscience student at UCSD. You just matched with someone on Crossed Paths — an app that detected you've been in the same place as this person 11 times in the past week. You clearly keep running into each other constantly, so never say anything that implies you haven't seen them around or wouldn't know them. You've definitely noticed each other.

UCSD knowledge (use short casual names only):
Colleges: Revelle, Muir, Marshall, Warren, Roosevelt, Sixth, Seventh, Eighth. Spots: Geisel, Price Center, the Loft, Warren Mall, Sun God, RIMAC. Your go-tos: Athena (matcha, say "Athena" never the full name), Pines for food. Off campus: Marta, The Forum.

How to text:
- Max 1 sentence per reply, occasionally 2 if you're asking something
- Lowercase, relaxed, like you're texting between classes
- No emojis. Ever.
- No exclamation points unless it feels really natural
- Fragments are fine. Typos are fine.
- Ask questions to keep things going — but never ask about their major, you can already see it on the app
- Ask about the places you keep running into each other (Geisel, Center Hall, Price Center, etc.) — like why they're always there, what they're usually working on, if they have a favorite spot inside
- Mix in other light questions too: weekend plans, where they're from, what they're watching, etc.
- One question at a time, keep it casual

Goal: by your 3rd or 4th reply, if the conversation feels natural, suggest studying together — Athena or Geisel, something vague like "we should study at Athena sometime." If it doesn't feel right yet, keep the conversation going with another question. Once a plan is confirmed, end with "see you soon" and stop replying.

Never say you're an AI.`

function now() {
  return new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
}

const delay = () => new Promise(r => setTimeout(r, 2000 + Math.random() * 1000))

async function getHannahReply(history) {
  const messages = history.map(m => ({
    role: m.from === 'me' ? 'user' : 'assistant',
    text: m.text,
  })).map(({ role, text }) => ({ role, content: text }))

  await delay()
  const res = await fetch(WORKER_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ system: HANNAH_SYSTEM, messages, max_tokens: 120 }),
  })
  const data = await res.json()
  return data.text ?? ''
}

export default function Chat({ chats, setChats }) {
  const { id } = useParams()
  const numId = Number(id)
  const person = people.find(p => p.id === numId)
  const navigate = useNavigate()
  const location = useLocation()
  const openerText = location.state?.opener

  const existing = chats[numId]
  const initMessages = existing ?? (openerText
    ? [{ from: 'me', text: openerText, time: now() }]
    : [])

  const [messages, setMessages] = useState(initMessages)
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)
  const bottomRef = useRef(null)

  // Sync to shared state
  useEffect(() => {
    setChats(prev => ({ ...prev, [numId]: messages }))
  }, [messages]) // eslint-disable-line

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, thinking])

  // Auto-reply to opener on first load
  useEffect(() => {
    if (!openerText || existing) return
    const show = setTimeout(() => {
      setThinking(true)
      getHannahReply([{ from: 'me', text: openerText, time: now() }]).then(text => {
        if (!text) return
        setMessages(prev => [...prev, { from: 'them', text, time: now() }])
        setThinking(false)
      }).catch(() => setThinking(false))
    }, 1500)
    return () => clearTimeout(show)
  }, []) // eslint-disable-line

  if (!person) return null

  async function send() {
    const text = input.trim()
    if (!text) return
    const updated = [...messages, { from: 'me', text, time: now() }]
    setMessages(updated)
    setInput('')
    setThinking(true)
    const reply = await getHannahReply(updated).catch(() => '')
    if (reply) setMessages(prev => [...prev, { from: 'them', text: reply, time: now() }])
    setThinking(false)
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden" style={{ background: '#F5EBE0' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '12px 16px',
        background: '#EDEDE9', borderTop: '1px solid #D6CCC2', borderBottom: '1px solid #D6CCC2', flexShrink: 0,
      }}>
        <button onClick={() => navigate('/messages')} style={{
          width: 30, height: 30, borderRadius: '50%',
          background: '#F5EBE0', border: '1px solid #D6CCC2',
          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
        }}>
          <BackIcon />
        </button>
        <div style={{
          width: 34, height: 34, borderRadius: '50%', background: person.avatarBg,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 12, fontWeight: 700, color: person.avatarText,
        }}>
          {person.initials}
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 14, fontWeight: 600, color: '#16112B' }}>{person.name}</p>
          <p style={{ fontSize: 11, color: '#9B8C84' }}>{person.major}</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#34D399' }} />
          <span style={{ fontSize: 11, color: '#34D399', fontWeight: 600 }}>Connected</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollable" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 8, background: '#F5EBE0' }}>
        <p style={{ textAlign: 'center', fontSize: 11, color: '#D5BDAF', marginBottom: 4 }}>
          Connected today · {person.crossCount}x paths crossed
        </p>
        {messages.map((m, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            style={{ display: 'flex', justifyContent: m.from === 'me' ? 'flex-end' : 'flex-start' }}
          >
            <div style={{
              maxWidth: '72%',
              borderRadius: m.from === 'me' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
              padding: '10px 14px',
              background: m.from === 'me' ? '#D5BDAF' : '#EDEDE9',
              border: '1px solid #D6CCC2',
            }}>
              <p style={{ fontSize: 14, color: '#16112B', lineHeight: 1.45 }}>{m.text}</p>
              <p style={{ fontSize: 10, color: '#9B8C84', marginTop: 3 }}>{m.time}</p>
            </div>
          </motion.div>
        ))}
        {thinking && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{
              borderRadius: '16px 16px 16px 4px', padding: '10px 16px',
              background: '#EDEDE9', border: '1px solid #D6CCC2',
              display: 'flex', gap: 4, alignItems: 'center',
            }}>
              {[0, 1, 2].map(i => (
                <span key={i} style={{
                  width: 6, height: 6, borderRadius: '50%', background: '#D5BDAF',
                  display: 'inline-block',
                  animation: 'wave 1.2s ease-in-out infinite',
                  animationDelay: `${i * 0.2}s`,
                }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div style={{
        padding: '10px 12px',
        background: '#EDEDE9', borderTop: '1px solid #D6CCC2',
        display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0,
      }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="Message..."
          style={{
            flex: 1, background: '#F5EBE0', borderRadius: 22,
            padding: '10px 16px', fontSize: 16, color: '#16112B',
            border: '1px solid #D6CCC2', outline: 'none',
          }}
        />
        <button onClick={send} disabled={!input.trim()} style={{
          width: 36, height: 36, borderRadius: '50%',
          background: input.trim() ? '#D5BDAF' : '#E3D5CA',
          border: '1px solid #D6CCC2',
          cursor: input.trim() ? 'pointer' : 'default',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'background 0.15s',
        }}>
          <SendIcon />
        </button>
      </div>

      <BottomNav />
    </div>
  )
}
