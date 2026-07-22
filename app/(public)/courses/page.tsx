import { db } from "@/lib/db";
import Link from "next/link";
import Image from "next/image";
import { BookOpen, Video, ArrowRight, BookOpenCheck, Sparkles } from "lucide-react";
import { Footer } from "@/components/footer";

export const revalidate = 0; // Disable server caching for dynamic catalog updates

export default async function CoursesCatalogPage() {
  const courses = await db.course.findMany({
    where: {
      isPublished: true,
    },
    orderBy: {
      createdAt: "desc",
    },
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
  });

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[var(--background)]">
      <div className="relative py-16 sm:py-24 overflow-hidden flex-1">
        {/* Background Soft Orbs */}
        <div className="absolute inset-0 pointer-events-none bg-[var(--gradient-soft)] opacity-80" />

        {/* Grid Drift Effect */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(20,96,214,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(20,96,214,0.03)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="border-b border-[var(--border)] pb-8 mb-12 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[var(--secondary)] text-[var(--secondary-foreground)] border border-[var(--border)] tracking-wider uppercase">
              <Sparkles className="h-3 w-3" /> Explore Catalog
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[var(--foreground)] font-heading leading-tight">
              Our Course <span className="text-gradient">Catalog</span>
            </h1>
            <p className="text-base text-[var(--muted-foreground)] font-body">
              Browse through all published courses and find your next learning adventure.
            </p>
          </div>

          {courses.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center p-16 border border-[var(--border)] bg-[var(--card)] rounded-2xl max-w-lg mx-auto shadow-[var(--shadow-card)] space-y-4">
              <BookOpenCheck className="h-12 w-12 text-[var(--muted-foreground)]" />
              <h3 className="text-xl font-bold text-[var(--foreground)] font-heading">No courses available</h3>
              <p className="text-[var(--muted-foreground)] text-sm font-body">
                All courses are currently in draft or undergoing review. Please check back later!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course) => {
                const priceFormatted = (course.price / 100).toLocaleString("en-IN", {
                  style: "currency",
                  currency: "INR",
                });
                const videoCount = course.videos.length;

                return (
                  <div
                    key={course.id}
                    className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] hover:border-[var(--primary)] hover:shadow-[var(--shadow-cyan)] transition-all duration-300"
                  >
                    <div>
                      {/* Thumbnail */}
                      <div className="relative aspect-video w-full overflow-hidden bg-[var(--secondary)]">
                        <Image
                          src={course.thumbnailUrl}
                          alt={course.title}
                          fill
                          className="object-cover transition-transform group-hover:scale-105 duration-500"
                          unoptimized
                        />
                      </div>

                      {/* Body */}
                      <div className="p-6 space-y-3">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[var(--primary)] bg-[var(--secondary)] px-2.5 py-1 rounded-lg border border-[var(--border)]">
                            <Video className="h-3 w-3" /> {videoCount} {videoCount === 1 ? "Lesson" : "Lessons"}
                          </span>
                        </div>

                        <h3 className="text-lg font-bold text-[var(--foreground)] font-heading group-hover:text-[var(--primary)] transition-colors line-clamp-1">
                          {course.title}
                        </h3>

                        <p className="text-[var(--muted-foreground)] text-sm font-body line-clamp-2 leading-relaxed">
                          {course.description}
                        </p>

                        <div className="flex items-center justify-between pt-3 border-t border-[var(--border)] text-xs text-[var(--muted-foreground)] font-body">
                          <span>Instructor: <span className="font-semibold text-[var(--foreground)]">{course.teacher.name}</span></span>
                        </div>
                      </div>
                    </div>

                    {/* Footer price + CTA */}
                    <div className="flex items-center justify-between border-t border-[var(--border)] p-6 bg-[var(--secondary)]/40">
                      <span className="text-lg font-bold text-[var(--foreground)]">{priceFormatted}</span>
                      <Link
                        href={`/courses/${course.id}`}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--primary)] hover:opacity-90 text-xs font-bold text-[var(--primary-foreground)] shadow-[var(--shadow-glow)] transition-all"
                      >
                        View Course <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
