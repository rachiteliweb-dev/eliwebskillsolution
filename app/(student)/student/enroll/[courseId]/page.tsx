import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import EnrollForm from "./enroll-form";

interface EnrollPageProps {
  params: Promise<{ courseId: string }> | { courseId: string };
}

export default async function EnrollPage({ params }: EnrollPageProps) {
  const resolvedParams = await params;
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "STUDENT") {
    redirect("/login");
  }

  const course = await db.course.findUnique({
    where: { id: resolvedParams.courseId },
  });

  if (!course || !course.isPublished) {
    redirect("/courses");
  }

  // Get active singleton payment settings
  const paymentSettings = await db.paymentSettings.findUnique({
    where: { id: "singleton" },
  });

  if (!paymentSettings) {
    throw new Error("Payment settings not configured. Please contact the administrator.");
  }

  // Check if they are already enrolled and approved
  const existingEnrollment = await db.enrollment.findUnique({
    where: {
      studentId_courseId: {
        studentId: session.user.id,
        courseId: course.id,
      },
    },
  });

  if (existingEnrollment && existingEnrollment.status === "APPROVED") {
    redirect(`/student/learn/${course.id}`);
  }

  return (
    <EnrollForm
      course={course}
      paymentSettings={paymentSettings}
    />
  );
}
