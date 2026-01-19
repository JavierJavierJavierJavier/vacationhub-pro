import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import FilterBar from './FilterBar'

describe('FilterBar', () => {
  it('renders select filter', () => {
    const filters = [
      {
        id: 'status',
        type: 'select',
        label: 'Status',
        value: 'all',
        onChange: vi.fn(),
        options: [
          { value: 'all', label: 'All' },
          { value: 'pending', label: 'Pending' },
        ],
      },
    ]

    render(<FilterBar filters={filters} />)
    expect(screen.getByText('Status')).toBeInTheDocument()
    expect(screen.getByRole('combobox')).toBeInTheDocument()
  })

  it('renders segmented filter', () => {
    const filters = [
      {
        id: 'type',
        type: 'segmented',
        label: 'Type',
        value: 'all',
        onChange: vi.fn(),
        options: [
          { value: 'all', label: 'All' },
          { value: 'approved', label: 'Approved' },
        ],
      },
    ]

    render(<FilterBar filters={filters} />)
    expect(screen.getByText('Type')).toBeInTheDocument()
    expect(screen.getByText('All')).toBeInTheDocument()
    expect(screen.getByText('Approved')).toBeInTheDocument()
  })

  it('calls onChange when select value changes', async () => {
    const handleChange = vi.fn()
    const filters = [
      {
        id: 'status',
        type: 'select',
        label: 'Status',
        value: 'all',
        onChange: handleChange,
        options: [
          { value: 'all', label: 'All' },
          { value: 'pending', label: 'Pending' },
        ],
      },
    ]

    render(<FilterBar filters={filters} />)
    const select = screen.getByRole('combobox')
    await userEvent.selectOptions(select, 'pending')
    expect(handleChange).toHaveBeenCalledWith('pending')
  })

  it('calls onChange when segmented button is clicked', async () => {
    const handleChange = vi.fn()
    const filters = [
      {
        id: 'type',
        type: 'segmented',
        label: 'Type',
        value: 'all',
        onChange: handleChange,
        options: [
          { value: 'all', label: 'All' },
          { value: 'approved', label: 'Approved' },
        ],
      },
    ]

    render(<FilterBar filters={filters} />)
    const approvedButton = screen.getByText('Approved')
    await userEvent.click(approvedButton)
    expect(handleChange).toHaveBeenCalledWith('approved')
  })

  it('highlights active segmented button', () => {
    const filters = [
      {
        id: 'type',
        type: 'segmented',
        value: 'approved',
        onChange: vi.fn(),
        options: [
          { value: 'all', label: 'All' },
          { value: 'approved', label: 'Approved' },
        ],
      },
    ]

    render(<FilterBar filters={filters} />)
    const approvedButton = screen.getByText('Approved')
    expect(approvedButton.className).toContain('bg-emerald-500')
  })

  it('renders multiple filters', () => {
    const filters = [
      {
        id: 'status',
        type: 'select',
        label: 'Status',
        value: 'all',
        onChange: vi.fn(),
        options: [{ value: 'all', label: 'All' }],
      },
      {
        id: 'type',
        type: 'segmented',
        label: 'Type',
        value: 'all',
        onChange: vi.fn(),
        options: [{ value: 'all', label: 'All' }],
      },
    ]

    render(<FilterBar filters={filters} />)
    expect(screen.getByText('Status')).toBeInTheDocument()
    expect(screen.getByText('Type')).toBeInTheDocument()
  })

  it('renders filter without label', () => {
    const filters = [
      {
        id: 'status',
        type: 'select',
        value: 'all',
        onChange: vi.fn(),
        options: [{ value: 'all', label: 'All' }],
      },
    ]

    render(<FilterBar filters={filters} />)
    expect(screen.queryByText('Status')).not.toBeInTheDocument()
    expect(screen.getByRole('combobox')).toBeInTheDocument()
  })
})

