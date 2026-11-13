import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { describe, expect, it, vi } from 'vitest'
import { server } from '@/mocks/server'
import { labels, renderCarForm } from '@/test/formHarness'
import { API_BASE_URL } from '../api/config'
import { messages } from '../constants/messages'
import { DynamicFormLoader } from './DynamicFormLoader'

const formUrl = `${API_BASE_URL}/forms/:formId`

describe('DynamicFormLoader: rendering from the server schema', () => {
  it('shows a loading status, then the form title and one control per field', async () => {
    render(<DynamicFormLoader formId="car" renderTitle={(title) => <h1>{title}</h1>} />)
    expect(screen.getByRole('status')).toHaveTextContent(messages.loadingForm)

    expect(await screen.findByRole('heading', { name: 'ثبت مشخصات خودرو' })).toBeInTheDocument()
    expect(screen.getAllByRole('textbox')).toHaveLength(4)
    expect(screen.getAllByRole('spinbutton')).toHaveLength(2)
    expect(screen.getByRole('combobox', { name: labels.fuel })).toBeInTheDocument()
    expect(screen.getByLabelText(labels.images)).toHaveAttribute('type', 'file')
  })

  it('applies server props: placeholder, options, number range and file rules', async () => {
    await renderCarForm()

    expect(screen.getByLabelText(labels.brand)).toHaveAttribute(
      'placeholder',
      'برند ماشین را وارد کنید',
    )
    expect(screen.getByLabelText(labels.year)).toHaveAttribute('max', '2024')
    expect(screen.getByRole('option', { name: 'الکتریکی' })).toBeInTheDocument()
    expect(screen.getByLabelText(labels.images)).toHaveAttribute('accept', 'image/*')
    expect(screen.getByLabelText(labels.images)).toHaveAttribute('multiple')
    expect(screen.getByText(messages.maxFileSizeHint('5 MB'))).toBeInTheDocument()
  })

  it('marks required fields for assistive technology', async () => {
    await renderCarForm()
    expect(screen.getByLabelText(labels.brand)).toBeRequired()
    expect(screen.getByLabelText(/رنگ ماشین/)).not.toBeRequired()
  })

  it('renders whatever fields the server sends, with no client change', async () => {
    const fields = [{ type: 'textarea', name: 'bio', label: 'About you', props: { rows: 2 } }]
    server.use(http.get(formUrl, () => HttpResponse.json({ submitLabel: 'Save', fields })))

    render(<DynamicFormLoader formId="profile" />)

    expect(await screen.findByLabelText('About you')).toHaveAttribute('rows', '2')
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument()
  })

  it('shows an empty state when the form has no fields', async () => {
    server.use(http.get(formUrl, () => HttpResponse.json({ fields: [] })))
    render(<DynamicFormLoader formId="car" />)
    expect(await screen.findByText(messages.emptyForm)).toBeInTheDocument()
  })

  it('shows an error with a retry that loads the form again', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined)
    server.use(http.get(formUrl, () => HttpResponse.json({}, { status: 500 }), { once: true }))
    const user = userEvent.setup()
    render(<DynamicFormLoader formId="car" />)

    expect(await screen.findByRole('alert')).toHaveTextContent(messages.loadFailed)
    await user.click(screen.getByRole('button', { name: messages.retry }))

    expect(await screen.findByLabelText(labels.brand)).toBeInTheDocument()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})
