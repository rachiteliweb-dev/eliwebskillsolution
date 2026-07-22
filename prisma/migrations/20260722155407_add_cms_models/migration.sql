-- CreateEnum
CREATE TYPE "ContactSubmissionStatus" AS ENUM ('UNREAD', 'READ', 'REPLIED');

-- CreateTable
CREATE TABLE "SiteHomePage" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "heroEyebrow" TEXT NOT NULL DEFAULT 'Premium Skill Development Platform',
    "heroHeadline1" TEXT NOT NULL DEFAULT 'Learn Skills.',
    "heroHeadline2" TEXT NOT NULL DEFAULT 'Build a Career.',
    "heroHeadline3" TEXT NOT NULL DEFAULT 'Grow Without Limits.',
    "heroSubtext" TEXT NOT NULL DEFAULT 'Expert-led courses in web development, digital marketing, design & more. Preview free lessons, enroll easily, and learn at your own pace.',
    "heroCta1Label" TEXT NOT NULL DEFAULT 'Explore Courses',
    "heroCta2Label" TEXT NOT NULL DEFAULT 'Start for Free',
    "heroSocialProofCount" TEXT NOT NULL DEFAULT '2,400+',
    "tracksHeadline" TEXT NOT NULL DEFAULT 'Everything You Need to Dominate Online',
    "tracksSubtext" TEXT NOT NULL DEFAULT 'Discover industry-relevant courses created by experts and designed to help you learn, grow, and achieve more.',
    "tracks" JSONB NOT NULL,
    "whyHeadline" TEXT NOT NULL DEFAULT 'Why Students Choose EliWeb Skill Solution',
    "whySubtext" TEXT NOT NULL DEFAULT 'We''re not just another online platform — we''re a community built around real skill outcomes.',
    "whyItems" JSONB NOT NULL,
    "stats" JSONB NOT NULL,
    "stepsHeadline" TEXT NOT NULL DEFAULT 'How It Works',
    "steps" JSONB NOT NULL,
    "testimonialsHeadline" TEXT NOT NULL DEFAULT 'What Our Students Say',
    "testimonialsSubtext" TEXT NOT NULL DEFAULT 'Hear what learners and people who trusted us have to say.',
    "testimonials" JSONB NOT NULL,
    "faqHeadline" TEXT NOT NULL DEFAULT 'Common Questions',
    "faqs" JSONB NOT NULL,
    "ctaHeadline" TEXT NOT NULL DEFAULT 'Ready to Build Your Dream Career?',
    "ctaSubtext" TEXT NOT NULL DEFAULT 'Join 2,400+ students who are already transforming their careers with EliWeb Skill Solution. Start with a free preview — no payment required.',
    "ctaBtn1Label" TEXT NOT NULL DEFAULT 'Browse All Courses',
    "ctaBtn2Label" TEXT NOT NULL DEFAULT 'Create Free Account',

    CONSTRAINT "SiteHomePage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SiteAboutPage" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "heroHeadline" TEXT NOT NULL DEFAULT 'Empowering Careers Through Applied Learning',
    "heroSubtext" TEXT NOT NULL DEFAULT 'Eliweb Skill Solution is a premium skill-development platform designed to bridge the gap between traditional education and industry demand.',
    "missionTitle" TEXT NOT NULL DEFAULT 'Our Mission',
    "missionPara1" TEXT NOT NULL DEFAULT 'At Eliweb Skill Solution, we believe everyone deserves access to high-quality, practical education that leads directly to professional success.',
    "missionPara2" TEXT NOT NULL DEFAULT 'Founded with the goal of creating a premium, modern environment for skill development, Eliweb brings expert instructors, dynamic curriculum, and interactive learning environments to students worldwide.',
    "brandName" TEXT NOT NULL DEFAULT 'Eliweb Skill Solution',
    "foundedYear" TEXT NOT NULL DEFAULT 'Est. 2024',
    "brandQuote" TEXT NOT NULL DEFAULT 'We don''t teach. We empower. Our students learn to build, ship, and launch their careers with absolute confidence.',
    "stats" JSONB NOT NULL,
    "valuesHeadline" TEXT NOT NULL DEFAULT 'Our Core Values',
    "valuesSubtext" TEXT NOT NULL DEFAULT 'How we work, build, and support our community of learners every single day.',
    "values" JSONB NOT NULL,

    CONSTRAINT "SiteAboutPage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SiteContactPage" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "pageHeading" TEXT NOT NULL DEFAULT 'Contact Our Support Team',
    "pageSubtext" TEXT NOT NULL DEFAULT 'Have questions about a course, syllabus, enrollment, or enterprise training? Send us a message and we''ll reply shortly.',
    "email" TEXT NOT NULL DEFAULT 'support@eliweb.in',
    "emailResponseTime" TEXT NOT NULL DEFAULT 'Average response time: < 4 hours',
    "phone" TEXT NOT NULL DEFAULT '+91 98765 43210',
    "phoneHours" TEXT NOT NULL DEFAULT 'Mon–Sat, 9am–6pm IST',
    "workingHours" TEXT NOT NULL DEFAULT 'Monday – Saturday',
    "workingHoursTime" TEXT NOT NULL DEFAULT '09:00 AM – 06:00 PM IST',
    "address" TEXT NOT NULL DEFAULT 'Eliweb Towers, Sector-62
Noida, Uttar Pradesh 201301
India',
    "mapEmbedUrl" TEXT NOT NULL DEFAULT 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.4046777672237!2d77.36200257630282!3d28.617631675673757!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce560ff073e51%3A0xe54d8b5840d0246a!2sSector%2062%20Noida%2C%20Uttar%20Pradesh%20201301!5e0!3m2!1sen!2sin!4v1718872500000!5m2!1sen!2sin',
    "successMessage" TEXT NOT NULL DEFAULT 'Thank you for contacting us. One of our course advisors will reach out to you within the next few hours.',
    "mapSectionTitle" TEXT NOT NULL DEFAULT 'Our Campus Location',
    "mapSectionDesc" TEXT NOT NULL DEFAULT 'Come visit us at Sector 62 Noida. Our campus is fully equipped for classroom discussions and hands-on laboratory sessions.',

    CONSTRAINT "SiteContactPage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactSubmission" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "subject" TEXT,
    "message" TEXT NOT NULL,
    "track" TEXT,
    "status" "ContactSubmissionStatus" NOT NULL DEFAULT 'UNREAD',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContactSubmission_pkey" PRIMARY KEY ("id")
);
