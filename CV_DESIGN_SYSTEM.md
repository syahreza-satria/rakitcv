# Design System: Output CV RakitCV

Standar visual untuk CV yang dihasilkan RakitCV, baik live preview (`CVPreview.jsx`) maupun PDF (`PDFTemplate.jsx`). Tujuannya satu: **CV mudah dibaca manusia dan terbaca utuh oleh ATS.**

RakitCV punya dua template:

| ID          | Nama             | Untuk                                                                  |
| ----------- | ---------------- | ---------------------------------------------------------------------- |
| `corporate` | **ATS Korporat** | Melamar kerja di perusahaan swasta, BUMN, startup, instansi            |
| `academic`  | **ATS Akademik** | Beasiswa, studi S2/S3, posisi dosen, asisten riset, lembaga penelitian |

> Dokumen ini berlaku untuk **output CV**, bukan UI editor. Semua nilai tinggal di `src/lib/cvTokens.js`; preview dan PDF hanya membaca token, tidak menulis angka sendiri.

---

## 1. Prinsip (berlaku untuk kedua template)

1. **Teks dulu, dekorasi belakangan.** Semua informasi berupa teks asli yang bisa diseleksi. Tidak ada informasi yang hanya disampaikan lewat warna, ikon, atau gambar.
2. **Satu kolom, satu arus baca.** Urutan visual sama dengan urutan teks di file PDF.
3. **Struktur yang bisa ditebak.** Judul bagian baku dan urutan bagian tetap per template.
4. **Hierarki lewat ukuran dan ketebalan**, bukan lewat kotak, latar, atau garis berlebih.
5. **Preview = PDF.** Isi, urutan, dan proporsi keduanya identik.
6. **Spasi hanya dari token.** Tidak ada margin/padding "kira-kira" di komponen. Spasi vertikal selalu diberikan sebagai `marginTop` elemen berikutnya, tidak pernah `marginBottom`, supaya jarak antarbagian tidak menumpuk ganda.

---

## 2. Perbedaan inti kedua template

| Aspek                            | ATS Korporat                    | ATS Akademik                                                                         |
| -------------------------------- | ------------------------------- | ------------------------------------------------------------------------------------ |
| Tujuan pembaca                   | Rekruter, skimming 6–10 detik   | Komite seleksi, dibaca teliti                                                        |
| Panjang                          | 1 halaman (fresh grad), maks. 2 | Tidak dibatasi; wajar 2–5 halaman                                                    |
| Font                             | Inter (embed, subset Latin)     | Calibri (PDF: Carlito, embed, subset Latin)                                          |
| Ukuran teks isi                  | 10 pt                           | 11 pt                                                                                |
| Margin halaman                   | Rapat (12.7 mm / 0,5 inci)      | Rapat (12.7 mm / 0,5 inci)                                                           |
| Warna aksen                      | Biru `#2563EB`                  | Hitam saja                                                                           |
| Header                           | Rata kiri                       | Rata tengah                                                                          |
| Bagian pertama setelah ringkasan | Pengalaman Kerja                | Pendidikan                                                                           |
| Bagian khas                      | —                               | Minat Penelitian, Publikasi, Pengalaman Mengajar, Penghargaan, Presentasi, Referensi |
| Nomor halaman                    | Tidak                           | Ya, di footer ("Nama — Hal. 2 dari 3")                                               |

---

## 3. Margin dan padding

Satuan acuan **pt** (PDF). Konversi: 1 mm = 2.835 pt; untuk preview, 1 pt = 1.333 px (`ptToPx`).

Gambaran posisi token:

