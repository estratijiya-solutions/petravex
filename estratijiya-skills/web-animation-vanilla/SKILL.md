---
name: web-animation-vanilla
description: >
  Translate animation references (Awwwards, Godly, Cuberto, dribbble clips) into real
  implementations on the Estratijiya stack — Static HTML + Tailwind CSS + Vanilla JS — using
  GSAP + ScrollTrigger, lottie-web, native CSS, and IntersectionObserver. This is the
  EXECUTION layer: it turns "make it look like this" into paste-ready code. Triggers include
  "اعمل أنميشن", "نفّذ هالحركة", "حركة على scroll", "خليه يتحرك", "animate the hero",
  "scroll effect", "parallax", "reveal on scroll", "horizontal scroll", "marquee", "counter
  animation", "smooth scroll", "hover effect", "recreate this animation". Do NOT use this for
  animation PRINCIPLES, timing theory, or choosing what to animate — that is ui-ux-pro-max.
  Do NOT use for React/Framer Motion work — that is motion-framer. Use AFTER the design
  direction is set, when the job is "build this motion on my HTML/Tailwind/JS stack."
---

# web-animation-vanilla

## Purpose
ui-ux-pro-max decides *what* should move and *why*. This skill decides *how* to build it on
my exact stack — **Static HTML + Tailwind CSS + Vanilla JS, no frameworks**. When I hand you
a reference ("make the hero like this Awwwards site"), you map the effect to a technique below
and produce paste-ready code. No React. No build step required beyond the Tailwind CLI.

---

## 1. Tooling & CDN tags (the only libraries allowed)

Add only what the page actually uses. Order: GSAP core → plugins → your script.

```html
<!-- GSAP core (animation engine) -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>

<!-- ScrollTrigger (scroll-driven animation: reveals, pins, parallax, horizontal scroll) -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>

<!-- OPTIONAL: ScrollSmoother (smooth/inertia scrolling — GSAP Club/free CDN; needs ScrollTrigger) -->
<!-- Only add if the reference clearly has buttery smooth-scroll. Otherwise skip it. -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollSmoother.min.js"></script>

<!-- OPTIONAL: SplitText alternative for line/char splitting — use the tiny vanilla helper below
     instead of paid SplitText to keep it free. -->

<!-- lottie-web (vector/After-Effects JSON animations: icons, illustrations, loaders) -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.12.2/lottie.min.js"></script>
```

| Tool | Use it for | Don't use it for |
|------|-----------|------------------|
| **Native CSS transitions/keyframes** | hover states, simple fades, loaders, anything that runs on `:hover`/`:focus` or loops forever | scroll-synced or sequenced timelines |
| **IntersectionObserver** | reveal-on-scroll trigger (add a class when element enters viewport) — zero-dependency | scrubbing animation to scroll position |
| **GSAP core** | sequenced timelines, staggers, precise easing, number counters, hover micro-interactions that need control | a single one-shot fade (CSS is lighter) |
| **GSAP ScrollTrigger** | parallax, pinned/sticky sections, horizontal scroll, scrub-to-scroll, scroll-batched reveals | a loader that just spins (CSS) |
| **ScrollSmoother** (optional) | inertia/smooth page scroll when the reference demands it | every site — it adds weight + can fight native scroll on mobile |
| **lottie-web** | designer-supplied `.json` vector animations (Canva/AE export) | things you can do in CSS/GSAP — don't ship a JSON for a fade |

**Default decision:** if CSS or IntersectionObserver can do it, use them. Reach for GSAP only
when you need a *timeline* (multiple steps, stagger, scrub, pin).

---

## 2. Reference → technique mapping table

When I show you a reference, find the row, build with the named technique.

| Reference effect | Build it with | Key API / notes |
|---|---|---|
| Hero text reveal / word or line stagger | GSAP timeline + split helper | split into spans, `gsap.from(words, {yPercent:100, opacity:0, stagger:.06})` |
| Fade / slide-in on scroll | IntersectionObserver + CSS class **or** `ScrollTrigger.batch` | toggle `.is-visible`; batch for many cards |
| Parallax (bg/element moves slower) | ScrollTrigger + `scrub` | animate `yPercent` with `scrub:true` |
| Sticky / pinned section | ScrollTrigger `pin:true` | pin a panel while inner content animates |
| Horizontal scroll (gallery) | ScrollTrigger `pin` + translate track on x | `xPercent` of track = -(panels-1)*100 |
| Marquee / infinite ticker | CSS keyframes **or** GSAP loop | duplicate content, translateX -50%, `linear infinite` |
| Number counter | GSAP `to({val})` + `onUpdate` | trigger once via ScrollTrigger `once:true` |
| Image reveal / mask wipe | GSAP + `clip-path` inset | animate `clip-path` from inset(100% ...) to inset(0) |
| Smooth scrolling | ScrollSmoother (optional) | `ScrollSmoother.create({smooth:1.2})` |
| Hover micro-interaction (magnetic, lift, underline) | CSS transition **or** GSAP `quickTo` | use `transform`+`opacity` only |
| Scroll progress bar | ScrollTrigger | animate width/scaleX of a fixed bar |
| Cursor follower | Vanilla JS + GSAP `quickTo` | lerp toward pointer with `gsap.quickTo` |

