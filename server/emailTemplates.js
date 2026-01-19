/**
 * Plantillas de email para notificaciones de vacaciones
 */

export function getNewRequestEmailTemplate({ employeeName, startDate, endDate, days, reason, requestId }) {
  const subject = `Nueva solicitud de vacaciones - ${employeeName}`
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #10B981 0%, #059669 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
        .info-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10B981; }
        .button { display: inline-block; padding: 12px 24px; background: #10B981; color: white; text-decoration: none; border-radius: 6px; margin: 10px 5px; }
        .button-danger { background: #EF4444; }
        .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🏖️ Nueva Solicitud de Vacaciones</h1>
        </div>
        <div class="content">
          <p>Hola,</p>
          <p><strong>${employeeName}</strong> ha solicitado días de vacaciones que requieren tu aprobación.</p>
          
          <div class="info-box">
            <h3>Detalles de la solicitud:</h3>
            <p><strong>Empleado:</strong> ${employeeName}</p>
            <p><strong>Fecha inicio:</strong> ${startDate}</p>
            <p><strong>Fecha fin:</strong> ${endDate}</p>
            <p><strong>Días solicitados:</strong> ${days} día${days !== 1 ? 's' : ''}</p>
            ${reason ? `<p><strong>Motivo:</strong> ${reason}</p>` : ''}
          </div>
          
          <p style="text-align: center;">
            <a href="${process.env.APP_URL || 'http://localhost:5173'}/approvals" class="button">Ver Solicitud</a>
          </p>
          
          <p style="color: #EF4444; font-weight: bold; margin-top: 20px;">
            ⏰ Por favor, responde en las próximas 24 horas.
          </p>
        </div>
        <div class="footer">
          <p>VacationHub - Alter-5</p>
          <p>Este es un email automático, por favor no responder.</p>
        </div>
      </div>
    </body>
    </html>
  `
  
  const text = `
Nueva Solicitud de Vacaciones

${employeeName} ha solicitado días de vacaciones que requieren tu aprobación.

Detalles:
- Empleado: ${employeeName}
- Fecha inicio: ${startDate}
- Fecha fin: ${endDate}
- Días solicitados: ${days} día${days !== 1 ? 's' : ''}
${reason ? `- Motivo: ${reason}` : ''}

Por favor, responde en las próximas 24 horas.
Accede a: ${process.env.APP_URL || 'http://localhost:5173'}/approvals
  `
  
  return { subject, html, text }
}

export function getReminderEmailTemplate({ employeeName, startDate, endDate, days, requestId, reminderNumber }) {
  const reminderText = reminderNumber === 1 ? 'primer recordatorio' : 'segundo recordatorio'
  const subject = `⏰ Recordatorio: Solicitud de vacaciones pendiente - ${employeeName}`
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
        .info-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #F59E0B; }
        .button { display: inline-block; padding: 12px 24px; background: #F59E0B; color: white; text-decoration: none; border-radius: 6px; margin: 10px 5px; }
        .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>⏰ Recordatorio: Solicitud Pendiente</h1>
        </div>
        <div class="content">
          <p>Hola,</p>
          <p>Esta es una notificación de <strong>${reminderText}</strong> sobre una solicitud de vacaciones que aún está pendiente de aprobación.</p>
          
          <div class="info-box">
            <h3>Detalles de la solicitud:</h3>
            <p><strong>Empleado:</strong> ${employeeName}</p>
            <p><strong>Fecha inicio:</strong> ${startDate}</p>
            <p><strong>Fecha fin:</strong> ${endDate}</p>
            <p><strong>Días solicitados:</strong> ${days} día${days !== 1 ? 's' : ''}</p>
          </div>
          
          <p style="text-align: center;">
            <a href="${process.env.APP_URL || 'http://localhost:5173'}/approvals" class="button">Revisar Solicitud</a>
          </p>
          
          <p style="color: #EF4444; font-weight: bold; margin-top: 20px;">
            ⚠️ Esta solicitud lleva más de ${reminderNumber * 24} horas esperando tu respuesta.
          </p>
        </div>
        <div class="footer">
          <p>VacationHub - Alter-5</p>
          <p>Este es un email automático, por favor no responder.</p>
        </div>
      </div>
    </body>
    </html>
  `
  
  const text = `
Recordatorio: Solicitud de Vacaciones Pendiente

Esta es una notificación de ${reminderText} sobre una solicitud de vacaciones que aún está pendiente de aprobación.

Detalles:
- Empleado: ${employeeName}
- Fecha inicio: ${startDate}
- Fecha fin: ${endDate}
- Días solicitados: ${days} día${days !== 1 ? 's' : ''}

Esta solicitud lleva más de ${reminderNumber * 24} horas esperando tu respuesta.
Accede a: ${process.env.APP_URL || 'http://localhost:5173'}/approvals
  `
  
  return { subject, html, text }
}

export function getApprovalEmailTemplate({ employeeName, startDate, endDate, days, reviewerName }) {
  const subject = `✅ Tu solicitud de vacaciones ha sido aprobada`
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #10B981 0%, #059669 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
        .info-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10B981; }
        .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✅ Solicitud Aprobada</h1>
        </div>
        <div class="content">
          <p>Hola <strong>${employeeName}</strong>,</p>
          <p>¡Buenas noticias! Tu solicitud de vacaciones ha sido <strong>aprobada</strong> por ${reviewerName}.</p>
          
          <div class="info-box">
            <h3>Detalles de tus vacaciones:</h3>
            <p><strong>Fecha inicio:</strong> ${startDate}</p>
            <p><strong>Fecha fin:</strong> ${endDate}</p>
            <p><strong>Días aprobados:</strong> ${days} día${days !== 1 ? 's' : ''}</p>
          </div>
          
          <p>¡Disfruta de tus vacaciones! 🏖️</p>
        </div>
        <div class="footer">
          <p>VacationHub - Alter-5</p>
          <p>Este es un email automático, por favor no responder.</p>
        </div>
      </div>
    </body>
    </html>
  `
  
  const text = `
Solicitud de Vacaciones Aprobada

Hola ${employeeName},

¡Buenas noticias! Tu solicitud de vacaciones ha sido aprobada por ${reviewerName}.

Detalles:
- Fecha inicio: ${startDate}
- Fecha fin: ${endDate}
- Días aprobados: ${days} día${days !== 1 ? 's' : ''}

¡Disfruta de tus vacaciones!
  `
  
  return { subject, html, text }
}

export function getRejectionEmailTemplate({ employeeName, startDate, endDate, days, reviewerName, rejectionReason }) {
  const subject = `❌ Tu solicitud de vacaciones ha sido rechazada`
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #EF4444 0%, #DC2626 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
        .info-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #EF4444; }
        .reason-box { background: #FEF2F2; padding: 15px; border-radius: 6px; margin: 15px 0; }
        .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>❌ Solicitud Rechazada</h1>
        </div>
        <div class="content">
          <p>Hola <strong>${employeeName}</strong>,</p>
          <p>Lamentamos informarte que tu solicitud de vacaciones ha sido <strong>rechazada</strong> por ${reviewerName}.</p>
          
          <div class="info-box">
            <h3>Detalles de la solicitud:</h3>
            <p><strong>Fecha inicio:</strong> ${startDate}</p>
            <p><strong>Fecha fin:</strong> ${endDate}</p>
            <p><strong>Días solicitados:</strong> ${days} día${days !== 1 ? 's' : ''}</p>
          </div>
          
          ${rejectionReason ? `
          <div class="reason-box">
            <h4>Motivo del rechazo:</h4>
            <p>${rejectionReason}</p>
          </div>
          ` : ''}
          
          <p>Si tienes alguna pregunta, por favor contacta con ${reviewerName}.</p>
        </div>
        <div class="footer">
          <p>VacationHub - Alter-5</p>
          <p>Este es un email automático, por favor no responder.</p>
        </div>
      </div>
    </body>
    </html>
  `
  
  const text = `
Solicitud de Vacaciones Rechazada

Hola ${employeeName},

Lamentamos informarte que tu solicitud de vacaciones ha sido rechazada por ${reviewerName}.

Detalles:
- Fecha inicio: ${startDate}
- Fecha fin: ${endDate}
- Días solicitados: ${days} día${days !== 1 ? 's' : ''}
${rejectionReason ? `\nMotivo del rechazo:\n${rejectionReason}` : ''}

Si tienes alguna pregunta, por favor contacta con ${reviewerName}.
  `
  
  return { subject, html, text }
}

