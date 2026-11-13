import { z } from "zod";
import { API_BASE_URL } from "./config";

/** Shape of a validation rejection from the server (HTTP 422). */
const errorBodySchema = z.object({
  message: z.string().optional(),
  fieldErrors: z.record(z.string(), z.string()).optional(),
});

/** A non-2xx response. `fieldErrors` carries per-field messages when the server sent them. */
export class ApiError extends Error {
  readonly status: number;
  readonly fieldErrors: Record<string, string>;

  constructor(
    status: number,
    message: string,
    fieldErrors: Record<string, string> = {},
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

async function toApiError(response: Response): Promise<ApiError> {
  const body = errorBodySchema.safeParse(
    await response.json().catch(() => undefined),
  );
  const message =
    body.data?.message ?? `Request failed with status ${response.status}`;
  return new ApiError(response.status, message, body.data?.fieldErrors);
}

/**
 * Thin `fetch` wrapper: resolves the base URL, rejects on non-2xx with a typed
 * error, and returns the JSON body as `unknown` so callers must validate it.
 */
export async function request(
  path: string,
  init?: RequestInit,
): Promise<unknown> {
  const response = await fetch(`${API_BASE_URL}${path}`, init);
  if (!response.ok) throw await toApiError(response);
  return response.json();
}
