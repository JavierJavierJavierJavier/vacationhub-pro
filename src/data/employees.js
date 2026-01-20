export const DEPARTMENTS = [
  { id: 'tech', name: 'Tech Team', color: '#6366F1', icon: '💻' },
  { id: 'sales', name: 'Deal Origination & Sales', color: '#F59E0B', icon: '📈' },
  { id: 'capital', name: 'Capital & Structuring', color: '#10B981', icon: '💰' },
]

export const getDepartmentById = (id) => DEPARTMENTS.find(d => d.id === id)
