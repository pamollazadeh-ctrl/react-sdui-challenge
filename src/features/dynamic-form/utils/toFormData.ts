import type { FormValues } from "../schema/types";

/**
 * Packages form values as `multipart/form-data`, the only encoding that carries
 * files and text in one request. Text is trimmed (it was validated trimmed) and
 * each file is appended under its field name, so a multi-file field becomes a
 * repeated key the server reads with `getAll(name)`.
 */
export function toFormData(values: FormValues): FormData {
  const formData = new FormData();

  for (const [name, value] of Object.entries(values)) {
    if (typeof value === "string") {
      formData.append(name, value.trim());
      continue;
    }
    for (const file of value) formData.append(name, file, file.name);
  }
  return formData;
}
