---
name: web-3d-threejs
description: >
  Build 3D on the Estratijiya stack — Static HTML + Vanilla JS — with Three.js (ES module
  via CDN import map): scene/camera/renderer, GLTFLoader for models, and three production
  patterns (rotating hero object, particle/starfield background, interactive product viewer)
  with paste-ready snippets, a strict performance budget, mandatory reduced-motion → static
  image fallback, and Spline as the no-code option. Triggers include "اعمل 3D", "موديل 3D",
  "three.js", "3D hero", "خلفية جزيئات", "particle background", "starfield", "product viewer
  3D", "عارض منتج ثلاثي الأبعاد", "Spline". Do NOT use for 2D scroll/CSS/GSAP motion (that is
  web-animation-vanilla) or for design direction (ui-ux-pro-max). 3D is heavy — apply the
  §6 decision rule and REFUSE it for decoration; most sites should use web-animation-vanilla
  instead.
---

# web-3d-threejs

## Purpose
The execution layer for *justified* 3D on a static client site. Three.js is powerful and
heavy — this skill makes it ship-able (module setup, the 3 patterns clients actually ask for,
and a performance + accessibility budget that keeps it from tanking the site). It shares
web-animation-vanilla's bias: **default to refusing 3D; reach for it only when it's the core
brand statement.** (§6)

---

## 1. Setup — ES modules via CDN import map (no build step)
Three.js ships as ES modules; use an import map so the no-build static stack can `import` it.
```html
<script type="importmap">
{
  "imports": {
    "three": "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js",
    "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/"
  }
}
</script>
<canvas id="scene" class="block w-full h-[60vh]"></canvas>
<script type="module" src="./js/scene3d.js"></script>
```
Addons (loaders, controls) come from the `three/addons/` path, e.g.
`import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'`.

## 2. Scene / camera / renderer basics (the spine of every snippet)
```js
import * as THREE from 'three';

const canvas = document.querySelector('#scene');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // cap DPR — perf

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
camera.position.set(0, 0, 5);

scene.add(new THREE.AmbientLight(0xffffff, 0.8));
const key = new THREE.DirectionalLight(0xffffff, 1.2); key.position.set(3, 5, 2); scene.add(key);

function resize() {
  const w = canvas.clientWidth, h = canvas.clientHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / h; camera.updateProjectionMatrix();
}
window.addEventListener('resize', resize); resize();
```

## 3. GLTFLoader — load a designer-supplied model (.glb)
```js
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
const loader = new GLTFLoader();
loader.load('./assets/model.glb', (gltf) => {
  scene.add(gltf.scene);
}, undefined, (err) => console.error('GLB load failed', err));
```
Prefer **`.glb`** (binary, single file). Keep it small (§5).

---

## 4. The 3 patterns (paste-ready)

All three assume the §2 spine and follow the §5 budget + §7 fallback. Each exposes
`start()` / `stop()` so the IntersectionObserver gate (§5) can pause off-screen.

### A) Rotating hero object
```js
import * as THREE from 'three';
const geo = new THREE.IcosahedronGeometry(1.2, 0);
const mat = new THREE.MeshStandardMaterial({ color: 0x1a56db, roughness: 0.3, metalness: 0.6 });
const mesh = new THREE.Mesh(geo, mat);
scene.add(mesh);

let raf = null;
function tick() { mesh.rotation.y += 0.005; mesh.rotation.x += 0.002; renderer.render(scene, camera); raf = requestAnimationFrame(tick); }
export function start() { if (!raf) tick(); }
export function stop() { if (raf) cancelAnimationFrame(raf), raf = null; }
```

### B) Particle / starfield background
```js
import * as THREE from 'three';
const COUNT = 1200; // keep low on mobile (see §5)
const positions = new Float32Array(COUNT * 3);
for (let i = 0; i < positions.length; i++) positions[i] = (Math.random() - 0.5) * 20;
const g = new THREE.BufferGeometry();
g.setAttribute('position', new THREE.BufferAttribute(positions, 3));
const pts = new THREE.Points(g, new THREE.PointsMaterial({ size: 0.03, color: 0xffffff }));
scene.add(pts);

let raf = null;
function tick() { pts.rotation.y += 0.0006; renderer.render(scene, camera); raf = requestAnimationFrame(tick); }
export function start() { if (!raf) tick(); }
export function stop() { if (raf) cancelAnimationFrame(raf), raf = null; }
```

### C) Interactive product viewer (orbit controls)
```js
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; controls.enablePan = false;
controls.minDistance = 3; controls.maxDistance = 8;
controls.autoRotate = true; controls.autoRotateSpeed = 0.8;

new GLTFLoader().load('./assets/product.glb', (g) => scene.add(g.scene));

let raf = null;
function tick() { controls.update(); renderer.render(scene, camera); raf = requestAnimationFrame(tick); }
export function start() { if (!raf) tick(); }
export function stop() { if (raf) cancelAnimationFrame(raf), raf = null; }
```

