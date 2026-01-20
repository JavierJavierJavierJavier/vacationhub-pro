import crypto from 'crypto'
import { query } from './database.js'

function normalizeRequestRow(row) {
  return {
    id: row.id,
    employeeId: row.employeeId,
    startDate: row.startDate,
    endDate: row.endDate,
    days: row.days,
    type: row.type,
    reason: row.reason,
    status: row.status,
    requestDate: row.requestDate,
    backup: row.backup,
    reviewedBy: row.reviewedBy,
    reviewedAt: row.reviewedAt,
    rejectionReason: row.rejectionReason,
  }
}

export async function getRequestsByYear(year, employeeId = null) {
  const params = [year]
  let filter = 'WHERE (EXTRACT(YEAR FROM start_date) = $1 OR EXTRACT(YEAR FROM end_date) = $1)'
  if (employeeId) {
    params.push(employeeId)
    filter += ` AND employee_id = $${params.length}`
  }

  const result = await query(
    `SELECT id,
            employee_id as "employeeId",
            TO_CHAR(start_date, 'YYYY-MM-DD') as "startDate",
            TO_CHAR(end_date, 'YYYY-MM-DD') as "endDate",
            days,
            type,
            reason,
            status,
            TO_CHAR(request_date, 'YYYY-MM-DD') as "requestDate",
            backup_employee_id as "backup",
            reviewed_by as "reviewedBy",
            reviewed_at as "reviewedAt",
            rejection_reason as "rejectionReason"
     FROM vacation_requests
     ${filter}
     ORDER BY request_date DESC`,
    params
  )

  return result.rows.map(normalizeRequestRow)
}

export async function createRequest({
  employeeId,
  startDate,
  endDate,
  days,
  type,
  reason,
  backup,
}) {
  const id = crypto.randomUUID()
  const result = await query(
    `INSERT INTO vacation_requests
     (id, employee_id, start_date, end_date, days, type, reason, status, backup_employee_id)
     VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending', $8)
     RETURNING id,
               employee_id as "employeeId",
               TO_CHAR(start_date, 'YYYY-MM-DD') as "startDate",
               TO_CHAR(end_date, 'YYYY-MM-DD') as "endDate",
               days,
               type,
               reason,
               status,
               TO_CHAR(request_date, 'YYYY-MM-DD') as "requestDate",
               backup_employee_id as "backup",
               reviewed_by as "reviewedBy",
               reviewed_at as "reviewedAt",
               rejection_reason as "rejectionReason"`,
    [id, employeeId, startDate, endDate, days, type, reason || null, backup || null]
  )

  return normalizeRequestRow(result.rows[0])
}

export async function updateRequestStatus({
  id,
  status,
  reviewerId,
  rejectionReason,
}) {
  const reviewedAt = status === 'approved' || status === 'rejected'
    ? new Date().toISOString()
    : null
  const result = await query(
    `UPDATE vacation_requests
     SET status = $1,
         reviewed_by = $2,
         reviewed_at = $3,
         rejection_reason = $4,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = $5
     RETURNING id,
               employee_id as "employeeId",
               TO_CHAR(start_date, 'YYYY-MM-DD') as "startDate",
               TO_CHAR(end_date, 'YYYY-MM-DD') as "endDate",
               days,
               type,
               reason,
               status,
               TO_CHAR(request_date, 'YYYY-MM-DD') as "requestDate",
               backup_employee_id as "backup",
               reviewed_by as "reviewedBy",
               reviewed_at as "reviewedAt",
               rejection_reason as "rejectionReason"`,
    [status, reviewerId, reviewedAt, rejectionReason || null, id]
  )

  return result.rows[0] ? normalizeRequestRow(result.rows[0]) : null
}

export async function deleteRequest(id) {
  await query('DELETE FROM vacation_requests WHERE id = $1', [id])
  return true
}
