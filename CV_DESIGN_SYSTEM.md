# Design System: Output CV RakitCV

Standar visual untuk CV yang dihasilkan RakitCV, baik live preview (`CVPreview.jsx`) maupun PDF (`PDFTemplate.jsx`). Tujuannya satu: **CV mudah dibaca manusia dan terbaca utuh oleh ATS.**

> Dokumen ini berlaku untuk **output CV**, bukan UI editor. Nilai yang ditandai _(usulan)_ belum tentu sama dengan kode saat ini. Samakan kedua implementasi ke nilai di sini, lalu pindahkan tokennya ke satu modul bersama (lihat §9).

---

## 1. Prinsip

1. **Teks dulu, dekorasi belakangan.** Semua informasi berupa teks asli yang bisa diseleksi. Tidak ada informasi yang hanya disampaikan lewat warna, ikon, atau gambar.
2. **Satu kolom, satu arus baca.** Urutan visual sama dengan urutan teks di file PDF, dari atas ke bawah.
3. **Struktur yang bisa ditebak.** Judul bagian baku dan urutan bagian tetap, sehingga parser ATS bisa memetakan isi ke field yang benar.
4. **Hierarki lewat ukuran dan ketebalan**, bukan lewat kotak, latar, atau garis berlebih.
5. **Preview = PDF.** Isi, urutan, dan proporsi keduanya harus identik.

---

## 2. Halaman

| Token             | Nilai               | Catatan                             |
| ----------------- | ------------------- | ----------------------------------- |
| `page.size`       | A4, 210 × 297 mm    | Preview: lebar 21cm                 |
| `page.margin`     | 18 mm di semua sisi | Preview: padding 1.8cm. PDF: ±51 pt |
| `page.columns`    | 1                   | Tidak ada sidebar atau kolom ganda  |
| `page.background` | Putih (`#FFFFFF`)   | Tanpa watermark atau pola           |
| `page.maxPages`   | 2 _(usulan)_        | Fresh graduate disarankan 1 halaman |

**Pemenggalan halaman (PDF):** judul bagian tidak boleh tertinggal sendirian di dasar halaman. Pakai `minPresenceAhead` pada judul bagian dan `wrap={false}` pada header tiap entri, supaya nama jabatan tidak terpisah dari perusahaannya.

---

## 3. Tipografi

### 3.1 Font

| Template | PDF (font bawaan)                                  | Preview (CSS)                     |
| -------- | -------------------------------------------------- | --------------------------------- |
| Classic  | `Times-Roman`, `Times-Bold`, `Times-Italic`        | `"Times New Roman", Times, serif` |
| Modern   | `Helvetica`, `Helvetica-Bold`, `Helvetica-Oblique` | `Helvetica, Arial, sans-serif`    |

Classic memakai font bawaan PDF (tidak perlu di-embed). Modern memakai **Inter**, di-embed sebagai subset Latin dengan teks asli yang tetap bisa diseleksi. Konsekuensinya, karakter non-Latin tidak didukung, dan ini diterima.

### 3.2 Skala ukuran

Satuan acuan adalah **pt** (PDF). Untuk preview, konversinya 1 pt ≈ 1.333 px.

| Token             | Ukuran  | Ketebalan                                  | Dipakai untuk                   |
| ----------------- | ------- | ------------------------------------------ | ------------------------------- |
| `type.name`       | 20 pt   | Bold                                       | Nama lengkap                    |
| `type.title`      | 11.5 pt | Regular                                    | Jabatan/headline di bawah nama  |
| `type.section`    | 11 pt   | Bold, HURUF KAPITAL, letter-spacing 0.5 pt | Judul bagian                    |
| `type.entryTitle` | 10.5 pt | Bold                                       | Posisi, gelar, nama sertifikasi |
| `type.entryMeta`  | 10 pt   | Regular (Classic: Italic)                  | Perusahaan, institusi, lokasi   |
| `type.date`       | 10 pt   | Regular                                    | Rentang tanggal, rata kanan     |
| `type.body`       | 10 pt   | Regular                                    | Ringkasan, bullet, keahlian     |
| `type.contact`    | 9.5 pt  | Regular                                    | Baris kontak di header          |

**Batas aman:** teks isi tidak boleh di bawah 9.5 pt, dan nama tidak boleh di atas 22 pt.

### 3.3 Spasi baris

| Token             | Nilai |
| ----------------- | ----- |
| `leading.body`    | 1.35  |
| `leading.heading` | 1.15  |

---

## 4. Warna

Warna hanya untuk aksen. CV harus tetap terbaca utuh bila dicetak hitam-putih.

