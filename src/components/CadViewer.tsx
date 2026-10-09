import { createElement, useCallback, useEffect, useId, useRef, useState } from "react";
import { Box, Minus, Plus, RotateCcw } from "lucide-react";

const base = import.meta.env.BASE_URL;
export type CadModel = { file: string; label: string; note?: string };

let mvPromise: Promise<unknown> | null = null;
/** model-viewer is bundled with the site (no CDN), and only downloaded the first time a model is opened. */
const loadViewer = () =>
  (mvPromise ??= import("@google/model-viewer").then(({ ModelViewerElement }) => {
    // meshopt decoder is self-hosted too (the models are meshopt-compressed to ~1 MB each)
    (ModelViewerElement as any).meshoptDecoderLocation = new URL(`${base}vendor/meshopt_decoder.mjs`, window.location.href).href;
  }));

/**
 * Inline 3D viewer.
 * - Wheel / page scroll is never captured (disable-zoom); use the + / − buttons.
 * - Desktop: loads automatically when scrolled near.
 * - Phones: tap to load, and only one model is kept alive at a time (saves GPU memory, so nothing goes blank).
 */
export function CadViewer({ models }: { models: CadModel[] }) {
  const id = useId();
  const [i, setI] = useState(0);
  const [mobile, setMobile] = useState(false);
  const [on, setOn] = useState(false);
  const [ready, setReady] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const box = useRef<HTMLDivElement>(null);
  const ref = useRef<any>(null);

  useEffect(() => {
    setMobile(window.matchMedia("(max-width: 767px), (pointer: coarse)").matches);
  }, []);

  // desktop: auto-load when near the viewport
  useEffect(() => {
    if (mobile || on || !box.current) return;
    const io = new IntersectionObserver(([e]) => { if (e?.isIntersecting) { setOn(true); io.disconnect(); } }, { rootMargin: "300px" });
    io.observe(box.current);
    return () => io.disconnect();
  }, [mobile, on]);

  // phones: only one viewer alive at a time
  useEffect(() => {
    const h = (e: Event) => { if ((e as CustomEvent).detail !== id) { setOn(false); setLoaded(false); } };
    window.addEventListener("cad:active", h);
    return () => window.removeEventListener("cad:active", h);
  }, [id]);

  useEffect(() => {
    if (!on) return;
    let alive = true;
    setFailed(false);
    loadViewer().then(() => customElements.whenDefined("model-viewer")).then(() => alive && setReady(true)).catch(() => alive && setFailed(true));
    return () => { alive = false; };
  }, [on, attempt]);

  useEffect(() => {
    setLoaded(false);
    setFailed(false);
    const el = ref.current as HTMLElement | null;
    if (!el) return;
    const ok = () => setLoaded(true);
    const bad = () => setFailed(true);
    el.addEventListener("load", ok);
    el.addEventListener("error", bad);
    return () => { el.removeEventListener("load", ok); el.removeEventListener("error", bad); };
  }, [i, on, ready, attempt]);

  const start = useCallback(() => {
    window.dispatchEvent(new CustomEvent("cad:active", { detail: id }));
    setAttempt((a) => a + 1);
    setOn(true);
  }, [id]);

  const zoom = (factor: number) => {
    const el = ref.current;
    if (!el?.getCameraOrbit) return;
    const o = el.getCameraOrbit();
    el.cameraOrbit = `${o.theta}rad ${o.phi}rad ${o.radius * factor}m`;
  };
  const reset = () => {
    const el = ref.current;
    if (!el) return;
    el.cameraOrbit = "auto auto auto";
    el.jumpCameraToGoal?.();
  };

  const m = models[i] ?? models[0]!;
  const btn = "grid h-11 w-11 place-items-center rounded-full bg-background/80 text-foreground backdrop-blur transition hover:bg-primary hover:text-primary-foreground active:scale-90";
  const frame = { height: "min(60vh, 560px)", minHeight: "300px" } as const;

  return (
    <div ref={box}>
      {models.length > 1 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {models.map((x, k) => (
            <button key={x.file} onClick={() => { setI(k); if (mobile && !on) start(); }}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${k === i ? "bg-primary text-primary-foreground" : "bg-card text-foreground hover:bg-card/70"}`}>
              {x.label}
            </button>
          ))}
        </div>
      )}
      <div className="relative overflow-hidden rounded-3xl bg-card" style={frame}>
        {on && ready && !failed &&
          createElement("model-viewer", {
            key: `${m.file}-${attempt}`,
            ref,
            src: `${base}models/${m.file}`,
            alt: `3D model of ${m.label}`,
            "camera-controls": true,
            "disable-zoom": true,
            "auto-rotate": true,
            "interaction-prompt": "none",
            "shadow-intensity": "1",
            style: { width: "100%", height: "100%", background: "transparent", touchAction: "pan-y" },
          })}

        {!on && (
          <button type="button" onClick={start} className="absolute inset-0 grid place-items-center text-center">
            <span className="flex flex-col items-center gap-3 px-6">
              <span className="grid h-16 w-16 place-items-center rounded-full bg-primary text-primary-foreground"><Box className="h-7 w-7" /></span>
              <span className="font-display text-3xl leading-none">{mobile ? "Tap to load 3D model" : "Load 3D model"}</span>
              <span className="text-xs text-muted-foreground">{m.label} · light-weight, loads in a moment</span>
            </span>
          </button>
        )}
        {on && !loaded && !failed && (
          <div className="pointer-events-none absolute inset-0 grid place-items-center text-sm text-muted-foreground">Loading 3D model…</div>
        )}
        {failed && (
          <div className="absolute inset-0 grid place-items-center p-6 text-center">
            <div>
              <p className="text-sm text-muted-foreground">Couldn't load the 3D model.</p>
              <button type="button" onClick={start} className="mt-3 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground">Try again</button>
            </div>
          </div>
        )}

        <span className="pointer-events-none absolute left-4 top-4 rounded-full bg-background/70 px-3 py-1 text-xs font-semibold backdrop-blur">✦ 3D · {m.label}</span>
        {on && loaded && (
          <div className="absolute bottom-4 right-4 flex flex-col gap-2">
            <button type="button" className={btn} onClick={() => zoom(0.8)} aria-label="Zoom in"><Plus className="h-4 w-4" /></button>
            <button type="button" className={btn} onClick={() => zoom(1.25)} aria-label="Zoom out"><Minus className="h-4 w-4" /></button>
            <button type="button" className={btn} onClick={reset} aria-label="Reset view"><RotateCcw className="h-4 w-4" /></button>
          </div>
        )}
      </div>
      <p className="mt-3 text-sm text-muted-foreground">
        {m.note ? `${m.note}. ` : ""}Drag to rotate · use + / − to zoom · page scrolling stays normal.
      </p>
    </div>
  );
}
