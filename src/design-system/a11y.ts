/** Ids are derived from the control id so the shell and the control always agree. */
export const errorIdFor = (id: string): string => `${id}-error`;
export const hintIdFor = (id: string): string => `${id}-hint`;

interface ControlState {
  error?: string | undefined;
  hint?: string | undefined;
  required?: boolean | undefined;
}

/**
 * ARIA attributes that link a control to the message `FieldShell` renders for it,
 * so screen readers announce the error or hint together with the field.
 */
export function controlA11y(
  id: string,
  { error, hint, required }: ControlState,
) {
  const describedBy = error ? errorIdFor(id) : hint ? hintIdFor(id) : undefined;
  return {
    "aria-invalid": error ? true : undefined,
    "aria-describedby": describedBy,
    "aria-required": required ? true : undefined,
  } as const;
}
