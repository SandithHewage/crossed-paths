let _zone = null
const _callbacks = {}
let _waveTimer = null

export function setUserZone(zone) {
  _zone = zone
  logEvent('zone_set', { zone })
}

export function getUserZone() {
  return _zone
}

export function sendWave(personId) {
  logEvent('wave_sent', { personId })
  const delay = 2000 + Math.random() * 2000
  _waveTimer = setTimeout(() => {
    logEvent('wave_back', { personId })
    _callbacks.waveBack?.({ personId })
  }, delay)
}

export function cancelWave() {
  clearTimeout(_waveTimer)
}

export function onNearbyMatch(cb) {
  _callbacks.nearbyMatch = cb
}

export function onWaveBack(cb) {
  _callbacks.waveBack = cb
}

export function onLogUpdate(cb) {
  _callbacks.logUpdate = cb
}

export function logEvent(type, payload = {}) {
  const event = { type, payload, ts: Date.now() }
  try {
    const existing = JSON.parse(localStorage.getItem('xpath_sayhi_log') || '[]')
    existing.push(event)
    localStorage.setItem('xpath_sayhi_log', JSON.stringify(existing))
  } catch {}
  _callbacks.logUpdate?.()
}

export function getLog() {
  try {
    return JSON.parse(localStorage.getItem('xpath_sayhi_log') || '[]')
  } catch {
    return []
  }
}

export function clearLog() {
  localStorage.removeItem('xpath_sayhi_log')
  _callbacks.logUpdate?.()
}
