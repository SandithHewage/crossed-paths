import { useState, useEffect } from 'react'
import { getLog, clearLog, onLogUpdate } from '../lib/presence'

export default function Log() {
  const [log, setLog] = useState(() => getLog())

  useEffect(() => {
    onLogUpdate(() => setLog(getLog()))
  }, [])

  function handleCopy() {
    navigator.clipboard.writeText(JSON.stringify(log, null, 2)).catch(() => {})
  }

  function handleClear() {
    clearLog()
  }

  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden',
      background: '#16112B', color: '#F5EBE0', fontFamily: 'monospace',
    }}>
      <div style={{
        display: 'flex', gap: 10, padding: '12px 16px',
        borderBottom: '1px solid rgba(255,255,255,0.1)', flexShrink: 0,
      }}>
        <p style={{ flex: 1, fontSize: 13, fontWeight: 600, color: '#F5EBE0' }}>Event Log</p>
        <button onClick={handleCopy} style={{
          padding: '5px 12px', fontSize: 12,
          background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: 8, color: '#F5EBE0', cursor: 'pointer',
        }}>
          Copy JSON
        </button>
        <button onClick={handleClear} style={{
          padding: '5px 12px', fontSize: 12,
          background: 'rgba(255,100,100,0.15)', border: '1px solid rgba(255,100,100,0.3)',
          borderRadius: 8, color: '#F5EBE0', cursor: 'pointer',
        }}>
          Clear
        </button>
      </div>
      <div style={{ flex: 1, overflow: 'auto', padding: 16 }}>
        <pre style={{ fontSize: 11, lineHeight: 1.6, margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
          {JSON.stringify(log, null, 2)}
        </pre>
      </div>
    </div>
  )
}
