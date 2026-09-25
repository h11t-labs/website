// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

// GitHub's Shiki themes use a few token colours that fall under 4.5:1 on our
// code surfaces (comments are 3.7:1 on the dark one). Swap just those for the
// same hue, nudged far enough to pass WCAG AA.
/** @type {Record<string, Record<string, string>>} */
const aaCodeColors = {
  light: { '#E36209': '#B34C08', '#D73A49': '#CA2C3F', '#22863A': '#137C31', '#6A737D': '#646C76' },
  dark: { '#6A737D': '#79838D' },
};

// h11t labs — static brand + writing site.
// Output is plain static files (dist/), deployable to any host.
export default defineConfig({
  site: 'https://h11t-labs.nl',
  // Self-hosted fonts: the files come from the @fontsource packages in
  // package.json (pinned by the lockfile) and are served from this site, so a
  // page view makes no request to Google or anyone else. Each family becomes a
  // CSS variable used in global.css, with a metric-matched local fallback.
  // Latin subset only (covers English and Dutch).
  fonts: [
    {
      provider: fontProviders.local(),
      name: 'Space Grotesk',
      cssVariable: '--font-display',
      fallbacks: ['ui-sans-serif', 'system-ui', 'sans-serif'],
      options: {
        variants: [
          { src: ['@fontsource-variable/space-grotesk/files/space-grotesk-latin-wght-normal.woff2'], weight: '300 700', style: 'normal' },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: 'Source Serif 4',
      cssVariable: '--font-prose',
      fallbacks: ['Georgia', 'Times New Roman', 'serif'],
      options: {
        variants: [
          { src: ['@fontsource-variable/source-serif-4/files/source-serif-4-latin-wght-normal.woff2'], weight: '200 900', style: 'normal' },
          { src: ['@fontsource-variable/source-serif-4/files/source-serif-4-latin-wght-italic.woff2'], weight: '200 900', style: 'italic' },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: 'JetBrains Mono',
      cssVariable: '--font-mono',
      fallbacks: ['ui-monospace', 'SF Mono', 'Menlo', 'monospace'],
      options: {
        variants: [
          { src: ['@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2'], weight: '100 800', style: 'normal' },
        ],
      },
    },
    {
      // the wordmark only: 800 italic for "h11t", 700 upright for "labs."
      provider: fontProviders.local(),
      name: 'Poppins',
      cssVariable: '--font-logo',
      fallbacks: ['sans-serif'],
      options: {
        variants: [
          { src: ['@fontsource/poppins/files/poppins-latin-800-italic.woff2'], weight: 800, style: 'italic' },
          { src: ['@fontsource/poppins/files/poppins-latin-700-normal.woff2'], weight: 700, style: 'normal' },
        ],
      },
    },
  ],
  // Pages build to <path>/index.html, which GitHub Pages serves at <path>/
  // (and 301-redirects <path> to). Link to the slash form everywhere.
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
  markdown: {
    // Dual syntax themes: every token carries both a light and a dark colour as
    // CSS variables (--shiki-light / --shiki-dark), and global.css picks the one
    // that matches the active site theme. `defaultColor: false` means no colour
    // is baked in, so the switch is purely CSS.
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
      defaultColor: false,
      wrap: false,
      transformers: [
        {
          name: 'aa-code-colors',
          span(node) {
            const style = node.properties.style;
            if (typeof style !== 'string') return;
            node.properties.style = style.replace(
              /--shiki-(light|dark):(#[0-9A-Fa-f]{6})/g,
              (_, theme, hex) => `--shiki-${theme}:${aaCodeColors[theme][hex.toUpperCase()] ?? hex}`,
            );
          },
        },
      ],
    },
  },
});
