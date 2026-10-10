# Context: RakitCV

Ringkasan produk, arsitektur, dan konvensi proyek untuk developer/AI agent. Disusun dari analisis kode pada branch `master` dan keputusan di PRD RakitCV (10 Oktober 2026).

> **Peringatan (lihat [AGENTS.md](AGENTS.md))**: Next.js yang dipakai (16.2.10) memiliki breaking changes dibanding pengetahuan umum. Baca panduan di `node_modules/next/dist/docs/` sebelum menulis kode terkait Next.js.

## 1. Produk

**RakitCV** adalah web app gratis berbahasa Indonesia untuk merakit CV/Resume yang ramah ATS (Applicant Tracking System). Pengguna cukup mengisi data yang diminta lewat form bertahap, melihat live preview A4, lalu mengunduh PDF berteks asli. Tata letak, font, dan struktur yang aman untuk ATS diurus oleh aplikasi.

**Prinsip produk**

- **Ramah ATS**: satu kolom, font standar PDF, judul bagian baku, teks asli (bukan gambar). Tanpa foto, ikon, tabel, atau kolom ganda.
- **Privasi**: 100% client-side. Tidak ada backend, database, auth, atau API route. Data CV hanya di `localStorage` perangkat pengguna.
- **Tanpa akun**: pengguna langsung mulai dan draf tersimpan otomatis.
- **Gratis penuh**: semua fitur gratis tanpa batasan; pengguna bisa berdonasi secara sukarela.

**Target pengguna**: fresh graduate, profesional yang pindah kerja, pelamar BUMN/korporat yang melamar lewat portal ber-ATS, dan pengguna yang hanya punya ponsel.

**Non-tujuan**: akun/login, sinkronisasi antarperangkat, template kreatif dua kolom, penulisan CV dengan AI, dan pelacakan lamaran.

## 2. Tech Stack

| Area            | Teknologi                                                                                                 |
| --------------- | --------------------------------------------------------------------------------------------------------- |
| Framework       | Next.js 16.2.10 (App Router), React 19.2.4, **JavaScript (bukan TypeScript)**                             |
| React Compiler  | Aktif (`reactCompiler: true` di [next.config.mjs](next.config.mjs), plugin `babel-plugin-react-compiler`) |
| Form & validasi | react-hook-form 7 + `@hookform/resolvers` + zod 4                                                         |
| PDF             | `@react-pdf/renderer` 4 (render di browser)                                                               |
| Styling         | Tailwind CSS v4 (`@import "tailwindcss"` di [globals.css](src/app/globals.css), PostCSS)                  |
| Ikon            | lucide-react                                                                                              |
| Font            | Geist Sans/Mono via `next/font/google` (layout); PDF: Times (bawaan) dan Inter (di-embed)                             |
| Lint            | ESLint 9 + `eslint-config-next` (`npm run lint`)                                                          |
| Hosting         | Vercel (statis/edge), tanpa server aplikasi. Domain kustom belum ditentukan                               |
| Analitik        | Tanpa cookie, hanya event agregat (belum dipasang; lihat §8)                                              |

Alias import: `@/*` → `./src/*` ([jsconfig.json](jsconfig.json)), tetapi kode yang ada memakai **path relatif** (`../../lib/store`).

Script: `npm run dev | build | start | lint`. Belum ada test.

## 3. Struktur Folder

```
src/
├─ app/
│  ├─ layout.js            Root layout: font, metadata, membungkus <CVProvider>
│  ├─ page.js              Landing page (server component), CTA ke /builder
│  ├─ globals.css          Tailwind + @font-face Inter, light only
│  ├─ not-found.js, error.js   Halaman 404 dan error boundary
│  └─ builder/
│     ├─ page.js           Halaman editor (stepper + form + preview + kontrol; PDF dimuat dinamis)
│     └─ PDFDownloadButton.jsx   Tombol unduh via PDFDownloadLink
├─ components/
│  ├─ form/                6 form step + MonthYearInput (date picker bulan/tahun)
│  ├─ preview/CVPreview.jsx    Preview HTML A4 (inline style dari token, di-zoom agar muat kolom)
│  └─ pdf/PDFTemplate.jsx      Dokumen @react-pdf (output sebenarnya)
└─ lib/
   ├─ cvTokens.js          Token desain output CV (font, ukuran, warna, spasi per template)
   ├─ cvContent.js         Helper konten CV bersama preview & PDF (judul bagian, kontak, tanggal, bullet)
   ├─ dates.js             Format tanggal: nilai "YYYY-MM" -> "Feb 2026"
   ├─ ui.js                Class input, label, dan petunjuk (hint) form bersama
   ├─ schema.js            Skema zod + defaultCVData
   └─ store.jsx            CVProvider/useCV (Context + localStorage) + DUMMY_DATA
```

Route: `/` (landing) dan `/builder` (editor).

## 4. Alur Data

```
Form (react-hook-form, state lokal)
   └─ watch() ──► setCvData() ──► CVContext (cvData) ──► localStorage "cv_builder_draft"
                                        ├─► CVPreview  (HTML)
                                        └─► PDFTemplate (via PDFDownloadButton)
```

