"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createTeacher } from "@/lib/actions/admin";
import { User, Mail, Lock, Plus, ArrowLeft, Loader2, Check, AlertCircle, BookOpen } from "lucide-react";

interface TeacherWithCourses {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  courses: { id: string }[];
}

interface TeachersClientProps {
  teachers: TeacherWithCourses[];
}

export default function TeachersClient({ teachers }: TeachersClientProps) {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);

    try {
      const res = await createTeacher(formData);
      if (res?.error) {
        setError(res.error);
        setLoading(false);
      } else {
        setSuccess(true);
        setName("");
        setEmail("");
        setPassword("");
        setLoading(false);
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        href="/admin"
        className="inline-flex items-center gap-1.5 text-sm text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors mb-8"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Dashboard
      </Link>

      <div className="border-b border-[var(--border)] pb-8 mb-10">
        <h1 className="text-3xl font-extrabold tracking-tight text-[var(--foreground)] sm:text-4xl font-heading">
          Teacher Management
        </h1>
        <p className="mt-2 text-sm text-[var(--muted-foreground)]">
          Create verified educator accounts. Teachers can create curricula, upload lecture videos, and manage learning content.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Create Teacher Form */}
        <div className="lg:col-span-5">
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 shadow-[var(--shadow-card)]">
            <h2 className="text-lg font-bold text-[var(--foreground)] mb-6 flex items-center gap-2 font-heading">
              <Plus className="h-5 w-5 text-[var(--primary)]" /> Create Teacher Account
            </h2>

            {error && (
              <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/35 p-3 text-xs text-red-500 flex items-start gap-1.5">
                <AlertCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="mb-4 rounded-lg bg-emerald-500/10 border border-emerald-500/35 p-3 text-xs text-emerald-600 flex items-center gap-1.5">
                <Check className="h-4 w-4 text-emerald-600" />
                <span>Teacher account created successfully</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label htmlFor="name" className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                  Full Name
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[var(--muted-foreground)]">
                    <User className="h-4.5 w-4.5" />
                  </span>
                  <input
                    id="name"
                    type="text"
                    required
                    placeholder="Dr. Sarah Connor"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full pl-10 pr-3.5 py-2.5 bg-[var(--surface)] border border-[var(--border)] rounded-lg text-[var(--foreground)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 focus:border-[var(--primary)]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[var(--muted-foreground)]">
                    <Mail className="h-4.5 w-4.5" />
                  </span>
                  <input
                    id="email"
                    type="email"
                    required
                    placeholder="sarah@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3.5 py-2.5 bg-[var(--surface)] border border-[var(--border)] rounded-lg text-[var(--foreground)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 focus:border-[var(--primary)]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                  Temporary Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[var(--muted-foreground)]">
                    <Lock className="h-4.5 w-4.5" />
                  </span>
                  <input
                    id="password"
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-3.5 py-2.5 bg-[var(--surface)] border border-[var(--border)] rounded-lg text-[var(--foreground)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 focus:border-[var(--primary)]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2.5 rounded-lg bg-[var(--primary)] hover:opacity-90 text-[var(--primary-foreground)] font-semibold text-sm shadow-[var(--shadow-glow)] transition-all disabled:opacity-50"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Register Teacher"}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Educators List */}
        <div className="lg:col-span-7">
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 shadow-[var(--shadow-card)]">
            <h2 className="text-lg font-bold text-[var(--foreground)] mb-6 font-heading">Existing Educators</h2>

            {teachers.length === 0 ? (
              <div className="text-center py-10 border border-dashed border-[var(--border)] rounded-xl bg-[var(--surface)]">
                <User className="h-8 w-8 text-[var(--muted-foreground)] mx-auto mb-2" />
                <p className="text-sm text-[var(--muted-foreground)] font-medium">No teacher accounts created yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--border)] text-xs text-[var(--muted-foreground)] uppercase tracking-wider">
                      <th className="py-3 font-semibold">Name</th>
                      <th className="py-3 font-semibold">Email</th>
                      <th className="py-3 font-semibold text-center">Courses</th>
                      <th className="py-3 font-semibold text-right">Created On</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border)] text-sm text-[var(--foreground)]">
                    {teachers.map((teacher) => (
                      <tr key={teacher.id} className="hover:bg-[var(--secondary)] transition-colors">
                        <td className="py-3.5 font-bold text-[var(--foreground)]">{teacher.name}</td>
                        <td className="py-3.5 font-mono text-xs text-[var(--muted-foreground)]">{teacher.email}</td>
                        <td className="py-3.5 text-center font-semibold text-[var(--primary)]">
                          <span className="flex items-center justify-center gap-1">
                            <BookOpen className="h-3.5 w-3.5 text-[var(--muted-foreground)]" /> {teacher.courses.length}
                          </span>
                        </td>
                        <td className="py-3.5 text-right text-xs text-[var(--muted-foreground)]">
                          {new Date(teacher.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
