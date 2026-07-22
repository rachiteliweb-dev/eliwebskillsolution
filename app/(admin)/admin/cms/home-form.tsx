"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateHomePage } from "@/lib/actions/admin";
import {
  Check, AlertCircle, Loader2, Plus, Trash2, ChevronDown, ChevronUp,
  Home, Type, BarChart3, HelpCircle, Users, Zap, Star, MessageSquare, Megaphone
} from "lucide-react";
import type { SiteHomePage } from "@prisma/client";

/* ─── Default data ─────────────────────────────────────────────────────────── */
const DEFAULT_TRACKS = [
  { id: "marketing", iconKey: "Megaphone", title: "Digital Marketing",  desc: "Master SEO, Google Ads, social media marketing, analytics and more.", badge: "High Demand", rating: "4.8", students: "12K+",  lessons: "150+" },
  { id: "design",    iconKey: "Palette",   title: "Graphic Design",     desc: "Learn Photoshop, Figma, Illustrator and create stunning visuals.",    badge: "Creative",   rating: "4.7", students: "8.5K+", lessons: "90+"  },
  { id: "web",       iconKey: "Code2",     title: "Web Development",    desc: "Build modern websites with HTML, CSS, JavaScript, React and more.",   badge: "Essential",  rating: "4.9", students: "15K+",  lessons: "180+" },
  { id: "python",    iconKey: "Globe",     title: "Python Programming",  desc: "From basics to advanced Python. Build real-world projects.",          badge: "Popular",    rating: "4.8", students: "11K+",  lessons: "120+" },
  { id: "career",    iconKey: "BarChart3", title: "Career Development",  desc: "Get interview ready with resume, aptitude, DSA and mock interviews.", badge: "Career Ready",rating: "4.9", students: "9K+",   lessons: "100+" },
  { id: "exam",      iconKey: "Database",  title: "Exam Preparation",   desc: "Prepare for competitive exams with structured courses and tests.",    badge: "Exam Prep",  rating: "4.7", students: "7K+",   lessons: "80+"  },
];
const DEFAULT_WHY = [
  { id: "1", iconKey: "BookOpen",     title: "Learning Without Limits",     desc: "Explore diverse skill tracks from a single unified platform." },
  { id: "2", iconKey: "GraduationCap",title: "Industry-Focused Curriculum", desc: "Content designed by real professionals." },
  { id: "3", iconKey: "Code2",        title: "Web Development",             desc: "Master React, Next.js, Node.js and full-stack development." },
  { id: "4", iconKey: "Zap",          title: "Constant Innovation",         desc: "We keep our courses updated with the latest material." },
];
const DEFAULT_STATS = [
  { id: "1", value: "2,400+", label: "Students Enrolled",  iconKey: "Users" },
  { id: "2", value: "45+",    label: "Expert Courses",     iconKey: "BookOpen" },
  { id: "3", value: "40+",    label: "Global Instructors", iconKey: "GraduationCap" },
  { id: "4", value: "96%",    label: "Satisfaction Rate",  iconKey: "Trophy" },
];
const DEFAULT_STEPS = [
  { id: "1", number: "01", title: "Choose Your Course",  desc: "Explore expert-led courses. Preview free lessons before committing." },
  { id: "2", number: "02", title: "Access the Material", desc: "Pay via UPI, submit your receipt for quick admin verification." },
  { id: "3", number: "03", title: "Learn & Grow",        desc: "Once approved, start learning instantly." },
];
const DEFAULT_TESTIMONIALS = [
  { id: "1", name: "Priya Sharma",    role: "Front-end Developer", avatar: "PS", rating: 5, text: "EliWeb Skill Solution completely transformed my career." },
  { id: "2", name: "Sudhanshu Kumar", role: "Digital Marketer",    avatar: "SK", rating: 5, text: "The Digital Marketing course here is the most practical I've found online." },
  { id: "3", name: "Anjali Verma",    role: "UI/UX Designer",      avatar: "AV", rating: 5, text: "From zero design knowledge to landing freelance clients." },
];
const DEFAULT_FAQS = [
  { id: "1", q: "How does enrollment work?",               a: "After selecting a course, you pay via UPI and upload your payment screenshot. Our admin verifies it within 24 hours." },
  { id: "2", q: "Can I preview a course before enrolling?",a: "Yes! Many courses have free preview lectures." },
  { id: "3", q: "What if my payment is rejected?",         a: "You'll be notified and can resubmit correct payment proof." },
  { id: "4", q: "Do I get lifetime access?",               a: "Absolutely. Once enrolled and approved, you have lifetime access." },
  { id: "5", q: "Are the instructors qualified?",          a: "Every instructor is vetted and approved by our admin team." },
];

