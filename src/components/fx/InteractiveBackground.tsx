"use client";

import { useEffect, useRef } from "react";

interface PlusPoint {
  restX: number;
  restY: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  /** Steady per-point accent tint for color variety. */
  tinted: boolean;
}

/** Match the reference density: 52 columns across the viewport. */
const COLUMNS = 52;
const MIN_SPACING = 24;
const REPEL_RADIUS = 180;
const REPEL_FORCE = 22;
const SPRING = 0.06;
const DAMPING = 0.88;
/** Pointer speed (px/event) at which the repel reaches full strength. */
const FULL_SPEED = 30;
/** Share of pluses drawn in the accent color for variety. */
const TINT_RATIO = 0.16;

/**
 * Full-page fixed canvas drawing the "+" field behind every section.
 * Most pluses use the neutral grid color; a steady subset is tinted
 * with the CURRENT accent, so the field visibly recolors when the
 * accent commits on menu close. Disturbance is velocity-driven and
 * heavily damped for a smooth, watery response; an idle cursor leaves
 * the field perfectly still. Touch/reduced-motion get a static grid.
 */
export default function InteractiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const fine = window.matchMedia("(pointer: fine)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const interactive = fine && !reducedMotion;

    let points: PlusPoint[] = [];
    let width = 0;
    let height = 0;
    let dpr = 1;
    let spacing = 36;
    let plusArm = 5;
    let baseColor = "";
    let accentColor = "";
    let raf = 0;
    let running = false;
    const pointer = { x: -9999, y: -9999, speed: 0, smoothSpeed: 0 };

    /* Resolve color-mix() values through a probe element */
    const probe = document.createElement("span");
    probe.style.display = "none";
    document.body.appendChild(probe);
    const resolveColor = (variable: string): string => {
      probe.style.color = `var(${variable})`;
      return getComputedStyle(probe).color;
    };

    const readColors = () => {
      baseColor = resolveColor("--grid-dot") || "rgba(0,0,0,0.1)";
      accentColor = resolveColor("--grid-dot-accent") || baseColor;
    };

    const buildGrid = () => {
      points = [];
      for (let y = spacing / 2; y < height + spacing; y += spacing) {
        for (let x = spacing / 2; x < width + spacing; x += spacing) {
          points.push({
            restX: x,
            restY: y,
            x,
            y,
            vx: 0,
            vy: 0,
            tinted: Math.random() < TINT_RATIO,
          });
        }
      }
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      spacing = Math.max(MIN_SPACING, width / COLUMNS);
      plusArm = Math.max(3.5, spacing * 0.13);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildGrid();
      if (!running) drawStatic();
    };

    const drawPlus = (x: number, y: number) => {
      ctx.moveTo(x - plusArm, y);
      ctx.lineTo(x + plusArm, y);
      ctx.moveTo(x, y - plusArm);
      ctx.lineTo(x, y + plusArm);
    };

    const strokeBatch = (batch: PlusPoint[], color: string, alpha: number) => {
      if (batch.length === 0) return;
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = color;
      ctx.beginPath();
      for (const p of batch) drawPlus(p.x, p.y);
      ctx.stroke();
      ctx.globalAlpha = 1;
    };

    const drawStatic = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.lineWidth = 1.5;
      strokeBatch(points.filter((p) => !p.tinted), baseColor, 1);
      strokeBatch(points.filter((p) => p.tinted), accentColor, 0.6);
    };

    const base: PlusPoint[] = [];
    const tintedBatch: PlusPoint[] = [];
    const excited: PlusPoint[] = [];

    const step = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.lineWidth = 1.5;

      /* Smooth the velocity signal for a softer, watery response */
      pointer.smoothSpeed += (pointer.speed - pointer.smoothSpeed) * 0.18;
      pointer.speed *= 0.9;
      const strength = Math.min(pointer.smoothSpeed / FULL_SPEED, 1);

      base.length = 0;
      tintedBatch.length = 0;
      excited.length = 0;

      for (const p of points) {
        if (strength > 0.02) {
          const dx = p.x - pointer.x;
          const dy = p.y - pointer.y;
          const dist = Math.hypot(dx, dy);
          if (dist < REPEL_RADIUS && dist > 0.001) {
            const falloff = 1 - dist / REPEL_RADIUS;
            const push = falloff * falloff * REPEL_FORCE * strength;
            p.vx += (dx / dist) * push * 0.24;
            p.vy += (dy / dist) * push * 0.24;
          }
        }

        p.vx += (p.restX - p.x) * SPRING;
        p.vy += (p.restY - p.y) * SPRING;
        p.vx *= DAMPING;
        p.vy *= DAMPING;
        p.x += p.vx;
        p.y += p.vy;

        const offset = Math.hypot(p.x - p.restX, p.y - p.restY);
        if (offset > 1.2) {
          excited.push(p);
        } else {
          /* Settled points snap exactly home so the idle field is still */
          p.x = p.restX;
          p.y = p.restY;
          if (p.tinted) tintedBatch.push(p);
          else base.push(p);
        }
      }

      strokeBatch(base, baseColor, 1);
      strokeBatch(tintedBatch, accentColor, 0.6);
      strokeBatch(excited, accentColor, 1);

      raf = requestAnimationFrame(step);
    };

    const onPointerMove = (event: PointerEvent) => {
      const speed = Math.hypot(event.clientX - pointer.x, event.clientY - pointer.y);
      pointer.speed = pointer.x < -999 ? 0 : Math.min(speed, 90);
      pointer.x = event.clientX;
      pointer.y = event.clientY;
    };

    const onPointerLeave = () => {
      pointer.x = -9999;
      pointer.y = -9999;
      pointer.speed = 0;
      pointer.smoothSpeed = 0;
    };

    readColors();
    resize();

    /* Recolor when the theme flips or the accent commits */
    const observer = new MutationObserver(() => {
      readColors();
      if (!running) drawStatic();
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme", "style"],
    });

    window.addEventListener("resize", resize);

    if (interactive) {
      running = true;
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      document.documentElement.addEventListener("pointerleave", onPointerLeave);
      raf = requestAnimationFrame(step);
    } else {
      drawStatic();
    }

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      probe.remove();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener("pointerleave", onPointerLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -1,
        pointerEvents: "none",
      }}
    />
  );
}
