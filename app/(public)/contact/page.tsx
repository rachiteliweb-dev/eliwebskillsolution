"use client";

import { useState } from "react";
import { Footer } from "@/components/footer";
import {
  Mail, Phone, Clock, MapPin, Send, CheckCircle2, Sparkles, AlertCircle
} from "lucide-react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [track, setTrack] = useState("Web Development");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      setStatus("error");
      return;
    }
    setStatus("submitting");

    // Simulate API call
    setTimeout(() => {
      setStatus("success");
      setName("");
      setEmail("");
      setPhone("");
      setSubject("");
      setMessage("");
    }, 1200);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[var(--background)]">
      <div className="relative py-16 sm:py-24 overflow-hidden flex-1">
        {/* Background Soft Orbs */}
        <div className="absolute inset-0 pointer-events-none bg-[var(--gradient-soft)] opacity-80" />

        {/* Grid Drift Effect */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(20,96,214,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(20,96,214,0.03)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
          {/* Header */}
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[var(--secondary)] text-[var(--secondary-foreground)] border border-[var(--border)] tracking-wider uppercase">
              <Sparkles className="h-3 w-3" /> Get in Touch
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[var(--foreground)] font-heading leading-tight">
              Contact Our <span className="text-gradient">Support Team</span>
            </h1>
            <p className="text-base sm:text-lg text-[var(--muted-foreground)] leading-relaxed font-body">
              Have questions about a course, syllabus, enrollment, or enterprise training? Send us a message and we'll reply shortly.
            </p>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Contact Details Card */}
            <div className="lg:col-span-4 border border-[var(--border)] bg-[var(--card)] p-8 rounded-3xl shadow-[var(--shadow-card)] space-y-8">
              <div>
                <h3 className="text-2xl font-extrabold text-[var(--foreground)] font-heading">
                  Contact Info
                </h3>
                <p className="text-sm text-[var(--muted-foreground)] mt-2 font-body">
                  Reach out to us directly or drop by during business hours.
                </p>
              </div>

              <div className="space-y-6">
                {/* Mail */}
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-[var(--secondary)] text-[var(--primary)] shrink-0">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[var(--foreground)]">Email Us</h4>
                    <p className="text-sm text-[var(--muted-foreground)] font-body mt-1">support@eliweb.in</p>
                    <p className="text-xs text-[var(--muted-foreground)] font-body mt-0.5">Average response time: &lt; 4 hours</p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-[var(--secondary)] text-[var(--primary)] shrink-0">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[var(--foreground)]">Call Us</h4>
                    <p className="text-sm text-[var(--muted-foreground)] font-body mt-1">+91 98765 43210</p>
                    <p className="text-xs text-[var(--muted-foreground)] font-body mt-0.5">Mon–Sat, 9am–6pm IST</p>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-[var(--secondary)] text-[var(--primary)] shrink-0">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[var(--foreground)]">Working Hours</h4>
                    <p className="text-sm text-[var(--muted-foreground)] font-body mt-1">Monday – Saturday</p>
                    <p className="text-xs text-[var(--muted-foreground)] font-body mt-0.5">09:00 AM – 06:00 PM IST</p>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-[var(--secondary)] text-[var(--primary)] shrink-0">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[var(--foreground)]">Headquarters</h4>
                    <p className="text-sm text-[var(--muted-foreground)] font-body mt-1">
                      Eliweb Towers, Sector-62<br />
                      Noida, Uttar Pradesh 201301<br />
                      India
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Card */}
            <div className="lg:col-span-8 border border-[var(--border)] bg-[var(--card)] p-8 sm:p-10 rounded-3xl shadow-[var(--shadow-card)] relative overflow-hidden">
              {status === "success" && (
                <div className="absolute inset-0 bg-[var(--card)] z-20 flex flex-col items-center justify-center p-6 text-center space-y-4 animate-fade-in">
                  <div className="p-4 rounded-full bg-emerald-500/10 text-emerald-500 animate-scale-in">
                    <CheckCircle2 className="h-16 w-16" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-[var(--foreground)] font-heading">
                    Message Sent Successfully!
                  </h3>
                  <p className="text-sm sm:text-base text-[var(--muted-foreground)] max-w-md font-body">
                    Thank you for contacting us. One of our course advisors will reach out to you within the next few hours.
                  </p>
                  <button
                    onClick={() => setStatus("idle")}
                    className="mt-4 px-6 py-2 rounded-xl text-sm font-bold bg-[var(--secondary)] text-[var(--secondary-foreground)] border border-[var(--border)] hover:bg-[var(--border)] transition-all"
                  >
                    Send another message
                  </button>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <h3 className="text-2xl font-extrabold text-[var(--foreground)] font-heading">
                  Send a Message
                </h3>

                {status === "error" && (
                  <div className="p-4 rounded-xl bg-red-500/10 text-red-500 flex items-center gap-2.5 text-sm font-semibold">
                    <AlertCircle className="h-5 w-5 shrink-0" />
                    <span>Please fill out all required fields (Name, Email, and Message).</span>
                  </div>
                )}

                {/* Name & Email Group */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--secondary)] text-[var(--foreground)] text-sm font-medium focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="john@example.com"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--secondary)] text-[var(--foreground)] text-sm font-medium focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all"
                    />
                  </div>
                </div>

                {/* Phone & Track Group */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--secondary)] text-[var(--foreground)] text-sm font-medium focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="track" className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
                      Skill Track of Interest
                    </label>
                    <select
                      id="track"
                      value={track}
                      onChange={(e) => setTrack(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--secondary)] text-[var(--foreground)] text-sm font-semibold focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all cursor-pointer"
                    >
                      <option value="Web Development">Web Development</option>
                      <option value="Digital Marketing">Digital Marketing</option>
                      <option value="UI/UX Design">UI/UX Design</option>
                      <option value="Data Science">Data Science</option>
                      <option value="Mobile App Development">Mobile App Development</option>
                      <option value="General Query">General Query / Other</option>
                    </select>
                  </div>
                </div>

                {/* Subject */}
                <div className="space-y-2">
                  <label htmlFor="subject" className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="How can we help you?"
                    className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--secondary)] text-[var(--foreground)] text-sm font-medium focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all"
                  />
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <label htmlFor="message" className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
                    Your Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={5}
                    placeholder="Tell us details about your learning goals or custom enterprise requests..."
                    required
                    className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--secondary)] text-[var(--foreground)] text-sm font-medium focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all resize-none"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold bg-[var(--primary)] text-[var(--primary-foreground)] shadow-[var(--shadow-glow)] hover:opacity-90 transition-all text-sm disabled:opacity-50 cursor-pointer"
                >
                  {status === "submitting" ? (
                    "Sending Message..."
                  ) : (
                    <>
                      <Send className="h-4 w-4" /> Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Map Location Section */}
          <div className="border border-[var(--border)] bg-[var(--card)] p-6 sm:p-8 rounded-3xl shadow-[var(--shadow-card)] space-y-6">
            <div>
              <h3 className="text-2xl font-extrabold text-[var(--foreground)] font-heading">
                Our Campus Location
              </h3>
              <p className="text-sm text-[var(--muted-foreground)] mt-1 font-body">
                Come visit us at Sector 62 Noida. Our campus is fully equipped for classroom discussions and hands-on laboratory sessions.
              </p>
            </div>
            <div className="w-full h-[350px] rounded-2xl overflow-hidden border border-[var(--border)] relative bg-[var(--secondary)]">
              <iframe
                title="Eliweb Noida Campus Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.4046777672237!2d77.36200257630282!3d28.617631675673757!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce560ff073e51%3A0xe54d8b5840d0246a!2sSector%2062%20Noida%2C%20Uttar%20Pradesh%20201301!5e0!3m2!1sen!2sin!4v1718872500000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
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
