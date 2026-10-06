import { createElement, useEffect, useRef, useState } from "react";

const SCRIPT = "https://cdn.jsdelivr.net/npm/@google/model-viewer@3.5.0/dist/model-viewer.min.js";
const base = import.meta.env.BASE_URL;

// Edit the labels here to rename a model.
const MODELS = [
  { file: "sae-baja.glb", label: "SAE BAJA Vehicle", note: "Full vehicle assembly" },
  { file: "safl-quadruped.glb", label: "SAFL Quadruped", note: "Agricultural quadruped robot" },
  { file: "companion-robot.glb", label: "Companion Robot", note: "Autonomous companion platform" },
  { file: "final-design.glb", label: "Final Design Assembly", note: "Final design assembly" },
  { file: "assem1.glb", label: "Assembly 1", note: "Assembly model" },
];

export function CadViewer() {
  const [i, setI] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const ref = useRef<HTMLElement | null>(null);

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
    const el = ref.current;
    if (!el) return;
    const done = () => setLoaded(true);
    el.addEventListener("load", done);
    return () => el.removeEventListener("load", done);
  }, [i]);

  const m = MODELS[i];
  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {MODELS.map((x, k) => (
          <button key={x.file} onClick={() => setI(k)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${k === i ? "bg-primary text-primary-foreground" : "bg-card text-foreground hover:bg-card/70"}`}>
            {x.label}
          </button>
        ))}
      </div>
      <div className="relative mt-6 overflow-hidden rounded-3xl bg-card">
        {createElement("model-viewer", {
          key: m.file,
          ref,
          src: `${base}models/${m.file}`,
          alt: `3D model of ${m.label}`,
          "camera-controls": true,
          "auto-rotate": true,
          "shadow-intensity": "1",
          "touch-action": "pan-y",
          style: { width: "100%", height: "70vh", minHeight: "360px", background: "transparent" },
        })}
        {!loaded && (
          <div className="pointer-events-none absolute inset-0 grid place-items-center text-sm text-muted-foreground">
            Loading 3D model…
          </div>
        )}
      </div>
      <p className="mt-3 text-sm text-muted-foreground">
        {m.note}. Drag to rotate · scroll or pinch to zoom · right-click drag or two-finger drag to pan.
      </p>
    </div>
  );
}
