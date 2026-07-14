# STATUS — Petravex Group

_آخر تحديث: 2026-07-15_

## الحالة
🟡 **قيد التطوير** — لسا ما في نشر production على petravex.com. المعاينة تمرّ عبر الدومين التجريبي estratijiyatest.com.

## آخر شغل
- **2026-07-15** — نقل الريبو لـ `F:\coding\websites\petravex` وإعداده ضمن هيكل العملاء: تأكيد `git status` و `origin`، تنظيف worktrees مكسورة بـ `git worktree prune`، وإضافة `CLAUDE.md` + `STATUS.md`.
- **2026-07-15** — إضافة صفحة الهبوط المعتمدة تحت `landing/index.html`.
- **سابقاً** — بناء تطبيق Next.js: هيرو WebGL (حجر → كيس إسمنت → مبنى) مع fallback SVG على الموبايل، وإصلاحات تصادم الهيرو مع الـ wordmark على الموبايل.

## الخطوة الجاية
- **حسم الاتجاه:** فيه مسارين — تطبيق Next.js الكامل (`app/`) وصفحة الهبوط المعتمدة (`landing/`). لازم يتأكد أي واحد هو الـ deliverable النهائي لـ petravex.com.
- توجيه الدومين الفعلي: تحديث `docker-compose.yml` من `estratijiyatest.com` لـ `petravex.com` (+ DNS) وقت الموافقة والجهوزية.
- تنظيف مخلّفات `visualizuae.com` من `DEPLOY.md`.

## ملاحظات صيانة
- تبقّى مجلدات worktree فيزيائية قديمة تحت `.claude/worktrees/` (بعضها فيه ملفات checkout قديمة). مستثناة من git وما بتأثر على الريبو؛ تتحذف يدوياً وقت التأكد إنها ما فيها شغل مطلوب.
