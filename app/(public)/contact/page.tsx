import { db } from "@/lib/db";
import { Footer } from "@/components/footer";
import ContactForm from "./contact-form";
import { Sparkles } from "lucide-react";

export const revalidate = 0;

export default async function ContactPage() {
  const raw = await db.siteContactPage.findUnique({ where: { id: "singleton" } });

  const info = {
    pageHeading:     raw?.pageHeading     ?? "Contact Our Support Team",
    pageSubtext:     raw?.pageSubtext     ?? "Have questions about a course, syllabus, enrollment, or enterprise training? Send us a message and we'll reply shortly.",
    email:           raw?.email           ?? "support@eliweb.in",
    emailResponseTime: raw?.emailResponseTime ?? "Average response time: < 4 hours",
    phone:           raw?.phone           ?? "+91 98765 43210",
    phoneHours:      raw?.phoneHours      ?? "Mon–Sat, 9am–6pm IST",
    workingHours:    raw?.workingHours    ?? "Monday – Saturday",
    workingHoursTime:raw?.workingHoursTime?? "09:00 AM – 06:00 PM IST",
    address:         raw?.address         ?? "Eliweb Towers, Sector-62\nNoida, Uttar Pradesh 201301\nIndia",
    mapEmbedUrl:     raw?.mapEmbedUrl     ?? "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.4046777672237!2d77.36200257630282!3d28.617631675673757!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce560ff073e51%3A0xe54d8b5840d0246a!2sSector%2062%20Noida%2C%20Uttar%20Pradesh%20201301!5e0!3m2!1sen!2sin!4v1718872500000!5m2!1sen!2sin",
    successMessage:  raw?.successMessage  ?? "Thank you for contacting us. One of our course advisors will reach out to you within the next few hours.",
    mapSectionTitle: raw?.mapSectionTitle ?? "Our Campus Location",
    mapSectionDesc:  raw?.mapSectionDesc  ?? "Come visit us at Sector 62 Noida. Our campus is fully equipped for classroom discussions and hands-on laboratory sessions.",
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[var(--background)]">
      <div className="relative py-16 sm:py-24 overflow-hidden flex-1">
        {/* Background */}
        <div className="absolute inset-0 pointer-events-none bg-[var(--gradient-soft)] opacity-80" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(20,96,214,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(20,96,214,0.03)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
          {/* Header */}
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[var(--secondary)] text-[var(--secondary-foreground)] border border-[var(--border)] tracking-wider uppercase">
              <Sparkles className="h-3 w-3" /> Get in Touch
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[var(--foreground)] font-heading leading-tight">
              {info.pageHeading.includes("Support Team")
                ? <>{info.pageHeading.split("Support Team")[0]}<span className="text-gradient">Support Team</span></>
                : info.pageHeading}
            </h1>
            <p className="text-base sm:text-lg text-[var(--muted-foreground)] leading-relaxed font-body">{info.pageSubtext}</p>
          </div>

          {/* Contact form + info */}
          <ContactForm info={info} />

          {/* Map Section */}
          <div className="border border-[var(--border)] bg-[var(--card)] p-6 sm:p-8 rounded-3xl shadow-[var(--shadow-card)] space-y-6">
            <div>
              <h3 className="text-2xl font-extrabold text-[var(--foreground)] font-heading">{info.mapSectionTitle}</h3>
              <p className="text-sm text-[var(--muted-foreground)] mt-1 font-body">{info.mapSectionDesc}</p>
            </div>
            <div className="w-full h-[350px] rounded-2xl overflow-hidden border border-[var(--border)] relative bg-[var(--secondary)]">
              <iframe
                title="Eliweb Campus Location"
                src={info.mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="opacity-90 grayscale-[15%] contrast-[110%] invert-0 dark:invert-[90%] dark:hue-rotate-[180deg]"
              />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
