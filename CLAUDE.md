# Petravex Group — موقع العميل

## نوع المشروع
موقع عميل (Estratijiya) — موقع تعريفي لشركة **Petravex Group**: قابضة صناعية مقرّها الإمارات (RAKEZ، رأس الخيمة)، محطة طحن كلنكر 150 TPH تشغيل Q1 2027. ثنائي اللغة (إنجليزي/عربي) عبر `next-intl`.

## الستاك
**Next.js (App Router) + TypeScript + Tailwind CSS** — يُبنى بـ **`output: 'export'`** (ستاتيك كامل، بلا Node وقت التشغيل). المخرج بـ `out/` وينرفع كملفات ستاتيكية على استضافة Hostinger المشتركة.
- التوجيه واللغات: `app/[locale]/` + `next-intl` (ترجمات بـ `messages/ar.json` و `messages/en.json`، إعداد `i18n.ts`). ⚠️ `middleware.ts` **معطّل** (`middleware.ts.disabled`) — الـ static export ما بيشغّل middleware أصلاً. الإنجليزي بينبني تحت `/en/` وبينتقل يدوياً لجذر `out/`، والـ `.htaccess` بيعمل 301 من `/en/*` للجذر.
- 3D / موشن: `three` + `@react-three/fiber` + `@react-three/drei` (هيرو WebGL) — مع fallback SVG على الموبايل
- أنميشن إضافي: `framer-motion` + `gsap`
- فورمات: `react-hook-form` + `zod`
- النشر: **رفع ستاتيكي لـ Hostinger** (`out/` → `public_html/`). ملفات عهد الـ VPS (`Dockerfile`، `docker-compose.yml`، `DEPLOY.md`، `infra/`، `scripts/`) **انحذفت بتدقيق 2026-09-01** — الـ VPS انمسح. بترجع من تاريخ git وقت الحاجة.
- SEO / تحليلات: كل الثوابت بمكان واحد — `lib/seo.ts` (الدومين، صورة المشاركة، توكن Search Console، معرّف GA4، ومفتاح `ALLOW_INDEXING`).

### `landing/` — صفحة الهبوط المعتمدة
`landing/index.html` صفحة هبوط **static صرف** (HTML واحد، ~70KB) معتمدة نهائياً من الـ PM (شوف التعليق برأس الملف). منفصلة عن تطبيق Next.js. أي تعديل عليها لازم موافقة PM.

## الدومين
- **Production (الهدف):** petravex.com — info@petravex.com · +971542494377
- **معاينة حالية:** `estratijiyatest.com` — دومين تجريبي **ما بيملكه العميل**، لعرض الموقع قبل الموافقة.
- 🔴 **ممنوع فتح الفهرسة** طول ما الموقع على الدومين التجريبي. `app/robots.ts` بيطلع `Disallow: /`، وكل canonical و hreflang بيشيروا لـ `petravex.com`. وقت النقل الفعلي: بدّل `ALLOW_INDEXING` لـ `true` بـ `lib/seo.ts` — سطر واحد بس.

## الفرع الرئيسي
`main` — الريموت الوحيد `origin` → https://github.com/taifnals/petravex.git

## بنية الملفات
```
app/[locale]/     صفحات Next.js حسب اللغة
app/api/          راوتات API (فورم التواصل …)
components/       مكوّنات React
lib/              مساعدات
messages/         ترجمات next-intl (ar.json / en.json)
public/           أصول static
landing/          صفحة الهبوط المعتمدة (static HTML مستقل)
out/              مخرج البناء الستاتيكي (خارج git — هو المرفوع فعلياً)
docs/             توثيق الموقع (تقارير التدقيق، ملاحظات الأصول)
```

## ⚠️ تحذيرات
- ستاك Node (مش static) — النشر عبر Docker على VPS، مش رفع ملفات ستاتيكية.
- أي تعديل نصّي لازم يتزامن بين `messages/en.json` و `messages/ar.json`.
- `landing/index.html` معتمدة ونهائية — لا تعدّلها بلا موافقة PM.
- ملفات cross-client (تدقيقات سيرفر، أسرار عملاء آخرين) ممنوع تُكمِت هون — `.gitignore` بيستثني `AUDIT-*.md` و `.agents/` و `skills-lock.json`؛ السكراتش انتقل لـ `F:/coding/_scratch/`.
- لا تكمّت `node_modules/` ولا `.next/` ولا `out/` (مستثناة بالـ `.gitignore`).
- 🔴 **ممنوع أي سر بنص صريح بالمجلد** — ولا حتى بملف مستثنى بالـ `.gitignore`. تدقيق 2026-09-01 لقى `deploy.local.env` فيه باسوورد VPS مكشوف على القرص؛ انشال، والباسوورد لازم يتبدّل.
- `public/` بينرفع كامل للإنترنت. أي ملف توثيق داخلي بيروح `docs/` مش `public/` (سابقة: `public/images/README.md` كان مقروء على `/images/README.md`).
