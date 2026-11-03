import { router, type Href } from 'expo-router';

/**
 * Auth route helpers. `verifyEmail` targets the (not-yet-built) verify-email
 * screen; it is wired once that route lands.
 */
export const routes = {
  verifyEmail(email: string): void {
    const href = `/verify_email?email=${encodeURIComponent(email)}` as Href;
    router.replace(href);
  },
};
