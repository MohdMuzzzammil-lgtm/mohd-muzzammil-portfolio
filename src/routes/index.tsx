import { createFileRoute } from "@tanstack/react-router";
import { Github, Linkedin, Mail, Phone, MapPin, ArrowUpRight, Sparkles, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CadViewer } from "@/components/CadViewer";
import { ScrollLitHeading } from "@/components/fx/ScrollLitHeading";
import { CountUp } from "@/components/fx/CountUp";
import { STATS } from "@/lib/fx-config";
import { Reveal, Parallax, Tilt, ScrollProgress, Marquee, MomentsWall, ScrollFill } from "@/components/fx/motion";
import { useRef } from "react";
// Images live in /public/img — BASE_URL makes the paths work under /<repo-name>/ on GitHub Pages
const img = (f: string) => `${import.meta.env.BASE_URL}img/${f}`;
const SITE = "https://mohdmuzzzammil-lgtm.github.io/mohd-muzzammil-portfolio";
const resumeAsset = { url: img("Mohd_Muzzammil_Resume.pdf") };
const bajaAsset = { url: img("baja-chassis.png") };
const awardAsset = { url: img("award-stage.jpg") };
const companionAsset = { url: img("companion-2.jpg") };
const saflAsset = { url: img("safl.jpg") };
const roboconR1Asset = { url: img("robocon-r1.jpg") };
const roboconR2Asset = { url: img("robocon-r2.jpg") };
const roboconProto1Asset = { url: img("robocon-proto1.jpg") };
const roboconProto2Asset = { url: img("robocon-proto2.jpg") };
const companion = companionAsset.url;
const quadruped = saflAsset.url;
const gal = (n: number) => img(`gallery/g${String(n).padStart(2, "0")}.jpg`);
const moments = [
  [1, "Keynote"], [13, "Quadruped"], [8, "Award"], [2, "Team"], [6, "Wiring"], [5, "On Stage"], [10, "Award"], [12, "Rover"],
  [4, "Medals"], [9, "Expo"], [14, "Legs"], [7, "Seminar"], [15, "Winners"], [3, "Podium"], [16, "Chassis"], [11, "Expo"], [17, "Companion"], [18, "Companion"], [19, "Companion"],
].map(([n, caption]) => ({ src: gal(n as number), caption: caption as string }));

const roboconGallery = [
  { src: roboconR1Asset.url, alt: "Robocon R1 robot CAD render" },
  { src: roboconR2Asset.url, alt: "Robocon R2 robot CAD render" },
  { src: roboconProto1Asset.url, alt: "Robocon prototype 1 mechanism CAD" },
  { src: roboconProto2Asset.url, alt: "Robocon prototype 2 mechanism CAD" },
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Mohd Muzzammil — Mechanical Engineer, CAD & Robotics" },
      { name: "description", content: "Portfolio of Mohd Muzzammil: CSWP-certified CAD designer, robotics developer and Mechanical Engineering student at MJCET, Hyderabad." },
      { property: "og:title", content: "Mohd Muzzammil — CAD & Robotics Portfolio" },
      { property: "og:description", content: "Functional CAD mechanisms, competitive robotics and autonomous systems." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:image", content: `${SITE}/img/award-stage.jpg` },
      { name: "twitter:image", content: `${SITE}/img/award-stage.jpg` },
    ],
  }),
  component: Index,
});

const EMAIL = "muzzammil.mohd636@gmail.com";
const PHONE = "+916303665998";
const GITHUB = "https://github.com/MohdMuzzzammil-lgtm";
const LINKEDIN = "https://www.linkedin.com/in/mohd-muzzammil-3b6b753a6";

const socials = [
  { icon: Github, href: GITHUB, label: "GitHub" },
  { icon: Linkedin, href: LINKEDIN, label: "LinkedIn" },
  { icon: Mail, href: `mailto:${EMAIL}`, label: "Email" },
  { icon: Phone, href: `tel:${PHONE}`, label: "Phone" },
];

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-3 py-1 text-xs font-semibold text-primary-foreground">
      <Sparkles className="h-3 w-3" /> {children}
    </span>
  );
}

