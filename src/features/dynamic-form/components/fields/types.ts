import type { Control } from 'react-hook-form'
import type { FieldSchema, FormValues } from '../../schema/types'

/** Props every field component receives: its own schema slice and the form control. */
export interface FieldComponentProps<Field extends FieldSchema> {
  field: Field
  control: Control<FormValues>
}
