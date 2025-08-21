"use client";

import { useEffect, useRef } from "react";
import "@/styles/tailwind.css"; // Ensure Tailwind CSS is imported

export function Background() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Create floating orbs using CSS animations instead of Three.js for simplicity
    const orbs = [
      { size: 128, color: "rgba(139, 92, 246, 0.2)", delay: 0 },
      { size: 192, color: "rgba(16, 185, 129, 0.2)", delay: -2 },
      { size: 96, color: "rgba(59, 130, 246, 0.2)", delay: -4 },
      { size: 144, color: "rgba(168, 85, 247, 0.15)", delay: -1 },
      { size: 80, color: "rgba(34, 197, 94, 0.15)", delay: -3 },
    ];

    orbs.forEach((orb, index) => {
      const orbElement = document.createElement("div");
      orbElement.className = "fixed rounded-full blur-xl animate-float pointer-events-none";
      orbElement.style.width = `${orb.size}px`;
      orbElement.style.height = `${orb.size}px`;
      orbElement.style.background = orb.color;
      orbElement.style.animationDelay = `${orb.delay}s`;
      orbElement.style.zIndex = "-1";

      // Random positioning
      orbElement.style.top = `${Math.random() * 100}%`;
      orbElement.style.left = `${Math.random() * 100}%`;

      mountRef.current?.appendChild(orbElement);
    });

    return () => {
      if (mountRef.current) {
        mountRef.current.innerHTML = "";
      }
    };
  }, []);

  return <div ref={mountRef} className="fixed inset-0 overflow-hidden -z-10" />;
}

export default Background;