---

## 5. Performance budget (non-negotiable)
- **Poly/asset:** hero/product model < ~100k tris, `.glb` (Draco-compressed) ideally < 2–3MB.
  Particles: ≤ ~1500 desktop, ≤ ~500 mobile.
- **DPR capped** at 2 (`setPixelRatio(Math.min(devicePixelRatio, 2))`).
- **Pause when off-screen** via IntersectionObserver — never render a canvas nobody sees:
  ```js
  const io = new IntersectionObserver((es) => es.forEach(e => e.isIntersecting ? start() : stop()));
  io.observe(canvas);
  document.addEventListener('visibilitychange', () => document.hidden ? stop() : start());
  ```
- **Lazy-load Three.js** — the `<script type="module">` only on pages that use 3D, never in a
  global `<head>` for the whole site.
- **Mobile detection / downgrade:** fewer particles, simpler material, or skip 3D entirely on
  small/low-power devices and show the fallback (§7).
- **Dispose** geometries/materials/textures if you tear a scene down (SPA-like nav).
- Target 60fps; if it stutters on a mid device, reduce the scene before shipping.

## 6. Decision rule — is 3D justified? (aligned with web-animation-vanilla §6)
**Default: refuse.** Use Three.js ONLY if **all** hold:
1. The 3D element is the **core brand statement** (a configurable product, a signature hero
   artifact), not decoration.
2. There's no GSAP/CSS/Lottie way to get ~80% of the effect at a fraction of the cost.
3. The client accepts the weight: bundle + model assets, slower first paint, real mobile
   fallback budget.

**Refuse and offer the cheap alternative** when the ask is "a cool 3D background", a floating
blob, a tilt card, or generic particles for vibe → counter with CSS 3D transforms, a Lottie,
or GSAP parallax from **web-animation-vanilla**. Say so plainly.

## 7. Mandatory accessibility / fallback
3D must degrade to a **static image** for reduced-motion users and as the mobile/low-power
fallback. Build it so the image is the default and 3D is the enhancement:
```html
<div id="hero3d" class="relative">
  <img src="/assets/hero-fallback.jpg" alt="..." class="w-full" id="hero3d-img" />
  <canvas id="scene" class="absolute inset-0 hidden"></canvas>
</div>
```
```js
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const smallOrWeak = matchMedia('(max-width: 768px)').matches || (navigator.hardwareConcurrency || 4) <= 4;
if (reduce || smallOrWeak) {
  // keep the <img>, never init WebGL
} else {
  document.querySelector('#hero3d-img').classList.add('hidden');
  canvas.classList.remove('hidden');
  // ...init scene + IntersectionObserver gate...
}
```

## 8. Spline — the no-code alternative
For **simple** 3D (a single decorative object, light interactivity) where a full Three.js
build isn't worth it, embed a **Spline** scene instead — design it in Spline, export the
viewer:
```html
<script type="module" src="https://unpkg.com/@splinetool/viewer/build/spline-viewer.js"></script>
<spline-viewer url="https://prod.spline.design/XXXX/scene.splinecode"></spline-viewer>
```
Still apply §7 (reduced-motion/mobile fallback) and lazy-load. Use Spline when speed-to-ship
beats control; use hand-written Three.js when you need real performance control or custom logic.

---

## HARD RULES
- **Default to refusing 3D** — apply §6. Decoration/vibe → use web-animation-vanilla instead.
- **Static HTML + Vanilla JS only.** Three.js via CDN import map, no build step, no framework.
- **Lazy-load Three.js on the 3D page only** — never global.
- **Performance budget is mandatory:** cap DPR at 2, pause off-screen via IntersectionObserver,
  pause on tab-hidden, keep polys/particles within §5, dispose on teardown.
- **Mandatory static-image fallback** for `prefers-reduced-motion` AND mobile/low-power — image
  is the default, 3D is the enhancement.
- **Prefer `.glb` (Draco) models**, kept small.
- **Spline** is the no-code path for simple cases; full Three.js when you need control/perf.
- Aligns with web-animation-vanilla's 3D decision rule — don't contradict it.

## EXAMPLE TRIGGERS
- "اعمل 3D hero للموقع" / "build a 3D hero object"
- "خلفية particles / starfield" / "particle / starfield background"
- "عارض منتج 3D تفاعلي" / "interactive 3D product viewer"
- "حمّل موديل glb" / "load a GLTF/GLB model with Three.js"
- "نستخدم Spline؟" / "should we use Spline instead?"
- "هل نعمل 3D ولا لأ؟" / "is 3D justified here or too heavy?" → apply §6.
