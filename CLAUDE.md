# CLAUDE.md — agni.dev Personal Site

## What This Is

Personal website for Agnislav Onufriichuk — engineering leader positioning for CTO / VP Eng / Head of Eng roles. Not a developer portfolio — a leadership-focused professional site.

## Reference

- `site.html` — the complete design mockup (HTML/CSS) with final content. This is the single source of truth for design, layout, copy, and structure. Match it precisely.

## Tech Stack

- **Astro** (static site, SSG) with `@astrojs/sitemap` integration
- **Keystatic** (git-based CMS, admin UI at `/keystatic`)
- **Tailwind CSS** (match the design system from site.html — colors, typography, spacing)
- **TypeScript**
- **Fonts**: Instrument Serif + DM Sans (Google Fonts)

## Project Structure

```
src/
  pages/
    index.astro              # Homepage — all sections from site.html
    blog/[...slug].astro     # Blog post pages (dynamic from Keystatic)
    keystatic/[...path].astro # Keystatic admin UI route
  components/
    Nav.astro                 # includes dark/light mode toggle
    Hero.astro
    About.astro
    Capabilities.astro       # "What I Do" grid
    Experience.astro         # "Track Record" timeline
    BlogSection.astro        # Blog preview grid on homepage
    Contact.astro
    Footer.astro
  layouts/
    Base.astro               # HTML shell, meta, fonts, global styles. Include inline script in <head> to apply saved theme BEFORE paint to prevent flash of wrong theme.
    BlogPost.astro           # Layout for individual blog posts
  content/
    blog/                    # Keystatic-managed markdown posts
keystatic.config.ts          # Keystatic content schemas
astro.config.mjs
tailwind.config.mjs
```

## Keystatic Schema

### Blog Posts (`content/blog/`)

Collection with slug-based routing. Fields:

- `title` — text (required)
- `date` — date (required)
- `excerpt` — text (required, shown on homepage card)
- `content` — document field (markdoc, the post body)

### Site Config (singleton, optional stretch goal)

Single `site-config` singleton for contact links, hero stats, "open to" text — so these can be edited via the admin UI without touching code. Not required for v1.

## Design System (extract from site.html)

```
Light Mode (default):
  --bg: #FAFAF8
  --fg: #1A1A18
  --muted: #8A8A82
  --accent: #2D5A27
  --border: #E0DED8
  --card-bg: #FFFFFF

Dark Mode:
  --bg: #141413
  --fg: #E8E6E1
  --muted: #8A8A82
  --accent: #5DA352
  --border: #2A2926
  --card-bg: #1C1C1A

Typography:
  Headings: Instrument Serif, 400 weight
  Body: DM Sans, 300 weight
  Base size: 16px, line-height 1.65

Spacing:
  Sections: 100px vertical padding
  Container: max-width 1100px, horizontal padding clamp(24px, 5vw, 80px)
  Nav: 60px height, fixed top
```

## Dark / Light Mode

- Respect `prefers-color-scheme` by default.
- Add a toggle button in the nav (sun/moon icon, no library — use simple inline SVG).
- Store preference in `localStorage` and apply a `data-theme="dark"` attribute on `<html>`.
- All colors must go through CSS variables — no hardcoded colors anywhere.
- Dark mode accent is a brighter green (`#5DA352`) for contrast on dark backgrounds.
- Nav background, card backgrounds, and borders all shift. Typography weights stay the same.
- Transition: `background-color 0.2s, color 0.2s, border-color 0.2s` on body/nav/cards for smooth switching.

## Implementation Notes

- All homepage content is hardcoded in components (not CMS-managed) — only blog posts come from Keystatic.
- Blog section on homepage shows latest 4 posts sorted by date desc.
- Responsive: single column below 768px (see media queries in site.html).
- Animations: fadeUp on hero elements only (CSS keyframes, no JS library needed).
- Keep it simple — no client-side JS unless absolutely necessary. Astro islands only if needed for Keystatic. Exception: the dark mode toggle needs a small inline `<script>` to read/write localStorage and toggle `data-theme`.
- Seed 4 blog posts in `content/blog/` matching the titles/excerpts from site.html.
- Nav links are anchor links to sections on the homepage (`#about`, `#capabilities`, etc.), except blog post pages link back to `/#blog`.

## Accessibility (target: WCAG 2.1 AA)