---

## 3. Paste-ready snippets — the 5 most common effects

### Tiny split helper (free SplitText replacement)
```js
// Splits an element's text into word spans (and keeps spaces). Reusable.
function splitWords(el) {
  const words = el.textContent.trim().split(/\s+/);
  el.innerHTML = words
    .map(w => `<span class="word"><span class="word-inner">${w}</span></span>`)
    .join(' ');
  return el.querySelectorAll('.word-inner');
}
```
```css
/* Mask so words rise from a clipped line */
.word { display:inline-block; overflow:hidden; vertical-align:top; }
.word-inner { display:inline-block; will-change:transform; }
```

### 1) Hero text reveal with stagger
```js
gsap.registerPlugin(ScrollTrigger);
window.addEventListener('DOMContentLoaded', () => {
  const heading = document.querySelector('[data-hero-text]');
  if (!heading) return;
  const words = splitWords(heading);
  gsap.from(words, {
    yPercent: 110,
    opacity: 0,
    duration: 0.9,
    ease: 'power3.out',
    stagger: 0.06,
    delay: 0.15,
  });
});
```
```html
<h1 data-hero-text class="text-5xl font-bold">نبني حضورًا رقميًا يليق بعلامتك</h1>
```

### 2) Reveal-on-scroll (IntersectionObserver — no GSAP needed)
```css
.reveal { opacity:0; transform:translateY(28px); transition:opacity .7s ease, transform .7s ease; will-change:transform,opacity; }
.reveal.is-visible { opacity:1; transform:none; }
```
```js
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));
```
```html
<div class="reveal">…card…</div>
```

### 3) Parallax on scroll (ScrollTrigger scrub)
```js
gsap.registerPlugin(ScrollTrigger);
gsap.utils.toArray('[data-parallax]').forEach(el => {
  const depth = parseFloat(el.dataset.parallax) || 0.2; // 0.2 = subtle
  gsap.to(el, {
    yPercent: -depth * 100,
    ease: 'none',
    scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
  });
});
```
```html
<img data-parallax="0.25" src="bg.jpg" class="w-full" alt="">
```

### 4) Number counter (fires once when visible)
```js
gsap.registerPlugin(ScrollTrigger);
gsap.utils.toArray('[data-count]').forEach(el => {
  const target = parseFloat(el.dataset.count);
  const obj = { val: 0 };
  ScrollTrigger.create({
    trigger: el, start: 'top 85%', once: true,
    onEnter: () => gsap.to(obj, {
      val: target, duration: 1.6, ease: 'power1.out',
      onUpdate: () => { el.textContent = Math.round(obj.val).toLocaleString('ar-EG'); },
    }),
  });
});
```
```html
<span data-count="1200">0</span>+ <span>عميل</span>
```

### 5) Horizontal scroll section (pinned)
```js
gsap.registerPlugin(ScrollTrigger);
const track = document.querySelector('[data-hscroll]');
if (track) {
  const panels = gsap.utils.toArray('[data-hscroll] > *');
  gsap.to(panels, {
    xPercent: -100 * (panels.length - 1),
    ease: 'none',
    scrollTrigger: {
      trigger: track,
      pin: true,
      scrub: 1,
      end: () => '+=' + track.scrollWidth,
    },
  });
}
```
```html
<section class="overflow-hidden">
  <div data-hscroll class="flex w-max">
    <div class="w-screen shrink-0">Panel 1</div>
    <div class="w-screen shrink-0">Panel 2</div>
    <div class="w-screen shrink-0">Panel 3</div>
  </div>
</section>
```

### Bonus — marquee (pure CSS, cheapest)
```css
@keyframes marquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }
.marquee { display:flex; gap:3rem; width:max-content; animation:marquee 22s linear infinite; }
.marquee:hover { animation-play-state:paused; }
```

### Bonus — lottie mount
```js
lottie.loadAnimation({
  container: document.querySelector('#lottie'),
  renderer: 'svg', loop: true, autoplay: true,
  path: '/assets/animation.json',
});
```

