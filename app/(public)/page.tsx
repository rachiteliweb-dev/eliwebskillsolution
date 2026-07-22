// Home page — server component shell that fetches CMS data from DB
import { db } from "@/lib/db";
import HomePageClient from "./home-client";

export const revalidate = 0;

// ─── Default fallback data ────────────────────────────────────────────────────
const DEFAULT_TRACKS = [
  { id: "marketing", iconKey: "Megaphone", title: "Digital Marketing", desc: "Master SEO, Google Ads, social media marketing, analytics and more.", badge: "High Demand", rating: "4.8", students: "12K+", lessons: "150+" },
  { id: "design",    iconKey: "Palette",   title: "Graphic Design",    desc: "Learn Photoshop, Figma, Illustrator and create stunning visuals.",  badge: "Creative",   rating: "4.7", students: "8.5K+", lessons: "90+" },
  { id: "web",       iconKey: "Code2",     title: "Web Development",   desc: "Build modern websites with HTML, CSS, JavaScript, React and more.", badge: "Essential",  rating: "4.9", students: "15K+", lessons: "180+" },
  { id: "python",    iconKey: "Globe",     title: "Python Programming", desc: "From basics to advanced Python. Build real-world projects.",        badge: "Popular",    rating: "4.8", students: "11K+", lessons: "120+" },
  { id: "career",    iconKey: "BarChart3", title: "Career Development", desc: "Get interview ready with resume, aptitude, DSA and mock interviews.", badge: "Career Ready", rating: "4.9", students: "9K+", lessons: "100+" },
  { id: "exam",      iconKey: "Database",  title: "Exam Preparation",  desc: "Prepare for competitive exams with structured courses and tests.",   badge: "Exam Prep",  rating: "4.7", students: "7K+", lessons: "80+" },
];

const DEFAULT_FEATURES = [
  { id: "1", iconKey: "BookOpen",      label: "Expert Instructors", sub: "Learn from professionals with real-world experience" },
  { id: "2", iconKey: "Code2",         label: "Practical Learning",  sub: "Hands-on projects & real-world examples" },
  { id: "3", iconKey: "GraduationCap", label: "Certificate",        sub: "Earn shareable certificates to boost your profile" },
  { id: "4", iconKey: "Zap",           label: "Lifetime Access",     sub: "Learn anytime, anywhere with lifetime access" },
];

const DEFAULT_WHY_ITEMS = [
  { id: "1", iconKey: "BookOpen",     title: "Learning Without Limits",    desc: "Explore diverse skill tracks, from frontend to full-stack, marketing to design — all from a single unified platform." },
  { id: "2", iconKey: "GraduationCap",title: "Industry-Focused Curriculum",desc: "Study with content designed by real professionals. Our curriculum reflects the tools and workflows companies actually use." },
  { id: "3", iconKey: "Code2",        title: "Web Development",            desc: "Master React, Next.js, Node.js, and full-stack development with hands-on projects and real-world deployments." },
  { id: "4", iconKey: "Zap",          title: "Constant Innovation",        desc: "Technology evolves fast. We keep our courses updated so you're always learning the most relevant, cutting-edge material." },
];

const DEFAULT_STATS = [
  { id: "1", value: "2,400+", label: "Students Enrolled",  iconKey: "Users" },
  { id: "2", value: "45+",    label: "Expert Courses",     iconKey: "BookOpen" },
  { id: "3", value: "40+",    label: "Global Instructors", iconKey: "GraduationCap" },
  { id: "4", value: "96%",    label: "Satisfaction Rate",  iconKey: "Trophy" },
];

const DEFAULT_STEPS = [
  { id: "1", number: "01", title: "Choose Your Course",  desc: "Explore our catalog of expert-led courses. Preview free lessons before committing." },
  { id: "2", number: "02", title: "Access the Material", desc: "Pay via bank transfer or UPI, submit your receipt for quick admin verification." },
  { id: "3", number: "03", title: "Learn & Grow",        desc: "Once approved, start learning instantly. Track progress and build real skills." },
];

const DEFAULT_TESTIMONIALS = [
  { id: "1", name: "Priya Sharma",    role: "Front-end Developer", avatar: "PS", rating: 5, text: "EliWeb Skill Solution completely transformed my career. The Web Development track gave me skills that landed me a job within 3 months of completing the course. The instructors are phenomenal!" },
  { id: "2", name: "Sudhanshu Kumar", role: "Digital Marketer",    avatar: "SK", rating: 5, text: "The Digital Marketing course here is the most practical I've found online. Real campaigns, real strategies — I now manage a $50K/month ad budget for my company." },
  { id: "3", name: "Anjali Verma",    role: "UI/UX Designer",      avatar: "AV", rating: 5, text: "From zero design knowledge to landing freelance clients — the UI/UX track did it all. The Figma projects alone are portfolio-worthy. Absolutely worth every rupee." },
];

