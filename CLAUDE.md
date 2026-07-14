# Petravex Group — موقع العميل

## نوع المشروع
موقع عميل (Estratijiya) — موقع تعريفي لشركة **Petravex Group**: قابضة صناعية مقرّها الإمارات (RAKEZ، رأس الخيمة)، محطة طحن كلنكر 150 TPH تشغيل Q1 2027. ثنائي اللغة (إنجليزي/عربي) عبر `next-intl`.

## الستاك
**Next.js 14 (App Router) + TypeScript + Tailwind CSS** — ⚠️ هذا مش الستاك الستاتيكي المعتاد لباقي عملاء Estratijiya، هون في Node وقت التشغيل.
- التوجيه واللغات: `app/[locale]/` + `next-intl` (ترجمات بـ `messages/ar.json` و `messages/en.json`، إعداد `i18n.ts` + `middleware.ts`)
- 3D / موشن: `three` + `@react-three/fiber` + `@react-three/drei` (هيرو WebGL) — مع fallback SVG على الموبايل
- أنميشن إضافي: `framer-motion` + `gsap`
- فورمات: `react-hook-form` + `zod`
- النشر: **Docker + Traefik + Let's Encrypt** (مش Coolify) — شوف `DEPLOY.md` و `docker-compose.yml` و `scripts/`

### `landing/` — صفحة الهبوط المعتمدة
`landing/index.html` صفحة هبوط **static صرف** (HTML واحد، ~70KB) معتمدة نهائياً من الـ PM (شوف التعليق برأس الملف). منفصلة عن تطبيق Next.js. أي تعديل عليها لازم موافقة PM.

## الدومين
- **Production (الهدف):** petravex.com — info@petravex.com · +971542494377
- **معاينة حالية:** `docker-compose.yml` بيوجّه حالياً لـ `estratijiyatest.com` (دومين تجريبي لعرض الموقع قبل الموافقة، مش production).
- ⚠️ `DEPLOY.md` لسا فيه إشارات لـ `visualizuae.com` (مخلّفات من قالب/مشروع سابق) — تجاهلها، الدومين الفعلي petravex.com.

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
infra/ scripts/   سكربتات النشر (server-setup / deploy)
Dockerfile        بناء الحاوية (Next.js standalone)
docker-compose.yml  تعريف الخدمة + Traefik labels
```

## ⚠️ تحذيرات
- ستاك Node (مش static) — النشر عبر Docker على VPS، مش رفع ملفات ستاتيكية.
- أي تعديل نصّي لازم يتزامن بين `messages/en.json` و `messages/ar.json`.
- `landing/index.html` معتمدة ونهائية — لا تعدّلها بلا موافقة PM.
- ملفات cross-client (تدقيقات سيرفر، أسرار عملاء آخرين) ممنوع تُكمِت هون — `.gitignore` بيستثني `AUDIT-*.md` و `.agents/` و `skills-lock.json`؛ السكراتش انتقل لـ `F:/coding/_scratch/`.
- لا تكمّت `node_modules/` ولا `.next/` (مستثناة بالـ `.gitignore`).
