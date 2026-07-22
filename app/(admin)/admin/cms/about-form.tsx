"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateAboutPage } from "@/lib/actions/admin";
import {
  Check, AlertCircle, Loader2, Plus, Trash2, ChevronDown, ChevronUp, Info
} from "lucide-react";
// Removed Prisma client type import to avoid build-time cache synchronization issues
type SiteAboutPage = any;
import { toast } from "react-toastify";

const inputCls  = "w-full px-3.5 py-2.5 bg-[var(--surface)] border border-[var(--border)] rounded-lg text-[var(--foreground)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 focus:border-[var(--primary)]";
const labelCls  = "text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]";
const sectionCls = "bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 shadow-[var(--shadow-card)] space-y-5";

function Field({ label, value, onChange, textarea = false, rows = 3 }: { label: string; value: string; onChange: (v: string) => void; textarea?: boolean; rows?: number; }) {
  return (
    <div className="space-y-1.5">
      <label className={labelCls}>{label}</label>
      {textarea
        ? <textarea value={value} onChange={e => onChange(e.target.value)} rows={rows} className={inputCls + " resize-none"} />
        : <input type="text" value={value} onChange={e => onChange(e.target.value)} className={inputCls} />}
    </div>
  );
}

function SectionCard({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div className={sectionCls}>
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between text-left">
        <span className="flex items-center gap-2 text-base font-bold text-[var(--foreground)] font-heading">
          <Icon className="h-5 w-5 text-[var(--primary)]" />{title}
        </span>
        {open ? <ChevronUp className="h-4 w-4 text-[var(--muted-foreground)]" /> : <ChevronDown className="h-4 w-4 text-[var(--muted-foreground)]" />}
      </button>
      {open && <div className="space-y-4 pt-2">{children}</div>}
    </div>
  );
}

const ICON_OPTIONS = ["Heart","Award","Sparkles","ShieldCheck","BookOpen","Star","Users","GraduationCap","Zap","Globe","Code2","BarChart3"];
const STAT_COLOR_OPTIONS = ["text-blue-500","text-emerald-500","text-amber-500","text-purple-500","text-rose-500","text-indigo-500","text-cyan-500"];

interface StatItem  { id: string; label: string; value: string; iconKey: string; color?: string; }
interface ValueItem { id: string; iconKey: string; title: string; desc: string; }

const DEFAULT_STATS: StatItem[] = [
  { id: "1", label: "Active Enrolled Students",  value: "2,400+", iconKey: "Users",    color: "text-blue-500" },
  { id: "2", label: "Expert-Led Courses",         value: "85+",    iconKey: "BookOpen", color: "text-emerald-500" },
  { id: "3", label: "Student Satisfaction Rate",  value: "96%",    iconKey: "Star",     color: "text-amber-500" },
  { id: "4", label: "Global Industry Instructors",value: "40+",    iconKey: "Users",    color: "text-purple-500" },
];

const DEFAULT_VALUES: ValueItem[] = [
  { id: "1", iconKey: "Heart",       title: "Student-First Success",  desc: "Every course is designed with practical application in mind." },
  { id: "2", iconKey: "Award",       title: "Practical & Real-world", desc: "No boring theories. Learn by building real projects." },
  { id: "3", iconKey: "Sparkles",    title: "Constant Innovation",    desc: "We constantly update our curriculum with current standards." },
  { id: "4", iconKey: "ShieldCheck", title: "Uncompromising Quality", desc: "Our instructors are top industry professionals." },
];

