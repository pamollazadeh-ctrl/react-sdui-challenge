import type { CSSProperties } from "react";

type ServerStyle = Record<string, string | number> | undefined;

/**
 * The server may send inline styles per field. Only an explicit allow-list is
 * applied: the design system stays in charge of the look, and a schema cannot
 * break the layout (`position`, `display`, …) or inject arbitrary CSS.
 */
const CONTAINER_KEYS = ["margin"] as const;
const CONTROL_KEYS = ["padding", "borderRadius"] as const;

function pick(style: ServerStyle, keys: readonly string[]): CSSProperties {
  const entries = keys.flatMap((key) => {
    const value = style?.[key];
    return value === undefined ? [] : [[key, value] as const];
  });
  return Object.fromEntries(entries);
}

/** Spacing goes to the field wrapper, box styling goes to the control itself. */
export function splitFieldStyle(style: ServerStyle) {
  return {
    container: pick(style, CONTAINER_KEYS),
    control: pick(style, CONTROL_KEYS),
  };
}
