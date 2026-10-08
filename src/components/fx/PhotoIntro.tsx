import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { FX } from "@/lib/fx-config";
import { prefersReducedMotion } from "@/lib/scroll-engine";

const SESSION_KEY = "fx-intro-seen";
const imgUrl = (f: string) => `${import.meta.env.BASE_URL}img/${f}`;

type Phase = "idle" | "dropping" | "title" | "exit" | "done";
type Drop = { src: string; caption: string; left: number; top: number; rot: number; w: number; dy: string; spin: number; pos: string };

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

/** One photo per grid cell (jittered) so the screen fills evenly, dropped in random order. */
function makeDrops(): Drop[] {
  const { photos, gridDesktop, gridPhone, phoneMaxWidth, maxTiltDeg } = FX.intro;
  const W = window.innerWidth;
  const H = window.innerHeight;
  const [cols, rows] = W <= phoneMaxWidth ? gridPhone : gridDesktop;
  const cellW = W / cols;
  const cellH = H / rows;
  // polaroid is ~1.2x taller than wide, so size it to overlap neighbours slightly
  const w = Math.min(Math.max(cellW * 1.35, (cellH / 1.2) * 1.35), 300);
  const cells: { cx: number; cy: number }[] = [];
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++) cells.push({ cx: (c + 0.5) / cols, cy: (r + 0.5) / rows });
  const pics = shuffle(photos);
  return shuffle(cells).map((cell, i) => {
    const p = pics[i % pics.length] ?? photos[0]!;
    return {
      src: imgUrl(p.file),
      caption: p.caption,
      left: (cell.cx + rand(-0.35, 0.35) / cols) * 100,
      top: (cell.cy + rand(-0.35, 0.35) / rows) * 100,
      rot: (Math.random() < 0.5 ? -1 : 1) * rand(4, maxTiltDeg),
      w,
      // alternate: cards slide UP from below, or drop from above
      dy: i % 2 ? "115vh" : "-115vh",
      spin: rand(14, 40) * (Math.random() < 0.5 ? -1 : 1),
      pos: `50% ${Math.round(rand(15, 35))}%`,
    };
  });
}

export function PhotoIntro() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [drops, setDrops] = useState<Drop[]>([]);
  const [shown, setShown] = useState(0);
  const timers = useRef<number[]>([]);
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
    Promise.race([Promise.all(loads), new Promise((r) => setTimeout(r, I.preloadTimeoutMs))]).then(
      () => {
        if (cancelled) return;
        setPhase("dropping");
        // accelerating cadence: starts deliberate, ends in a rapid-fire cascade
        let t = 0;
        list.forEach((_, i) => {
          const at = t;
          after(() => setShown(i + 1), at);
          t += I.dropEveryMs * (1.5 - (i / list.length) * 1.1);
        });
        const allLanded = t + I.dropDurationMs + I.beforeTitleMs;
        after(() => setPhase("title"), allLanded);
        const titleChars = I.title.join("").length;
        after(finish, allLanded + titleChars * I.titleLetterStaggerMs + I.titleHoldMs);
      },
    );

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") finish();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      cancelled = true;
      timers.current.forEach(clearTimeout);
      timers.current = [];
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [finish]);

  if (phase === "done") return null;

  const I = FX.intro;
  const vars = {
    ["--drop-dur" as string]: `${I.dropDurationMs}ms`,
    ["--drop-ease" as string]: I.dropEase,
    ["--exit-dur" as string]: `${I.exitDurationMs}ms`,
    ["--exit-ease" as string]: I.exitEase,
  } as CSSProperties;

  let n = 0;
  return (
    <div
      className={`fx-intro fx-intro--${phase}`}
      style={vars}
      role="dialog"
      aria-label="Intro animation"
      onClick={finish}
    >
      {drops.slice(0, shown).map((d, i) => (
        <figure
          key={i}
          className="fx-polaroid"
          style={
            {
              left: `${d.left}%`,
              top: `${d.top}%`,
              width: d.w,
              ["--r" as string]: `${d.rot}deg`,
              ["--dy" as string]: d.dy,
              ["--spin" as string]: `${d.spin}deg`,
            } as CSSProperties
          }
        >
          <img src={d.src} alt="" decoding="async" draggable={false} style={{ objectPosition: d.pos }} />
          <figcaption>{d.caption}</figcaption>
        </figure>
      ))}
      <div className="fx-intro__shade" />
      <div className="fx-intro__count" aria-hidden="true">
        {String(Math.round((shown / Math.max(drops.length, 1)) * 100)).padStart(3, "0")}
        <span>%</span>
      </div>
      {(phase === "title" || phase === "exit") && (
        <p className="fx-intro__title" aria-label={I.title.join(" ")}>
          {I.title.map((word, w) => (
            <span
              key={w}
              className={`fx-intro__word ${w === I.title.length - 1 ? "text-primary" : ""}`}
              aria-hidden="true"
            >
              {word.split("").map((ch, c) => (
                <span
                  key={c}
                  className="fx-intro__ch"
                  style={{ animationDelay: `${n++ * I.titleLetterStaggerMs}ms` }}
                >
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