---

## 4. Performance rules (target 60fps)
1. **Animate only `transform` and `opacity`.** They run on the GPU compositor.
2. **Never animate `width`, `height`, `top`, `left`, `margin`, `padding`** — they trigger
   layout/reflow and drop frames. Use `transform: translate/scale` instead. (Exception: a
   one-off `clip-path` reveal is fine.)
3. **`will-change` sparingly** — only on elements actively animating, and remove it after.
   Slapping it on everything wastes GPU memory and backfires.
4. **Lazy-init below-the-fold animations** — set up ScrollTrigger/IO so timelines build only
   when relevant; don't run 30 timelines on load.
5. **Batch many reveals** with `ScrollTrigger.batch()` or one IntersectionObserver, not one
   trigger per card.
6. **Kill jank sources:** debounce nothing inside scrub (GSAP handles it); avoid heavy
   box-shadow/filter transitions; prefer transform-based shadows where possible.
7. **Mobile:** reduce or disable parallax/pin-heavy effects on small screens — they're the
   first to stutter. Gate with a `matchMedia('(min-width: 768px)')` check.

```js
// Gate expensive scroll effects to desktop
ScrollTrigger.matchMedia ? null : null;
gsap.matchMedia().add('(min-width: 768px)', () => {
  // build parallax / horizontal-scroll here
});
```

---

## 5. Accessibility — always honor reduced motion
Every page with motion ships this. Non-negotiable.

```js
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (reduce) {
  // Skip building timelines; make content immediately visible.
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
} else {
  // ...build GSAP / IntersectionObserver animations here...
}
```
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: .001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: .001ms !important;
    scroll-behavior: auto !important;
  }
}
```
Rule: reduced-motion users must still see all content and reach all functionality — never
leave them with an element stuck at `opacity:0`.

---

## 6. When is 3D / WebGL (Three.js) justified?

**Default answer: refuse it.** A consultancy client site does not need WebGL.

Use Three.js ONLY if **all** of these are true:
1. The 3D element is *the core brand statement* (e.g. a configurable product, a hero artifact
   that defines the identity — like the Petravex stone→building metaphor), not decoration.
2. There is no GSAP/CSS/Lottie way to get 80% of the effect at 5% of the cost.
3. The client accepts the weight: bundle + model assets, slower first paint, and a real
   mobile fallback budget.

If used, mandatory guardrails: lazy-load Three.js (dynamic import, never in `<head>`), cap
device pixel ratio, pause the render loop when off-screen/tab hidden, and ship a static
image/SVG fallback for mobile and reduced-motion.

**Refuse and offer the cheap alternative when:** the ask is "add a cool 3D background", a
floating blob, particles, or a tilt card. Counter with CSS 3D transforms, a Lottie, or a
GSAP parallax — say so plainly.

---

## HARD RULES
- **Stack only:** Static HTML + Tailwind + Vanilla JS. No React/Vue/Next, no jQuery.
- **Libraries allowed:** GSAP (+ScrollTrigger, optional ScrollSmoother), lottie-web, native
  CSS, IntersectionObserver. Nothing else without asking.
- **Animate `transform` + `opacity` only.** Never `width/height/top/left/margin`.
- **`prefers-reduced-motion` is mandatory** on every animated page.
- **CDN over npm** for these libs (matches the no-build static stack); pin versions.
- **CSS/IO first, GSAP when you need a timeline.** Don't load GSAP for one fade.
- **Don't ship a Lottie for something CSS does.** Don't ship Three.js for decoration.
- **Gate heavy scroll effects (pin/parallax/horizontal) to desktop** via `gsap.matchMedia`.
- **Register plugins once:** `gsap.registerPlugin(ScrollTrigger)` before use.
- This skill executes motion; it does not decide the design — pair with ui-ux-pro-max.

## EXAMPLE TRIGGERS
- "اعمل أنميشن للـ hero" / "animate the hero text"
- "نفّذ هالحركة من الموقع هاد" / "recreate this animation from this reference"
- "بدي scroll effect" / "add a scroll effect" / "reveal on scroll"
- "خليه parallax" / "add parallax to the background image"
- "اعمل horizontal scroll للمعرض" / "horizontal scrolling gallery"
- "marquee شريط متحرك" / "infinite marquee ticker"
- "counter للأرقام" / "animate the stats counter"
- "hover micro-interaction للأزرار" / "magnetic hover button"
- "smooth scrolling للموقع" / "add smooth scroll"
- "بدي WebGL hero" → check the Section 6 decision rule before agreeing.
