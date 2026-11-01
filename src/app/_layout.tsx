import '@/global.css';
import * as SplashScreen from 'expo-splash-screen';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';
import { AppProviders } from '@/providers/AppProviders';

SplashScreen.preventAutoHideAsync();

export default function TabLayout() {
  return (
    <AppProviders>
      <AnimatedSplashOverlay />
      <AppTabs />
    </AppProviders>
  );
}
