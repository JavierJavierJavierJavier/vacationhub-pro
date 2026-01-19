export const PORT = process.env.PORT || 4000

if (!process.env.JWT_SECRET) {
  // En entorno real, forzarías a configurarlo y no pondrías un valor por defecto
  // Aquí dejamos un fallback para desarrollo.
  // eslint-disable-next-line no-console
  console.warn('JWT_SECRET no definido, usando valor por defecto SOLO para desarrollo')
}

export const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me'