This is a non-negotiable priority. The site must be fully accessible.

- **Semantic HTML**: Use `<header>`, `<main>`, `<section>`, `<article>`, `<footer>`, `<nav>`. Every section needs an `aria-labelledby` pointing to its heading or section label.
- **Headings**: Strict hierarchy — single `<h1>` on each page, sections use `<h2>`, subsections `<h3>`. No skipped levels.
- **Landmarks**: Nav, main, contentinfo (footer) all properly identified. Blog posts use `<article>`.
- **Links**: All links must have descriptive text or `aria-label`. No bare "click here". External links get `rel="noopener noreferrer"`.
- **Color contrast**: Minimum 4.5:1 for body text, 3:1 for large text — in BOTH light and dark modes. Verify `--muted` color against both backgrounds especially.
- **Focus management**: Visible focus indicators on all interactive elements (links, toggle). Use `:focus-visible` with a clear outline style that works on both themes. Never `outline: none` without a replacement.
- **Skip to content**: Add a visually hidden "Skip to main content" link as the first focusable element.
- **Dark mode toggle**: Must be a `<button>` with `aria-label` that updates dynamically (e.g., "Switch to dark mode" / "Switch to light mode").
- **Reduced motion**: Wrap all animations in `@media (prefers-reduced-motion: no-preference)`. Respect user preference.
- **Images**: Photo placeholder (and any future images) must have meaningful `alt` text. Decorative images get `alt=""`.
- **Blog posts**: Keystatic content rendered with proper heading structure. Code blocks need accessible styling.
- **Font sizing**: Use `rem` units. Never disable user zoom (`maximum-scale=1` is not allowed in the viewport meta).
- **Language**: `<html lang="en">` set correctly.

## LLM & AI Crawler Optimization

Make the site easy for AI systems (ChatGPT, Perplexity, Claude, Google AI) to parse and summarize accurately.

- **Structured data (JSON-LD)**: Add to `Base.astro` `<head>`:
  - `Person` schema — name, jobTitle ("Engineering Leader"), description, url, sameAs (GitHub, LinkedIn), knowsAbout (key skills), worksFor.
  - `WebSite` schema — name, url, description.
  - On blog posts: `Article` schema — headline, datePublished, author, description.
- **Meta tags**: Every page needs `<meta name="description">` with a concise, information-dense summary. Homepage description should read like an elevator pitch, not SEO keyword soup.
- **Open Graph / Twitter cards**: `og:title`, `og:description`, `og:type`, `og:url`, `og:image` on all pages. Blog posts get unique OG data.
- **Clean HTML structure**: LLM crawlers extract meaning from semantic HTML. The landmark structure from the accessibility section already helps here. Ensure text content is in the DOM, not injected via JS.
- **`/llms.txt`**: Add a `public/llms.txt` file (plain text, markdown-formatted) with a structured summary:
  ```
  # Agnislav Onufriichuk

  > Engineering leader with 18+ years of experience. Open to CTO, VP of Engineering, and Head of Engineering roles.

  ## About
  [concise version of the About section text]

  ## Capabilities
  [list of the 6 capability areas]

  ## Experience
  [company — role — one-line summary for each]

  ## Contact
  - Email: agnislav@gmail.com
  - LinkedIn: [url]
  - GitHub: [url]
  - Website: https://agnislav.name
  ```
- **`/llms-full.txt`**: Optionally, a longer version with full experience descriptions and blog post summaries.
- **`robots.txt`**: Allow all AI crawlers. Don't block GPTBot, ClaudeBot, PerplexityBot, etc. Keep it simple:
  ```
  User-agent: *
  Allow: /
  Sitemap: https://agnislav.name/sitemap.xml
  ```
- **Sitemap**: Astro can auto-generate `sitemap.xml` — add `@astrojs/sitemap` integration. Ensures all blog posts are discoverable.
- **Canonical URLs**: Set `<link rel="canonical">` on every page. Set `site` in `astro.config.mjs` to `https://agnislav.name`.

## Commands

```bash
npm run dev      # Start dev server
npm run build    # Build static site
npm run preview  # Preview production build
```

## Deployment

Static output. Deployed to **agnislav.name** on Netlify. Ensure `astro.config.mjs` has `output: 'static'` with Keystatic in `local` mode for development (switch to `github` mode for production CMS on Netlify).
