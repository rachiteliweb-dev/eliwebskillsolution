import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { Users, GraduationCap, BookOpen, AlertCircle, Sparkles, TrendingUp, CheckSquare } from "lucide-react";
import Link from "next/link";

export const revalidate = 0; // Dynamic metrics loading

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  // Fetch counts
  const studentCount = await db.user.count({ where: { role: "STUDENT" } });
  const teacherCount = await db.user.count({ where: { role: "TEACHER" } });
  const courseCount = await db.course.count();
  const pendingApprovalsCount = await db.enrollment.count({ where: { status: "PENDING" } });

  // Get recent 5 pending enrollments
  const pendingApprovals = await db.enrollment.findMany({
    where: { status: "PENDING" },
    include: {
      student: { select: { name: true, email: true } },
      course: { select: { title: true, price: true } },
    },
    take: 5,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-[var(--foreground)] sm:text-4xl font-heading">
          Admin Portal
        </h1>
        <p className="mt-2 text-sm text-[var(--muted-foreground)]">
          Monitor platforms stats, manage educators, and approve enrollment requests.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Pending approvals card */}
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 flex items-center justify-between shadow-[var(--shadow-card)] relative overflow-hidden group card-hover">
          <div className="space-y-1">
            <span className="text-xs text-[var(--muted-foreground)] uppercase font-bold tracking-wider">Pending Approvals</span>
            <h3 className="text-3xl font-extrabold text-[var(--foreground)]">{pendingApprovalsCount}</h3>
          </div>
          <div className="h-12 w-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <AlertCircle className="h-6 w-6" />
          </div>
        </div>

        {/* Courses card */}
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 flex items-center justify-between shadow-[var(--shadow-card)] relative overflow-hidden group card-hover">
          <div className="space-y-1">
            <span className="text-xs text-[var(--muted-foreground)] uppercase font-bold tracking-wider">Total Courses</span>
            <h3 className="text-3xl font-extrabold text-[var(--foreground)]">{courseCount}</h3>
          </div>
          <div className="h-12 w-12 rounded-xl bg-[color-mix(in_oklab,var(--primary)_12%,transparent)] text-[var(--primary)] flex items-center justify-center">
            <BookOpen className="h-6 w-6" />
          </div>
        </div>

        {/* Teachers card */}
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 flex items-center justify-between shadow-[var(--shadow-card)] relative overflow-hidden group card-hover">
          <div className="space-y-1">
            <span className="text-xs text-[var(--muted-foreground)] uppercase font-bold tracking-wider">Educators</span>
            <h3 className="text-3xl font-extrabold text-[var(--foreground)]">{teacherCount}</h3>
          </div>
          <div className="h-12 w-12 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
            <GraduationCap className="h-6 w-6" />
          </div>
        </div>

        {/* Students card */}
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 flex items-center justify-between shadow-[var(--shadow-card)] relative overflow-hidden group card-hover">
          <div className="space-y-1">
            <span className="text-xs text-[var(--muted-foreground)] uppercase font-bold tracking-wider">Enrolled Students</span>
            <h3 className="text-3xl font-extrabold text-[var(--foreground)]">{studentCount}</h3>
          </div>
          <div className="h-12 w-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <Users className="h-6 w-6" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick actions panel */}
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 shadow-[var(--shadow-card)] space-y-4">
          <h2 className="text-lg font-bold text-[var(--foreground)] mb-2 font-heading">Administrative Shortcuts</h2>
          <div className="flex flex-col gap-3">
            <Link
              href="/admin/approvals"
              className="flex items-center justify-between p-4 bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--primary)] rounded-xl transition-colors group"
            >
              <span className="text-sm font-semibold text-[var(--foreground)]">Verification Queue</span>
              <span className="text-xs text-[var(--primary)] group-hover:translate-x-1 transition-transform">Go &rarr;</span>
            </Link>
            <Link
              href="/admin/teachers"
              className="flex items-center justify-between p-4 bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--primary)] rounded-xl transition-colors group"
            >
              <span className="text-sm font-semibold text-[var(--foreground)]">Register Educator</span>
              <span className="text-xs text-[var(--primary)] group-hover:translate-x-1 transition-transform">Go &rarr;</span>
            </Link>
            <Link
              href="/admin/settings"
              className="flex items-center justify-between p-4 bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--primary)] rounded-xl transition-colors group"
            >
              <span className="text-sm font-semibold text-[var(--foreground)]">Payment Settings</span>
              <span className="text-xs text-[var(--primary)] group-hover:translate-x-1 transition-transform">Go &rarr;</span>
            </Link>
          </div>
        </div>

        {/* Recent pending approvals queue */}
        <div className="lg:col-span-2 bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 shadow-[var(--shadow-card)] space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[var(--foreground)] font-heading">Recent Pending Approvals</h2>
            <Link href="/admin/approvals" className="text-xs text-[var(--primary)] hover:opacity-80 transition-colors font-semibold">
              View full list
            </Link>
          </div>

          <div className="space-y-3">
            {pendingApprovals.length === 0 ? (
              <div className="text-center py-8 text-[var(--muted-foreground)] text-sm">
                No pending verification requests at this time.
              </div>
            ) : (
              pendingApprovals.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3.5 bg-[var(--surface)] border border-[var(--border)] rounded-xl"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-[var(--foreground)] truncate">{item.course.title}</p>
                    <p className="text-[10px] text-[var(--muted-foreground)] mt-0.5">
                      Student: <span className="font-semibold text-[var(--foreground)]">{item.student.name}</span> ({item.student.email})
                    </p>
                  </div>
                  <span className="text-xs font-bold text-[var(--foreground)] ml-4 shrink-0">
                    {(item.course.price / 100).toLocaleString("en-US", { style: "currency", currency: "USD" })}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
