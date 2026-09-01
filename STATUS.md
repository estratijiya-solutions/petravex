# STATUS — Petravex Group

_آخر تحديث: 2026-09-01_

## الحالة
🟡 **قيد التطوير** — لسا ما في نشر production على petravex.com. المعاينة تمرّ عبر الدومين التجريبي estratijiyatest.com.

## آخر شغل
- **2026-09-01** — جولة تدقيق (نظافة + SEO تقني + ربط جوجل) بعقد **صفر تغيير بصري**. شوف
  [`docs/AUDIT-2026-09-01.md`](docs/AUDIT-2026-09-01.md). باختصار: انشال `deploy.local.env`
  (باسوورد VPS مكشوف — **لازم يتبدّل**)، انحذفت ملفات عهد الـ VPS الميتة و`_tojan-compose.yml`
  ونسخة `estratijiya-skills/`، وانضاف metadata لكل صفحة + canonical + hreflang + JSON-LD +
  `robots.ts` + `sitemap.ts` + هيكل GA4/Search Console معطّل لحد ما تجي المعرّفات.
- **2026-07-15** — نقل الريبو لـ `F:\coding\websites\petravex` وإعداده ضمن هيكل العملاء: تأكيد `git status` و `origin`، تنظيف worktrees مكسورة بـ `git worktree prune`، وإضافة `CLAUDE.md` + `STATUS.md`.
- **2026-07-15** — إضافة صفحة الهبوط المعتمدة تحت `landing/index.html`.
- **سابقاً** — بناء تطبيق Next.js: هيرو WebGL (حجر → كيس إسمنت → مبنى) مع fallback SVG على الموبايل، وإصلاحات تصادم الهيرو مع الـ wordmark على الموبايل.

## الخطوة الجاية
- 🔴 **بدّل باسوورد الـ VPS القديم** — كان بنص صريح على القرص بـ `deploy.local.env`.
- 🔴 **زر تبديل اللغة مكسور بالـ HTML الستاتيكي** على الصفحات الإنجليزية: بيولّد
  `/ar/en/...` وهاد 404. التفاصيل والإصلاح المقترح بتقرير التدقيق.
- **ممنوع فتح الفهرسة** لحد ما ينتقل الموقع لـ petravex.com (`ALLOW_INDEXING` بـ `lib/seo.ts`).
- **حسم الاتجاه:** فيه مسارين — تطبيق Next.js الكامل (`app/`) وصفحة الهبوط المعتمدة (`landing/`). لازم يتأكد أي واحد هو الـ deliverable النهائي لـ petravex.com.
- توجيه الدومين الفعلي: تحديث `docker-compose.yml` من `estratijiyatest.com` لـ `petravex.com` (+ DNS) وقت الموافقة والجهوزية.
- تنظيف مخلّفات `visualizuae.com` من `DEPLOY.md`.

## ملاحظات صيانة
- تبقّى مجلدات worktree فيزيائية قديمة تحت `.claude/worktrees/` (بعضها فيه ملفات checkout قديمة). مستثناة من git وما بتأثر على الريبو؛ تتحذف يدوياً وقت التأكد إنها ما فيها شغل مطلوب.
