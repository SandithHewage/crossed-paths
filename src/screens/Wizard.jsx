import { people } from '../data/people'

export default function Wizard({ appState, setAppState, openToday, nudge, setNudge, log, addLog }) {
  const kelly = people.find(p => p.id === 1)
  const kellyConnected = !!appState.connected?.[1]
  const nudgeActive = nudge.active

  function simulateKellyOptIn() {
    setAppState(prev => ({ ...prev, connected: { ...prev.connected, 1: true } }))
    addLog('opt_in', 1)
  }

  function triggerNudge() {
    if (!openToday || !kellyConnected) return
    setNudge({ active: true, personId: 1, phase: 'nudge' })
    addLog('nudge_shown', 1)
  }

  function fastForwardFollowup() {
    setNudge(prev => ({ ...prev, active: true, personId: prev.personId ?? 1, phase: 'followup' }))
  }

  function exportLog() {
    const blob = new Blob([JSON.stringify(log, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'crossed-paths-log.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const canTrigger = openToday && kellyConnected && !nudgeActive
  const canFastForward = nudge.active && nudge.phase === 'inperson'

  return (
    <div style={{
      minHeight: '100%', background: '#F5EBE0', padding: '24px 20px',
      display: 'flex', flexDirection: 'column', gap: 20, overflowY: 'auto',
    }}>
      <div>
        <p style={{ fontSize: 11, fontWeight: 600, color: '#9B8C84', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>
          Facilitator Panel
        </p>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: '#16112B', letterSpacing: '-0.3px' }}>
          Wizard Controls
        </h1>
      </div>

      {/* Status */}
      <div style={{ background: '#EDEDE9', borderRadius: 14, padding: '14px 16px', border: '1px solid #D6CCC2' }}>
        <p style={{ fontSize: 12, fontWeight: 600, color: '#9B8C84', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Status</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 13.5, color: '#16112B', fontWeight: 500 }}>Sophie: Open today</span>
            <StatusBadge on={openToday} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 13.5, color: '#16112B', fontWeight: 500 }}>Kelly: opted in</span>
            <StatusBadge on={kellyConnected} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 13.5, color: '#16112B', fontWeight: 500 }}>Nudge active</span>
            <StatusBadge on={nudgeActive} />
          </div>
          {nudgeActive && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 13.5, color: '#16112B', fontWeight: 500 }}>Phase</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#6B5C55', background: '#E3D5CA', padding: '3px 10px', borderRadius: 999 }}>
                {nudge.phase}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div style={{ background: '#EDEDE9', borderRadius: 14, padding: '14px 16px', border: '1px solid #D6CCC2' }}>
        <p style={{ fontSize: 12, fontWeight: 600, color: '#9B8C84', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Actions</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <WizardButton
            label="Simulate Kelly opted in"
            onClick={simulateKellyOptIn}
            disabled={kellyConnected}
          />
          <WizardButton
            label="Trigger nudge"
            onClick={triggerNudge}
            disabled={!canTrigger}
            disabledReason={!openToday ? 'Open today is off' : !kellyConnected ? 'Kelly not opted in' : nudgeActive ? 'Nudge already active' : null}
          />
          <WizardButton
            label="Fast-forward to follow-up"
            onClick={fastForwardFollowup}
            disabled={!canFastForward}
            disabledReason={!nudge.active ? 'No active nudge' : nudge.phase !== 'inperson' ? `Phase is '${nudge.phase}'` : null}
          />
        </div>
      </div>

      {/* Event log */}
      <div style={{ background: '#EDEDE9', borderRadius: 14, padding: '14px 16px', border: '1px solid #D6CCC2', flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: '#9B8C84', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Event Log ({log.length})
          </p>
          <button
            onClick={exportLog}
            disabled={log.length === 0}
            style={{
              fontSize: 11, fontWeight: 600, color: log.length > 0 ? '#16112B' : '#D6CCC2',
              background: log.length > 0 ? '#E3D5CA' : '#F5EBE0',
              border: '1px solid #D6CCC2', borderRadius: 8,
              padding: '4px 10px', cursor: log.length > 0 ? 'pointer' : 'default',
            }}
          >
            Export JSON
          </button>
        </div>

        {log.length === 0 ? (
          <p style={{ fontSize: 13, color: '#D5BDAF', textAlign: 'center', padding: '12px 0' }}>No events yet</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr 60px', gap: 8, marginBottom: 6 }}>
              {['Time', 'Event', 'Person'].map(h => (
                <span key={h} style={{ fontSize: 10, fontWeight: 700, color: '#9B8C84', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</span>
              ))}
            </div>
            {[...log].reverse().map((entry, i) => (
              <div key={i} style={{
                display: 'grid', gridTemplateColumns: '60px 1fr 60px', gap: 8,
                padding: '6px 0', borderTop: '1px solid #D6CCC2',
              }}>
                <span style={{ fontSize: 11, color: '#9B8C84', fontVariantNumeric: 'tabular-nums' }}>{entry.timestamp}</span>
                <span style={{ fontSize: 12, color: '#16112B', fontWeight: 500 }}>{entry.event}</span>
                <span style={{ fontSize: 12, color: '#6B5C55' }}>
                  {people.find(p => p.id === entry.personId)?.name ?? '—'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function StatusBadge({ on }) {
  return (
    <span style={{
      fontSize: 12, fontWeight: 600,
      color: on ? '#065F46' : '#6B5C55',
      background: on ? '#D1FAE5' : '#E3D5CA',
      padding: '3px 10px', borderRadius: 999,
      border: `1px solid ${on ? '#A7F3D0' : '#D6CCC2'}`,
    }}>
      {on ? '✓' : '✗'}
    </span>
  )
}

function WizardButton({ label, onClick, disabled, disabledReason }) {
  return (
    <div>
      <button
        onClick={onClick}
        disabled={disabled}
        style={{
          width: '100%', padding: '12px 0', borderRadius: 12,
          background: disabled ? '#F5EBE0' : '#D5BDAF',
          color: disabled ? '#D6CCC2' : '#16112B',
          fontSize: 13.5, fontWeight: 600,
          border: `1px solid ${disabled ? '#E3D5CA' : '#D6CCC2'}`,
          cursor: disabled ? 'default' : 'pointer',
        }}
      >
        {label}
      </button>
      {disabled && disabledReason && (
        <p style={{ fontSize: 11, color: '#D5BDAF', marginTop: 3, textAlign: 'center' }}>{disabledReason}</p>
      )}
    </div>
  )
}
