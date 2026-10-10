import { formatMonthYear } from "./dates";

// Konten CV yang dipakai bersama oleh preview dan PDF, supaya isi dan urutannya identik.
// Preview dan PDF hanya memetakan blok di bawah ke tampilan; urutan, judul, dan teks ditentukan di sini.

// Judul bagian baku per template (CV_DESIGN_SYSTEM.md 6)
const TITLES = {
  summary: "RINGKASAN",
  interests: "MINAT PENELITIAN",
  experience: "PENGALAMAN KERJA",
  education: "PENDIDIKAN",
  research: "PENGALAMAN PENELITIAN",
  publications: "PUBLIKASI",
  teaching: "PENGALAMAN MENGAJAR",
  volunteer: "PENGALAMAN SUKARELA",
  awards: "PENGHARGAAN",
  presentations: "PRESENTASI DAN KONFERENSI",
  skills: "KEAHLIAN",
  certifications: "SERTIFIKASI",
  languages: "BAHASA",
  references: "REFERENSI",
};

// Urutan bagian tetap per template; pengguna tidak bisa mengubahnya
const ORDER = {
  corporate: ["summary", "experience", "education", "volunteer", "awards", "skills", "certifications", "languages"],
  academic: [
    "interests",
    "education",
    "research",
    "publications",
    "teaching",
    "experience",
    "volunteer",
    "awards",
    "presentations",
    "skills",
    "certifications",
    "languages",
    "references",
  ],
};

const stripProtocol = (url) => url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

// Item kontak untuk satu baris, dipisah " | ". Field kosong dihilangkan.
export function getContactItems({ email, phone, location, linkedin, portfolio, scholar }, templateId) {
  return [
    email && { text: email, href: `mailto:${email}` },
    phone && { text: phone },
    location && { text: location },
    linkedin && { text: stripProtocol(linkedin), href: linkedin },
    portfolio && { text: stripProtocol(portfolio), href: portfolio },
    templateId === "academic" && scholar && { text: stripProtocol(scholar), href: scholar },
  ].filter(Boolean);
}

const joinParts = (...parts) => parts.filter((p) => p && p.trim()).join(", ");

const formatDateRange = (start, end, current) =>
  [formatMonthYear(start), current ? "Sekarang" : formatMonthYear(end)].filter((d) => d && d.trim()).join(" – ");

export const splitBullets = (text) =>
  (text || "")
    .split("\n")
    .map((line) => line.trim().replace(/^[•\-*]\s*/, ""))
    .filter(Boolean);

// Urutan terbaru dulu: yang masih berlangsung paling atas, lalu tanggal selesai, lalu tanggal mulai
const recency = (end, start, current) => `${current ? "9999-99" : end || ""}|${start || ""}`;
const newestFirst = (items, endKey, startKey) =>
  [...items].sort((a, b) => recency(b[endKey], b[startKey], b.current).localeCompare(recency(a[endKey], a[startKey], a.current)));

const yearOf = (value) => (value || "").slice(0, 4);

const hasExperience = (e) => Boolean(e.company || e.position);
const hasEducation = (e) => Boolean(e.institution || e.degree);

// Pecah sitasi supaya nama pemilik CV (format APA "Nama, I.") bisa ditebalkan
function splitCitation(citation, fullName) {
  const surname = (fullName || "").trim().split(/\s+/).pop();
  if (!surname) return [{ text: citation, bold: false }];
  const escaped = surname.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`(${escaped},\\s*(?:[A-Z]\\.\\s?)+)`, "i");
  // split dengan grup penangkap: indeks ganjil = bagian yang cocok (nama pemilik CV)
  return citation
    .split(pattern)
    .map((text, i) => ({ text, bold: i % 2 === 1 }))
    .filter((seg) => seg.text);
}

const entry = (title, date, meta, extra = {}) => ({ title, date, meta, bullets: [], paragraphs: [], details: [], ...extra });

const periodEntries = (items, titleKey, orgKey) =>
  items
    .filter((i) => i[titleKey] || i[orgKey])
    .map((i) =>
      entry(i[titleKey], formatDateRange(i.startDate, i.endDate, i.current), i[orgKey], {
        bullets: splitBullets(i.description),
      })
    );

function educationEntries(educations, academic) {
  return educations.filter(hasEducation).map((edu) => {
    const title = [edu.degree, edu.major].filter(Boolean).join(" - ");
    const details = [
      edu.gpa && { label: "IPK", value: edu.gpa },
      edu.thesisTitle && { label: "Judul tesis/skripsi", value: edu.thesisTitle },
      academic && edu.advisor && { label: "Pembimbing", value: edu.advisor },
    ].filter(Boolean);
    const date = academic ? yearOf(edu.graduationDate) : formatMonthYear(edu.graduationDate);
    return entry(title, date, edu.institution, {
      details,
      paragraphs: edu.description ? [edu.description] : [],
    });
  });
}

