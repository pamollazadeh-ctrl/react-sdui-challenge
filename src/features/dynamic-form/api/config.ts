/** Base URL of the forms API. Relative by default so the dev mock and a same-origin proxy both work. */
export const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL ?? "/api";
