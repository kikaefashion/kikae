/**
 * Feature capabilities that the backend does not support yet.
 *
 * Every flag is `false` today; screens degrade gracefully through these flags
 * and flip on when the backend adds the capability. See
 * `docs/backend-findings.md` (Required doc updates / Frontend API-client rules).
 */
export interface Capabilities {
  /** Product/store "unlike" — no `like:false`/DELETE route exists server-side. */
  canUnlike: boolean;
  /** Server pagination — the backend returns full lists with no paging. */
  hasPagination: boolean;
  /** Server image resizing/CDN width params. */
  canResizeImages: boolean;
  /** Messaging conversation list / unread counts. */
  hasConversationList: boolean;
  /** Google sign-in (F1b) — wired in a later task. */
  googleSignIn: boolean;
}

export const capabilities: Capabilities = {
  canUnlike: false,
  hasPagination: false,
  canResizeImages: false,
  hasConversationList: false,
  googleSignIn: false,
};
