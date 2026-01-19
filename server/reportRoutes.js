import express from 'express'
import { EMPLOYEES, DEPARTMENTS } from '../src/data/employees.js'
import { POLICIES } from '../src/data/absenceTypes.js'
import { calculateBalance, getDepartmentStats } from './reportUtils.js'
import { INITIAL_REQUESTS } from '../src/data/initialRequests.js'

export const reportRouter = express.Router()

// En un entorno real, las requests vendrían de una BBDD; aquí usamos INITIAL_REQUESTS
const ALL_REQUESTS = INITIAL_REQUESTS

reportRouter.get('/departments', (req, res) => {
  const year = Number(req.query.year) || new Date().getFullYear()

  const stats = DEPARTMENTS.map((dept) =>
    getDepartmentStats(dept, year, ALL_REQUESTS)
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

reportRouter.get('/employees', (req, res) => {
  const year = Number(req.query.year) || new Date().getFullYear()

  const employees = EMPLOYEES.map((emp) => {
    const balance = calculateBalance(emp.id, year, ALL_REQUESTS)
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
    employees,
  })
})


