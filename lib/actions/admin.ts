"use server";

import { db } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { hashPassword } from "@/lib/bcrypt";
import { revalidatePath } from "next/cache";

// Helper to check if user is an admin
async function checkAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized. Only administrators can perform this action.");
  }
  return session.user;
}

export async function createTeacher(formData: FormData) {
  try {
    await checkAdmin();

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!name || !email || !password) {
      return { error: "All fields are required" };
    }

    if (password.length < 6) {
      return { error: "Password must be at least 6 characters long" };
    }

    // Check if email already exists
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { error: "Email already registered" };
    }

    const hashedPassword = await hashPassword(password);

    await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "TEACHER",
      },
    });

    revalidatePath("/admin/teachers");
    return { success: true };
  } catch (error: any) {
    console.error("Create teacher error:", error);
    return { error: error.message || "Failed to create teacher account" };
  }
}

export async function updatePaymentSettings(formData: FormData) {
  try {
    await checkAdmin();

    const upiId = formData.get("upiId") as string;
    const instructions = formData.get("instructions") as string;
    const qrCodeImageUrl = formData.get("qrCodeImageUrl") as string;

    if (!upiId || !instructions || !qrCodeImageUrl) {
      return { error: "All settings fields are required" };
    }

    await db.paymentSettings.upsert({
      where: { id: "singleton" },
      create: {
        id: "singleton",
        upiId,
        instructions,
        qrCodeImageUrl,
      },
      update: {
        upiId,
        instructions,
        qrCodeImageUrl,
      },
    });

    revalidatePath("/student/enroll/[courseId]");
    revalidatePath("/admin/settings");
    return { success: true };
  } catch (error: any) {
    console.error("Update payment settings error:", error);
    return { error: error.message || "Failed to update payment settings" };
  }
}

export async function approveEnrollment(enrollmentId: string, paymentId: string) {
  try {
    const admin = await checkAdmin();

    await db.$transaction(async (tx) => {
      // 1. Update enrollment status to APPROVED
      await tx.enrollment.update({
        where: { id: enrollmentId },
        data: { status: "APPROVED" },
      });

      // 2. Update payment status to VERIFIED
      await tx.payment.update({
        where: { id: paymentId },
        data: {
          status: "VERIFIED",
          verifiedById: admin.id,
        },
      });
    });

    revalidatePath("/admin/approvals");
    revalidatePath("/admin");
    return { success: true };
  } catch (error: any) {
    console.error("Approve enrollment error:", error);
    return { error: error.message || "Failed to approve enrollment" };
  }
}

export async function rejectEnrollment(enrollmentId: string, paymentId: string) {
  try {
    const admin = await checkAdmin();

    await db.$transaction(async (tx) => {
      // 1. Update enrollment status to REJECTED
      await tx.enrollment.update({
        where: { id: enrollmentId },
        data: { status: "REJECTED" },
      });

      // 2. Update payment status to REJECTED
      await tx.payment.update({
        where: { id: paymentId },
        data: {
          status: "REJECTED",
          verifiedById: admin.id,
        },
      });
    });

    revalidatePath("/admin/approvals");
    revalidatePath("/admin");
    return { success: true };
  } catch (error: any) {
    console.error("Reject enrollment error:", error);
    return { error: error.message || "Failed to reject enrollment" };
  }
}

// ─── CMS: Home Page ──────────────────────────────────────────────────────────

