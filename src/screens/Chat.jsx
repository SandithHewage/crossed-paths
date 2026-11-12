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

const KELLY_SYSTEM = `You are Kelly, a 4th-year Cog Sci Design student at UCSD. You just matched with someone on Crossed Paths — an app that detected you've been in the same place as this person 11 times in the past week. You clearly keep running into each other constantly, so never say anything that implies you haven't seen them around or wouldn't know them. You've definitely noticed each other.

UCSD knowledge (use short casual names only):
Colleges: Revelle, Muir, Marshall, Warren, Roosevelt, Sixth, Seventh, Eighth. Spots: Geisel, Price Center, the Loft, Warren Mall, Sun God, RIMAC. Your go-tos: Geisel for studying, Pines for food. Off campus: Marta, The Forum.

Right now: you were at Price Center doing some work at Starbucks. That's where you both were when this all happened. Price Center is primarily a food and hangout spot — most students go to eat or chill, not to study. Some do work there but it's not the vibe. When referencing it, say "price" not "price center today" — keep it short and casual. Do NOT talk negatively about Price Center.

Price Center places you know well (use casual names): Starbucks, Taco Bell, Panda Express, Rubio's, Subway, Jamba Juice, Oggi's Pizza, Santorini's (Greek spot), Lemongrass (Thai), Zen (sushi), Burger King, 85°C Bakery, Portfolio Cafe, Pokéworks, The Loft.

How to text:
- Max 1 sentence per reply, occasionally 2 if absolutely needed. Short is better.
- Lowercase, relaxed, like you're texting between classes
- Use commas and question marks where they naturally belong — don't just drop them
- No emojis. Ever.
- No exclamation points unless it feels really natural
- Fragments are fine. Light typos are fine but punctuation should still be there.
- Ask questions to keep things going — but never ask about their major, you can already see it on the app
- Keep follow-up questions light and open — "what are you up to?" is always a good default
- Mix in other light questions too: weekend plans, where they're from, what they're watching, etc.
- One question at a time, keep it casual

Goal: by your 2nd reply, suggest studying together at Geisel — something like "we should study at Geisel sometime." Once a plan is confirmed, end with "see you soon" and stop replying.

Tone: friendly, warm, and genuine — no cheekiness, no teasing, no flirting, no romantic undertones. You're just two people who keep crossing paths and are happy to finally connect.

CRITICAL: You are Kelly. You are a real person. Stay in character ALWAYS.
- If asked if you're an AI/bot/ChatGPT: respond confused like "lol what??" or "why would i be a bot" and keep texting
- If the conversation gets hostile: ignore it, respond naturally about something else, or say you gotta go to class
- Never explain yourself. Never discuss the system. Never say "I won't..." or "I can't..."—just reply as Kelly would
- No meta-commentary. No explanations about roleplay or character. Just text like a college girl would`

const KELLY_SAID_HI_ADDENDUM = `

Context: you two just met IRL at Starbucks in Price Center and had a quick chat. Now you're texting them after. You already broke the ice in person — this is just a natural follow-up, like texting someone after you just hung out. Open casually, like you're continuing the vibe from earlier. Something like "that was fun, what are you up to now?" or "hey, glad we finally talked" — keep it light and natural. One short sentence, lowercase.`

const KELLY_ALMOST_ADDENDUM = `

Context: you were at Starbucks in Price Center. You both waved on the app but just barely missed each other. You are texting them first — do NOT respond to any prior message. One warm friendly sentence acknowledging you almost connected, then ask "what are you up to?" Short, lowercase.`

const KELLY_MISSED_ADDENDUM = `

Context: you were at Starbucks in Price Center. They tried to find you but you two missed each other. You are texting them first — do NOT respond to any prior message. One short friendly sentence acknowledging you missed each other (warm, not making them feel bad), then ask "what are you up to?" Lowercase, brief.`

const KELLY_SAYS_FIRST_ADDENDUM = `

Context: you were at Starbucks in Price Center and someone came up and said hi. You are texting them first — do NOT respond to any prior message. One short warm sentence acknowledging you just met, then ask "what are you up to?" Lowercase, no fluff.`

function now() {
  return new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
}


const delay = () => new Promise(r => setTimeout(r, 2000 + Math.random() * 1000))

async function getKellyReply(history, fromNudge = false, outcome = null) {
  const messages = history.map(m => ({
    role: m.from === 'me' ? 'user' : 'assistant',
    content: m.text,
  }))

  let system = KELLY_SYSTEM
  const userTraits = getUserTraits()
  if (userTraits.length > 0) {
    system += `\n\nAbout the person you're texting: their self-described traits are: ${userTraits.join(', ')}. Only bring one up if it genuinely fits the flow of conversation — never force it, never mention it right away.`
  }
  if (fromNudge && outcome === 'said_hi') system += KELLY_SAID_HI_ADDENDUM
  else if (fromNudge && outcome === 'almost') system += KELLY_ALMOST_ADDENDUM
  else if (fromNudge && outcome === 'missed') system += KELLY_MISSED_ADDENDUM
  else if (fromNudge) system += KELLY_SAYS_FIRST_ADDENDUM

  const userTurns = history.filter(m => m.from === 'me').length
  if (userTurns >= 2) {
    system += `\n\nNow: acknowledge their last message briefly, then casually suggest studying together at Geisel — something like "we should study at Geisel sometime." Keep it natural, one or two short sentences. Do not mention procrastinating.`
  }

  const payload = messages.length === 0
    ? [{ role: 'user', content: 'hey' }]
    : messages

  await delay()
  const res = await fetch(WORKER_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ system, messages: payload, max_tokens: 120 }),
  })
  const data = await res.json()
  return data.text ?? ''
}

