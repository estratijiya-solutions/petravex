---
name: estratijiya-design-system
description: >
  The layered design system that makes every Estratijiya client site consistent and
  best-in-class on the Static HTML + Tailwind + Vanilla JS stack — built top-down in 5 layers:
  Tokens (tailwind.config theme.extend) → Primitives → Components → Patterns → Templates,
  assembled onto the F:\coding\_templates\static-site scaffold. Triggers include "design
  system", "نظام تصميم", "design tokens", "tokens للموقع", "components للموقع", "مكوّنات
  الموقع", "بناء UI متّسق", "section blocks", "page templates". Do NOT use for the design
  WHY/aesthetic direction (use ui-ux-pro-max — colors, contrast, hierarchy, font pairing) or
  for motion execution (use web-animation-vanilla). Use this to TURN that direction into a
  reusable token/component system on my stack. Pairs with web-development-brief (its
  client-type sitemaps map to Layer 4 templates) and estratijiya-website-build (execution).
---

# estratijiya-design-system

## Purpose
A repeatable system so every client site is coherent and high-craft instead of hand-styled
ad-hoc. Build **top-down: tokens first**, then everything composes from them. Pull the *why*
(contrast, hierarchy, palette, font pairing, motion timing) from **ui-ux-pro-max**; pull
*motion* from **web-animation-vanilla**; assemble onto the **`_templates\static-site`**
scaffold. Avoid generic AI-slop UI — commit to one intentional direction per client and
execute it precisely.

Workflow: ui-ux-pro-max (direction) → **this skill (tokenize + componentize)** →
web-animation-vanilla (motion) → estratijiya-website-build (ship).

---

## Layer 0 — Tokens (the single source of truth)
Everything else references these. Define them in `tailwind.config.js → theme.extend` so they
become Tailwind utilities. Replace values per client from the ui-ux-pro-max direction.

```js
// tailwind.config.js
module.exports = {
  content: ["./*.html", "./**/*.html", "./js/**/*.js"],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#1A56DB", primaryhover: "#1543AE",
          ink: "#0F172A", muted: "#64748B",
          bg: "#FFFFFF", surface: "#F8FAFC", border: "#E2E8F0",
          success: "#16A34A", danger: "#DC2626",
        },
      },
      // Type scale (modular ~1.25). Pair a distinctive display + a clean body face.
      fontFamily: { display: ['Tajawal', 'serif'], sans: ['Tajawal', 'system-ui', 'sans-serif'] },
      fontSize: {
        xs: "0.75rem", sm: "0.875rem", base: "1rem", lg: "1.125rem",
        xl: "1.25rem", "2xl": "1.5rem", "3xl": "1.875rem", "4xl": "2.25rem", "5xl": "3rem",
      },
      // Spacing rhythm (4px base) + radius + shadow tokens
      borderRadius: { sm: "0.375rem", DEFAULT: "0.5rem", lg: "1rem", xl: "1.5rem", full: "9999px" },
      boxShadow: {
        soft: "0 1px 3px rgba(15,23,42,.08)",
        card: "0 4px 16px rgba(15,23,42,.08)",
        lift: "0 12px 32px rgba(15,23,42,.12)",
      },
      transitionTimingFunction: { brand: "cubic-bezier(.22,.61,.36,1)" },
    },
  },
  plugins: [],
};
```
**Token rules:** no raw hex/px in markup — use the token utilities (`bg-brand-primary`,
`shadow-card`, `rounded-lg`). One primary + one accent dominate; neutrals carry the rest.

---

## Layer 1 — Primitives (Tailwind utility recipes)
Smallest reusable elements. Keep recipes consistent across the site.

- **Button (primary):**
  `class="inline-flex items-center gap-2 rounded-full bg-brand-primary px-6 py-3 font-semibold text-white shadow-soft transition hover:bg-brand-primaryhover hover:shadow-lift focus:outline-none focus:ring-2 focus:ring-brand-primary/40"`
- **Button (secondary):**
  `class="inline-flex items-center gap-2 rounded-full border border-brand-border px-6 py-3 font-semibold text-brand-ink transition hover:bg-brand-surface"`
- **Input:**
  `class="w-full rounded-lg border border-brand-border bg-white px-4 py-3 text-brand-ink placeholder:text-brand-muted focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/30"`
- **Link:** `class="text-brand-primary underline-offset-4 hover:underline"`
- **Badge:** `class="inline-flex items-center rounded-full bg-brand-surface px-3 py-1 text-xs font-medium text-brand-muted"`

Every interactive primitive ships **hover + focus-visible** states (accessibility).

---

## Layer 2 — Components (composed from primitives)

