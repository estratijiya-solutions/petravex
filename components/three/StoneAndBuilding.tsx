'use client';

import { useMemo, useRef, type RefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const GOLD = new THREE.Color('#D4AF37');
const CYCLE = 30; // seconds — full stone → bag → building → stone cycle

type Props = {
  scrollRef: RefObject<number>;
  mouseRef: RefObject<{ x: number; y: number }>;
};

/**
 * Petravex value-chain in motion. A single rotating object morphs through
 * three forms — stone (raw material), cement bag (product), building (built
 * future) — embodying "من الحجر إلى ناطحات السحاب".
 *
 * Implementation: all three forms share the same origin; a 30-second
 * continuous rotation drives a 3-phase cosine cross-fade so exactly one
 * form is dominant at any moment, with smooth blend at transitions.
 */
export function StoneAndBuilding({ scrollRef, mouseRef }: Props) {
  const groupRef = useRef<THREE.Group>(null);

  const stoneGroupRef = useRef<THREE.Group>(null);
  const stoneRef = useRef<THREE.LineSegments>(null);
  const bagGroupRef = useRef<THREE.Group>(null);
  const buildingGroupRef = useRef<THREE.Group>(null);

  const dustRef = useRef<THREE.Points>(null);
  const groundRef = useRef<THREE.Mesh>(null);

  // ── Stone — irregular icosahedron, vertex-displaced ──
  const stoneGeom = useMemo(() => {
    const base = new THREE.IcosahedronGeometry(3.0, 1);
    const pos = base.attributes.position;
    const v = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);
      const n = Math.sin(i * 12.9898 + 7.317) * 43758.5453;
      const f = 0.72 + (n - Math.floor(n)) * 0.50;
      v.multiplyScalar(f);
      pos.setXYZ(i, v.x, v.y, v.z);
    }
    base.computeVertexNormals();
    return new THREE.EdgesGeometry(base, 14);
  }, []);

  // ── Cement bag — 5 parts so it reads clearly as a bag ──
  const bagBodyGeom = useMemo(() => {
    const g = new THREE.BoxGeometry(2.6, 4.0, 0.85);
    return new THREE.EdgesGeometry(g);
  }, []);
  const bagTopSealGeom = useMemo(() => {
    const g = new THREE.BoxGeometry(2.6, 0.5, 0.85);
    g.translate(0, 2.25, 0);
    return new THREE.EdgesGeometry(g);
  }, []);
  const bagBottomBandGeom = useMemo(() => {
    const g = new THREE.BoxGeometry(2.6, 0.35, 0.85);
    g.translate(0, -1.825, 0);
    return new THREE.EdgesGeometry(g);
  }, []);
  const bagLabelOuterGeom = useMemo(() => {
    const g = new THREE.PlaneGeometry(1.8, 1.4);
    g.translate(0, 0, 0.43);
    return new THREE.EdgesGeometry(g);
  }, []);
  const bagLabelInnerGeom = useMemo(() => {
    const g = new THREE.PlaneGeometry(1.4, 0.85);
    g.translate(0, -0.05, 0.435);
    return new THREE.EdgesGeometry(g);
  }, []);

  // ── Building — tower with floor lines + interior verticals ──
  const buildingShellGeom = useMemo(() => {
    const g = new THREE.BoxGeometry(2.7, 6.6, 2.7);
    return new THREE.EdgesGeometry(g);
  }, []);
  const buildingFloorGeoms = useMemo(() => {
    const arr: THREE.BufferGeometry[] = [];
    for (let i = 1; i < 12; i++) {
      const y = -3.3 + (i * 6.6) / 12;
      const g = new THREE.BoxGeometry(2.7, 0.001, 2.7);
      g.translate(0, y, 0);
      arr.push(new THREE.EdgesGeometry(g));
    }
    return arr;
  }, []);
  const buildingVerticalGeoms = useMemo(() => {
    const arr: THREE.BufferGeometry[] = [];
    for (const x of [-0.5, 0.5]) {
      for (const z of [1.35, -1.35]) {
        const g = new THREE.BufferGeometry();
        g.setAttribute(
          'position',
          new THREE.Float32BufferAttribute([x, -3.3, z, x, 3.3, z], 3),
        );
        arr.push(g);
      }
    }
    return arr;
  }, []);

  // ── Atmospheric dust ──
  const dustGeom = useMemo(() => {
    const count = 320;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 4.5 + Math.random() * 17;
      const theta = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 10;
      arr[i * 3 + 0] = Math.cos(theta) * r;
      arr[i * 3 + 1] = y;
      arr[i * 3 + 2] = Math.sin(theta) * r;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(arr, 3));
    return g;
  }, []);

  useFrame(({ camera, clock }, delta) => {
    const t = clock.elapsedTime;
    const scroll = scrollRef.current ?? 0;
    const mouse = mouseRef.current ?? { x: 0, y: 0 };

    if (groupRef.current) {
      // One full rotation per cycle
      groupRef.current.rotation.y = (t / CYCLE) * Math.PI * 2;
      const ease = 1 - Math.pow(0.001, delta);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        mouse.y * 0.16 + Math.sin(t * 0.35) * 0.04,
        ease,
      );
      groupRef.current.rotation.z = Math.sin(t * 0.22) * 0.04;
      const s = 1 + Math.sin(t * 0.5) * 0.014;
      groupRef.current.scale.setScalar(s);
    }

    // Camera dolly with scroll, soft mouse parallax
    const targetZ = 9 + scroll * 4;
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.04);
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, mouse.x * 0.5, 0.04);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, mouse.y * 0.25, 0.04);
    camera.lookAt(0, 0, 0);

    // 3-phase cosine cross-fade — stone (0), bag (1/3), building (2/3)
    const phase = (t / CYCLE) % 1;
    applyPhaseOpacity(stoneGroupRef.current, windowAt(phase, 0));
    applyPhaseOpacity(bagGroupRef.current, windowAt(phase, 1 / 3));
    applyPhaseOpacity(buildingGroupRef.current, windowAt(phase, 2 / 3));

    // Gold breathing on the visible primary stone
    const pulse = 0.92 + Math.sin(t * 0.7) * 0.08;
    if (stoneRef.current) {
      const mat = stoneRef.current.material as THREE.LineBasicMaterial;
      mat.color.setRGB(0.831 * pulse, 0.686 * pulse, 0.216 * pulse);
    }

    // Ground glow pulse
    if (groundRef.current) {
      const mat = groundRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.06 + Math.sin(t * 0.4) * 0.02;
    }

    // Dust drift
    if (dustRef.current) {
      dustRef.current.rotation.y = t * 0.035;
      dustRef.current.position.y = Math.sin(t * 0.3) * 0.15;
    }
  });

  return (
    <>
      {/* Ground glow ring — gold light pool */}
      <mesh ref={groundRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -3.8, 0]}>
        <ringGeometry args={[1.5, 6, 96]} />
        <meshBasicMaterial
          color={GOLD}
          transparent
          opacity={0.06}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      <group ref={groupRef}>
        {/* ── STONE ── */}
        <group ref={stoneGroupRef}>
          <lineSegments geometry={stoneGeom} scale={1.14}>
            <lineBasicMaterial color={GOLD} transparent opacity={0.13} blending={THREE.AdditiveBlending} depthWrite={false} />
          </lineSegments>
          <lineSegments geometry={stoneGeom} scale={1.06}>
            <lineBasicMaterial color={GOLD} transparent opacity={0.28} blending={THREE.AdditiveBlending} depthWrite={false} />
          </lineSegments>
          <lineSegments ref={stoneRef} geometry={stoneGeom}>
            <lineBasicMaterial color={GOLD} transparent opacity={1} blending={THREE.AdditiveBlending} depthWrite={false} />
          </lineSegments>
        </group>

        {/* ── CEMENT BAG ── */}
        <group ref={bagGroupRef}>
          {/* Soft halo behind */}
          <lineSegments geometry={bagBodyGeom} scale={1.05}>
            <lineBasicMaterial color={GOLD} transparent opacity={0.18} blending={THREE.AdditiveBlending} depthWrite={false} />
          </lineSegments>
          {/* Body */}
          <lineSegments geometry={bagBodyGeom}>
            <lineBasicMaterial color={GOLD} transparent opacity={1} blending={THREE.AdditiveBlending} depthWrite={false} />
          </lineSegments>
          {/* Top seal — folded top of the bag */}
          <lineSegments geometry={bagTopSealGeom}>
            <lineBasicMaterial color={GOLD} transparent opacity={0.95} blending={THREE.AdditiveBlending} depthWrite={false} />
          </lineSegments>
          {/* Bottom band — brand stripe */}
          <lineSegments geometry={bagBottomBandGeom}>
            <lineBasicMaterial color={GOLD} transparent opacity={0.85} blending={THREE.AdditiveBlending} depthWrite={false} />
          </lineSegments>
          {/* Front label — outer */}
          <lineSegments geometry={bagLabelOuterGeom}>
            <lineBasicMaterial color={GOLD} transparent opacity={0.85} blending={THREE.AdditiveBlending} depthWrite={false} />
          </lineSegments>
          {/* Front label — inner (text area hint) */}
          <lineSegments geometry={bagLabelInnerGeom}>
            <lineBasicMaterial color={GOLD} transparent opacity={0.65} blending={THREE.AdditiveBlending} depthWrite={false} />
          </lineSegments>
        </group>

        {/* ── BUILDING ── */}
        <group ref={buildingGroupRef}>
          <lineSegments geometry={buildingShellGeom}>
            <lineBasicMaterial color={GOLD} transparent opacity={1} blending={THREE.AdditiveBlending} depthWrite={false} />
          </lineSegments>
          {buildingFloorGeoms.map((g, i) => (
            <lineSegments key={`f-${i}`} geometry={g}>
              <lineBasicMaterial color={GOLD} transparent opacity={0.7} blending={THREE.AdditiveBlending} depthWrite={false} />
            </lineSegments>
          ))}
          {buildingVerticalGeoms.map((g, i) => (
            <line key={`v-${i}`}>
              <primitive object={g} attach="geometry" />
              <lineBasicMaterial color={GOLD} transparent opacity={0.6} blending={THREE.AdditiveBlending} depthWrite={false} />
            </line>
          ))}
        </group>
      </group>

      {/* Atmospheric dust */}
      <points ref={dustRef} geometry={dustGeom}>
        <pointsMaterial
          color={GOLD}
          size={0.04}
          transparent
          opacity={0.5}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </>
  );
}