export default function AboutForm({ aboutPage }: { aboutPage: SiteAboutPage | null }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const [success, setSuccess] = useState(false);

  const [heroHeadline,   setHeroHeadline]   = useState(aboutPage?.heroHeadline   ?? "Empowering Careers Through Applied Learning");
  const [heroSubtext,    setHeroSubtext]    = useState(aboutPage?.heroSubtext    ?? "Eliweb Skill Solution is a premium skill-development platform.");
  const [missionTitle,   setMissionTitle]   = useState(aboutPage?.missionTitle   ?? "Our Mission");
  const [missionPara1,   setMissionPara1]   = useState(aboutPage?.missionPara1   ?? "At Eliweb Skill Solution, we believe everyone deserves access to high-quality, practical education.");
  const [missionPara2,   setMissionPara2]   = useState(aboutPage?.missionPara2   ?? "Founded with the goal of creating a premium environment for skill development.");
  const [brandName,      setBrandName]      = useState(aboutPage?.brandName      ?? "Eliweb Skill Solution");
  const [foundedYear,    setFoundedYear]    = useState(aboutPage?.foundedYear    ?? "Est. 2024");
  const [brandQuote,     setBrandQuote]     = useState(aboutPage?.brandQuote     ?? "We don't teach. We empower.");
  const [valuesHeadline, setValuesHeadline] = useState(aboutPage?.valuesHeadline ?? "Our Core Values");
  const [valuesSubtext,  setValuesSubtext]  = useState(aboutPage?.valuesSubtext  ?? "How we work, build, and support our community of learners every single day.");
  const [stats,  setStats]  = useState<StatItem[]>((aboutPage?.stats  as unknown as StatItem[])  ?? DEFAULT_STATS);
  const [values, setValues] = useState<ValueItem[]>((aboutPage?.values as unknown as ValueItem[]) ?? DEFAULT_VALUES);

  const handleSave = async () => {
    setLoading(true); setError(""); setSuccess(false);
    const res = await updateAboutPage({ heroHeadline, heroSubtext, missionTitle, missionPara1, missionPara2, brandName, foundedYear, brandQuote, stats, valuesHeadline, valuesSubtext, values });
    if (res.error) {
      setError(res.error);
      toast.error(`Failed to save: ${res.error}`);
    } else {
      setSuccess(true);
      toast.success("About page saved successfully!");
      router.refresh();
    }
    setLoading(false);
  };

  const addStat  = () => setStats(prev  => [...prev,  { id: Date.now().toString(), label: "New Stat",  value: "0+",  iconKey: "Users",    color: "text-blue-500" }]);
  const removeStat = (id: string) => setStats(prev => prev.filter(s => s.id !== id));
  const updateStat = (id: string, field: keyof StatItem, val: string) => setStats(prev => prev.map(s => s.id === id ? { ...s, [field]: val } : s));

  const addValue  = () => setValues(prev => [...prev, { id: Date.now().toString(), iconKey: "Heart", title: "New Value", desc: "Description" }]);
  const removeValue = (id: string) => setValues(prev => prev.filter(v => v.id !== id));
  const updateValue = (id: string, field: keyof ValueItem, val: string) => setValues(prev => prev.map(v => v.id === id ? { ...v, [field]: val } : v));

  return (
    <div className="space-y-6">
      {error   && <div className="p-4 rounded-xl bg-red-500/10 text-red-500 flex items-center gap-2 text-sm font-semibold"><AlertCircle className="h-5 w-5" />{error}</div>}
      {success && <div className="p-4 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center gap-2 text-sm font-semibold"><Check className="h-5 w-5" />About page saved! Changes are live on <a href="/about" target="_blank" className="underline">/about</a>.</div>}

      {/* Hero */}
      <SectionCard title="Hero Section" icon={Info}>
        <Field label="Headline (second part becomes gradient)" value={heroHeadline} onChange={setHeroHeadline} />
        <Field label="Sub-Headline" value={heroSubtext} onChange={setHeroSubtext} textarea rows={2} />
      </SectionCard>

      {/* Brand Card */}
      <SectionCard title="Brand / Mission Card" icon={Info}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Brand Name"   value={brandName}   onChange={setBrandName} />
          <Field label="Founded Year" value={foundedYear} onChange={setFoundedYear} />
        </div>
        <Field label="Brand Quote (shown on card)" value={brandQuote} onChange={setBrandQuote} textarea rows={2} />
      </SectionCard>

      {/* Mission */}
      <SectionCard title="Mission Section" icon={Info}>
        <Field label="Mission Title"  value={missionTitle}  onChange={setMissionTitle} />
        <Field label="Paragraph 1"    value={missionPara1}  onChange={setMissionPara1} textarea rows={4} />
        <Field label="Paragraph 2"    value={missionPara2}  onChange={setMissionPara2} textarea rows={4} />
      </SectionCard>

      {/* Stats */}
      <SectionCard title="Statistics" icon={Info}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {stats.map(stat => (
            <div key={stat.id} className="p-4 border border-[var(--border)] rounded-xl bg-[var(--surface)] space-y-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-bold text-[var(--foreground)]">{stat.label}</span>
                <button onClick={() => removeStat(stat.id)} className="p-1 rounded text-red-500 hover:bg-red-500/10"><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1"><label className={labelCls}>Value</label><input className={inputCls} value={stat.value} onChange={e => updateStat(stat.id, "value", e.target.value)} /></div>
                <div className="space-y-1"><label className={labelCls}>Label</label><input className={inputCls} value={stat.label} onChange={e => updateStat(stat.id, "label", e.target.value)} /></div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1"><label className={labelCls}>Icon</label>
                  <select className={inputCls} value={stat.iconKey} onChange={e => updateStat(stat.id, "iconKey", e.target.value)}>
                    {ICON_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
                <div className="space-y-1"><label className={labelCls}>Color</label>
                  <select className={inputCls} value={stat.color ?? "text-blue-500"} onChange={e => updateStat(stat.id, "color", e.target.value)}>
                    {STAT_COLOR_OPTIONS.map(o => <option key={o} value={o}>{o.replace("text-","")}</option>)}
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button onClick={addStat} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-[var(--primary)] border border-dashed border-[var(--primary)]/40 rounded-xl hover:bg-[var(--primary)]/5 transition-colors w-full justify-center">
          <Plus className="h-4 w-4" /> Add Stat
        </button>
      </SectionCard>

      {/* Values */}
      <SectionCard title="Core Values" icon={Info}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Section Headline" value={valuesHeadline} onChange={setValuesHeadline} />
          <Field label="Section Sub-text" value={valuesSubtext}  onChange={setValuesSubtext} />
        </div>
        <div className="space-y-3">
          {values.map(v => (
            <div key={v.id} className="p-4 border border-[var(--border)] rounded-xl bg-[var(--surface)]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-[var(--foreground)]">{v.title}</span>
                <button onClick={() => removeValue(v.id)} className="p-1.5 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors"><Trash2 className="h-4 w-4" /></button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="space-y-1"><label className={labelCls}>Icon</label>
                  <select className={inputCls} value={v.iconKey} onChange={e => updateValue(v.id, "iconKey", e.target.value)}>
                    {ICON_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
                <div className="space-y-1"><label className={labelCls}>Title</label><input className={inputCls} value={v.title} onChange={e => updateValue(v.id, "title", e.target.value)} /></div>
                <div className="space-y-1"><label className={labelCls}>Description</label><input className={inputCls} value={v.desc} onChange={e => updateValue(v.id, "desc", e.target.value)} /></div>
              </div>
            </div>
          ))}
          <button onClick={addValue} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-[var(--primary)] border border-dashed border-[var(--primary)]/40 rounded-xl hover:bg-[var(--primary)]/5 transition-colors w-full justify-center">
            <Plus className="h-4 w-4" /> Add Value
          </button>
        </div>
      </SectionCard>

      <button onClick={handleSave} disabled={loading} className="w-full flex justify-center items-center gap-2 py-3 rounded-xl bg-[var(--primary)] hover:opacity-90 text-[var(--primary-foreground)] font-bold text-sm shadow-[var(--shadow-glow)] transition-all disabled:opacity-50">
        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <><Check className="h-5 w-5" /> Save About Page</>}
      </button>
    </div>
  );
}
