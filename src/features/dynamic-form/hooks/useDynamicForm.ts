import { useMemo, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { submitForm } from '../api/formApi'
import { ApiError } from '../api/http'
import { messages } from '../constants/messages'
import type { FieldSchema, FormValues } from '../schema/types'
import { buildDefaultValues } from '../utils/defaultValues'
import { toFormData } from '../utils/toFormData'
import { buildValidator } from '../validation/buildValidator'

export type SubmitResult =
  { status: 'idle' } | { status: 'success' } | { status: 'error'; message: string }

/**
 * All form behaviour (state, validation, submission) in one hook, so
 * `DynamicForm` only renders. Validation runs on blur, then on every change once
 * a field has an error: feedback is early but never shown while first typing.
 */
export function useDynamicForm(formId: string, fields: readonly FieldSchema[]) {
  const [result, setResult] = useState<SubmitResult>({ status: 'idle' })
  const resolver = useMemo(() => zodResolver(buildValidator(fields)), [fields])
  const defaultValues = useMemo(() => buildDefaultValues(fields), [fields])
  const form = useForm<FormValues>({ resolver, defaultValues, mode: 'onTouched' })

  const onSubmit = form.handleSubmit(async (values) => {
    setResult({ status: 'idle' })
    try {
      await submitForm(formId, toFormData(values))
      form.reset(defaultValues)
      setResult({ status: 'success' })
    } catch (error) {
      const fieldErrors = error instanceof ApiError ? Object.entries(error.fieldErrors) : []
      // Server-side rejections are shown on the fields they belong to.
      for (const [name, message] of fieldErrors) form.setError(name, { type: 'server', message })
      const message = fieldErrors.length > 0 ? messages.submitRejected : messages.submitFailed
      setResult({ status: 'error', message })
    }
  })

  return {
    control: form.control,
    onSubmit,
    isSubmitting: form.formState.isSubmitting,
    result,
  }
}
