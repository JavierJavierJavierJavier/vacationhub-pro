import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Button from './Button'

describe('Button', () => {
  it('renders with children', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('applies primary variant by default', () => {
    render(<Button>Test</Button>)
    const button = screen.getByRole('button')
    expect(button.className).toContain('from-emerald-500')
  })

  it('applies correct variant classes', () => {
    const { rerender } = render(<Button variant="danger">Test</Button>)
    let button = screen.getByRole('button')
    expect(button.className).toContain('bg-red-500')

    rerender(<Button variant="secondary">Test</Button>)
    button = screen.getByRole('button')
    expect(button.className).toContain('bg-white')
  })

  it('applies correct size classes', () => {
    const { rerender } = render(<Button size="sm">Test</Button>)
    let button = screen.getByRole('button')
    expect(button.className).toContain('px-3')

    rerender(<Button size="lg">Test</Button>)
    button = screen.getByRole('button')
    expect(button.className).toContain('px-6')
  })

  it('handles click events', async () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    
    const button = screen.getByRole('button')
    await userEvent.click(button)
    
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>)
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    expect(button.className).toContain('disabled:opacity-50')
  })

  it('does not call onClick when disabled', async () => {
    const handleClick = vi.fn()
    render(<Button disabled onClick={handleClick}>Disabled</Button>)
    
    const button = screen.getByRole('button')
    await userEvent.click(button)
    
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('applies custom className', () => {
    render(<Button className="custom-class">Test</Button>)
    const button = screen.getByRole('button')
    expect(button.className).toContain('custom-class')
  })

  it('uses correct type attribute', () => {
    const { rerender } = render(<Button type="submit">Submit</Button>)
    let button = screen.getByRole('button')
    expect(button).toHaveAttribute('type', 'submit')

    rerender(<Button type="button">Button</Button>)
    button = screen.getByRole('button')
    expect(button).toHaveAttribute('type', 'button')
  })
})

