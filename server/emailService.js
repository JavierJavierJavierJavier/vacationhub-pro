import nodemailer from 'nodemailer'

const envTrim = (value) => (typeof value === 'string' ? value.trim() : value)
const resolvedPort = Number.parseInt(envTrim(process.env.SMTP_PORT) || '587', 10)
const safePort = Number.isFinite(resolvedPort) ? resolvedPort : 587
const secureFlag = envTrim(process.env.SMTP_SECURE) === 'true' || safePort === 465
const resendApiKey = envTrim(process.env.RESEND_API_KEY)

// Configuración del transporter de email
// En producción, usar variables de entorno para credenciales reales
const transporter = nodemailer.createTransport({
  host: envTrim(process.env.SMTP_HOST) || 'smtp.gmail.com',
  port: safePort,
  secure: secureFlag, // true para 465, false para otros puertos
  auth: {
    user: envTrim(process.env.SMTP_USER) || 'noreply@alter-5.com',
    pass: envTrim(process.env.SMTP_PASS) || 'your-password-here',
  },
  // Para desarrollo, usar un servicio como Ethereal Email o Mailtrap
  // O configurar Gmail con "App Passwords"
})

async function sendViaResend({ to, subject, html, text }) {
  const fromEmail = envTrim(process.env.SMTP_FROM) || 'onboarding@resend.dev'
  const payload = {
    from: `VacationHub Alter-5 <${fromEmail}>`,
    to,
    subject,
    html,
    text,
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const errorBody = await response.text()
    throw new Error(`Resend API error: ${response.status} ${errorBody}`)
  }

  const data = await response.json()
  console.log('✅ Email enviado (Resend):', data.id)
  return { success: true, messageId: data.id }
}

/**
 * Envía un email usando nodemailer
 */
export async function sendEmail({ to, subject, html, text }) {
  try {
    if (resendApiKey) {
      return await sendViaResend({ to, subject, html, text })
    }

    // En desarrollo, si no hay credenciales configuradas, solo loguear
    if (!process.env.SMTP_USER || process.env.SMTP_USER === 'noreply@alter-5.com' || !process.env.SMTP_PASS || process.env.SMTP_PASS === 'your-password-here') {
      console.log('📧 [DEV MODE] Email que se enviaría:')
      console.log('To:', to)
      console.log('Subject:', subject)
      console.log('Body:', text || html)
      return { success: true, messageId: 'dev-mode' }
    }

    // Para Mailtrap, usar un email válido en "from" (Mailtrap acepta cualquier email)
    const fromEmail = process.env.SMTP_FROM || (process.env.SMTP_USER?.includes('@') ? process.env.SMTP_USER : 'vacaciones@alter-5.com')
    const info = await transporter.sendMail({
      from: `"VacationHub Alter-5" <${fromEmail}>`,
      to,
      subject,
      html,
      text,
    })

    console.log('✅ Email enviado:', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('❌ Error enviando email:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Verifica la conexión del servicio de email
 */
export async function verifyEmailConnection() {
  try {
    if (resendApiKey) {
      console.log('✅ Servidor de email listo (Resend API)')
      return true
    }

    await transporter.verify()
    console.log('✅ Servidor de email listo')
    return true
  } catch (error) {
    console.warn('⚠️ No se pudo verificar el servidor de email:', error.message)
    console.warn('⚠️ Los emails se mostrarán en consola en modo desarrollo')
    return false
  }
}

