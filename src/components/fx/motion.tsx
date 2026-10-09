import { useEffect, useRef, type CSSProperties, type ElementType, type ReactNode } from "react";
import { watchScroll, prefersReducedMotion } from "@/lib/scroll-engine";

type Variant = "up" | "left" | "right" | "scale" | "clip";
const vcls: Record<Variant, string> = { up: "rv", left: "rv rv-left", right: "rv rv-right", scale: "rv rv-scale", clip: "rv-clip" };

/** Slides/fades children in when they enter the viewport. `delay` (ms) staggers siblings. */
export function Reveal({ children, className = "", delay = 0, variant = "up", as: Tag = "div" }: {
  children: ReactNode; className?: string; delay?: number; variant?: Variant; as?: ElementType;
}) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") { el.classList.add("is-in"); return; }
    const io = new IntersectionObserver(([e]) => { if (e?.isIntersecting) { el.classList.add("is-in"); io.disconnect(); } }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  // "clip" variant: the observed wrapper is never clipped (a clipped element can't be seen by IntersectionObserver,
  // which left whole sections invisible on phones); the clip is applied to an inner element instead.
  if (variant === "clip") {
    return (
      <Tag ref={ref} className={className}>
        <div className="rv-clip" style={{ "--d": `${delay}ms` } as CSSProperties}>{children}</div>
      </Tag>
    );
  }
  return <Tag ref={ref} className={`${vcls[variant]} ${className}`} style={{ "--d": `${delay}ms` } as CSSProperties}>{children}</Tag>;
}

/** Image that drifts at a different speed than the page (parallax) inside an overflow-hidden frame. */
export function Parallax({ src, alt, className = "", imgClass = "", speed = 60, width, height }: {
  src: string; alt: string; className?: string; imgClass?: string; speed?: number; width?: number; height?: number;
}) {
  const box = useRef<HTMLDivElement>(null);
  const im = useRef<HTMLImageElement>(null);
  useEffect(() => {
    const b = box.current, i = im.current;
    if (!b || !i || prefersReducedMotion()) return;
    return watchScroll(b, (vh, r) => {
      const t = (r.top + r.height / 2 - vh / 2) / vh; // -1..1
      const k = window.innerWidth < 768 ? 0.5 : 1;
      i.style.transform = `translate3d(0, ${(-t * speed * k).toFixed(1)}px, 0) scale(1.15)`;
    });
  }, [speed]);
  return (
    <div ref={box} className={`overflow-hidden ${className}`}>
      <img ref={im} src={src} alt={alt} loading="lazy" width={width} height={height} className={`h-full w-full will-change-transform ${imgClass}`} />
    </div>
  );
}

/** 3D hover tilt with a moving glare. */
export function Tilt({ children, className = "", max = 7 }: { children: ReactNode; className?: string; max?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const fine = typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches;
  const move = (e: React.PointerEvent) => {
    const el = ref.current; if (!el || !fine) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    el.style.setProperty("--ry", `${((x - 0.5) * 2 * max).toFixed(2)}deg`);
    el.style.setProperty("--rx", `${((0.5 - y) * 2 * max).toFixed(2)}deg`);
    el.style.setProperty("--gx", `${x * 100}%`); el.style.setProperty("--gy", `${y * 100}%`);
  };
  const leave = () => { const el = ref.current; if (el) { el.style.setProperty("--rx", "0deg"); el.style.setProperty("--ry", "0deg"); } };
  return <div ref={ref} onPointerMove={move} onPointerLeave={leave} className={`tilt ${className}`}>{children}</div>;
}

/** Thin lime bar showing page scroll progress. */
export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let raf = 0;
    const on = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(() => {
      const h = document.documentElement; const m = h.scrollHeight - h.clientHeight;
      if (ref.current) ref.current.style.transform = `scaleX(${m > 0 ? h.scrollTop / m : 0})`;
    }); };
    window.addEventListener("scroll", on, { passive: true }); on();
    return () => { window.removeEventListener("scroll", on); cancelAnimationFrame(raf); };
  }, []);
  return <div ref={ref} className="scroll-bar" aria-hidden="true" />;
}

/** Infinite scrolling text strip. */
export function Marquee({ items, reverse = false, outline = false }: { items: string[]; reverse?: boolean; outline?: boolean }) {
  const row = (k: number) => (
    <div key={k} className="flex shrink-0 items-center" aria-hidden={k > 0}>
      {items.map((t) => (
        <span key={t} className="flex items-center">
          <span className={`px-5 font-display text-5xl leading-none md:px-8 md:text-8xl ${outline ? "mq-outline" : ""}`}>{t}</span>
          <span className="text-3xl text-primary md:text-5xl">✦</span>
        </span>
      ))}
    </div>
  );
  return <div className="overflow-hidden"><div className={`mq ${reverse ? "mq-rev" : ""}`}>{row(0)}{row(1)}</div></div>;
}

/** Polaroid wall: each card slides up and straightens as it scrolls into view (scroll-linked, reversible). */
export function MomentsWall({ items }: { items: { src: string; caption: string }[] }) {
  const refs = useRef<(HTMLElement | null)[]>([]);
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const offs = refs.current.map((el, i) => {
      if (!el) return () => {};
      const rot = (i % 2 ? 1 : -1) * (2 + ((i * 37) % 5));
      return watchScroll(el, (vh, r) => {
        const p = Math.min(1, Math.max(0, (vh * 1.0 - r.top) / (vh * 0.55)));
        const e = 1 - Math.pow(1 - p, 3);
        el.style.transform = `translate3d(0, ${((1 - e) * (140 + (i % 4) * 40)).toFixed(1)}px, 0) rotate(${(rot * (1.6 - 0.6 * e) * (1 - 0.0)).toFixed(2)}deg) scale(${(0.9 + 0.1 * e).toFixed(3)})`;
        el.style.opacity = String(Math.min(1, e * 1.6));
      });
    });
    return () => offs.forEach((o) => o());
  }, []);
  return (
    <div className="wall">
      {items.map((m, i) => (
        <figure key={m.src} ref={(el) => { refs.current[i] = el; }} className="wall-card">
          <img src={m.src} alt={m.caption} loading="lazy" decoding="async" />
          <figcaption>{m.caption}</figcaption>
        </figure>
      ))}
    </div>
  );
}

/** Wraps children so a CSS var --p (0..1) tracks how far the block has scrolled through the viewport. */
export function ScrollFill({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    return watchScroll(el, (vh, r) => {
      const p = Math.min(1, Math.max(0, (vh * 0.6 - r.top) / r.height));
      el.style.setProperty("--p", p.toFixed(3));
    });
  }, []);
  return <div ref={ref} className={className}>{children}</div>;
}
