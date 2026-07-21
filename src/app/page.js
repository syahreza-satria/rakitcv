"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, Layers, FileText, CheckCircle, ShieldCheck, HelpCircle } from "lucide-react";

export default function Home() {
  return (
    <div className="flex-1 flex flex-col justify-between bg-zinc-50 dark:bg-zinc-950">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden py-24 sm:py-32 flex flex-col items-center text-center px-6">
        {/* Glow effect backgrounds */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-200/40 dark:bg-blue-900/10 blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-200/20 dark:bg-blue-900/5 blur-[120px] pointer-events-none"></div>

        <div className="max-w-4xl flex flex-col items-center gap-6 relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50/50 dark:border-blue-950/40 dark:bg-blue-950/20 px-3.5 py-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400">
            <Sparkles size={12} className="animate-pulse" />
            <span>100% Gratis & Tanpa Registrasi</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-zinc-900 via-blue-950 to-zinc-900 dark:from-zinc-100 dark:via-blue-200 dark:to-zinc-100 bg-clip-text text-transparent leading-[1.15]">
            Buat CV ATS-Friendly <br />
            <span className="text-blue-600 dark:text-blue-400">Lolos Screening HRD</span>
          </h1>

          <p className="max-w-2xl text-base sm:text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
            Applicant Tracking System (ATS) adalah robot software penyaring CV otomatis. 
            Gunakan aplikasi ini untuk menyusun data diri Anda secara terstruktur, menghasilkan CV berstandar global yang 100% ramah ATS.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 mt-4 w-full justify-center">
            <Link
              href="/builder"
              className="w-full sm:w-auto flex h-12 items-center justify-center rounded-xl bg-blue-600 px-8 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-700 hover:shadow-blue-500/30 active:scale-98"
            >
              Mulai Buat CV Anda
            </Link>
            <a
              href="#ats-rules"
              className="w-full sm:w-auto flex h-12 items-center justify-center rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-850 px-8 text-sm font-semibold text-zinc-700 dark:text-zinc-300 transition"
            >
              Pelajari Kaidah ATS
            </a>
          </div>
        </div>
      </section>

      {/* ATS GUIDELINE SECTION */}
      <section id="ats-rules" className="py-20 bg-white dark:bg-zinc-900/40 border-y border-zinc-200/60 dark:border-zinc-800/60 px-6">
        <div className="max-w-6xl mx-auto flex flex-col gap-12">
          <div className="text-center max-w-2xl mx-auto flex flex-col gap-3">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              Mengapa CV Harus ATS-Friendly?
            </h2>
            <p className="text-sm text-zinc-500">
              Lebih dari 90% perusahaan besar menyaring ribuan CV menggunakan mesin ATS sebelum dibaca manusia. Berikut kriteria wajib lolos parsing:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-850 p-6 flex flex-col gap-4 bg-zinc-50/50 dark:bg-zinc-900/20">
              <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-950 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <Layers size={20} />
              </div>
              <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-base">Layout Satu Kolom</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Menghindari kolom ganda, tabel rumit, dan text box yang membingungkan parser ATS saat membaca dari atas ke bawah.
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-850 p-6 flex flex-col gap-4 bg-zinc-50/50 dark:bg-zinc-900/20">
              <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-950 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <FileText size={20} />
              </div>
              <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-base">Font Standar PDF</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Menggunakan font Arial, Calibri, atau Times New Roman. Membantu sistem membaca huruf dengan tingkat keakuratan 100%.
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-850 p-6 flex flex-col gap-4 bg-zinc-50/50 dark:bg-zinc-900/20">
              <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-950 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <ShieldCheck size={20} />
              </div>
              <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-base">Teks yang Dapat Disalin</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Hasil export PDF berbasis teks vektor (bukan gambar/foto hasil screenshot) sehingga konten kata kunci dapat diindeks oleh ATS.
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-850 p-6 flex flex-col gap-4 bg-zinc-50/50 dark:bg-zinc-900/20">
              <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-950 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <CheckCircle size={20} />
              </div>
              <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-base">Tanpa Elemen Dekoratif</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Bebas dari foto profil, grafik lingkaran (rating skill), bar persentase, ikon/emoji yang merusak string pembaca dokumen.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 py-8 px-6 text-center text-xs text-zinc-500">
        <p>© {new Date().getFullYear()} CV ATS Builder. Dibuat dengan Next.js & Tailwind CSS.</p>
      </footer>
    </div>
  );
}
