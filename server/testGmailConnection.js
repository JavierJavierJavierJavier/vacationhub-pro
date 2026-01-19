import nodemailer from 'nodemailer'

console.log('🔍 DIAGNÓSTICO DETALLADO DE GMAIL')
console.log('=====================================\n')

console.log('📧 Configuración actual:')
console.log('  SMTP_HOST:', process.env.SMTP_HOST || 'smtp.gmail.com')
console.log('  SMTP_PORT:', process.env.SMTP_PORT || 587)
console.log('  SMTP_USER:', process.env.SMTP_USER || 'NO CONFIGURADO')
console.log('  SMTP_PASS length:', process.env.SMTP_PASS ? process.env.SMTP_PASS.length : 'NO CONFIGURADO')
console.log('  SMTP_PASS (primeros 4 chars):', process.env.SMTP_PASS ? process.env.SMTP_PASS.substring(0, 4) + '...' : 'NO CONFIGURADO')
console.log('')

// Verificar si es Google Workspace
const email = process.env.SMTP_USER || ''
const isGoogleWorkspace = email.includes('@alter-5.com') || email.includes('@') && !email.includes('@gmail.com')

if (isGoogleWorkspace) {
  console.log('⚠️  DETECTADO: Google Workspace (@alter-5.com)')
  console.log('   Google Workspace puede requerir configuración adicional.\n')
}

console.log('🧪 Probando conexión...\n')

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  debug: true, // Activar debug
  logger: true, // Activar logger
})

transporter.verify()
  .then(() => {
    console.log('✅ ¡CONEXIÓN EXITOSA!')
    console.log('   El servidor de email está configurado correctamente.')
    process.exit(0)
  })
  .catch((error) => {
    console.log('❌ ERROR DE CONEXIÓN')
    console.log('   Mensaje:', error.message)
    console.log('')
    
    if (error.message.includes('Invalid login') || error.message.includes('535')) {
      console.log('🔍 POSIBLES CAUSAS:')
      console.log('   1. La contraseña de aplicación no es correcta')
      console.log('   2. La contraseña tiene espacios o caracteres extra')
      console.log('   3. Google Workspace requiere configuración adicional')
      console.log('   4. La cuenta no tiene "Permitir aplicaciones menos seguras" activado')
      console.log('   5. La contraseña de aplicación fue revocada')
      console.log('')
      console.log('💡 SOLUCIONES:')
      console.log('   1. Verifica que copiaste la contraseña completa (16 caracteres)')
      console.log('   2. Prueba sin espacios: quita los espacios de la contraseña')
      console.log('   3. Genera una nueva contraseña de aplicación')
      console.log('   4. Verifica que activaste 2-Step Verification')
      console.log('   5. Si es Google Workspace, contacta al administrador')
    }
    
    process.exit(1)
  })