```
┌──────────────── page.marginTop ────────────────┐
│ NAMA LENGKAP                                   │
│   ↕ header.nameToTitle                         │
│ Jabatan / Bidang                               │
│   ↕ header.titleToContact                      │
│ email | telepon | kota | linkedin              │
│   ↕ header.bottom                              │
│ JUDUL BAGIAN                                   │
│   ↕ section.titleToRule                        │
│ ────────────────────── (section.ruleWidth)     │
│   ↕ section.ruleToContent                      │
│ Judul entri                       Tanggal      │
│   ↕ entry.titleToMeta                          │
│ Institusi, Lokasi                              │
│   ↕ entry.metaToBody                           │
│ ⟷bullet.indent • Isi bullet ...               │
│   ↕ bullet.gap                                 │
│ ⟷bullet.indent • Isi bullet ...               │
│   ↕ entry.gap                                  │
│ Judul entri berikutnya                         │
│   ↕ section.gap                                │
│ JUDUL BAGIAN BERIKUTNYA                        │
└──────────────── page.marginBottom ─────────────┘
 ⟷ page.marginLeft                page.marginRight ⟷
```

### 3.1 Halaman

| Token               | ATS Korporat      | ATS Akademik                  |
| ------------------- | ----------------- | ----------------------------- |
| `page.size`         | A4 (210 × 297 mm) | A4 (210 × 297 mm)             |
| `page.marginTop`    | 12.7 mm (36 pt)   | 12.7 mm (36 pt)               |
| `page.marginBottom` | 12.7 mm (36 pt)   | 12.7 mm (36 pt)               |
| `page.marginLeft`   | 12.7 mm (36 pt)   | 12.7 mm (36 pt)               |
| `page.marginRight`  | 12.7 mm (36 pt)   | 12.7 mm (36 pt)               |
| Lebar konten        | 184.6 mm (523 pt) | 184.6 mm (523 pt)             |
| `footer.offset`     | —                 | 4 mm (11 pt) dari tepi bawah |

**Aturan halaman**

- Margin tidak boleh diperkecil di bawah nilai di atas untuk "memaksa muat satu halaman". Bila isi Korporat melebihi 1 halaman, kurangi isi, bukan spasi.
- Margin kiri dan kanan selalu sama.
- Akademik: nomor halaman di footer dimulai dari halaman 1, ukuran 9 pt, warna `color.muted`. Footer hanya berisi info yang juga ada di header (nama), jadi aman meski diabaikan ATS.

### 3.2 Header

| Token                   | ATS Korporat             | ATS Akademik                   |
| ----------------------- | ------------------------ | ------------------------------ |
| `header.align`          | kiri                     | tengah                         |
| `header.nameToTitle`    | 2 pt                     | 4 pt                           |
| `header.titleToContact` | 4 pt                     | 6 pt                           |
| `header.contactGap`     | `\|` (spasi–garis–spasi) | `\|`                           |
| `header.bottom`         | 10 pt                    | 14 pt                          |
| Garis di bawah header   | Tidak                    | Ya, 0.75 pt hitam, lebar penuh |

Bila kontak melebihi satu baris, pecah di pemisah `|` dengan jarak antarbaris mengikuti `leading.body`. Jangan memperkecil font kontak.

### 3.3 Bagian (section)

| Token                                                            | ATS Korporat | ATS Akademik |
| ---------------------------------------------------------------- | ------------ | ------------ |
| `section.gap` (jarak dari isi bagian sebelumnya ke judul bagian) | 12 pt        | 16 pt        |
| `section.titleToRule`                                            | 2 pt         | 3 pt         |
| `section.ruleWidth`                                              | 0.75 pt      | 0.5 pt       |
| `section.ruleToContent`                                          | 6 pt         | 8 pt         |
| `section.paddingX`                                               | 0            | 0            |

`section.paddingX = 0` artinya isi bagian sejajar tepat dengan margin kiri. Tidak ada indent bagian, kotak, atau latar.

### 3.4 Entri (pengalaman, pendidikan, penelitian, mengajar)

