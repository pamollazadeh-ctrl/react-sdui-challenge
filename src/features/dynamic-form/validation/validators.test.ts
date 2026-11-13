import { describe, expect, it } from "vitest";
import {
  fileField,
  numberField,
  selectField,
  textField,
} from "@/test/factories";
import { fakeFile } from "@/test/files";
import { messages } from "../constants/messages";
import {
  validateFiles,
  validateNumber,
  validateSelect,
  validateText,
} from "./validators";

describe("validateText", () => {
  it("requires a value only when the field is required", () => {
    expect(validateText("", textField())).toBeUndefined();
    expect(validateText("", textField({ required: true }))).toBe(
      messages.required,
    );
  });

  it("treats whitespace as empty", () => {
    expect(validateText("   ", textField({ required: true }))).toBe(
      messages.required,
    );
  });

  it("enforces the length limits on the trimmed text", () => {
    const field = textField({ props: { minLength: 2, maxLength: 4 } });
    expect(validateText(" a ", field)).toBe(messages.minLength(2));
    expect(validateText("abcde", field)).toBe(messages.maxLength(4));
    expect(validateText(" abcd ", field)).toBeUndefined();
  });
});

describe("validateNumber", () => {
  const year = numberField({
    required: true,
    props: { min: "1900", max: "2024" },
  });

  it("accepts the boundaries, which arrive from the server as strings", () => {
    expect(validateNumber("1900", year)).toBeUndefined();
    expect(validateNumber("2024", year)).toBeUndefined();
  });

  it("rejects values outside the range", () => {
    expect(validateNumber("1899", year)).toBe(messages.min(1900));
    expect(validateNumber("2025", year)).toBe(messages.max(2024));
  });

  it("rejects text that is not a number", () => {
    expect(validateNumber("abc", year)).toBe(messages.invalidNumber);
  });

  it("requires a value only when the field is required", () => {
    expect(validateNumber("", year)).toBe(messages.required);
    expect(validateNumber("", numberField())).toBeUndefined();
  });
});

describe("validateSelect", () => {
  it("requires a choice when the field is required", () => {
    expect(validateSelect("", selectField({ required: true }))).toBe(
      messages.required,
    );
    expect(validateSelect("", selectField())).toBeUndefined();
  });

  it("rejects a value the server did not offer", () => {
    expect(validateSelect("petrol", selectField())).toBeUndefined();
    expect(validateSelect("water", selectField())).toBe(messages.invalidOption);
  });
});

describe("validateFiles", () => {
  const images = fileField({
    props: { accept: "image/*", maxSize: "5MB", multiple: true },
  });
  const megabyte = 1024 * 1024;

  it("requires at least one file when the field is required", () => {
    expect(validateFiles([], fileField({ required: true }))).toBe(
      messages.required,
    );
    expect(validateFiles([], images)).toBeUndefined();
  });

  it("rejects a file of the wrong format and names it", () => {
    const files = [
      fakeFile("a.png", "image/png"),
      fakeFile("cv.pdf", "application/pdf"),
    ];
    expect(validateFiles(files, images)).toBe(messages.fileType("cv.pdf"));
  });

  it("rejects a file above the size limit but accepts one exactly at it", () => {
    expect(
      validateFiles([fakeFile("a.png", "image/png", 5 * megabyte)], images),
    ).toBeUndefined();
    expect(
      validateFiles(
        [fakeFile("big.png", "image/png", 5 * megabyte + 1)],
        images,
      ),
    ).toBe(messages.fileSize("big.png", "5 MB"));
  });

  it("rejects several files on a single-file field", () => {
    const files = [
      fakeFile("a.png", "image/png"),
      fakeFile("b.png", "image/png"),
    ];
    expect(validateFiles(files, fileField())).toBe(messages.singleFile);
  });

  it("skips the size rule when the server sends an unreadable limit", () => {
    const field = fileField({ props: { maxSize: "huge" } });
    expect(
      validateFiles([fakeFile("a.png", "image/png", 99 * megabyte)], field),
    ).toBeUndefined();
  });
});
