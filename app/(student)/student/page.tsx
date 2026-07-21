import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { db } from "@/lib/db";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { BookOpen, AlertTriangle, CheckCircle2, XCircle, Play, Sparkles } from "lucide-react";

export const revalidate = 0; // Fresh enrollment status check

export default async function StudentDashboard() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "STUDENT") {
    redirect("/login");
  }

  const enrollments = await db.enrollment.findMany({
    where: {
      studentId: session.user.id,
    },
    include: {
      course: {
        include: {
          teacher: {
            select: {
              name: true,
            },
          },
          videos: {
            select: {
              id: true,
            },
          },
        },
      },
      payments: {
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="border-b border-[var(--border)] pb-8 mb-10">
        <h1 className="text-3xl font-extrabold tracking-tight text-[var(--foreground)] sm:text-4xl">
          My Learning Dashboard
        </h1>
        <p className="mt-2 text-sm text-[var(--muted-foreground)]">
          Track your course enrollment approvals and access active lectures
        </p>
      </div>

      {enrollments.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center p-12 backdrop-blur-md bg-[var(--card)]/40 border border-[var(--border)] rounded-2xl max-w-xl mx-auto">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 mb-6">
            <BookOpen className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-bold text-[var(--foreground)] mb-2">No enrolled courses</h3>
          <p className="text-[var(--muted-foreground)] text-sm mb-6 max-w-sm">
            You haven&apos;t enrolled in any courses yet. Browse our extensive public catalog and start your learning journey!
          </p>
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white transition-all shadow-md"
          >
            Browse Course Catalog
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrollments.map((item) => {
            const course = item.course;
            const status = item.status;
            const latestPayment = item.payments[0];
            const videoCount = course.videos.length;

            return (
              <div
                key={item.id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] hover:border-[var(--ring)] transition-all duration-300 shadow-sm hover:shadow-lg"
              >
                <div>
                  {/* Thumbnail */}
                  <div className="relative aspect-video w-full overflow-hidden bg-[var(--background)]">
                    <Image
                      src={course.thumbnailUrl}
                      alt={course.title}
                      fill
                      className="object-cover transition-transform group-hover:scale-101 duration-500"
                      unoptimized
                    />
                    <div className="absolute top-3 right-3">
                      {status === "PENDING" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-md bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                          <AlertTriangle className="h-3.5 w-3.5" /> Verification Pending
                        </span>
                      )}
                      {status === "APPROVED" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-md bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Approved
                        </span>
                      )}
                      {status === "REJECTED" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-md bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30">
                          <XCircle className="h-3.5 w-3.5" /> Rejected
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-6">
                    <span className="text-[10px] text-[var(--primary)] font-bold uppercase tracking-wider">
                      Instructor: {course.teacher.name}
                    </span>
                    <h3 className="text-lg font-bold text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors line-clamp-1 mb-2 mt-1">
                      {course.title}
                    </h3>
                    <p className="text-[var(--muted-foreground)] text-xs line-clamp-2 mb-4 leading-normal">
                      {course.description}
                    </p>

                    {/* Meta info */}
                    {status === "PENDING" && latestPayment && (
                      <div className="text-[10px] text-[var(--muted-foreground)] bg-[var(--secondary)] border border-[var(--border)] rounded-lg p-2.5 space-y-1 mt-4">
                        <div>
                          Txn ID: <span className="font-mono text-[var(--foreground)]">{latestPayment.transactionRef}</span>
                        </div>
                        <div>
                          Submitted: <span className="text-[var(--foreground)] opacity-80">{new Date(latestPayment.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    )}

                    {status === "REJECTED" && (
                      <div className="text-[10px] text-rose-600 dark:text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-lg p-2.5 mt-4 leading-normal">
                        Your payment upload was rejected. Please review your bank reference code and resubmit payment details to get approval.
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Button Actions */}
                <div className="flex items-center border-t border-[var(--border)] p-6 bg-[var(--secondary)]/40">
                  {status === "APPROVED" && (
                    <Link
                      href={`/student/learn/${course.id}`}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white transition-all shadow-md"
                    >
                      <Play className="h-4 w-4 fill-white" /> Learn Now ({videoCount} {videoCount === 1 ? "lesson" : "lessons"})
                    </Link>
                  )}

                  {status === "PENDING" && (
                    <button
                      disabled
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[var(--secondary)] border border-[var(--border)] text-xs font-bold text-[var(--muted-foreground)] cursor-not-allowed"
                    >
                      Awaiting Verification
                    </button>
                  )}

                  {status === "REJECTED" && (
                    <Link
                      href={`/student/enroll/${course.id}`}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-xs font-bold text-white transition-all shadow-md"
                    >
                      Resubmit Details
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
