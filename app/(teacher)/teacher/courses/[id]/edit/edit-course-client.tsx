"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Course, CourseVideo } from "@prisma/client";
import { updateCourse, addCourseVideo, deleteCourseVideo, reorderCourseVideos } from "@/lib/actions/course";
import { FileUpload } from "@/components/file-upload";
import { ArrowLeft, Loader2, Play, Trash2, ArrowUp, ArrowDown, Sparkles, Check, Film, Eye, AlertCircle, Link2, Upload } from "lucide-react";

interface EditCourseClientProps {
  course: Course & {
    videos: CourseVideo[];
  };
}

export default function EditCourseClient({ course }: EditCourseClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Course Details State
  const [title, setTitle] = useState(course.title);
  const [description, setDescription] = useState(course.description);
  const [price, setPrice] = useState((course.price / 100).toString());
  const [thumbnailUrl, setThumbnailUrl] = useState(course.thumbnailUrl);
  const [detailsError, setDetailsError] = useState("");
  const [detailsSuccess, setDetailsSuccess] = useState(false);

  // New Video Form State
  const [videoTitle, setVideoTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [videoIsPreview, setVideoIsPreview] = useState(false);
  const [videoError, setVideoError] = useState("");
  const [videoSuccess, setVideoSuccess] = useState(false);
  const [videoUploading, setVideoUploading] = useState(false);
  // Video source toggle: "upload" | "link"
  const [videoSourceType, setVideoSourceType] = useState<"upload" | "link">("upload");
  const [videoLinkInput, setVideoLinkInput] = useState("");

  // Reordering state
  const [videosList, setVideosList] = useState<CourseVideo[]>(course.videos);

  // Handle Course details submit
  const handleDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setDetailsError("");
    setDetailsSuccess(false);

    if (!thumbnailUrl) {
      setDetailsError("Thumbnail image is required");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("thumbnailUrl", thumbnailUrl);

    startTransition(async () => {
      const res = await updateCourse(course.id, formData);
      if (res?.error) {
        setDetailsError(res.error);
      } else {
        setDetailsSuccess(true);
        router.refresh();
      }
    });
  };

  // Handle Video upload submit
  const handleAddVideoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setVideoError("");
    setVideoSuccess(false);

    // Determine the final URL based on the source type
    let finalUrl = videoUrl;
    if (videoSourceType === "link") {
      const trimmed = videoLinkInput.trim();
      if (!trimmed) {
        setVideoError("Please enter a valid video URL or YouTube link");
        return;
      }
      // Convert YouTube watch URLs to embed format for iframe playback
      const ytMatch =
        trimmed.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{11})/) ||
        trimmed.match(/youtube\.com\/shorts\/([\w-]{11})/);
      if (ytMatch) {
        finalUrl = `https://www.youtube.com/embed/${ytMatch[1]}`;
      } else {
        // Accept any other URL as-is (Vimeo, direct MP4, etc.)
        finalUrl = trimmed;
      }
    }

    if (!finalUrl) {
      setVideoError(videoSourceType === "upload" ? "Please upload a video file first" : "Please enter a valid video URL or YouTube link");
      return;
    }

    const formData = new FormData();
    formData.append("title", videoTitle);
    formData.append("videoUrl", finalUrl);
    formData.append("isPreview", videoIsPreview ? "true" : "false");

    setVideoUploading(true);
    try {
      const res = await addCourseVideo(course.id, formData);
      if (res?.error) {
        setVideoError(res.error);
        setVideoUploading(false);
      } else {
        setVideoSuccess(true);
        setVideoTitle("");
        setVideoUrl("");
        setVideoLinkInput("");
        setVideoIsPreview(false);
        setVideoUploading(false);
        router.refresh();
        // Wait briefly for Prisma refresh before local sync
        setTimeout(() => {
          window.location.reload();
        }, 800);
      }
    } catch (err) {
      setVideoError("An unexpected error occurred");
      setVideoUploading(false);
    }
  };

  // Handle Video Delete
  const handleDeleteVideo = async (videoId: string) => {
    if (!confirm("Are you sure you want to delete this video?")) return;

    try {
      const res = await deleteCourseVideo(videoId, course.id);
      if (res?.error) {
        alert(res.error);
      } else {
        setVideosList(videosList.filter((v) => v.id !== videoId));
        router.refresh();
      }
    } catch (err) {
      alert("Failed to delete video");
    }
  };

  // Move Video Up/Down in ordering
  const handleMoveVideo = async (index: number, direction: "up" | "down") => {
    const list = [...videosList];
    const targetIndex = direction === "up" ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= list.length) return;

    // Swap elements
    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;

    // Recalculate order indices
    const updatedList = list.map((item, idx) => ({
      ...item,
      order: idx + 1,
    }));

    setVideosList(updatedList);

    // Call server action to persist changes in DB
    const apiPayload = updatedList.map((item) => ({
      id: item.id,
      order: item.order,
    }));

    const res = await reorderCourseVideos(course.id, apiPayload);
    if (res?.error) {
      alert(res.error);
      // Revert if API fails
      setVideosList(course.videos);
    } else {
      router.refresh();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        href="/teacher"
        className="inline-flex items-center gap-1.5 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors mb-8"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Dashboard
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-[var(--border)] pb-8 mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[var(--foreground)] sm:text-4xl">
            Edit Course: {course.title}
          </h1>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">
            Modify course details, upload video lectures, and toggle student visibility
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/courses/${course.id}`}
            target="_blank"
            className="px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--card)] text-sm font-semibold hover:bg-[var(--secondary)] hover:text-[var(--foreground)] transition-all"
          >
            Preview Catalog Detail
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Edit Course Metadata */}
        <div className="lg:col-span-5 space-y-6">
          <div className="backdrop-blur-md bg-[var(--card)]/60 border border-[var(--border)] rounded-2xl p-6 shadow-xl">
            <h2 className="text-lg font-bold text-[var(--foreground)] mb-6 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-indigo-400" /> Course Settings
            </h2>

            {detailsError && (
              <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/35 p-3 text-xs text-red-400 flex items-start gap-1.5">
                <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                <span>{detailsError}</span>
              </div>
            )}

            {detailsSuccess && (
              <div className="mb-4 rounded-lg bg-emerald-500/10 border border-emerald-500/35 p-3 text-xs text-emerald-400 flex items-center gap-1.5">
                <Check className="h-4 w-4 text-emerald-400" />
                <span>Changes saved successfully</span>
              </div>
            )}

            <form onSubmit={handleDetailsSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="block w-full px-3.5 py-2.5 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--foreground)] text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Description</label>
                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="block w-full px-3.5 py-2.5 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--foreground)] text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Price (INR)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[var(--muted-foreground)] text-sm font-semibold">₹</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="block w-full pl-7 pr-3.5 py-2.5 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--foreground)] text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)] block mb-1">Thumbnail</label>
                <FileUpload
                  endpoint="courseThumbnail"
                  onChange={(url) => setThumbnailUrl(url || "")}
                  value={thumbnailUrl}
                />
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full flex justify-center py-2.5 rounded-lg bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-semibold text-sm shadow-md transition-all disabled:opacity-50"
              >
                {isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : "Save Settings"}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Manage Videos */}
        <div className="lg:col-span-7 space-y-6">
          {/* Lecture list */}
          <div className="backdrop-blur-md bg-[var(--card)]/60 border border-[var(--border)] rounded-2xl p-6 shadow-xl">
            <h2 className="text-lg font-bold text-[var(--foreground)] mb-6 flex items-center gap-2">
              <Film className="h-5 w-5 text-indigo-400" /> Lecture Videos
            </h2>

            {videosList.length === 0 ? (
              <div className="text-center py-10 border border-dashed border-[var(--border)] rounded-xl bg-[var(--background)]/20">
                <Film className="h-8 w-8 text-slate-600 mx-auto mb-2" />
                <p className="text-sm text-[var(--muted-foreground)]">No lectures uploaded for this course yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {videosList.map((video, index) => (
                  <div
                    key={video.id}
                    className="flex items-center justify-between p-4 bg-[var(--background)] border border-slate-850 rounded-xl hover:border-slate-750 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex flex-col gap-1 items-center">
                        <button
                          onClick={() => handleMoveVideo(index, "up")}
                          disabled={index === 0}
                          className="text-[var(--muted-foreground)] hover:text-slate-350 disabled:opacity-30 disabled:hover:text-[var(--muted-foreground)] transition-colors"
                        >
                          <ArrowUp className="h-4 w-4" />
                        </button>
                        <span className="text-[10px] font-bold text-[var(--muted-foreground)]">{video.order}</span>
                        <button
                          onClick={() => handleMoveVideo(index, "down")}
                          disabled={index === videosList.length - 1}
                          className="text-[var(--muted-foreground)] hover:text-slate-350 disabled:opacity-30 disabled:hover:text-[var(--muted-foreground)] transition-colors"
                        >
                          <ArrowDown className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-[var(--foreground)] truncate pr-2">
                          {video.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          {video.isPreview ? (
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-450 border border-emerald-500/20">
                              <Eye className="h-3 w-3" /> Free Preview
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-[var(--secondary)] text-[var(--muted-foreground)]">
                              Enrolled Only
                            </span>
                          )}
                          {(video.videoUrl.includes("youtube.com/embed/") || video.videoUrl.includes("youtu")) && (
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/20">
                              <Link2 className="h-3 w-3" /> YouTube
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteVideo(video.id)}
                      className="p-2 text-[var(--muted-foreground)] hover:text-red-400 hover:bg-red-500/10 rounded-lg border border-transparent hover:border-red-500/20 transition-all ml-4 shrink-0"
                      title="Delete Video"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add video form */}
          <div className="backdrop-blur-md bg-[var(--card)]/60 border border-[var(--border)] rounded-2xl p-6 shadow-xl">
            <h3 className="text-base font-bold text-[var(--foreground)] mb-6">Add Lecture Video</h3>

            {videoError && (
              <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/35 p-3 text-xs text-red-400 flex items-start gap-1.5">
                <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                <span>{videoError}</span>
              </div>
            )}

            {videoSuccess && (
              <div className="mb-4 rounded-lg bg-emerald-500/10 border border-emerald-500/35 p-3 text-xs text-emerald-400 flex items-center gap-1.5">
                <Check className="h-4 w-4 text-emerald-400" />
                <span>Video added successfully</span>
              </div>
            )}

            <form onSubmit={handleAddVideoSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Lecture Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Introduction to Generics"
                  value={videoTitle}
                  onChange={(e) => setVideoTitle(e.target.value)}
                  className="block w-full px-3.5 py-2.5 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--foreground)] text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center gap-2 py-2">
                <input
                  id="isPreview"
                  type="checkbox"
                  checked={videoIsPreview}
                  onChange={(e) => setVideoIsPreview(e.target.checked)}
                  className="h-4 w-4 bg-[var(--background)] border-[var(--border)] text-indigo-600 rounded focus:ring-indigo-500/50 focus:ring-offset-slate-900 cursor-pointer"
                />
                <label htmlFor="isPreview" className="text-xs font-semibold text-[var(--foreground)] cursor-pointer select-none">
                  Enable Free Preview (Anyone can watch this video without enrolling)
                </label>
              </div>

              {/* Source type toggle */}
              <div className="space-y-3">
                <label className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)] block">Video Source</label>
                <div className="flex gap-2 p-1 bg-[var(--background)] rounded-lg border border-[var(--border)]">
                  <button
                    type="button"
                    onClick={() => { setVideoSourceType("upload"); setVideoLinkInput(""); }}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-xs font-semibold transition-all ${
                      videoSourceType === "upload"
                        ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                        : "text-[var(--muted-foreground)] hover:text-slate-200"
                    }`}
                  >
                    <Upload className="h-3.5 w-3.5" /> Upload File
                  </button>
                  <button
                    type="button"
                    onClick={() => { setVideoSourceType("link"); setVideoUrl(""); }}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-xs font-semibold transition-all ${
                      videoSourceType === "link"
                        ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                        : "text-[var(--muted-foreground)] hover:text-slate-200"
                    }`}
                  >
                    <Link2 className="h-3.5 w-3.5" /> Video Link
                  </button>
                </div>

                {videoSourceType === "upload" ? (
                  <div>
                    <p className="text-[11px] text-[var(--muted-foreground)] mb-2">Upload an MP4 / video file (max 64MB)</p>
                    <FileUpload
                      endpoint="courseVideo"
                      onChange={(url) => setVideoUrl(url || "")}
                      value={videoUrl}
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-[11px] text-[var(--muted-foreground)]">Paste a YouTube, Vimeo, or direct MP4 link</p>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Link2 className="h-4 w-4 text-[var(--muted-foreground)]" />
                      </div>
                      <input
                        type="url"
                        placeholder="https://youtube.com/watch?v=... or https://example.com/video.mp4"
                        value={videoLinkInput}
                        onChange={(e) => setVideoLinkInput(e.target.value)}
                        className="block w-full pl-10 pr-3.5 py-2.5 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--foreground)] text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 placeholder:text-slate-600"
                      />
                    </div>
                    {/* YouTube preview hint */}
                    {videoLinkInput && (
                      videoLinkInput.includes("youtube.com") || videoLinkInput.includes("youtu.be")
                        ? <p className="text-[11px] text-emerald-400 flex items-center gap-1">✓ YouTube link detected — will embed as a player</p>
                        : <p className="text-[11px] text-[var(--muted-foreground)]">Will be played as a direct video stream</p>
                    )}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={videoUploading}
                className="w-full flex justify-center py-2.5 rounded-lg bg-indigo-650 hover:bg-indigo-600 text-white font-semibold text-sm shadow-md transition-all disabled:opacity-50"
              >
                {videoUploading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" /> Adding Video...
                  </span>
                ) : (
                  "Add Video Lecture"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