function skillLines(skills, academic) {
  const lines = academic
    ? [
        { label: "Metode penelitian", items: skills.researchMethods },
        { label: "Perangkat lunak", items: skills.hardSkills },
        { label: "Soft skill", items: skills.softSkills },
      ]
    : [
        { label: "Hard skill", items: skills.hardSkills },
        { label: "Soft skill", items: skills.softSkills },
      ];
  return lines.filter((l) => l.items?.length).map((l) => ({ label: l.label, text: l.items.join(", ") }));
}

// Isi satu bagian sebagai blok: paragraph | entries | skills | lines | citations | references
function getBlock(data, id, academic) {
  const { personalInfo } = data;
  switch (id) {
    case "summary":
      return data.summary?.trim() ? { type: "paragraph", text: data.summary } : null;
    case "interests":
      return data.researchInterests?.trim() ? { type: "paragraph", text: data.researchInterests } : null;
    case "experience": {
      const entries = newestFirst((data.experiences || []).filter(hasExperience), "endDate", "startDate").map((e) =>
        entry(e.position, formatDateRange(e.startDate, e.endDate, e.current), joinParts(e.company, e.location), {
          bullets: splitBullets(e.description),
        })
      );
      return entries.length ? { type: "entries", entries } : null;
    }
    case "education": {
      const entries = educationEntries(newestFirst(data.educations || [], "graduationDate", "graduationDate"), academic);
      return entries.length ? { type: "entries", entries } : null;
    }
    case "research":
    case "teaching":
    case "volunteer": {
      const entries = periodEntries(newestFirst(data[id] || [], "endDate", "startDate"), "title", "institution");
      return entries.length ? { type: "entries", entries } : null;
    }
    case "awards": {
      const entries = [...(data.awards || [])].sort((a, b) => Number(b.year || 0) - Number(a.year || 0)).filter((a) => a.title).map((a) => entry(a.title, a.year, a.issuer));
      return entries.length ? { type: "entries", entries } : null;
    }
    case "presentations": {
      const entries = [...(data.presentations || [])].sort((a, b) => Number(b.year || 0) - Number(a.year || 0)).filter((p) => p.title).map((p) => entry(p.title, p.year, p.event));
      return entries.length ? { type: "entries", entries } : null;
    }
    case "publications": {
      // Urut tahun terbaru dulu, tanpa nomor
      const items = (data.publications || [])
        .filter((p) => p.citation?.trim())
        .sort((a, b) => Number(b.year || 0) - Number(a.year || 0))
        .map((p) => splitCitation(p.citation.trim(), personalInfo.fullName));
      return items.length ? { type: "citations", items } : null;
    }
    case "skills": {
      const lines = skillLines(data.skills || {}, academic);
      return lines.length ? { type: "skills", lines } : null;
    }
    case "certifications": {
      const lines = (data.certifications || [])
        .filter((c) => c.title)
        .map((c) => `${c.title} — ${c.issuer}${c.date ? ` (${formatMonthYear(c.date)})` : ""}`);
      return lines.length ? { type: "lines", lines } : null;
    }
    case "languages": {
      const text = (data.languages || [])
        .filter((l) => l.name)
        .map((l) => (l.proficiency ? `${l.name} (${l.proficiency})` : l.name))
        .join(", ");
      return text ? { type: "paragraph", text } : null;
    }
    case "references": {
      const items = (data.references || [])
        .filter((r) => r.name)
        .map((r) => [r.name, joinParts(r.position, r.institution), r.email, r.phone].filter(Boolean));
      return items.length ? { type: "references", items } : null;
    }
    default:
      return null;
  }
}

// Bagian yang dicetak, berurutan. Bagian kosong tidak dicetak, termasuk judulnya.
export function getSections(data, templateId) {
  const academic = templateId === "academic";
  return (ORDER[templateId] || ORDER.corporate)
    .map((id) => ({
      id,
      title: id === "awards" && academic ? "PENGHARGAAN DAN BEASISWA" : TITLES[id],
      block: getBlock(data, id, academic),
    }))
    .filter((section) => section.block);
}

export const cvFooterText = (fullName, page, total) => `${fullName ? `${fullName} — ` : ""}Hal. ${page} dari ${total}`;
