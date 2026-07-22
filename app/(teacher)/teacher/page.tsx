import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { db } from "@/lib/db";
import Link from "next/link";
import Image from "next/image";
import { Plus, BookOpen, ToggleLeft, ToggleRight, Edit, AlertCircle, Video } from "lucide-react";
import { redirect } from "next/navigation";
import { togglePublishCourse } from "@/lib/actions/course";

// Client component trigger for server action toggles
import PublishButton from "@/components/publish-button";

export default async function TeacherDashboard() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== "TEACHER") {
    redirect("/login");
  }

  const courses = await db.course.findMany({
    where: {
      teacherId: session.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      videos: true,
      enrollments: true,
    },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[var(--border)] pb-8 mb-10">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[var(--foreground)] sm:text-4xl">
            Teacher Workspace
          </h1>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">
            Create, manage, and publish your courses and lectures
          </p>
        </div>
        <Link
          href="/teacher/courses/new"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-semibold shadow-lg shadow-indigo-500/20 transition-all hover:-translate-y-0.5 self-start sm:self-center"
        >
          <Plus className="h-5 w-5" /> Create New Course
        </Link>
      </div>

      {courses.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center p-12 backdrop-blur-md bg-[var(--card)]/40 border border-[var(--border)] rounded-2xl max-w-xl mx-auto">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 mb-6">
            <BookOpen className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-bold text-[var(--foreground)] mb-2">No courses created yet</h3>
          <p className="text-[var(--muted-foreground)] text-sm mb-6 max-w-sm">
            Get started by creating your very first learning course. You can upload thumbnails, customize lectures, and enroll students.
          </p>
          <Link
            href="/teacher/courses/new"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white transition-colors"
          >
            Create Course
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => {
            const formattedPrice = (course.price / 100).toLocaleString("en-IN", {
              style: "currency",
              currency: "INR",
            });
            const videoCount = course.videos.length;
            const studentCount = course.enrollments.filter(e => e.status === "APPROVED").length;

            return (
              <div
                key={course.id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[var(--border)]/80 bg-[var(--card)]/40 hover:border-[var(--border)]/60 transition-all hover:shadow-2xl hover:shadow-indigo-500/5 duration-300"
              >
                <div>
                  {/* Image container */}
                  <div className="relative aspect-video w-full overflow-hidden bg-[var(--background)]">
                    <Image
                      src={course.thumbnailUrl}
                      alt={course.title}
                      fill
                      className="object-cover transition-transform group-hover:scale-105 duration-500"
                      unoptimized
                    />
                    <div className="absolute top-3 right-3 flex gap-2">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold backdrop-blur-md ${
                          course.isPublished
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                            : "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                        }`}
                      >
                        {course.isPublished ? "Published" : "Draft"}
                      </span>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-6">
                    <div className="flex items-center justify-between text-xs text-[var(--muted-foreground)] mb-2">
                      <span className="flex items-center gap-1">
                        <Video className="h-3.5 w-3.5 text-indigo-400" />
                        {videoCount} {videoCount === 1 ? "video" : "videos"}
                      </span>
                      <span>
                        {studentCount} {studentCount === 1 ? "student" : "students"}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-[var(--foreground)] group-hover:text-indigo-400 transition-colors line-clamp-1 mb-2">
                      {course.title}
                    </h3>
                    <p className="text-[var(--muted-foreground)] text-sm line-clamp-2 mb-4">
                      {course.description}
                    </p>
                    <span className="text-lg font-bold text-[var(--foreground)] bg-[var(--background)]/60 px-2.5 py-1 rounded-lg border border-[var(--border)] inline-block">
                      {formattedPrice}
                    </span>
                  </div>
                </div>

                {/* Footer buttons */}
                <div className="flex items-center border-t border-[var(--border)]/80 p-6 bg-[var(--background)]/20 gap-3">
                  <Link
                    href={`/teacher/courses/${course.id}/edit`}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg border border-[var(--border)] bg-[var(--card)] hover:bg-[var(--secondary)] hover:text-[var(--foreground)] transition-colors"
                  >
                    <Edit className="h-3.5 w-3.5" /> Edit
                  </Link>

                  <PublishButton courseId={course.id} initialStatus={course.isPublished} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
