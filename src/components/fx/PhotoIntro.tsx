import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { FX } from "@/lib/fx-config";
import { prefersReducedMotion } from "@/lib/scroll-engine";
import { flick, unlockSound } from "@/lib/intro-sound";

const SESSION_KEY = "fx-intro-seen";
const imgUrl = (f: string) => `${import.meta.env.BASE_URL}img/${f}`;

type Phase = "idle" | "dropping" | "title" | "exit" | "done";
type Drop = { src: string; caption: string; left: number; top: number; rot: number; w: number; pos: string };

const rand = (a: number, b: number) => a + Math.random() * (b - a);
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = a[i] as T;
    a[i] = a[j] as T;
    a[j] = tmp;
  }
  return a;
}

/**
 * Builds a dense wall of polaroids in LAUNCH order:
 *   card 0 = alone in the centre, the rest fill the screen from the top row downwards (like the reference site).
 */
function makeDrops(): Drop[] {
  const { photos, gridDesktop, gridPhone, phoneMaxWidth, maxTiltDeg } = FX.intro;
  const W = window.innerWidth;
  const H = window.innerHeight;
  const [cols, rows] = W <= phoneMaxWidth ? gridPhone : gridDesktop;
  const cellW = W / cols;
  const cellH = H / rows;
  const w = Math.min(Math.max(cellW * 1.3, (cellH / 1.2) * 1.3), 280);

  const cells: { cx: number; cy: number }[] = [];
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++) cells.push({ cx: (c + 0.5) / cols, cy: (r + 0.5) / rows });

  // first card: the cell closest to the centre; the rest: top → bottom with a little shuffle
  let ci = 0, best = 9;
  cells.forEach((c, i) => { const d = Math.hypot(c.cx - 0.5, c.cy - 0.5); if (d < best) { best = d; ci = i; } });
  const centre = cells.splice(ci, 1)[0]!;
  const rest = cells
    .map((c) => ({ c, k: c.cy + rand(-0.09, 0.09) + c.cx * 0.02 }))
    .sort((a, b) => a.k - b.k)
    .map((x) => x.c);
  const ordered = [centre, ...rest];

  // photo sequence: reshuffle each cycle so neighbours rarely repeat
  const seq: typeof photos = [];
  while (seq.length < ordered.length) seq.push(...shuffle(photos));

  return ordered.map((cell, i) => ({
    src: imgUrl(seq[i]!.file),
    caption: seq[i]!.caption,
    left: i === 0 ? 50 : (cell.cx + rand(-0.3, 0.3) / cols) * 100,
    top: i === 0 ? 50 : (cell.cy + rand(-0.3, 0.3) / rows) * 100,
    rot: (Math.random() < 0.5 ? -1 : 1) * rand(2, maxTiltDeg),
    w,
    pos: `50% ${Math.round(rand(15, 35))}%`,
  }));
}

/** A card "pops" onto the wall exactly where it will stay (quick scale + settle), like the reference. */
function popIn(el: HTMLElement, d: Drop, first: boolean) {
  const base = "translate(-50%, -50%)";
  const dur = first ? FX.intro.dropDurationMs * 1.8 : FX.intro.dropDurationMs;
  el.animate(
    [
      { opacity: 0, transform: `${base} rotate(${d.rot - 14}deg) scale(0.45)`, offset: 0 },
      { opacity: 1, transform: `${base} rotate(${d.rot + 2}deg) scale(1.08)`, offset: 0.62 },
      { opacity: 1, transform: `${base} rotate(${d.rot}deg) scale(1)`, offset: 1 },
    ],
    { duration: dur, easing: "cubic-bezier(0.22, 1, 0.36, 1)", fill: "forwards" },
  );
}

