import { z } from "zod";

/**
 * Contract of the "get form" response, validated at the network boundary.
 * The server sends numbers as strings ("2024"), so numeric rules are coerced here
 * once and the rest of the app works with real numbers.
 *
 * Additions to the sample response (the task allows restructuring): `required`,
 * `minLength` / `maxLength`, and an optional top-level `title` / `submitLabel`.
 */
const optionalNumber = z.coerce.number().optional();

const baseField = {
  name: z.string().min(1),
  label: z.string(),
  required: z.boolean().default(false),
  style: z.record(z.string(), z.union([z.string(), z.number()])).optional(),
};

export const inputFieldSchema = z.object({
  ...baseField,
  type: z.literal("input"),
  props: z.object({
    type: z.enum(["text", "number"]).default("text"),
    placeholder: z.string().optional(),
    size: z.enum(["small", "medium", "large"]).default("medium"),
    color: z.string().optional(),
    min: optionalNumber,
    max: optionalNumber,
    minLength: optionalNumber,
    maxLength: optionalNumber,
  }),
});

export const textareaFieldSchema = z.object({
  ...baseField,
  type: z.literal("textarea"),
  props: z.object({
    placeholder: z.string().optional(),
    rows: optionalNumber,
    cols: optionalNumber,
    minLength: optionalNumber,
    maxLength: optionalNumber,
  }),
});

export const selectFieldSchema = z.object({
  ...baseField,
  type: z.literal("select"),
  props: z.object({
    placeholder: z.string().optional(),
    options: z.array(z.object({ label: z.string(), value: z.string() })).min(1),
  }),
});

export const fileFieldSchema = z.object({
  ...baseField,
  type: z.literal("file"),
  props: z.object({
    accept: z.string().optional(),
    maxSize: z.union([z.string(), z.number()]).optional(),
    multiple: z.boolean().default(false),
  }),
});

export const fieldSchema = z.discriminatedUnion("type", [
  inputFieldSchema,
  textareaFieldSchema,
  selectFieldSchema,
  fileFieldSchema,
]);

export const formEnvelopeSchema = z.object({
  title: z.string().optional(),
  submitLabel: z.string().optional(),
  // Fields are parsed one by one in `parseFormSchema`, so one bad field cannot sink the form.
  fields: z.array(z.unknown()),
});
