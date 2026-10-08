/**
 * ONE PLACE TO TUNE THE ANIMATIONS.
 * All timings are in milliseconds. Easings are CSS cubic-bezier strings
 * (try https://cubic-bezier.com) except countUp.ease, which is a JS function.
 */

export type IntroPhoto = { file: string; caption: string };

export const FX = {
  intro: {
    enabled: true,
    /** true = play once per browser tab session; false = play on every page load (handy while tuning). */
    oncePerSession: true,
    /** Photos that drop in. Add your own: put the file in /public/img and add a line here. */
    photos: [
      { file: "gallery/g01.jpg", caption: "Keynote" },
      { file: "gallery/g02.jpg", caption: "Team" },
      { file: "gallery/g03.jpg", caption: "Podium" },
      { file: "gallery/g04.jpg", caption: "Medals" },
      { file: "gallery/g05.jpg", caption: "On Stage" },
      { file: "gallery/g06.jpg", caption: "Wiring" },
      { file: "gallery/g07.jpg", caption: "Seminar" },
      { file: "gallery/g08.jpg", caption: "Award" },
      { file: "gallery/g09.jpg", caption: "Expo" },
      { file: "gallery/g10.jpg", caption: "Award" },
      { file: "gallery/g11.jpg", caption: "Expo" },
      { file: "gallery/g12.jpg", caption: "Rover" },
      { file: "gallery/g13.jpg", caption: "Quadruped" },
      { file: "gallery/g14.jpg", caption: "Legs" },
      { file: "gallery/g15.jpg", caption: "Winners" },
      { file: "gallery/g16.jpg", caption: "Chassis" },
      { file: "gallery/g17.jpg", caption: "Companion" },
      { file: "gallery/g18.jpg", caption: "Companion" },
      { file: "gallery/g19.jpg", caption: "Companion" },
    ] as IntroPhoto[],
    /** [columns, rows] of the invisible grid the photos scatter over. cols*rows = number of photos. */
    gridDesktop: [6, 4] as [number, number],
    gridPhone: [3, 6] as [number, number],
    phoneMaxWidth: 640,
    /** Gap between one photo landing and the next one starting. */
    dropEveryMs: 130,
    /** How long a single photo takes to fall. */
    dropDurationMs: 800,
    dropEase: "cubic-bezier(0.22, 1.25, 0.36, 1)", // slight overshoot = "thud"
    /** Max random tilt in degrees (each photo gets 4..max, random sign). */
    maxTiltDeg: 16,
    /** Pause after the last photo before the title appears. */
    beforeTitleMs: 350,
    /** How long the title stays on screen before the intro slides away. */
    titleHoldMs: 1500,
    /** Delay between title letters rising in. */
    titleLetterStaggerMs: 45,
    exitDurationMs: 900,
    exitEase: "cubic-bezier(0.77, 0, 0.18, 1)",
    /** Max time to wait for photos to preload before starting anyway. */
    preloadTimeoutMs: 2500,
    title: ["MOHD", "MUZZAMMIL"],
  },

  cursor: {
    enabled: true,
    sizePx: 10,
    /** 1 = dot sticks to the mouse, lower = lazier trail (0.1–0.5 feels good). */
    follow: 0.35,
    /** Dot grows by this factor over links/buttons/3D models. */
    hoverScale: 3.2,
    /** Hide the normal arrow cursor on desktop. */
    hideNative: true,
    /** White dot that inverts over light areas (keeps it visible on lime cards). */
    blend: true,
  },

  scrollLit: {
    /** Heading top at this fraction of viewport height = 0% lit (0 = top, 1 = bottom). */
    startAt: 0.88,
    /** Heading top at this fraction = fully lit. */
    endAt: 0.4,
    /** Higher = letters light up more at once (smoother wave). */
    softness: 4,
  },

  countUp: {
    durationMs: 1800,
    /** Fraction of the number that must be visible before it starts. */
    threshold: 0.5,
    ease: (t: number) => 1 - Math.pow(1 - t, 3), // ease-out cubic
  },
};

/**
 * Numbers for the count-up strip in the About section.
 * TODO(Mohd): these are placeholders based on what's on the site — set your real totals.
 */
export const STATS = [
  { value: 4, suffix: "+", label: "Projects built" },
  { value: 4, suffix: "+", label: "Competitions entered" },
  { value: 3, suffix: "", label: "Awards won" },
];