const ICON_OPTIONS = ["Megaphone","Palette","Code2","Globe","BarChart3","Database","BookOpen","GraduationCap","Zap","Trophy","Users","Star","Heart","Award","Sparkles","ShieldCheck"];

/* ─── Generic field helpers ─────────────────────────────────────────────────── */
const inputCls = "w-full px-3.5 py-2.5 bg-[var(--surface)] border border-[var(--border)] rounded-lg text-[var(--foreground)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 focus:border-[var(--primary)]";
const labelCls = "text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]";
const sectionCls = "bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 shadow-[var(--shadow-card)] space-y-5";

function Field({ label, value, onChange, textarea = false, rows = 3 }: { label: string; value: string; onChange: (v: string) => void; textarea?: boolean; rows?: number }) {
  return (
    <div className="space-y-1.5">
      <label className={labelCls}>{label}</label>
      {textarea
        ? <textarea value={value} onChange={e => onChange(e.target.value)} rows={rows} className={inputCls + " resize-none"} />
        : <input type="text" value={value} onChange={e => onChange(e.target.value)} className={inputCls} />}
    </div>
  );
}

/* ─── Section toggle ──────────────────────────────────────────────────────── */
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

/* ─── Main Component ──────────────────────────────────────────────────────── */
interface TrackItem    { id: string; iconKey: string; title: string; desc: string; badge: string; rating: string; students: string; lessons: string; }
interface WhyItem      { id: string; iconKey: string; title: string; desc: string; }
interface StatItem     { id: string; value: string; label: string; iconKey: string; }
interface StepItem     { id: string; number: string; title: string; desc: string; }
interface Testimonial  { id: string; name: string; role: string; avatar: string; rating: number; text: string; }
interface FaqItem      { id: string; q: string; a: string; }
interface FeatureItem  { id: string; iconKey: string; label: string; sub: string; }

const DEFAULT_FEATURES = [
  { id: "1", iconKey: "BookOpen",      label: "Expert Instructors", sub: "Learn from professionals with real-world experience" },
  { id: "2", iconKey: "Code2",         label: "Practical Learning",  sub: "Hands-on projects & real-world examples" },
  { id: "3", iconKey: "GraduationCap", label: "Certificate",        sub: "Earn shareable certificates to boost your profile" },
  { id: "4", iconKey: "Zap",           label: "Lifetime Access",     sub: "Learn anytime, anywhere with lifetime access" },
];

