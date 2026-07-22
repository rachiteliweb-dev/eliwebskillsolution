const { PrismaClient } = require("@prisma/client");
const db = new PrismaClient();

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

const DEFAULT_ABOUT_STATS = [
  { id: "1", label: "Active Enrolled Students",  value: "2,400+", iconKey: "Users",    color: "text-blue-500" },
  { id: "2", label: "Expert-Led Courses",         value: "85+",    iconKey: "BookOpen", color: "text-emerald-500" },
  { id: "3", label: "Student Satisfaction Rate",  value: "96%",    iconKey: "Star",     color: "text-amber-500" },
  { id: "4", label: "Global Industry Instructors",value: "40+",    iconKey: "Users",    color: "text-purple-500" },
];

const DEFAULT_ABOUT_VALUES = [
  { id: "1", iconKey: "Heart",      title: "Student-First Success",  desc: "Every course is designed with practical application in mind to ensure our students get real jobs, build real skills, and succeed." },
  { id: "2", iconKey: "Award",      title: "Practical & Real-world", desc: "No boring theories. Learn step-by-step building real projects designed by leading tech and industry professionals." },
  { id: "3", iconKey: "Sparkles",   title: "Constant Innovation",    desc: "Technology changes fast. We constantly update our curriculum to make sure you are learning current, cutting-edge standards." },
  { id: "4", iconKey: "ShieldCheck",title: "Uncompromising Quality", desc: "Our instructors are top industry professionals who bring years of actual industry practice right to your screen." },
];

