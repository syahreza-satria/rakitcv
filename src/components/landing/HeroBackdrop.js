"use client";

import dynamic from "next/dynamic";

// Lapisan 3D dekoratif di belakang hero; hanya dimuat di browser.
const BackdropScene = dynamic(() => import("./BackdropScene"), { ssr: false });

export default function HeroBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden sm:block">
      <BackdropScene />
    </div>
  );
}
