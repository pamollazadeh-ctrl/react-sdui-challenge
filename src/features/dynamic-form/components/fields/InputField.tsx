import { useId } from 'react'
import { useController } from 'react-hook-form'
import { controlA11y, FieldShell, TextInput } from '@/design-system'
import type { InputFieldSchema } from '../../schema/types'
import { splitFieldStyle } from '../../utils/fieldStyle'
import type { FieldComponentProps } from './types'

/** Text or number input. Maps the server's `size` / `color` onto the design-system input. */
export function InputField({ field, control }: FieldComponentProps<InputFieldSchema>) {
  const id = useId()
  const { field: input, fieldState } = useController({ name: field.name, control })
  const { container, control: controlStyle } = splitFieldStyle(field.style)
  const { type, placeholder, size, color, min, max, maxLength } = field.props
  const error = fieldState.error?.message

  return (
    <FieldShell
      id={id}
      label={field.label}
      required={field.required}
      error={error}
      style={container}
    >
      <TextInput
        id={id}
        name={input.name}
        ref={input.ref}
        value={typeof input.value === 'string' ? input.value : ''}
        onChange={input.onChange}
        onBlur={input.onBlur}
        type={type}
        inputMode={type === 'number' ? 'numeric' : undefined}
        placeholder={placeholder}
        size={size}
        min={min}
        max={max}
        maxLength={maxLength}
        style={{ ...controlStyle, color }}
        {...controlA11y(id, { error, required: field.required })}
      />
    </FieldShell>
  )
}
