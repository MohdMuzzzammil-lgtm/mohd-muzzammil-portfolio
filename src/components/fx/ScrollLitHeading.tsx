import { useEffect, useRef, type ElementType } from "react";
import { FX } from "@/lib/fx-config";
import { watchScroll } from "@/lib/scroll-engine";

type Props = {
  /** Part that starts grey and lights up to white as you scroll. */
  dim: string;
  /** Part that is always white (optional). */
  lit?: string;
  as?: ElementType;
  className?: string;
  /** Put `lit` on its own line. */
  breakAfterDim?: boolean;
};

function Letters({ text, offset, total }: { text: string; offset: number; total: number }) {
  let idx = offset;
  return (
    <>
      {text.split(" ").map((word, w, arr) => (
        <span key={w} className="inline-block whitespace-nowrap">
          {word.split("").map((ch, c) => (
            <span
              key={c}
              className="sl-letter"
              style={{ ["--i" as string]: idx++, ["--n" as string]: total }}
            >
              {ch}
            </span>
          ))}
          {w < arr.length - 1 ? "\u00A0" : ""}
        </span>
      ))}
    </>
  );
}

export function ScrollLitHeading({
  dim,
  lit = "",
  as: Tag = "h2",
  className = "",
  breakAfterDim = true,
}: Props) {
  const ref = useRef<HTMLElement | null>(null);
  const total = dim.replace(/ /g, "").length;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const { startAt, endAt } = FX.scrollLit;
    return watchScroll(el, (vh, rect) => {
      const p = (vh * startAt - rect.top) / (vh * (startAt - endAt));
      el.style.setProperty("--p", Math.min(1, Math.max(0, p)).toFixed(3));
    });
  }, []);

  return (
    <Tag
      ref={ref}
      className={`sl ${className}`}
      style={{ ["--p" as string]: 0, ["--soft" as string]: FX.scrollLit.softness }}
    >
      <span className="sr-only">
        {dim} {lit}
      </span>
      <span aria-hidden="true">
        <Letters text={dim} offset={0} total={total} />
        {lit && (breakAfterDim ? <br /> : " ")}
        {lit}
      </span>
    </Tag>
  );
}
