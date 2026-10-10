"use client";

import { useRef } from "react";
import gsap from "gsap";

export default function FaqItem({ q, a }) {
  const detailsRef = useRef(null);
  const bodyRef = useRef(null);
  const iconRef = useRef(null);

  function toggle(e) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    e.preventDefault();

    const details = detailsRef.current;
    const body = bodyRef.current;
    gsap.killTweensOf([body, iconRef.current]);

    if (details.open) {
      gsap.to(iconRef.current, { rotate: 0, duration: 0.3, ease: "power2.out" });
      gsap.to(body, {
        height: 0,
        opacity: 0,
        duration: 0.3,
        ease: "power2.inOut",
        onComplete: () => {
          details.open = false;
        },
      });
    } else {
      details.open = true;
      gsap.to(iconRef.current, { rotate: 45, duration: 0.3, ease: "power2.out" });
      gsap.fromTo(
        body,
        { height: 0, opacity: 0 },
        { height: "auto", opacity: 1, duration: 0.4, ease: "power2.out" },
      );
    }
  }

  return (
    <details ref={detailsRef} className="group rounded-xl border border-zinc-200 bg-white p-5">
      <summary
        onClick={toggle}
        className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-bold"
      >
        {q}
        <span ref={iconRef} className="text-lg font-normal text-zinc-400">
          +
        </span>
      </summary>
      <div ref={bodyRef} className="overflow-hidden">
        <p className="pt-3 text-sm leading-relaxed text-zinc-600">{a}</p>
      </div>
    </details>
  );
}
