"use client";

import { useState, useTransition } from "react";
import { togglePublishCourse } from "@/lib/actions/course";
import { Eye, EyeOff, Loader2 } from "lucide-react";

interface PublishButtonProps {
  courseId: string;
  initialStatus: boolean;
}

export default function PublishButton({ courseId, initialStatus }: PublishButtonProps) {
  const [isPublished, setIsPublished] = useState(initialStatus);
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    startTransition(async () => {
      const res = await togglePublishCourse(courseId);
      if (res?.error) {
        alert(res.error);
      } else if (res?.success) {
        setIsPublished(res.isPublished ?? false);
      }
    });
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg transition-all ${
        isPublished
          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20"
          : "bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20"
      } disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {isPending ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : isPublished ? (
        <>
          <EyeOff className="h-3.5 w-3.5" /> Unpublish
        </>
      ) : (
        <>
          <Eye className="h-3.5 w-3.5" /> Publish
        </>
      )}
    </button>
  );
}
