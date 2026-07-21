"use server";

import { db } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { revalidatePath } from "next/cache";

export async function submitEnrollment(
  courseId: string,
  transactionRef: string,
  screenshotUrl: string
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "STUDENT") {
      throw new Error("Unauthorized. Only students can enroll in courses.");
    }

    const studentId = session.user.id;

    if (!transactionRef || !screenshotUrl) {
      return { error: "Transaction Reference and Payment Screenshot are required." };
    }

    const course = await db.course.findUnique({
      where: { id: courseId },
    });

    if (!course || !course.isPublished) {
      return { error: "Course not found or is currently unavailable." };
    }

    // Check if enrollment already exists
    const existingEnrollment = await db.enrollment.findUnique({
      where: {
        studentId_courseId: {
          studentId,
          courseId,
        },
      },
    });

    if (existingEnrollment) {
      if (existingEnrollment.status === "APPROVED") {
        return { error: "You are already enrolled in this course." };
      }
      
      if (existingEnrollment.status === "PENDING") {
        return { error: "Your previous enrollment request is already pending verification." };
      }

      // If enrollment was REJECTED, we allow them to re-submit details.
      // We run updates inside a Prisma Transaction
      await db.$transaction(async (tx) => {
        // 1. Update enrollment back to PENDING
        const updatedEnrollment = await tx.enrollment.update({
          where: { id: existingEnrollment.id },
          data: { status: "PENDING" },
        });

        // 2. Create a new pending Payment record linked to it
        await tx.payment.create({
          data: {
            enrollmentId: updatedEnrollment.id,
            screenshotUrl,
            transactionRef,
            amount: course.price,
            status: "PENDING",
          },
        });
      });
    } else {
      // Create new Enrollment and Payment records in a transaction
      await db.$transaction(async (tx) => {
        const newEnrollment = await tx.enrollment.create({
          data: {
            studentId,
            courseId,
            status: "PENDING",
          },
        });

        await tx.payment.create({
          data: {
            enrollmentId: newEnrollment.id,
            screenshotUrl,
            transactionRef,
            amount: course.price,
            status: "PENDING",
          },
        });
      });
    }

    revalidatePath("/student");
    revalidatePath(`/courses/${courseId}`);
    return { success: true };
  } catch (error: any) {
    console.error("Enrollment submission error:", error);
    return { error: error.message || "Failed to submit enrollment request." };
  }
}
