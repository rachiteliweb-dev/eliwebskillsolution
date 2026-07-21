"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createCourse } from "@/lib/actions/course";
import { FileUpload } from "@/components/file-upload";
import { ArrowLeft, Loader2, BookOpen, AlertCircle } from "lucide-react";

export default function NewCoursePage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!thumbnailUrl) {
      setError("Please upload a course thumbnail image");
      return;
    }

    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("thumbnailUrl", thumbnailUrl);

    try {
      const res = await createCourse(formData);
      if (res?.error) {
        setError(res.error);
        setLoading(false);
      } else if (res?.success) {
        router.refresh();
        router.push(`/teacher/courses/${res.courseId}/edit`);
      }
    } catch (err) {
      setError("An unexpected error occurred");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Link
        href="/teacher"
        className="inline-flex items-center gap-1.5 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors mb-8"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Dashboard
      </Link>

      <div className="space-y-4 mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-[var(--foreground)] sm:text-4xl">
          Create New Course
        </h1>
        <p className="text-sm text-[var(--muted-foreground)]">
          Provide basic details for your new curriculum. You will be able to organize videos in the next step.
        </p>
      </div>

      <div className="backdrop-blur-md bg-[var(--card)]/60 border border-[var(--border)] rounded-2xl p-8 shadow-2xl">
        {error && (
          <div className="mb-6 rounded-lg bg-red-500/10 border border-red-500/35 p-4 text-sm text-red-400 flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="title" className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
              Course Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Advanced TypeScript Deep Dive"
              className="block w-full px-4 py-3 bg-[var(--background)] border border-[var(--border)] rounded-xl text-[var(--foreground)] placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
              Course Description
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Write a compelling overview of what students will learn..."
              className="block w-full px-4 py-3 bg-[var(--background)] border border-[var(--border)] rounded-xl text-[var(--foreground)] placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-colors resize-none"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="price" className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
              Price (USD)
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-[var(--muted-foreground)] font-semibold">$</span>
              <input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="49.99"
                className="block w-full pl-8 pr-4 py-3 bg-[var(--background)] border border-[var(--border)] rounded-xl text-[var(--foreground)] placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)] block">
              Course Thumbnail Image
            </label>
            <FileUpload
              endpoint="courseThumbnail"
              onChange={(url) => setThumbnailUrl(url || "")}
              value={thumbnailUrl}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group relative flex w-full justify-center rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-950 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <span className="flex items-center gap-2">
                Continue to Video Manager <BookOpen className="h-4 w-4" />
              </span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
