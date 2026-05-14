# fintech-cv — Design Spec

**Date:** 2026-05-15  
**Status:** Approved

## Problem & Goal

Build a web CV/portfolio targeting a position at a fintech company. The CV will be sent as a physical letter containing a cover page with a printed URL, a QR code, and an NFC tag. The web version must load instantly on mobile (QR scan first impression), look polished, and demonstrate the ability to build a complete product quickly with AI assistance.

This is the third iteration of the author's CV portfolio. Previous iterations used PHP and React. This iteration showcases Angular, full-stack Node.js, and AI-assisted development. All plans, specs, and architectural decisions are committed to the repository.

---

## Stack

| Layer | Technology |
|-------|-----------|
| Frontend framework | Angular 17+ (standalone components, signals) |
| Rendering | Angular SSR (`@angular/ssr`) |
| Styling | SCSS + CSS custom properties |
| Typography | JetBrains Mono (terminal accents) + Inter (body) via Google Fonts |
| i18n | Transloco (runtime EN/SL switching, single build) |
| Backend | Express.js (served from Angular's `server.ts`) |
| Database | MariaDB (contact form submissions only) |
| Process manager | pm2 |
| CI/CD | GitHub Actions → SSH deploy |
| Domain | Owner's custom subdomain (own hosting, nginx reverse proxy) |

---

## Architecture

```
┌─────────────────────────────────────────────────┐
│                  User's Server                   │
│                                                  │
│  ┌──────────┐    ┌────────────────────────────┐  │
│  │  nginx   │───▶│     Node.js process        │  │
│  │ :80/:443 │    │                            │  │
│  └──────────┘    │  ┌──────────┐ ┌─────────┐  │  │
│                  │  │ Angular  │ │ Express │  │  │
│  <custom-subdomain> ──────▶  │  SSR     │ │   API   │  │  │
│                  │  └──────────┘ └────┬────┘  │  │
│                  │                   │        │  │
│                  │  ┌────────────────▼──────┐ │  │
│                  │  │ content.json  MariaDB │ │  │
│                  │  └───────────────────────┘ │  │
│                  └────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

- A single Node.js process serves both Angular SSR (all routes) and the Express API (`/api/*`)
- `content.json` lives on the server only — never committed to the repo. Edit it directly on the server; no redeploy needed.
- MariaDB is used exclusively for contact form submissions
- pm2 manages the process (auto-restart on crash, startup on server boot)
- nginx reverse proxies custom subdomain → Node.js, handles SSL

---

## Repository Structure

```
fintech-cv/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── nav/
│   │   │   ├── hero/
│   │   │   ├── about/
│   │   │   ├── experience/
│   │   │   ├── skills/
│   │   │   ├── education/
│   │   │   ├── projects/
│   │   │   ├── contact/
│   │   │   └── print-layout/
│   │   ├── services/
│   │   │   └── content.service.ts
│   │   └── app.config.ts
│   ├── server.ts              # Express server entry (SSR + API)
│   └── styles/
│       ├── _variables.scss    # CSS custom properties / tokens
│       ├── _typography.scss
│       └── _theme.scss        # light/dark theme definitions
├── public/
│   └── i18n/
│       ├── en.json
│       └── sl.json
├── docs/
│   └── superpowers/
│       └── specs/
│           └── 2026-05-15-fintech-cv-design.md
├── .github/
│   ├── workflows/
│   │   └── deploy.yml
│   └── copilot-instructions.md
├── .gitignore
├── package.json
└── README.md
```

---

## Frontend

### Routes

| Route | Description |
|-------|-------------|
| `/` | Main CV — single page scroll, all sections |
| `/print` | Print-optimized layout, always light theme, no nav or animations |

### Sections (on `/`)

Hero → About → Experience → Skills → Education → Projects → Contact

### Components

| Component | Responsibility |
|-----------|---------------|
| `NavComponent` | Sticky top bar; anchor links to each section; dark/light mode toggle; EN/SL language switcher |
| `HeroComponent` | Full-width intro: `~ $ whoami` prompt, name with blinking cursor, job title |
| `AboutComponent` | Short bio paragraph |
| `ExperienceComponent` | Timeline of roles with monospace dates |
| `SkillsComponent` | Categorised skill tags |
| `EducationComponent` | Degree(s) and certifications |
| `ProjectsComponent` | Showcase of notable projects with links |
| `ContactComponent` | Contact form (POST to `/api/contact`) + social links |
| `PrintLayoutComponent` | Print-friendly flat layout wrapping all section data; light theme hardcoded |

### State

`ContentService` fetches `GET /api/content` once on app init and exposes data via Angular signals. All components inject `ContentService` for their data slice.

### Design System

**Terminal aesthetic — Level 2 (restrained):**
- JetBrains Mono used for: name, section labels (`# experience`), dates, code-like elements, the `~ $ whoami` prompt
- Inter used for: all body text, job descriptions, paragraphs
- Blinking block cursor on the hero name (CSS animation)
- Green accent (`#16a34a` light / `#4ade80` dark) on prompt characters and section labels only

**Theming:**
- CSS custom properties (`--color-bg`, `--color-surface`, `--color-text`, `--color-muted`, `--color-accent`) defined per theme
- `.dark` class on `<body>` activates dark theme
- Default: `prefers-color-scheme` media query sets initial theme
- User toggle persists to `localStorage`
- Print route: light theme CSS hardcoded regardless of user preference

**Typography:**
- JetBrains Mono and Inter loaded via Google Fonts
- Both fonts have full support for Slovenian diacritics (č, š, ž) — non-negotiable requirement

**Layout:**
- Single page scroll on `/`
- Sticky `NavComponent` with smooth scroll to section anchors
- Max content width ~860px, centered, generous whitespace

---

## Backend API

All API routes are served from Express inside `server.ts`, accessible at `/api/*`.

### Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/content` | Returns the full `content.json` file |
| `POST` | `/api/contact` | Validates and saves contact form submission to MariaDB |

### `content.json` Shape

Lives on the server only (not in the repo). Translatable fields use `{ "en": "...", "sl": "..." }` objects.

```json
{
  "meta": {
    "name": "<owner-name>",
    "title": { "en": "Frontend Engineer", "sl": "Frontend inženir" },
    "email": "...",
    "phone": "..."
  },
  "about": { "en": "...", "sl": "..." },
  "experience": [
    {
      "company": "...",
      "role": { "en": "...", "sl": "..." },
      "period": "2022–present",
      "description": { "en": "...", "sl": "..." }
    }
  ],
  "skills": [
    { "category": { "en": "Frontend", "sl": "Frontend" }, "items": ["Angular", "TypeScript", "RxJS"] }
  ],
  "education": [...],
  "projects": [...],
  "social": [
    { "label": "GitHub", "url": "<github-url>" }
  ]
}
```

### MariaDB Schema

```sql
CREATE TABLE contact_submissions (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(200) NOT NULL,
  email         VARCHAR(200) NOT NULL,
  message       TEXT NOT NULL,
  submitted_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Security

- Express API binds to `localhost` only; nginx proxies `/api/*`
- Rate limiting on `POST /api/contact` (e.g., 5 requests per IP per 10 minutes) to prevent spam
- Input validation and sanitisation on contact form fields

---

## i18n

Transloco handles runtime language switching with a single build.

- Translation files: `public/i18n/en.json`, `public/i18n/sl.json`
- UI strings (nav labels, button text, form placeholders) live in translation files
- Dynamic content strings come from `content.json` as `{ "en": "...", "sl": "..." }` — `ContentService` resolves the active language
- Language preference persists to `localStorage`
- Default language: browser `navigator.language` (falls back to `en`)

---

## Print / Export

- Route `/print` renders a clean, print-optimised layout
- Always light theme (hardcoded, ignores user preference and system setting)
- No sticky nav, no animations, no theme toggle
- Two-column layout: sidebar (contact info, skills) + main (experience, education, projects)
- `@media print` CSS removes any remaining browser chrome
- User prints via `Ctrl+P` → "Save as PDF" for a portable file

---

## Deployment

### GitHub Actions (`deploy.yml`)

Triggered on push to `main`:
1. `npm ci`
2. `npm run build` (Angular SSR build)
3. SSH into server
4. `rsync` built output to server directory
5. `pm2 restart fintech-cv`

SSH credentials stored as GitHub Secrets (`SSH_HOST`, `SSH_USER`, `SSH_KEY`).

### Server Setup (one-time, manual)

- nginx configured as reverse proxy: `<custom-subdomain>` → `localhost:<port>`
- pm2 ecosystem file committed to repo (without secrets)
- `content.json` created manually on server on first deploy
- MariaDB database and user created manually on first deploy

---

## What Is NOT in the Repo

- `content.json` (contains personal/contact data — lives on server only)
- MariaDB credentials (GitHub Secrets / server environment variables)
- SSH keys

---

## Non-Negotiable Requirements

1. **čšž support** — JetBrains Mono and Inter both support Slovenian diacritics. Must be verified visually before launch.
2. **Instant first load on mobile** — SSR ensures fully rendered HTML on QR scan. No blank screens.
3. **Company anonymity** — The target company must not be named anywhere in the repo, codebase, docs, or commit history. Reference only as "a fintech company."
4. **Everything in git** — All architectural decisions, specs, and plans committed. This is part of the demonstration.