async function seedCMS() {
  console.log("Seeding CMS database singleton tables...");

  // Home Page
  await db.siteHomePage.upsert({
    where: { id: "singleton" },
    create: {
      id: "singleton",
      heroEyebrow: "Premium Skill Development Platform",
      heroHeadline1: "Learn Skills.",
      heroHeadline2: "Build a Career.",
      heroHeadline3: "Grow Without Limits.",
      heroSubtext: "Expert-led courses in web development, digital marketing, design & more. Preview free lessons, enroll easily, and learn at your own pace.",
      heroCta1Label: "Explore Courses",
      heroCta2Label: "Start for Free",
      heroSocialProofCount: "2,400+",
      tracksHeadline: "Everything You Need to Dominate Online",
      tracksSubtext: "Discover industry-relevant courses created by experts and designed to help you learn, grow, and achieve more.",
      features: DEFAULT_FEATURES,
      tracks: DEFAULT_TRACKS,
      whyHeadline: "Why Students Choose EliWeb Skill Solution",
      whySubtext: "We're not just another online platform — we're a community built around real skill outcomes.",
      whyItems: DEFAULT_WHY_ITEMS,
      stats: DEFAULT_STATS,
      stepsHeadline: "How It Works",
      steps: DEFAULT_STEPS,
      testimonialsHeadline: "What Our Students Say",
      testimonialsSubtext: "Hear what learners and people who trusted us have to say.",
      testimonials: DEFAULT_TESTIMONIALS,
      faqHeadline: "Common Questions",
      faqs: DEFAULT_FAQS,
      ctaHeadline: "Ready to Build Your Dream Career?",
      ctaSubtext: "Join 2,400+ students who are already transforming their careers with EliWeb Skill Solution. Start with a free preview — no payment required.",
      ctaBtn1Label: "Browse All Courses",
      ctaBtn2Label: "Create Free Account",
    },
    update: {
      heroEyebrow: "Premium Skill Development Platform",
      heroHeadline1: "Learn Skills.",
      heroHeadline2: "Build a Career.",
      heroHeadline3: "Grow Without Limits.",
      heroSubtext: "Expert-led courses in web development, digital marketing, design & more. Preview free lessons, enroll easily, and learn at your own pace.",
      heroCta1Label: "Explore Courses",
      heroCta2Label: "Start for Free",
      heroSocialProofCount: "2,400+",
      tracksHeadline: "Everything You Need to Dominate Online",
      tracksSubtext: "Discover industry-relevant courses created by experts and designed to help you learn, grow, and achieve more.",
      features: DEFAULT_FEATURES,
      tracks: DEFAULT_TRACKS,
      whyHeadline: "Why Students Choose EliWeb Skill Solution",
      whySubtext: "We're not just another online platform — we're a community built around real skill outcomes.",
      whyItems: DEFAULT_WHY_ITEMS,
      stats: DEFAULT_STATS,
      stepsHeadline: "How It Works",
      steps: DEFAULT_STEPS,
      testimonialsHeadline: "What Our Students Say",
      testimonialsSubtext: "Hear what learners and people who trusted us have to say.",
      testimonials: DEFAULT_TESTIMONIALS,
      faqHeadline: "Common Questions",
      faqs: DEFAULT_FAQS,
      ctaHeadline: "Ready to Build Your Dream Career?",
      ctaSubtext: "Join 2,400+ students who are already transforming their careers with EliWeb Skill Solution. Start with a free preview — no payment required.",
      ctaBtn1Label: "Browse All Courses",
      ctaBtn2Label: "Create Free Account",
    }
  });
  console.log("Seeded SiteHomePage table.");

  // About Page
  await db.siteAboutPage.upsert({
    where: { id: "singleton" },
    create: {
      id: "singleton",
      heroHeadline: "Empowering Careers Through Applied Learning",
      heroSubtext: "Eliweb Skill Solution is a premium skill-development platform designed to bridge the gap between traditional education and industry demand.",
      missionTitle: "Our Mission",
      missionPara1: "At Eliweb Skill Solution, we believe everyone deserves access to high-quality, practical education that leads directly to professional success. We build programs that aren't just about obtaining certificates, but mastering the exact tools, methodologies, and skill sets that companies search for.",
      missionPara2: "Founded with the goal of creating a premium, modern environment for skill development, Eliweb brings expert instructors, dynamic curriculum, and interactive learning environments to students worldwide.",
      brandName: "Eliweb Skill Solution",
      foundedYear: "Est. 2024",
      brandQuote: "We don't teach. We empower. Our students learn to build, ship, and launch their careers with absolute confidence.",
      stats: DEFAULT_ABOUT_STATS,
      valuesHeadline: "Our Core Values",
      valuesSubtext: "How we work, build, and support our community of learners every single day.",
      values: DEFAULT_ABOUT_VALUES,
    },
    update: {
      heroHeadline: "Empowering Careers Through Applied Learning",
      heroSubtext: "Eliweb Skill Solution is a premium skill-development platform designed to bridge the gap between traditional education and industry demand.",
      missionTitle: "Our Mission",
      missionPara1: "At Eliweb Skill Solution, we believe everyone deserves access to high-quality, practical education that leads directly to professional success. We build programs that aren't just about obtaining certificates, but mastering the exact tools, methodologies, and skill sets that companies search for.",
      missionPara2: "Founded with the goal of creating a premium, modern environment for skill development, Eliweb brings expert instructors, dynamic curriculum, and interactive learning environments to students worldwide.",
      brandName: "Eliweb Skill Solution",
      foundedYear: "Est. 2024",
      brandQuote: "We don't teach. We empower. Our students learn to build, ship, and launch their careers with absolute confidence.",
      stats: DEFAULT_ABOUT_STATS,
      valuesHeadline: "Our Core Values",
      valuesSubtext: "How we work, build, and support our community of learners every single day.",
      values: DEFAULT_ABOUT_VALUES,
    }
  });
  console.log("Seeded SiteAboutPage table.");

  // Contact Page
  await db.siteContactPage.upsert({
    where: { id: "singleton" },
    create: {
      id: "singleton",
      pageHeading: "Contact Our Support Team",
      pageSubtext: "Have questions about a course, syllabus, enrollment, or enterprise training? Send us a message and we'll reply shortly.",
      email: "support@eliweb.in",
      emailResponseTime: "Average response time: < 4 hours",
      phone: "+91 98765 43210",
      phoneHours: "Mon–Sat, 9am–6pm IST",
      workingHours: "Monday – Saturday",
      workingHoursTime: "09:00 AM – 06:00 PM IST",
      address: "Eliweb Towers, Sector-62\nNoida, Uttar Pradesh 201301\nIndia",
      mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.4046777672237!2d77.36200257630282!3d28.617631675673757!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce560ff073e51%3A0xe54d8b5840d0246a!2sSector%2062%20Noida%2C%20Uttar%20Pradesh%20201301!5e0!3m2!1sen!2sin!4v1718872500000!5m2!1sen!2sin",
      successMessage: "Thank you for contacting us. One of our course advisors will reach out to you within the next few hours.",
      mapSectionTitle: "Our Campus Location",
      mapSectionDesc: "Come visit us at Sector 62 Noida. Our campus is fully equipped for classroom discussions and hands-on laboratory sessions.",
    },
    update: {
      pageHeading: "Contact Our Support Team",
      pageSubtext: "Have questions about a course, syllabus, enrollment, or enterprise training? Send us a message and we'll reply shortly.",
      email: "support@eliweb.in",
      emailResponseTime: "Average response time: < 4 hours",
      phone: "+91 98765 43210",
      phoneHours: "Mon–Sat, 9am–6pm IST",
      workingHours: "Monday – Saturday",
      workingHoursTime: "09:00 AM – 06:00 PM IST",
      address: "Eliweb Towers, Sector-62\nNoida, Uttar Pradesh 201301\nIndia",
      mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.4046777672237!2d77.36200257630282!3d28.617631675673757!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce560ff073e51%3A0xe54d8b5840d0246a!2sSector%2062%20Noida%2C%20Uttar%20Pradesh%20201301!5e0!3m2!1sen!2sin!4v1718872500000!5m2!1sen!2sin",
      successMessage: "Thank you for contacting us. One of our course advisors will reach out to you within the next few hours.",
      mapSectionTitle: "Our Campus Location",
      mapSectionDesc: "Come visit us at Sector 62 Noida. Our campus is fully equipped for classroom discussions and hands-on laboratory sessions.",
    }
  });
  console.log("Seeded SiteContactPage table.");
  await db.$disconnect();
}

seedCMS().catch(console.error);
