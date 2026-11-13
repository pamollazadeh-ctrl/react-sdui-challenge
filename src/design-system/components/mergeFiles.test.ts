import { describe, expect, it } from "vitest";
import { fakeFile } from "@/test/files";
import { mergeFiles } from "./mergeFiles";

const a = fakeFile("a.png", "image/png");
const b = fakeFile("b.png", "image/png");

describe("mergeFiles", () => {
  it("appends new files to a multi-file selection", () => {
    expect(mergeFiles([a], [b], true)).toEqual([a, b]);
  });

  it("skips a file that is already selected", () => {
    expect(mergeFiles([a], [a, b], true)).toEqual([a, b]);
  });

  it("replaces the selection on a single-file input", () => {
    expect(mergeFiles([a], [b], false)).toEqual([b]);
  });

  it("keeps only the first file when a single-file input receives several", () => {
    expect(mergeFiles([], [a, b], false)).toEqual([a]);
  });
});
