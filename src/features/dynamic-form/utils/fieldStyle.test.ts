import { describe, expect, it } from "vitest";
import { splitFieldStyle } from "./fieldStyle";

describe("splitFieldStyle", () => {
  it("sends spacing to the container and box styling to the control", () => {
    const style = { margin: "10px 0", padding: "8px", borderRadius: "5px" };
    expect(splitFieldStyle(style)).toEqual({
      container: { margin: "10px 0" },
      control: { padding: "8px", borderRadius: "5px" },
    });
  });

  it("drops properties that are not on the allow-list", () => {
    const style = { position: "fixed", display: "none", padding: "8px" };
    expect(splitFieldStyle(style)).toEqual({
      container: {},
      control: { padding: "8px" },
    });
  });

  it("handles a field without style", () => {
    expect(splitFieldStyle(undefined)).toEqual({ container: {}, control: {} });
  });
});
