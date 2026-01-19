export const DEPARTMENTS = [
  { id: 'tech', name: 'Tech Team', color: '#6366F1', icon: '💻' },
  { id: 'sales', name: 'Deal Origination & Sales', color: '#F59E0B', icon: '📈' },
  { id: 'capital', name: 'Capital & Structuring', color: '#10B981', icon: '💰' },
]

export const EMPLOYEES = [
  { id: 'e1', name: 'Leandro Pili', email: 'leandro.pili@alter-5.com', deptId: 'tech', role: 'employee', startDate: '2025-01-01' },
  { id: 'e2', name: 'Aaron Rodilla', email: 'aaron.rodilla@alter-5.com', deptId: 'tech', role: 'employee', startDate: '2025-09-01' },
  { id: 'e3', name: 'Lautaro Laserna', email: 'lautaro.laserna@alter-5.com', deptId: 'tech', role: 'employee', startDate: '2025-01-01' },
  { id: 'e4', name: 'Salvador Carrillo', email: 'salvador.carrillo@alter-5.com', deptId: 'sales', role: 'admin', startDate: '2025-01-01' },
  { id: 'e5', name: 'Juan Ruiz Arnal', email: 'juan.ruiz.arnal@alter-5.com', deptId: 'tech', role: 'employee', startDate: '2025-09-01' },
  { id: 'e6', name: 'Carlos Almodovar', email: 'carlos.almodovar@alter-5.com', deptId: 'sales', role: 'employee', startDate: '2025-09-01' },
  { id: 'e7', name: 'Javier Ruiz Balado', email: 'javier.ruiz@alter-5.com', deptId: 'sales', role: 'employee', startDate: '2025-01-01' },
  { id: 'e8', name: 'Miguel Solana', email: 'miguel.solana@alter-5.com', deptId: 'capital', role: 'admin', startDate: '2025-01-01' },
  { id: 'e9', name: 'Rafael Nevado', email: 'rafael.nevado@alter-5.com', deptId: 'capital', role: 'employee', startDate: '2025-01-01' },
  { id: 'e10', name: 'Gonzalo de Gracia', email: 'gonzalo.degracia@alter-5.com', deptId: 'capital', role: 'employee', startDate: '2025-07-01' },
]

// Demo credentials (in production, use proper auth)
export const CREDENTIALS = {
  'javier.ruiz@alter-5.com': 'OcPHn41$PTRr',
  'miguel.solana@alter-5.com': '!AKbfPNQ#oH$',
  'leandro.pili@alter-5.com': 'nt6rv1T3znIL',
  'aaron.rodilla@alter-5.com': 'ASL%L1SzHtRE',
  'lautaro.laserna@alter-5.com': 'L@%1j0D3urFZ',
  'salvador.carrillo@alter-5.com': 'atZ9hWCjdnVF',
  'juan.ruiz.arnal@alter-5.com': 'aa4k%rgUrt59',
  'carlos.almodovar@alter-5.com': 'YHyRnauiUXPn',
  'rafael.nevado@alter-5.com': 'Z6o8$ai1$sAQ',
  'gonzalo.degracia@alter-5.com': 'anh9XO5yQCBU',
}

export const APPROVERS = ['e4', 'e8'] // Salvador and Miguel

export const getEmployeeById = (id) => EMPLOYEES.find(e => e.id === id)
export const getEmployeeByEmail = (email) => EMPLOYEES.find(e => e.email.toLowerCase() === email.toLowerCase())
export const getDepartmentById = (id) => DEPARTMENTS.find(d => d.id === id)
export const getEmployeesByDepartment = (deptId) => EMPLOYEES.filter(e => e.deptId === deptId)
export const canApprove = (employeeId, employees = EMPLOYEES) => {
  const employee = employees.find(e => e.id === employeeId)
  return employee?.role === 'admin' || APPROVERS.includes(employeeId)
}
