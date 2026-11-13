import { setupServer } from "msw/node";
import { handlers } from "./handlers";

/** Node mock used by the test suite: the same handlers as the browser, so tests and the app agree. */
export const server = setupServer(...handlers);