- **Card:** `rounded-2xl border border-brand-border bg-white p-6 shadow-card transition hover:shadow-lift` — title (`text-xl font-semibold`) + body (`text-brand-muted`) + optional CTA primitive.
- **Navbar:** `mx-auto flex max-w-6xl items-center justify-between px-6 py-4`; logo (`text-xl font-display`) + nav links (Link primitive) + a primary Button CTA; collapses to a Vanilla-JS toggle menu on mobile.
- **Footer (with MANDATORY credit):**
  ```html
  <footer class="border-t border-brand-border py-10 text-center text-sm text-brand-muted">
    <p>© <span id="year"></span> {{Client}}. جميع الحقوق محفوظة.</p>
    <p class="mt-2">مطوّر بـ
      <a href="https://estratijiya.com" target="_blank" rel="noopener"
         class="font-semibold text-brand-primary hover:underline">استراتيجية</a></p>
  </footer>
  ```
  The credit is non-removable on every page (gate in estratijiya-website-build).
- **Hero:** centered or split layout; `h1` (`font-display text-4xl sm:text-5xl`) + subhead (`text-brand-muted`) + Button; optional visual (image, Lottie, or — only if justified — web-3d-threejs object).
- **Form:** stacked Input primitives + labels + a primary Button; inline validation; success state.
- **Modal:** overlay (`fixed inset-0 bg-black/50`) + panel (`rounded-2xl bg-white p-6 shadow-lift`); Vanilla-JS open/close + Esc + focus trap.

---

## Layer 3 — Patterns (section blocks)
Reusable page sections built from Layer 2. Each is a self-contained `<section>`.

- **Features grid:** SectionHeader + 3–6 Cards (`grid gap-8 sm:grid-cols-3`).
- **Testimonials:** quote Cards or a marquee (motion from web-animation-vanilla).
- **Pricing:** 2–3 tier Cards, one highlighted (`ring-2 ring-brand-primary`), feature lists + Button.
- **CTA band:** full-width `bg-brand-primary text-white` strip with headline + Button.
- **Logo / trust strip:** muted row of client/partner logos.
- **FAQ:** accordion (Vanilla-JS toggle), good for SEO (`FAQPage` schema).
- **Stats bar:** number counters (web-animation-vanilla counter snippet).

Apply reveal-on-scroll (`.reveal` from the scaffold) to section blocks; honor reduced motion.

---

## Layer 4 — Templates (page layouts → web-development-brief sitemaps)
Compose patterns into full pages, mapped to web-development-brief's client types:

| Client type (brief) | Homepage template (pattern stack) |
|---|---|
| **Service business** | Hero → Trust strip → Features (services) → Testimonials → CTA band → FAQ → Contact form → Footer |
| **Product / distribution** | Hero → Logo strip → Features (product lines) → "Why us" → Stats bar → CTA band → Contact → Footer |
| **B2B industrial** | Hero → Capabilities (Features) → Projects/track record → Certifications strip → CTA band → Contact → Footer |
| **Consultancy** | Hero → Approach (Features) → Case studies → Testimonials → CTA band → Contact → Footer |
| **Landing page** | Hero → Problem → Features (offer) → Testimonials → Pricing → FAQ → Final CTA |

Inner pages (About, Services detail, Contact, privacy/terms) reuse the same Layers 1–3 so the
whole site stays coherent.

---

## Build order (top-down, always)
1. **Tokens** in `tailwind.config.js` from the ui-ux-pro-max direction.
2. **Primitives** — lock button/input/link/badge recipes.
3. **Components** — card/navbar/footer(+credit)/hero/form/modal.
4. **Patterns** — assemble section blocks.
5. **Templates** — stack patterns per the brief's client type, onto the `_templates\static-site`
   scaffold. Then motion (web-animation-vanilla) → ship (estratijiya-website-build).

---

## HARD RULES
- **Build top-down, tokens first.** No component before its tokens exist.
- **No raw hex/px in markup** — only token utilities (`bg-brand-*`, `rounded-*`, `shadow-*`).
- **One intentional direction per client** (from ui-ux-pro-max). No generic AI-slop UI; avoid
  defaulting to Inter/purple-gradient clichés — commit and execute precisely.
- **Every interactive element has hover + focus-visible states** and meets contrast (WCAG AA).
- **Footer credit `مطوّر بـ استراتيجية` → Estratijiya is in the Footer component, every page.**
- **Tailwind = standalone CLI**; assemble onto `F:\coding\_templates\static-site`; rebuild
  minified CSS before pushing (pure-static, CSS committed).
- **Pull the WHY from ui-ux-pro-max, motion from web-animation-vanilla** — don't reinvent them.
- **Templates map to web-development-brief client types** — keep them in sync.

## EXAMPLE TRIGGERS
- "اعمل design system لـ [client]" / "build the design system for this client"
- "عرّف الـ design tokens" / "define the design tokens"
- "اعمل components للموقع" / "build the site components (card/navbar/footer/hero)"
- "نظام تصميم متّسق" / "make the UI consistent across pages"
- "section blocks / patterns" / "features + pricing + CTA section blocks"
- "page templates حسب نوع العميل" / "page templates per client type"
