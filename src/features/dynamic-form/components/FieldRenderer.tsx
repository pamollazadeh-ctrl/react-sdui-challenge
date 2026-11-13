import type { Control } from 'react-hook-form'
import type { FieldSchema, FormValues } from '../schema/types'
import { FileField } from './fields/FileField'
import { InputField } from './fields/InputField'
import { SelectField } from './fields/SelectField'
import { TextareaField } from './fields/TextareaField'

interface FieldRendererProps {
  field: FieldSchema
  control: Control<FormValues>
}

/**
 * The one place that maps a schema `type` to a component.
 * A `switch` (instead of a lookup object) lets TypeScript narrow `field` for each
 * component without casts, and the `never` check turns a forgotten type into a
 * compile error. Adding a field type = one schema variant, one component, one case.
 */
export function FieldRenderer({ field, control }: FieldRendererProps) {
  switch (field.type) {
    case 'input':
      return <InputField field={field} control={control} />
    case 'textarea':
      return <TextareaField field={field} control={control} />
    case 'select':
      return <SelectField field={field} control={control} />
    case 'file':
      return <FileField field={field} control={control} />
    default:
      return field satisfies never
  }
}
