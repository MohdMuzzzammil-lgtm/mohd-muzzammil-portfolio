import { useEffect, useRef, useState } from "react";
import { FX } from "@/lib/fx-config";
import { prefersReducedMotion } from "@/lib/scroll-engine";

const INTERACTIVE = "a,button,[role=button],summary,select,model-viewer,[data-cursor]";

export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const pos = useRef<HTMLDivElement | null>(null);
  const dot = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!FX.cursor.enabled || !fine) return;
    setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const root = document.documentElement;
    const follow = prefersReducedMotion() ? 1 : FX.cursor.follow;
    let tx = -100,
      ty = -100,
      x = -100,
      y = -100,
      raf = 0,
      seen = false;
    if (FX.cursor.hideNative) root.classList.add("fx-cursor-on");

    const frame = () => {
      x += (tx - x) * follow;
      y += (ty - y) * follow;
      if (pos.current) pos.current.style.transform = `translate3d(${x}px,${y}px,0)`;
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.1 ? requestAnimationFrame(frame) : 0;
    };
    const move = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      if (!seen) {
        seen = true;
        x = tx;
        y = ty;
        dot.current?.classList.add("is-visible");
      }
      if (!raf) raf = requestAnimationFrame(frame);
    };
    const over = (e: PointerEvent) => {
      const hit = (e.target as Element | null)?.closest?.(INTERACTIVE);
      dot.current?.classList.toggle("is-hover", !!hit);
    };
    const down = () => dot.current?.classList.add("is-down");
    const up = () => dot.current?.classList.remove("is-down");
    const leave = () => dot.current?.classList.remove("is-visible");
    const enter = () => seen && dot.current?.classList.add("is-visible");

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    document.documentElement.addEventListener("mouseleave", leave);
    document.documentElement.addEventListener("mouseenter", enter);
    return () => {
      root.classList.remove("fx-cursor-on");
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      document.documentElement.removeEventListener("mouseleave", leave);
      document.documentElement.removeEventListener("mouseenter", enter);
    };
  }, [enabled]);

  if (!enabled) return null;
  const s = FX.cursor.sizePx;
  return (
    <div
      ref={pos}
      aria-hidden="true"
      className="fx-cursor"
      style={{ mixBlendMode: FX.cursor.blend ? "difference" : "normal" }}
    >
      <div
        ref={dot}
        className="fx-cursor__dot"
        style={{
          width: s,
          height: s,
          margin: -s / 2,
          ["--hover-scale" as string]: FX.cursor.hoverScale,
        }}
      />
    </div>
  );
}
