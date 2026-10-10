"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Animasi landing page: elemen ditandai lewat atribut data-* di page.js.
export default function LandingAnimations() {
  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const hero = gsap.timeline({ defaults: { ease: "power3.out" } });
      hero
        .from("[data-hero-stagger] > *", { y: 28, opacity: 0, duration: 0.7, stagger: 0.1 })
        .from("[data-hero-visual]", { y: 40, opacity: 0, rotate: 2, duration: 0.9 }, 0.2);

      gsap.to("[data-hero-visual]", {
        y: -24,
        ease: "none",
        scrollTrigger: { trigger: "[data-hero-visual]", start: "top 60%", end: "bottom top", scrub: true },
      });

      gsap.utils.toArray("[data-reveal]").forEach((el) => {
        const dir = el.dataset.reveal;
        gsap.from(el, {
          opacity: 0,
          y: dir === "left" || dir === "right" ? 0 : 32,
          x: dir === "left" ? -48 : dir === "right" ? 48 : 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        });
      });

      gsap.utils.toArray("[data-stagger]").forEach((el) => {
        gsap.from(el.children, {
          opacity: 0,
          y: 36,
          duration: 0.7,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        });
      });
    });

    return () => mm.revert();
  }, []);

  return null;
}