export default function HomeForm({ homePage }: { homePage: SiteHomePage | null }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [success, setSuccess] = useState(false);

  // Hero
  const [heroEyebrow,          setHeroEyebrow]          = useState(homePage?.heroEyebrow          ?? "Premium Skill Development Platform");
  const [heroHeadline1,        setHeroHeadline1]        = useState(homePage?.heroHeadline1         ?? "Learn Skills.");
  const [heroHeadline2,        setHeroHeadline2]        = useState(homePage?.heroHeadline2         ?? "Build a Career.");
  const [heroHeadline3,        setHeroHeadline3]        = useState(homePage?.heroHeadline3         ?? "Grow Without Limits.");
  const [heroSubtext,          setHeroSubtext]          = useState(homePage?.heroSubtext           ?? "Expert-led courses in web development, digital marketing, design & more.");
  const [heroCta1Label,        setHeroCta1Label]        = useState(homePage?.heroCta1Label         ?? "Explore Courses");
  const [heroCta2Label,        setHeroCta2Label]        = useState(homePage?.heroCta2Label         ?? "Start for Free");
  const [heroSocialProofCount, setHeroSocialProofCount] = useState(homePage?.heroSocialProofCount  ?? "2,400+");
  // Tracks
  const [tracksHeadline, setTracksHeadline] = useState(homePage?.tracksHeadline ?? "Everything You Need to Dominate Online");
  const [tracksSubtext,  setTracksSubtext]  = useState(homePage?.tracksSubtext  ?? "Discover industry-relevant courses.");
  const [features,       setFeatures]       = useState<FeatureItem[]>((homePage?.features as unknown as FeatureItem[]) ?? DEFAULT_FEATURES);
  const [tracks,         setTracks]         = useState<TrackItem[]>((homePage?.tracks as unknown as TrackItem[]) ?? DEFAULT_TRACKS);
  // Why
  const [whyHeadline, setWhyHeadline] = useState(homePage?.whyHeadline ?? "Why Students Choose EliWeb Skill Solution");
  const [whySubtext,  setWhySubtext]  = useState(homePage?.whySubtext  ?? "We're not just another online platform.");
  const [whyItems,    setWhyItems]    = useState<WhyItem[]>((homePage?.whyItems as unknown as WhyItem[]) ?? DEFAULT_WHY);
  // Stats
  const [stats, setStats] = useState<StatItem[]>((homePage?.stats as unknown as StatItem[]) ?? DEFAULT_STATS);
  // Steps
  const [stepsHeadline, setStepsHeadline] = useState(homePage?.stepsHeadline ?? "How It Works");
  const [steps,         setSteps]         = useState<StepItem[]>((homePage?.steps as unknown as StepItem[]) ?? DEFAULT_STEPS);
  // Testimonials
  const [testimonialsHeadline, setTestimonialsHeadline] = useState(homePage?.testimonialsHeadline ?? "What Our Students Say");
  const [testimonialsSubtext,  setTestimonialsSubtext]  = useState(homePage?.testimonialsSubtext  ?? "Hear what learners say.");
  const [testimonials,         setTestimonials]         = useState<Testimonial[]>((homePage?.testimonials as unknown as Testimonial[]) ?? DEFAULT_TESTIMONIALS);
  // FAQs
  const [faqHeadline, setFaqHeadline] = useState(homePage?.faqHeadline ?? "Common Questions");
  const [faqs,        setFaqs]        = useState<FaqItem[]>((homePage?.faqs as unknown as FaqItem[]) ?? DEFAULT_FAQS);
  // CTA
  const [ctaHeadline, setCtaHeadline] = useState(homePage?.ctaHeadline ?? "Ready to Build Your Dream Career?");
  const [ctaSubtext,  setCtaSubtext]  = useState(homePage?.ctaSubtext  ?? "Join 2,400+ students already transforming their careers.");
  const [ctaBtn1Label,setCtaBtn1Label]= useState(homePage?.ctaBtn1Label ?? "Browse All Courses");
  const [ctaBtn2Label,setCtaBtn2Label]= useState(homePage?.ctaBtn2Label ?? "Create Free Account");

  const handleSave = async () => {
    setLoading(true); setError(""); setSuccess(false);
    const res = await updateHomePage({
      heroEyebrow, heroHeadline1, heroHeadline2, heroHeadline3, heroSubtext,
      heroCta1Label, heroCta2Label, heroSocialProofCount,
      tracksHeadline, tracksSubtext, features, tracks,
      whyHeadline, whySubtext, whyItems,
      stats, stepsHeadline, steps,
      testimonialsHeadline, testimonialsSubtext, testimonials,
      faqHeadline, faqs,
      ctaHeadline, ctaSubtext, ctaBtn1Label, ctaBtn2Label,
    });
    if (res.error) { setError(res.error); } else { setSuccess(true); router.refresh(); }
    setLoading(false);
  };

  /* ── Array helpers ── */
  const addFeature = () => setFeatures(prev => [...prev, { id: Date.now().toString(), iconKey: "BookOpen", label: "New Feature", sub: "Feature description" }]);
  const removeFeature = (id: string) => setFeatures(prev => prev.filter(f => f.id !== id));
  const updateFeature = (id: string, field: keyof FeatureItem, val: string) => setFeatures(prev => prev.map(f => f.id === id ? { ...f, [field]: val } : f));

  const addTrack = () => setTracks(prev => [...prev, { id: Date.now().toString(), iconKey: "BookOpen", title: "New Track", desc: "Description", badge: "New", rating: "4.5", students: "1K+", lessons: "50+" }]);
  const removeTrack = (id: string) => setTracks(prev => prev.filter(t => t.id !== id));
  const updateTrack = (id: string, field: keyof TrackItem, val: string) => setTracks(prev => prev.map(t => t.id === id ? { ...t, [field]: val } : t));

  const addWhy = () => setWhyItems(prev => [...prev, { id: Date.now().toString(), iconKey: "BookOpen", title: "New Reason", desc: "Description" }]);
  const removeWhy = (id: string) => setWhyItems(prev => prev.filter(w => w.id !== id));
  const updateWhy = (id: string, field: keyof WhyItem, val: string) => setWhyItems(prev => prev.map(w => w.id === id ? { ...w, [field]: val } : w));

  const addTestimonial = () => setTestimonials(prev => [...prev, { id: Date.now().toString(), name: "Student Name", role: "Role", avatar: "ST", rating: 5, text: "Great experience!" }]);
  const removeTestimonial = (id: string) => setTestimonials(prev => prev.filter(t => t.id !== id));
  const updateTestimonial = (id: string, field: keyof Testimonial, val: string | number) => setTestimonials(prev => prev.map(t => t.id === id ? { ...t, [field]: val } : t));

  const addFaq = () => setFaqs(prev => [...prev, { id: Date.now().toString(), q: "New Question?", a: "Answer here." }]);
  const removeFaq = (id: string) => setFaqs(prev => prev.filter(f => f.id !== id));
  const updateFaq = (id: string, field: "q" | "a", val: string) => setFaqs(prev => prev.map(f => f.id === id ? { ...f, [field]: val } : f));

  return (
    <div className="space-y-6">
      {/* Status banners */}
      {error   && <div className="p-4 rounded-xl bg-red-500/10 text-red-500 flex items-center gap-2 text-sm font-semibold"><AlertCircle className="h-5 w-5 shrink-0" />{error}</div>}
      {success && <div className="p-4 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center gap-2 text-sm font-semibold"><Check className="h-5 w-5" />Home page saved! Changes are live on <a href="/" target="_blank" className="underline">the homepage</a>.</div>}

      {/* ── Hero Section ── */}
      <SectionCard title="Hero Section" icon={Home}>
        <Field label="Eyebrow Tag"           value={heroEyebrow}          onChange={setHeroEyebrow} />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Field label="Headline Line 1" value={heroHeadline1} onChange={setHeroHeadline1} />
          <Field label="Headline Line 2 (gradient)" value={heroHeadline2} onChange={setHeroHeadline2} />
          <Field label="Headline Line 3" value={heroHeadline3} onChange={setHeroHeadline3} />
        </div>
        <Field label="Sub-Headline"           value={heroSubtext}          onChange={setHeroSubtext} textarea rows={2} />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Field label="Primary CTA Label"   value={heroCta1Label}        onChange={setHeroCta1Label} />
          <Field label="Secondary CTA Label" value={heroCta2Label}        onChange={setHeroCta2Label} />
          <Field label="Social Proof Count"  value={heroSocialProofCount} onChange={setHeroSocialProofCount} />
        </div>
      </SectionCard>

      {/* ── Feature Highlights ── */}
      <SectionCard title="Track Highlight Blocks" icon={Zap}>
        <div className="space-y-4">
          {(features || []).map((feat, idx) => (
            <div key={feat.id ?? idx} className="p-4 border border-[var(--border)] rounded-xl bg-[var(--surface)] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-[var(--foreground)]">{feat.label || `Feature #${idx + 1}`}</span>
                <button onClick={() => removeFeature(feat.id)} className="p-1.5 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors"><Trash2 className="h-4 w-4" /></button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="space-y-1">
                  <label className={labelCls}>Icon</label>
                  <select value={feat.iconKey} onChange={e => updateFeature(feat.id, "iconKey", e.target.value)} className={inputCls}>
                    {ICON_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
                <div className="space-y-1"><label className={labelCls}>Label</label><input className={inputCls} value={feat.label} onChange={e => updateFeature(feat.id, "label", e.target.value)} /></div>
                <div className="space-y-1"><label className={labelCls}>Sub-text</label><input className={inputCls} value={feat.sub} onChange={e => updateFeature(feat.id, "sub", e.target.value)} /></div>
              </div>
            </div>
          ))}
          <button onClick={addFeature} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-[var(--primary)] border border-dashed border-[var(--primary)]/40 rounded-xl hover:bg-[var(--primary)]/5 transition-colors w-full justify-center">
            <Plus className="h-4 w-4" /> Add Feature Highlight
          </button>
        </div>
      </SectionCard>

      {/* ── Skill Tracks ── */}
      <SectionCard title="Skill Tracks" icon={BarChart3}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Section Headline" value={tracksHeadline} onChange={setTracksHeadline} />
          <Field label="Section Sub-text" value={tracksSubtext}  onChange={setTracksSubtext} />
        </div>
        <div className="space-y-4">
          {tracks.map((track) => (
            <div key={track.id} className="p-4 border border-[var(--border)] rounded-xl bg-[var(--surface)] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-[var(--foreground)]">{track.title}</span>
                <button onClick={() => removeTrack(track.id)} className="p-1.5 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors"><Trash2 className="h-4 w-4" /></button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div className="space-y-1">
                  <label className={labelCls}>Icon</label>
                  <select value={track.iconKey} onChange={e => updateTrack(track.id, "iconKey", e.target.value)} className={inputCls}>
                    {ICON_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
                <div className="space-y-1"><label className={labelCls}>Title</label><input className={inputCls} value={track.title} onChange={e => updateTrack(track.id, "title", e.target.value)} /></div>
                <div className="space-y-1"><label className={labelCls}>Badge</label><input className={inputCls} value={track.badge} onChange={e => updateTrack(track.id, "badge", e.target.value)} /></div>
                <div className="space-y-1"><label className={labelCls}>Rating</label><input className={inputCls} value={track.rating} onChange={e => updateTrack(track.id, "rating", e.target.value)} /></div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <div className="sm:col-span-2 space-y-1"><label className={labelCls}>Description</label><input className={inputCls} value={track.desc} onChange={e => updateTrack(track.id, "desc", e.target.value)} /></div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1"><label className={labelCls}>Students</label><input className={inputCls} value={track.students} onChange={e => updateTrack(track.id, "students", e.target.value)} /></div>
                  <div className="space-y-1"><label className={labelCls}>Lessons</label><input className={inputCls} value={track.lessons} onChange={e => updateTrack(track.id, "lessons", e.target.value)} /></div>
                </div>
              </div>
            </div>
          ))}
          <button onClick={addTrack} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-[var(--primary)] border border-dashed border-[var(--primary)]/40 rounded-xl hover:bg-[var(--primary)]/5 transition-colors w-full justify-center">
            <Plus className="h-4 w-4" /> Add Track
          </button>
        </div>
      </SectionCard>

      {/* ── Why Choose Us ── */}
      <SectionCard title="Why Choose Us" icon={Zap}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Section Headline" value={whyHeadline} onChange={setWhyHeadline} />
          <Field label="Section Sub-text" value={whySubtext}  onChange={setWhySubtext} />
        </div>
        <div className="space-y-3">
          {whyItems.map(item => (
            <div key={item.id} className="p-4 border border-[var(--border)] rounded-xl bg-[var(--surface)]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-[var(--foreground)]">{item.title}</span>
                <button onClick={() => removeWhy(item.id)} className="p-1.5 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors"><Trash2 className="h-4 w-4" /></button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="space-y-1">
                  <label className={labelCls}>Icon</label>
                  <select value={item.iconKey} onChange={e => updateWhy(item.id, "iconKey", e.target.value)} className={inputCls}>
                    {ICON_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
                <div className="space-y-1"><label className={labelCls}>Title</label><input className={inputCls} value={item.title} onChange={e => updateWhy(item.id, "title", e.target.value)} /></div>
                <div className="space-y-1"><label className={labelCls}>Description</label><input className={inputCls} value={item.desc} onChange={e => updateWhy(item.id, "desc", e.target.value)} /></div>
              </div>
            </div>
          ))}
          <button onClick={addWhy} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-[var(--primary)] border border-dashed border-[var(--primary)]/40 rounded-xl hover:bg-[var(--primary)]/5 transition-colors w-full justify-center">
            <Plus className="h-4 w-4" /> Add Reason
          </button>
        </div>
      </SectionCard>

      {/* ── Stats ── */}
      <SectionCard title="Stats / Numbers" icon={BarChart3}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, idx) => (
            <div key={stat.id} className="p-4 border border-[var(--border)] rounded-xl bg-[var(--surface)] space-y-2">
              <label className={labelCls}>Stat {idx + 1}</label>
              <div className="space-y-1"><label className={labelCls + " text-[9px]"}>Value</label><input className={inputCls} value={stat.value} onChange={e => setStats(prev => prev.map((s, i) => i === idx ? { ...s, value: e.target.value } : s))} /></div>
              <div className="space-y-1"><label className={labelCls + " text-[9px]"}>Label</label><input className={inputCls} value={stat.label} onChange={e => setStats(prev => prev.map((s, i) => i === idx ? { ...s, label: e.target.value } : s))} /></div>
              <div className="space-y-1"><label className={labelCls + " text-[9px]"}>Icon</label>
                <select value={stat.iconKey} onChange={e => setStats(prev => prev.map((s, i) => i === idx ? { ...s, iconKey: e.target.value } : s))} className={inputCls}>
                  {ICON_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* ── Steps ── */}
      <SectionCard title="How It Works (Steps)" icon={Zap}>
        <Field label="Section Headline" value={stepsHeadline} onChange={setStepsHeadline} />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {steps.map((step, idx) => (
            <div key={step.id} className="p-4 border border-[var(--border)] rounded-xl bg-[var(--surface)] space-y-2">
              <label className={labelCls}>Step {step.number}</label>
              <input className={inputCls} value={step.title} onChange={e => setSteps(prev => prev.map((s, i) => i === idx ? { ...s, title: e.target.value } : s))} placeholder="Title" />
              <textarea className={inputCls + " resize-none"} rows={3} value={step.desc} onChange={e => setSteps(prev => prev.map((s, i) => i === idx ? { ...s, desc: e.target.value } : s))} placeholder="Description" />
            </div>
          ))}
        </div>
      </SectionCard>

      {/* ── Testimonials ── */}
      <SectionCard title="Testimonials" icon={Star}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Section Headline" value={testimonialsHeadline} onChange={setTestimonialsHeadline} />
          <Field label="Section Sub-text" value={testimonialsSubtext}  onChange={setTestimonialsSubtext} />
        </div>
        <div className="space-y-3">
          {testimonials.map(t => (
            <div key={t.id} className="p-4 border border-[var(--border)] rounded-xl bg-[var(--surface)]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-[var(--foreground)]">{t.name}</span>
                <button onClick={() => removeTestimonial(t.id)} className="p-1.5 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors"><Trash2 className="h-4 w-4" /></button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
                <input className={inputCls} value={t.name}   onChange={e => updateTestimonial(t.id, "name", e.target.value)}   placeholder="Name" />
                <input className={inputCls} value={t.role}   onChange={e => updateTestimonial(t.id, "role", e.target.value)}   placeholder="Role" />
                <input className={inputCls} value={t.avatar} onChange={e => updateTestimonial(t.id, "avatar", e.target.value)} placeholder="Initials (2 chars)" maxLength={2} />
                <select className={inputCls} value={t.rating} onChange={e => updateTestimonial(t.id, "rating", Number(e.target.value))}>
                  {[1,2,3,4,5].map(r => <option key={r} value={r}>{r} ★</option>)}
                </select>
              </div>
              <textarea className={inputCls + " resize-none"} rows={2} value={t.text} onChange={e => updateTestimonial(t.id, "text", e.target.value)} placeholder="Testimonial text" />
            </div>
          ))}
          <button onClick={addTestimonial} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-[var(--primary)] border border-dashed border-[var(--primary)]/40 rounded-xl hover:bg-[var(--primary)]/5 transition-colors w-full justify-center">
            <Plus className="h-4 w-4" /> Add Testimonial
          </button>
        </div>
      </SectionCard>

      {/* ── FAQs ── */}
      <SectionCard title="FAQs" icon={HelpCircle}>
        <Field label="Section Headline" value={faqHeadline} onChange={setFaqHeadline} />
        <div className="space-y-3">
          {faqs.map(faq => (
            <div key={faq.id} className="p-4 border border-[var(--border)] rounded-xl bg-[var(--surface)]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[var(--muted-foreground)] uppercase">Q&amp;A</span>
                <button onClick={() => removeFaq(faq.id)} className="p-1.5 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors"><Trash2 className="h-4 w-4" /></button>
              </div>
              <input className={inputCls + " mb-2"} value={faq.q} onChange={e => updateFaq(faq.id, "q", e.target.value)} placeholder="Question" />
              <textarea className={inputCls + " resize-none"} rows={2} value={faq.a} onChange={e => updateFaq(faq.id, "a", e.target.value)} placeholder="Answer" />
            </div>
          ))}
          <button onClick={addFaq} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-[var(--primary)] border border-dashed border-[var(--primary)]/40 rounded-xl hover:bg-[var(--primary)]/5 transition-colors w-full justify-center">
            <Plus className="h-4 w-4" /> Add FAQ
          </button>
        </div>
      </SectionCard>

      {/* ── CTA Banner ── */}
      <SectionCard title="CTA Banner" icon={Megaphone}>
        <Field label="Headline"          value={ctaHeadline}  onChange={setCtaHeadline} />
        <Field label="Sub-Text"          value={ctaSubtext}   onChange={setCtaSubtext} textarea rows={2} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Primary Button Label"   value={ctaBtn1Label} onChange={setCtaBtn1Label} />
          <Field label="Secondary Button Label" value={ctaBtn2Label} onChange={setCtaBtn2Label} />
        </div>
      </SectionCard>

      {/* Save button */}
      <button onClick={handleSave} disabled={loading} className="w-full flex justify-center items-center gap-2 py-3 rounded-xl bg-[var(--primary)] hover:opacity-90 text-[var(--primary-foreground)] font-bold text-sm shadow-[var(--shadow-glow)] transition-all disabled:opacity-50">
        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <><Check className="h-5 w-5" /> Save Home Page</>}
      </button>
    </div>
  );
}
