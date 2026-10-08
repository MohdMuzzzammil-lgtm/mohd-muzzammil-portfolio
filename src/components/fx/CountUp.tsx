import { useEffect, useRef } from "react";
import { FX } from "@/lib/fx-config";
import { prefersReducedMotion } from "@/lib/scroll-engine";

type Props = {
  to: number;
  suffix?: string;
  prefix?: string;
  durationMs?: number;
  delayMs?: number;
  className?: string;
};

export function CountUp({
  to,
  suffix = "",
  prefix = "",
  durationMs = FX.countUp.durationMs,
  delayMs = 0,
  className = "",
}: Props) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const fmt = (n: number) => `${prefix}${Math.round(n).toLocaleString("en-IN")}${suffix}`;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      el.textContent = fmt(to);
      return;
    }
    let raf = 0;
    let timer = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        io.disconnect();
        timer = window.setTimeout(() => {
          const t0 = performance.now();
          const tick = (now: number) => {
            const t = Math.min(1, (now - t0) / durationMs);
            el.textContent = fmt(to * FX.countUp.ease(t));
            if (t < 1) raf = requestAnimationFrame(tick);
          };
          raf = requestAnimationFrame(tick);
        }, delayMs);
      },
      { threshold: FX.countUp.threshold },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [to, suffix, prefix, durationMs, delayMs]);

  return (
    <span className={`tabular-nums ${className}`} aria-label={fmt(to)}>
      <span ref={ref} aria-hidden="true">
        {fmt(0)}
      </span>
    </span>
  );
}
