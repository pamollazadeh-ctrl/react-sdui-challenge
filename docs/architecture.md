# Architecture

Why the code is shaped the way it is. Each section is one decision.

## The schema is validated at the boundary

`schema/formSchema.ts` describes the response with Zod, and the TypeScript types are
inferred from it. Inside the app every field is fully typed and has its defaults.
Nothing downstream checks for a missing `props` or a number that is a string.

One malformed field does not fail the whole form. The envelope is parsed strictly,
and each field is parsed on its own and skipped if it is invalid.

## Mocking with MSW

Requests are intercepted at the network level, so the application code is the same
code that will talk to the real backend. The handlers are shared by the browser
worker and the Node test server.

The alternative was json-server. It needs a second process, and it cannot receive a
multipart upload without custom middleware. Upload is the centre of this task.
