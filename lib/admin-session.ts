import { createHmac, timingSafeEqual } from 'crypto'

export const ADMIN_COOKIE = 'admin_session'
export const ADMIN_SESSION_MAX_AGE = 60 * 60 * 24 * 7

function getAdminSessionSecret() {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || ''
}

function buildSignature(payload: string) {
  return createHmac('sha256', getAdminSessionSecret()).update(payload).digest('hex')
}

export function createAdminSessionValue(now = Date.now()) {
  const payload = String(now)
  const signature = buildSignature(payload)
  return `${payload}.${signature}`
}

export function verifyAdminSessionValue(value?: string | null) {
  if (!value) return false

  const [timestamp, signature] = value.split('.')
  if (!timestamp || !signature || !getAdminSessionSecret()) {
    return false
  }

  const expected = buildSignature(timestamp)
  const actualBuffer = Buffer.from(signature)
  const expectedBuffer = Buffer.from(expected)

  if (actualBuffer.length !== expectedBuffer.length) {
    return false
  }

  if (!timingSafeEqual(actualBuffer, expectedBuffer)) {
    return false
  }

  const issuedAt = Number(timestamp)
  if (!Number.isFinite(issuedAt)) {
    return false
  }

  return Date.now() - issuedAt < ADMIN_SESSION_MAX_AGE * 1000
}
