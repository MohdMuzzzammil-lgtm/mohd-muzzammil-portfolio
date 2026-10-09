/** Tiny synthesized "card flick" sounds (Web Audio, no audio files). Browsers only allow sound after a user gesture. */
let ctx: AudioContext | null = null;
let muted = false;
export let flickCount = 0;

function get(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC = window.AudioContext ?? (window as any).webkitAudioContext;
    if (!AC) return null;
    try { ctx = new AC(); } catch { return null; }
  }
  return ctx;
}

/** Call from a click/tap/key handler (or try on load — it just stays suspended if the browser refuses). */
export function unlockSound(): boolean {
  const c = get();
  if (!c) return false;
  if (c.state === "suspended") void c.resume().catch(() => {});
  return c.state === "running";
}
export const soundRunning = () => !!ctx && ctx.state === "running";
export const setMuted = (m: boolean) => { muted = m; };
export const isMuted = () => muted;

/** One flick: a short airy "fwip" (filtered noise sweep) + a tiny paper "tick" on release. */
export function flick(power = 1) {
  const c = get();
  if (!c || c.state !== "running" || muted) return;
  flickCount++;
  const t = c.currentTime;
  const out = c.createGain();
  out.gain.value = 0.55 * power;
  out.connect(c.destination);

  // noise burst
  const len = Math.floor(c.sampleRate * 0.09);
  const buf = c.createBuffer(1, len, c.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.2);
  const src = c.createBufferSource();
  src.buffer = buf;
  const bp = c.createBiquadFilter();
  bp.type = "bandpass";
  bp.Q.value = 1.1;
  const f0 = 1400 + Math.random() * 900;
  bp.frequency.setValueAtTime(f0, t);
  bp.frequency.exponentialRampToValueAtTime(f0 * 3.2, t + 0.07); // upward "swish"
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.9, t + 0.006);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.09);
  src.connect(bp); bp.connect(g); g.connect(out);
  src.start(t);

  // tiny "clink/tick"
  const o = c.createOscillator();
  o.type = "triangle";
  const f = 2200 + Math.random() * 1400;
  o.frequency.setValueAtTime(f, t);
  o.frequency.exponentialRampToValueAtTime(f * 0.55, t + 0.05);
  const og = c.createGain();
  og.gain.setValueAtTime(0.0001, t);
  og.gain.exponentialRampToValueAtTime(0.22, t + 0.003);
  og.gain.exponentialRampToValueAtTime(0.0001, t + 0.06);
  o.connect(og); og.connect(out);
  o.start(t); o.stop(t + 0.07);
}