export function PhotoIntro() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [drops, setDrops] = useState<Drop[]>([]);
  const timers = useRef<number[]>([]);
  const els = useRef<(HTMLElement | null)[]>([]);
  const after = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  };

  const finish = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      /* private mode */
    }
    setPhase("exit");
    window.setTimeout(() => document.documentElement.classList.add("fx-ready"), FX.intro.exitDurationMs * 0.45);
    timers.current.push(
      window.setTimeout(() => {
        document.documentElement.style.overflow = "";
        document.documentElement.classList.add("fx-ready");
        setPhase("done");
      }, FX.intro.exitDurationMs),
    );
  }, []);

  useEffect(() => {
    const I = FX.intro;
    let seen = false;
    try {
      seen = I.oncePerSession && !!sessionStorage.getItem(SESSION_KEY);
    } catch {
      /* ignore */
    }
    if (!I.enabled || seen || prefersReducedMotion()) {
      document.documentElement.classList.add("fx-ready");
      setPhase("done");
      return;
    }

    // Sound is automatic: start the audio engine now. Browsers keep it silent until the visitor's first
    // tap / click / key press — so also unlock on the very first gesture of any kind (no button needed).
    unlockSound();
    const unlock = () => unlockSound();
    const evs = ["pointerdown", "pointerup", "touchstart", "touchend", "click", "keydown", "mousemove"] as const;
    evs.forEach((e) => window.addEventListener(e, unlock, { passive: true }));

    let cancelled = false;
    const list = makeDrops();
    setDrops(list);
    document.documentElement.style.overflow = "hidden";

    // preload, but never wait longer than preloadTimeoutMs
    const loads = Array.from(new Set(list.map((d) => d.src))).map(
      (src) =>
        new Promise<void>((res) => {
          const im = new Image();
          im.onload = im.onerror = () => res();
          im.src = src;
        }),
    );
    Promise.race([Promise.all(loads), new Promise((r) => setTimeout(r, I.preloadTimeoutMs))]).then(() => {
      if (cancelled) return;
      setPhase("dropping");
      const n = list.length;
      // 1) one card alone in the centre, held for a beat
      after(() => {
        const el = els.current[0];
        if (el) popIn(el, list[0]!, true);
        flick(1.25);
      }, 250);
      // 2) then the wall fills in very quickly, top row first
      let t = 250 + I.deckHoldMs;
      for (let j = 1; j < n; j++) {
        const at = t;
        after(() => {
          const el = els.current[j];
          if (el) popIn(el, list[j]!, false);
          flick(0.5 + Math.random() * 0.35);
        }, at);
        t += I.dropEveryMs * (1.25 - 0.55 * (j / n)) + rand(-6, 6);
      }
      const allLanded = t + I.dropDurationMs + I.beforeTitleMs;
      after(() => setPhase("title"), allLanded);
      const titleChars = I.title.join("").length;
      after(finish, allLanded + titleChars * I.titleLetterStaggerMs + I.titleHoldMs);
    });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") finish();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      cancelled = true;
      timers.current.forEach(clearTimeout);
      timers.current = [];
      window.removeEventListener("keydown", onKey);
      evs.forEach((e) => window.removeEventListener(e, unlock));
      document.documentElement.style.overflow = "";
    };
  }, [finish]);

  if (phase === "done") return null;

  const I = FX.intro;
  const vars = {
    ["--drop-dur" as string]: `${I.dropDurationMs}ms`,
    ["--exit-dur" as string]: `${I.exitDurationMs}ms`,
    [("--exit-ease") as string]: I.exitEase,
  } as CSSProperties;

  let n = 0;
  return (
    <div className={`fx-intro fx-intro--${phase}`} style={vars} role="dialog" aria-label="Intro animation" onClick={finish}>
      {drops.map((d, i) => (
        <figure
          key={i}
          ref={(el) => { els.current[i] = el; }}
          className="fx-polaroid"
          style={
            {
              left: `${d.left}%`,
              top: `${d.top}%`,
              width: d.w,
              ["--w" as string]: `${d.w}px`,
              opacity: 0, // revealed by popIn()
              zIndex: i + 1, // later cards land on top of earlier ones
              transform: `translate(-50%, -50%) rotate(${d.rot}deg)`,
            } as CSSProperties
          }
        >
          <img src={d.src} alt="" decoding="async" draggable={false} style={{ objectPosition: d.pos }} />
          <figcaption>{d.caption}</figcaption>
        </figure>
      ))}
      <div className="fx-intro__shade" />
      {(phase === "title" || phase === "exit") && (
        <p className="fx-intro__title" aria-label={I.title.join(" ")}>
          {I.title.map((word, w) => (
            <span key={w} className={`fx-intro__word ${w === I.title.length - 1 ? "text-primary" : ""}`} aria-hidden="true">
              {word.split("").map((ch, c) => (
                <span key={c} className="fx-intro__ch" style={{ animationDelay: `${n++ * I.titleLetterStaggerMs}ms` }}>
                  {ch}
                </span>
              ))}
            </span>
          ))}
        </p>
      )}
      <button
        type="button"
        className="fx-intro__skip"
        onClick={(e) => {
          e.stopPropagation();
          finish();
        }}
      >
        Skip
      </button>
    </div>
  );
}
