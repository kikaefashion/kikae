import type { ConfigContext, ExpoConfig } from 'expo/config';

type AppEnv = 'development' | 'preview' | 'production';

interface EnvConfig {
  name: string;
  bundleIdentifier: string;
  androidPackage: string;
  apiBaseUrl: string;
}

const ENV_CONFIGS: Record<AppEnv, EnvConfig> = {
  development: {
    name: 'kikae (dev)',
    bundleIdentifier: 'com.kikae.kikaeFrontend.dev',
    androidPackage: 'com.kikae.kikaeFrontend.dev',
    apiBaseUrl: 'https://frontend-dev.kikae.com.ng',
  },
  preview: {
    name: 'kikae (preview)',
    bundleIdentifier: 'com.kikae.kikaeFrontend.preview',
    androidPackage: 'com.kikae.kikaeFrontend.preview',
    apiBaseUrl: 'https://frontend-preview.kikae.com.ng',
  },
  production: {
    name: 'kikae',
    bundleIdentifier: 'com.kikae.kikaeFrontend',
    androidPackage: 'com.kikae.kikaeFrontend',
    apiBaseUrl: 'https://www.kikae.com.ng',
  },
};

function resolveAppEnv(): AppEnv {
  const value = process.env.APP_ENV;
  if (
    value === 'production' ||
    value === 'preview' ||
    value === 'development'
  ) {
    return value;
  }
  return 'development';
}

export default ({ config }: ConfigContext): ExpoConfig => {
  const env = resolveAppEnv();
  const envConfig = ENV_CONFIGS[env];

  return {
    ...config,
    name: envConfig.name,
    slug: 'kikae',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'kikae',
    userInterfaceStyle: 'automatic',
    ios: {
      icon: './assets/expo.icon',
      bundleIdentifier: envConfig.bundleIdentifier,
    },
    android: {
      adaptiveIcon: {
        backgroundColor: '#E6F4FE',
        foregroundImage: './assets/images/android-icon-foreground.png',
        backgroundImage: './assets/images/android-icon-background.png',
        monochromeImage: './assets/images/android-icon-monochrome.png',
      },
      predictiveBackGestureEnabled: false,
      package: envConfig.androidPackage,
    },
    web: {
      output: 'server',
      favicon: './assets/images/favicon.png',
    },
    plugins: [
      'expo-router',
      [
        'expo-splash-screen',
        {
          backgroundColor: '#208AEF',
          image: './assets/images/splash-icon.png',
          imageWidth: 76,
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },
    extra: {
      appEnv: env,
      apiBaseUrl: envConfig.apiBaseUrl,
      eas: {
        projectId: '9e8a2d23-197e-4feb-8f45-ce53f1573419',
      },
      // TODO: After running `npx eas-cli init`, add the EAS project id here:
      //   eas: { projectId: '<your-project-id>' }
      // TODO: After running `npx eas-cli update:configure`, add `updates.url` and `runtimeVersion`.
    },
  };
};