| Token          | Classic   | Modern               | Dipakai untuk            |
| -------------- | --------- | -------------------- | ------------------------ |
| `color.text`   | `#111111` | `#111827`            | Semua teks isi           |
| `color.muted`  | `#444444` | `#4B5563`            | Meta, tanggal, kontak    |
| `color.accent` | `#111111` | `#2563EB` (blue-600) | Nama, judul bagian       |
| `color.rule`   | `#111111` | `#2563EB`            | Garis bawah judul bagian |

Aturan kontras: teks di atas putih minimal 4.5:1 (WCAG AA). Semua nilai di atas sudah memenuhi.

---

## 5. Spasi

Skala dasar 4 pt.

| Token              | Nilai | Dipakai untuk                          |
| ------------------ | ----- | -------------------------------------- |
| `space.xs`         | 2 pt  | Antara baris judul entri dan meta      |
| `space.sm`         | 4 pt  | Antar bullet                           |
| `space.md`         | 8 pt  | Antar entri dalam satu bagian          |
| `space.lg`         | 14 pt | Sebelum judul bagian                   |
| `space.sectionGap` | 6 pt  | Dari garis judul bagian ke isi pertama |

---

## 6. Komponen

### 6.1 Header

```
NAMA LENGKAP                                   ← type.name, color.accent
Frontend Developer                             ← type.title
email@contoh.com | 0812-xxxx | Bandung | linkedin.com/in/nama | nama.dev
                                               ← type.contact, color.muted
```

- Rata kiri untuk Modern, rata tengah untuk Classic.
- Kontak dalam **satu baris teks**, dipisah `|`. Jangan pakai ikon telepon/email, karena ikon tidak terbaca ATS dan bisa mengacaukan urutan teks.
- URL ditulis tanpa `https://`, tetapi tetap dibuat tautan aktif di PDF.
- Field opsional yang kosong (LinkedIn, portfolio) dihilangkan beserta pemisahnya.

### 6.2 Judul bagian

```
PENGALAMAN KERJA
───────────────────────────────────────────────
```

- `type.section` + garis bawah 0.75 pt `color.rule` selebar konten.
- Hanya pakai judul baku (§7).
- Judul berupa teks biasa, bukan gambar dan bukan bagian dari tabel.

### 6.3 Entri (Pengalaman, Pendidikan)

```
Frontend Developer                          Jan 2023 – Sekarang
PT Contoh Teknologi, Bandung
• Membangun dashboard admin dengan Next.js yang dipakai 40 cabang
• Memangkas waktu muat halaman dari 4,1 s menjadi 1,6 s
```

| Bagian        | Token                           | Aturan                                                                 |
| ------------- | ------------------------------- | ---------------------------------------------------------------------- |
| Baris 1 kiri  | `type.entryTitle`               | Posisi / gelar + jurusan                                               |
| Baris 1 kanan | `type.date`, `color.muted`      | Tanggal dirata kanan dengan flex `space-between`, bukan tabel atau tab |
| Baris 2       | `type.entryMeta`, `color.muted` | Perusahaan/institusi, lalu lokasi                                      |
| Bullet        | `type.body`                     | Satu baris input (`\n`) = satu bullet                                  |

- **Format tanggal:** input form berupa date picker bulan + tahun (`<input type="month">`), ditampilkan di CV sebagai `Bulan Tahun – Bulan Tahun` (mis. `Feb 2026 – Sekarang`) dengan en dash `–`. Konversi ada di `src/lib/dates.js`. Bila `current = true`, akhirnya ditulis "Sekarang".
- **Bullet:** karakter `•` dengan indent gantung 10 pt. Jangan pakai emoji atau ikon centang.
- Pendidikan tanpa deskripsi cukup dua baris.

### 6.4 Keahlian

```
KEAHLIAN
Hard skill: React, Next.js, Tailwind CSS, Laravel, Livewire, Git
Soft skill: Komunikasi, Kerja tim, Manajemen waktu
```

- Teks dipisah koma dengan label tebal di depannya.
- **Dilarang:** bar progres, bintang, persentase, atau chip berlatar. Elemen ini tidak terbaca ATS dan tidak bermakna bagi rekruter.
- Baris "Soft skill" disembunyikan bila kosong.

### 6.5 Sertifikasi dan Bahasa

```
SERTIFIKASI
Nama Sertifikasi — Penerbit (2024)

BAHASA
Indonesia (Penutur asli), Inggris (Profesional)
```

