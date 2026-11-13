import { parseFormSchema } from "../schema/parseFormSchema";
import type { FormSchema } from "../schema/types";
import { request } from "./http";

const formPath = (formId: string): string =>
  `/forms/${encodeURIComponent(formId)}`;

/** Loads and validates the structure of a form. */
export async function fetchFormSchema(
  formId: string,
  signal?: AbortSignal,
): Promise<FormSchema> {
  return parseFormSchema(
    await request(formPath(formId), signal ? { signal } : undefined),
  );
}

/**
 * Sends a filled form. No `Content-Type` header is set on purpose: the browser
 * must add the multipart boundary itself.
 */
export async function submitForm(
  formId: string,
  data: FormData,
): Promise<void> {
  await request(`${formPath(formId)}/submissions`, {
    method: "POST",
    body: data,
  });
}
