"use client";

import { useState } from "react";
import { submitContactForm } from "@/lib/actions/contact";
import { toast } from "react-toastify";
import {
  Mail, Phone, Clock, MapPin, Send, CheckCircle2, AlertCircle
} from "lucide-react";

interface ContactInfo {
  email: string;
  emailResponseTime: string;
  phone: string;
  phoneHours: string;
  workingHours: string;
  workingHoursTime: string;
  address: string;
  successMessage: string;
}

export default function ContactForm({ info }: { info: ContactInfo }) {
  const [name, setName]       = useState("");
  const [email, setEmail]     = useState("");
  const [phone, setPhone]     = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [track, setTrack]     = useState("Web Development");
  const [status, setStatus]   = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      setStatus("error");
      setErrorMsg("Please fill out all required fields (Name, Email, and Message).");
      toast.warning("Please fill out all required fields!");
      return;
    }
    setStatus("submitting");
    setErrorMsg("");
    const result = await submitContactForm({ name, email, phone, subject, message, track });
    if (result.error) {
      setStatus("error");
      setErrorMsg(result.error);
      toast.error(`Failed to send message: ${result.error}`);
    } else {
      setStatus("success");
      toast.success("Message sent successfully!");
      setName(""); setEmail(""); setPhone(""); setSubject(""); setMessage("");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Contact Details Card */}
      <div className="lg:col-span-4 border border-[var(--border)] bg-[var(--card)] p-8 rounded-3xl shadow-[var(--shadow-card)] space-y-8">
        <div>
          <h3 className="text-2xl font-extrabold text-[var(--foreground)] font-heading">Contact Info</h3>
          <p className="text-sm text-[var(--muted-foreground)] mt-2 font-body">Reach out to us directly or drop by during business hours.</p>
        </div>
        <div className="space-y-6">
          {/* Email */}
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-[var(--secondary)] text-[var(--primary)] shrink-0"><Mail className="h-5 w-5" /></div>
            <div>
              <h4 className="text-sm font-bold text-[var(--foreground)]">Email Us</h4>
              <p className="text-sm text-[var(--muted-foreground)] font-body mt-1">{info.email}</p>
              <p className="text-xs text-[var(--muted-foreground)] font-body mt-0.5">{info.emailResponseTime}</p>
            </div>
          </div>
          {/* Phone */}
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-[var(--secondary)] text-[var(--primary)] shrink-0"><Phone className="h-5 w-5" /></div>
            <div>
              <h4 className="text-sm font-bold text-[var(--foreground)]">Call Us</h4>
              <p className="text-sm text-[var(--muted-foreground)] font-body mt-1">{info.phone}</p>
              <p className="text-xs text-[var(--muted-foreground)] font-body mt-0.5">{info.phoneHours}</p>
            </div>
          </div>
          {/* Hours */}
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-[var(--secondary)] text-[var(--primary)] shrink-0"><Clock className="h-5 w-5" /></div>
            <div>
              <h4 className="text-sm font-bold text-[var(--foreground)]">Working Hours</h4>
              <p className="text-sm text-[var(--muted-foreground)] font-body mt-1">{info.workingHours}</p>
              <p className="text-xs text-[var(--muted-foreground)] font-body mt-0.5">{info.workingHoursTime}</p>
            </div>
          </div>
          {/* Address */}
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-[var(--secondary)] text-[var(--primary)] shrink-0"><MapPin className="h-5 w-5" /></div>
            <div>
              <h4 className="text-sm font-bold text-[var(--foreground)]">Headquarters</h4>
              <p className="text-sm text-[var(--muted-foreground)] font-body mt-1 whitespace-pre-line">{info.address}</p>
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
            <h3 className="text-2xl font-extrabold text-[var(--foreground)] font-heading">Message Sent Successfully!</h3>
            <p className="text-sm sm:text-base text-[var(--muted-foreground)] max-w-md font-body">{info.successMessage}</p>
            <button onClick={() => setStatus("idle")} className="mt-4 px-6 py-2 rounded-xl text-sm font-bold bg-[var(--secondary)] text-[var(--secondary-foreground)] border border-[var(--border)] hover:bg-[var(--border)] transition-all">
              Send another message
            </button>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <h3 className="text-2xl font-extrabold text-[var(--foreground)] font-heading">Send a Message</h3>
          {status === "error" && (
            <div className="p-4 rounded-xl bg-red-500/10 text-red-500 flex items-center gap-2.5 text-sm font-semibold">
              <AlertCircle className="h-5 w-5 shrink-0" /><span>{errorMsg}</span>
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="cf-name" className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">Full Name <span className="text-red-500">*</span></label>
              <input type="text" id="cf-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" required className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--secondary)] text-[var(--foreground)] text-sm font-medium focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all" />
            </div>
            <div className="space-y-2">
              <label htmlFor="cf-email" className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">Email Address <span className="text-red-500">*</span></label>
              <input type="email" id="cf-email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john@example.com" required className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--secondary)] text-[var(--foreground)] text-sm font-medium focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="cf-phone" className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">Phone Number</label>
              <input type="tel" id="cf-phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98765 43210" className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--secondary)] text-[var(--foreground)] text-sm font-medium focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all" />
            </div>
            <div className="space-y-2">
              <label htmlFor="cf-track" className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">Skill Track of Interest</label>
              <select id="cf-track" value={track} onChange={(e) => setTrack(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--secondary)] text-[var(--foreground)] text-sm font-semibold focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all cursor-pointer">
                <option value="Web Development">Web Development</option>
                <option value="Digital Marketing">Digital Marketing</option>
                <option value="UI/UX Design">UI/UX Design</option>
                <option value="Data Science">Data Science</option>
                <option value="Mobile App Development">Mobile App Development</option>
                <option value="General Query">General Query / Other</option>
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="cf-subject" className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">Subject</label>
            <input type="text" id="cf-subject" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="How can we help you?" className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--secondary)] text-[var(--foreground)] text-sm font-medium focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all" />
          </div>
          <div className="space-y-2">
            <label htmlFor="cf-message" className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">Your Message <span className="text-red-500">*</span></label>
            <textarea id="cf-message" value={message} onChange={(e) => setMessage(e.target.value)} rows={5} placeholder="Tell us details about your learning goals or custom enterprise requests..." required className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--secondary)] text-[var(--foreground)] text-sm font-medium focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all resize-none" />
          </div>
          <button type="submit" disabled={status === "submitting"} className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold bg-[var(--primary)] text-[var(--primary-foreground)] shadow-[var(--shadow-glow)] hover:opacity-90 transition-all text-sm disabled:opacity-50 cursor-pointer">
            {status === "submitting" ? "Sending Message..." : <><Send className="h-4 w-4" /> Send Message</>}
          </button>
        </form>
      </div>
    </div>
  );
}
