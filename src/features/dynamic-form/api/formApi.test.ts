// @vitest-environment node
// Runs in Node (not jsdom) so `fetch`, `FormData` and `File` are one consistent
// implementation and the multipart body really travels through the mock handler.
import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";
import { ZodError } from "zod";
import { server } from "@/mocks/server";
import { API_BASE_URL } from "./config";
import { fetchFormSchema, submitForm } from "./formApi";
import { ApiError } from "./http";

const image = () => new File(["pixels"], "car.png", { type: "image/png" });

function validSubmission(): FormData {
  const data = new FormData();
  data.append("brand", "Saipa");
  data.append("model", "Pride");
  data.append("year", "2010");
  data.append("fuel_type", "بنزین");
  data.append("car_images", image());
  return data;
}

describe("fetchFormSchema", () => {
  it("returns the parsed schema of a known form", async () => {
    const schema = await fetchFormSchema("car");
    expect(schema.fields.map((field) => field.name)).toContain("car_images");
  });

  it("rejects with the HTTP status when the form does not exist", async () => {
    await expect(fetchFormSchema("missing")).rejects.toMatchObject({
      status: 404,
    });
  });

  it("rejects when the server answers with something that is not a form", async () => {
    server.use(
      http.get(`${API_BASE_URL}/forms/:formId`, () =>
        HttpResponse.json({ nope: 1 }),
      ),
    );
    await expect(fetchFormSchema("car")).rejects.toThrow(ZodError);
  });
});

describe("submitForm", () => {
  it("sends text and files as multipart form data", async () => {
    let received: FormData | undefined;
    server.use(
      http.post(
        `${API_BASE_URL}/forms/:formId/submissions`,
        async ({ request }) => {
          received = await request.formData();
          return HttpResponse.json({ id: "1" }, { status: 201 });
        },
      ),
    );

    await submitForm("car", validSubmission());

    expect(received?.get("brand")).toBe("Saipa");
    const file = received?.get("car_images");
    expect(file instanceof File && file.name).toBe("car.png");
  });

  it("resolves when the mock backend accepts the submission", async () => {
    await expect(submitForm("car", validSubmission())).resolves.toBeUndefined();
  });

  it("exposes per-field errors from a 422 response", async () => {
    const data = validSubmission();
    data.delete("brand");

    const error: unknown = await submitForm("car", data).catch(
      (reason: unknown) => reason,
    );

    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({
      status: 422,
      fieldErrors: { brand: expect.any(String) },
    });
  });

  it("falls back to a generic message when the error body is not JSON", async () => {
    server.use(
      http.post(`${API_BASE_URL}/forms/:formId/submissions`, () =>
        HttpResponse.text("boom", { status: 500 }),
      ),
    );
    await expect(submitForm("car", validSubmission())).rejects.toMatchObject({
      status: 500,
      fieldErrors: {},
    });
  });
});