/**
 * Cosine window centered at `target` (phase ∈ [0,1]) with given half-width.
 * Returns 1 at the target, smoothly fades to 0 by ±width, with wrap-around.
 */
function windowAt(phase: number, target: number, width = 0.40) {
  let d = phase - target;
  d = d - Math.round(d); // wrap into [-0.5, 0.5]
  const x = Math.abs(d) / width;
  return x >= 1 ? 0 : Math.cos((x * Math.PI) / 2);
}

/**
 * Multiplies each child's base opacity (captured once into userData) by
 * the supplied phase factor so we can fade a whole group while preserving
 * relative opacity ratios between halos / details / primary lines.
 */
function applyPhaseOpacity(group: THREE.Group | null, phase: number) {
  if (!group) return;
  group.traverse((obj) => {
    const ls = obj as THREE.LineSegments;
    const isLineLike =
      (ls.isLineSegments as boolean | undefined) ?? (obj as THREE.Line).isLine;
    if (!isLineLike) return;
    const mat = (obj as THREE.LineSegments | THREE.Line)
      .material as THREE.LineBasicMaterial;
    if (mat.userData.baseOpacity === undefined) {
      mat.userData.baseOpacity = mat.opacity;
    }
    mat.opacity = (mat.userData.baseOpacity as number) * phase;
  });
}
