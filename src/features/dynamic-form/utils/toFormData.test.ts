import { describe, expect, it } from "vitest";
import { fakeFile } from "@/test/files";
import { toFormData } from "./toFormData";

describe("toFormData", () => {
  it("sends text trimmed, exactly as it was validated", () => {
    expect(toFormData({ brand: "  Saipa " }).get("brand")).toBe("Saipa");
  });

  it("keeps empty optional fields so the server sees the full set of keys", () => {
    expect(toFormData({ color: "" }).get("color")).toBe("");
  });

  it("appends every file under the field name, keeping file names", () => {
    const files = [
      fakeFile("front.png", "image/png"),
      fakeFile("back.png", "image/png"),
    ];
    const entries = toFormData({ images: files }).getAll("images");

    expect(entries).toHaveLength(2);
    expect(
      entries.map((entry) => (entry instanceof File ? entry.name : entry)),
    ).toEqual(["front.png", "back.png"]);
  });

  it("omits a file field that has no files", () => {
    expect(toFormData({ images: [] }).has("images")).toBe(false);
  });
});
