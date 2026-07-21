import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { AlertCircle, ArrowLeft, ShieldAlert } from "lucide-react";
import LearnPlayer from "./learn-player";

interface LearnPageProps {
  params: Promise<{ courseId: string }> | { courseId: string };
}

export const revalidate = 0; // Dynamic gated validation

export default async function LearnPage({ params }: LearnPageProps) {
  const resolvedParams = await params;
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "STUDENT") {
    redirect("/login");
  }

  const courseId = resolvedParams.courseId;

  // 1. Query the Enrollment status server-side first
  const enrollment = await db.enrollment.findUnique({
    where: {
      studentId_courseId: {
        studentId: session.user.id,
        courseId: courseId,
      },
    },
  });

  // CRITICAL SECURITY RULE: If status is not APPROVED, do NOT fetch or pass videoUrl to the client!
  if (!enrollment || enrollment.status !== "APPROVED") {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 mx-auto">
          <ShieldAlert className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-extrabold text-[var(--foreground)]">Verification in Progress</h1>
        <p className="text-[var(--muted-foreground)] text-sm max-w-md mx-auto leading-normal">
          You do not have active access to this course. Your payment receipt is currently awaiting administrative approval, or it has been rejected.
        </p>
        <div className="pt-4 flex justify-center gap-4">
          <Link
            href="/student"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--card)] text-xs font-bold text-[var(--foreground)] hover:text-[var(--foreground)] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Go to Dashboard
          </Link>
          <Link
            href={`/courses/${courseId}`}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-xs font-bold text-white transition-colors"
          >
            View Course Detail
          </Link>
        </div>
      </div>
    );
  }

  // 2. Since APPROVED, we are permitted to query course details and video URLs
  const course = await db.course.findUnique({
    where: { id: courseId },
    include: {
      videos: {
        orderBy: { order: "asc" },
      },
    },
  });

  if (!course) {
    redirect("/student");
  }

  return (
    <LearnPlayer
      course={course}
      videos={course.videos}
    />
  );
}
