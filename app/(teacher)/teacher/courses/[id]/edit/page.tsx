import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import EditCourseClient from "./edit-course-client";

interface EditCoursePageProps {
  params: Promise<{ id: string }> | { id: string };
}

export default async function EditCoursePage({ params }: EditCoursePageProps) {
  // Resolve params if it's a promise
  const resolvedParams = await params;
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== "TEACHER") {
    redirect("/login");
  }

  const course = await db.course.findUnique({
    where: { id: resolvedParams.id },
    include: {
      videos: {
        orderBy: { order: "asc" },
      },
    },
  });

  if (!course) {
    redirect("/teacher");
  }

  if (course.teacherId !== session.user.id) {
    redirect("/teacher");
  }

  return <EditCourseClient course={course} />;
}
