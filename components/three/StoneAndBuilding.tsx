'use client';

import { useMemo, useRef, type RefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const GOLD = new THREE.Color('#D4AF37');

type Props = {
  scrollRef: RefObject<number>;
  mouseRef: RefObject<{ x: number; y: number }>;
};

/**
 * Hero centerpiece — a single floating gold stone (the brand metaphor:
 * raw material). Calm, contemplative motion: very slow rotation, subtle
 * mouse parallax, gentle gold pulse. No auto-morphing — the journey
 * through bag/building is reserved for a later scroll-driven section.
 */
export function StoneAndBuilding({ scrollRef, mouseRef }: Props) {
  const groupRef = useRef<THREE.Group>(null);
  const stoneRef = useRef<THREE.LineSegments>(null);
  const dustRef = useRef<THREE.Points>(null);
  const groundRef = useRef<THREE.Mesh>(null);

  // Stone — irregular icosahedron, vertex-displaced for organic facets
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

  // Atmospheric dust — sparser than before, just enough to suggest depth
  const dustGeom = useMemo(() => {
    const count = 140;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 5 + Math.random() * 16;
      const theta = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 9;
      arr[i * 3 + 0] = Math.cos(theta) * r;
      arr[i * 3 + 1] = y;
      arr[i * 3 + 2] = Math.sin(theta) * r;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(arr, 3));
    return g;
  }, []);

  useFrame(({ camera, clock, size }, delta) => {
    const t = clock.elapsedTime;
    const scroll = scrollRef.current ?? 0;
    const mouse = mouseRef.current ?? { x: 0, y: 0 };
    const ease = 1 - Math.pow(0.001, delta);

    // On a tall narrow canvas (portrait phone), shift the stone UP so it
    // sits above the hero text instead of overlapping it. Aspect < 1
    // means portrait; the further from 1, the higher we lift the stone.
    const aspect = size.width / Math.max(1, size.height);
    const targetGroupY = aspect < 0.9 ? THREE.MathUtils.lerp(0, 2.4, Math.min(1, (0.9 - aspect) / 0.4)) : 0;

    if (groupRef.current) {
      // Very slow Y rotation — one revolution every ~3 minutes. Subtle
      // enough that the stone reads as "alive" without ever feeling busy.
      groupRef.current.rotation.y += delta * 0.035;
      // Mouse parallax only — no time-based wobble
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        mouse.y * 0.10,
        ease,
      );
      groupRef.current.rotation.z = THREE.MathUtils.lerp(
        groupRef.current.rotation.z,
        mouse.x * 0.05,
        ease,
      );
      // Smoothly interpolate the stone's Y position toward its target
      groupRef.current.position.y = THREE.MathUtils.lerp(
        groupRef.current.position.y,
        targetGroupY,
        0.08,
      );
    }

    // Camera — slight dolly with scroll, soft mouse parallax. On portrait
    // viewports we also lift the camera so it stays aimed at the (lifted)
    // stone instead of empty space above it.
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, 9 + scroll * 3, 0.04);
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, mouse.x * 0.4, 0.04);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetGroupY + mouse.y * 0.2, 0.04);
    camera.lookAt(0, targetGroupY, 0);

    // Gentle gold pulse — very slow, very subtle
    if (stoneRef.current) {
      const pulse = 0.94 + Math.sin(t * 0.4) * 0.06;
      const mat = stoneRef.current.material as THREE.LineBasicMaterial;
      mat.color.setRGB(0.831 * pulse, 0.686 * pulse, 0.216 * pulse);
    }

    // Ground glow breathes lightly
    if (groundRef.current) {
      const mat = groundRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.05 + Math.sin(t * 0.3) * 0.015;
    }

    // Dust drifts very slowly
    if (dustRef.current) {
      dustRef.current.rotation.y += delta * 0.015;
    }
  });

  return (
    <>
      {/* Ground glow ring — soft gold pool below the stone */}
      <mesh ref={groundRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -3.8, 0]}>
        <ringGeometry args={[1.5, 6, 96]} />
        <meshBasicMaterial
          color={GOLD}
          transparent
          opacity={0.05}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      <group ref={groupRef}>
        {/* Outer halo */}
        <lineSegments geometry={stoneGeom} scale={1.14}>
          <lineBasicMaterial
            color={GOLD}
            transparent
            opacity={0.10}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </lineSegments>
        {/* Mid halo */}
        <lineSegments geometry={stoneGeom} scale={1.06}>
          <lineBasicMaterial
            color={GOLD}
            transparent
            opacity={0.22}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </lineSegments>
        {/* Primary edges */}
        <lineSegments ref={stoneRef} geometry={stoneGeom}>
          <lineBasicMaterial
            color={GOLD}
            transparent
            opacity={0.95}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </lineSegments>
      </group>

      {/* Sparse atmospheric dust */}
      <points ref={dustRef} geometry={dustGeom}>
        <pointsMaterial
          color={GOLD}
          size={0.035}
          transparent
          opacity={0.35}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </>
  );
}