export async function updateHomePage(data: {
  heroEyebrow: string;
  heroHeadline1: string;
  heroHeadline2: string;
  heroHeadline3: string;
  heroSubtext: string;
  heroCta1Label: string;
  heroCta2Label: string;
  heroSocialProofCount: string;
  tracksHeadline: string;
  tracksSubtext: string;
  features: any;
  tracks: any;
  whyHeadline: string;
  whySubtext: string;
  whyItems: any;
  stats: any;
  stepsHeadline: string;
  steps: any;
  testimonialsHeadline: string;
  testimonialsSubtext: string;
  testimonials: any;
  faqHeadline: string;
  faqs: any;
  ctaHeadline: string;
  ctaSubtext: string;
  ctaBtn1Label: string;
  ctaBtn2Label: string;
}) {
  try {
    console.log("CMS ACTION: updateHomePage entry");
    const admin = await checkAdmin();
    console.log("CMS ACTION: Admin authorized:", admin.email);
    console.log("CMS ACTION: Saving tracks count:", data.tracks?.length, "features count:", data.features?.length);
    
    await db.siteHomePage.upsert({
      where: { id: "singleton" },
      create: { id: "singleton", ...data },
      update: data,
    });
    console.log("CMS ACTION: Upsert Home Page database success!");
    revalidatePath("/");
    console.log("CMS ACTION: Path '/' revalidated");
    return { success: true };
  } catch (error: any) {
    console.error("CMS ACTION ERROR: Update home page error:", error);
    return { error: error.message || "Failed to update home page" };
  }
}

// ─── CMS: About Page ─────────────────────────────────────────────────────────

export async function updateAboutPage(data: {
  heroHeadline: string;
  heroSubtext: string;
  missionTitle: string;
  missionPara1: string;
  missionPara2: string;
  brandName: string;
  foundedYear: string;
  brandQuote: string;
  stats: any;
  valuesHeadline: string;
  valuesSubtext: string;
  values: any;
}) {
  try {
    console.log("CMS ACTION: updateAboutPage entry");
    const admin = await checkAdmin();
    console.log("CMS ACTION: Admin authorized:", admin.email);
    
    await db.siteAboutPage.upsert({
      where: { id: "singleton" },
      create: { id: "singleton", ...data },
      update: data,
    });
    console.log("CMS ACTION: Upsert About Page database success!");
    revalidatePath("/about");
    console.log("CMS ACTION: Path '/about' revalidated");
    return { success: true };
  } catch (error: any) {
    console.error("CMS ACTION ERROR: Update about page error:", error);
    return { error: error.message || "Failed to update about page" };
  }
}

// ─── CMS: Contact Page ───────────────────────────────────────────────────────

export async function updateContactPage(data: {
  pageHeading: string;
  pageSubtext: string;
  email: string;
  emailResponseTime: string;
  phone: string;
  phoneHours: string;
  workingHours: string;
  workingHoursTime: string;
  address: string;
  mapEmbedUrl: string;
  successMessage: string;
  mapSectionTitle: string;
  mapSectionDesc: string;
}) {
  try {
    console.log("CMS ACTION: updateContactPage entry");
    const admin = await checkAdmin();
    console.log("CMS ACTION: Admin authorized:", admin.email);

    await db.siteContactPage.upsert({
      where: { id: "singleton" },
      create: { id: "singleton", ...data },
      update: data,
    });
    console.log("CMS ACTION: Upsert Contact Page database success!");
    revalidatePath("/contact");
    console.log("CMS ACTION: Path '/contact' revalidated");
    return { success: true };
  } catch (error: any) {
    console.error("CMS ACTION ERROR: Update contact page error:", error);
    return { error: error.message || "Failed to update contact page" };
  }
}

// ─── Contact Submissions ──────────────────────────────────────────────────────

export async function updateContactSubmissionStatus(
  id: string,
  status: "UNREAD" | "READ" | "REPLIED"
) {
  try {
    await checkAdmin();
    await db.contactSubmission.update({ where: { id }, data: { status } });
    revalidatePath("/admin/cms");
    return { success: true };
  } catch (error: any) {
    console.error("Update submission status error:", error);
    return { error: error.message || "Failed to update status" };
  }
}

export async function deleteContactSubmission(id: string) {
  try {
    await checkAdmin();
    await db.contactSubmission.delete({ where: { id } });
    revalidatePath("/admin/cms");
    return { success: true };
  } catch (error: any) {
    console.error("Delete submission error:", error);
    return { error: error.message || "Failed to delete submission" };
  }
}

