import { afterEach, describe, expect, it, vi } from "vitest";
import { ZodError } from "zod";
import carForm from "@/mocks/data/car-form.json";
import { parseFormSchema } from "./parseFormSchema";

const input = { type: "input", name: "brand", label: "Brand", props: {} };

describe("parseFormSchema", () => {
  afterEach(() => vi.restoreAllMocks());

  it("parses the sample car form with every field kept", () => {
    const schema = parseFormSchema(carForm);
    expect(schema.title).toBe(carForm.title);
    expect(schema.fields.map((field) => field.type)).toEqual(
      carForm.fields.map((field) => field.type),
    );
  });

  it("fills defaults so components never handle missing props", () => {
    const [field] = parseFormSchema({ fields: [input] }).fields;
    expect(field).toMatchObject({
      required: false,
      props: { type: "text", size: "medium" },
    });
  });

  it("coerces numeric rules that the server sends as strings", () => {
    const year = {
      ...input,
      props: { type: "number", min: "1900", max: "2024" },
    };
    const [field] = parseFormSchema({ fields: [year] }).fields;
    expect(field?.props).toMatchObject({ min: 1900, max: 2024 });
  });

  it("skips unknown or malformed fields instead of failing the whole form", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const fields = [
      { type: "slider", name: "x", label: "X", props: {} },
      input,
      { type: "input" },
    ];

    expect(
      parseFormSchema({ fields }).fields.map((field) => field.name),
    ).toEqual(["brand"]);
    expect(warn).toHaveBeenCalledTimes(2);
  });

  it("keeps the first field when a name is repeated", () => {
    vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const schema = parseFormSchema({
      fields: [input, { ...input, label: "Again" }],
    });
    expect(schema.fields).toHaveLength(1);
    expect(schema.fields[0]?.label).toBe("Brand");
  });

  it("rejects a select without options", () => {
    vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const select = {
      type: "select",
      name: "fuel",
      label: "Fuel",
      props: { options: [] },
    };
    expect(parseFormSchema({ fields: [select] }).fields).toEqual([]);
  });

  it.each([null, {}, { fields: "nope" }])(
    "throws on a broken envelope: %j",
    (raw) => {
      expect(() => parseFormSchema(raw)).toThrow(ZodError);
    },
  );
});
