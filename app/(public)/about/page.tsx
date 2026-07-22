import { db } from "@/lib/db";
import Link from "next/link";
import Image from "next/image";
import { Footer } from "@/components/footer";
import {
  Users, BookOpen, Star, ShieldCheck, Heart, Award, Sparkles, ArrowRight
} from "lucide-react";

export const revalidate = 0;

// ─── Icon map ────────────────────────────────────────────────────────────────
const VALUE_ICON_MAP: Record<string, React.ElementType> = {
  Heart, Award, Sparkles, ShieldCheck, BookOpen, Star, Users,
};

// ─── Default data (shown until admin saves CMS content) ──────────────────────
const DEFAULT_STATS = [
  { id: "1", label: "Active Enrolled Students",  value: "2,400+", iconKey: "Users",    color: "text-blue-500" },
  { id: "2", label: "Expert-Led Courses",         value: "85+",    iconKey: "BookOpen", color: "text-emerald-500" },
  { id: "3", label: "Student Satisfaction Rate",  value: "96%",    iconKey: "Star",     color: "text-amber-500" },
  { id: "4", label: "Global Industry Instructors",value: "40+",    iconKey: "Users",    color: "text-purple-500" },
];

const DEFAULT_VALUES = [
  { id: "1", iconKey: "Heart",      title: "Student-First Success",  desc: "Every course is designed with practical application in mind to ensure our students get real jobs, build real skills, and succeed." },
  { id: "2", iconKey: "Award",      title: "Practical & Real-world", desc: "No boring theories. Learn step-by-step building real projects designed by leading tech and industry professionals." },
  { id: "3", iconKey: "Sparkles",   title: "Constant Innovation",    desc: "Technology changes fast. We constantly update our curriculum to make sure you are learning current, cutting-edge standards." },
  { id: "4", iconKey: "ShieldCheck",title: "Uncompromising Quality", desc: "Our instructors are top industry professionals who bring years of actual industry practice right to your screen." },
];

const STAT_COLORS = ["text-blue-500", "text-emerald-500", "text-amber-500", "text-purple-500"];

interface StatItem  { id: string; label: string; value: string; iconKey: string; color?: string; }
interface ValueItem { id: string; iconKey: string; title: string; desc: string; }