| Token                                      | ATS Korporat | ATS Akademik |
| ------------------------------------------ | ------------ | ------------ |
| `entry.gap` (antarentri dalam satu bagian) | 8 pt         | 10 pt        |
| `entry.titleToMeta`                        | 1 pt         | 2 pt         |
| `entry.metaToBody`                         | 3 pt         | 4 pt         |
| `entry.dateMinWidth`                       | 90 pt        | 100 pt       |
| `entry.titleDateGap`                       | 12 pt        | 12 pt        |

Tanggal dirata kanan dengan flex `space-between`. Judul entri boleh membungkus ke baris berikutnya, tetapi tidak boleh menimpa kolom tanggal (`dateMinWidth`).

### 3.5 Bullet

| Token                                          | ATS Korporat | ATS Akademik |
| ---------------------------------------------- | ------------ | ------------ |
| `bullet.indent` (margin kiri teks)             | 12 pt        | 14 pt        |
| `bullet.hanging` (posisi `•` dari margin kiri) | 2 pt         | 3 pt         |
| `bullet.gap` (antarbullet)                     | 2 pt         | 3 pt         |
| `bullet.char`                                  | `•`          | `•`          |

Baris kedua sebuah bullet sejajar dengan teks baris pertama (hanging indent), bukan dengan karakter `•`.

### 3.6 Daftar publikasi dan referensi (khusus Akademik)

| Token                    | Nilai                                                       |
| ------------------------ | ----------------------------------------------------------- |
| `citation.gap`           | 6 pt antarentri                                             |
| `citation.hangingIndent` | 18 pt (baris kedua dst. menjorok)                           |
| `citation.style`         | APA 7                                                       |
| `citation.numbering`     | Tanpa nomor; urut tahun terbaru dulu                        |
| `reference.columns`      | 1 (setiap referensi blok 3–4 baris, dipisah `citation.gap`) |

Nama pemilik CV di daftar publikasi ditebalkan. Tidak memakai nomor `[1]` karena sebagian ATS membacanya sebagai daftar terpisah.

### 3.7 Pemenggalan halaman (PDF)

- Judul bagian: `minPresenceAhead = 40 pt` (Korporat) / `56 pt` (Akademik), supaya judul tidak tertinggal sendirian di dasar halaman.
- Header entri (judul + meta): `wrap={false}`.
- Satu entri sitasi: `wrap={false}`.
- Bullet boleh terpotong antarhalaman.

---

## 4. Tipografi

### 4.1 Font

| Template     | PDF                                                                             | Preview (CSS)                         |
| ------------ | ------------------------------------------------------------------------------- | ------------------------------------- |
| ATS Korporat | `Inter` (Regular, SemiBold, Bold; embed dari `public/fonts`, subset Latin, OFL) | `Inter, Helvetica, Arial, sans-serif` |
| ATS Akademik | `Carlito`, `Carlito-Bold`, `Carlito-Italic` (kembaran metrik Calibri; embed dari `public/fonts`, subset Latin, OFL) | `Calibri, Carlito, Arial, sans-serif` |

### 4.2 Skala ukuran

| Token             | ATS Korporat                            | ATS Akademik                            | Ketebalan                         |
| ----------------- | --------------------------------------- | --------------------------------------- | --------------------------------- |
| `type.name`       | 20 pt                                   | 18 pt                                   | Bold                              |
| `type.title`      | 11 pt                                   | 11 pt                                   | Regular                           |
| `type.contact`    | 9.5 pt                                  | 10 pt                                   | Regular                           |
| `type.section`    | 10.5 pt, HURUF KAPITAL, tracking 0.6 pt | 11.5 pt, HURUF KAPITAL, tracking 0.4 pt | Bold                              |
| `type.entryTitle` | 10.5 pt                                 | 11 pt                                   | Korporat SemiBold, Akademik Bold  |
| `type.entryMeta`  | 10 pt                                   | 11 pt                                   | Korporat Regular, Akademik Italic |
| `type.date`       | 9.5 pt                                  | 10.5 pt                                 | Regular                           |
| `type.body`       | 10 pt                                   | 11 pt                                   | Regular                           |
| `type.citation`   | —                                       | 10.5 pt                                 | Regular                           |
| `type.footer`     | —                                       | 9 pt                                    | Regular                           |

