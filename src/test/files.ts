/** A file of an exact byte size, without allocating real content for large sizes. */
export function fakeFile(name: string, type: string, size = 1): File {
  const file = new File(["x"], name, { type });
  Object.defineProperty(file, "size", { value: size });
  return file;
}
