import '@testing-library/jest-dom'
import { vi } from 'vitest'

global.fetch = vi.fn((input) => {
  const url = typeof input === 'string' ? input : input?.url || ''
  if (url.includes('/api/requests')) {
    return Promise.resolve({
      ok: true,
      json: async () => ({ success: true, requests: [] }),
    })
  }
  if (url.includes('/api/employees')) {
    return Promise.resolve({
      ok: true,
      json: async () => ({ success: true, employees: [] }),
    })
  }
  return Promise.resolve({
    ok: true,
    json: async () => ({ success: true }),
  })
})


