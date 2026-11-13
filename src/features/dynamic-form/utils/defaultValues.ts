import type { FieldSchema, FormValues } from "../schema/types";

/**
 * Initial form state. Every field gets a defined value so inputs are controlled
 * from the first render (React warns when a control flips from uncontrolled).
 */
export function buildDefaultValues(fields: readonly FieldSchema[]): FormValues {
  return Object.fromEntries(
    fields.map((field) => [field.name, field.type === "file" ? [] : ""]),
  );
}
