import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import CourseDetailClient from "./course-detail-client";

interface CourseDetailPageProps {
  params: Promise<{ id: string }> | { id: string };
}

export const revalidate = 0; // Dynamic rendering for live enrollment updates

export default async function CourseDetailPage({ params }: CourseDetailPageProps) {
  const resolvedParams = await params;
  const session = await getServerSession(authOptions);

  const course = await db.course.findUnique({
    where: { id: resolvedParams.id },
    include: {
      teacher: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      videos: {
        orderBy: { order: "asc" },
      },
    },
  });

  if (!course || !course.isPublished) {
    // If course doesn't exist or is not published
    // Allow teachers who own the course to view it in draft mode
    if (course && session && session.user.id === course.teacherId) {
      // Allow teacher ownership access
    } else {
      redirect("/courses");
    }
  }

  // Get student enrollment status if logged in
  let enrollment: any = null;
  if (session && session.user.role === "STUDENT") {
    enrollment = await db.enrollment.findUnique({
      where: {
        studentId_courseId: {
          studentId: session.user.id,
          courseId: course.id,
        },
      },
    });
  }

  return (
    <CourseDetailClient
      course={course}
      session={session}
      enrollment={enrollment}
    />
  );
}
