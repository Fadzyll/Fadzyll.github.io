# Technical Analysis — Fadzyll Portfolio Website

## Project Overview

A personal portfolio website for Fadzil Bin Ismail, built as a static site and hosted on GitHub Pages. The site showcases his projects, skills, career history, and contact information.

- **Live URL:** https://Fadzyll.github.io
- **Framework:** Astro 6.3.7
- **Hosting:** GitHub Pages (via GitHub Actions)
- **Node.js:** >=22.12.0

---

## Tech Stack

| Layer | Technology | Reason |
|---|---|---|
| Framework | Astro 6.3.7 | Static site generation, zero JS by default, fast |
| Styling | CSS (vanilla, scoped + global) | No framework dependency, full control |
| Scripting | TypeScript / JavaScript | Minimal interactivity (modals, scroll animations, theme toggle) |
| Font | Atkinson Hyperlegible (self-hosted .woff) | Readable, accessible, no external font request |
| Image processing | Sharp 0.34.3 | Astro's built-in image optimization |
| Sitemap | @astrojs/sitemap | Auto-generated sitemap for SEO |
| MDX | @astrojs/mdx | Blog post support with component embedding |
| Deployment | GitHub Actions → GitHub Pages | Free, automated on push to main |

---

## Architecture

This is a **static site** — no server, no database, no API calls at runtime. Everything is pre-rendered at build time into plain HTML/CSS/JS files.

```
Browser → GitHub Pages CDN → Static HTML/CSS/JS files
```

### Build Pipeline

```
Source (src/) → astro build → dist/ → GitHub Actions → GitHub Pages
```

1. Developer pushes to `main` branch
2. GitHub Actions workflow triggers
3. `astro build` runs — outputs static files to `dist/`
4. Files are deployed to GitHub Pages
5. Site is live at `Fadzyll.github.io`

---

## File Structure

```
Fadzyll.github.io/
│
├── public/                     # Static assets served as-is
│   ├── favicon.svg             # Custom F favicon (dark square, blue F)
│   ├── favicon.ico             # Fallback favicon
│   ├── og-image.jpg            # Social sharing preview image
│   └── Resume Latest.pdf       # Downloadable CV
│
├── src/
│   ├── assets/                 # Processed by Astro (images, fonts)
│   │   ├── GMBR.jpg            # Hero avatar photo (home page)
│   │   ├── tauliah_korsuksis.jpg  # SUKSIS graduation photo (about page)
│   │   ├── Screenshot 2026-05-24 205448.png  # eKAFA screenshot
│   │   ├── photo_2026-05-24_20-59-13.jpg     # Kindergarten app screenshot
│   │   ├── cgpa-calculator.png               # CGPA Calculator screenshot
│   │   └── fonts/
│   │       ├── atkinson-regular.woff
│   │       └── atkinson-bold.woff
│   │
│   ├── components/             # Reusable Astro components
│   │   ├── BaseHead.astro      # <head> meta tags, OG image, theme flash prevention
│   │   ├── Header.astro        # Navigation, theme toggle, mobile menu
│   │   ├── Footer.astro        # Footer links, back-to-top button
│   │   ├── HeaderLink.astro    # Active nav link with active state detection
│   │   └── FormattedDate.astro # Date formatting for blog posts
│   │
│   ├── pages/                  # One file = one route
│   │   ├── index.astro         # / (Home)
│   │   ├── about.astro         # /about
│   │   ├── projects.astro      # /projects
│   │   ├── career.astro        # /career
│   │   ├── contact.astro       # /contact
│   │   ├── 404.astro           # /404 (custom error page)
│   │   └── blog/
│   │       ├── index.astro     # /blog
│   │       └── [...slug].astro # /blog/[post-name]
│   │
│   ├── layouts/
│   │   └── BlogPost.astro      # Layout wrapper for blog posts
│   │
│   ├── content/
│   │   └── blog/               # Markdown/MDX blog posts
│   │
│   ├── styles/
│   │   └── global.css          # Global CSS variables, resets, utility classes
│   │
│   └── consts.ts               # Site-wide constants (SITE_TITLE, SITE_DESCRIPTION)
│
├── docs/                       # Project documentation
│   ├── technical-analysis.md   # This file
│   └── botpress-chatbot-integration.md
│
├── astro.config.mjs            # Astro configuration (site URL, integrations, fonts)
├── package.json                # Dependencies and scripts
└── .github/
    └── workflows/
        └── deploy.yml          # GitHub Actions CI/CD pipeline
```

---

## Pages Breakdown

### Home (`/`)
- Hero section with avatar, tagline, social links
- Stats row: CGPA, Dean's List, location, availability
- Currently section: studying, interning, building, learning
- Tech stack with clickable skill modals
- Featured projects preview
- Explore grid (links to all pages)

### About (`/about`)
- Hero with SUKSIS graduation photo
- Who I am — two column bio
- My Story — timeline from primary school to internship
- Hobbies grid
- Values & motivation cards
- Quotes section

### Projects (`/projects`)
- 3 project cards: eKAFA PIUMS, Kindergarten App, CGPA Calculator
- Each card: screenshot, badges, description, highlights, tech tags
- Skills section: Languages, Frameworks & Tools, Concepts
- Skill modals on click (TypeScript)

