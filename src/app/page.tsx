"use client";

import Image from "next/image";
import { useEffect, useState, useRef, useCallback } from "react";
// import image from '../public/Jatin_Baga.jpeg'; 

/* ============================================
   DATA
   ============================================ */

const projects = [
  { icon: "fas fa-brain", title: "MARS - Apparel Replenishment System", tech: ["Python", "Django", "Pandas"], role: "Team", cat: "python", desc: "Django based intranet application that predicts the stock replenishment units at store-SKU level for the entire chain of apparel brand-entity." },
  { icon: "fas fa-tasks", title: "Rheolution IoT app", tech: ["Python", "Kivy Framework", "Mobile App"], role: "Team", cat: "python", desc: "Kivy framework based mobile application that runs over the Rheolution's Intranet to control and monitor the dairy line of calibration equipments." },
  { icon: "fas fa-eye", title: "Bespoke Dashboard reports", tech: ["Javascript", "HTML", "CSS"], role: "Solo Developer", cat: "front-end", desc: "Bespoke Dashboard reports developed for an org's management in Vanilla JS and CSS." },
];

const skillCategories = [
  {
    icon: "fas fa-tools", title: "Tools & Platforms",
    skills: [
      { icon: "fas fa-python", name: "Python", level: 90, primary: true },
      { icon: "fab fa-js", name: "JavaScript", level: 55 },
      { icon: "fas fa-database", name: "SQL", level: 65 },
      { icon: "fab fa-html5", name: "HTML/CSS", level: 70 },
      { icon: "fas fa-flask", name: "Flask / Django", level: 70 },
      { icon: "fab fa-chart-bar", name: "Pandas / NumPy", level: 75 },      
      { icon: "fas fa-git-alt", name: "Git / GitHub", level: 75 },
      { icon: "fab fa-terminal", name: "VS Code", level: 85 },
      { icon: "fas fa-linux", name: "Linux / CLI", level: 60 },
      { icon: "fab fa-cloud", name: "Google Colab", level: 70 },
    ],
  },
];

const marqueeItems = [
  "Python", "Flask", "Django", 
  "Pandas", "NumPy", "Git", "Linux", 
  "FastAPI", "PostgreSQL", "Machine Learning", 
];

/* ============================================
   HOOKS
   ============================================ */

function useScrollAnimation() {
  useEffect(() => {
    const els = document.querySelectorAll(".animate-on-scroll");
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const delay = Number((e.target as HTMLElement).dataset.delay) || 0;
            setTimeout(() => e.target.classList.add("animated"), delay);
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

function useCountUp(ref: React.RefObject<HTMLSpanElement | null>, target: number) {
  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          const duration = 1600;
          const start = performance.now();
          const animate = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 4);
            el.textContent = String(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
          obs.unobserve(el);
        }
      },
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [ref, target]);
}

function useSkillBars() {
  useEffect(() => {
    const bars = document.querySelectorAll<HTMLElement>(".skill-bar-el");
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const el = e.target as HTMLElement;
            el.style.width = el.dataset.level + "%";
            el.classList.add("skill-bar-animated");
            obs.unobserve(el);
          }
        });
      },
      { threshold: 0.3 }
    );
    bars.forEach((b) => obs.observe(b));
    return () => obs.disconnect();
  }, []);
}

function useMousePosition() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handler, { passive: true });
    return () => window.removeEventListener("mousemove", handler);
  }, []);
  return pos;
}

function useActiveSection(sectionIds: string[]) {
  const [active, setActive] = useState("");
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { threshold: 0.3, rootMargin: "-72px 0px -50% 0px" }
    );
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [sectionIds]);
  return active;
}

function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    let ticking = false;
    const handler = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const total = document.documentElement.scrollHeight - window.innerHeight;
          setProgress(total > 0 ? (window.scrollY / total) * 100 : 0);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);
  return progress;
}

/* ============================================
   UTILITY COMPONENTS
   ============================================ */

function CursorGlow({ mousePos }: { mousePos: { x: number; y: number } }) {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-30 hidden lg:block"
      style={{
        background: `radial-gradient(600px at ${mousePos.x}px ${mousePos.y}px, rgba(204,255,0,0.035), transparent 80%)`,
      }}
    />
  );
}

function ScrollProgress({ progress }: { progress: number }) {
  return (
    <div className="fixed top-0 left-0 right-0 z-[10001] h-[2px] bg-transparent">
      <div
        className="h-full bg-[#ccff00] shadow-[0_0_10px_rgba(204,255,0,0.5)] transition-[width] duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

function GlowCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--glow-x", `${e.clientX - rect.left}px`);
    el.style.setProperty("--glow-y", `${e.clientY - rect.top}px`);
  }, []);

  return (
    <div ref={ref} onMouseMove={handleMouseMove} className={`glow-card relative ${className}`}>
      <div className="glow-card-light" />
      {children}
    </div>
  );
}

function TiltCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rotateX = (y - 0.5) * -6;
    const rotateY = (x - 0.5) * 6;
    el.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02,1.02,1.02)`;
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (ref.current) {
      ref.current.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)";
    }
  }, []);

  return (
    <div ref={ref} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} className={`tilt-card ${className}`}>
      {children}
    </div>
  );
}

function MagneticButton({ children, className = "", href, onClick }: { children: React.ReactNode; className?: string; href?: string; onClick?: () => void }) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    el.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px) scale(1.03)`;
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (ref.current) {
      ref.current.style.transform = "translate(0,0) scale(1)";
    }
  }, []);

  return (
    <div ref={ref} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} className={`inline-block transition-transform duration-200 ${className}`}>
      {href ? (
        <a href={href}>{children}</a>
      ) : (
        <button onClick={onClick} className="cursor-pointer">{children}</button>
      )}
    </div>
  );
}

function SectionDivider() {
  return <div className="section-divider my-0" />;
}

function SectionLabel({ num, tag }: { num: string; tag: string }) {
  return (
    <div className="flex items-center gap-4 mb-4 animate-on-scroll">
      <span className="w-10 h-10 rounded-full border border-[rgba(255,255,255,0.1)] flex items-center justify-center font-[family-name:var(--font-jetbrains-mono)] text-xs text-[rgba(235,235,235,0.6)]">{num}</span>
      <span className="font-[family-name:var(--font-jetbrains-mono)] text-[10px] tracking-[0.2em] uppercase text-[rgba(235,235,235,0.6)]">{tag}</span>
    </div>
  );
}

/* ============================================
   SECTION COMPONENTS
   ============================================ */

function Preloader() {
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setHidden(true), 2200);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className={`preloader ${hidden ? "hidden" : ""}`}>
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#ccff00] flex items-center justify-center text-black text-2xl font-bold mx-auto mb-6 animate-[preloader-logo-pulse_1.5s_ease-in-out_infinite]">
          JV
        </div>
        <div className="font-[family-name:var(--font-jetbrains-mono)] text-[10px] tracking-[0.2em] uppercase text-[rgba(235,235,235,0.3)] mb-4">
          INITIALIZING SYSTEM
        </div>
        <div className="w-48 h-[2px] bg-[#161616] rounded-full overflow-hidden mx-auto">
          <div className="h-full bg-gradient-to-r from-[#ccff00] to-[#10b981] rounded-full animate-[preloader-fill_1.8s_ease-in-out_forwards]" />
        </div>
      </div>
    </div>
  );
}

