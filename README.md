# ENWACon — Non‑Profit Sector Conference Landing Page

> موقع تعريفي متجاوب لمؤتمر القطاع غير الربحي الأول في وزارة البيئة والمياه والزراعة

A responsive, right‑to‑left (Arabic) landing site for the **First Non‑Profit Sector Conference** of Saudi Arabia's Ministry of Environment, Water & Agriculture (MEWA), themed **«بالتكامل نصنع أثرًا مستدامًا»** ("Through integration, we create sustainable impact") — 9–10 December 2025, Fairmont Riyadh.

🔗 **Live demo:** https://mazin-musleh.github.io/ENWACon/

> [!NOTE]
> This is an **unofficial demonstration project** for display and development purposes and is **not affiliated with MEWA**. All ministry branding, logos, and imagery belong to their respective owners.

---

## ✨ Features

- **Pure vanilla stack** — HTML5, CSS3, and JavaScript with **no framework or build dependency**.
- **Fully Arabic / RTL** with semantic, accessible markup.
- **Responsive** — adapts from mobile to desktop; the main nav collapses to a hamburger menu at ≤ 1200 px.
- **Polished UI** — glassmorphism sticky header, testimonials carousel, parallax section backgrounds, animated dots canvas, and a scroll‑to‑top control.
- **Auth pages** — `login.html` and `register.html` (static UI; no backend) with a shared design and back‑to‑home navigation.

## ⚡ Performance

- **WebP images** throughout, with a separate **downscaled mobile hero** and **responsive `<link rel="preload">`** (mobile vs. desktop via `media`).
- **Minified assets** served in production (`main.min.css`, `script.min.js`) while the originals stay as editable source.
- **Local fonts** (Tajawal) and **deferred Font Awesome** to avoid render‑blocking and third‑party requests.
- **Explicit image dimensions** + GPU‑composited header animation to keep **CLS** at zero.

## 🔍 SEO & Accessibility

- Open Graph + Twitter Card tags, a generated **1200×630 share image**, and a canonical URL.
- **JSON‑LD `Event`** structured data (name, dates, venue, organizer) for rich results.
- `noindex` on the auth pages; descriptive `alt` text, ARIA labels, a skip link, and one `<h1>` per page.

---

## 📁 Project structure

```
ENWACon/
├── index.html              # Main landing page
├── login.html              # Login (static)
├── register.html           # Registration (static)
└── assets/
    ├── css/
    │   ├── main.css         # Source stylesheet (edit this)
    │   └── main.min.css     # Minified — referenced by the pages
    ├── js/
    │   ├── script.js        # Source script (edit this)
    │   └── script.min.js    # Minified — referenced by the pages
    ├── fonts/               # Tajawal (local @font-face)
    ├── fontawesome/         # Font Awesome stylesheet
    ├── webfonts/            # Font Awesome web fonts
    └── img/                 # WebP photos, SVG logos, og-image
```

## 🚀 Running locally

It's a static site — no build needed to view it. Either open `index.html` directly, or serve the folder (recommended, so relative paths and `fetch`‑like behavior work consistently):

```bash
# Python
python -m http.server 8000

# or Node
npx serve .
```

Then visit `http://localhost:8000/`.

## 🛠️ Editing & minification

There is **no automated build step**. When you edit `assets/css/main.css` or `assets/js/script.js`, regenerate the minified files before deploying (otherwise the live pages keep serving the old minified versions):

```bash
# JavaScript (Terser)
npx terser assets/js/script.js -c -m -o assets/js/script.min.js

# CSS (PostCSS + cssnano)
npx postcss assets/css/main.css --use cssnano -o assets/css/main.min.css
```

## 📦 Deployment (GitHub Pages)

1. Push to the `master` branch.
2. **Settings → Pages → Source: “Deploy from a branch” → `master` / `root` → Save.**
3. The site goes live at `https://mazin-musleh.github.io/ENWACon/`.

The repo must be **public** for GitHub Pages on a free account.

## 📄 License / usage

The source code is shared for demonstration and educational purposes. Ministry branding, logos, official imagery, and content are the property of their respective owners and are **not** covered by any open‑source grant.
