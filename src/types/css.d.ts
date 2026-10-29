// Ambient module declarations for web CSS imports (Expo web support).
declare module '*.css' {
  const classes: Record<string, string>;
  export default classes;
}