Satu baris per sertifikasi. Bahasa ditulis sebagai daftar dipisah koma. Bagian kosong tidak dicetak sama sekali, termasuk judulnya.

---

## 7. Struktur dan urutan bagian

Urutan bagian tetap dan tidak bisa diubah pengguna:

| #   | Judul (ID)       | Judul (EN, v1.2) | Wajib |
| --- | ---------------- | ---------------- | ----- |
| 1   | _(Header)_       | _(Header)_       | Ya    |
| 2   | RINGKASAN        | SUMMARY          | Ya    |
| 3   | PENGALAMAN KERJA | WORK EXPERIENCE  | Ya    |
| 4   | PENDIDIKAN       | EDUCATION        | Ya    |
| 5   | KEAHLIAN         | SKILLS           | Ya    |
| 6   | SERTIFIKASI      | CERTIFICATIONS   | Tidak |
| 7   | BAHASA           | LANGUAGES        | Tidak |

---

## 8. Template

Kedua template memakai **struktur, ukuran, dan spasi yang sama**. Perbedaannya hanya pada font, warna, dan perataan header.

| Aspek       | Classic                         | Modern                               |
| ----------- | ------------------------------- | ------------------------------------ |
| Font        | Times (serif)                   | Inter (sans)                         |
| Aksen       | Hitam                           | Biru `#2563EB`                       |
| Header      | Rata tengah                     | Rata kiri                            |
| Meta entri  | Italic                          | Regular                              |
| Cocok untuk | Hukum, keuangan, BUMN, akademik | Teknologi, startup, kreatif-korporat |

**Template baru** boleh ditambahkan hanya bila tetap mematuhi §1 dan §10. Tambahkan sebagai varian token, bukan sebagai komponen baru.

---

## 9. Implementasi token

Simpan semua nilai di satu modul, misalnya `src/lib/cvTokens.js`, lalu pakai di kedua implementasi.

```js
// src/lib/cvTokens.js
const base = {
  page: { marginPt: 51, marginCm: 1.8 },
  size: { name: 20, title: 11.5, section: 11, entryTitle: 10.5, meta: 10, body: 10, contact: 9.5 },
  leading: { body: 1.35, heading: 1.15 },
  space: { xs: 2, sm: 4, md: 8, lg: 14, sectionGap: 6 },
  rule: 0.75,
};

export const CV_THEMES = {
  classic: {
    ...base,
    font: { pdf: "Times-Roman", pdfBold: "Times-Bold", pdfItalic: "Times-Italic", css: '"Times New Roman", Times, serif' },
    color: { text: "#111111", muted: "#444444", accent: "#111111", rule: "#111111" },
    headerAlign: "center",
    metaItalic: true,
  },
  modern: {
    ...base,
    font: { pdf: "Helvetica", pdfBold: "Helvetica-Bold", pdfItalic: "Helvetica-Oblique", css: "Helvetica, Arial, sans-serif" },
    color: { text: "#111827", muted: "#4B5563", accent: "#2563EB", rule: "#2563EB" },
    headerAlign: "left",
    metaItalic: false,
  },
};

export const ptToPx = (pt) => `${(pt * 4) / 3}px`;
```

- **PDF:** `StyleSheet.create` membaca langsung angka pt dari `CV_THEMES[templateId]`.
- **Preview:** pakai inline style atau CSS variables dengan `ptToPx()`. Jangan pakai kelas Tailwind bawaan (`text-sm`, dst.), karena skalanya tidak sama dengan pt PDF.

---

## 10. Larangan ATS (checklist review)

Setiap perubahan pada output CV wajib lolos checklist ini:

- [ ] Tidak ada tabel, kolom ganda, text box, atau posisi absolut untuk isi.
- [ ] Tidak ada foto, logo, ikon, emoji, bar keahlian, atau grafik.
- [ ] Tidak ada teks di header/footer halaman PDF (sebagian ATS mengabaikannya).
- [ ] Semua teks bisa diseleksi dan disalin dengan urutan yang benar.
- [ ] Judul bagian memakai istilah baku dari §7.
- [ ] Tanggal konsisten dalam format `Bulan Tahun – Bulan Tahun`.
- [ ] Teks isi minimal 9.5 pt, kontras minimal 4.5:1.
- [ ] Preview dan PDF identik dalam isi dan urutan.
- [ ] Nama file `CV_<Nama_Lengkap>.pdf`.

**Cara uji cepat:** buka PDF, tekan Ctrl+A lalu salin ke editor teks polos. Hasilnya harus terbaca berurutan dari Header sampai Bahasa, tanpa potongan yang tertukar.
