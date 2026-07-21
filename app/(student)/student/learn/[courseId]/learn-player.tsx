"use client";

import { useState } from "react";
import Link from "next/link";
import { Course, CourseVideo } from "@prisma/client";
import { ArrowLeft, Play, Film, CheckCircle2, ChevronRight, BookOpen, AlertCircle } from "lucide-react";

interface LearnPlayerProps {
  course: Course;
  videos: CourseVideo[];
}

export default function LearnPlayer({ course, videos }: LearnPlayerProps) {
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);

  const activeVideo = videos[activeVideoIndex];

  return (
    <div className="bg-[var(--background)] min-h-screen flex flex-col">
      {/* Header bar */}
      <div className="border-b border-slate-900 bg-[var(--background)] px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/student"
            className="p-2 rounded-lg text-slate-450 hover:bg-[var(--card)] hover:text-[var(--foreground)] transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-sm font-extrabold text-[var(--foreground)] sm:text-base truncate max-w-xs md:max-w-md lg:max-w-lg">
              {course.title}
            </h1>
            <p className="text-[10px] text-[var(--muted-foreground)] font-semibold uppercase mt-0.5">Student Learning Dashboard</p>
          </div>
        </div>
      </div>

      {/* Split screen content layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* Left: Video Player */}
        <div className="lg:col-span-8 flex flex-col bg-black p-4 md:p-6 lg:p-8 justify-center min-h-[300px]">
          {videos.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center p-12 text-[var(--muted-foreground)] space-y-3">
              <AlertCircle className="h-10 w-10 text-slate-650" />
              <p className="text-sm">This course does not contain any video lectures yet. Check back soon!</p>
            </div>
          ) : (
            <div className="w-full max-w-5xl mx-auto space-y-6">
              {/* Smart Video Player: YouTube iframe or HTML5 video */}
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-slate-900 bg-black shadow-2xl">
                {activeVideo.videoUrl.includes("youtube.com/embed/") || activeVideo.videoUrl.includes("youtube-nocookie.com/embed/") ? (
                  <iframe
                    key={activeVideo.id}
                    src={`${activeVideo.videoUrl}?autoplay=1&rel=0`}
                    title={activeVideo.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                ) : (
                  <video
                    key={activeVideo.id}
                    src={activeVideo.videoUrl}
                    controls
                    autoPlay
                    className="w-full h-full object-contain"
                  />
                )}
              </div>

              {/* Title & info info */}
              <div className="space-y-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  Lecture {activeVideoIndex + 1} of {videos.length}
                </span>
                <h2 className="text-xl font-bold text-[var(--foreground)] leading-tight">
                  {activeVideo.title}
                </h2>
              </div>
            </div>
          )}
        </div>

        {/* Right: Playlist Sidebar */}
        <div className="lg:col-span-4 border-t lg:border-t-0 lg:border-l border-slate-900 bg-[var(--background)]/45 overflow-y-auto max-h-screen p-4 md:p-6">
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)] flex items-center gap-1.5">
              <BookOpen className="h-4 w-4" /> Lectures Checklist
            </h3>

            <div className="space-y-2">
              {videos.map((video, idx) => {
                const isActive = idx === activeVideoIndex;

                return (
                  <button
                    key={video.id}
                    onClick={() => setActiveVideoIndex(idx)}
                    className={`w-full flex items-start text-left p-4 rounded-xl border transition-all ${
                      isActive
                        ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-400"
                        : "bg-[var(--card)]/10 border-slate-900 hover:border-[var(--border)] text-slate-350 hover:bg-[var(--background)]/30"
                    }`}
                  >
                    <div className="flex gap-3 min-w-0">
                      <div className="shrink-0 mt-0.5">
                        {isActive ? (
                          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500 text-white shadow-md">
                            <Play className="h-2.5 w-2.5 fill-white pl-0.5" />
                          </div>
                        ) : (
                          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--card)] border border-[var(--border)] text-xs font-bold text-[var(--muted-foreground)]">
                            {idx + 1}
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-bold block truncate max-w-[240px]">
                          {video.title}
                        </span>
                        {video.isPreview && (
                          <span className="inline-block text-[9px] font-bold text-indigo-455 mt-1 bg-indigo-500/5 px-1.5 py-0.25 rounded">
                            Free Preview
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
