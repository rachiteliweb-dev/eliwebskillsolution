import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import CmsDashboard from "./cms-dashboard";

export const revalidate = 0;

export default async function CmsPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") redirect("/login");

  const [homePage, aboutPage, contactPage, submissions] = await Promise.all([
    db.siteHomePage.findUnique({ where: { id: "singleton" } }),
    db.siteAboutPage.findUnique({ where: { id: "singleton" } }),
    db.siteContactPage.findUnique({ where: { id: "singleton" } }),
    db.contactSubmission.findMany({ orderBy: { createdAt: "desc" } }),
  ]);

  return (
    <CmsDashboard
      homePage={homePage}
      aboutPage={aboutPage}
      contactPage={contactPage}
      submissions={submissions}
    />
  );
}
