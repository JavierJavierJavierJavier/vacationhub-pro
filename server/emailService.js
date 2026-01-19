import nodemailer from 'nodemailer'

// Configuración del transporter de email
// En producción, usar variables de entorno para credenciales reales
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false, // true para 465, false para otros puertos
  auth: {
    user: process.env.SMTP_USER || 'noreply@alter-5.com',
    pass: process.env.SMTP_PASS || 'your-password-here',
  },
  // Para desarrollo, usar un servicio como Ethereal Email o Mailtrap
  // O configurar Gmail con "App Passwords"
})

/**
 * Envía un email usando nodemailer
 */
export async function sendEmail({ to, subject, html, text }) {
  try {
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
    await transporter.verify()
    console.log('✅ Servidor de email listo')
    return true
  } catch (error) {
    console.warn('⚠️ No se pudo verificar el servidor de email:', error.message)
    console.warn('⚠️ Los emails se mostrarán en consola en modo desarrollo')
    return false
  }
}

