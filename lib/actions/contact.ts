"use server";

import { db } from "@/lib/db";

export async function submitContactForm(data: {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  track?: string;
}) {
  if (!data.name || !data.email || !data.message) {
    return { error: "Name, email and message are required." };
  }

  try {
    await db.contactSubmission.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        subject: data.subject || null,
        message: data.message,
        track: data.track || null,
        status: "UNREAD",
      },
    });
    return { success: true };
  } catch (error: any) {
    console.error("Contact form submission error:", error);
    return { error: "Failed to send message. Please try again." };
  }
}
