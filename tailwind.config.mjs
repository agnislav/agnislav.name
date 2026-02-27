/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ["'Instrument Serif'", 'Georgia', 'serif'],
        sans: ["'DM Sans'", 'system-ui', 'sans-serif'],
      },
      colors: {
        bg: 'var(--bg)',
        fg: 'var(--fg)',
        muted: 'var(--muted)',
        accent: 'var(--accent)',
        border: 'var(--border)',
        'card-bg': 'var(--card-bg)',
      },
      maxWidth: {
        container: '1100px',
      },
    },
  },
  plugins: [],
};
