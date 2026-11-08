import { Head } from 'expo-router/head';

import { formatDocumentTitle } from '@/config/titles';

/**
 * Sets the web document <title> to "<title> | Kikae". Omitting `title` falls
 * back to "Kikae". `expo-router` wraps the app in `Head.Provider` (web
 * react-helmet-async), and the component is a no-op on native.
 */
export function DocumentTitle({ title }: { title?: string }) {
  return (
    <Head>
      <title>{formatDocumentTitle(title)}</title>
    </Head>
  );
}