### Career (`/career`)
- Hero with CV download button
- Work Experience timeline (ST Advisory internship)
- Academic Background timeline (UMS → Labuan Matric → SM St John → Primary)
- CGPA stats row (3.52, 5× Dean's List, 3.67 best GPA)
- Leadership & Co-Curricular (6 cards)
- Workshops & Training (7 items)
- Volunteering (3 items)
- Part-Time & Side Work (4 items)
- What's Next (6 cards)

### Contact (`/contact`)
- 3 contact cards: Email, LinkedIn, GitHub
- Availability section with pulsing green dot
- Location card

### 404 (`/404`)
- Custom error page with giant faded "404" text
- Back to Home + Contact buttons

---

## Styling Architecture

### CSS Variables (Design Tokens)
Defined in `global.css` under `:root` (dark mode) and `html.light` (light mode):

```css
/* Key tokens */
--accent: #38bdf8          /* Sky blue — primary brand color */
--bg-primary: #050a14      /* Deep navy — page background */
--bg-card: #0d1f3c         /* Card background */
--white: #f0f6ff           /* Primary text */
--white-muted: #a8b8d0     /* Secondary text */
--border: rgba(56,189,248,0.15)  /* Subtle borders */
--font-mono: 'JetBrains Mono', 'Fira Code', monospace
```

### Scoped vs Global Styles
- **Scoped styles** (`<style>` in each `.astro` file) — component-specific layout and design
- **Global styles** (`global.css`) — CSS variables, resets, utility classes, mobile overrides with `!important`

> **Known quirk:** Astro scoped styles don't reliably override global styles on mobile breakpoints. Workaround: use `global.css` with `!important` for mobile avatar sizing and text alignment.

### Dark / Light Mode
- Toggle button in the nav header (sun/moon icon)
- Class-based: adds/removes `html.light` on `<html>`
- Persisted in `localStorage`
- Flash prevention: `is:inline` script in `BaseHead.astro` runs before CSS loads

---

## Key Features & Implementation Details

### Scroll Animations
Uses `IntersectionObserver` API (no library needed):
- `.reveal` — fade up from below
- `.reveal-left` / `.reveal-right` — slide in from sides
- Bidirectional: elements re-animate when scrolled back into view
- Delay variants: `.reveal-delay-1` through `.reveal-delay-6`

### Skill Modals
On the Projects and Home pages, clicking a skill icon opens a modal with a description. Implemented with vanilla TypeScript — a `Record<string, string>` maps skill names to descriptions.

### Back-to-Top Button
Fixed position button in Footer. Appears after scrolling 400px via `scroll` event listener. Smooth scroll to top on click.

### Mobile Navigation
Hamburger menu toggle on screens ≤720px. Menu closes automatically when a nav link is clicked. Background color uses `--bg-primary` CSS variable (fixes light mode issue).

### Project Screenshots
Images use CSS `object-fit: cover` with specific `object-position` values to crop to the most interesting part:
- eKAFA: `object-position: center top` (shows hero section)
- Kindergarten App: `object-position: center 45%` (shows login form, not blank top)
- CGPA Calculator: `object-position: center 45%` (shows header and subjects)

### OG Image (Social Sharing)
`public/og-image.jpg` — Fadzil's professional headshot. Referenced in `BaseHead.astro` for all pages via `og:image` and `twitter:image` meta tags.

---

## SEO

| Tag | Value |
|---|---|
| `<title>` | Per-page title via `BaseHead` props |
| `meta description` | Per-page description via `BaseHead` props |
| `og:image` | `/og-image.jpg` (professional photo) |
| `canonical` | Auto-generated from `Astro.url` |
| Sitemap | Auto-generated by `@astrojs/sitemap` |
| `site` in config | `https://Fadzyll.github.io` |

---

## Performance Considerations

- **Zero runtime JS by default** — Astro ships no JS unless explicitly added
- **Self-hosted fonts** — Atkinson Hyperlegible loaded from `src/assets/fonts/`, no Google Fonts request
- **Image optimization** — Astro processes images via Sharp at build time
- **Skill icons** — loaded from `cdn.jsdelivr.net` (devicons CDN), not optimized — could lazy-load in future
- **No CSS framework** — vanilla CSS keeps bundle size minimal

---

## Deployment

### GitHub Actions Workflow (`.github/workflows/deploy.yml`)
- Triggers on push to `main`
- Runs `astro build`
- Deploys `dist/` to GitHub Pages

### Manual Steps Required
Any file that needs to be publicly accessible must be in `public/` (not `src/assets/`):
- `public/og-image.jpg` — social sharing image
- `public/Resume Latest.pdf` — downloadable CV
- `public/favicon.svg` + `public/favicon.ico`

---

## Known Issues & Workarounds

| Issue | Cause | Fix Applied |
|---|---|---|
| Mobile bio text left-aligned | `body { text-align: left }` in global.css overrides scoped styles | Added `.hero-content p { text-align: center !important }` in global.css media query |
| Avatar too large on mobile | Scoped media query not applying | Fixed with `!important` overrides in global.css |
| Theme toggle button misplaced | Was outside `.nav-links` div | Moved inside `.nav-links` after Contact link |
| Mobile nav stays dark in light mode | Hardcoded `rgba(5,10,20,0.97)` background | Changed to `var(--bg-primary)` |
| PDF not downloadable | File was in `src/assets/` (processed by Astro) | Moved to `public/` folder |

---

## Future Improvements

- [ ] Add Botpress chatbot (see `botpress-chatbot-integration.md`)
- [ ] Lazy-load skill icons from CDN
- [ ] Add blog content (structure already exists)
- [ ] Add GitHub stats widget
- [ ] Add more projects as they are completed
- [ ] Update CGPA and Dean's List count each semester
