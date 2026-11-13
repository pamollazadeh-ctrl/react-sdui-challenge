import { screen, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { image, labels, renderCarForm, submit } from '@/test/formHarness'
import * as formApi from '../api/formApi'
import { messages } from '../constants/messages'

vi.mock('../api/formApi', { spy: true })

/** The error message linked to a control through `aria-describedby`. */
const errorOf = (label: RegExp) => screen.getByLabelText(label).getAttribute('aria-describedby')

describe('DynamicForm: validation', () => {
  it('blocks submission and flags every required field', async () => {
    const user = await renderCarForm()
    await submit(user)

    expect(await screen.findAllByText(messages.required)).toHaveLength(5)
    expect(screen.getByLabelText(labels.brand)).toBeInvalid()
    expect(formApi.submitForm).not.toHaveBeenCalled()
  })

  it('links each error to its control and moves focus to the first invalid field', async () => {
    const user = await renderCarForm()
    await submit(user)

    const brand = await screen.findByLabelText(labels.brand)
    expect(document.getElementById(errorOf(labels.brand) ?? '')).toHaveTextContent(
      messages.required,
    )
    expect(brand).toHaveFocus()
  })

  it('validates a field on blur and clears the error once it is fixed', async () => {
    const user = await renderCarForm()
    const brand = screen.getByLabelText(labels.brand)

    await user.type(brand, 'a')
    await user.tab()
    expect(await screen.findByText(messages.minLength(2))).toBeInTheDocument()

    await user.type(brand, 'b')
    expect(screen.queryByText(messages.minLength(2))).not.toBeInTheDocument()
    expect(brand).toBeValid()
  })

  it('enforces the number range sent by the server', async () => {
    const user = await renderCarForm()
    await user.type(screen.getByLabelText(labels.year), '1800')
    await user.tab()
    expect(await screen.findByText(messages.min(1900))).toBeInTheDocument()
  })

  it('rejects a file of a format the field does not accept', async () => {
    // `applyAccept: false` simulates drag-and-drop, which bypasses the dialog filter.
    const user = await renderCarForm({ applyAccept: false })
    const pdf = new File(['%PDF'], 'cv.pdf', { type: 'application/pdf' })

    await user.upload(screen.getByLabelText(labels.images), pdf)

    expect(await screen.findByText(messages.fileType('cv.pdf'))).toBeInTheDocument()
  })

  it('rejects a file above the size limit', async () => {
    const user = await renderCarForm()
    const big = image('big.png')
    Object.defineProperty(big, 'size', { value: 5 * 1024 * 1024 + 1 })

    await user.upload(screen.getByLabelText(labels.images), big)

    expect(await screen.findByText(messages.fileSize('big.png', '5 MB'))).toBeInTheDocument()
  })

  it('lists selected files and lets the user remove one', async () => {
    const user = await renderCarForm()
    const input = screen.getByLabelText(labels.images)
    await user.upload(input, [image('front.png'), image('back.png')])

    const list = screen.getByRole('list')
    expect(within(list).getAllByRole('listitem')).toHaveLength(2)

    await user.click(screen.getByRole('button', { name: messages.removeFile('front.png') }))
    expect(within(list).getAllByRole('listitem')).toHaveLength(1)
    expect(within(list).getByText('back.png')).toBeInTheDocument()
  })
})
