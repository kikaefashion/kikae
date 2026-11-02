import { View } from 'react-native';

/**
 * Manual Jest mock for `expo-image`. Renders a plain View instead of loading an
 * image, so tests never leave an async image fetch open.
 */
export const Image = View;
