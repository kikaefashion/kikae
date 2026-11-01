/**
 * Tailwind/NativeWind config — generated from `src/theme/tokens.ts`.
 *
 * The theme OVERRIDES (not extends) colors, spacing, radii, font sizes and
 * font weights so values outside the documented scales do not compile.
 * Color utilities resolve to `--kikae-*` CSS variables (light/dark flip in
 * `src/global.css`).
 */

const tokens = require('./src/theme/tokens');

const varColor = (name) => `var(--kikae-${name})`;

function buildGrayColors() {
  const colors = {};
  for (const [step, hex] of Object.entries(tokens.gray)) {
    colors[`gray-${step}`] = hex;
  }
  return colors;
}

function buildRoleColors() {
  const colors = {};
  for (const name of Object.keys(tokens.roles.light)) {
    colors[name] = varColor(name);
  }
  return colors;
}

function buildSemanticColors() {
  const colors = {};
  for (const name of Object.keys(tokens.semantic.light)) {
    colors[name] = varColor(name);
  }
  return colors;
}

function buildSpacing() {
  const spacing = {};
  for (const value of tokens.spacing) {
    spacing[value] = `${value}px`;
  }
  return spacing;
}

function buildRadii() {
  const radii = {};
  for (const [name, value] of Object.entries(tokens.radii)) {
    radii[name] = `${value}px`;
  }
  return radii;
}

function buildFontSize() {
  const fontSize = {};
  for (const [name, spec] of Object.entries(tokens.type)) {
    fontSize[name] = [
      `${spec.size}px`,
      { lineHeight: `${spec.lineHeight}px`, fontWeight: String(spec.weight) },
    ];
  }
  return fontSize;
}

function buildFontWeight() {
  const weights = {};
  for (const [name, value] of Object.entries(tokens.typeWeights)) {
    weights[name] = String(value);
  }
  return weights;
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  darkMode: 'media',
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      inherit: 'inherit',
      black: '#000000',
      white: '#FFFFFF',
      ...buildGrayColors(),
      ...buildRoleColors(),
      ...buildSemanticColors(),
    },
    spacing: buildSpacing(),
    borderRadius: buildRadii(),
    fontSize: buildFontSize(),
    fontWeight: buildFontWeight(),
  },
  plugins: [],
};
