import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import SettingsForm from "./settings-form";

export const revalidate = 0; // Dynamic config retrieval

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  // Fetch payment settings
  const paymentSettings = await db.paymentSettings.findUnique({
    where: {
      id: "singleton",
    },
  });

  return <SettingsForm settings={paymentSettings} />;
}
