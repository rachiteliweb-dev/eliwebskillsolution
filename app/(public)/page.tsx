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

/* ─── Particle Network Canvas ──────────────────────────────────────── */

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
    const resize = () => {
      // Use window innerWidth/innerHeight for fixed background
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Adjust particle count based on screen size
    const count = Math.min(Math.floor((w * h) / 10000), 120);
    const particles: { x: number; y: number; vx: number; vy: number; r: number }[] = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.5 + 0.5,
      });
    }

    const maxDist = 150;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      
      // Update positions
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;
      }
      
      // Draw lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.15;
            // Using a soft blue-purple for the lines
            ctx.strokeStyle = isDark ? `rgba(139, 92, 246, ${alpha})` : `rgba(139, 92, 246, ${alpha * 2})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      
      // Draw dots
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = isDark ? `rgba(56, 189, 248, 0.4)` : `rgba(14, 165, 233, 0.5)`;
        ctx.fill();
      }
      
      animRef.current = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  useEffect(() => {
    const cleanup = init();
    return cleanup;
  }, [init]);

  return <canvas ref={canvasRef} className={className} />;
}

/* ─── Scroll Reveal Hook ───────────────────────────────────────────── */

function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll("[data-reveal]");
    if (!els.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

/* ─── Animated Hero Visual ─────────────────────────────────────────── */
const TECH_STACK = [
  { name: "React", icon: "⚛️" },
  { name: "UI/UX", icon: "🎨" },
  { name: "Python", icon: "🐍" },
  { name: "Node.js", icon: "🟢" },
  { name: "Next.js", icon: "▲" },
  { name: "TypeScript", icon: "📘" },
  { name: "Tailwind", icon: "🌊" },
  { name: "Marketing", icon: "📈" },
];

function AnimatedHeroVisual() {
  return (
    <div className="relative w-full max-w-2xl mx-auto mt-8 lg:mt-0 flex flex-col items-center gap-6 sm:gap-8">
      
      <div className="relative w-full">
        {/* Video */}
        <div className="relative z-10 w-full aspect-video rounded-3xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 backdrop-blur-sm shadow-[0_0_50px_rgba(139,92,246,0.2)] overflow-hidden">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="w-full h-full object-cover"
          >
            <source src="https://video-previews.elements.envatousercontent.com/h264-video-previews/22f452d2-3653-4ac3-9efd-263fcdc98ba1/20188441.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>

      {/* Animated Marquee below video */}
      <div className="w-full overflow-hidden z-20" style={{ maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}>
        <div className="flex items-center w-max gap-4 sm:gap-6 marquee-track">
          {/* Double array for seamless loop */}
          {[...TECH_STACK, ...TECH_STACK].map((tech, idx) => (
            <div 
              key={idx} 
              className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-black/10 dark:bg-white/10 backdrop-blur-md border border-black/20 dark:border-white/20 font-bold shadow-xl flex items-center gap-2 hover:bg-white/20 transition-colors cursor-default"
            >
              <span className="text-lg sm:text-xl leading-none">{tech.icon}</span> 
              <span className="text-sm sm:text-base whitespace-nowrap">{tech.name}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

/* ─── Data ─────────────────────────────────────────────────────────── */
const TECH_ITEMS = [
  { name: "React",        iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
  { name: "Next.js",      iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg", invert: true },
  { name: "Node.js",      iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
  { name: "Python",       iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
  { name: "Figma",        iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg" },
  { name: "Tailwind",     iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg" },
  { name: "WordPress",    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/wordpress/wordpress-plain.svg" },
  { name: "Shopify",      iconUrl: "https://cdn.worldvectorlogo.com/logos/shopify.svg" },
  { name: "Google Ads",   iconUrl: "https://cdn.worldvectorlogo.com/logos/google-ads-2.svg" },
];

const TRACKS = [
  {
    icon: Megaphone,
    title: "Digital Marketing",
    desc: "Master SEO, Google Ads, social media marketing, analytics and more.",
    badge: "High Demand",
    badgeBg: "bg-orange-100 text-orange-600 border-orange-200",
    iconBg: "bg-orange-50",
    iconColor: "text-orange-500",
    accent: "border-l-orange-400",
    linkColor: "text-orange-500",
    rating: "4.8",
    students: "12K+",
    lessons: "150+",
  },
  {
    icon: Palette,
    title: "Graphic Design",
    desc: "Learn Photoshop, Figma, Illustrator and create stunning visuals.",
    badge: "Creative",
    badgeBg: "bg-violet-100 text-violet-600 border-violet-200",
    iconBg: "bg-violet-50",
    iconColor: "text-violet-500",
    accent: "border-l-violet-400",
    linkColor: "text-violet-500",
    rating: "4.7",
    students: "8.5K+",
    lessons: "90+",
  },
  {
    icon: Code2,
    title: "Web Development",
    desc: "Build modern websites with HTML, CSS, JavaScript, React and more.",
    badge: "Essential",
    badgeBg: "bg-blue-100 text-blue-600 border-blue-200",
    iconBg: "bg-blue-50",
    iconColor: "text-blue-500",
    accent: "border-l-blue-400",
    linkColor: "text-blue-500",
    rating: "4.9",
    students: "15K+",
    lessons: "180+",
  },
  {
    icon: Globe,
    title: "Python Programming",
    desc: "From basics to advanced Python. Build real-world projects.",
    badge: "Popular",
    badgeBg: "bg-emerald-100 text-emerald-600 border-emerald-200",
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-500",
    accent: "border-l-emerald-400",
    linkColor: "text-emerald-500",
    rating: "4.8",
    students: "11K+",
    lessons: "120+",
  },
  {
    icon: BarChart3,
    title: "Career Development",
    desc: "Get interview ready with resume, aptitude, DSA and mock interviews.",
    badge: "Career Ready",
    badgeBg: "bg-indigo-100 text-indigo-600 border-indigo-200",
    iconBg: "bg-indigo-50",
    iconColor: "text-indigo-500",
    accent: "border-l-indigo-400",
    linkColor: "text-indigo-500",
    rating: "4.9",
    students: "9K+",
    lessons: "100+",
  },
  {
    icon: Database,
    title: "Exam Preparation",
    desc: "Prepare for competitive exams with structured courses and tests.",
    badge: "Exam Prep",
    badgeBg: "bg-rose-100 text-rose-600 border-rose-200",
    iconBg: "bg-rose-50",
    iconColor: "text-rose-500",
    accent: "border-l-rose-400",
    linkColor: "text-rose-500",
    rating: "4.7",
    students: "7K+",
    lessons: "80+",
  },
];

const WHY_US = [
  {
    icon: BookOpen,
    title: "Learning Without Limits",
    desc: "Explore diverse skill tracks, from frontend to full-stack, marketing to design — all from a single unified platform.",
  },
  {
    icon: GraduationCap,
    title: "Industry-Focused Curriculum",
    desc: "Study with content designed by real professionals. Our curriculum reflects the tools and workflows companies actually use.",
  },
  {
    icon: Code2,
    title: "Web Development",
    desc: "Master React, Next.js, Node.js, and full-stack development with hands-on projects and real-world deployments.",
  },
  {
    icon: Zap,
    title: "Constant Innovation",
    desc: "Technology evolves fast. We keep our courses updated so you're always learning the most relevant, cutting-edge material.",
  },
];

const STATS = [
  { value: "2,400+", label: "Students Enrolled",  icon: Users },
  { value: "45+",    label: "Expert Courses",      icon: BookOpen },
  { value: "40+",    label: "Global Instructors",   icon: GraduationCap },
  { value: "96%",    label: "Satisfaction Rate",    icon: Trophy },
];

const STEPS = [
  {
    number: "01",
    title: "Choose Your Course",
    desc: "Explore our catalog of expert-led courses. Preview free lessons before committing.",
    icon: Eye,
  },
  {
    number: "02",
    title: "Access the Material",
    desc: "Pay via bank transfer or UPI, submit your receipt for quick admin verification.",
    icon: BookOpen,
  },
  {
    number: "03",
    title: "Learn & Grow",
    desc: "Once approved, start learning instantly. Track progress and build real skills.",
    icon: Trophy,
  },
];

const TESTIMONIALS = [
  {
    name: "Priya Sharma",
    role: "Front-end Developer",
    avatar: "PS",
    rating: 5,
    text: "EliWeb Skill Solution completely transformed my career. The Web Development track gave me skills that landed me a job within 3 months of completing the course. The instructors are phenomenal!",
  },
  {
    name: "Sudhanshu Kumar",
    role: "Digital Marketer",
    avatar: "SK",
    rating: 5,
    text: "The Digital Marketing course here is the most practical I've found online. Real campaigns, real strategies — I now manage a $50K/month ad budget for my company.",
  },
  {
    name: "Anjali Verma",
    role: "UI/UX Designer",
    avatar: "AV",
    rating: 5,
    text: "From zero design knowledge to landing freelance clients — the UI/UX track did it all. The Figma projects alone are portfolio-worthy. Absolutely worth every rupee.",
  },
];

const FAQS = [
  {
    q: "How does enrollment work?",
    a: "After selecting a course, you pay via bank transfer or UPI and upload your payment screenshot. Our admin team verifies it within 24 hours and grants you full access.",
  },
  {
    q: "Can I preview a course before enrolling?",
    a: "Yes! Many courses have free preview lectures. Click 'Preview Lesson' on any unlocked lecture in the course curriculum — no account required.",
  },
  {
    q: "What if my payment is rejected?",
    a: "If your payment details are incorrect, you'll be notified and can resubmit correct payment proof. Our team will guide you through the process.",
  },
  {
    q: "Do I get lifetime access?",
    a: "Absolutely. Once enrolled and approved, you have lifetime access to all course materials, including future updates the instructor adds.",
  },
  {
    q: "Are the instructors qualified?",
    a: "Every instructor is vetted and approved by our admin team before they can publish any course. We maintain strict quality standards.",
  },
];

/* ─── FAQ Accordion Item ─────────────────────────────────────────── */
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-black/10 dark:border-white/10 rounded-xl overflow-hidden bg-black/5 dark:bg-white/5 backdrop-blur-md">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left font-semibold text-[var(--foreground)] hover:bg-black/10 dark:bg-white/10 transition-colors text-sm"
      >
        <span>{q}</span>
        <ChevronDown
          className={`h-4 w-4 text-cyan-500 shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <div className={`accordion-content ${open ? "open" : ""}`}>
        <div className="accordion-inner px-5 pb-4">
          <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">{a}</p>
        </div>
      </div>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────────── */