function Ribbon({ d, className = "" }: { d: string; className?: string }) {
  return (
    <svg viewBox="0 0 1200 600" preserveAspectRatio="none" className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}>
      <path d={d} fill="none" stroke="var(--primary)" strokeWidth="28" strokeLinecap="round" className="ribbon-draw" />
    </svg>
  );
}

function ProjectHead({ n, tag, t, d, href }: { n: string; tag: string; t: string; d: string; href: string }) {
  return (
    <div className="group flex items-start justify-between gap-4 border-t border-border pt-6">
      <div className="flex gap-5 md:gap-8">
        <span className="font-display text-4xl text-primary md:text-6xl">{n}</span>
        <div>
          <span className="text-xs font-semibold text-primary">✦ {tag}</span>
          <h3 className="mt-1 font-display text-4xl leading-none md:text-6xl">{t}</h3>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground md:text-base">{d}</p>
        </div>
      </div>
      <a href={href} target="_blank" rel="noreferrer" aria-label={`Open ${t}`}
        className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground transition duration-300 hover:rotate-45 hover:scale-110">
        <ArrowUpRight className="h-5 w-5" />
      </a>
    </div>
  );
}

function HeroTitle({ text, base }: { text: string; base: number }) {
  return (
    <>
      {text.split(" ").map((w, wi) => (
        <span key={wi} className="hero-word">
          {w.split("").map((ch, i) => (
            <span key={i} className="hero-ch" style={{ ["--d" as string]: `${base + (wi * 8 + i) * 45}ms` }}><span className="hero-lt">{ch}</span></span>
          ))}
          {wi === 0 && <span className="md:hidden"><br /></span>}
        </span>
      ))}
    </>
  );
}