### 4.3 Spasi baris

| Token             | ATS Korporat | ATS Akademik |
| ----------------- | ------------ | ------------ |
| `leading.body`    | 1.3          | 1.15         |
| `leading.heading` | 1.15         | 1.15         |

Batas aman: teks isi tidak boleh di bawah 9.5 pt.

---

## 5. Warna

| Token                               | ATS Korporat                  | ATS Akademik |
| ----------------------------------- | ----------------------------- | ------------ |
| `color.text`                        | `#111827`                     | `#000000`    |
| `color.muted`                       | `#4B5563`                     | `#333333`    |
| `color.accent` (nama, judul bagian) | `#2563EB`                     | `#000000`    |
| `color.rule`                        | `#2563EB`                     | `#000000`    |
| `color.link`                        | `#111827` (tanpa garis bawah) | `#000000`    |

CV harus tetap terbaca utuh bila dicetak hitam-putih. Kontras teks minimal 4.5:1.

---

## 6. Struktur dan urutan bagian

Urutan tetap per template; pengguna tidak bisa mengubahnya. Bagian opsional yang kosong tidak dicetak, termasuk judulnya.

### 6.1 ATS Korporat

| #   | Judul (ID)       | Judul (EN, v1.2) | Wajib |
| --- | ---------------- | ---------------- | ----- |
| 1   | _(Header)_       | _(Header)_       | Ya    |
| 2   | RINGKASAN        | SUMMARY          | Ya    |
| 3   | PENGALAMAN KERJA | WORK EXPERIENCE  | Ya    |
| 4   | PENDIDIKAN       | EDUCATION        | Ya    |
| 5   | PENGALAMAN SUKARELA | VOLUNTEER EXPERIENCE | Tidak |
| 6   | PENGHARGAAN      | AWARDS           | Tidak |
| 7   | KEAHLIAN         | SKILLS           | Ya    |
| 8   | SERTIFIKASI      | CERTIFICATIONS   | Tidak |
| 9   | BAHASA           | LANGUAGES        | Tidak |

### 6.2 ATS Akademik

| #   | Judul (ID)                | Judul (EN, v1.2)        | Wajib |
| --- | ------------------------- | ----------------------- | ----- |
| 1   | _(Header)_                | _(Header)_              | Ya    |
| 2   | MINAT PENELITIAN          | RESEARCH INTERESTS      | Ya    |
| 3   | PENDIDIKAN                | EDUCATION               | Ya    |
| 4   | PENGALAMAN PENELITIAN     | RESEARCH EXPERIENCE     | Tidak |
| 5   | PUBLIKASI                 | PUBLICATIONS            | Tidak |
| 6   | PENGALAMAN MENGAJAR       | TEACHING EXPERIENCE     | Tidak |
| 7   | PENGALAMAN KERJA          | PROFESSIONAL EXPERIENCE | Tidak |
| 8   | PENGALAMAN SUKARELA       | VOLUNTEER EXPERIENCE    | Tidak |
| 9   | PENGHARGAAN DAN BEASISWA  | AWARDS AND SCHOLARSHIPS | Tidak |
| 10  | PRESENTASI DAN KONFERENSI | PRESENTATIONS           | Tidak |
| 11  | KEAHLIAN                  | SKILLS                  | Ya    |
| 12  | SERTIFIKASI               | CERTIFICATIONS          | Tidak |
| 13  | BAHASA                    | LANGUAGES               | Tidak |
| 14  | REFERENSI                 | REFERENCES              | Tidak |

Di template Akademik, entri Pendidikan menampilkan juga judul skripsi/tesis, pembimbing, dan IPK bila diisi.

### 6.3 Aturan isi (berlaku untuk kedua template)

Mengikuti panduan struktur CV (contoh LPDP). Aturan 1 dan 2 ditegakkan validasi; sisanya lewat petunjuk di form dan urutan otomatis.

