"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Course, CourseVideo, Enrollment } from "@prisma/client";
import { Session } from "next-auth";
import { Play, Lock, Eye, Video, ShieldAlert, GraduationCap, X, ChevronRight, CheckCircle, AlertTriangle, AlertCircle } from "lucide-react";

interface CourseDetailClientProps {
  course: Course & {
    teacher: { name: string; email: string };
    videos: CourseVideo[];
  };
  session: Session | null;
  enrollment: Enrollment | null;
}

export default function CourseDetailClient({ course, session, enrollment }: CourseDetailClientProps) {
  const [activePreviewUrl, setActivePreviewUrl] = useState<string | null>(null);
  const [activePreviewTitle, setActivePreviewTitle] = useState<string | null>(null);

  const priceFormatted = (course.price / 100).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });

  const isGuest = !session;
  const isStudent = session?.user?.role === "STUDENT";
  const isAdmin = session?.user?.role === "ADMIN";
  const isTeacher = session?.user?.role === "TEACHER";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Course details & curriculum */}
        <div className="lg:col-span-8 space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[var(--foreground)] leading-tight font-heading">
              {course.title}
            </h1>
            <p className="text-[var(--muted-foreground)] text-base md:text-lg leading-relaxed max-w-3xl">
              {course.description}
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-[var(--muted-foreground)] pt-2">
              <span className="flex items-center gap-1">
                Instructor: <span className="font-semibold text-[var(--foreground)]">{course.teacher.name}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Video className="h-4 w-4 text-[var(--primary)]" />
                {course.videos.length} {course.videos.length === 1 ? "lecture" : "lectures"}
              </span>
            </div>
          </div>

          {/* Curriculum */}
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 shadow-[var(--shadow-card)]">
            <h2 className="text-lg font-bold text-[var(--foreground)] mb-6 font-heading">Course Curriculum</h2>
            <div className="space-y-3">
              {course.videos.map((video, idx) => (
                <div
                  key={video.id}
                  className="flex items-center justify-between p-4 bg-[var(--surface)] border border-[var(--border)] rounded-xl hover:border-[var(--primary)]/30 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xs font-bold text-[var(--muted-foreground)] w-5 shrink-0 text-center">
                      {idx + 1}
                    </span>
                    <h4 className="text-sm font-bold text-[var(--foreground)] truncate pr-2">
                      {video.title}
                    </h4>
                  </div>

                  <div className="shrink-0 ml-4">
                    {video.isPreview ? (
                      <button
                        onClick={() => {
                          setActivePreviewUrl(video.videoUrl);
                          setActivePreviewTitle(video.title);
                        }}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[color-mix(in_oklab,var(--primary)_12%,transparent)] hover:bg-[color-mix(in_oklab,var(--primary)_20%,transparent)] border border-[color-mix(in_oklab,var(--primary)_25%,transparent)] hover:border-[color-mix(in_oklab,var(--primary)_40%,transparent)] text-xs font-bold text-[var(--primary)] transition-all"
                      >
                        <Play className="h-3.5 w-3.5 fill-[var(--primary)]" /> Preview Lesson
                      </button>
                    ) : (
                      <div className="flex items-center gap-1 text-xs font-semibold text-[var(--muted-foreground)] px-3 py-1.5">
                        <Lock className="h-3.5 w-3.5" /> Locked
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {course.videos.length === 0 && (
                <div className="text-center py-8 text-[var(--muted-foreground)] text-sm">
                  Curriculum details are currently being finalized.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Enrollment Card */}
        <div className="lg:col-span-4 sticky top-24">
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-[var(--shadow-card)]">
            {/* Thumbnail */}
            <div className="relative aspect-video w-full overflow-hidden bg-[var(--surface)]">
              <Image
                src={course.thumbnailUrl}
                alt={course.title}
                fill
                className="object-cover"
                unoptimized
              />
              {/* Optional overlay play icon if there is a preview video available */}
              {course.videos.some((v) => v.isPreview) && (
                <button
                  onClick={() => {
                    const firstPreview = course.videos.find((v) => v.isPreview);
                    if (firstPreview) {
                      setActivePreviewUrl(firstPreview.videoUrl);
                      setActivePreviewTitle(firstPreview.title);
                    }
                  }}
                  className="absolute inset-0 m-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--primary)]/90 text-[var(--primary-foreground)] shadow-lg hover:scale-105 transition-transform"
                >
                  <Play className="h-6 w-6 fill-[var(--primary-foreground)] pl-0.5" />
                </button>
              )}
            </div>

            {/* Content info */}
            <div className="p-6 space-y-6">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-[var(--foreground)]">{priceFormatted}</span>
                <span className="text-[var(--muted-foreground)] text-xs font-semibold">One-time payment</span>
              </div>

              {/* Action Buttons based on authorization status */}
              <div className="space-y-3">
                {isGuest && (
                  <Link
                    href={`/login?callbackUrl=/courses/${course.id}`}
                    className="w-full flex justify-center py-3 rounded-xl bg-[var(--primary)] hover:opacity-90 text-[var(--primary-foreground)] font-bold text-sm shadow-[var(--shadow-glow)] transition-all hover:-translate-y-0.5"
                  >
                    Login to Enroll
                  </Link>
                )}

                {isAdmin && (
                  <div className="text-center rounded-xl bg-[var(--surface)] border border-[var(--border)] p-4">
                    <ShieldAlert className="h-6 w-6 text-rose-500 mx-auto mb-2" />
                    <p className="text-xs text-[var(--muted-foreground)]">
                      Logged in as <span className="font-bold text-[var(--foreground)]">Admin</span>. You have administrative access.
                    </p>
                  </div>
                )}

                {isTeacher && (
                  <div className="text-center rounded-xl bg-[var(--surface)] border border-[var(--border)] p-4">
                    <GraduationCap className="h-6 w-6 text-[var(--primary)] mx-auto mb-2" />
                    <p className="text-xs text-[var(--muted-foreground)]">
                      Logged in as <span className="font-bold text-[var(--foreground)]">Teacher</span>. Access edit workspace from your dashboard.
                    </p>
                  </div>
                )}

                {isStudent && (
                  <>
                    {!enrollment && (
                      <Link
                        href={`/student/enroll/${course.id}`}
                        className="w-full flex justify-center py-3 rounded-xl bg-[var(--primary)] hover:opacity-90 text-[var(--primary-foreground)] font-bold text-sm shadow-[var(--shadow-glow)] transition-all hover:-translate-y-0.5"
                      >
                        Enroll Now
                      </Link>
                    )}

                    {enrollment?.status === "PENDING" && (
                      <div className="rounded-xl bg-amber-500/10 border border-amber-500/30 p-4 space-y-3">
                        <div className="flex gap-2">
                          <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />
                          <div>
                            <h4 className="text-xs font-bold text-[var(--foreground)]">Enrollment Pending</h4>
                            <p className="text-[10px] text-[var(--muted-foreground)] mt-1 leading-normal">
                              We have received your payment receipt screenshot. Your request is pending verification by the administration.
                            </p>
                          </div>
                        </div>
                        <Link
                          href="/student"
                          className="w-full block text-center py-2 rounded-lg bg-[var(--surface)] hover:bg-[var(--secondary)] border border-[var(--border)] text-xs font-semibold text-[var(--muted-foreground)] transition-colors"
                        >
                          Check My Status
                        </Link>
                      </div>
                    )}

                    {enrollment?.status === "APPROVED" && (
                      <Link
                        href={`/student/learn/${course.id}`}
                        className="w-full flex justify-center py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/20 transition-all hover:-translate-y-0.5"
                      >
                        Start Learning <ChevronRight className="h-5 w-5 ml-1" />
                      </Link>
                    )}

                    {enrollment?.status === "REJECTED" && (
                      <div className="rounded-xl bg-red-500/10 border border-red-500/35 p-4 space-y-3">
                        <div className="flex gap-2">
                          <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />
                          <div>
                            <h4 className="text-xs font-bold text-[var(--foreground)]">Payment Rejected</h4>
                            <p className="text-[10px] text-[var(--muted-foreground)] mt-1 leading-normal">
                              Your previously uploaded payment receipt or transaction ID was rejected by the admin. Please verify and submit your payment details again.
                            </p>
                          </div>
                        </div>
                        <Link
                          href={`/student/enroll/${course.id}`}
                          className="w-full block text-center py-2 rounded-lg bg-red-600 hover:bg-red-700 text-xs font-semibold text-white transition-colors"
                        >
                          Re-submit Payment Details
                        </Link>
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className="text-[10px] text-[var(--muted-foreground)] text-center leading-normal">
                Includes full lifetime access, downloadable resources, and interactive lectures.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Video Modal */}
      {activePreviewUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[var(--background)]/90 backdrop-blur-md">
          <div className="relative w-full max-w-4xl bg-[var(--card)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)] bg-[var(--surface)]">
              <h3 className="text-sm font-bold text-[var(--foreground)] truncate max-w-md">
                Preview: {activePreviewTitle}
              </h3>
              <button
                onClick={() => {
                  setActivePreviewUrl(null);
                  setActivePreviewTitle(null);
                }}
                className="p-1 rounded-lg text-[var(--muted-foreground)] hover:bg-[var(--secondary)] hover:text-[var(--foreground)] transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Video Player */}
            <div className="relative aspect-video w-full bg-black">
              {activePreviewUrl.includes("youtube.com/embed/") || activePreviewUrl.includes("youtube-nocookie.com/embed/") ? (
                <iframe
                  src={`${activePreviewUrl}?autoplay=1&rel=0`}
                  title={activePreviewTitle || "Preview"}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              ) : (
                <video
                  src={activePreviewUrl}
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
