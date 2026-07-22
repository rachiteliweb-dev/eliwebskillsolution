"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PaymentSettings } from "@prisma/client";
import { updatePaymentSettings } from "@/lib/actions/admin";
import { FileUpload } from "@/components/file-upload";
import { Settings, CreditCard, ArrowLeft, Loader2, Check, AlertCircle } from "lucide-react";
import { toast } from "react-toastify";

interface SettingsFormProps {
  settings: PaymentSettings | null;
}

export default function SettingsForm({ settings }: SettingsFormProps) {
  const router = useRouter();

  const [upiId, setUpiId] = useState(settings?.upiId || "");
  const [instructions, setInstructions] = useState(settings?.instructions || "");
  const [qrCodeImageUrl, setQrCodeImageUrl] = useState(settings?.qrCodeImageUrl || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!qrCodeImageUrl) {
      setError("QR code image is required");
      toast.warning("QR code image is required!");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess(false);

    const formData = new FormData();
    formData.append("upiId", upiId);
    formData.append("instructions", instructions);
    formData.append("qrCodeImageUrl", qrCodeImageUrl);

    try {
      const res = await updatePaymentSettings(formData);
      if (res?.error) {
        setError(res.error);
        toast.error(`Failed to update settings: ${res.error}`);
        setLoading(false);
      } else {
        setSuccess(true);
        toast.success("Payment settings updated successfully!");
        setLoading(false);
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred");
      toast.error("An unexpected error occurred");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Link
        href="/admin"
        className="inline-flex items-center gap-1.5 text-sm text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors mb-8"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Dashboard
      </Link>

      <div className="border-b border-[var(--border)] pb-8 mb-10">
        <h1 className="text-3xl font-extrabold tracking-tight text-[var(--foreground)] sm:text-4xl font-heading">
          Payment Settings
        </h1>
        <p className="mt-2 text-sm text-[var(--muted-foreground)]">
          Configure the payment QR code, UPI address, and custom instructions students see when requesting course enrollments.
        </p>
      </div>

      <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-8 shadow-[var(--shadow-card)]">
        <h2 className="text-lg font-bold text-[var(--foreground)] mb-6 flex items-center gap-2 font-heading">
          <Settings className="h-5 w-5 text-[var(--primary)]" /> Configure Payment Configuration
        </h2>

        {error && (
          <div className="mb-6 rounded-lg bg-red-500/10 border border-red-500/35 p-3 text-xs text-red-500 flex items-start gap-1.5">
            <AlertCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-6 rounded-lg bg-emerald-500/10 border border-emerald-500/35 p-3 text-xs text-emerald-600 flex items-center gap-1.5">
            <Check className="h-4 w-4 text-emerald-600" />
            <span>Payment settings updated successfully</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1">
            <label htmlFor="upiId" className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
              UPI Address / Account Details
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[var(--muted-foreground)]">
                <CreditCard className="h-4.5 w-4.5" />
              </span>
              <input
                id="upiId"
                type="text"
                required
                placeholder="e.g. payment@upi, or Bank details"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="block w-full pl-10 pr-3.5 py-2.5 bg-[var(--surface)] border border-[var(--border)] rounded-lg text-[var(--foreground)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 focus:border-[var(--primary)]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="instructions" className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
              Payment Instructions (Markdown/Text)
            </label>
            <textarea
              id="instructions"
              required
              rows={4}
              placeholder="Provide directions on scan methods, receipt requirements, bank details, and support contact..."
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="block w-full px-3.5 py-2.5 bg-[var(--surface)] border border-[var(--border)] rounded-lg text-[var(--foreground)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 focus:border-[var(--primary)] resize-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)] block mb-1">
              Payment QR Code Image
            </label>
            <FileUpload
              endpoint="qrCodeImage"
              onChange={(url) => setQrCodeImageUrl(url || "")}
              value={qrCodeImageUrl}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2.5 rounded-lg bg-[var(--primary)] hover:opacity-90 text-[var(--primary-foreground)] font-semibold text-sm shadow-[var(--shadow-glow)] transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Save Payment Config"}
          </button>
        </form>
      </div>
    </div>
  );
}
