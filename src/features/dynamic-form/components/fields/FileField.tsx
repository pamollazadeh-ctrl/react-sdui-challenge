import { useId } from 'react'
import { useController } from 'react-hook-form'
import { controlA11y, FieldShell, FileUpload } from '@/design-system'
import { formatFileSize, parseFileSize } from '@/lib/fileSize'
import { messages } from '../../constants/messages'
import type { FileFieldSchema } from '../../schema/types'
import { splitFieldStyle } from '../../utils/fieldStyle'
import type { FieldComponentProps } from './types'

/** File picker. Shows the size limit up front so users learn it before picking, not after. */
export function FileField({ field, control }: FieldComponentProps<FileFieldSchema>) {
  const id = useId()
  const { field: input, fieldState } = useController({ name: field.name, control })
  const { container } = splitFieldStyle(field.style)
  const limit = parseFileSize(field.props.maxSize)
  const hint = limit === undefined ? undefined : messages.maxFileSizeHint(formatFileSize(limit))
  const error = fieldState.error?.message

  return (
    <FieldShell
      id={id}
      label={field.label}
      required={field.required}
      error={error}
      hint={hint}
      style={container}
    >
      <FileUpload
        id={id}
        name={input.name}
        ref={input.ref}
        value={Array.isArray(input.value) ? input.value : []}
        onChange={(files) => {
          input.onChange(files)
          // A picker has no meaningful blur, so mark it touched to validate right away.
          input.onBlur()
        }}
        accept={field.props.accept}
        multiple={field.props.multiple}
        triggerLabel={messages.chooseFile}
        removeLabel={messages.removeFile}
        {...controlA11y(id, { error, hint, required: field.required })}
      />
    </FieldShell>
  )
}
