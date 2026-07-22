"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateContactPage } from "@/lib/actions/admin";
import {
  Check, AlertCircle, Loader2, Phone, Mail, Clock, MapPin, ChevronDown, ChevronUp
} from "lucide-react";
// Removed Prisma client type import to avoid build-time cache synchronization issues
type SiteContactPage = any;

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

export default function ContactPageForm({ contactPage }: { contactPage: SiteContactPage | null }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const [success, setSuccess] = useState(false);

  const [pageHeading,      setPageHeading]      = useState(contactPage?.pageHeading      ?? "Contact Our Support Team");
  const [pageSubtext,      setPageSubtext]      = useState(contactPage?.pageSubtext      ?? "Have questions? Send us a message and we'll reply shortly.");
  const [email,            setEmail]            = useState(contactPage?.email            ?? "support@eliweb.in");
  const [emailResponseTime,setEmailResponseTime]= useState(contactPage?.emailResponseTime?? "Average response time: < 4 hours");
  const [phone,            setPhone]            = useState(contactPage?.phone            ?? "+91 98765 43210");
  const [phoneHours,       setPhoneHours]       = useState(contactPage?.phoneHours       ?? "Mon–Sat, 9am–6pm IST");
  const [workingHours,     setWorkingHours]     = useState(contactPage?.workingHours     ?? "Monday – Saturday");
  const [workingHoursTime, setWorkingHoursTime] = useState(contactPage?.workingHoursTime ?? "09:00 AM – 06:00 PM IST");
  const [address,          setAddress]          = useState(contactPage?.address          ?? "Eliweb Towers, Sector-62\nNoida, Uttar Pradesh 201301\nIndia");
  const [mapEmbedUrl,      setMapEmbedUrl]      = useState(contactPage?.mapEmbedUrl      ?? "");
  const [successMessage,   setSuccessMessage]   = useState(contactPage?.successMessage   ?? "Thank you for contacting us. One of our course advisors will reach out within a few hours.");
  const [mapSectionTitle,  setMapSectionTitle]  = useState(contactPage?.mapSectionTitle  ?? "Our Campus Location");
  const [mapSectionDesc,   setMapSectionDesc]   = useState(contactPage?.mapSectionDesc   ?? "Come visit us. Our campus is fully equipped for classroom discussions.");

  const handleSave = async () => {
    setLoading(true); setError(""); setSuccess(false);
    const res = await updateContactPage({
      pageHeading, pageSubtext, email, emailResponseTime, phone, phoneHours,
      workingHours, workingHoursTime, address, mapEmbedUrl, successMessage,
      mapSectionTitle, mapSectionDesc,
    });
    if (res.error) { setError(res.error); } else { setSuccess(true); router.refresh(); }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      {error   && <div className="p-4 rounded-xl bg-red-500/10 text-red-500 flex items-center gap-2 text-sm font-semibold"><AlertCircle className="h-5 w-5" />{error}</div>}
      {success && <div className="p-4 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center gap-2 text-sm font-semibold"><Check className="h-5 w-5" />Contact page saved! Changes are live on <a href="/contact" target="_blank" className="underline">/contact</a>.</div>}

      {/* Page Header */}
      <SectionCard title="Page Header" icon={Phone}>
        <Field label="Page Heading"  value={pageHeading} onChange={setPageHeading} />
        <Field label="Page Sub-text" value={pageSubtext} onChange={setPageSubtext} textarea rows={2} />
      </SectionCard>

      {/* Contact Info */}
      <SectionCard title="Contact Details" icon={Mail}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Email Address"        value={email}             onChange={setEmail} />
          <Field label="Email Response Time"  value={emailResponseTime} onChange={setEmailResponseTime} />
          <Field label="Phone Number"         value={phone}             onChange={setPhone} />
          <Field label="Phone Hours"          value={phoneHours}        onChange={setPhoneHours} />
          <Field label="Working Hours"        value={workingHours}      onChange={setWorkingHours} />
          <Field label="Working Hours Time"   value={workingHoursTime}  onChange={setWorkingHoursTime} />
        </div>
        <Field label="Office Address (each line = new line)" value={address} onChange={setAddress} textarea rows={3} />
      </SectionCard>

      {/* Map */}
      <SectionCard title="Map Section" icon={MapPin}>
        <Field label="Map Section Title"       value={mapSectionTitle} onChange={setMapSectionTitle} />
        <Field label="Map Section Description" value={mapSectionDesc}  onChange={setMapSectionDesc} textarea rows={2} />
        <Field label="Google Maps Embed URL (paste the src= URL from Google Maps embed code)" value={mapEmbedUrl} onChange={setMapEmbedUrl} />
        {mapEmbedUrl && (
          <div className="mt-2 h-48 rounded-xl overflow-hidden border border-[var(--border)]">
            <iframe src={mapEmbedUrl} width="100%" height="100%" style={{ border: 0 }} loading="lazy" title="Map Preview" />
          </div>
        )}
      </SectionCard>

      {/* Form config */}
      <SectionCard title="Contact Form Settings" icon={Clock}>
        <Field label="Success Message (shown after submission)" value={successMessage} onChange={setSuccessMessage} textarea rows={3} />
      </SectionCard>

      <button onClick={handleSave} disabled={loading} className="w-full flex justify-center items-center gap-2 py-3 rounded-xl bg-[var(--primary)] hover:opacity-90 text-[var(--primary-foreground)] font-bold text-sm shadow-[var(--shadow-glow)] transition-all disabled:opacity-50">
        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <><Check className="h-5 w-5" /> Save Contact Page</>}
      </button>
    </div>
  );
}
