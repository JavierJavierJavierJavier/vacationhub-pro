import express from 'express'
import { authenticateJWT } from './authMiddleware.js'
import * as requestRepo from './requestRepository.js'

export const requestRouter = express.Router()

requestRouter.get('/requests', authenticateJWT, async (req, res) => {
  try {
    const year = Number(req.query.year) || new Date().getFullYear()
    const isAdmin = req.user?.role === 'admin'
    const employeeId = isAdmin ? null : req.user?.sub
    const requests = await requestRepo.getRequestsByYear(year, employeeId)
    return res.json({ success: true, requests })
  } catch (error) {
    console.error('Error loading requests:', error)
    return res.status(500).json({ success: false, error: 'No se pudieron cargar solicitudes' })
  }
})

requestRouter.post('/requests', authenticateJWT, async (req, res) => {
  try {
    const { employeeId, startDate, endDate, days, type, reason, backup } = req.body || {}
    if (!employeeId || !startDate || !endDate || !days || !type) {
      return res.status(400).json({ success: false, error: 'Datos incompletos' })
    }

    const isAdmin = req.user?.role === 'admin'
    if (!isAdmin && employeeId !== req.user?.sub) {
      return res.status(403).json({ success: false, error: 'No autorizado' })
    }

    const request = await requestRepo.createRequest({
      employeeId,
      startDate,
      endDate,
      days,
      type,
      reason,
      backup,
    })

    return res.json({ success: true, request })
  } catch (error) {
    console.error('Error creating request:', error)
    return res.status(500).json({ success: false, error: 'No se pudo crear la solicitud' })
  }
})

requestRouter.patch('/requests/:id', authenticateJWT, async (req, res) => {
  try {
    const { id } = req.params
    const { status, rejectionReason } = req.body || {}

    if (!status) {
      return res.status(400).json({ success: false, error: 'Estado requerido' })
    }

    const isAdmin = req.user?.role === 'admin'
    if (!isAdmin) {
      return res.status(403).json({ success: false, error: 'No autorizado' })
    }

    const request = await requestRepo.updateRequestStatus({
      id,
      status,
      reviewerId: req.user?.sub,
      rejectionReason,
    })

    if (!request) {
      return res.status(404).json({ success: false, error: 'Solicitud no encontrada' })
    }

    return res.json({ success: true, request })
  } catch (error) {
    console.error('Error updating request:', error)
    return res.status(500).json({ success: false, error: 'No se pudo actualizar la solicitud' })
  }
})

requestRouter.delete('/requests/:id', authenticateJWT, async (req, res) => {
  try {
    const { id } = req.params
    const isAdmin = req.user?.role === 'admin'
    if (!isAdmin) {
      const requests = await requestRepo.getRequestsByYear(new Date().getFullYear(), req.user?.sub)
      const target = requests.find((r) => r.id === id)
      if (!target || target.status !== 'pending') {
        return res.status(403).json({ success: false, error: 'No autorizado' })
      }
    }

    await requestRepo.deleteRequest(id)
    return res.json({ success: true })
  } catch (error) {
    console.error('Error deleting request:', error)
    return res.status(500).json({ success: false, error: 'No se pudo eliminar la solicitud' })
  }
})
