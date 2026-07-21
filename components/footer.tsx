"use client";

import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface)] py-14 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative h-10 w-10 shrink-0">
                <Image
                  src="/favicon.png"
                  alt="Eliweb Skill Solution logo"
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
              <div className="flex flex-col leading-none">
                <div className="text-lg font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-500 font-heading">EliWeb</div>
                <div className="text-[10px] font-bold text-[var(--muted-foreground)] tracking-widest uppercase">Skill Solution</div>
              </div>
            </div>
            <p className="text-sm text-[var(--muted-foreground)] leading-relaxed max-w-[240px]">
              Expert-led skill development for students and professionals who want real results.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[var(--primary)] mb-5">Platform</h4>
            <ul className="space-y-3">
              {[
                { name: "All Courses",  href: "/courses" },
                { name: "About Us",     href: "/about" },
                { name: "Contact Us",   href: "/contact" },
                { name: "Login",        href: "/login" },
                { name: "Register",     href: "/register" },
              ].map((l) => (
                <li key={l.name}>
                  <Link href={l.href} className="footer-link text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tracks */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[var(--primary)] mb-5">Skill Tracks</h4>
            <ul className="space-y-3">
              {["Web Development","Digital Marketing","UI/UX Design","Data Science"].map((t) => (
                <li key={t}>
                  <Link href="/courses" className="footer-link text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
                    {t}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[var(--primary)] mb-5">Contact</h4>
            <ul className="space-y-3 text-sm text-[var(--muted-foreground)]">
              <li className="hover:text-[var(--foreground)] transition-colors cursor-pointer">support@eliweb.in</li>
              <li className="hover:text-[var(--foreground)] transition-colors cursor-pointer">+91 98765 43210</li>
              <li>Mon–Sat, 9am–6pm IST</li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[var(--border)] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[var(--muted-foreground)]">
            © {new Date().getFullYear()} Eliweb Skill Solution. All rights reserved.
          </p>
          <div className="flex gap-6">
            {[
              { name: "Privacy Policy", href: "/privacy" },
              { name: "Terms of Service", href: "/terms" },
              { name: "Refund Policy", href: "/refund" }
            ].map((l) => (
              <Link key={l.name} href={l.href} className="text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
                {l.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