| #   | Aturan                                                                                           | Penegakan                                                                  |
| --- | ------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------- |
| 1   | Nama ditulis tanpa gelar; gelar ditulis di bagian Pendidikan                                      | Validasi `fullName` menolak awalan (Dr., Prof., Ir.) dan akhiran (S.Kom, M.T.) |
| 2   | Nomor telepon memakai kode negara                                                                 | Validasi `phone`: diawali `+` dan kode negara, mis. `+62 812-3456-7890`     |
| 3   | Boleh mencantumkan LinkedIn atau tautan portofolio                                                | Field opsional di header                                                   |
| 4   | Ringkasan to the point: menunjukkan pengalaman dan kualitas                                       | Maksimal 600 karakter + petunjuk di form                                    |
| 5   | Sebutkan gelar di riwayat pendidikan                                                              | Petunjuk di field Jenjang; IPK dan judul skripsi/tesis dicetak              |
| 6   | Cantumkan prestasi dan penghargaan                                                                | Bagian PENGHARGAAN dan PENGALAMAN SUKARELA                                  |
| 7   | Tunjukkan data/fakta keberhasilan                                                                 | Peringatan di form bila deskripsi pengalaman tidak memuat angka             |
| 8   | Urutan pengalaman dari yang terkini                                                               | `cvContent.js` mengurutkan otomatis: masih berlangsung dulu, lalu terbaru   |

---

## 7. Komponen

### 7.1 Header

```
Korporat (rata kiri)                         Akademik (rata tengah)
JOHN DOE                                            JOHN DOE
Frontend Developer                       Kandidat Magister Sistem Informasi
email | 0812-xxxx | Bandung | linkedin   email | 0812-xxxx | Bandung | orcid
                                         ─────────────────────────────────
```

- Kontak dalam satu baris teks dipisah `|`. Tidak ada ikon.
- URL ditulis tanpa `https://` tetapi tetap tautan aktif di PDF.
- Akademik boleh menambah ORCID atau Google Scholar di baris kontak.

### 7.2 Entri

```
Frontend Developer                          Jan 2023 – Sekarang
PT Contoh Teknologi, Bandung
  • Membangun dashboard admin dengan Next.js untuk 40 cabang
  • Memangkas waktu muat halaman dari 4,1 s menjadi 1,6 s
```

- Format tanggal `Mmm YYYY – Mmm YYYY` dari `dates.js`, en dash `–`. Masih berlangsung = "Sekarang".
- Akademik: tanggal pendidikan boleh hanya tahun (`2020 – 2024`).

### 7.3 Publikasi (Akademik)

```
Doe, J., & Santoso, B. (2025). Judul artikel dalam huruf kalimat.
      Nama Jurnal, 12(3), 45–60. doi.org/10.xxxx/xxxxx
```

### 7.4 Keahlian

```
Hard skill: React, Next.js, Tailwind CSS, Laravel, Git
Soft skill: Komunikasi, Kerja tim
```

Label tebal + teks dipisah koma. Dilarang: bar progres, bintang, persentase, chip berlatar. Akademik memakai label "Metode penelitian" dan "Perangkat lunak" bila diisi.

---

## 8. Implementasi token

