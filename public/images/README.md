# Real photography — drop-in slots

The site uses **Picsum.photos placeholder real photos** for News and DualCTA.
These are deterministic real photos but **not themed to Petravex** — swap them
out for actual Petravex photography as soon as you have files.

## How to swap to real Petravex photos

Drop these files into this folder:

```
public/images/
  news-clinker-mill.jpg     1600×1000  (16:10 — news lead, the clinker mill)
  news-distribution.jpg      800×600   (4:3 — distribution / fleet)
  news-partnership.jpg       800×600   (4:3 — construction site)
  cta-supplier.jpg          1000×1500  (2:3 — DualCTA supplier card)
  cta-buyer.jpg             1000×1500  (2:3 — DualCTA buyer card)
```

Then update the `newsImages` array in `components/sections/NewsHighlight.tsx`
and the `image` field in each card in `components/sections/DualCTA.tsx`:

```tsx
// Before
'https://picsum.photos/seed/petravex-mill/1600/1000'
// After
'/images/news-clinker-mill.jpg'
```

## Photo treatment

Photos are rendered with this filter for unified brand feel:

```css
filter: grayscale(0.4) contrast(1.05) brightness(0.78);
```

Plus a gold radial wash and a bottom dark gradient. This integrates any
photograph into the dark gold-accent visual language without retouching.
You can tone it down (lower the grayscale value) if Petravex photography is
already styled.

## Logo

`/public/logo.png` is the official brand asset supplied by Petravex.
Used inline via `components/ui/LogoMark.tsx`. Do not replace without
brand approval.
