import { Alert, Button } from '@/design-system'
import { messages } from '../constants/messages'
import { useFormSchema } from '../hooks/useFormSchema'
import styles from './DynamicForm.module.css'
import { DynamicForm } from './DynamicForm'

interface DynamicFormLoaderProps {
  formId: string
  /** Lets the page place the form title wherever its layout needs it. */
  renderTitle?: (title: string) => React.ReactNode
}

/** Fetches a form by id and renders its loading, error or ready state. */
export function DynamicFormLoader({ formId, renderTitle }: DynamicFormLoaderProps) {
  const { state, retry } = useFormSchema(formId)

  if (state.status === 'loading') {
    return (
      // <output> carries the implicit "status" role, so the wait is announced politely.
      <output className={styles.muted}>{messages.loadingForm}</output>
    )
  }

  if (state.status === 'error') {
    return (
      <div className={styles.state}>
        <Alert tone="error">{messages.loadFailed}</Alert>
        <Button variant="secondary" onClick={retry}>
          {messages.retry}
        </Button>
      </div>
    )
  }

  const { schema } = state
  return (
    <>
      {schema.title && renderTitle?.(schema.title)}
      <DynamicForm formId={formId} schema={schema} />
    </>
  )
}
