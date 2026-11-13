import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

/** Service-worker mock used by the running app (dev and preview builds). */
export const worker = setupWorker(...handlers);
