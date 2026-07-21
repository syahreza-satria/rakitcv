import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CVProvider } from "../lib/store";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "CV ATS Builder - Pembuat CV ATS-Friendly Mudah",
  description: "Buat CV/Resume yang ramah Applicant Tracking System (ATS) dengan format satu kolom standar profesional secara gratis.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50">
        <CVProvider>{children}</CVProvider>
      </body>
    </html>
  );
}