export default function HomePage() {
  useScrollReveal();
  const tickerItems = [...TECH_ITEMS, ...TECH_ITEMS];

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] relative overflow-hidden font-body selection:bg-blue-500/30 selection:text-[var(--foreground)]">
      
      {/* ══════════════ GLOBAL BACKGROUND ══════════════ */}
      {/* Fixed canvas covers the entire page background */}
      <ParticleCanvas className="fixed inset-0 z-0 opacity-60" />
      
      {/* Global subtle gradient orbs fixed in background */}

      {/* Main content wrapper relative on top of fixed background */}
      <div className="relative z-10">

        {/* ══════════════ 1. TWO-COLUMN HERO ══════════════ */}
        <section className="pt-28 pb-16 sm:pt-36 sm:pb-24 lg:pt-40 lg:pb-32 section-shell">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Text & CTAs */}
            <div className="lg:col-span-6 space-y-8 relative z-10" data-reveal>
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 backdrop-blur-md shadow-lg shadow-purple-500/5">
                <Zap className="h-3.5 w-3.5 text-cyan-500" />
                <span className="text-xs font-bold tracking-widest uppercase text-[var(--muted-foreground)]">Premium Skill Development Platform</span>
              </div>

              {/* Headline */}
              <h1 className="text-5xl sm:text-6xl lg:text-[4.5rem] font-extrabold tracking-tight leading-[1.05] font-heading">
                Learn Skills.<br/>
                <span className="text-gradient font-display">Build a Career.</span><br/>
                Grow Without Limits.
              </h1>

              <p className="text-lg text-[var(--muted-foreground)] leading-relaxed max-w-xl">
                Expert-led courses in web development, digital marketing, design & more.
                Preview free lessons, enroll easily, and learn at your own pace.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap gap-4 items-center">
                <Link
                  href="/courses"
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-brand-gradient text-[var(--primary-foreground)] font-bold text-sm shadow-glow hover:scale-105 transition-all duration-300"
                >
                  Explore Courses <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border border-black/20 dark:border-white/20 bg-black/5 dark:bg-white/5 text-[var(--foreground)] font-bold text-sm hover:bg-black/10 dark:bg-white/10 hover:border-black/40 dark:border-white/40 transition-all duration-300 backdrop-blur-md"
                >
                  Start for Free
                </Link>
              </div>

              {/* Social Proof */}
              <div className="pt-4 flex items-center gap-4">
                <div className="flex -space-x-3">
                  <Image src="https://i.pravatar.cc/100?img=1" alt="Student" width={36} height={36} className="rounded-full border-2 border-[var(--background)]" unoptimized />
                  <Image src="https://i.pravatar.cc/100?img=2" alt="Student" width={36} height={36} className="rounded-full border-2 border-[var(--background)]" unoptimized />
                  <Image src="https://i.pravatar.cc/100?img=3" alt="Student" width={36} height={36} className="rounded-full border-2 border-[var(--background)]" unoptimized />
                  <Image src="https://i.pravatar.cc/100?img=4" alt="Student" width={36} height={36} className="rounded-full border-2 border-[var(--background)]" unoptimized />
                </div>
                <span className="text-sm font-medium text-[var(--muted-foreground)]">
                  <span className="text-[var(--foreground)] font-bold">2,400+</span> students learning right now
                </span>
              </div>
            </div>

            {/* Right Column: Animated Visual */}
            <div className="lg:col-span-6 relative z-10" data-reveal style={{ "--reveal-delay": "200ms" } as React.CSSProperties}>
              <AnimatedHeroVisual />
            </div>
          </div>
        </section>

        {/* ══════════════ 2. TECH TICKER ══════════════ */}
        <section className="pb-20 section-shell">
          <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 backdrop-blur-lg p-6 lg:p-8 overflow-hidden shadow-2xl shadow-purple-500/5">
            <p className="text-center text-xs font-bold tracking-widest uppercase text-cyan-500 mb-8">
              Technologies & Tools We Cover
            </p>
            <div className="tech-ticker">
              <div className="tech-track" style={{ gap: '24px' }}>
                {tickerItems.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 px-5 py-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 backdrop-blur-sm transition-transform hover:scale-105 hover:bg-black/10 dark:bg-white/10 hover:border-blue-500/50 cursor-default">
                    <div className="relative w-6 h-6 flex-shrink-0 flex items-center justify-center">
                      {item.invert ? (
                        <Image src={item.iconUrl} alt={item.name} fill className="object-contain invert" unoptimized />
                      ) : (
                        <Image src={item.iconUrl} alt={item.name} fill className="object-contain" unoptimized />
                      )}
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
                Everything You Need to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-500">Dominate Online</span>
              </h2>
              <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-base">
                Discover industry-relevant courses created by experts and designed to help you learn, grow, and achieve more.
              </p>
            </div>

            {/* Feature highlights row */}
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 mb-14 mt-10" data-reveal>
              {[
                { icon: BookOpen, label: "Expert Instructors", sub: "Learn from professionals with real-world experience", color: "bg-violet-100 dark:bg-violet-900/30", iconColor: "text-violet-500" },
                { icon: Code2, label: "Practical Learning", sub: "Hands-on projects & real-world examples", color: "bg-emerald-100 dark:bg-emerald-900/30", iconColor: "text-emerald-500" },
                { icon: GraduationCap, label: "Certificate", sub: "Earn shareable certificates to boost your profile", color: "bg-orange-100 dark:bg-orange-900/30", iconColor: "text-orange-500" },
                { icon: Zap, label: "Lifetime Access", sub: "Learn anytime, anywhere with lifetime access", color: "bg-blue-100 dark:bg-blue-900/30", iconColor: "text-blue-500" },
              ].map((feat) => (
                <div key={feat.label} className="flex items-center gap-3 text-left">
                  <div className={`h-10 w-10 rounded-xl ${feat.color} flex items-center justify-center shadow-sm`}>
                    <feat.icon className={`h-5 w-5 ${feat.iconColor}`} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#0f172a] dark:text-white">{feat.label}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">{feat.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {TRACKS.map((track, idx) => (
                <div
                  key={track.title}
                  data-reveal
                  style={{ "--reveal-delay": `${idx * 80}ms` } as React.CSSProperties}
                  className={`group p-6 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 border-l-4 ${track.accent} hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer relative`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`h-12 w-12 rounded-2xl ${track.iconBg} dark:bg-white/10 flex items-center justify-center`}>
                      <track.icon className={`h-6 w-6 ${track.iconColor}`} />
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${track.badgeBg}`}>
                      {track.badge}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-[#0f172a] dark:text-white font-heading mb-2">{track.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-5">{track.desc}</p>
                  
                  {/* Stats row */}
                  <div className="flex items-center gap-4 mb-5 pt-4 border-t border-slate-100 dark:border-white/10">
                    <div className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                      <span className="text-xs font-bold text-[#0f172a] dark:text-white">{track.rating}</span>
                      <span className="text-[10px] text-slate-400">Rating</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5 text-slate-400" />
                      <span className="text-xs font-bold text-[#0f172a] dark:text-white">{track.students}</span>
                      <span className="text-[10px] text-slate-400">Students</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Video className="h-3.5 w-3.5 text-slate-400" />
                      <span className="text-xs font-bold text-[#0f172a] dark:text-white">{track.lessons}</span>
                      <span className="text-[10px] text-slate-400">Lessons</span>
                    </div>
                  </div>

                  <div className={`flex items-center gap-2 text-sm font-bold ${track.linkColor} group-hover:gap-3 transition-all`}>
                    Explore Courses <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              ))}
            </div>

            {/* View All Courses Button */}
            <div className="text-center mt-12" data-reveal>
              <Link
                href="/courses"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold text-sm shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
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
              Why Students Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-500">EliWeb Skill Solution</span>
            </h2>
            <p className="text-[var(--muted-foreground)] max-w-xl mx-auto text-base">
              We&apos;re not just another online platform — we&apos;re a community built around real skill outcomes.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {WHY_US.map((item, idx) => (
              <div key={item.title} data-reveal style={{ "--reveal-delay": `${idx * 100}ms` } as React.CSSProperties} className="group p-6 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center">
                <div className="inline-flex h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-200/50 dark:border-white/10 items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                  <item.icon className="h-7 w-7 text-blue-500" />
                </div>
                <h3 className="text-base font-bold text-[var(--foreground)] mb-2 font-heading">{item.title}</h3>
                <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════ 5. STATS ══════════════ */}
        <section className="py-16 section-shell">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {STATS.map((stat, idx) => {
              const iconColors = [
                "bg-blue-500",
                "bg-cyan-500",
                "bg-indigo-500",
                "bg-emerald-500",
              ];
              return (
                <div key={stat.label} data-reveal style={{ "--reveal-delay": `${idx * 100}ms` } as React.CSSProperties} className="flex flex-col items-center text-center group">
                  <div className={`h-12 w-12 rounded-full ${iconColors[idx]} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className="h-5 w-5 text-white" />
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
            {/* Connector line on desktop */}
            <div className="hidden md:block absolute top-8 left-[calc(16.67%+1rem)] right-[calc(16.67%+1rem)] h-[3px] bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-500 z-0" />

            {STEPS.map((step, idx) => {
              const stepColors = ["bg-blue-500", "bg-indigo-500", "bg-blue-600"];
              return (
                <div key={step.number} data-reveal style={{ "--reveal-delay": `${idx * 150}ms` } as React.CSSProperties} className="flex flex-col items-center text-center relative px-4">
                  {/* Numbered circle */}
                  <div className={`h-16 w-16 rounded-full ${stepColors[idx]} flex items-center justify-center text-white shadow-lg mb-6 relative z-10 hover:scale-110 transition-transform duration-300 border-4 border-white dark:border-[var(--background)]`}>
                    <span className="text-lg font-extrabold">{step.number}</span>
                  </div>
                  {/* Arrow on desktop (between steps) */}
                  {idx < 2 && (
                    <div className="hidden md:block absolute top-6 right-0 translate-x-1/2 z-20">
                      <ArrowRight className="h-5 w-5 text-indigo-500" />
                    </div>
                  )}
                  <h3 className="text-lg font-bold text-[var(--foreground)] mb-2 font-heading">{step.title}</h3>
                  <p className="text-sm text-[var(--muted-foreground)] leading-relaxed max-w-[280px]">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ══════════════ 7. TESTIMONIALS + FAQ SIDE BY SIDE ══════════════ */}
        <div className="relative py-24 w-full bg-[#eef4fb] dark:bg-[#111827]">
          <section className="section-shell">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-3xl border border-slate-200 dark:border-white/10 overflow-hidden bg-white dark:bg-white/5">
              {/* Testimonials Column */}
              <div className="p-8 lg:p-10 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-white/10">
                <div className="mb-8" data-reveal>
                  <p className="text-cyan-500 font-bold tracking-widest text-xs uppercase mb-3">Student Reviews</p>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--foreground)] font-heading mb-2">
                    What Our Students <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-500">Say</span>
                  </h2>
                  <p className="text-[var(--muted-foreground)] text-sm">
                    Hear what learners and people who trusted us have to say.
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {TESTIMONIALS.map((t, idx) => (
                    <div key={t.name} data-reveal style={{ "--reveal-delay": `${idx * 100}ms` } as React.CSSProperties} className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 hover:shadow-lg transition-shadow flex flex-col">
                      <div className="flex gap-1 mb-3">
                        {Array.from({ length: t.rating }).map((_, i) => (
                          <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <p className="text-xs text-[var(--foreground)] leading-relaxed mb-4 italic flex-1">
                        &ldquo;{t.text}&rdquo;
                      </p>
                      <div className="flex items-center gap-2 pt-3 border-t border-slate-100 dark:border-white/10">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                          {t.avatar}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-[var(--foreground)]">{t.name}</div>
                          <div className="text-[10px] text-[var(--muted-foreground)]">{t.role}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* FAQ Column */}
              <div className="p-8 lg:p-10">
                <div className="mb-8" data-reveal>
                  <p className="text-cyan-500 font-bold tracking-widest text-xs uppercase mb-3">Got Questions?</p>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--foreground)] font-heading mb-2">
                    Common <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-500">Questions</span>
                  </h2>
                </div>
                <div className="space-y-3" data-reveal style={{ "--reveal-delay": "100ms" } as React.CSSProperties}>
                  {FAQS.map((faq) => (
                    <FaqItem key={faq.q} q={faq.q} a={faq.a} />
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* ══════════════ 8. CTA BANNER ══════════════ */}
        <section className="py-16 sm:py-24 section-shell">
          <div className="relative rounded-[2rem] overflow-hidden bg-gradient-to-r from-[#1e3a8a] via-[#4338ca] to-[#7c3aed] p-10 sm:p-16 shadow-2xl">
            {/* Background pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,rgba(255,255,255,0.08),transparent_60%)] pointer-events-none" />
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-purple-500/20 to-transparent pointer-events-none" />
            
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
              <div className="lg:col-span-3" data-reveal>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 mb-6 backdrop-blur-md">
                  <Zap className="h-3.5 w-3.5 text-cyan-300" />
                  <span className="text-xs font-bold uppercase tracking-widest text-white/80">Start Learning Today</span>
                </div>

                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4 font-heading leading-tight">
                  Ready to Build Your Dream Career?
                </h2>
                <p className="text-white/70 max-w-lg mb-8 text-base leading-relaxed">
                  Join 2,400+ students who are already transforming their careers with EliWeb
                  Skill Solution. Start with a free preview — no payment required.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/courses"
                    className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-white text-blue-700 font-bold text-sm hover:bg-white/90 hover:scale-105 transition-all duration-300 shadow-lg"
                  >
                    Browse All Courses <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/register"
                    className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full border-2 border-white/30 text-white font-bold text-sm hover:bg-white/10 hover:border-white/50 hover:scale-105 transition-all duration-300"
                  >
                    Create Free Account
                  </Link>
                </div>
              </div>
              
              {/* Right side - Graduation cap image */}
              <div className="hidden lg:flex lg:col-span-2 items-center justify-center" data-reveal style={{ "--reveal-delay": "200ms" } as React.CSSProperties}>
                <Image
                  src="/graduation-cap.png"
                  alt="Graduation cap on books"
                  width={320}
                  height={320}
                  className="object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
                  unoptimized
                />
              </div>
            </div>
          </div>
        </section>

      </div> {/* End main content wrapper */}
      
      {/* Footer needs to sit on top of the fixed background too */}
      <div className="relative z-10 border-t border-black/10 dark:border-white/10 bg-black/40 backdrop-blur-md">
        <Footer />
      </div>
    </div>
  );
}