const NAV_SECTIONS = ["about", "projects", "skills", "contact"];

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const activeSection = useActiveSection(NAV_SECTIONS);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const links: [string, string][] = [
    ["#about", "About"],
    ["#projects", "Projects"],
    ["#skills", "Skills"],
    ["#contact", "Contact"],
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#0c0c0c]/90 backdrop-blur-xl border-b border-[rgba(255,255,255,0.06)]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-[60px] sm:h-[72px] flex items-center justify-between">
        {/* Logo */}
        <a href="#hero" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-[#ccff00] flex items-center justify-center text-black text-lg font-bold transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(204,255,0,0.4)] group-hover:scale-110">
            JV
          </div>
          <span className="font-medium text-[#ebebeb] hidden sm:block">
            Jatin Verma
          </span>
        </a>

        {/* Desktop nav pill */}
        <div className="hidden lg:flex items-center bg-[rgba(255,255,255,0.05)] backdrop-blur-xl rounded-full px-2 py-1.5 border border-[rgba(255,255,255,0.08)]">
          {links.map(([href, label]) => {
            const isActive = activeSection === href.slice(1);
            return (
              <a
                key={href}
                href={href}
                className={`px-4 py-1.5 text-sm rounded-full transition-all duration-300 ${
                  isActive
                    ? "bg-[#ccff00] text-black font-semibold shadow-[0_0_15px_rgba(204,255,0,0.25)]"
                    : "text-[rgba(235,235,235,0.6)] hover:text-[#ebebeb] hover:bg-[rgba(255,255,255,0.05)]"
                }`}
              >
                {label}
              </a>
            );
          })}
        </div>

        {/* Right */}
        <div className="hidden lg:flex items-center gap-4">
          <div className="flex items-center gap-2 font-[family-name:var(--font-jetbrains-mono)] text-[10px] tracking-[0.2em] uppercase text-[rgba(235,235,235,0.6)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ccff00] animate-[pulse-lime_2s_infinite]" />
            <span>AVAILABLE</span>
          </div>
          <MagneticButton href="#contact">
            <span className="bg-[#ebebeb] text-black px-5 py-2 rounded-full text-sm font-semibold block">
              Let&apos;s Talk
            </span>
          </MagneticButton>
        </div>

        {/* Mobile toggle */}
        <button
          className="lg:hidden flex flex-col gap-[5px] p-1"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <span className={`w-6 h-0.5 bg-[#ebebeb] rounded transition-all duration-300 ${mobileOpen ? "rotate-45 translate-y-[7px]" : ""}`} />
          <span className={`w-6 h-0.5 bg-[#ebebeb] rounded transition-all duration-300 ${mobileOpen ? "opacity-0" : ""}`} />
          <span className={`w-6 h-0.5 bg-[#ebebeb] rounded transition-all duration-300 ${mobileOpen ? "-rotate-45 -translate-y-[7px]" : ""}`} />
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 bg-[#0c0c0c]/95 backdrop-blur-xl ${
          mobileOpen ? "max-h-[500px] pb-6" : "max-h-0"
        }`}
      >
        <div className="px-6 flex flex-col gap-1">
          {[...links].map(([href, label]) => (
            <a
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className="py-3 px-4 text-[rgba(235,235,235,0.6)] hover:text-[#ccff00] rounded-xl hover:bg-[rgba(255,255,255,0.05)] transition-colors"
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}

function StatNumber({ target }: { target: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  useCountUp(ref, target);
  return <span ref={ref} className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#ccff00] tracking-tight">0</span>;
}

function HeroCode() {
  const [visibleLines, setVisibleLines] = useState(0);

  const codeLines = [
    '<span class="hl-kw">class</span> <span class="hl-cls">JatinVerma</span>:',
    '    <span class="hl-kw">def</span> <span class="hl-fn">__init__</span>(<span class="hl-pr">self</span>):',
    '        <span class="hl-pr">self</span>.name = <span class="hl-str">"Jatin Verma"</span>',
    '        <span class="hl-pr">self</span>.skills = [',
    '            <span class="hl-str">"Python"</span>,',
    '            <span class="hl-str">"Django/Fast API"</span>,',
    '            <span class="hl-str">"AI/ML"</span>',
    '        ]',
    '        <span class="hl-pr">self</span>.mindset = <span class="hl-str">"Adapt and Pivot"</span>',
    '        <span class="hl-pr">self</span>.passion = <span class="hl-str">"Bring Ideas to Life"</span>',
    '',
    '    <span class="hl-kw">def</span> <span class="hl-fn">build</span>(<span class="hl-pr">self</span>):',
    '        <span class="hl-kw">return</span> <span class="hl-str">"Real-world Impact"</span>',
  ];

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      i++;
      setVisibleLines(i);
      if (i >= codeLines.length) clearInterval(timer);
    }, 120);
    return () => clearInterval(timer);
  }, [codeLines.length]);

  return (
    <div className="glass rounded-3xl overflow-hidden shadow-2xl">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-[rgba(255,255,255,0.1)]">
        <span className="w-3 h-3 rounded-full bg-[#e17055]" />
        <span className="w-3 h-3 rounded-full bg-[#fdcb6e]" />
        <span className="w-3 h-3 rounded-full bg-[#00b894]" />
        {/* <span className="ml-auto font-[family-name:var(--font-jetbrains-mono)] text-[10px] text-[rgba(235,235,235,0.3)]">
          appatacker.py
        </span> */}
      </div>
      <pre className="p-4 sm:p-5 font-[family-name:var(--font-jetbrains-mono)] text-[11px] sm:text-sm leading-relaxed overflow-x-auto min-h-[240px] sm:min-h-[280px]">
        {codeLines.map((line, i) => (
          <div
            key={i}
            className="transition-all duration-400"
            style={{
              opacity: i < visibleLines ? 1 : 0,
              transform: i < visibleLines ? "translateX(0)" : "translateX(12px)",
              transitionDelay: `${i * 30}ms`,
            }}
          >
            <code dangerouslySetInnerHTML={{ __html: line || "&nbsp;" }} />
          </div>
        ))}
        <span
          className="inline-block w-[2px] h-[1.1em] bg-[#ccff00] align-middle animate-[typing-blink_1s_infinite]"
          style={{ opacity: visibleLines >= codeLines.length ? 1 : 0 }}
        />
      </pre>
    </div>
  );
}

function Hero() {
  return (
    <section id="hero" className="relative overflow-hidden pt-[60px] sm:pt-[72px]">
      <div className="absolute inset-0 grid-bg opacity-50" />

      <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 pt-10 pb-14 sm:pt-16 sm:pb-20 lg:pt-24 lg:pb-28">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left col */}
          <div className="lg:col-span-7 animate-on-scroll">
            <div className="flex items-center gap-2 font-[family-name:var(--font-jetbrains-mono)] text-[10px] tracking-[0.2em] uppercase text-[rgba(235,235,235,0.6)] mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ccff00] animate-[pulse-lime_2s_infinite]" />
              SOFTWARE DEVELOPER PORTFOLIO
            </div>
            <h1 className="text-4xl sm:text-6xl lg:text-[7.5rem] font-light leading-[0.95] sm:leading-[0.85] tracking-[-0.04em] sm:tracking-[-0.06em] mb-6 sm:mb-8">
              Building the
              <br />
              <span className="text-shimmer italic font-semibold">
                future
              </span>
              <br />
              with Python &amp; AI
            </h1>
            <p className="text-[rgba(235,235,235,0.6)] text-base lg:text-lg max-w-xl mb-8 leading-relaxed">
              Hi, my name is <strong className="text-[#ebebeb]">Jatin Verma. </strong>
              {/* — aka{" "}
              <strong className="text-[#ccff00]">Jazz.py</strong>.  */}
              I develop software that solves real-world problems, bringing ideas to reality. 
              I also experiment with AI/ML and the latest tech, driven by curiosity and fueled 
              by a never-give-up mindset.
            </p>
            <div className="flex flex-wrap gap-2 mb-8">
              {["Software Developer - Python", "AI/ML Enthusiast"].map((t, i) => (
                <span
                  key={t}
                  className="px-4 py-1.5 rounded-full border border-[rgba(255,255,255,0.1)] text-xs font-[family-name:var(--font-jetbrains-mono)] uppercase tracking-wider text-[rgba(235,235,235,0.6)] animate-on-scroll"
                  data-delay={200 + i * 100}
                >
                  {t}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              <MagneticButton href="#projects">
                <span className="btn-neon-hover inline-flex items-center gap-2 bg-[#ccff00] text-black px-7 py-3.5 rounded-full font-bold text-sm shadow-[0_0_30px_rgba(204,255,0,0.3)]">
                  <span>View Projects</span>
                  <i className="fas fa-arrow-right" />
                </span>
              </MagneticButton>
              <MagneticButton href="#contact">
                <span className="glass glass-hover inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-medium text-[#ebebeb]">
                  Contact Me
                </span>
              </MagneticButton>
            </div>
          </div>

          {/* Right col — animated code mockup */}
          <div className="lg:col-span-5 animate-on-scroll animate-right relative">
            <TiltCard>
              <HeroCode />
            </TiltCard>

            {/* Floating cards — hidden on very small screens to prevent overflow */}
            <div className="absolute -top-4 -left-4 glass rounded-2xl px-4 py-2.5 hidden sm:flex items-center gap-2 animate-[float_6s_ease-in-out_infinite] shadow-lg">
              <i className="fab fa-python text-[#ccff00] text-lg" />
              <span className="text-xs font-semibold">Python</span>
            </div>
            <div className="absolute top-1/2 -right-4 glass rounded-2xl px-4 py-2.5 hidden sm:flex items-center gap-2 animate-[float_6s_ease-in-out_2s_infinite] shadow-lg">
              <i className="fas fa-brain text-[#10b981] text-lg" />
              <span className="text-xs font-semibold">AI/ML</span>
            </div>
            <div className="absolute -bottom-4 left-8 bg-[#ccff00] text-black rounded-2xl px-4 py-2.5 hidden sm:flex items-center gap-2 animate-[float_6s_ease-in-out_4s_infinite] shadow-lg font-bold">
              <i className="fas fa-robot text-lg" />
              <span className="text-xs">Robotics</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

function TechMarquee() {
  return (
    <div className="py-8 overflow-hidden border-y border-[rgba(255,255,255,0.05)]">
      <div className="marquee-track">
        {[...marqueeItems, ...marqueeItems].map((item, i) => (
          <span
            key={i}
            className="flex items-center gap-3 px-8 shrink-0 text-sm font-[family-name:var(--font-jetbrains-mono)] uppercase tracking-wider text-[rgba(235,235,235,0.2)] hover:text-[#ccff00] transition-colors duration-300 cursor-default select-none"
          >
            <span className="w-1 h-1 rounded-full bg-[rgba(204,255,0,0.3)]" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function About() {
  return (
    <section id="about" className="py-16 sm:py-24 lg:py-32">
      <div className="max-w-[1400px] mx-auto px-6">
        <SectionLabel num="01" tag="ABOUT ME" />
        <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold tracking-[-0.04em] mb-10 sm:mb-16 animate-on-scroll">
          The person behind <span className="text-[#ccff00]">the code</span>
        </h2>

        <div className="grid lg:grid-cols-5 gap-12">
          {/* Image col */}
          <div className="lg:col-span-2 animate-on-scroll">
            <TiltCard>
              <GlowCard className="glass rounded-2xl sm:rounded-[2.5rem] aspect-[4/5] flex items-center justify-center mb-6 overflow-hidden">
                <Image
                  src="/Jatin_Baga.jpeg"
                  alt="Jatin Verma"
                  width={800}
                  height={1000}
                  className="h-full w-full object-cover"
                  unoptimized
                />
              </GlowCard>
            </TiltCard>
            <div className="space-y-3">
              {[
                ["fas fa-map-marker-alt", "Gurugram, Haryana, India"],
                ["fas fa-graduation-cap", "Software Professional"],
                ["fas fa-tree", "Nature Lover"],
              ].map(([ic, text], i) => (
                <div key={text} className="glass rounded-xl px-4 py-3 flex items-center gap-3 text-sm text-[rgba(235,235,235,0.6)] animate-on-scroll" data-delay={i * 80}>
                  <i className={`${ic} text-[#ccff00] w-5 text-center`} />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            {[
              ["fas fa-tree", "Nature"], ["fas fa-robot", "IT Freelance"], ["fas fa-brain", "AI/ML/Python/Django"],
              ["fas fa-flask", "Experiments"], ["fas fa-star", "Manifestation"], ["fas fa-puzzle-piece", "Problem Solving"],
            ].map(([ic, label], i) => (
              <span key={label} className="glass glass-hover rounded-full px-4 py-2 text-xs font-medium text-[rgba(235,235,235,0.6)] flex items-center gap-2 cursor-default transition-all duration-300 hover:text-[#ccff00] hover:shadow-[0_0_15px_rgba(204,255,0,0.1)] animate-on-scroll w-full" data-delay={i * 60}>
                <i className={`${ic} text-[#ccff00] text-[10px]`} />
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Projects() {
  const [filter, setFilter] = useState("all");
  const [visibleProjects, setVisibleProjects] = useState(projects);
  const filters = [
    { value: "all", label: "All" },
    { value: "python", label: "Python" },
    { value: "front-end", label: "Front-End" },
  ];

  const normalizeValue = useCallback((value: string) => String(value).trim().toLowerCase().replace(/[\s_-]+/g, "-"), []);

  const getFilteredProjects = useCallback((currentFilter: string) => {
    const normalizedFilter = normalizeValue(currentFilter);
    const sourceProjects = projects;

    if (normalizedFilter === "all") {
      return sourceProjects;
    }

    const filtered = sourceProjects.filter((project) => {
      const projectCat = String(project.cat).trim().toLowerCase().replace(/[\s_-]+/g, "-");
      return projectCat === normalizedFilter;
    });

    return filtered;
  }, [normalizeValue]);

  useEffect(() => {
    setVisibleProjects(getFilteredProjects(filter));
  }, [filter, getFilteredProjects]);

  return (
    <section id="projects" className="py-16 sm:py-24 lg:py-32">
      <div className="max-w-[1400px] mx-auto px-6">
        <SectionLabel num="02" tag="PROJECTS" />
        <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold tracking-[-0.04em] mb-10 animate-on-scroll">
          Ideas turned into <span className="text-[#ccff00]">reality</span>
        </h2>

        <div className="flex flex-wrap gap-2 mb-12 animate-on-scroll">
          {filters.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setFilter(f.value)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer ${
                normalizeValue(filter) === f.value ? "bg-[#ccff00] text-black font-bold shadow-[0_0_20px_rgba(204,255,0,0.3)]" : "glass text-[rgba(235,235,235,0.6)] hover:text-[#ebebeb]"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {visibleProjects.map((p, i) => (
            <TiltCard key={p.title}>
              <GlowCard className="glass rounded-2xl sm:rounded-[2.5rem] p-6 flex flex-col transition-all duration-300 hover:border-[rgba(204,255,0,0.4)] animate-on-scroll h-full overflow-hidden" data-delay={i * 80}>
                <div className="flex items-start justify-between mb-5">
                  <div className="w-11 h-11 rounded-xl bg-[rgba(204,255,0,0.15)] flex items-center justify-center">
                    <i className={`${p.icon} text-[#ccff00]`} />
                  </div>
                  <div className="flex gap-2">
                    <a href="#" className="w-8 h-8 rounded-lg border border-[rgba(255,255,255,0.1)] flex items-center justify-center text-[rgba(235,235,235,0.3)] hover:text-[#ccff00] hover:border-[rgba(204,255,0,0.4)] transition-colors text-sm"><i className="fab fa-github" /></a>
                    {/* {p.hasDemo && <a href="#" className="w-8 h-8 rounded-lg border border-[rgba(255,255,255,0.1)] flex items-center justify-center text-[rgba(235,235,235,0.3)] hover:text-[#ccff00] hover:border-[rgba(204,255,0,0.4)] transition-colors text-sm"><i className="fas fa-external-link-alt" /></a>} */}
                  </div>
                </div>
                <h3 className="text-base font-bold mb-2">{p.title}</h3>
                <p className="text-[rgba(235,235,235,0.6)] text-sm leading-relaxed mb-4 flex-1">{p.desc}</p>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {p.tech.map((t) => (
                    <span key={t} className="px-2.5 py-1 rounded-full border border-[rgba(16,185,129,0.2)] bg-[rgba(16,185,129,0.05)] text-[10px] font-[family-name:var(--font-jetbrains-mono)] text-[#10b981]">{t}</span>
                  ))}
                </div>
                <div className="text-xs text-[rgba(235,235,235,0.3)] flex items-center gap-1.5">
                  <i className="fas fa-user text-[#ccff00] text-[10px]" />{p.role}
                </div>
              </GlowCard>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
}

function Skills() {
  return (
    <section id="skills" className="py-16 sm:py-24 lg:py-32">
      <div className="max-w-[1400px] mx-auto px-6">
        <SectionLabel num="03" tag="SKILLS & TECHNOLOGIES" />
        <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold tracking-[-0.04em] mb-10 sm:mb-16 animate-on-scroll">
          Tools I use to build <span className="text-[#ccff00]">the future</span>
        </h2>

        <div className="grid md:grid-cols-1 gap-5">
          {skillCategories.map((cat, ci) => (
            <TiltCard key={cat.title}>
              <GlowCard className="glass glass-hover rounded-2xl sm:rounded-[2.5rem] p-6 animate-on-scroll h-full overflow-hidden" data-delay={ci * 100}>
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[rgba(255,255,255,0.1)]">
                  <i className={`${cat.icon} text-[#ccff00]`} />
                  <h3 className="text-sm font-bold">{cat.title}</h3>
                </div>
                <div className="space-y-4">
                  {cat.skills.map((sk) => (
                    <div key={sk.name} className="flex items-center gap-3 group">
                      <div className="w-8 h-8 rounded-lg bg-[rgba(204,255,0,0.15)] flex items-center justify-center shrink-0 transition-all duration-300 group-hover:bg-[rgba(204,255,0,0.25)] group-hover:shadow-[0_0_12px_rgba(204,255,0,0.15)]">
                        <i className={`${sk.icon} text-[#ccff00] text-sm`} />
                      </div>
                      <span className="text-sm w-24 shrink-0 transition-colors duration-300 group-hover:text-[#ccff00]">{sk.name}</span>
                      <div className="flex-1 h-1.5 bg-black/50 rounded-full overflow-hidden">
                        <div className="skill-bar-el h-full bg-gradient-to-r from-[#ccff00] to-[#10b981] rounded-full" data-level={sk.level} style={{ width: 0 }} />
                      </div>
                      {sk.primary && (
                        <span className="px-2 py-0.5 bg-[#ccff00] text-black rounded-full text-[9px] font-bold uppercase tracking-wider shrink-0">Primary</span>
                      )}
                    </div>
                  ))}
                </div>
              </GlowCard>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
}

function Resume() {
  const education = [
    { title: "Bachelor of Technology / Engineering", inst: "Information Technology", period: "2001-2005", desc: "software development. Active in technical clubs, events, and projects. Microsoft Imagine Cup South Zone Finalist in 2002-03." },
  ];
  const focus = [
    { title: "Python Development", inst: "Core Expertise", desc: "Applications, automation, web backends, data tools. Python is the primary weapon." },
    { title: "AI & Machine Learning", inst: "Active Exploration", desc: "ML models, NLP, computer vision, data science \u2014 intelligent systems for real problems." },
  ];

  return (
    <section id="resume" className="py-16 sm:py-24 lg:py-32">
      <div className="max-w-[1400px] mx-auto px-6">
        <SectionLabel num="07" tag="RESUME & EXPERIENCE" />
        <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold tracking-[-0.04em] mb-10 sm:mb-16 animate-on-scroll">
          A snapshot of my <span className="text-[#ccff00]">professional path</span>
        </h2>

        <div className="grid lg:grid-cols-2 gap-12">
          <div className="animate-on-scroll">
            <h3 className="flex items-center gap-2 text-[#ccff00] font-bold text-lg mb-6"><i className="fas fa-graduation-cap" /> Education</h3>
            <div className="space-y-4">
              {education.map((e, i) => (
                <GlowCard key={i} className="glass glass-hover rounded-2xl p-5 transition-all hover:translate-x-1 overflow-hidden">
                  <h4 className="font-bold mb-1">{e.title}</h4>
                  <span className="text-sm text-[#ccff00] block mb-1">{e.inst}</span>
                  <span className="font-[family-name:var(--font-jetbrains-mono)] text-[10px] tracking-wider uppercase text-[rgba(235,235,235,0.3)] block mb-2">{e.period}</span>
                  <p className="text-sm text-[rgba(235,235,235,0.6)] leading-relaxed">{e.desc}</p>
                </GlowCard>
              ))}
            </div>
          </div>
          <div className="animate-on-scroll animate-right">
            <h3 className="flex items-center gap-2 text-[#ccff00] font-bold text-lg mb-6"><i className="fas fa-briefcase" /> Focus &amp; Direction</h3>
            <div className="space-y-4">
              {focus.map((f, i) => (
                <GlowCard key={i} className="glass glass-hover rounded-2xl p-5 transition-all hover:translate-x-1 overflow-hidden">
                  <h4 className="font-bold mb-1">{f.title}</h4>
                  <span className="text-sm text-[#ccff00] block mb-2">{f.inst}</span>
                  <p className="text-sm text-[rgba(235,235,235,0.6)] leading-relaxed">{f.desc}</p>
                </GlowCard>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center mt-12 animate-on-scroll">
          <MagneticButton href="#">
            <span className="btn-neon-hover inline-flex items-center gap-2 bg-[#ccff00] text-black px-8 py-4 rounded-full font-bold shadow-[0_0_30px_rgba(204,255,0,0.3)]">
              <i className="fas fa-download" /><span>Download Full Resume</span>
            </span>
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}

function Methodology() {
  const steps = [
    { num: "01", title: "Research & Understand", desc: "Every project starts with deep research. I study the problem, understand user pain points, and identify what truly needs solving before writing a single line of code." },
    { num: "02", title: "Experiment & Build", desc: "With clarity on the problem, I prototype rapidly — testing ideas, breaking things, and iterating until the solution feels right. Python and AI/ML are my tools of choice." },
    { num: "03", title: "Refine & Deploy", desc: "A working prototype becomes a polished product through rigorous testing, code optimization, and user-focused refinements. The goal is always real-world impact." },
  ];

  return (
    <section className="relative">
      <div className="bg-[#e5e5e5] text-black rounded-t-[2rem] sm:rounded-t-[4rem] relative z-10 py-16 sm:py-24 lg:py-32">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left — Steps */}
            <div className="animate-on-scroll">
              <span className="font-[family-name:var(--font-jetbrains-mono)] text-[10px] tracking-[0.2em] uppercase text-black/50 block mb-4">
                MY METHODOLOGY
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold tracking-[-0.04em] mb-8 sm:mb-12 text-black">
                How I approach <span className="italic font-light">every project</span>
              </h2>

              <div className="space-y-8">
                {steps.map((s, i) => (
                  <div key={s.num} className="flex gap-6 items-start group animate-on-scroll" data-delay={i * 120}>
                    <div className="w-14 h-14 rounded-full border-2 border-black/20 flex items-center justify-center shrink-0 transition-all duration-300 group-hover:border-[#ccff00] group-hover:bg-[#ccff00] group-hover:shadow-[0_0_20px_rgba(204,255,0,0.3)]">
                      <span className="font-[family-name:var(--font-jetbrains-mono)] text-sm font-bold transition-colors duration-300 group-hover:text-black">{s.num}</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold mb-1">{s.title}</h3>
                      <p className="text-black/60 text-sm leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Portrait + testimonial */}
            <div className="animate-on-scroll animate-right relative flex justify-center">
              <div className="relative">
                <div className="w-64 h-64 lg:w-80 lg:h-80 rounded-full bg-black/10 flex items-center justify-center">
                  <i className="fas fa-user text-6xl text-black/20" />
                </div>
                <div className="absolute -bottom-6 -left-2 right-2 sm:-left-6 sm:right-6 bg-white/80 backdrop-blur-2xl border border-black/10 rounded-xl sm:rounded-[1.5rem] p-4 sm:p-5 shadow-xl">
                  <div className="flex gap-3 items-start">
                    <i className="fas fa-quote-left text-[#ccff00] text-lg mt-0.5" />
                    <div>
                      <p className="text-sm text-black/70 leading-relaxed italic">
                        &ldquo;Discipline paired with passion creates extraordinary results. I believe in building technology that truly matters.&rdquo;
                      </p>
                      <p className="text-xs font-bold mt-2 text-black">— Unknown.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); setSubmitted(true); setTimeout(() => setSubmitted(false), 3000); };

  return (
    <section id="contact" className="py-16 sm:py-24 lg:py-32">
      <div className="max-w-[1400px] mx-auto px-6">
        <SectionLabel num="04" tag="GET IN TOUCH" />
        <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold tracking-[-0.04em] mb-10 sm:mb-16 animate-on-scroll">
          Let&apos;s build something <span className="text-[#ccff00]">meaningful</span>
        </h2>

        <div className="grid lg:grid-cols-2 gap-12">
          <div className="animate-on-scroll">
            <h3 className="text-2xl font-bold mb-4">Let&apos;s Connect</h3>
            <p className="text-[rgba(235,235,235,0.6)] leading-relaxed mb-8">Whether you have a project idea, a collaboration proposal, or just want to say hello — I&apos;m always open to new opportunities.</p>

            <div className="space-y-3 mb-8">
              {[
                { href: "tel:+91 9176652846", icon: "fas fa-phone", label: "PHONE", value: "+91 9176652846" },
                { href: "https://www.linkedin.com/in/javerma", icon: "fab fa-linkedin-in", label: "LINKEDIN", value: "Jatin Verma", ext: true },
                { href: "https://github.com/mailjatinverma", icon: "fab fa-github", label: "GITHUB", value: "Jatin Verma", ext: true },
                { href: "#", icon: "fas fa-map-marker-alt", label: "LOCATION", value: "Gurugram, Haryana, India" },
              ].map((c) => (
                <GlowCard key={c.label} className="glass glass-hover rounded-2xl p-4 transition-all hover:translate-x-1 overflow-hidden">
                  <a href={c.href} {...(c.ext ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[rgba(204,255,0,0.15)] flex items-center justify-center shrink-0">
                      <i className={`${c.icon} text-[#ccff00]`} />
                    </div>
                    <div>
                      <span className="font-[family-name:var(--font-jetbrains-mono)] text-[9px] tracking-[0.2em] uppercase text-[rgba(235,235,235,0.3)] block">{c.label}</span>
                      <span className="text-sm font-medium">{c.value}</span>
                    </div>
                  </a>
                </GlowCard>
              ))}
            </div>

            <div className="flex gap-3">
              {[
                { href: "https://github.com/mailjatinverma", icon: "fab fa-github", ext: true },
                { href: "https://www.linkedin.com/in/javerma", icon: "fab fa-linkedin-in", ext: true },
                { href: "#", icon: "fab fa-instagram" },
                { href: "#", icon: "fab fa-x-twitter" },
                { href: "tel:+919176652846", icon: "fas fa-phone" },
              ].map((s, i) => (
                <a key={i} href={s.href} {...(s.ext ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="w-11 h-11 rounded-full border border-[rgba(255,255,255,0.1)] flex items-center justify-center text-[rgba(235,235,235,0.6)] hover:text-black hover:bg-[#ccff00] hover:border-[#ccff00] transition-all duration-300 hover:scale-110 hover:shadow-[0_0_20px_rgba(204,255,0,0.3)]" aria-label="social">
                  <i className={s.icon} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="relative bg-black overflow-hidden py-12 sm:py-24">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <span className="text-[4rem] sm:text-[7rem] lg:text-[10rem] font-bold text-white opacity-[0.05] tracking-tighter leading-none">
          SUPER
        </span>
      </div>

      <div className="relative max-w-[1400px] mx-auto px-6">
        <div className="text-center mb-12 sm:mb-20 animate-on-scroll">
          <p className="text-[rgba(235,235,235,0.6)] text-lg mb-8">Ready to collaborate?</p>
          <MagneticButton href="#contact">
            <span className="btn-neon-hover inline-flex items-center gap-2 sm:gap-3 bg-[#ccff00] text-black px-8 py-4 sm:px-12 sm:py-6 rounded-full text-base sm:text-xl font-bold shadow-[0_0_40px_rgba(204,255,0,0.3)]">
              <span>Let&apos;s Work Together</span>
              <i className="fas fa-arrow-right" />
            </span>
          </MagneticButton>
        </div>

        <div className="h-px bg-[rgba(255,255,255,0.1)] mb-12" />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-[#ccff00] flex items-center justify-center text-black text-sm font-bold">
                JV
              </div>
              <span className="font-medium">JATIN VERMA</span>
            </div>
            <div className="space-y-2">
              {["Privacy Policy", "Terms of Use", "Disclaimer"].map((l) => (
                <a key={l} href="#" className="block text-sm text-[rgba(235,235,235,0.3)] hover:text-[rgba(235,235,235,0.6)] transition-colors">{l}</a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-[family-name:var(--font-jetbrains-mono)] text-[10px] tracking-[0.2em] uppercase text-[rgba(235,235,235,0.3)] mb-4">
              NAVIGATION
            </h4>
            <div className="space-y-2">
              {["About", "Projects", "Skills", "Contact"].map((l) => (
                <a key={l} href={`#${l.toLowerCase()}`} className="block text-sm text-[rgba(235,235,235,0.6)] hover:text-[#ccff00] transition-colors">{l}</a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-[family-name:var(--font-jetbrains-mono)] text-[10px] tracking-[0.2em] uppercase text-[rgba(235,235,235,0.3)] mb-4">
              CONNECT
            </h4>
            <div className="flex gap-3 flex-wrap">
              {[
                { href: "https://github.com/mailjatinverma", icon: "fab fa-github" },
                { href: "https://www.linkedin.com/in/javerma", icon: "fab fa-linkedin-in" },
                { href: "#", icon: "fab fa-instagram" },
                { href: "#", icon: "fab fa-x-twitter" },
              ].map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-[rgba(255,255,255,0.1)] flex items-center justify-center text-[rgba(235,235,235,0.3)] hover:text-[#ccff00] hover:border-[rgba(204,255,0,0.4)] hover:shadow-[0_0_15px_rgba(204,255,0,0.15)] transition-all duration-300"
                  aria-label="social"
                >
                  <i className={s.icon} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center font-[family-name:var(--font-jetbrains-mono)] text-[10px] tracking-[0.15em] uppercase text-[rgba(235,235,235,0.3)]">
          &copy; 2026 JATIN VERMA. ALL RIGHTS RESERVED.
        </div>
      </div>
    </footer>
  );
}

function BackToTop() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className={`fixed bottom-8 right-8 z-50 w-12 h-12 rounded-xl bg-[#ccff00] text-black flex items-center justify-center shadow-[0_0_30px_rgba(204,255,0,0.3)] hover:scale-110 hover:shadow-[0_0_40px_rgba(204,255,0,0.5)] transition-all duration-300 cursor-pointer ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`} aria-label="Back to top">
      <i className="fas fa-chevron-up" />
    </button>
  );
}

/* ============================================
   PARALLAX GLOW SPHERES
   ============================================ */

function ParallaxSpheres({ mousePos }: { mousePos: { x: number; y: number } }) {
  const offsetX = ((mousePos.x / (typeof window !== "undefined" ? window.innerWidth : 1)) - 0.5) * 2;
  const offsetY = ((mousePos.y / (typeof window !== "undefined" ? window.innerHeight : 1)) - 0.5) * 2;

  return (
    <>
      <div className="glow-sphere glow-sphere-1" style={{ transform: `translate(${offsetX * 30}px, ${offsetY * 20}px)` }} />
      <div className="glow-sphere glow-sphere-2" style={{ transform: `translate(${offsetX * -20}px, ${offsetY * -15}px)` }} />
      <div className="glow-sphere glow-sphere-3" style={{ transform: `translate(${offsetX * 15}px, ${offsetY * -25}px)` }} />
    </>
  );
}

/* ============================================
   MAIN PAGE
   ============================================ */

export default function Home() {
  useScrollAnimation();
  useSkillBars();
  const mousePos = useMousePosition();
  const scrollProgress = useScrollProgress();

  return (
    <>
      <ScrollProgress progress={scrollProgress} />
      <CursorGlow mousePos={mousePos} />
      <div className="noise-overlay" />
      <ParallaxSpheres mousePos={mousePos} />

      <Preloader />

      <div className="floating-shell">
        <Navbar />
        <Hero />
        <TechMarquee />
        <About />
        <SectionDivider />
        <Projects />
        <SectionDivider />
        <Skills />
        <SectionDivider />
        <Methodology />
        <Contact />
        <Footer />
      </div>

      <BackToTop />
    </>
  );
}
