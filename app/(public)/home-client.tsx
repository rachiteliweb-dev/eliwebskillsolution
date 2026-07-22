"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef, useCallback } from "react";
import { useTheme } from "next-themes";
import { Footer } from "@/components/footer";
import {
  ArrowRight, BookOpen, Code2, Palette, BarChart3, Megaphone,
  Database, ShieldCheck, Star, ChevronDown, CheckCircle2, Users,
  GraduationCap, Play, Zap, Trophy, Clock, Globe, Eye,
  ChevronRight, Video,
} from "lucide-react";

/* ─── Icon map (for DB-driven icon keys) ────────────────────────────────── */
const ICON_MAP: Record<string, React.ElementType> = {
  BookOpen, Code2, Palette, BarChart3, Megaphone, Database, ShieldCheck,
  Users, GraduationCap, Zap, Trophy, Clock, Globe, Eye, Video, Star,
};

/* ─── Track colour map ──────────────────────────────────────────────────── */
const TRACK_COLORS: Record<string, {
  badgeBg: string; iconBg: string; iconColor: string; accent: string; linkColor: string;
}> = {
  Megaphone: { badgeBg: "bg-orange-100 text-orange-600 border-orange-200", iconBg: "bg-orange-50", iconColor: "text-orange-500", accent: "border-l-orange-400", linkColor: "text-orange-500" },
  Palette:   { badgeBg: "bg-violet-100 text-violet-600 border-violet-200",  iconBg: "bg-violet-50",  iconColor: "text-violet-500",  accent: "border-l-violet-400",  linkColor: "text-violet-500" },
  Code2:     { badgeBg: "bg-blue-100 text-blue-600 border-blue-200",         iconBg: "bg-blue-50",    iconColor: "text-blue-500",    accent: "border-l-blue-400",    linkColor: "text-blue-500" },
  Globe:     { badgeBg: "bg-emerald-100 text-emerald-600 border-emerald-200",iconBg: "bg-emerald-50", iconColor: "text-emerald-500", accent: "border-l-emerald-400", linkColor: "text-emerald-500" },
  BarChart3: { badgeBg: "bg-indigo-100 text-indigo-600 border-indigo-200",  iconBg: "bg-indigo-50",  iconColor: "text-indigo-500",  accent: "border-l-indigo-400",  linkColor: "text-indigo-500" },
  Database:  { badgeBg: "bg-rose-100 text-rose-600 border-rose-200",         iconBg: "bg-rose-50",    iconColor: "text-rose-500",    accent: "border-l-rose-400",    linkColor: "text-rose-500" },
};
const DEFAULT_TRACK_COLOR = { badgeBg: "bg-gray-100 text-gray-600 border-gray-200", iconBg: "bg-gray-50", iconColor: "text-gray-500", accent: "border-l-gray-400", linkColor: "text-gray-500" };

/* ─── Particle Network Canvas ──────────────────────────────────────────── */
function ParticleCanvas({ className }: { className?: string }) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  const init = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0, h = 0;
    const resize = () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);

    const count = Math.min(Math.floor((w * h) / 10000), 120);
    const particles: { x: number; y: number; vx: number; vy: number; r: number }[] = [];
    for (let i = 0; i < count; i++) {
      particles.push({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3, r: Math.random() * 1.5 + 0.5 });
    }

    const maxDist = 150;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
      }
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x, dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.15;
            ctx.strokeStyle = isDark ? `rgba(139, 92, 246, ${alpha})` : `rgba(139, 92, 246, ${alpha * 2})`;
            ctx.lineWidth = 0.8; ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y); ctx.lineTo(particles[j].x, particles[j].y); ctx.stroke();
          }
        }
      }
      for (const p of particles) {
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = isDark ? `rgba(56, 189, 248, 0.4)` : `rgba(14, 165, 233, 0.5)`; ctx.fill();
      }
      animRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animRef.current); window.removeEventListener("resize", resize); };
  }, []);

  useEffect(() => { const cleanup = init(); return cleanup; }, [init]);
  return <canvas ref={canvasRef} className={className} />;
}

