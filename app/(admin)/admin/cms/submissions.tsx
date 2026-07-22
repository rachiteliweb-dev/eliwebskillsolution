"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateContactSubmissionStatus, deleteContactSubmission } from "@/lib/actions/admin";
import {
  Check, Trash2, Mail, Phone, Calendar, Clock, AlertCircle, Eye, Loader2, RefreshCw
} from "lucide-react";
// Removed Prisma client type import to avoid build-time cache synchronization issues
type ContactSubmissionStatus = "UNREAD" | "READ" | "REPLIED";
type ContactSubmission = any;
import { toast } from "react-toastify";

interface Props {
  submissions: ContactSubmission[];
}

export default function SubmissionsPanel({ submissions: initialSubmissions }: Props) {
  const router = useRouter();
  const [submissions, setSubmissions] = useState<ContactSubmission[]>(initialSubmissions);
  const [filter, setFilter] = useState<"ALL" | "UNREAD" | "READ" | "REPLIED">("ALL");
  const [selected, setSelected] = useState<ContactSubmission | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  // Sync state if initialSubmissions updates from router.refresh()
  if (initialSubmissions.length !== submissions.length) {
    setSubmissions(initialSubmissions);
  }

  const handleUpdateStatus = async (id: string, newStatus: ContactSubmissionStatus) => {
    setLoadingId(id);
    const res = await updateContactSubmissionStatus(id, newStatus);
    if (!res.error) {
      setSubmissions(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s));
      if (selected && selected.id === id) {
        setSelected(prev => prev ? { ...prev, status: newStatus } : null);
      }
      toast.success(`Submission marked as ${newStatus.toLowerCase()}!`);
      router.refresh();
    } else {
      toast.error(`Failed to update status: ${res.error}`);
    }
    setLoadingId(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this submission?")) return;
    setLoadingId(id);
    const res = await deleteContactSubmission(id);
    if (!res.error) {
      setSubmissions(prev => prev.filter(s => s.id !== id));
      if (selected && selected.id === id) setSelected(null);
      toast.success("Submission deleted successfully!");
      router.refresh();
    } else {
      toast.error(`Failed to delete submission: ${res.error}`);
    }
    setLoadingId(null);
  };

  const filtered = submissions.filter(s => {
    if (filter === "ALL") return true;
    return s.status === filter;
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Inbox List */}
      <div className="lg:col-span-7 bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 shadow-[var(--shadow-card)] space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h2 className="text-lg font-bold text-[var(--foreground)] font-heading">
            Contact Submissions ({filtered.length})
          </h2>
          <div className="flex items-center gap-1.5 p-0.5 bg-[var(--secondary)] border border-[var(--border)] rounded-xl text-xs font-semibold">
            {(["ALL", "UNREAD", "READ", "REPLIED"] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-2.5 py-1.5 rounded-lg transition-all ${
                  filter === f
                    ? "bg-[var(--card)] text-[var(--foreground)] shadow-sm border border-[var(--border)]"
                    : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                }`}
              >
                {f.charAt(0) + f.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-[var(--muted-foreground)] text-sm">
              No submissions found matching this filter.
            </div>
          ) : (
            filtered.map((item) => {
              const date = new Date(item.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit"
              });
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    setSelected(item);
                    if (item.status === "UNREAD") handleUpdateStatus(item.id, "READ");
                  }}
                  className={`p-4 border rounded-xl cursor-pointer transition-all text-left space-y-2 ${
                    selected?.id === item.id
                      ? "border-[var(--primary)] bg-[var(--surface)] ring-1 ring-[var(--primary)]/55"
                      : "border-[var(--border)] bg-[var(--surface)] hover:border-[var(--primary)]/50"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="font-bold text-sm text-[var(--foreground)] flex items-center gap-1.5">
                        {item.name}
                        {item.status === "UNREAD" && (
                          <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" title="Unread" />
                        )}
                      </h4>
                      <p className="text-[11px] text-[var(--muted-foreground)] mt-0.5">{item.email}</p>
                    </div>
                    <span className="text-[10px] text-[var(--muted-foreground)] whitespace-nowrap">{date}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-[var(--muted-foreground)] truncate max-w-[200px]">
                      Track: <span className="font-bold text-[var(--foreground)]">{item.track || "None"}</span>
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider ${
                      item.status === "UNREAD" ? "bg-blue-500/10 text-blue-500 border border-blue-500/20" :
                      item.status === "READ" ? "bg-amber-500/10 text-amber-600 border border-amber-500/20" :
                      "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                    }`}>
                      {item.status}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Selected Submission Details View */}
      <div className="lg:col-span-5 space-y-4">
        {selected ? (
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 shadow-[var(--shadow-card)] space-y-6 text-left animate-fade-in">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-[var(--foreground)] font-heading">Message Details</h3>
              <button
                onClick={() => handleDelete(selected.id)}
                disabled={loadingId === selected.id}
                className="p-2 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors"
                title="Delete Submission"
              >
                <Trash2 className="h-4.5 w-4.5" />
              </button>
            </div>

            <div className="space-y-4 text-sm border-b border-[var(--border)] pb-5">
              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-[var(--muted-foreground)]">Sender</span>
                <p className="font-bold text-[var(--foreground)] mt-0.5">{selected.name}</p>
                <p className="text-xs text-[var(--muted-foreground)]">{selected.email}</p>
                {selected.phone && <p className="text-xs text-[var(--muted-foreground)] mt-0.5">Phone: {selected.phone}</p>}
              </div>

              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-[var(--muted-foreground)]">Interested Course Track</span>
                <p className="font-semibold text-[var(--foreground)] mt-0.5">{selected.track || "Not specified"}</p>
              </div>

              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-[var(--muted-foreground)]">Subject</span>
                <p className="font-bold text-[var(--foreground)] mt-0.5">{selected.subject || "(No Subject)"}</p>
              </div>
            </div>

            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-[var(--muted-foreground)]">Message Content</span>
              <p className="text-sm text-[var(--foreground)] mt-2 leading-relaxed whitespace-pre-wrap bg-[var(--surface)] border border-[var(--border)] p-4 rounded-xl">
                {selected.message}
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5 pt-2">
              <button
                onClick={() => handleUpdateStatus(selected.id, "UNREAD")}
                disabled={loadingId === selected.id || selected.status === "UNREAD"}
                className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 border border-[var(--border)] hover:bg-[var(--secondary)] rounded-xl text-xs font-semibold disabled:opacity-50 transition-all"
              >
                Mark Unread
              </button>
              <button
                onClick={() => handleUpdateStatus(selected.id, "REPLIED")}
                disabled={loadingId === selected.id || selected.status === "REPLIED"}
                className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-500 text-white rounded-xl text-xs font-semibold disabled:opacity-50 hover:bg-emerald-600 transition-all shadow-[0_4px_12px_rgba(16,185,129,0.2)]"
              >
                <Check className="h-4 w-4" /> Mark Replied
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-[var(--card)] border border-[var(--border)] border-dashed rounded-2xl p-8 text-center text-[var(--muted-foreground)] flex flex-col items-center justify-center h-48">
            <Mail className="h-8 w-8 text-[var(--muted-foreground)]/65 mb-2" />
            <p className="text-sm font-semibold">No Message Selected</p>
            <p className="text-xs mt-1">Select a contact submission from the list to view its contents, reply, or delete.</p>
          </div>
        )}
      </div>
    </div>
  );
}