function Index() {
  const heroRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const tilt = (e: React.PointerEvent) => {
    const el = titleRef.current; if (!el || e.pointerType !== "mouse") return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--ty", `${(x * 12).toFixed(2)}deg`);
    el.style.setProperty("--tx", `${(-y * 10).toFixed(2)}deg`);
    el.style.setProperty("--tsk", `${(-x * 3).toFixed(2)}deg`);
  };
  const untilt = () => { const el = titleRef.current; if (el) { el.style.setProperty("--ty", "0deg"); el.style.setProperty("--tx", "0deg"); el.style.setProperty("--tsk", "0deg"); } };
  const spot = (e: React.PointerEvent) => {
    const el = heroRef.current; if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`); el.style.setProperty("--my", `${e.clientY - r.top}px`);
    el.style.setProperty("--px", ((e.clientX - r.left) / r.width - 0.5).toFixed(3)); el.style.setProperty("--py", ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
  };
  return (
    <main className="min-h-screen bg-deep px-3 py-3 md:px-6 md:py-6">
      <ScrollProgress />
      {/* HERO */}
      <section ref={heroRef} onPointerMove={spot} id="home" className="relative mx-auto flex max-w-7xl flex-col overflow-hidden rounded-[2rem] bg-background grid-lines md:block md:h-[92vh] md:min-h-[560px] md:max-h-[900px]">
        <div className="hero-spot" />
        <h1 ref={titleRef} onPointerMove={tilt} onPointerLeave={untilt} aria-label="Mohd Muzzammil" className="hero-tilt relative z-10 px-2 pt-9 select-none text-center font-display text-[4.4rem] leading-[0.85] min-[400px]:text-[5rem] md:absolute md:inset-x-0 md:top-1/2 md:-translate-y-[58%] md:p-0 md:text-[15vw] xl:text-[13rem]">
          <HeroTitle text="MOHD MUZZAMMIL" base={150} />
        </h1>
        <div className="relative mt-[-0.5rem] h-[190px] min-[400px]:h-[220px] md:hidden">
          <Ribbon className="z-10" d="M-40 260 C 200 120, 380 360, 560 170 S 900 -40, 1240 220" />
          {[
            ["left-4 top-3", 5, "On Stage", -7],
            ["left-1/2 top-10 -translate-x-1/2", 17, "Companion", 3],
            ["right-4 top-2", 13, "Quadruped", 7],
          ].map(([cls, n, cap, rot]) => (
            <div key={cap as string} className={`hero-in hang absolute z-20 w-[5.2rem] min-[400px]:w-24 ${cls}`} style={{ ["--d" as string]: "800ms", ["--rot" as string]: `${rot}deg` }}>
              <div className="hang-in">
                <figure className="float-card m-0 bg-[#f4f4f0] p-1 pb-0 shadow-xl" style={{ animationDelay: `${(n as number) * 0.25}s` }}>
                  <img src={gal(n as number)} alt="" className="aspect-square w-full object-cover grayscale" />
                  <figcaption className="py-1 text-center font-display text-[10px] uppercase leading-none tracking-wider text-black">{cap}</figcaption>
                </figure>
              </div>
            </div>
          ))}
        </div>
        <Ribbon className="z-10 hidden md:block" d="M-40 260 C 200 120, 380 360, 560 170 S 900 -40, 1240 220" />
        <Ribbon className="z-10 hidden md:block" d="M-40 560 C 220 600, 420 470, 600 540 S 980 600, 1240 520" />

        {/* hanging polaroids (desktop): strings from the ceiling, swing on hover, drift with the cursor */}
        {[
          ["left-[4%] top-[11%] w-32 lg:w-40", 5, "On Stage", 900, -6],
          ["right-[5%] top-[13%] w-32 lg:w-40", 13, "Quadruped", 1050, 6],
          ["left-[21%] top-[5%] w-24 lg:w-28 hidden xl:block", 17, "Companion", 1200, 4],
          ["right-[22%] top-[6%] w-24 lg:w-28 hidden xl:block", 8, "Award", 1350, -4],
        ].map(([cls, n, cap, d, rot]) => (
          <div key={cap as string} className={`hero-in hang absolute z-20 hidden md:block ${cls}`} style={{ ["--d" as string]: `${d}ms`, ["--rot" as string]: `${rot}deg` }}>
            <i className="hang-string" />
            <div className="hang-in">
              <figure className="float-card m-0 bg-[#f4f4f0] p-1.5 pb-0 shadow-2xl" style={{ animationDelay: `${(n as number) * 0.3}s` }}>
                <span className="hang-pin" />
                <img src={gal(n as number)} alt="" className="aspect-square w-full object-cover grayscale transition duration-500" />
                <figcaption className="py-1.5 text-center font-display text-sm uppercase leading-none tracking-wider text-black">{cap}</figcaption>
              </figure>
            </div>
          </div>
        ))}

        <div className="hero-in relative z-40 px-6 pb-4 pt-4 md:absolute md:bottom-24 md:left-10 md:max-w-[15rem] md:p-0 lg:max-w-xs" style={{ ["--d" as string]: "700ms" }}>
          <p className="text-sm text-muted-foreground md:text-base">
            Mechanical Engineering Student & Robotics Developer — crafting functional CAD mechanisms, competitive robotics, and autonomous systems.
          </p>
          <div className="mt-3 flex items-center gap-2 md:mt-4">
            {socials.map(({ icon: I, href, label }) => (
              <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label}
                className="grid h-10 w-10 place-items-center rounded-full border border-border transition duration-300 hover:-translate-y-1 hover:bg-primary hover:text-primary-foreground">
                <I className="h-4 w-4" />
              </a>
            ))}
            <Button asChild size="sm" className="ml-auto md:ml-0">
              <a href={resumeAsset.url} download="Mohd_Muzzammil_Resume.pdf" aria-label="Download résumé"><Download /> Résumé</a>
            </Button>
          </div>
        </div>
        <p className="hero-in absolute bottom-32 right-10 z-40 hidden max-w-[16rem] text-sm text-muted-foreground lg:block" style={{ ["--d" as string]: "900ms" }}>
          From 3D CAD parametric modeling and 3D printing to field-ready autonomous robotics and vehicle subsystems.
        </p>

        <nav aria-label="Portfolio sections" className="hero-in glass relative z-50 grid w-full grid-cols-5 gap-0.5 p-1 text-center text-[10px] min-[375px]:text-[11px] sm:text-sm md:absolute md:bottom-6 md:left-1/2 md:flex md:w-auto md:-translate-x-1/2 md:gap-1 md:rounded-full md:p-1.5" style={{ ["--d" as string]: "1000ms" }}>
          {["Home", "About", "Projects", "Experience", "Contact"].map((n, i) => (
            <a key={n} href={`#${n.toLowerCase()}`}
              className={`min-w-0 rounded-full px-1 py-3 font-medium transition md:px-5 md:py-2 ${i === 0 ? "bg-primary text-primary-foreground" : "hover:bg-secondary"}`}>
              {n}
            </a>
          ))}
        </nav>
      </section>

      {/* MARQUEE */}
      <div className="mx-auto mt-10 max-w-7xl space-y-2 overflow-hidden py-4 md:mt-16">
        <Marquee items={["CAD DESIGN", "ROBOTICS", "SAE BAJA", "EMBEDDED", "3D PRINTING", "MECHATRONICS"]} />
        <Marquee reverse outline items={["SOLIDWORKS", "CSWP", "ABU ROBOCON", "AUTONOMY", "PROTOTYPING", "KINEMATICS"]} />
      </div>

      <div className="mx-auto max-w-7xl space-y-24 px-3 py-12 md:space-y-36 md:px-8 md:py-24">
        {/* ABOUT */}
        <section id="about">
          <Reveal><Pill>About</Pill></Reveal>
          <div className="mt-4 grid gap-8 md:grid-cols-2 md:items-end">
            <ScrollLitHeading dim="Engineering" lit="Foundations" className="font-display text-6xl leading-none md:text-8xl" />
            <Reveal delay={150}>
              <p className="text-muted-foreground">
                Pursuing a B.E. in Mechanical Engineering at Muffakham Jah College of Engineering and Technology (MJCET, Class of 2028). A CSWP-certified designer who turns kinematic ideas into machines that work on the field.
              </p>
            </Reveal>
          </div>

          {/* stats as rows */}
          <div className="mt-12 border-t border-border">
            {STATS.map((st, i) => (
              <Reveal key={st.label} delay={i * 120} variant="left">
                <div className="stat-row flex items-center justify-between gap-4 py-5 md:py-7">
                  <span className="flex items-baseline gap-4 md:gap-8">
                    <span className="text-xs font-semibold text-primary md:text-sm">0{i + 1}</span>
                    <span className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground md:text-base">{st.label}</span>
                  </span>
                  <CountUp to={st.value} suffix={st.suffix} delayMs={i * 150} className="font-display text-6xl leading-none text-primary md:text-8xl" />
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              ["CAD & Mechanism Design", "CSWP (Certified SOLIDWORKS Professional), complex assemblies, generative layouts and tolerance stack-ups."],
              ["Prototyping & Fabrication", "Additive manufacturing, rapid prototyping, sheet metal and physical fabrication."],
              ["Mechatronics & Embedded", "Microcontrollers, sensor arrays, motor drivers and custom robotics electronics."],
            ].map(([t, d], i) => (
              <Reveal key={t} delay={i * 130}>
                <Tilt className="group h-full rounded-3xl bg-card p-6 transition-colors hover:bg-secondary">
                  <span className="font-display text-2xl text-primary">0{i + 1}</span>
                  <h3 className="mt-6 text-xl font-semibold">{t}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{d}</p>
                </Tilt>
              </Reveal>
            ))}
          </div>

          <Reveal variant="clip" className="mt-6">
            <div className="grid overflow-hidden rounded-3xl bg-card md:grid-cols-5">
              <Parallax src={awardAsset.url} alt="Mohd Muzzammil receiving the Designing & Prototyping award beside his robots" width={1071} height={1428}
                className="max-h-[520px] md:col-span-2" imgClass="object-cover object-top" speed={50} />
              <div className="flex flex-col justify-center gap-4 p-8 md:col-span-3 md:p-12">
                <span className="w-fit rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary">✦ Recognition</span>
                <h3 className="font-display text-5xl leading-none md:text-6xl">Designing &amp; Prototyping Award</h3>
                <p className="text-muted-foreground">Honoured at MJCET for the design and prototyping of competition robots — machines taken from CAD to working hardware on stage.</p>
              </div>
            </div>
          </Reveal>
        </section>

        {/* PROJECTS — Baja → Robocon → SAFL → Companion, each with its 3D model below */}
        <section id="projects">
          <Reveal><Pill>Project</Pill></Reveal>
          <div className="mt-4 grid gap-6 md:grid-cols-2 md:items-end">
            <ScrollLitHeading dim="Featured" lit="Builds" breakAfterDim={false} className="font-display text-6xl leading-none md:text-8xl" />
            <Reveal delay={150}><p className="text-muted-foreground">Vehicles, robots and mechanisms taken from sketch and kinematics through CAD, fabrication and field testing — each with its 3D model right below.</p></Reveal>
          </div>

          {/* 01 SAE BAJA */}
          <div id="baja" className="mt-12 scroll-mt-8 md:mt-14">
            <Reveal>
              <ProjectHead n="01" tag="SAE BAJA MJCET" t="Off-Road Vehicle Design" d="Junior Designer with Team SAE BAJA MJCET — modeling the roll-cage chassis and vehicle subsystems for an all-terrain competition buggy." href={GITHUB} />
            </Reveal>
            <div className="mt-6 grid gap-4 lg:grid-cols-3 lg:gap-6">
              <Reveal variant="left" className="lg:col-span-2">
                <div className="overflow-hidden rounded-3xl bg-card">
                  <img src={bajaAsset.url} alt="SAE BAJA roll-cage chassis CAD render" loading="lazy" width={1200} height={800} className="aspect-[3/2] w-full object-contain p-4 transition duration-700 hover:scale-105" />
                </div>
              </Reveal>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-1 lg:gap-4">
                {[
                  ["Role", "Junior Designer"],
                  ["Focus", "Roll-cage chassis & structural members"],
                  ["Tools", "SOLIDWORKS CAD, assemblies & design checks"],
                ].map(([k, v], i) => (
                  <Reveal key={k} variant="right" delay={i * 130}>
                    <div className="h-full rounded-3xl border border-border p-5 transition duration-300 hover:-translate-y-1 hover:border-primary md:p-6">
                      <span className="text-xs font-semibold text-primary">✦ {k}</span>
                      <p className="mt-2 text-lg font-semibold md:text-xl">{v}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
            <Reveal className="mt-6" variant="clip"><CadViewer models={[{ file: "sae-baja.glb", label: "SAE BAJA Vehicle", note: "Full vehicle assembly" }]} /></Reveal>
          </div>

          {/* 02 Robocon */}
          <div className="mt-20 md:mt-28">
            <Reveal>
              <ProjectHead n="02" tag="High-Precision CAD" t="ABU Robocon Mechanisms" d="Competition-grade subsystems, linkages and drive modules for Team Robocon MJCET — full robot assembly and belt-driven mechanism prototypes." href={GITHUB} />
            </Reveal>
            <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
              {roboconGallery.map((g, i) => (
                <Reveal key={g.src} delay={i * 110} variant="scale" className="overflow-hidden rounded-3xl bg-card">
                  <img src={g.src} alt={g.alt} loading="lazy" width={1024} height={1024} className="aspect-square h-full w-full object-cover transition duration-700 hover:scale-110" />
                </Reveal>
              ))}
            </div>
            <Reveal className="mt-6" variant="clip">
              <CadViewer models={[
                { file: "robocon-r1.glb", label: "Robocon R1 (2026)", note: "Robocon 2026 robot R1" },
                { file: "final-design.glb", label: "Final Design", note: "Final design assembly" },
              ]} />
            </Reveal>
          </div>

          {/* 03 SAFL */}
          <div className="mt-20 md:mt-28">
            <Reveal>
              <ProjectHead n="03" tag="R&D / Agri Robotics" t="ASTRO-SAFL Quadruped" d="Quadruped multi-terrain agricultural robotic system developed through university research." href="https://onerealti.github.io/astro-safl" />
            </Reveal>
            <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4 md:grid-rows-2 md:gap-4">
              <Reveal variant="scale" className="col-span-2 row-span-2 overflow-hidden rounded-3xl bg-card">
                <img src={quadruped} alt="ASTRO-SAFL quadruped" loading="lazy" width={1024} height={768} className="aspect-[4/3] h-full w-full object-cover transition duration-700 hover:scale-110 md:aspect-auto" />
              </Reveal>
              {[13, 14, 12, 16].map((n, i) => (
                <Reveal key={n} delay={(i + 1) * 110} variant="scale" className="overflow-hidden rounded-3xl bg-card">
                  <img src={gal(n)} alt="ASTRO-SAFL build and testing" loading="lazy" className="aspect-square h-full w-full object-cover transition duration-700 hover:scale-110" />
                </Reveal>
              ))}
            </div>
            <Reveal className="mt-6" variant="clip"><CadViewer models={[{ file: "safl-quadruped.glb", label: "SAFL Quadruped", note: "Agricultural quadruped robot" }]} /></Reveal>
          </div>

          {/* 04 Companion */}
          <div className="mt-20 md:mt-28">
            <Reveal>
              <ProjectHead n="04" tag="Robotics & Autonomy" t="Autonomous Companion Robot" d="Autonomous mobile companion platform engineered for navigation and interaction." href={`${GITHUB}/Companion-Robot`} />
            </Reveal>
            <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
              {[companion, gal(17), gal(18), gal(19)].map((s, i) => (
                <Reveal key={s} delay={i * 110} variant="scale" className="overflow-hidden rounded-3xl bg-card">
                  <img src={s} alt="Companion robot build" loading="lazy" className="aspect-[3/4] h-full w-full object-cover transition duration-700 hover:scale-110" />
                </Reveal>
              ))}
            </div>
            <Reveal className="mt-6" variant="clip"><CadViewer models={[{ file: "companion_robot.glb", label: "Companion Robot", note: "Autonomous companion platform" }]} /></Reveal>
          </div>
        </section>

        {/* EXPERIENCE */}
        <section id="experience" className="grid gap-10 md:grid-cols-[1fr_1.6fr]">
          <div className="md:sticky md:top-24 md:self-start">
            <Reveal><Pill>Leadership</Pill></Reveal>
            <ScrollLitHeading dim="Experience" className="mt-4 font-display text-6xl leading-none md:text-8xl" />
          </div>
          <ScrollFill className="relative pl-10">
            <div className="tl-line"><i /></div>
            {[
              ["Design Head", "Team Robocon MJCET", "Overseeing mechanism engineering and CAD development for ABU Robocon competition machines."],
              ["Junior Design Engineer", "SAE BAJA MJCET", "Designing structural chassis and dynamic mechanical vehicle components."],
              ["Joint Secretary", "Club Optimus", "Organizing college-level technical robotics competitions and student workshops."],
              ["R&D Researcher", "MJCET Research", "Researching, prototyping and testing agricultural and multi-terrain robotic platforms."],
            ].map(([role, org, d], i) => (
              <Reveal key={role} variant="right" delay={i * 80} className="tl-item relative mb-5 last:mb-0">
                <span className="tl-dot" style={{ left: "-2.45rem" }} />
                <div className="group rounded-3xl border border-border p-6 transition duration-300 hover:translate-x-2 hover:border-primary hover:bg-card">
                  <span className="w-fit rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary">{org}</span>
                  <h3 className="mt-5 font-display text-4xl md:text-5xl">{role}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{d}</p>
                </div>
              </Reveal>
            ))}
          </ScrollFill>
        </section>

        {/* WORKFLOW */}
        <section>
          <Reveal><Pill>Engineering Workflow</Pill></Reveal>
          <ScrollLitHeading dim="How I" lit="Build" breakAfterDim={false} className="mt-4 font-display text-6xl leading-none md:text-8xl" />
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              ["Concept & Kinematics", "Mathematical formulation, mechanism synthesis and preliminary kinematic studies."],
              ["3D CAD & Validation", "Parametric part and assembly modeling, CSWP-grade structural checks and fit verification."],
              ["Fabrication & Integration", "3D printing, CNC/manual fabrication, microcontroller wiring and field testing."],
            ].map(([t, d], i) => (
              <Reveal key={t} delay={i * 160}>
                <div className="group h-full rounded-3xl bg-card p-6 transition duration-300 hover:-translate-y-2 hover:bg-secondary">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary font-display text-xl text-primary-foreground transition duration-500 group-hover:rotate-[360deg]">0{i + 1}</div>
                  <h3 className="mt-6 text-lg font-semibold">{t}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* MOMENTS */}
        <section id="moments">
          <Reveal><Pill>Moments</Pill></Reveal>
          <div className="mt-4 grid gap-6 md:grid-cols-2 md:items-end">
            <ScrollLitHeading dim="Behind the" lit="Builds" className="font-display text-6xl leading-none md:text-8xl" />
            <Reveal delay={150}><p className="text-muted-foreground">Stages, workshops, award days and late nights with the robots — the people and machines behind the CAD.</p></Reveal>
          </div>
          <div className="mt-12"><MomentsWall items={moments} /></div>
        </section>
      </div>

      {/* CONTACT */}
      <section id="contact" className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-background grid-lines">
        <div className="relative h-[40vh] min-h-[300px]">
          <Reveal className="absolute inset-x-0 top-10 z-20"><h2 className="text-center font-display text-[4.2rem] leading-none sm:text-8xl md:text-[9rem] xl:text-[15rem]">LET'S BUILD</h2></Reveal>
          <Ribbon className="z-10" d="M-40 420 C 200 80, 420 80, 600 300 S 1000 520, 1240 120" />
        </div>
        <div className="relative z-30 grid gap-4 border-t border-border p-6 text-sm md:grid-cols-4 md:p-10">
          <a href={`mailto:${EMAIL}`} className="flex min-w-0 items-center gap-2 break-all hover:text-primary"><Mail className="h-4 w-4 shrink-0 text-primary" />{EMAIL}</a>
          <a href={`tel:${PHONE}`} className="flex items-center gap-2 hover:text-primary"><Phone className="h-4 w-4 text-primary" />+91 6303665998</a>
          <span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" />Hyderabad, Telangana, India</span>
          <span className="flex flex-wrap gap-4">
            <a href={GITHUB} target="_blank" rel="noreferrer" className="hover:text-primary">GitHub</a>
            <a href={LINKEDIN} target="_blank" rel="noreferrer" className="hover:text-primary">LinkedIn</a>
            <a href={resumeAsset.url} download="Mohd_Muzzammil_Resume.pdf" className="hover:text-primary">Résumé ↓</a>
          </span>
        </div>
      </section>

      <footer className="mx-auto max-w-7xl px-3 pt-10">
        <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
          {["Home", "About", "Projects", "Experience", "Contact"].map((n) => (
            <a key={n} href={`#${n.toLowerCase()}`} className="hover:text-primary">{n}</a>
          ))}
        </div>
        <p className="mt-6 select-none break-words text-center font-display text-6xl leading-[0.8] sm:text-8xl md:text-[8rem] xl:text-[13.5rem]">MOHD MUZZAMMIL</p>
        <p className="pb-4 pt-4 text-center text-xs text-muted-foreground">© {new Date().getFullYear()} Mohd Muzzammil. All rights reserved.</p>
      </footer>
    </main>
  );
}
