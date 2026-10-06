import { createFileRoute } from "@tanstack/react-router";
import { Github, Linkedin, Mail, Phone, MapPin, ArrowUpRight, Sparkles, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CadViewer } from "@/components/CadViewer";
import portrait from "@/assets/portrait-tshirt.png";
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

function Index() {
  return (
    <main className="min-h-screen bg-deep px-3 py-3 md:px-6 md:py-6">
      {/* HERO */}
      <section id="home" className="relative mx-auto flex max-w-7xl flex-col overflow-hidden rounded-[2rem] bg-background grid-lines md:block md:h-[92vh] md:min-h-[560px] md:max-h-[900px]">
        <h1 className="relative z-10 px-2 pt-9 select-none text-center font-display text-[4.4rem] leading-[0.85] min-[400px]:text-[5rem] md:absolute md:inset-x-0 md:top-[8%] md:p-0 md:text-[15vw] xl:text-[13rem]">
          MOHD<br className="md:hidden" /> MUZZAMMIL
        </h1>
        <div className="relative mt-[-0.5rem] h-[240px] min-[400px]:h-[280px] md:static">
          <Ribbon className="z-10 md:hidden" d="M-40 260 C 200 120, 380 360, 560 170 S 900 -40, 1240 220" />
          <img src={portrait} alt="Mohd Muzzammil" width={500} height={931}
            className="portrait-outline absolute bottom-0 left-1/2 z-20 h-full w-auto max-w-none -translate-x-1/2 object-contain md:h-[64%] md:left-[60%] lg:left-1/2" />
        </div>
        <Ribbon className="z-10 hidden md:block" d="M-40 260 C 200 120, 380 360, 560 170 S 900 -40, 1240 220" />
        <Ribbon className="z-10 hidden md:block" d="M-40 560 C 220 600, 420 470, 600 540 S 980 600, 1240 520" />

        <div className="relative z-40 px-6 pb-4 pt-4 md:absolute md:bottom-24 md:left-10 md:max-w-[15rem] md:p-0 lg:max-w-xs">
          <p className="text-sm text-muted-foreground md:text-base">
            Mechanical Engineering Student & Robotics Developer — crafting functional CAD mechanisms, competitive robotics, and autonomous systems.
          </p>
          <div className="mt-3 flex items-center gap-2 md:mt-4">
            {socials.map(({ icon: I, href, label }) => (
              <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label}
                className="grid h-10 w-10 place-items-center rounded-full border border-border transition hover:bg-primary hover:text-primary-foreground">
                <I className="h-4 w-4" />
              </a>
            ))}
            <Button asChild size="sm" className="ml-auto md:ml-0">
              <a href={resumeAsset.url} download="Mohd_Muzzammil_Resume.pdf" aria-label="Download résumé"><Download /> Résumé</a>
            </Button>
          </div>
        </div>
        <p className="absolute bottom-32 right-10 z-40 hidden max-w-[16rem] text-sm text-muted-foreground lg:block">
          From 3D CAD parametric modeling and 3D printing to field-ready autonomous robotics and vehicle subsystems.
        </p>

        <nav aria-label="Portfolio sections" className="glass relative z-50 grid w-full grid-cols-5 gap-0.5 p-1 text-center text-[10px] min-[375px]:text-[11px] sm:text-sm md:absolute md:bottom-6 md:left-1/2 md:flex md:w-auto md:-translate-x-1/2 md:gap-1 md:rounded-full md:p-1.5">
          {["Home", "About", "Projects", "Experience", "Contact"].map((n, i) => (
            <a key={n} href={`#${n.toLowerCase()}`}
              className={`min-w-0 rounded-full px-1 py-3 font-medium transition md:px-5 md:py-2 ${i === 0 ? "bg-primary text-primary-foreground" : "hover:bg-secondary"}`}>
              {n}
            </a>
          ))}
        </nav>
      </section>

      <div className="mx-auto max-w-7xl space-y-20 px-3 py-12 md:space-y-24 md:px-8 md:py-24">
        {/* ABOUT */}
        <section id="about">
          <Pill>About</Pill>
          <div className="mt-4 grid gap-8 md:grid-cols-2 md:items-end">
            <h2 className="font-display text-6xl leading-none md:text-8xl">Engineering<br />Foundations</h2>
            <p className="text-muted-foreground">
              Pursuing a B.E. in Mechanical Engineering at Muffakham Jah College of Engineering and Technology (MJCET, Class of 2028). A CSWP-certified designer who turns kinematic ideas into machines that work on the field.
            </p>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              ["CAD & Mechanism Design", "CSWP (Certified SOLIDWORKS Professional), complex assemblies, generative layouts and tolerance stack-ups."],
              ["Prototyping & Fabrication", "Additive manufacturing, rapid prototyping, sheet metal and physical fabrication."],
              ["Mechatronics & Embedded", "Microcontrollers, sensor arrays, motor drivers and custom robotics electronics."],
            ].map(([t, d], i) => (
              <div key={t} className="rounded-3xl bg-card p-6 transition hover:-translate-y-1">
                <span className="font-display text-2xl text-primary">0{i + 1}</span>
                <h3 className="mt-6 text-xl font-semibold">{t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{d}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 grid overflow-hidden rounded-3xl bg-card md:grid-cols-5">
            <img src={awardAsset.url} alt="Mohd Muzzammil receiving the Designing & Prototyping award beside his robots" loading="lazy" width={1071} height={1428}
              className="h-full max-h-[520px] w-full object-cover object-top md:col-span-2" />
            <div className="flex flex-col justify-center gap-4 p-8 md:col-span-3 md:p-12">
              <span className="w-fit rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary">✦ Recognition</span>
              <h3 className="font-display text-5xl leading-none md:text-6xl">Designing &amp; Prototyping Award</h3>
              <p className="text-muted-foreground">Honoured at MJCET for the design and prototyping of competition robots — machines taken from CAD to working hardware on stage.</p>
            </div>
          </div>
        </section>

        {/* SAE BAJA */}
        <section id="baja">
          <Pill>SAE BAJA MJCET</Pill>
          <div className="mt-4 grid gap-8 md:grid-cols-2 md:items-end">
            <h2 className="font-display text-6xl leading-none md:text-8xl">Off-Road<br />Vehicle Design</h2>
            <p className="text-muted-foreground">
              Working as a Junior Designer with Team SAE BAJA MJCET — modeling the roll-cage chassis and vehicle subsystems for an all-terrain competition buggy.
            </p>
          </div>
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            <div className="overflow-hidden rounded-3xl bg-card lg:col-span-2">
              <img src={bajaAsset.url} alt="SAE BAJA roll-cage chassis CAD render" loading="lazy" width={1200} height={800}
                className="aspect-[3/2] w-full object-contain p-4" />
            </div>
            <div className="flex flex-col gap-4">
              {[
                ["Role", "Junior Designer"],
                ["Focus", "Roll-cage chassis & structural members"],
                ["Tools", "SOLIDWORKS CAD, assemblies & design checks"],
              ].map(([k, v]) => (
                <div key={k} className="flex-1 rounded-3xl border border-border p-6 transition hover:border-primary">
                  <span className="text-xs font-semibold text-primary">✦ {k}</span>
                  <p className="mt-2 text-xl font-semibold">{v}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* EXPERIENCE */}
        <section id="experience">
          <Pill>Leadership</Pill>
          <h2 className="mt-4 font-display text-6xl leading-none md:text-8xl">Experience</h2>
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {[
              ["Design Head", "Team Robocon MJCET", "Overseeing mechanism engineering and CAD development for ABU Robocon competition machines."],
              ["Junior Design Engineer", "SAE BAJA MJCET", "Designing structural chassis and dynamic mechanical vehicle components."],
              ["Joint Secretary", "Club Optimus", "Organizing college-level technical robotics competitions and student workshops."],
              ["R&D Researcher", "MJCET Research", "Researching, prototyping and testing agricultural and multi-terrain robotic platforms."],
            ].map(([role, org, d]) => (
              <div key={role} className="group flex flex-col justify-between rounded-3xl border border-border p-6 transition hover:border-primary">
                <span className="w-fit rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary">{org}</span>
                <div className="mt-8">
                  <h3 className="font-display text-4xl">{role}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{d}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* PROJECTS */}
        <section id="projects">
          <Pill>Project</Pill>
          <div className="mt-4 grid gap-6 md:grid-cols-2 md:items-end">
            <h2 className="font-display text-6xl leading-none md:text-8xl">Featured Builds</h2>
            <p className="text-muted-foreground">Robots and mechanisms taken from sketch and kinematics through CAD, fabrication and field testing.</p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {[
              { img: companion, tag: "Robotics & Autonomy", t: "Autonomous Companion Robot", d: "Autonomous mobile companion platform engineered for navigation and interaction.", href: `${GITHUB}/Companion-Robot` },
              { img: quadruped, tag: "R&D / Agri Robotics", t: "ASTRO-SAFL Quadruped", d: "Quadruped multi-terrain agricultural robotic system developed through university research.", href: "https://onerealti.github.io/astro-safl" },
            ].map((p) => (
              <article key={p.t} className="group">
                <div className="overflow-hidden rounded-3xl bg-card">
                  <img src={p.img} alt={p.t} loading="lazy" width={1024} height={768} className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-105" />
                </div>
                <div className="mt-4 flex items-start justify-between gap-4">
                  <div>
                    <span className="text-xs font-semibold text-primary">✦ {p.tag}</span>
                    <h3 className="mt-1 text-2xl font-semibold">{p.t}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{p.d}</p>
                  </div>
                  {p.href && (
                    <a href={p.href} target="_blank" rel="noreferrer" aria-label={`Open ${p.t}`}
                      className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground transition group-hover:rotate-45">
                      <ArrowUpRight className="h-5 w-5" />
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
          <article className="group mt-6 grid gap-6 overflow-hidden rounded-3xl bg-card p-3 lg:grid-cols-2 lg:p-4">
            <div className="grid grid-cols-2 gap-2">
              {roboconGallery.map((g) => (
                <div key={g.src} className="overflow-hidden rounded-2xl">
                  <img src={g.src} alt={g.alt} loading="lazy" width={1024} height={1024}
                    className="aspect-square h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                </div>
              ))}
            </div>
            <div className="flex flex-col justify-center p-5 lg:p-10">
              <span className="text-xs font-semibold text-primary">✦ High-Precision CAD</span>
              <h3 className="mt-2 font-display text-5xl leading-none md:text-6xl">ABU Robocon Mechanisms</h3>
              <p className="mt-4 text-sm text-muted-foreground md:text-base">Competition-grade subsystems, linkages and drive modules for Team Robocon MJCET — shown here across the full robot assembly and belt-driven mechanism prototypes.</p>
              <a href={GITHUB} target="_blank" rel="noreferrer" className="mt-6 inline-flex w-fit items-center gap-2 text-sm font-semibold text-primary hover:underline" aria-label="View Mohd Muzzammil's GitHub profile">
                View GitHub profile <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </article>
        </section>

        {/* 3D MODELS */}
        <section id="models">
          <Pill>Interactive CAD</Pill>
          <h2 className="mt-4 font-display text-6xl leading-none md:text-8xl">3D Models</h2>
          <p className="mt-4 max-w-xl text-muted-foreground">Explore my designs in 3D. Rotate, zoom and pan to inspect every assembly.</p>
          <div className="mt-8"><CadViewer /></div>
        </section>

        {/* WORKFLOW */}
        <section>
          <Pill>Engineering Workflow</Pill>
          <h2 className="mt-4 font-display text-6xl leading-none md:text-8xl">How I Build</h2>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              ["Concept & Kinematics", "Mathematical formulation, mechanism synthesis and preliminary kinematic studies."],
              ["3D CAD & Validation", "Parametric part and assembly modeling, CSWP-grade structural checks and fit verification."],
              ["Fabrication & Integration", "3D printing, CNC/manual fabrication, microcontroller wiring and field testing."],
            ].map(([t, d], i) => (
              <div key={t} className="rounded-3xl bg-card p-6">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary font-display text-xl text-primary-foreground">0{i + 1}</div>
                <h3 className="mt-6 text-lg font-semibold">{t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{d}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* CONTACT */}
      <section id="contact" className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-background grid-lines">
        <div className="relative h-[40vh] min-h-[300px]">
          <h2 className="absolute inset-x-0 top-10 z-20 text-center font-display text-[4.2rem] leading-none sm:text-8xl md:text-[9rem] xl:text-[15rem]">LET'S BUILD</h2>
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
