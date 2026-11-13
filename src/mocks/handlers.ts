import { delay, http, HttpResponse } from "msw";
import { API_BASE_URL } from "@/features/dynamic-form/api/config";
import carForm from "./data/car-form.json";

/** Forms the mock backend knows, keyed by id. */
const forms: Record<string, typeof carForm> = { car: carForm };

const REQUIRED_MESSAGE = "این فیلد الزامی است";

const isMissing = (values: FormDataEntryValue[]): boolean =>
  values.every((value) =>
    typeof value === "string" ? value.trim() === "" : value.size === 0,
  );

/**
 * Stand-in for the backend that is still being built. It mimics the agreed
 * contract (including server-side required checks and a 422 body), so swapping
 * in the real API is a base-URL change, not a code change.
 */
export const handlers = [
  http.get(`${API_BASE_URL}/forms/:formId`, async ({ params }) => {
    await delay();
    const form = forms[String(params.formId)];
    return form
      ? HttpResponse.json(form)
      : HttpResponse.json({ message: "Form not found" }, { status: 404 });
  }),

  http.post(
    `${API_BASE_URL}/forms/:formId/submissions`,
    async ({ params, request }) => {
      await delay();
      const form = forms[String(params.formId)];
      if (!form)
        return HttpResponse.json(
          { message: "Form not found" },
          { status: 404 },
        );

      const data = await request.formData();
      const missing = form.fields.filter(
        (field) => field.required && isMissing(data.getAll(field.name)),
      );
      if (missing.length > 0) {
        const fieldErrors = Object.fromEntries(
          missing.map((field) => [field.name, REQUIRED_MESSAGE]),
        );
        return HttpResponse.json(
          { message: "Validation failed", fieldErrors },
          { status: 422 },
        );
      }

      const files = [...data.values()].filter(
        (value) => typeof value !== "string",
      );
      return HttpResponse.json(
        { id: crypto.randomUUID(), fileCount: files.length },
        { status: 201 },
      );
    },
  ),
];