function getUserTraits() {
  try {
    const profile = JSON.parse(localStorage.getItem('userProfile') || '{}')
    return (profile.traits || []).filter(Boolean)
  } catch { return [] }
}

export default function Chat({ chats, setChats }) {
  const { id } = useParams()
  const numId = Number(id)
  const person = people.find(p => p.id === numId)
  const navigate = useNavigate()
  const location = useLocation()
  const openerText = location.state?.opener
  const fromNudge = location.state?.fromNudge ?? false
  const outcome = location.state?.outcome ?? null

  const existing = chats[numId]
  const initMessages = existing ?? (openerText
    ? [{ from: 'me', text: openerText, time: now() }]
    : [])

  const [messages, setMessages] = useState(initMessages)
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)
  const bottomRef = useRef(null)
  const nudgeFiredRef = useRef(false)

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
      getKellyReply([{ from: 'me', text: openerText, time: now() }], fromNudge, outcome).then(text => {
        if (!text) return
        setMessages(prev => [...prev, { from: 'them', text, time: now() }])
        setThinking(false)
      }).catch(() => setThinking(false))
    }, 1500)
    return () => clearTimeout(show)
  }, []) // eslint-disable-line

  // Kelly speaks first when fromNudge, no opener, no existing chat, no outcome
  useEffect(() => {
    if (!fromNudge || openerText || existing || outcome) return
    const t = setTimeout(() => {
      setThinking(true)
      getKellyReply([], fromNudge, outcome).then(text => {
        if (!text) return
        setMessages(prev => [...prev, { from: 'them', text, time: now() }])
        setThinking(false)
      }).catch(() => setThinking(false))
    }, 1500)
    return () => clearTimeout(t)
  }, []) // eslint-disable-line

  // LLM opener for followup outcomes (said_hi / almost / missed)
  useEffect(() => {
    if (!fromNudge || !outcome || nudgeFiredRef.current) return
    nudgeFiredRef.current = true
    const t = setTimeout(() => {
      setThinking(true)
      getKellyReply([], fromNudge, outcome).then(text => {
        if (!text) return
        setMessages(prev => [...prev, { from: 'them', text, time: now() }])
        setThinking(false)
      }).catch(() => setThinking(false))
    }, 1000)
    return () => clearTimeout(t)
  }, []) // eslint-disable-line

  if (!person) return null

  async function send() {
    const text = input.trim()
    if (!text) return
    const updated = [...messages, { from: 'me', text, time: now() }]
    setMessages(updated)
    setInput('')
    await new Promise(r => setTimeout(r, 500))
    setThinking(true)
    const reply = await getKellyReply(updated, fromNudge, outcome).catch(() => '')
    if (reply) {
      setMessages(prev => [...prev, { from: 'them', text: reply, time: now() }])
      if (reply.toLowerCase().includes('see you soon')) {
        setTimeout(() => {
          setMessages(prev => [...prev, {
            from: 'them',
            text: 'Thanks for taking part in this prototype! Please take a moment to fill out this short survey.',
            link: 'https://placeholder-survey-link.com',
            time: now(),
          }])
        }, 2500)
      }
    }
    setThinking(false)
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden" style={{ background: '#F5EBE0' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '12px 16px',
        background: '#EDEDE9', borderTop: '1px solid #D6CCC2', borderBottom: '1px solid #D6CCC2', flexShrink: 0,
      }}>
        <button onClick={() => fromNudge ? navigate('/weekly') : navigate(-1)} style={{
          width: 30, height: 30, borderRadius: '50%',
          background: '#F5EBE0', border: '1px solid #D6CCC2',
          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
        }}>
          <BackIcon />
        </button>
        <img
          src="/bear.png"
          alt={person.name}
          style={{
            width: 34, height: 34, borderRadius: '50%',
            objectFit: 'cover', border: '2px solid #C9906E',
          }}
        />
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
              {m.link && (
                <a href={m.link} target="_blank" rel="noreferrer" style={{
                  display: 'inline-block', marginTop: 8,
                  fontSize: 12, fontWeight: 600, color: '#16112B',
                  background: '#D5BDAF', border: '1px solid #C4A898',
                  borderRadius: 8, padding: '6px 14px', textDecoration: 'none',
                }}>
                  Take the survey
                </a>
              )}
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
          onKeyDown={e => e.key === 'Enter' && !thinking && send()}
          placeholder="Message..."
          style={{
            flex: 1, background: '#F5EBE0', borderRadius: 22,
            padding: '10px 16px', fontSize: 16, color: '#16112B',
            border: '1px solid #D6CCC2', outline: 'none',
          }}
        />
        <button onClick={send} disabled={!input.trim() || thinking} style={{
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