```js
// src/lib/cvTokens.js
const mm = (v) => v * 2.835;

export const CV_THEMES = {
  corporate: {
    label: "ATS Korporat",
    font: { pdf: "Inter", css: "Inter, Helvetica, Arial, sans-serif", metaItalic: false, entryTitleWeight: 600 },
    page: { top: mm(12.7), bottom: mm(12.7), left: mm(12.7), right: mm(12.7), footer: null },
    header: { align: "left", nameToTitle: 2, titleToContact: 4, bottom: 10, rule: false },
    section: { gap: 12, titleToRule: 2, ruleWidth: 0.75, ruleToContent: 6, minPresenceAhead: 40 },
    entry: { gap: 8, titleToMeta: 1, metaToBody: 3, dateMinWidth: 90, titleDateGap: 12 },
    bullet: { indent: 12, hanging: 2, gap: 2 },
    size: { name: 20, title: 11, contact: 9.5, section: 10.5, entryTitle: 10.5, meta: 10, date: 9.5, body: 10 },
    leading: { body: 1.3, heading: 1.15 },
    tracking: { section: 0.6 },
    color: { text: "#111827", muted: "#4B5563", accent: "#2563EB", rule: "#2563EB" },
  },
  academic: {
    label: "ATS Akademik",
    font: { pdf: "Carlito", css: 'Calibri, Carlito, Arial, sans-serif', metaItalic: true, entryTitleWeight: 700 },
    page: { top: mm(12.7), bottom: mm(12.7), left: mm(12.7), right: mm(12.7), footer: { offset: mm(4), size: 9 } },
    header: { align: "center", nameToTitle: 4, titleToContact: 6, bottom: 14, rule: true },
    section: { gap: 16, titleToRule: 3, ruleWidth: 0.5, ruleToContent: 8, minPresenceAhead: 56 },
    entry: { gap: 10, titleToMeta: 2, metaToBody: 4, dateMinWidth: 100, titleDateGap: 12 },
    bullet: { indent: 14, hanging: 3, gap: 3 },
    citation: { gap: 6, hangingIndent: 18, size: 10.5 },
    size: { name: 18, title: 11, contact: 10, section: 11.5, entryTitle: 11, meta: 11, date: 10.5, body: 11 },
    leading: { body: 1.15, heading: 1.15 },
    tracking: { section: 0.4 },
    color: { text: "#000000", muted: "#333333", accent: "#000000", rule: "#000000" },
  },
};

export const ptToPx = (pt) => `${(pt * 4) / 3}px`;
```

- **PDF:** `Page style={{ paddingTop: t.page.top, ... }}`; react-pdf memakai pt langsung.
- **Preview:** halaman 21 cm, padding `ptToPx(t.page.*)`, lalu di-zoom oleh ResizeObserver seperti sekarang.

### Dampak ke kode

- `cv_builder_template` berubah nilai menjadi `"corporate"` | `"academic"`, default `"corporate"`. Saat memuat draf lama: `modern` → `corporate`, `classic` → `academic`.
- Template Akademik butuh field baru di `CVSchema`: `researchInterests`, `research[]`, `publications[]`, `teaching[]`, `awards[]`, `presentations[]`, `references[]`, serta `thesisTitle`, `advisor`, `gpa` di `educations[]`. Semua opsional kecuali `researchInterests`; ikuti checklist "menambah field CV" di `context.md`.
- Stepper sebaiknya menampilkan langkah tambahan hanya saat template Akademik dipilih.

---

## 9. Checklist review (wajib untuk setiap perubahan output)

- [ ] Tidak ada tabel, kolom ganda, text box, atau posisi absolut untuk isi.
- [ ] Tidak ada foto, logo, ikon, emoji, bar keahlian, atau grafik.
- [ ] Semua margin dan padding berasal dari token; tidak ada angka tertulis langsung di komponen.
- [ ] Margin halaman tidak di bawah nilai §3.1.
- [ ] Spasi vertikal hanya lewat `marginTop` elemen berikutnya.
- [ ] Semua teks bisa diseleksi dan disalin dengan urutan yang benar.
- [ ] Judul bagian memakai istilah baku dari §6 sesuai template.
- [ ] Teks isi minimal 9.5 pt, kontras minimal 4.5:1.
- [ ] Preview dan PDF identik dalam isi, urutan, dan pemenggalan baris.
- [ ] Nama file `CV_<Nama_Lengkap>.pdf`.

**Uji cepat:** buka PDF, Ctrl+A, salin ke editor teks polos. Teks harus berurutan dari Header sampai bagian terakhir, tanpa potongan yang tertukar.
