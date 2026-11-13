import type { z } from "zod";
import type {
  fieldSchema,
  fileFieldSchema,
  inputFieldSchema,
  selectFieldSchema,
  textareaFieldSchema,
} from "./formSchema";

/** Types are inferred from the Zod schemas, so the runtime check and the types cannot drift. */
export type InputFieldSchema = z.infer<typeof inputFieldSchema>;
export type TextareaFieldSchema = z.infer<typeof textareaFieldSchema>;
export type SelectFieldSchema = z.infer<typeof selectFieldSchema>;
export type FileFieldSchema = z.infer<typeof fileFieldSchema>;
export type FieldSchema = z.infer<typeof fieldSchema>;

export interface FormSchema {
  title?: string | undefined;
  submitLabel?: string | undefined;
  fields: FieldSchema[];
}

/** What a field holds in form state: text-like fields keep a string, file fields keep files. */
export type FieldValue = string | File[];
export type FormValues = Record<string, FieldValue>;
