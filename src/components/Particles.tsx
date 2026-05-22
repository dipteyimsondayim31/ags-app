"use client";

import { useEffect, useRef, useImperativeHandle, forwardRef } from "react";

export interface ParticlesRef {
  triggerBurst: (x: number, y: number) => void;
  triggerConfetti: () => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  decay: number;
  rotation?: number;
  rotationSpeed?: number;
  shape?: "circle" | "square";
}

export const Particles = forwardRef<ParticlesRef>((_, ref) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);

  useImperativeHandle(ref, () => ({
    triggerBurst(x, y) {
      const colors = ["#a78bfa", "#c084fc", "#34d399", "#10b981"]; // Lavender, Violet, Emerald, Mint
      const count = 35;
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 6;
        particlesRef.current.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1, // slight upward bias
          size: 3 + Math.random() * 5,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: 1,
          decay: 0.015 + Math.random() * 0.02,
          shape: "circle",
        });
      }
    },
    triggerConfetti() {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const colors = ["#a78bfa", "#34d399", "#38bdf8", "#fbbf24", "#f472b6"]; // Lavender, Emerald, Sky, Amber, Rose
      const count = 120;
      for (let i = 0; i < count; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: -20, // Start just above screen
          vx: -2 + Math.random() * 4,
          vy: 2 + Math.random() * 5,
          size: 5 + Math.random() * 8,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: 1,
          decay: 0.003 + Math.random() * 0.005,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: -0.1 + Math.random() * 0.2,
          shape: Math.random() > 0.4 ? "square" : "circle",
        });
      }
    },
  }));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Resize handler
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    let animationId: number;

    const update = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const particles = particlesRef.current;

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;

        // Apply gravity to confetti / particles
        p.vy += 0.08; 

        if (p.rotation !== undefined && p.rotationSpeed !== undefined) {
          p.rotation += p.rotationSpeed;
        }

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;

        if (p.shape === "square" && p.rotation !== undefined) {
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      animationId = requestAnimationFrame(update);
    };

    update();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50 w-full h-full"
      style={{ mixBlendMode: "screen" }}
    />
  );
});

Particles.displayName = "Particles";
