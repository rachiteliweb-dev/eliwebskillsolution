"use client";

import { UploadDropzone } from "@/lib/uploadthing";
import { X, Image as ImageIcon, FileText, Film, Eye } from "lucide-react";
import Image from "next/image";

interface FileUploadProps {
  onChange: (url?: string) => void;
  value?: string;
  endpoint: "courseThumbnail" | "courseVideo" | "paymentScreenshot" | "qrCodeImage";
}

export function FileUpload({ onChange, value, endpoint }: FileUploadProps) {
  const isImage = value && !value.endsWith(".mp4") && !value.endsWith(".mkv") && !value.endsWith(".webm");
  const isVideo = value && (value.endsWith(".mp4") || value.endsWith(".mkv") || value.endsWith(".webm"));

  if (value) {
    return (
      <div className="relative flex items-center justify-center p-4 bg-slate-900 border border-slate-800 rounded-xl">
        {isImage && (
          <div className="relative h-40 w-full overflow-hidden rounded-lg">
            <Image
              fill
              src={value}
              alt="Uploaded file"
              className="object-cover"
              unoptimized
            />
          </div>
        )}

        {isVideo && (
          <div className="relative h-40 w-full bg-slate-950 flex flex-col items-center justify-center rounded-lg border border-indigo-500/20">
            <Film className="h-10 w-10 text-indigo-400 mb-2 animate-pulse" />
            <span className="text-xs text-slate-300 font-medium">Video uploaded successfully</span>
            <a 
              href={value} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="mt-2 text-xs text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1"
            >
              <Eye className="h-3 w-3" /> Preview Video
            </a>
          </div>
        )}

        {!isImage && !isVideo && (
          <div className="flex items-center gap-2 text-slate-300">
            <FileText className="h-6 w-6 text-indigo-400" />
            <span className="text-sm font-medium">File Uploaded</span>
          </div>
        )}

        <button
          onClick={() => onChange("")}
          type="button"
          className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full shadow-md hover:bg-red-600 transition-all hover:scale-110 border border-red-400"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="w-full bg-slate-900/40 border-2 border-dashed border-slate-800 hover:border-indigo-500/50 rounded-xl transition-all duration-300 overflow-hidden">
      <UploadDropzone
        endpoint={endpoint}
        onClientUploadComplete={(res) => {
          onChange(res?.[0]?.url);
        }}
        onUploadError={(error: Error) => {
          alert(`Upload failed: ${error.message}`);
        }}
        appearance={{
          container: "py-8 px-4 cursor-pointer",
          uploadIcon: "text-slate-400 group-hover:text-indigo-400 transition-colors",
          label: "text-indigo-400 hover:text-indigo-300 text-sm font-medium mt-2",
          allowedContent: "text-slate-500 text-xs mt-1",
          button: "bg-gradient-to-r from-indigo-500 to-violet-600 text-white rounded-lg px-4 py-2 text-sm font-semibold hover:from-indigo-600 hover:to-violet-700 shadow-md transition-all mt-4 border-none",
        }}
      />
    </div>
  );
}
