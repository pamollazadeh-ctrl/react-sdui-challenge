/** Joins class names, skipping falsy entries, so conditional classes stay readable. */
export function cx(
  ...classes: Array<string | false | null | undefined>
): string {
  return classes.filter(Boolean).join(" ");
}
