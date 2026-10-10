import Image from "next/image";
import Link from "next/link";
import LandingAnimations from "@/components/landing/LandingAnimations";
import FaqItem from "@/components/landing/FaqItem";
import HeroBackdrop from "@/components/landing/HeroBackdrop";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  Download,
  Eye,
  FileText,
  Layers,
  Lock,
  PenLine,
  ShieldCheck,
  UserX,
  Wallet,
  XCircle,
} from "lucide-react";

const TRUST = [
  { icon: Wallet, label: "Gratis penuh" },
  { icon: UserX, label: "Tanpa akun" },
  { icon: Lock, label: "Data tetap di perangkat Anda" },
];

const STEPS = [
  {
    icon: PenLine,
    title: "Isi data Anda",
    text: "Ikuti 6 langkah singkat: data diri, ringkasan, pengalaman, pendidikan, keahlian, dan lainnya. Draf tersimpan otomatis.",
  },
  {
    icon: Eye,
    title: "Lihat preview langsung",
    text: "Setiap ketikan langsung tampil di halaman A4. Pilih template ATS Korporat atau ATS Akademik kapan saja.",
  },
  {
    icon: Download,
    title: "Unduh PDF",
    text: "Dapatkan PDF berteks asli yang bisa diseleksi dan dibaca ATS, siap dikirim ke portal lowongan.",
  },
];

const RULES = [
  {
    icon: Layers,
    title: "Satu kolom",
    text: "Tanpa kolom ganda, tabel, atau text box yang membuat parser ATS salah membaca urutan isi.",
  },
  {
    icon: FileText,
    title: "Font standar",
    text: "Inter (Korporat) dan Calibri (Akademik) dengan ukuran isi yang nyaman dibaca, bukan gambar teks.",
  },
  {
    icon: ShieldCheck,
    title: "Teks asli",
    text: "PDF berisi teks yang bisa diseleksi dan disalin, jadi kata kunci Anda terindeks dengan benar.",
  },
  {
    icon: ClipboardList,
    title: "Judul bagian baku",
    text: "Ringkasan, Pengalaman Kerja, Pendidikan, Keahlian: istilah yang dikenali sistem ATS.",
  },
];

const SAMPLE_POINTS = [
  "Satu kolom dengan urutan baca yang jelas dari atas ke bawah",
  "Judul bagian baku: Ringkasan, Pengalaman Kerja, Pendidikan, Keahlian",
  "Teks asli yang bisa diseleksi, bukan gambar",
  "Tanpa foto, ikon, atau grafik yang membingungkan parser",
];

const AVOIDED = ["Foto profil", "Ikon dan emoji", "Bar atau bintang keahlian", "Grafik dan kolom ganda"];

const FAQ = [
  {
    q: "Apa itu ATS?",
    a: "Applicant Tracking System adalah perangkat lunak yang dipakai banyak perusahaan untuk menyaring dan mengurutkan CV sebelum dibaca rekruter. CV yang susunannya rumit bisa terbaca berantakan oleh sistem ini.",
  },
  {
    q: "Apakah data CV saya dikirim ke server?",
    a: "Tidak. RakitCV berjalan sepenuhnya di browser Anda. Draf hanya disimpan di penyimpanan lokal perangkat ini, dan PDF dibuat langsung di perangkat Anda.",
  },
  {
    q: "Perlu membuat akun?",
    a: "Tidak perlu. Buka editor, isi data, lalu unduh. Karena draf tersimpan di perangkat ini, membuka editor di perangkat lain akan mulai dari awal.",
  },
  {
    q: "Mengapa tidak ada foto atau desain yang lebih berwarna?",
    a: "Foto, ikon, dan tata letak kreatif sering gagal dibaca ATS. RakitCV sengaja membatasi tampilan agar CV Anda terbaca utuh, baik oleh sistem maupun rekruter.",
  },
];

