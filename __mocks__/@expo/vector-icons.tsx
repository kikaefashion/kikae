import { Text, type TextProps } from 'react-native';

interface IoniconsProps extends TextProps {
  name: string;
  size?: number;
  color?: string;
}

/**
 * Manual Jest mock for `@expo/vector-icons`. Renders the icon name as text so
 * components that use icons never trigger an async font load in tests.
 */
export function Ionicons({
  name,
  size,
  color,
  style,
  ...props
}: IoniconsProps) {
  return (
    <Text {...props} style={[style, { color, fontSize: size }]}>
      {name}
    </Text>
  );
}
