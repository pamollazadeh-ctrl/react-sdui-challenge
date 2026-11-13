import { formatFileSize, parseFileSize } from "@/lib/fileSize";
import { messages } from "../constants/messages";
import type {
  FileFieldSchema,
  InputFieldSchema,
  SelectFieldSchema,
  TextareaFieldSchema,
} from "../schema/types";
import { matchesAccept } from "./fileRules";

/**
 * Pure validators: (value, field) -> first error message, or `undefined` when valid.
 * They hold no form-library code, so they are trivial to unit test and reuse.
 */
type Validator<Value, Field> = (
  value: Value,
  field: Field,
) => string | undefined;
type LengthRules = {
  minLength?: number | undefined;
  maxLength?: number | undefined;
};

function validateLength(text: string, { minLength, maxLength }: LengthRules) {
  if (minLength !== undefined && text.length < minLength)
    return messages.minLength(minLength);
  if (maxLength !== undefined && text.length > maxLength)
    return messages.maxLength(maxLength);
  return undefined;
}

export const validateText: Validator<
  string,
  InputFieldSchema | TextareaFieldSchema
> = (value, field) => {
  const text = value.trim();
  if (text === "") return field.required ? messages.required : undefined;
  return validateLength(text, field.props);
};

export const validateNumber: Validator<string, InputFieldSchema> = (
  value,
  field,
) => {
  const text = value.trim();
  if (text === "") return field.required ? messages.required : undefined;

  const number = Number(text);
  if (!Number.isFinite(number)) return messages.invalidNumber;

  const { min, max } = field.props;
  if (min !== undefined && number < min) return messages.min(min);
  if (max !== undefined && number > max) return messages.max(max);
  return undefined;
};

export const validateSelect: Validator<string, SelectFieldSchema> = (
  value,
  field,
) => {
  if (value === "") return field.required ? messages.required : undefined;
  // Guards against a value that is not offered (stale state, tampered DOM).
  const offered = field.props.options.some((option) => option.value === value);
  return offered ? undefined : messages.invalidOption;
};

export const validateFiles: Validator<File[], FileFieldSchema> = (
  files,
  field,
) => {
  if (files.length === 0) return field.required ? messages.required : undefined;

  const { accept, maxSize, multiple } = field.props;
  if (!multiple && files.length > 1) return messages.singleFile;

  const wrongType = files.find((file) => !matchesAccept(file, accept));
  if (wrongType) return messages.fileType(wrongType.name);

  const limit = parseFileSize(maxSize);
  const tooLarge =
    limit === undefined ? undefined : files.find((file) => file.size > limit);
  if (tooLarge && limit !== undefined) {
    return messages.fileSize(tooLarge.name, formatFileSize(limit));
  }
  return undefined;
};