/* ─── Scroll Reveal Hook ───────────────────────────────────────────────── */
function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll("[data-reveal]");
    if (!els.length) return;
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); } }); },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

/* ─── Tech Ticker items (static, not CMS) ─────────────────────────────── */
const TECH_ITEMS = [
  { name: "React",     iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
  { name: "Next.js",   iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg", invert: true },
  { name: "Node.js",   iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
  { name: "Python",    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
  { name: "Figma",     iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg" },
  { name: "Tailwind",  iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg" },
  { name: "WordPress", iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/wordpress/wordpress-plain.svg" },
  { name: "Shopify",   iconUrl: "https://cdn.worldvectorlogo.com/logos/shopify.svg" },
  { name: "Google Ads",iconUrl: "https://cdn.worldvectorlogo.com/logos/google-ads-2.svg" },
];
const TECH_STACK = [
  { name: "React", icon: "⚛️" }, { name: "UI/UX", icon: "🎨" }, { name: "Python", icon: "🐍" },
  { name: "Node.js", icon: "🟢" }, { name: "Next.js", icon: "▲" }, { name: "TypeScript", icon: "📘" },
  { name: "Tailwind", icon: "🌊" }, { name: "Marketing", icon: "📈" },
];

/* ─── Animated Hero Visual ─────────────────────────────────────────────── */
function AnimatedHeroVisual() {
  return (
    <div className="relative w-full max-w-2xl mx-auto mt-8 lg:mt-0 flex flex-col items-center gap-6 sm:gap-8">
      <div className="relative w-full">
        <div className="relative z-10 w-full aspect-video rounded-3xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 backdrop-blur-sm shadow-[0_0_50px_rgba(139,92,246,0.2)] overflow-hidden">
          <video autoPlay loop muted playsInline className="w-full h-full object-cover">
            <source src="https://video-previews.elements.envatousercontent.com/h264-video-previews/22f452d2-3653-4ac3-9efd-263fcdc98ba1/20188441.mp4" type="video/mp4" />
          </video>
        </div>
      </div>
      <div className="w-full overflow-hidden z-20" style={{ maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}>
        <div className="flex items-center w-max gap-4 sm:gap-6 marquee-track">
          {[...TECH_STACK, ...TECH_STACK].map((tech, idx) => (
            <div key={idx} className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-black/10 dark:bg-white/10 backdrop-blur-md border border-black/20 dark:border-white/20 font-bold shadow-xl flex items-center gap-2 hover:bg-white/20 transition-colors cursor-default">
              <span className="text-lg sm:text-xl leading-none">{tech.icon}</span>
              <span className="text-sm sm:text-base whitespace-nowrap">{tech.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── FAQ Accordion Item ─────────────────────────────────────────────── */
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-black/10 dark:border-white/10 rounded-xl overflow-hidden bg-black/5 dark:bg-white/5 backdrop-blur-md">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-5 py-4 text-left font-semibold text-[var(--foreground)] hover:bg-black/10 dark:bg-white/10 transition-colors text-sm">
        <span>{q}</span>
        <ChevronDown className={`h-4 w-4 text-cyan-500 shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>
      <div className={`accordion-content ${open ? "open" : ""}`}>
        <div className="accordion-inner px-5 pb-4">
          <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">{a}</p>
        </div>
      </div>
    </div>
  );
}

/* ─── Types ──────────────────────────────────────────────────────────── */
interface Track       { id: string; iconKey: string; title: string; desc: string; badge: string; rating: string; students: string; lessons: string; }
interface WhyItem     { id: string; iconKey: string; title: string; desc: string; }
interface StatItem    { id: string; value: string; label: string; iconKey: string; }
interface StepItem    { id: string; number: string; title: string; desc: string; }
interface Testimonial { id: string; name: string; role: string; avatar: string; rating: number; text: string; }
interface FaqItem2    { id: string; q: string; a: string; }

interface Feature { id: string; iconKey: string; label: string; sub: string; }

interface HomeData {
  heroEyebrow: string; heroHeadline1: string; heroHeadline2: string; heroHeadline3: string;
  heroSubtext: string; heroCta1Label: string; heroCta2Label: string; heroSocialProofCount: string;
  tracksHeadline: string; tracksSubtext: string; features: Feature[]; tracks: Track[];
  whyHeadline: string; whySubtext: string; whyItems: WhyItem[];
  stats: StatItem[]; stepsHeadline: string; steps: StepItem[];
  testimonialsHeadline: string; testimonialsSubtext: string; testimonials: Testimonial[];
  faqHeadline: string; faqs: FaqItem2[];
  ctaHeadline: string; ctaSubtext: string; ctaBtn1Label: string; ctaBtn2Label: string;
}

/* ─── Page Client Component ──────────────────────────────────────────── */
export default function HomePageClient({ data }: { data: HomeData }) {
  useScrollReveal();
  const tickerItems = [...TECH_ITEMS, ...TECH_ITEMS];
  const iconColors = ["bg-blue-500", "bg-cyan-500", "bg-indigo-500", "bg-emerald-500"];
  const stepColors = ["bg-blue-500", "bg-indigo-500", "bg-blue-600"];

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] relative overflow-hidden font-body selection:bg-blue-500/30 selection:text-[var(--foreground)]">
      <ParticleCanvas className="fixed inset-0 z-0 opacity-60" />
      <div className="relative z-10">

        {/* ══════════════ 1. TWO-COLUMN HERO ══════════════ */}
        <section className="pt-28 pb-16 sm:pt-36 sm:pb-24 lg:pt-40 lg:pb-32 section-shell">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            <div className="lg:col-span-6 space-y-8 relative z-10" data-reveal>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 backdrop-blur-md shadow-lg shadow-purple-500/5">
                <Zap className="h-3.5 w-3.5 text-cyan-500" />
                <span className="text-xs font-bold tracking-widest uppercase text-[var(--muted-foreground)]">{data.heroEyebrow}</span>
              </div>
              <h1 className="text-5xl sm:text-6xl lg:text-[4.5rem] font-extrabold tracking-tight leading-[1.05] font-heading">
                {data.heroHeadline1}<br/>
                <span className="text-gradient font-display">{data.heroHeadline2}</span><br/>
                {data.heroHeadline3}
              </h1>
              <p className="text-lg text-[var(--muted-foreground)] leading-relaxed max-w-xl">{data.heroSubtext}</p>
              <div className="flex flex-wrap gap-4 items-center">
                <Link href="/courses" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-brand-gradient text-[var(--primary-foreground)] font-bold text-sm shadow-glow hover:scale-105 transition-all duration-300">
                  {data.heroCta1Label} <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/register" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border border-black/20 dark:border-white/20 bg-black/5 dark:bg-white/5 text-[var(--foreground)] font-bold text-sm hover:bg-black/10 dark:bg-white/10 hover:border-black/40 dark:border-white/40 transition-all duration-300 backdrop-blur-md">
                  {data.heroCta2Label}
                </Link>
              </div>
              <div className="pt-4 flex items-center gap-4">
                <div className="flex -space-x-3">
                  {[1,2,3,4].map(i => <Image key={i} src={`https://i.pravatar.cc/100?img=${i}`} alt="Student" width={36} height={36} className="rounded-full border-2 border-[var(--background)]" unoptimized />)}
                </div>
                <span className="text-sm font-medium text-[var(--muted-foreground)]">
                  <span className="text-[var(--foreground)] font-bold">{data.heroSocialProofCount}</span> students learning right now
                </span>
              </div>
            </div>
            <div className="lg:col-span-6 relative z-10" data-reveal style={{ "--reveal-delay": "200ms" } as React.CSSProperties}>
              <AnimatedHeroVisual />
            </div>
          </div>
        </section>

        {/* ══════════════ 2. TECH TICKER ══════════════ */}
        <section className="pb-20 section-shell">
          <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 backdrop-blur-lg p-6 lg:p-8 overflow-hidden shadow-2xl shadow-purple-500/5">
            <p className="text-center text-xs font-bold tracking-widest uppercase text-cyan-500 mb-8">Technologies &amp; Tools We Cover</p>
            <div className="tech-ticker">
              <div className="tech-track" style={{ gap: '24px' }}>
                {tickerItems.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 px-5 py-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 backdrop-blur-sm transition-transform hover:scale-105 hover:bg-black/10 dark:bg-white/10 hover:border-blue-500/50 cursor-default">
                    <div className="relative w-6 h-6 flex-shrink-0 flex items-center justify-center">
                      {item.invert ? <Image src={item.iconUrl} alt={item.name} fill className="object-contain invert" unoptimized /> : <Image src={item.iconUrl} alt={item.name} fill className="object-contain" unoptimized />}
                    </div>
                    <span className="text-sm font-semibold text-[var(--foreground)]">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════ 3. SKILL TRACKS ══════════════ */}
        <div className="relative py-24 w-full bg-[#eef4fb] dark:bg-[#111827] overflow-hidden">
          <section className="relative z-10 section-shell">
            <div className="text-center mb-8" data-reveal>
              <p className="text-cyan-500 font-bold tracking-widest text-xs uppercase mb-3">What You Can Learn</p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0f172a] dark:text-white mb-4 font-heading">
                {data.tracksHeadline.includes("Dominate")
                  ? <>{data.tracksHeadline.split("Dominate")[0]}<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-500">Dominate Online</span></>
                  : data.tracksHeadline}
              </h2>
              <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-base">{data.tracksSubtext}</p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 mb-14 mt-10" data-reveal>
              {(data.features || []).map((feat, idx) => {
                const IconComp = ICON_MAP[feat.iconKey] ?? BookOpen;
                // Cycle through Violet, Emerald, Orange, Blue for rich aesthetic color palettes
                const colors = [
                  { bg: "bg-violet-100 dark:bg-violet-900/30", text: "text-violet-500" },
                  { bg: "bg-emerald-100 dark:bg-emerald-900/30", text: "text-emerald-500" },
                  { bg: "bg-orange-100 dark:bg-orange-900/30", text: "text-orange-500" },
                  { bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-500" }
                ];
                const color = colors[idx % colors.length];
                return (
                  <div key={feat.id ?? idx} className="flex items-center gap-3 text-left">
                    <div className={`h-10 w-10 rounded-xl ${color.bg} flex items-center justify-center shadow-sm`}>
                      <IconComp className={`h-5 w-5 ${color.text}`} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#0f172a] dark:text-white">{feat.label}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">{feat.sub}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.tracks.map((track, idx) => {
                const colors = TRACK_COLORS[track.iconKey] ?? DEFAULT_TRACK_COLOR;
                const IconComp = ICON_MAP[track.iconKey] ?? BookOpen;
                return (
                  <div key={track.id ?? idx} data-reveal style={{ "--reveal-delay": `${idx * 80}ms` } as React.CSSProperties}
                    className={`group p-6 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 border-l-4 ${colors.accent} hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer relative`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className={`h-12 w-12 rounded-2xl ${colors.iconBg} dark:bg-white/10 flex items-center justify-center`}>
                        <IconComp className={`h-6 w-6 ${colors.iconColor}`} />
                      </div>
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${colors.badgeBg}`}>{track.badge}</span>
                    </div>
                    <h3 className="text-lg font-bold text-[#0f172a] dark:text-white font-heading mb-2">{track.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-5">{track.desc}</p>
                    <div className="flex items-center gap-4 mb-5 pt-4 border-t border-slate-100 dark:border-white/10">
                      <div className="flex items-center gap-1"><Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" /><span className="text-xs font-bold text-[#0f172a] dark:text-white">{track.rating}</span><span className="text-[10px] text-slate-400">Rating</span></div>
                      <div className="flex items-center gap-1"><Users className="h-3.5 w-3.5 text-slate-400" /><span className="text-xs font-bold text-[#0f172a] dark:text-white">{track.students}</span><span className="text-[10px] text-slate-400">Students</span></div>
                      <div className="flex items-center gap-1"><Video className="h-3.5 w-3.5 text-slate-400" /><span className="text-xs font-bold text-[#0f172a] dark:text-white">{track.lessons}</span><span className="text-[10px] text-slate-400">Lessons</span></div>
                    </div>
                    <div className={`flex items-center gap-2 text-sm font-bold ${colors.linkColor} group-hover:gap-3 transition-all`}>
                      Explore Courses <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="text-center mt-12" data-reveal>
              <Link href="/courses" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold text-sm shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                View All Courses <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </section>
        </div>

        {/* ══════════════ 4. WHY CHOOSE US ══════════════ */}
        <section className="py-24 section-shell">
          <div className="text-center mb-16" data-reveal>
            <p className="text-cyan-500 font-bold tracking-widest text-xs uppercase mb-3">Why Choose Us</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[var(--foreground)] font-heading mb-4">
              {data.whyHeadline.includes("EliWeb")
                ? <>{data.whyHeadline.split("EliWeb")[0]}<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-500">EliWeb Skill Solution</span></>
                : data.whyHeadline}
            </h2>
            <p className="text-[var(--muted-foreground)] max-w-xl mx-auto text-base">{data.whySubtext}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.whyItems.map((item, idx) => {
              const IconComp = ICON_MAP[item.iconKey] ?? BookOpen;
              return (
                <div key={item.id ?? idx} data-reveal style={{ "--reveal-delay": `${idx * 100}ms` } as React.CSSProperties}
                  className="group p-6 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center">
                  <div className="inline-flex h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-200/50 dark:border-white/10 items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                    <IconComp className="h-7 w-7 text-blue-500" />
                  </div>
                  <h3 className="text-base font-bold text-[var(--foreground)] mb-2 font-heading">{item.title}</h3>
                  <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ══════════════ 5. STATS ══════════════ */}
        <section className="py-16 section-shell">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {data.stats.map((stat, idx) => {
              const IconComp = ICON_MAP[stat.iconKey] ?? Users;
              return (
                <div key={stat.id ?? idx} data-reveal style={{ "--reveal-delay": `${idx * 100}ms` } as React.CSSProperties} className="flex flex-col items-center text-center group">
                  <div className={`h-12 w-12 rounded-full ${iconColors[idx % 4]} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <IconComp className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 font-heading mb-1">{stat.value}</div>
                  <div className="text-xs font-bold text-[var(--muted-foreground)] uppercase tracking-widest">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ══════════════ 6. HOW IT WORKS ══════════════ */}
        <section className="py-24 section-shell">
          <div className="text-center mb-16" data-reveal>
            <p className="text-cyan-500 font-bold tracking-widest text-xs uppercase mb-3">Simple Process</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[var(--foreground)] font-heading mb-4">
              How It <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-500">Works</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 relative items-start">
            <div className="hidden md:block absolute top-8 left-[calc(16.67%+1rem)] right-[calc(16.67%+1rem)] h-[3px] bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-500 z-0" />
            {data.steps.map((step, idx) => (
              <div key={step.id ?? idx} data-reveal style={{ "--reveal-delay": `${idx * 150}ms` } as React.CSSProperties} className="flex flex-col items-center text-center relative px-4">
                <div className={`h-16 w-16 rounded-full ${stepColors[idx % 3]} flex items-center justify-center text-white shadow-lg mb-6 relative z-10 hover:scale-110 transition-transform duration-300 border-4 border-white dark:border-[var(--background)]`}>
                  <span className="text-lg font-extrabold">{step.number}</span>
                </div>
                {idx < data.steps.length - 1 && (
                  <div className="hidden md:block absolute top-6 right-0 translate-x-1/2 z-20">
                    <ArrowRight className="h-5 w-5 text-indigo-500" />
                  </div>
                )}
                <h3 className="text-lg font-bold text-[var(--foreground)] mb-2 font-heading">{step.title}</h3>
                <p className="text-sm text-[var(--muted-foreground)] leading-relaxed max-w-[280px]">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════ 7. TESTIMONIALS + FAQ ══════════════ */}
        <div className="relative py-24 w-full bg-[#eef4fb] dark:bg-[#111827]">
          <section className="section-shell">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-3xl border border-slate-200 dark:border-white/10 overflow-hidden bg-white dark:bg-white/5">
              {/* Testimonials */}
              <div className="p-8 lg:p-10 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-white/10">
                <div className="mb-8" data-reveal>
                  <p className="text-cyan-500 font-bold tracking-widest text-xs uppercase mb-3">Student Reviews</p>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--foreground)] font-heading mb-2">
                    {data.testimonialsHeadline.includes("Say")
                      ? <>{data.testimonialsHeadline.split("Say")[0]}<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-500">Say</span></>
                      : data.testimonialsHeadline}
                  </h2>
                  <p className="text-[var(--muted-foreground)] text-sm">{data.testimonialsSubtext}</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {data.testimonials.map((t, idx) => (
                    <div key={t.id ?? idx} data-reveal style={{ "--reveal-delay": `${idx * 100}ms` } as React.CSSProperties}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 hover:shadow-lg transition-shadow flex flex-col">
                      <div className="flex gap-1 mb-3">
                        {Array.from({ length: Number(t.rating) }).map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />)}
                      </div>
                      <p className="text-xs text-[var(--foreground)] leading-relaxed mb-4 italic flex-1">&ldquo;{t.text}&rdquo;</p>
                      <div className="flex items-center gap-2 pt-3 border-t border-slate-100 dark:border-white/10">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-[10px] font-bold text-white shrink-0">{t.avatar}</div>
                        <div>
                          <div className="text-xs font-bold text-[var(--foreground)]">{t.name}</div>
                          <div className="text-[10px] text-[var(--muted-foreground)]">{t.role}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* FAQ */}
              <div className="p-8 lg:p-10">
                <div className="mb-8" data-reveal>
                  <p className="text-cyan-500 font-bold tracking-widest text-xs uppercase mb-3">Got Questions?</p>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--foreground)] font-heading mb-2">
                    Common <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-500">Questions</span>
                  </h2>
                </div>
                <div className="space-y-3" data-reveal style={{ "--reveal-delay": "100ms" } as React.CSSProperties}>
                  {data.faqs.map((faq, idx) => <FaqItem key={faq.id ?? idx} q={faq.q} a={faq.a} />)}
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* ══════════════ 8. CTA BANNER ══════════════ */}
        <section className="py-16 sm:py-24 section-shell">
          <div className="relative rounded-[2rem] overflow-hidden bg-gradient-to-r from-[#1e3a8a] via-[#4338ca] to-[#7c3aed] p-10 sm:p-16 shadow-2xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,rgba(255,255,255,0.08),transparent_60%)] pointer-events-none" />
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-purple-500/20 to-transparent pointer-events-none" />
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
              <div className="lg:col-span-3" data-reveal>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 mb-6 backdrop-blur-md">
                  <Zap className="h-3.5 w-3.5 text-cyan-300" />
                  <span className="text-xs font-bold uppercase tracking-widest text-white/80">Start Learning Today</span>
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4 font-heading leading-tight">{data.ctaHeadline}</h2>
                <p className="text-white/70 max-w-lg mb-8 text-base leading-relaxed">{data.ctaSubtext}</p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/courses" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-white text-blue-700 font-bold text-sm hover:bg-white/90 hover:scale-105 transition-all duration-300 shadow-lg">
                    {data.ctaBtn1Label} <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link href="/register" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full border-2 border-white/30 text-white font-bold text-sm hover:bg-white/10 hover:border-white/50 hover:scale-105 transition-all duration-300">
                    {data.ctaBtn2Label}
                  </Link>
                </div>
              </div>
              <div className="hidden lg:flex lg:col-span-2 items-center justify-center" data-reveal style={{ "--reveal-delay": "200ms" } as React.CSSProperties}>
                <Image src="/graduation-cap.png" alt="Graduation cap on books" width={320} height={320} className="object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500" unoptimized />
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="relative z-10 border-t border-black/10 dark:border-white/10 bg-black/40 backdrop-blur-md">
        <Footer />
      </div>
    </div>
  );
}