function MockCV() {
  return (
    <div
      aria-hidden="true"
      className="w-full max-w-[380px] rounded-lg border border-zinc-200 bg-white p-7 text-left shadow-xl shadow-blue-900/5"
      style={{ fontFamily: "Inter, Helvetica, Arial, sans-serif" }}
    >
      <p className="text-[15px] font-bold tracking-tight text-blue-600">JOHN DOE</p>
      <p className="mt-0.5 text-[10px] text-zinc-800">Frontend Developer</p>
      <p className="mt-1 text-[8px] text-zinc-500">john.doe@email.com | +62 812-3456-7890 | Jakarta | johndoe.dev</p>

      {[
        { title: "RINGKASAN", lines: ["w-full", "w-11/12", "w-2/3"] },
        { title: "PENGALAMAN KERJA", lines: ["w-3/5 !h-2 bg-zinc-700", "w-1/3", "w-full", "w-5/6"] },
        { title: "PENDIDIKAN", lines: ["w-1/2 !h-2 bg-zinc-700", "w-2/5"] },
        { title: "KEAHLIAN", lines: ["w-full", "w-3/4"] },
      ].map((section) => (
        <div key={section.title} className="mt-4">
          <p className="border-b border-blue-600 pb-0.5 text-[8.5px] font-bold tracking-wider text-blue-600">
            {section.title}
          </p>
          <div className="mt-2 space-y-1.5">
            {section.lines.map((cls, i) => (
              <div key={i} className={`h-1.5 rounded-full bg-zinc-200 ${cls}`} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <div className="flex-1 flex flex-col bg-zinc-50 text-zinc-900">
      <LandingAnimations />
      {/* NAV */}
      <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="text-lg font-extrabold tracking-tight text-zinc-900">
            Rakit<span className="text-blue-600">CV</span>
          </Link>
          <nav className="flex items-center gap-6 text-sm font-semibold text-zinc-600">
            <Link
              href="/builder"
              className="rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
            >
              Buat CV
            </Link>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden px-6 py-16 sm:py-24">
        <div className="pointer-events-none absolute -top-24 left-1/2 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-blue-200/40 blur-[120px]" />
        <HeroBackdrop />
        <div className="relative mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-2">
          <div data-hero-stagger className="flex flex-col items-start gap-6">
            <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-700">
              Pembuat CV ATS-Friendly
            </span>
            <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight text-zinc-900 sm:text-5xl lg:text-6xl">
              Rakit CV yang <span className="text-blue-600">lolos sistem ATS</span>, tanpa ribet.
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-zinc-600 sm:text-lg">
              Cukup isi data yang diminta. RakitCV mengurus tata letak, font, dan struktur yang aman untuk ATS,
              lalu menghasilkan PDF berteks asli yang siap Anda kirim.
            </p>

            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Link
                href="/builder"
                className="flex h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 active:scale-95"
              >
                Mulai Buat CV
                <ArrowRight size={16} />
              </Link>
              <a
                href="#kaidah-ats"
                className="flex h-12 items-center justify-center rounded-xl border border-zinc-200 bg-white px-7 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100"
              >
                Pelajari Kaidah ATS
              </a>
            </div>

            <ul className="flex flex-wrap gap-x-6 gap-y-2 pt-2">
              {TRUST.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-2 text-sm font-medium text-zinc-600">
                  <Icon size={16} className="text-blue-600" />
                  {label}
                </li>
              ))}
            </ul>
          </div>

          <div data-hero-visual className="flex justify-center lg:justify-end">
            <MockCV />
          </div>
        </div>
      </section>

      {/* CONTOH HASIL */}
      <section className="border-y border-zinc-200 bg-white px-6 py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
          <div data-reveal="left" className="flex justify-center">
            <Image
              src="/img/cv_example.png"
              alt="Contoh hasil CV dari RakitCV: satu kolom, font Inter, judul bagian baku"
              width={893}
              height={1263}
              sizes="(min-width: 1024px) 460px, 90vw"
              className="w-full max-w-[460px] rounded-lg border border-zinc-200 shadow-2xl shadow-blue-900/10"
            />
          </div>
          <div data-reveal="right">
            <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-700">
              Contoh hasil nyata
            </span>
            <h2 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
              Rapi untuk rekruter, terbaca utuh oleh ATS
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-600">
              Ini CV yang dihasilkan RakitCV dengan template ATS Korporat. Setiap bagian punya judul baku dan urutan
              yang konsisten, sehingga mudah dipindai manusia maupun sistem.
            </p>
            <ul className="mt-6 space-y-3">
              {SAMPLE_POINTS.map((point) => (
                <li key={point} className="flex items-start gap-2.5 text-sm text-zinc-700">
                  <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-blue-600" />
                  {point}
                </li>
              ))}
            </ul>
            <Link
              href="/builder"
              className="mt-8 inline-flex h-12 items-center gap-2 rounded-xl bg-blue-600 px-7 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 active:scale-95"
            >
              Buat CV seperti ini
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* CARA KERJA */}
      <section id="cara-kerja" className="border-y border-zinc-200 bg-white px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div data-reveal className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Tiga langkah menuju CV siap kirim</h2>
            <p className="mt-3 text-sm text-zinc-600">Tidak perlu mengatur margin, font, atau tata letak sendiri.</p>
          </div>
          <ol data-stagger className="mt-12 grid gap-6 md:grid-cols-3">
            {STEPS.map(({ icon: Icon, title, text }, i) => (
              <li key={title} className="relative rounded-2xl border border-zinc-200 bg-zinc-50 p-6">
                <span className="absolute right-5 top-4 text-4xl font-extrabold text-zinc-200">{i + 1}</span>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Icon size={20} />
                </div>
                <h3 className="mt-4 text-base font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600">{text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* KAIDAH ATS */}
      <section id="kaidah-ats" className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div data-reveal className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Mengapa CV harus ATS-friendly?</h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-600">
              Banyak perusahaan menyaring CV dengan perangkat lunak sebelum dibaca manusia. Susunan yang rumit bisa
              membuat isi CV terbaca berantakan atau terlewat. Inilah yang dijaga RakitCV:
            </p>
          </div>

          <div data-stagger className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {RULES.map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Icon size={20} />
                </div>
                <h3 className="mt-4 text-base font-bold">{title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-zinc-600">{text}</p>
              </div>
            ))}
          </div>

          <div data-reveal className="mt-8 rounded-2xl border border-zinc-200 bg-white p-6">
            <p className="text-sm font-bold">Sengaja tidak ada di CV Anda:</p>
            <ul className="mt-3 flex flex-wrap gap-3">
              {AVOIDED.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-semibold text-zinc-600"
                >
                  <XCircle size={14} className="text-red-500" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* TEMPLATE */}
      <section className="border-y border-zinc-200 bg-white px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div data-reveal className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Dua template, untuk dua kebutuhan</h2>
            <p className="mt-3 text-sm text-zinc-600">
              Sama-sama satu kolom dan ramah ATS. Yang berbeda: font, margin, warna aksen, dan bagian yang tersedia.
            </p>
          </div>
          <div data-stagger className="mt-12 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6">
              <p className="text-xl font-bold" style={{ fontFamily: 'Calibri, Carlito, Arial, sans-serif' }}>
                ATS Akademik
              </p>
              <p className="mt-1 text-sm text-zinc-600">Font Calibri 11 pt, margin 1 inci, aksen hitam, header rata tengah, nomor halaman.</p>
              <p className="mt-4 flex items-start gap-2 text-sm text-zinc-700">
                <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-blue-600" />
                Cocok untuk beasiswa, studi S2/S3, dosen, dan lembaga penelitian. Ada bagian Minat Penelitian, Publikasi, dan Referensi.
              </p>
            </div>
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6">
              <p className="text-xl font-bold" style={{ fontFamily: "Inter, Helvetica, Arial, sans-serif" }}>
                ATS Korporat
              </p>
              <p className="mt-1 text-sm text-zinc-600">Font Inter 10 pt, margin rapat, aksen biru, header rata kiri.</p>
              <p className="mt-4 flex items-start gap-2 text-sm text-zinc-700">
                <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-blue-600" />
                Cocok untuk perusahaan swasta, BUMN, startup, dan instansi. Ringkas, 1 sampai 2 halaman.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="px-6 py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center text-2xl font-bold tracking-tight sm:text-3xl">Pertanyaan umum</h2>
          <div data-stagger className="mt-10 space-y-3">
            {FAQ.map(({ q, a }) => (
              <FaqItem key={q} q={q} a={a} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA AKHIR */}
      <section className="px-6 pb-20">
        <div data-reveal className="mx-auto flex max-w-4xl flex-col items-center gap-5 rounded-3xl bg-blue-600 px-6 py-14 text-center text-white shadow-xl shadow-blue-600/20">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Siap merakit CV Anda?</h2>
          <p className="max-w-lg text-sm text-blue-100">
            Gratis, tanpa akun, dan data Anda tidak keluar dari perangkat ini.
          </p>
          <Link
            href="/builder"
            className="flex h-12 items-center justify-center gap-2 rounded-xl bg-white px-8 text-sm font-semibold text-blue-700 transition hover:bg-blue-50 active:scale-95"
          >
            Mulai Buat CV
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-zinc-200 bg-white px-6 py-8 text-center text-xs text-zinc-500">
        <p>© {new Date().getFullYear()} RakitCV. Dibuat dengan Next.js & Tailwind CSS.</p>
      </footer>
    </div>
  );
}
