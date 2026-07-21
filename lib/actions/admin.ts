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
