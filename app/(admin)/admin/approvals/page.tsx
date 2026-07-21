import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import ApprovalsList from "./approvals-list";

export const revalidate = 0; // Fresh queue updates

export default async function ApprovalsPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  // Fetch all pending enrollments
  const pendingEnrollments = await db.enrollment.findMany({
    where: {
      status: "PENDING",
    },
    include: {
      student: {
        select: {
          name: true,
          email: true,
        },
      },
      course: {
        select: {
          title: true,
          price: true,
        },
      },
      payments: {
        where: {
          status: "PENDING",
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return <ApprovalsList initialEnrollments={pendingEnrollments} />;
}