- **Single source of truth**: `cvData` di `CVProvider` ([store.jsx](src/lib/store.jsx)). Nilai context: `cvData, setCvData, activeStep, setActiveStep, templateId, setTemplateId, resetData, loadExampleData, isLoaded`.
- **Persistensi**: `localStorage` key `cv_builder_draft` (data) dan `cv_builder_template` (`"classic"` | `"modern"`, default `"modern"`). Dimuat di `useEffect` saat mount; penyimpanan hanya setelah `isLoaded` true. `activeStep` **tidak** dipersist.
- Builder menampilkan spinner sampai `isLoaded` true (menghindari hydration mismatch).
- **Rencana**: tambahkan field `version` pada draf agar migrasi skema aman, dan validasi dengan `safeParse` saat dimuat (lihat §7).

### Model data (`CVSchema` di [schema.js](src/lib/schema.js))

```
personalInfo: { fullName, title, email, phone, location, linkedin?, portfolio? }
summary: string (min 10)
experiences[]: { company, position, location, startDate, endDate?, current, description }  (min 1 entri; description min 10)
educations[]:  { institution, degree, major, graduationDate, current, description? }        (min 1 entri)
skills: { hardSkills: string[] (min 1), softSkills: string[] }
certifications[]: { title, issuer, date }
languages[]: { name, proficiency }
```

Pesan error validasi dalam Bahasa Indonesia. Tanggal (`startDate`, `endDate`, `graduationDate`, `date` sertifikat) disimpan sebagai string `YYYY-MM` dari `<input type="month">` dan ditampilkan di CV sebagai "Feb 2026" lewat [dates.js](src/lib/dates.js); `endDate` kosong bila `current`, dan CV menulis "Sekarang". `endDate` wajib kecuali `current = true`. `description` pengalaman dipecah per baris (`\n`) menjadi bullet di preview/PDF.

## 5. Komponen Utama

- **[builder/page.js](src/app/builder/page.js)**: stepper 6 langkah (Data Diri → Ringkasan → Pengalaman → Pendidikan → Keahlian → Lainnya) dengan `switch(activeStep)` untuk memilih form; toggle template (Classic/Modern), tombol "Isi Contoh", "Reset", dan unduh PDF. Layout 2 kolom (form kiri, preview sticky kanan).
- **Form components**: masing-masing memanggil `useForm` dengan `zodResolver` dan `defaultValues` dari `cvData`, lalu menyinkronkan ke context lewat `watch` (subscription untuk field array/skills; `watch()` + `useEffect` pada PersonalInfo/Additional). Tombol submit memvalidasi lalu `setActiveStep(n+1)`; tombol "Kembali" ke step sebelumnya. Experience/Education memakai `useFieldArray`; Skills memakai input chip dengan `setValue`.
- **[CVPreview.jsx](src/components/preview/CVPreview.jsx)**: render HTML A4 (21cm, padding 1.8cm). Classic = Times/hitam, Modern = Inter/aksen biru. Lebar tetap 21cm, di kolom sempit halaman di-`zoom` otomatis (ResizeObserver).
- **[PDFTemplate.jsx](src/components/pdf/PDFTemplate.jsx)**: `Document/Page` react-pdf dengan Times bawaan (classic) dan Inter yang di-embed dari `public/fonts` (modern, subset Latin, lisensi OFL). Gaya dibuat dari token di `cvTokens.js`. Warna/aksen dibedakan per `templateId`. Nama file: `CV_<Nama_Lengkap>.pdf`.
- **[PDFDownloadButton.jsx](src/app/builder/PDFDownloadButton.jsx)**: dimuat lewat `next/dynamic` (`ssr: false`) dan hanya dirender bila `getCVIssues` kosong; kalau tidak, tombol nonaktif dan panel menampilkan bagian yang belum lengkap.

### Aturan output CV (preview dan PDF)

- Urutan bagian tetap: Header → Ringkasan → Pengalaman → Pendidikan → Keahlian → Sertifikasi → Bahasa.
- Bagian opsional yang kosong tidak dicetak.
- Preview HTML dan PDF harus identik secara isi dan urutan.

## 6. Konvensi

