import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import TeachersClient from "./teachers-client";

export const revalidate = 0; // Fresh list of educators

export default async function TeachersPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  // Fetch all teachers
  const teachers = await db.user.findMany({
    where: {
      role: "TEACHER",
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      courses: {
        select: {
          id: true,
        },
      },
    },
  });

  return <TeachersClient teachers={teachers} />;
}
