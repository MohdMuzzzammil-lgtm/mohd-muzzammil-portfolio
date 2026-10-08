import { createElement, useEffect, useRef, useState } from "react";
import { Minus, Plus, RotateCcw } from "lucide-react";

const SCRIPT = "https://cdn.jsdelivr.net/npm/@google/model-viewer@3.5.0/dist/model-viewer.min.js";
const base = import.meta.env.BASE_URL;

export type CadModel = { file: string; label: string; note?: string };

/**
 * Inline 3D viewer. The mouse wheel / page scroll is NEVER captured (disable-zoom);
 * zooming is done with the + / − buttons. Pass several models to get small tabs.
 */
export function CadViewer({ models }: { models: CadModel[] }) {
  const [i, setI] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const ref = useRef<any>(null);

  useEffect(() => {
    if (!document.querySelector(`script[src="${SCRIPT}"]`)) {
      const s = document.createElement("script");
      s.type = "module";
      s.src = SCRIPT;
      document.head.appendChild(s);
    }
  }, []);

  useEffect(() => {
    setLoaded(false);
    const el = ref.current as HTMLElement | null;
    if (!el) return;
    const done = () => setLoaded(true);
    el.addEventListener("load", done);
    return () => el.removeEventListener("load", done);
  }, [i]);

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
  const btn = "grid h-10 w-10 place-items-center rounded-full bg-background/80 text-foreground backdrop-blur transition hover:bg-primary hover:text-primary-foreground active:scale-90";
  return (
    <div>
      {models.length > 1 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {models.map((x, k) => (
            <button key={x.file} onClick={() => setI(k)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${k === i ? "bg-primary text-primary-foreground" : "bg-card text-foreground hover:bg-card/70"}`}>
              {x.label}
            </button>
          ))}
        </div>
      )}
      <div className="relative overflow-hidden rounded-3xl bg-card">
        {createElement("model-viewer", {
          key: m.file,
          ref,
          src: `${base}models/${m.file}`,
          alt: `3D model of ${m.label}`,
          "camera-controls": true,
          "disable-zoom": true,
          "auto-rotate": true,
          "shadow-intensity": "1",
          "touch-action": "pan-y",
          loading: "lazy",
          reveal: "auto",
          style: { width: "100%", height: "min(60vh, 560px)", minHeight: "300px", background: "transparent" },
        })}
        {!loaded && (
          <div className="pointer-events-none absolute inset-0 grid place-items-center text-sm text-muted-foreground">Loading 3D model…</div>
        )}
        <span className="pointer-events-none absolute left-4 top-4 rounded-full bg-background/70 px-3 py-1 text-xs font-semibold backdrop-blur">✦ 3D · {m.label}</span>
        <div className="absolute bottom-4 right-4 flex flex-col gap-2">
          <button type="button" className={btn} onClick={() => zoom(0.8)} aria-label="Zoom in"><Plus className="h-4 w-4" /></button>
          <button type="button" className={btn} onClick={() => zoom(1.25)} aria-label="Zoom out"><Minus className="h-4 w-4" /></button>
          <button type="button" className={btn} onClick={reset} aria-label="Reset view"><RotateCcw className="h-4 w-4" /></button>
        </div>
      </div>
      <p className="mt-3 text-sm text-muted-foreground">
        {m.note ? `${m.note}. ` : ""}Drag to rotate · use + / − to zoom · page scrolling stays normal.
      </p>
    </div>
  );
}
