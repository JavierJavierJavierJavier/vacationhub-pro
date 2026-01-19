import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Badge from './Badge'

describe('Badge', () => {
  it('renders children', () => {
    render(<Badge>Test Badge</Badge>)
    expect(screen.getByText('Test Badge')).toBeInTheDocument()
  })

  it('applies default variant', () => {
    render(<Badge>Default</Badge>)
    const badge = screen.getByText('Default')
    expect(badge.className).toContain('bg-slate-100')
  })

  it('applies correct variant classes', () => {
    const { rerender } = render(<Badge variant="success">Success</Badge>)
    let badge = screen.getByText('Success')
    expect(badge.className).toContain('bg-emerald-100')

    rerender(<Badge variant="danger">Danger</Badge>)
    badge = screen.getByText('Danger')
    expect(badge.className).toContain('bg-red-100')

    rerender(<Badge variant="warning">Warning</Badge>)
    badge = screen.getByText('Warning')
    expect(badge.className).toContain('bg-amber-100')
  })

  it('applies custom className', () => {
    render(<Badge className="custom-badge">Test</Badge>)
    const badge = screen.getByText('Test')
    expect(badge.className).toContain('custom-badge')
  })

  it('has correct base classes', () => {
    render(<Badge>Test</Badge>)
    const badge = screen.getByText('Test')
    expect(badge.className).toContain('inline-flex')
    expect(badge.className).toContain('rounded-full')
    expect(badge.className).toContain('font-semibold')
  })
})

