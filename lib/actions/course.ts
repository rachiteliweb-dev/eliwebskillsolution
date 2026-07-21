"use server";

import { db } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { revalidatePath } from "next/cache";

// Helper to check if user is a teacher
async function checkTeacher() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "TEACHER") {
    throw new Error("Unauthorized. Only teachers can perform this action.");
  }
  return session.user;
}

// Helper to check course ownership
async function checkCourseOwnership(courseId: string, teacherId: string) {
  const course = await db.course.findUnique({
    where: { id: courseId },
  });
  if (!course) {
    throw new Error("Course not found");
  }
  if (course.teacherId !== teacherId) {
    throw new Error("Unauthorized. You do not own this course.");
  }
  return course;
}

export async function createCourse(formData: FormData) {
  try {
    const user = await checkTeacher();

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const priceInput = formData.get("price") as string;
    const thumbnailUrl = formData.get("thumbnailUrl") as string;

    if (!title || !description || !priceInput || !thumbnailUrl) {
      return { error: "All fields are required" };
    }

    // Convert price to cents (multiply by 100)
    const price = Math.round(parseFloat(priceInput) * 100);
    if (isNaN(price) || price < 0) {
      return { error: "Invalid price value" };
    }

    const course = await db.course.create({
      data: {
        title,
        description,
        price,
        thumbnailUrl,
        teacherId: user.id,
      },
    });

    revalidatePath("/teacher");
    return { success: true, courseId: course.id };
  } catch (error: any) {
    console.error("Create course error:", error);
    return { error: error.message || "Failed to create course" };
  }
}

export async function updateCourse(courseId: string, formData: FormData) {
  try {
    const user = await checkTeacher();
    await checkCourseOwnership(courseId, user.id);

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const priceInput = formData.get("price") as string;
    const thumbnailUrl = formData.get("thumbnailUrl") as string;

    if (!title || !description || !priceInput || !thumbnailUrl) {
      return { error: "All fields are required" };
    }

    const price = Math.round(parseFloat(priceInput) * 100);
    if (isNaN(price) || price < 0) {
      return { error: "Invalid price value" };
    }

    await db.course.update({
      where: { id: courseId },
      data: {
        title,
        description,
        price,
        thumbnailUrl,
      },
    });

    revalidatePath("/teacher");
    revalidatePath(`/teacher/courses/${courseId}/edit`);
    revalidatePath(`/courses/${courseId}`);
    return { success: true };
  } catch (error: any) {
    console.error("Update course error:", error);
    return { error: error.message || "Failed to update course" };
  }
}

export async function togglePublishCourse(courseId: string) {
  try {
    const user = await checkTeacher();
    const course = await checkCourseOwnership(courseId, user.id);

    const updatedCourse = await db.course.update({
      where: { id: courseId },
      data: {
        isPublished: !course.isPublished,
      },
    });

    revalidatePath("/teacher");
    revalidatePath(`/teacher/courses/${courseId}/edit`);
    revalidatePath("/courses");
    revalidatePath(`/courses/${courseId}`);
    
    return { success: true, isPublished: updatedCourse.isPublished };
  } catch (error: any) {
    console.error("Toggle publish error:", error);
    return { error: error.message || "Failed to toggle publication" };
  }
}

export async function addCourseVideo(courseId: string, formData: FormData) {
  try {
    const user = await checkTeacher();
    await checkCourseOwnership(courseId, user.id);

    const title = formData.get("title") as string;
    const videoUrl = formData.get("videoUrl") as string;
    const isPreview = formData.get("isPreview") === "true";

    if (!title || !videoUrl) {
      return { error: "Title and Video file are required" };
    }

    // Find the current max order to append the video
    const lastVideo = await db.courseVideo.findFirst({
      where: { courseId },
      orderBy: { order: "desc" },
    });

    const order = lastVideo ? lastVideo.order + 1 : 1;

    await db.courseVideo.create({
      data: {
        title,
        videoUrl,
        isPreview,
        order,
        courseId,
      },
    });

    revalidatePath(`/teacher/courses/${courseId}/edit`);
    revalidatePath(`/courses/${courseId}`);
    return { success: true };
  } catch (error: any) {
    console.error("Add video error:", error);
    return { error: error.message || "Failed to add video" };
  }
}

export async function deleteCourseVideo(videoId: string, courseId: string) {
  try {
    const user = await checkTeacher();
    await checkCourseOwnership(courseId, user.id);

    await db.courseVideo.delete({
      where: { id: videoId },
    });

    revalidatePath(`/teacher/courses/${courseId}/edit`);
    revalidatePath(`/courses/${courseId}`);
    return { success: true };
  } catch (error: any) {
    console.error("Delete video error:", error);
    return { error: error.message || "Failed to delete video" };
  }
}

export async function reorderCourseVideos(
  courseId: string,
  videoOrders: { id: string; order: number }[]
) {
  try {
    const user = await checkTeacher();
    await checkCourseOwnership(courseId, user.id);

    // Run updates in a transaction
    await db.$transaction(
      videoOrders.map((item) =>
        db.courseVideo.update({
          where: { id: item.id },
          data: { order: item.order },
        })
      )
    );

    revalidatePath(`/teacher/courses/${courseId}/edit`);
    return { success: true };
  } catch (error: any) {
    console.error("Reorder videos error:", error);
    return { error: error.message || "Failed to reorder videos" };
  }
}
