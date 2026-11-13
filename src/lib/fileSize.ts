const UNITS = ["B", "KB", "MB", "GB"] as const;
const STEP = 1024;

/**
 * Parses a human-readable size from the server ("5MB", "500 kb", 1024) into bytes.
 * Returns `undefined` for anything unreadable so callers can skip the rule
 * instead of blocking every upload on a malformed schema.
 */
export function parseFileSize(
  size: string | number | undefined,
): number | undefined {
  if (typeof size === "number")
    return Number.isFinite(size) && size >= 0 ? size : undefined;
  if (!size) return undefined;

  const match = /^(\d+(?:\.\d+)?)\s*(b|kb|mb|gb)?$/i.exec(size.trim());
  if (!match) return undefined;

  const unit = (match[2] ?? "b").toUpperCase();
  const exponent = UNITS.findIndex((candidate) => candidate === unit);
  return Math.round(Number(match[1]) * STEP ** exponent);
}

/** Formats bytes for display, e.g. 1536 -> "1.5 KB". */
export function formatFileSize(bytes: number): string {
  let value = bytes;
  let unitIndex = 0;
  while (value >= STEP && unitIndex < UNITS.length - 1) {
    value /= STEP;
    unitIndex += 1;
  }
  const rounded = unitIndex === 0 ? value : Math.round(value * 10) / 10;
  return `${rounded} ${UNITS[unitIndex] ?? "B"}`;
}
