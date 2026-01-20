import express from 'express'
import bcrypt from 'bcrypt'
import { authenticateJWT } from './authMiddleware.js'
import * as userRepo from './userRepository.js'

export const employeeRouter = express.Router()

function requireAdmin(req, res, next) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ success: false, error: 'Acceso solo para administradores' })
  }
  next()
}

employeeRouter.get('/employees', authenticateJWT, async (_req, res) => {
  try {
    const employees = await userRepo.getAllUsers()
    return res.json({ success: true, employees })
  } catch (error) {
    console.error('Error loading employees:', error)
    return res.status(500).json({ success: false, error: 'No se pudo cargar empleados' })
  }
})

employeeRouter.post('/employees', authenticateJWT, requireAdmin, async (req, res) => {
  try {
    const { name, email, deptId, role, startDate, password } = req.body || {}

    if (!name || !email || !deptId) {
      return res.status(400).json({ success: false, error: 'Nombre, email y departamento requeridos' })
    }

    const passwordHash = password ? await bcrypt.hash(password, 10) : null

    const user = await userRepo.createUser({
      name,
      email,
      deptId,
      role,
      startDate,
      passwordHash,
    })

    return res.json({ success: true, employee: user })
  } catch (error) {
    console.error('Error creating employee:', error)
    return res.status(500).json({ success: false, error: 'No se pudo crear empleado' })
  }
})

employeeRouter.patch('/employees/:id', authenticateJWT, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params
    const updates = req.body || {}

    if (updates.password) {
      updates.passwordHash = await bcrypt.hash(updates.password, 10)
      delete updates.password
    }

    const employee = await userRepo.updateUser(id, updates)
    if (!employee) {
      return res.status(404).json({ success: false, error: 'Empleado no encontrado' })
    }

    return res.json({ success: true, employee })
  } catch (error) {
    console.error('Error updating employee:', error)
    return res.status(500).json({ success: false, error: 'No se pudo actualizar empleado' })
  }
})

employeeRouter.delete('/employees/:id', authenticateJWT, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params
    await userRepo.deleteUser(id)
    return res.json({ success: true })
  } catch (error) {
    console.error('Error deleting employee:', error)
    return res.status(500).json({ success: false, error: 'No se pudo eliminar empleado' })
  }
})
