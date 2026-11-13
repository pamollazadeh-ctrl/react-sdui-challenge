import { describe, expect, it } from "vitest";
import {
  fileField,
  numberField,
  selectField,
  textField,
} from "@/test/factories";
import { fakeFile } from "@/test/files";
import { messages } from "../constants/messages";
import { buildValidator } from "./buildValidator";

const fields = [
  textField({ required: true }),
  numberField({ props: { min: 1900 } }),
  selectField({ required: true }),
  fileField({ required: true, props: { accept: "image/*" } }),
];

/** Maps each failing field name to its message, which is what the form shows. */
function errorsOf(values: Record<string, unknown>): Record<string, string> {
  const result = buildValidator(fields).safeParse(values);
  if (result.success) return {};
  return Object.fromEntries(
    result.error.issues.map((issue) => [issue.path[0], issue.message]),
  );
}

describe("buildValidator", () => {
  it("passes a fully valid form", () => {
    const values = {
      brand: "Saipa",
      year: "",
      fuel: "petrol",
      images: [fakeFile("a.png", "image/png")],
    };
    expect(errorsOf(values)).toEqual({});
  });

  it("reports one message per invalid field, keyed by field name", () => {
    expect(errorsOf({ brand: "", year: "1800", fuel: "", images: [] })).toEqual(
      {
        brand: messages.required,
        year: messages.min(1900),
        fuel: messages.required,
        images: messages.required,
      },
    );
  });

  it("uses the number rules only for inputs of type number", () => {
    expect(
      errorsOf({ brand: "abc", year: "abc", fuel: "petrol", images: [] }),
    ).toMatchObject({
      year: messages.invalidNumber,
    });
    expect(
      errorsOf({ brand: "abc", year: "", fuel: "petrol", images: [] }),
    ).not.toHaveProperty("brand");
  });

  it("builds an empty validator for a form without fields", () => {
    expect(buildValidator([]).safeParse({}).success).toBe(true);
  });
});
