import { useId } from 'react'
import { useController } from 'react-hook-form'
import { controlA11y, FieldShell, TextArea } from '@/design-system'
import type { TextareaFieldSchema } from '../../schema/types'
import { splitFieldStyle } from '../../utils/fieldStyle'
import type { FieldComponentProps } from './types'

/**
 * Multi-line text. `cols` from the server is ignored on purpose: the control is
 * always full width so the form stays responsive.
 */
export function TextareaField({ field, control }: FieldComponentProps<TextareaFieldSchema>) {
  const id = useId()
  const { field: input, fieldState } = useController({ name: field.name, control })
  const { container, control: controlStyle } = splitFieldStyle(field.style)
  const error = fieldState.error?.message

  return (
    <FieldShell
      id={id}
      label={field.label}
      required={field.required}
      error={error}
      style={container}
    >
      <TextArea
        id={id}
        name={input.name}
        ref={input.ref}
        value={typeof input.value === 'string' ? input.value : ''}
        onChange={input.onChange}
        onBlur={input.onBlur}
        placeholder={field.props.placeholder}
        rows={field.props.rows}
        maxLength={field.props.maxLength}
        style={controlStyle}
        {...controlA11y(id, { error, required: field.required })}
      />
    </FieldShell>
  )
}
