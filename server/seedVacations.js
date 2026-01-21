import crypto from 'crypto'
import { pathToFileURL } from 'url'
import { query, testConnection } from './database.js'

const REVIEWER_EMAIL = process.env.REVIEWER_EMAIL || 'miguel.solana@alter-5.com'

const VACATIONS = [
  {
    email: 'leandro.pili@alter-5.com',
    dates: [
      '2025-12-18', '2025-12-19', '2025-12-22', '2025-12-23', '2025-12-24', '2025-12-26',
      '2026-01-15', '2026-01-16', '2026-01-19', '2026-01-20', '2026-01-21', '2026-01-22', '2026-01-23',
    ],
  },
  {
    email: 'javier.ruiz@alter-5.com',
    dates: [
      '2025-04-14', '2025-04-15', '2025-04-16',
      '2025-04-21', '2025-04-22', '2025-04-23', '2025-04-24', '2025-04-25',
      '2025-07-07', '2025-07-08',
      '2025-08-06', '2025-08-07', '2025-08-08',
      '2025-08-11', '2025-08-12', '2025-08-13',
    ],
  },
  {
    email: 'lautaro.laserna@alter-5.com',
    dates: [
      '2025-07-14', '2025-07-15',
      '2025-11-24', '2025-11-25', '2025-11-26', '2025-11-27', '2025-11-28',
      '2025-12-18', '2025-12-19', '2025-12-22', '2025-12-23', '2025-12-24', '2025-12-26', '2025-12-29', '2025-12-30', '2025-12-31',
      '2026-01-02', '2026-01-05', '2026-01-20', '2026-01-22', '2026-01-27', '2026-01-28', '2026-01-29',
    ],
  },
  {
    email: 'carlos.almodovar@alter-5.com',
    dates: [
      '2025-12-29', '2025-12-30',
      '2026-01-05',
    ],
  },
  {
    email: 'rafael.nevado@alter-5.com',
    dates: [
      '2025-08-11', '2025-08-12', '2025-08-13', '2025-08-14',
      '2025-08-18', '2025-08-19', '2025-08-20', '2025-08-21',
      '2025-08-25', '2025-08-26',
      '2025-12-22', '2025-12-23', '2025-12-24',
      '2025-12-29', '2025-12-30', '2025-12-31',
    ],
  },
  {
    email: 'gonzalo.degracia@alter-5.com',
    dates: [
      '2025-08-04', '2025-08-05', '2025-08-06', '2025-08-07', '2025-08-08',
      '2025-08-11', '2025-08-12', '2025-08-13', '2025-08-14',
      '2025-12-29', '2025-12-30', '2025-12-31',
      '2026-01-02',
    ],
  },
]

function groupConsecutiveDates(dates) {
  const sorted = [...dates].sort()
  const ranges = []
  let start = sorted[0]
  let prev = sorted[0]

  for (let i = 1; i < sorted.length; i += 1) {
    const current = sorted[i]
    const prevDate = new Date(prev)
    prevDate.setDate(prevDate.getDate() + 1)
    const nextIso = prevDate.toISOString().slice(0, 10)

    if (current === nextIso) {
      prev = current
      continue
    }

    ranges.push({ start, end: prev })
    start = current
    prev = current
  }

  ranges.push({ start, end: prev })
  return ranges
}

async function getUserIdByEmail(email) {
  const result = await query('SELECT id FROM users WHERE email = $1', [email])
  return result.rows[0]?.id || null
}

async function insertRequest({ employeeId, startDate, endDate, days, reviewerId }) {
  const existing = await query(
    `SELECT id FROM vacation_requests
     WHERE employee_id = $1 AND start_date = $2 AND end_date = $3`,
    [employeeId, startDate, endDate]
  )
  if (existing.rows.length > 0) {
    return { status: 'skipped' }
  }

  const id = crypto.randomUUID()
  await query(
    `INSERT INTO vacation_requests
     (id, employee_id, start_date, end_date, days, type, reason, status, request_date, reviewed_by, reviewed_at)
     VALUES ($1, $2, $3, $4, $5, 'vacation', $6, 'approved', $7, $8, $9)`,
    [
      id,
      employeeId,
      startDate,
      endDate,
      days,
      'Vacaciones disfrutadas',
      startDate,
      reviewerId,
      new Date().toISOString(),
    ]
  )
  return { status: 'created' }
}

export async function seedVacations() {
  const connected = await testConnection()
  if (!connected) {
    throw new Error('No se pudo conectar a la base de datos')
  }

  const reviewerId = await getUserIdByEmail(REVIEWER_EMAIL)
  if (!reviewerId) {
    throw new Error(`Reviewer no encontrado: ${REVIEWER_EMAIL}`)
  }

  let created = 0
  let skipped = 0

  for (const entry of VACATIONS) {
    if (!entry.dates.length) continue
    const employeeId = await getUserIdByEmail(entry.email)
    if (!employeeId) {
      console.warn(`⚠️ Usuario no encontrado: ${entry.email}`)
      continue
    }
    const ranges = groupConsecutiveDates(entry.dates)
    for (const range of ranges) {
      const days = entry.dates.filter((d) => d >= range.start && d <= range.end).length
      const result = await insertRequest({
        employeeId,
        startDate: range.start,
        endDate: range.end,
        days,
        reviewerId,
      })
      if (result.status === 'created') {
        created += 1
      } else {
        skipped += 1
      }
    }
  }

  return { created, skipped }
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  seedVacations()
    .then(({ created, skipped }) => {
      console.log('✅ Precarga completada')
      console.log(`🆕 Creadas: ${created}`)
      console.log(`⏭️ Omitidas: ${skipped}`)
    })
    .catch((error) => {
      console.error('❌ Error precargando vacaciones:', error)
      process.exit(1)
    })
}
