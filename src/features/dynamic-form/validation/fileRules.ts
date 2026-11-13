/**
 * Mirrors the browser's `accept` attribute: a comma-separated list of extensions
 * (".pdf"), exact MIME types ("image/png") or MIME wildcards ("image/*").
 * `accept` only filters the OS dialog and drag-and-drop bypasses it, so the same
 * rule must be enforced in validation.
 */
export function matchesAccept(file: File, accept: string | undefined): boolean {
  const tokens = (accept ?? "")
    .split(",")
    .map((token) => token.trim().toLowerCase())
    .filter(Boolean);
  if (tokens.length === 0) return true;

  const name = file.name.toLowerCase();
  const type = file.type.toLowerCase();

  return tokens.some((token) => {
    if (token.startsWith(".")) return name.endsWith(token);
    if (token.endsWith("/*")) return type.startsWith(token.slice(0, -1));
    return type === token;
  });
}