export default async function AboutPage() {
  const raw = await db.siteAboutPage.findUnique({ where: { id: "singleton" } });

  const heroHeadline   = raw?.heroHeadline   ?? "Empowering Careers Through Applied Learning";
  const heroSubtext    = raw?.heroSubtext    ?? "Eliweb Skill Solution is a premium skill-development platform designed to bridge the gap between traditional education and industry demand.";
  const missionTitle   = raw?.missionTitle   ?? "Our Mission";
  const missionPara1   = raw?.missionPara1   ?? "At Eliweb Skill Solution, we believe everyone deserves access to high-quality, practical education that leads directly to professional success. We build programs that aren't just about obtaining certificates, but mastering the exact tools, methodologies, and skill sets that companies search for.";
  const missionPara2   = raw?.missionPara2   ?? "Founded with the goal of creating a premium, modern environment for skill development, Eliweb brings expert instructors, dynamic curriculum, and interactive learning environments to students worldwide.";
  const brandName      = raw?.brandName      ?? "Eliweb Skill Solution";
  const foundedYear    = raw?.foundedYear    ?? "Est. 2024";
  const brandQuote     = raw?.brandQuote     ?? "We don't teach. We empower. Our students learn to build, ship, and launch their careers with absolute confidence.";
  const valuesHeadline = raw?.valuesHeadline ?? "Our Core Values";
  const valuesSubtext  = raw?.valuesSubtext  ?? "How we work, build, and support our community of learners every single day.";
  const stats          = ((raw?.stats && (raw.stats as any[]).length > 0) ? (raw.stats as unknown[]) : DEFAULT_STATS) as StatItem[];
  const values         = ((raw?.values && (raw.values as any[]).length > 0) ? (raw.values as unknown[]) : DEFAULT_VALUES) as ValueItem[];

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[var(--background)]">
      <div className="relative py-16 sm:py-24 overflow-hidden flex-1">
        {/* Background */}
        <div className="absolute inset-0 pointer-events-none bg-[var(--gradient-soft)] opacity-80" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(20,96,214,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(20,96,214,0.03)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-24">

          {/* ── Hero Header ── */}
          <div className="text-center space-y-6 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[var(--secondary)] text-[var(--secondary-foreground)] border border-[var(--border)] tracking-wider uppercase">
              <Sparkles className="h-3 w-3" /> About {brandName}
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[var(--foreground)] font-heading leading-tight">
              {heroHeadline.includes("Applied Learning")
                ? <>{heroHeadline.split("Applied Learning")[0]}<span className="text-gradient">Applied Learning</span></>
                : heroHeadline}
            </h1>
            <p className="text-lg sm:text-xl text-[var(--muted-foreground)] leading-relaxed font-body">{heroSubtext}</p>
          </div>

          {/* ── Mission & Story ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <h2 className="text-3xl font-extrabold text-[var(--foreground)] font-heading">{missionTitle}</h2>
              <p className="text-base sm:text-lg text-[var(--muted-foreground)] leading-relaxed font-body">{missionPara1}</p>
              <p className="text-base sm:text-lg text-[var(--muted-foreground)] leading-relaxed font-body">{missionPara2}</p>
              <div className="pt-4 flex flex-wrap gap-4">
                <Link href="/courses" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold bg-[var(--primary)] text-[var(--primary-foreground)] shadow-[var(--shadow-glow)] hover:opacity-90 transition-all text-sm">
                  Browse Our Courses <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/contact" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold bg-[var(--secondary)] text-[var(--secondary-foreground)] border border-[var(--border)] hover:bg-[var(--border)] transition-all text-sm">
                  Get in Touch
                </Link>
              </div>
            </div>

            {/* Brand card */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="absolute inset-0 bg-gradient-to-tr from-[var(--primary)] to-[var(--accent)] rounded-3xl blur-2xl opacity-15" />
              <div className="relative border border-[var(--border)] bg-[var(--card)] p-8 sm:p-12 rounded-3xl shadow-[var(--shadow-card)] max-w-sm w-full text-center space-y-6">
                <div className="mx-auto relative h-20 w-20">
                  <Image src="/favicon.png" alt="Eliweb logo" fill className="object-contain" priority unoptimized />
                </div>
                <div>
                  <h3 className="text-2xl font-extrabold text-[var(--foreground)] font-heading">{brandName}</h3>
                  <p className="text-xs text-[var(--muted-foreground)] tracking-wider uppercase mt-1">{foundedYear}</p>
                </div>
                <div className="border-t border-[var(--border)] pt-6 text-sm text-[var(--muted-foreground)] font-body italic leading-relaxed">
                  &ldquo;{brandQuote}&rdquo;
                </div>
              </div>
            </div>
          </div>

          {/* ── Statistics ── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => {
              const IconComp = VALUE_ICON_MAP[stat.iconKey] ?? Users;
              const color = stat.color ?? STAT_COLORS[i % STAT_COLORS.length];
              return (
                <div key={stat.id ?? i} className="border border-[var(--border)] bg-[var(--card)] p-6 rounded-2xl shadow-[var(--shadow-card)] text-center flex flex-col items-center justify-center space-y-2 hover:border-[var(--primary)] hover:-translate-y-1 transition-all duration-300">
                  <div className={`p-3 rounded-xl bg-[var(--secondary)] ${color}`}>
                    <IconComp className="h-6 w-6" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-[var(--foreground)] font-heading">{stat.value}</div>
                  <div className="text-xs sm:text-sm text-[var(--muted-foreground)] font-semibold leading-snug">{stat.label}</div>
                </div>
              );
            })}
          </div>

          {/* ── Our Values ── */}
          <div className="space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--foreground)] font-heading">{valuesHeadline}</h2>
              <p className="text-base text-[var(--muted-foreground)] max-w-2xl mx-auto font-body">{valuesSubtext}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((v, i) => {
                const IconComp = VALUE_ICON_MAP[v.iconKey] ?? Heart;
                return (
                  <div key={v.id ?? i} className="border border-[var(--border)] bg-[var(--card)] p-6 rounded-2xl shadow-[var(--shadow-card)] space-y-4 flex flex-col justify-between hover:border-[var(--primary)] hover:shadow-lg transition-all duration-300">
                    <div className="space-y-3">
                      <div className="inline-flex p-3 rounded-xl bg-[var(--secondary)] text-[var(--primary)]">
                        <IconComp className="h-5 w-5" />
                      </div>
                      <h3 className="text-lg font-bold text-[var(--foreground)] font-heading">{v.title}</h3>
                      <p className="text-xs sm:text-sm text-[var(--muted-foreground)] leading-relaxed font-body">{v.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
      <Footer />
    </div>
  );
}
