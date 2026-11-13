import { screen, waitFor } from '@testing-library/react'
import { delay, http, HttpResponse } from 'msw'
import { describe, expect, it, vi } from 'vitest'
import { server } from '@/mocks/server'
import { fillRequiredFields, labels, renderCarForm, submit } from '@/test/formHarness'
import { API_BASE_URL } from '../api/config'
import * as formApi from '../api/formApi'
import { messages } from '../constants/messages'

// `spy: true` keeps the real implementation and only records calls, so the
// payload can be asserted while the request still goes through the mock server.
vi.mock('../api/formApi', { spy: true })

const submitUrl = `${API_BASE_URL}/forms/:formId/submissions`
const respondWith = (body: object, status: number) =>
  server.use(http.post(submitUrl, () => HttpResponse.json(body, { status })))

describe('DynamicForm: submission', () => {
  it('sends every value, including the files, then confirms and resets the form', async () => {
    respondWith({ id: '1' }, 201)
    const user = await renderCarForm()
    await fillRequiredFields(user)
    await submit(user)

    expect(await screen.findByRole('status')).toHaveTextContent(messages.submitSucceeded)

    const [formId, data] = vi.mocked(formApi.submitForm).mock.calls[0] ?? []
    expect(formId).toBe('car')
    expect(data?.get('brand')).toBe('Saipa')
    expect(data?.get('year')).toBe('2010')
    expect(data?.get('fuel_type')).toBe('دیزل')
    expect(data?.get('color')).toBe('')
    expect(data?.getAll('car_images')).toHaveLength(1)

    expect(screen.getByLabelText(labels.brand)).toHaveValue('')
    expect(screen.queryByRole('list')).not.toBeInTheDocument()
  })

  it('disables the submit button while the request is in flight', async () => {
    server.use(
      http.post(submitUrl, async () => {
        await delay(50)
        return HttpResponse.json({ id: '1' }, { status: 201 })
      }),
    )
    const user = await renderCarForm()
    await fillRequiredFields(user)
    await submit(user)

    expect(screen.getByRole('button', { name: 'ثبت اطلاعات' })).toBeDisabled()
    await waitFor(() => expect(screen.getByRole('button', { name: 'ثبت اطلاعات' })).toBeEnabled())
    expect(formApi.submitForm).toHaveBeenCalledTimes(1)
  })

  it('keeps the entered values and shows an error when the server fails', async () => {
    respondWith({ message: 'boom' }, 500)
    const user = await renderCarForm()
    await fillRequiredFields(user)
    await submit(user)

    expect(await screen.findByRole('alert')).toHaveTextContent(messages.submitFailed)
    expect(screen.getByLabelText(labels.brand)).toHaveValue('Saipa')
  })

  it('shows server-side field errors on the fields they belong to', async () => {
    respondWith({ fieldErrors: { brand: 'این برند پشتیبانی نمی‌شود' } }, 422)
    const user = await renderCarForm()
    await fillRequiredFields(user)
    await submit(user)

    expect(await screen.findByText('این برند پشتیبانی نمی‌شود')).toBeInTheDocument()
    expect(screen.getByLabelText(labels.brand)).toBeInvalid()
    expect(screen.getByText(messages.submitRejected)).toBeInTheDocument()
  })
})
