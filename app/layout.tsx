import type { Metadata } from "next";
import { Outfit, Nunito } from "next/font/google";
import "./globals.css";
import "@uploadthing/react/styles.css";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/navbar";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--fw-outfit",
  display: "swap",
});

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--fw-nunito",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Eliweb Skill Solution — Learn Skills. Build a Career.",
  description:
    "Eliweb Skill Solution is a premium skill-development platform. Master web development, digital marketing, UI/UX design, data science and more with expert-led courses.",
  keywords: ["skill development", "online courses", "web development", "digital marketing", "eliweb"],
  icons: {
    icon: [
      { url: "/favicon.png", sizes: "any" },
    ],
    apple: "/favicon.png",
    shortcut: "/favicon.png",
  },
  openGraph: {
    title: "Eliweb Skill Solution",
    description: "Expert-led skill development courses. Learn web dev, marketing, design & more.",
    images: [{ url: "/favicon.png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // <html lang="en" className={`${outfit.variable} ${nunito.variable}`}>
    <html lang="en" className={`${outfit.variable} ${nunito.variable}`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col antialiased">
        <Providers>
          <Navbar />
          <main className="flex-1 flex flex-col">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
