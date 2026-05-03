import { api } from "./api";

/**
 * App exit / sign-out: invalidates the session on the API (Bearer or cookies via axios).
 * Call before `signOut()` when you need the server to revoke the session.
 *
 * Contract: `POST /auth/exit` — optional JSON body; 204 or `{ ok: true }`.
 */
export const ExitService = {
  exitApp: async () => {
    await api.post<unknown>("/auth/exit", {});
  },
};
