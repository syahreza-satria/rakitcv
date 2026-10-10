"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { MathUtils } from "three";

// Posisi dalam fraksi lebar/tinggi viewport (-1..1) agar bentuk tetap di tepi hero.
const SHAPES = [
  { kind: "octa", x: -0.88, y: 0.62, size: 0.42, color: "#2563eb", speed: 0.7, depth: 1 },
  { kind: "torus", x: -0.7, y: -0.72, size: 0.36, color: "#60a5fa", speed: 0.9, depth: 0.6 },
  { kind: "ico", x: 0.9, y: 0.7, size: 0.34, color: "#1d4ed8", speed: 0.6, depth: 0.8 },
  { kind: "sphere", x: 0.62, y: -0.8, size: 0.26, color: "#93c5fd", speed: 0.8, depth: 1.2 },
  { kind: "torus", x: 0.05, y: 0.86, size: 0.24, color: "#bfdbfe", speed: 0.5, depth: 0.4 },
  { kind: "octa", x: -0.95, y: -0.1, size: 0.22, color: "#93c5fd", speed: 1, depth: 0.5 },
];

function Shape({ kind, x, y, size, color, speed, depth, reduceMotion }) {
  const ref = useRef(null);
  const { viewport } = useThree();
  const bx = (x * viewport.width) / 2;
  const by = (y * viewport.height) / 2;

  useFrame((state, delta) => {
    const m = ref.current;
    if (!m || reduceMotion) return;
    const t = state.clock.elapsedTime * speed;
    m.rotation.x += delta * 0.5 * speed;
    m.rotation.y += delta * 0.7 * speed;
    m.position.y = by + Math.sin(t) * 0.15;
    m.position.x = MathUtils.damp(m.position.x, bx + state.pointer.x * 0.35 * depth, 3, delta);
  });

  return (
    <mesh ref={ref} position={[bx, by, 0]}>
      {kind === "octa" && <octahedronGeometry args={[size]} />}
      {kind === "torus" && <torusGeometry args={[size, size * 0.33, 20, 44]} />}
      {kind === "ico" && <icosahedronGeometry args={[size]} />}
      {kind === "sphere" && <sphereGeometry args={[size, 28, 28]} />}
      <meshStandardMaterial color={color} roughness={0.3} metalness={0.15} flatShading={kind === "ico"} />
    </mesh>
  );
}

export default function BackdropScene() {
  const reduceMotion = useMemo(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    [],
  );

  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 40 }}
      dpr={[1, 2]}
      eventSource={document.body}
      eventPrefix="client"
      gl={{ alpha: true }}
    >
      <ambientLight intensity={1.2} />
      <directionalLight position={[3, 4, 5]} intensity={2.2} />
      {SHAPES.map((s, i) => (
        <Shape key={i} {...s} reduceMotion={reduceMotion} />
      ))}
    </Canvas>
  );
}
