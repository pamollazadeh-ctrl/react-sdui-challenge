import { fieldSchema, formEnvelopeSchema } from "./formSchema";
import type { FieldSchema, FormSchema } from "./types";

/**
 * Turns an untrusted server response into a `FormSchema`.
 *
 * - A broken envelope (no `fields` array) throws: there is nothing to render.
 * - A field that is malformed or of an unknown type is skipped with a warning.
 *   The server can ship a new field type before the client supports it, and the
 *   rest of the form must keep working.
 * - A repeated `name` keeps the first field: names are the keys of the payload.
 */
export function parseFormSchema(raw: unknown): FormSchema {
  const {
    title,
    submitLabel,
    fields: rawFields,
  } = formEnvelopeSchema.parse(raw);
  const fields: FieldSchema[] = [];
  const names = new Set<string>();

  for (const rawField of rawFields) {
    const result = fieldSchema.safeParse(rawField);
    if (!result.success) {
      console.warn("[dynamic-form] skipped an unsupported field", rawField);
      continue;
    }
    if (names.has(result.data.name)) {
      console.warn(
        `[dynamic-form] skipped duplicate field "${result.data.name}"`,
      );
      continue;
    }
    names.add(result.data.name);
    fields.push(result.data);
  }

  return { title, submitLabel, fields };
}
