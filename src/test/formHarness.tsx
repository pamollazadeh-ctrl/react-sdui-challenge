import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DynamicFormLoader } from '@/features/dynamic-form'

/** Labels of the mocked car form, as a user reads them. */
export const labels = {
  brand: /برند/,
  model: /مدل/,
  year: /سال ساخت/,
  fuel: /نوع سوخت/,
  images: /تصاویر ماشین/,
} as const

export const image = (name = 'car.png') => new File(['pixels'], name, { type: 'image/png' })

type UserOptions = Parameters<typeof userEvent.setup>[0]

/** Renders the car form through the real loader and waits until it is ready. */
export async function renderCarForm(options?: UserOptions) {
  const user = userEvent.setup(options)
  render(<DynamicFormLoader formId="car" renderTitle={(title) => <h1>{title}</h1>} />)
  await screen.findByRole('button', { name: 'ثبت اطلاعات' })
  return user
}

/** Fills every required field with a valid value. */
export async function fillRequiredFields(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(labels.brand), 'Saipa')
  await user.type(screen.getByLabelText(labels.model), 'Pride')
  await user.type(screen.getByLabelText(labels.year), '2010')
  await user.selectOptions(screen.getByLabelText(labels.fuel), 'دیزل')
  await user.upload(screen.getByLabelText(labels.images), image())
}

export const submit = (user: ReturnType<typeof userEvent.setup>) =>
  user.click(screen.getByRole('button', { name: 'ثبت اطلاعات' }))
