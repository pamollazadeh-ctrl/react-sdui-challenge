import { describe, expect, it } from "vitest";
import { formatFileSize, parseFileSize } from "./fileSize";

describe("parseFileSize", () => {
  it.each([
    ["5MB", 5 * 1024 * 1024],
    ["500 kb", 500 * 1024],
    ["1.5MB", 1.5 * 1024 * 1024],
    ["2gb", 2 * 1024 ** 3],
    ["120", 120],
    ["120B", 120],
  ])("parses %s", (input, bytes) => {
    expect(parseFileSize(input)).toBe(bytes);
  });

  it("accepts a number of bytes as is", () => {
    expect(parseFileSize(2048)).toBe(2048);
  });

  it.each([undefined, "", "big", "5 TB", "-1MB", Number.NaN, -5])(
    "returns undefined for unreadable input %s",
    (input) => {
      expect(parseFileSize(input)).toBeUndefined();
    },
  );
});

describe("formatFileSize", () => {
  it.each([
    [0, "0 B"],
    [512, "512 B"],
    [1536, "1.5 KB"],
    [5 * 1024 * 1024, "5 MB"],
    [3 * 1024 ** 3, "3 GB"],
  ])("formats %d bytes as %s", (bytes, label) => {
    expect(formatFileSize(bytes)).toBe(label);
  });
});
