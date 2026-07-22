"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Home, Info, Phone, Inbox, Layout } from "lucide-react";
import HomeForm from "./home-form";
import AboutForm from "./about-form";
import ContactPageForm from "./contact-page-form";
import SubmissionsPanel from "./submissions";
import type { SiteHomePage, SiteAboutPage, SiteContactPage, ContactSubmission } from "@prisma/client";

interface Props {
  homePage:     SiteHomePage | null;
  aboutPage:    SiteAboutPage | null;
  contactPage:  SiteContactPage | null;
  submissions:  ContactSubmission[];
}

const TABS = [
  { id: "home",    label: "Home Page",    icon: Home },
  { id: "about",   label: "About Page",   icon: Info },
  { id: "contact", label: "Contact Page", icon: Phone },
  { id: "inbox",   label: "Submissions",  icon: Inbox },
];

export default function CmsDashboard({ homePage, aboutPage, contactPage, submissions }: Props) {
  const [activeTab, setActiveTab] = useState("home");
  const unread = submissions.filter(s => s.status === "UNREAD").length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div>
        <Link href="/admin" className="inline-flex items-center gap-1.5 text-sm text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>
        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-200/50 dark:border-white/10 flex items-center justify-center">
            <Layout className="h-5 w-5 text-blue-500" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-[var(--foreground)] font-heading">
              CMS &amp; Page Management
            </h1>
            <p className="text-sm text-[var(--muted-foreground)] mt-0.5">
              Edit the content of your public pages — changes apply instantly.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-[var(--secondary)] border border-[var(--border)] rounded-2xl w-fit flex-wrap">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all relative ${
              activeTab === tab.id
                ? "bg-[var(--card)] text-[var(--foreground)] shadow-sm border border-[var(--border)]"
                : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
            {tab.id === "inbox" && unread > 0 && (
              <span className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                {unread > 9 ? "9+" : unread}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <div>
        {activeTab === "home"    && <HomeForm    homePage={homePage} />}
        {activeTab === "about"   && <AboutForm   aboutPage={aboutPage} />}
        {activeTab === "contact" && <ContactPageForm contactPage={contactPage} />}
        {activeTab === "inbox"   && <SubmissionsPanel submissions={submissions} />}
      </div>
    </div>
  );
}
