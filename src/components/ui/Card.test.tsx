import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Card, CardHeader, CardBody, CardFooter } from './Card'

describe('Card Components', () => {
  describe('Card', () => {
    it('renders children', () => {
      render(<Card>Card Content</Card>)
      expect(screen.getByText('Card Content')).toBeInTheDocument()
    })

    it('applies default classes', () => {
      const { container } = render(<Card>Test</Card>)
      const card = container.firstChild as HTMLElement
      expect(card.className).toContain('bg-white')
      expect(card.className).toContain('rounded-2xl')
    })

    it('applies custom className', () => {
      const { container } = render(<Card className="custom-class">Test</Card>)
      const card = container.firstChild as HTMLElement
      expect(card.className).toContain('custom-class')
      expect(card.textContent).toBe('Test')
    })
  })

  describe('CardHeader', () => {
    it('renders children', () => {
      render(
        <Card>
          <CardHeader>Header</CardHeader>
        </Card>
      )
      expect(screen.getByText('Header')).toBeInTheDocument()
    })

    it('renders action when provided', () => {
      render(
        <Card>
          <CardHeader action={<button>Action</button>}>Header</CardHeader>
        </Card>
      )
      expect(screen.getByText('Action')).toBeInTheDocument()
    })
  })

  describe('CardBody', () => {
    it('renders children', () => {
      render(
        <Card>
          <CardBody>Body Content</CardBody>
        </Card>
      )
      expect(screen.getByText('Body Content')).toBeInTheDocument()
    })

    it('applies custom className', () => {
      render(
        <Card>
          <CardBody className="custom-body">Body</CardBody>
        </Card>
      )
      const body = screen.getByText('Body')
      expect(body.className).toContain('custom-body')
    })
  })

  describe('CardFooter', () => {
    it('renders children', () => {
      render(
        <Card>
          <CardFooter>Footer</CardFooter>
        </Card>
      )
      expect(screen.getByText('Footer')).toBeInTheDocument()
    })
  })

  describe('Card Composition', () => {
    it('renders complete card structure', () => {
      render(
        <Card>
          <CardHeader>Title</CardHeader>
          <CardBody>Content</CardBody>
          <CardFooter>Footer</CardFooter>
        </Card>
      )
      expect(screen.getByText('Title')).toBeInTheDocument()
      expect(screen.getByText('Content')).toBeInTheDocument()
      expect(screen.getByText('Footer')).toBeInTheDocument()
    })
  })
})

