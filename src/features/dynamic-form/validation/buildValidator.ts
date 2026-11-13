import { z } from "zod";
import type { FieldSchema, FieldValue } from "../schema/types";
import {
  validateFiles,
  validateNumber,
  validateSelect,
  validateText,
} from "./validators";

/** A Zod type whose input and output are the same form value (no transforms). */
type Rule = z.ZodType<FieldValue, FieldValue>;

const text = z.string();
const files = z.array(z.instanceof(File));

/** Wraps a pure validator in a Zod type so React Hook Form's resolver can run it. */
function withRule<Value extends FieldValue>(
  base: z.ZodType<Value, Value>,
  validate: (value: Value) => string | undefined,
): Rule {
  return base.superRefine((value, context) => {
    const message = validate(value);
    if (message) context.addIssue({ code: "custom", message });
  });
}

/** Picks the rule set for one field. The `never` check makes a new field type a compile error. */
function ruleFor(field: FieldSchema): Rule {
  switch (field.type) {
    case "input":
      return field.props.type === "number"
        ? withRule(text, (value) => validateNumber(value, field))
        : withRule(text, (value) => validateText(value, field));
    case "textarea":
      return withRule(text, (value) => validateText(value, field));
    case "select":
      return withRule(text, (value) => validateSelect(value, field));
    case "file":
      return withRule(files, (value) => validateFiles(value, field));
    default:
      return field satisfies never;
  }
}

/**
 * Builds the validator for a whole form from the server's field list.
 * Validation rules are data, exactly like the fields: when the server changes a
 * rule, the form follows without a client release.
 */
export function buildValidator(fields: readonly FieldSchema[]) {
  return z.object(
    Object.fromEntries(fields.map((field) => [field.name, ruleFor(field)])),
  );
}
