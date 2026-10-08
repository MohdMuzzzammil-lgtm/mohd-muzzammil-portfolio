/**
 * Tiny shared scroll scheduler: ONE passive scroll listener + requestAnimationFrame
 * for every element that needs scroll progress. Elements only get updated while
 * they're near the viewport (IntersectionObserver), so it stays cheap on phones.
 */
type Item = { el: Element; update: (vh: number, rect: DOMRect) => void };

const active = new Set<Item>();
let ticking = false;
let bound = false;

function run() {
  ticking = false;
  const vh = window.innerHeight;
  active.forEach((i) => i.update(vh, i.el.getBoundingClientRect()));
}
function request() {
  if (!ticking) {
    ticking = true;
    requestAnimationFrame(run);
  }
}
function bind() {
  if (bound) return;
  bound = true;
  window.addEventListener("scroll", request, { passive: true });
  window.addEventListener("resize", request);
}

export function watchScroll(el: Element, update: Item["update"]) {
  const item: Item = { el, update };
  const io = new IntersectionObserver(
    ([entry]) => {
      if (entry?.isIntersecting) {
        active.add(item);
        bind();
        request();
      } else {
        active.delete(item);
        // one last update so it settles fully dim (0) or fully lit (1)
        update(window.innerHeight, el.getBoundingClientRect());
      }
    },
    { rootMargin: "20% 0px 20% 0px" },
  );
  io.observe(el);
  return () => {
    io.disconnect();
    active.delete(item);
  };
}

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
