import { Alert, Button } from '@/design-system'
import { messages } from '../constants/messages'
import { useDynamicForm } from '../hooks/useDynamicForm'
import type { FormSchema } from '../schema/types'
import styles from './DynamicForm.module.css'
import { FieldRenderer } from './FieldRenderer'

interface DynamicFormProps {
  formId: string
  schema: FormSchema
}

/** Renders a parsed schema as a form. Behaviour lives in `useDynamicForm`. */
export function DynamicForm({ formId, schema }: DynamicFormProps) {
  const { control, onSubmit, isSubmitting, result } = useDynamicForm(formId, schema.fields)

  if (schema.fields.length === 0) return <p className={styles.muted}>{messages.emptyForm}</p>

  return (
    <form
      className={styles.form}
      // Native validation bubbles are disabled: our messages are localised and accessible.
      noValidate
      aria-busy={isSubmitting}
      onSubmit={(event) => void onSubmit(event)}
    >
      {schema.fields.map((field) => (
        <FieldRenderer key={field.name} field={field} control={control} />
      ))}

      {result.status === 'success' && <Alert tone="success">{messages.submitSucceeded}</Alert>}
      {result.status === 'error' && <Alert tone="error">{result.message}</Alert>}

      <div className={styles.actions}>
        <Button type="submit" loading={isSubmitting}>
          {schema.submitLabel ?? messages.submit}
        </Button>
      </div>
    </form>
  )
}
