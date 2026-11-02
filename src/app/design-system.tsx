import type { ComponentType } from 'react';
import { Redirect, type Href } from 'expo-router';

// Dev-only route. The showcase is `require`d inside a `__DEV__` branch so
// Metro's production minifier drops the module from the bundle; in production
// this route redirects home instead of rendering a blank page.
let Showcase: ComponentType | null = null;
if (__DEV__) {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  Showcase = require('@/components/design-system/showcase')
    .default as ComponentType;
}

export default function DesignSystemScreen() {
  if (!__DEV__) return <Redirect href={'/' as Href} />;
  return Showcase ? <Showcase /> : null;
}
