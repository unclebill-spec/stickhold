/**
 * Local-only stub, not real preview auth. Contains no production secrets.
 *
 * The omitted preview-auth module is not here. These placeholders exist so
 * `server.ts` can import this file and the module graph can load. They are
 * not a broker client and this file does not implement OAuth.
 */

/** Fake loopback issuer. Not a production or sandbox auth broker. */
export const GROK_ISSUER_DEFAULT = "http://127.0.0.1/local-stub-issuer";

/** Obvious placeholder. Not a real OAuth client id. */
export const PREVIEW_CLIENT_ID = "local-stub-client-id";

/** Obvious placeholder string. Not a secret. */
export const PREVIEW_CLIENT_SECRET = "local-stub-not-a-secret";

/**
 * Loopback hosts only. `server.ts` copies this into a mutable `string[]`.
 * No sandbox or production hosts.
 */
export const PREVIEW_ALLOWED_HOSTS: string[] = ["localhost", "127.0.0.1"];
