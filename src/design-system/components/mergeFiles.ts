const identity = (file: File): string =>
  `${file.name}-${file.size}-${file.lastModified}`;

/**
 * Combines a new browser selection with the files already held.
 * Multi-file inputs append (picking again must not drop earlier choices) and skip
 * duplicates; single-file inputs replace.
 */
export function mergeFiles(
  current: readonly File[],
  added: readonly File[],
  multiple: boolean,
) {
  if (!multiple) return added.slice(0, 1);

  const seen = new Set(current.map(identity));
  const fresh = added.filter((file) => {
    if (seen.has(identity(file))) return false;
    seen.add(identity(file));
    return true;
  });
  return [...current, ...fresh];
}
