"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LogOut, Menu, X, ShieldAlert, GraduationCap,
  LayoutDashboard, Settings, FileCheck, BookOpen, FileText,
} from "lucide-react";
import { useState, useEffect } from "react";
import { ThemeToggle } from "@/components/theme-toggle";

export function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const role = session?.user?.role;
  const isActive = (path: string) => pathname === path;
  const isLandingPage = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks: { name: string; href: string; icon?: React.ElementType }[] = [];

  if (!session) {
    navLinks.push(
      { name: "Home",     href: "/" },
      { name: "Courses",  href: "/courses" },
      { name: "About",    href: "/about" },
      { name: "Contact",  href: "/contact" },
      { name: "Login",    href: "/login" },
    );
  } else {
    if (role === "ADMIN") {
      navLinks.push(
        { name: "Dashboard", href: "/admin",              icon: LayoutDashboard },
        { name: "Teachers",  href: "/admin/teachers",     icon: GraduationCap },
        { name: "Approvals", href: "/admin/approvals",    icon: FileCheck },
        { name: "CMS",       href: "/admin/cms",          icon: FileText },
        { name: "Settings",  href: "/admin/settings",     icon: Settings },
      );
    } else if (role === "TEACHER") {
      navLinks.push(
        { name: "My Courses", href: "/teacher",             icon: LayoutDashboard },
        { name: "New Course", href: "/teacher/courses/new", icon: BookOpen },
      );
    } else if (role === "STUDENT") {
      navLinks.push(
        { name: "Browse",       href: "/courses",  icon: BookOpen },
        { name: "My Learnings", href: "/student",  icon: LayoutDashboard },
      );
    }
  }

  return (
    <nav
      className={`${isLandingPage ? "fixed w-full" : "sticky"} top-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? "bg-surface-elevated backdrop-blur-xl border-border shadow-[var(--shadow-navbar)]"
          : isLandingPage 
            ? "bg-transparent border-transparent"
            : "bg-surface border-border"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <div className="relative h-10 w-10 group-hover:scale-105 transition-transform">
              <Image
                src="/favicon.png"
                alt="eliweb Skill Solution logo"
                fill
                className="object-contain"
                priority
                unoptimized
              />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-lg font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-500 font-heading">EliWeb</span>
              <span className="text-[10px] font-bold text-[var(--muted-foreground)] tracking-widest uppercase">Skill Solution</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="desktop-nav-custom items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  isActive(link.href)
                    ? "bg-primary text-primary-foreground shadow-inner"
                    : "text-foreground hover:bg-secondary hover:text-primary"
                }`}
              >
                {link.icon && <link.icon className="h-4 w-4" />}
                {link.name}
              </Link>
            ))}

            {!session && (
              <div className="flex items-center gap-3 ml-2 pl-3 border-l border-[var(--border)]">
                <ThemeToggle />
                <Link
                  href="/register"
                  className="px-6 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] hover:scale-105 transition-all"
                >
                  Get Started
                </Link>
              </div>
            )}

            {session && (
              <div className="flex items-center gap-4 pl-4 border-l border-white/10 ml-2">
                <ThemeToggle />
                <div className="flex flex-col text-right">
                  <span className="text-sm font-bold text-foreground">{session.user.name}</span>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center justify-end gap-1">
                    {role === "ADMIN"   && <ShieldAlert  className="h-3 w-3 text-rose-500" />}
                    {role === "TEACHER" && <GraduationCap className="h-3 w-3 text-primary" />}
                    {role}
                  </span>
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="flex items-center justify-center p-2 rounded-full text-muted-foreground hover:bg-red-500/10 hover:text-red-500 transition-all"
                  title="Sign Out"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>

          {/* Mobile Toggle */}
          <div className="mobile-toggle-custom items-center gap-3">
            <ThemeToggle />
            {session && (
              <span className="text-sm font-bold text-foreground">{session.user.name}</span>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-full text-foreground hover:bg-secondary transition-colors"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-surface-elevated backdrop-blur-xl px-4 pt-3 pb-6 space-y-2 absolute w-full shadow-2xl">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold transition-all ${
                isActive(link.href)
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-secondary hover:text-primary"
              }`}
            >
              {link.icon && <link.icon className="h-5 w-5" />}
              {link.name}
            </Link>
          ))}

          {!session && (
            <Link
              href="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl text-base font-bold bg-gradient-to-r from-blue-500 to-cyan-500 text-white mt-4 shadow-lg"
            >
              Get Started Free
            </Link>
          )}

          {session && (
            <div className="pt-4 border-t border-border mt-4 flex items-center justify-between px-2">
              <span className="text-xs font-bold text-primary uppercase tracking-widest">
                Role: {role}
              </span>
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-destructive hover:bg-destructive/10 text-sm font-bold transition-all"
              >
                <LogOut className="h-4 w-4" /> Logout
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