const DEFAULT_FAQS = [
  { id: "1", q: "How does enrollment work?",              a: "After selecting a course, you pay via bank transfer or UPI and upload your payment screenshot. Our admin team verifies it within 24 hours and grants you full access." },
  { id: "2", q: "Can I preview a course before enrolling?", a: "Yes! Many courses have free preview lectures. Click 'Preview Lesson' on any unlocked lecture in the course curriculum — no account required." },
  { id: "3", q: "What if my payment is rejected?",        a: "If your payment details are incorrect, you'll be notified and can resubmit correct payment proof. Our team will guide you through the process." },
  { id: "4", q: "Do I get lifetime access?",              a: "Absolutely. Once enrolled and approved, you have lifetime access to all course materials, including future updates the instructor adds." },
  { id: "5", q: "Are the instructors qualified?",         a: "Every instructor is vetted and approved by our admin team before they can publish any course. We maintain strict quality standards." },
];

export default async function HomePage() {
  const raw = await db.siteHomePage.findUnique({ where: { id: "singleton" } });

  const data = {
    heroEyebrow:          raw?.heroEyebrow          ?? "Premium Skill Development Platform",
    heroHeadline1:        raw?.heroHeadline1         ?? "Learn Skills.",
    heroHeadline2:        raw?.heroHeadline2         ?? "Build a Career.",
    heroHeadline3:        raw?.heroHeadline3         ?? "Grow Without Limits.",
    heroSubtext:          raw?.heroSubtext           ?? "Expert-led courses in web development, digital marketing, design & more. Preview free lessons, enroll easily, and learn at your own pace.",
    heroCta1Label:        raw?.heroCta1Label         ?? "Explore Courses",
    heroCta2Label:        raw?.heroCta2Label         ?? "Start for Free",
    heroSocialProofCount: raw?.heroSocialProofCount  ?? "2,400+",
    tracksHeadline:       raw?.tracksHeadline        ?? "Everything You Need to Dominate Online",
    tracksSubtext:        raw?.tracksSubtext         ?? "Discover industry-relevant courses created by experts and designed to help you learn, grow, and achieve more.",
    features:             (raw?.features && (raw.features as any[]).length > 0) ? (raw.features as unknown[]) : DEFAULT_FEATURES,
    tracks:               (raw?.tracks && (raw.tracks as any[]).length > 0) ? (raw.tracks as unknown[]) : DEFAULT_TRACKS,
    whyHeadline:          raw?.whyHeadline           ?? "Why Students Choose EliWeb Skill Solution",
    whySubtext:           raw?.whySubtext            ?? "We're not just another online platform — we're a community built around real skill outcomes.",
    whyItems:             (raw?.whyItems && (raw.whyItems as any[]).length > 0) ? (raw.whyItems as unknown[]) : DEFAULT_WHY_ITEMS,
    stats:                (raw?.stats && (raw.stats as any[]).length > 0) ? (raw.stats as unknown[]) : DEFAULT_STATS,
    stepsHeadline:        raw?.stepsHeadline         ?? "How It Works",
    steps:                (raw?.steps && (raw.steps as any[]).length > 0) ? (raw.steps as unknown[]) : DEFAULT_STEPS,
    testimonialsHeadline: raw?.testimonialsHeadline  ?? "What Our Students Say",
    testimonialsSubtext:  raw?.testimonialsSubtext   ?? "Hear what learners and people who trusted us have to say.",
    testimonials:         (raw?.testimonials && (raw.testimonials as any[]).length > 0) ? (raw.testimonials as unknown[]) : DEFAULT_TESTIMONIALS,
    faqHeadline:          raw?.faqHeadline           ?? "Common Questions",
    faqs:                 (raw?.faqs && (raw.faqs as any[]).length > 0) ? (raw.faqs as unknown[]) : DEFAULT_FAQS,
    ctaHeadline:          raw?.ctaHeadline           ?? "Ready to Build Your Dream Career?",
    ctaSubtext:           raw?.ctaSubtext            ?? "Join 2,400+ students who are already transforming their careers with EliWeb Skill Solution. Start with a free preview — no payment required.",
    ctaBtn1Label:         raw?.ctaBtn1Label          ?? "Browse All Courses",
    ctaBtn2Label:         raw?.ctaBtn2Label          ?? "Create Free Account",
  };

  return <HomePageClient data={data as any} />;
}
