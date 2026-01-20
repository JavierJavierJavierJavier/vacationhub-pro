import express from 'express'
import { POLICIES } from '../src/data/absenceTypes.js'
import { calculateBalance, getDepartmentStats } from './reportUtils.js'
import { query } from './database.js'

export const reportRouter = express.Router()

async function getReportData(year) {
  const departmentsResult = await query(
    'SELECT id, name, color, icon FROM departments ORDER BY name'
  )
  const employeesResult = await query(
    `SELECT id, name, email, dept_id as "deptId", role, start_date as "startDate"
     FROM users
     ORDER BY name`
  )
  const requestsResult = await query(
    `SELECT id,
            employee_id as "employeeId",
            start_date as "startDate",
            end_date as "endDate",
            days,
            type,
            reason,
            status,
            request_date as "requestDate"
     FROM vacation_requests
     WHERE EXTRACT(YEAR FROM start_date) = $1
        OR EXTRACT(YEAR FROM end_date) = $1`,
    [year]
  )

  return {
    departments: departmentsResult.rows,
    employees: employeesResult.rows,
    requests: requestsResult.rows.map((request) => ({
      ...request,
      year,
    })),
  }
}

reportRouter.get('/departments', (req, res) => {
  const year = Number(req.query.year) || new Date().getFullYear()

  getReportData(year)
    .then(({ departments, employees, requests }) => {
      const stats = departments.map((dept) =>
        getDepartmentStats(dept, year, requests, employees)
      )

      return res.json({
        year,
        policies: {
          vacationDaysPerYear: POLICIES.vacationDaysPerYear,
          carryOverLimit: POLICIES.carryOverLimit,
        },
        departments: stats,
      })
    })
    .catch((error) => {
      console.error('Error loading department report:', error)
      return res.status(500).json({ success: false, error: 'No se pudo cargar el reporte' })
    })
})

reportRouter.get('/employees', (req, res) => {
  const year = Number(req.query.year) || new Date().getFullYear()

  getReportData(year)
    .then(({ employees, requests }) => {
      const payload = employees.map((emp) => {
        const balance = calculateBalance(emp, year, requests)
        return {
          id: emp.id,
          name: emp.name,
          email: emp.email,
          deptId: emp.deptId,
          balance,
        }
      })

      return res.json({
        year,
        employees: payload,
      })
    })
    .catch((error) => {
      console.error('Error loading employee report:', error)
      return res.status(500).json({ success: false, error: 'No se pudo cargar el reporte' })
    })
})


