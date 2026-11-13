import { useCallback, useEffect, useState } from 'react'
import { fetchFormSchema } from '../api/formApi'
import type { FormSchema } from '../schema/types'

export type FormSchemaState =
  { status: 'loading' } | { status: 'error' } | { status: 'success'; schema: FormSchema }

/**
 * Loads a form schema and exposes it as an explicit state machine, so the UI
 * cannot render "loading" and "error" at the same time.
 * The request is aborted on unmount or when `formId` changes, which also keeps
 * a slow, stale response from overwriting a newer one.
 * Mount it with `key={formId}` when the id can change, so each form starts in "loading".
 */
export function useFormSchema(formId: string) {
  const [state, setState] = useState<FormSchemaState>({ status: 'loading' })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    fetchFormSchema(formId, controller.signal)
      .then((schema) => setState({ status: 'success', schema }))
      .catch((error: unknown) => {
        if (controller.signal.aborted) return
        console.error('[dynamic-form] failed to load the form schema', error)
        setState({ status: 'error' })
      })

    return () => controller.abort()
    // `attempt` is not read by the effect: bumping it is how `retry` re-runs the request.
    // oxlint-disable-next-line react/exhaustive-deps
  }, [formId, attempt])

  const retry = useCallback(() => {
    setState({ status: 'loading' })
    setAttempt((count) => count + 1)
  }, [])

  return { state, retry }
}
