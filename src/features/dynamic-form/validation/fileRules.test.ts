import { describe, expect, it } from "vitest";
import { fakeFile } from "@/test/files";
import { matchesAccept } from "./fileRules";

describe("matchesAccept", () => {
  const png = fakeFile("Photo.PNG", "image/png");
  const pdf = fakeFile("report.pdf", "application/pdf");

  it("accepts everything when there is no accept rule", () => {
    expect(matchesAccept(pdf, undefined)).toBe(true);
    expect(matchesAccept(pdf, "  ")).toBe(true);
  });

  it("matches a MIME wildcard", () => {
    expect(matchesAccept(png, "image/*")).toBe(true);
    expect(matchesAccept(pdf, "image/*")).toBe(false);
  });

  it("matches an exact MIME type", () => {
    expect(matchesAccept(pdf, "application/pdf")).toBe(true);
    expect(matchesAccept(png, "application/pdf")).toBe(false);
  });

  it("matches an extension without caring about case", () => {
    expect(matchesAccept(png, ".png")).toBe(true);
    expect(matchesAccept(png, ".jpg")).toBe(false);
  });

  it("accepts a file that matches any entry of a list", () => {
    expect(matchesAccept(pdf, "image/*, .pdf")).toBe(true);
  });

  it("does not let a wildcard match a different type with the same prefix", () => {
    expect(matchesAccept(fakeFile("a.bin", "imagex/png"), "image/*")).toBe(
      false,
    );
  });
});
