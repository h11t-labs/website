// @ts-check
import { defineConfig } from 'astro/config';

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
  trailingSlash: 'ignore',
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
