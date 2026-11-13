import { useId } from 'react'
import { useController } from 'react-hook-form'
import { controlA11y, FieldShell, SelectBox } from '@/design-system'
import { messages } from '../../constants/messages'
import type { SelectFieldSchema } from '../../schema/types'
import { splitFieldStyle } from '../../utils/fieldStyle'
import type { FieldComponentProps } from './types'

/** Single-choice select fed by the server's option list. */
export function SelectField({ field, control }: FieldComponentProps<SelectFieldSchema>) {
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
      <SelectBox
        id={id}
        name={input.name}
        ref={input.ref}
        value={typeof input.value === 'string' ? input.value : ''}
        onChange={input.onChange}
        onBlur={input.onBlur}
        options={field.props.options}
        placeholder={field.props.placeholder ?? messages.selectPlaceholder}
        style={controlStyle}
        {...controlA11y(id, { error, required: field.required })}
      />
    </FieldShell>
  )
}