- Semua komponen interaktif memakai `"use client"`; file komponen `.jsx`, halaman/layout `.js`.
- Teks UI, label, dan pesan validasi dalam **Bahasa Indonesia**.
- Styling Tailwind inline; **tema hanya light (tanpa dark mode)**: latar zinc-50/white, aksen blue-600, `color-scheme: light`. Jangan menambah varian `dark:`. Class input bersama ada di [ui.js](src/lib/ui.js).
- Output CV mengikuti [CV_DESIGN_SYSTEM.md](CV_DESIGN_SYSTEM.md). Ubah nilai visual hanya di `cvTokens.js` dan teks/format di `cvContent.js`; preview memakai inline style + `ptToPx`, bukan kelas Tailwind.
- Perubahan tampilan harus dijaga konsisten antara `CVPreview.jsx` dan `PDFTemplate.jsx` (keduanya implementasi terpisah dari desain yang sama).
- Menambah field CV: ubah `schema.js` (skema + `defaultCVData`), `DUMMY_DATA` di `store.jsx`, form terkait, `CVPreview`, dan `PDFTemplate`.
- Form: setiap kolom punya petunjuk singkat (`hintClasses`, tampil di bawah input; pembungkus kolom harus `flex flex-col`). Placeholder memakai satu persona contoh ("John Doe"). Form di-mount ulang lewat `key={dataVersion}` saat "Isi Contoh"/"Reset".
- Jangan menambahkan fitur yang mengirim data CV keluar browser. Analitik hanya boleh mencatat event agregat (buka editor, langkah selesai, unduh PDF), tanpa cookie dan tanpa isi CV atau data pribadi.
- Muat `@react-pdf/renderer` secara dinamis bila memungkinkan agar editor tetap ringan.

## 7. Isu yang Diketahui (prioritas perbaikan)

> **Status**: semua isu P0 dan P1 di bawah sudah diterapkan di kode (key `dataVersion` pada form, `getCVIssues` + gating unduh, `parseDraft` + `version` draf, class Tailwind, `lang="id"`, landing server component, `dynamic` import PDF, `LICENSE`, CI, `not-found.js`, `error.js`). Tabel dipertahankan sebagai riwayat.

Teramati dari kode (belum diverifikasi dengan menjalankan app). P0 memblokir rilis publik.

| Prio | Isu                                                                                                                                                                    | Perbaikan                                                                                                                          |
| ---- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| P0   | Form tidak ter-reset saat `loadExampleData()`/`resetData()`; form aktif bisa menampilkan nilai lama dan `watch` menimpa balik                                          | Beri `key` berbasis versi data pada form, atau panggil `reset()` saat `cvData` berubah dari luar                                   |
| P0   | Validasi tidak memblokir navigasi/unduh; `CVSchema` penuh tidak dipakai di runtime                                                                                     | Validasi `CVSchema` penuh sebelum unduh, tampilkan bagian yang belum lengkap + tautan ke langkahnya; status per langkah di stepper |
| P0   | Data localStorage dimuat dengan `JSON.parse` langsung; data rusak/versi lama bisa membuat render error                                                                 | `safeParse` + field `version` + opsi pulihkan sebagian atau mulai baru                                                             |
| P1   | Class Tailwind typo (`placeholder:text-zinc-655`, `text-zinc-555`, `duration-355`, `hover:bg-zinc-850`)                                                                | Ganti ke nilai valid; ekstrak `inputClasses`/`labelClasses` ke satu modul                                                          |
| P1   | `lang="en"` padahal konten Indonesia; `globals.css` memaksa `font-family: Arial` menimpa Geist; [page.js](src/app/page.js) client component tanpa kebutuhan interaktif | `lang="id"`, hapus override font, jadikan landing server component                                                                 |
| P1   | `name` di package.json masih `cv-maker`; README menyebut MIT tanpa file `LICENSE`; tanpa test, CI, halaman 404/error                                                   | Ganti ke `rakitcv`, tambah `LICENSE`, CI lint + build, halaman 404 dan error boundary                                              |

Keterbatasan yang diterima: font PDF (Times bawaan, Inter subset Latin) tidak mendukung karakter non-Latin; draf lama dengan tanggal teks bebas ditandai belum valid sampai tanggalnya dipilih ulang.

## 8. Roadmap

| Fase | Isi                                                                                                                                                                                            | Gate keluar                                         |
| ---- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| MVP  | Tutup 3 isu P0; semua kebutuhan P0; isu P1 kode & repo; uji parsing ATS + CI                                                                                                                   | Rilis publik: PDF sampel lolos uji parsing ATS 100% |
| v1.1 | Status per langkah + tips per field; contoh CV + FAQ di landing; ekspor/impor draf JSON; urutan entri drag-and-drop; tautan donasi sukarela (landing dan setelah unduh); analitik tanpa cookie | Tingkat penyelesaian ≥ 40%                          |
| v1.2 | Template berbahasa Inggris; panduan isi per jabatan (contoh ringkasan, bullet, keahlian yang bisa disisipkan ke form); kalibrasi target metrik                                                 | —                                                   |

### Metrik keberhasilan (target awal)

| Metrik                   | Definisi                                                           | Target     |
| ------------------------ | ------------------------------------------------------------------ | ---------- |
| Tingkat penyelesaian     | Sesi yang mengunduh PDF ÷ sesi yang membuka `/builder`             | ≥ 40%      |
| Waktu ke unduhan pertama | Median waktu dari buka `/builder` ke unduhan PDF                   | ≤ 20 menit |
| Lolos uji parsing        | PDF sampel yang teksnya terbaca utuh dan berurutan                 | 100%       |
| Draf dilanjutkan         | Sesi `/builder` yang memuat draf tersimpan ÷ semua sesi `/builder` | ≥ 20%      |
| Error render             | Sesi dengan error saat memuat draf atau membuat PDF                | < 1%       |

## 9. Menjalankan

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
npm run lint
```
