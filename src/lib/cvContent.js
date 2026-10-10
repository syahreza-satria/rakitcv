import { formatMonthYear } from "./dates";

// Konten CV yang dipakai bersama oleh preview dan PDF, supaya isi dan urutannya identik.

// Judul bagian baku (CV_DESIGN_SYSTEM.md §7)
export const SECTION_TITLES = {
  summary: "RINGKASAN",
  experience: "PENGALAMAN KERJA",
  education: "PENDIDIKAN",
  skills: "KEAHLIAN",
  certifications: "SERTIFIKASI",
  languages: "BAHASA",
};

const stripProtocol = (url) => url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

// Item kontak untuk satu baris, dipisah " | ". Field kosong dihilangkan.
export function getContactItems({ email, phone, location, linkedin, portfolio }) {
  return [
    email && { text: email, href: `mailto:${email}` },
    phone && { text: phone },
    location && { text: location },
    linkedin && { text: stripProtocol(linkedin), href: linkedin },
    portfolio && { text: stripProtocol(portfolio), href: portfolio },
  ].filter(Boolean);
}

export const joinParts = (...parts) => parts.filter((p) => p && p.trim()).join(", ");

export const formatDateRange = (start, end, current) =>
  [formatMonthYear(start), current ? "Sekarang" : formatMonthYear(end)].filter((d) => d && d.trim()).join(" – ");

export const splitBullets = (text) =>
  (text || "")
    .split("\n")
    .map((line) => line.trim().replace(/^[•\-*]\s*/, ""))
    .filter(Boolean);

export const hasExperience = (e) => Boolean(e.company || e.position);
export const hasEducation = (e) => Boolean(e.institution || e.degree);

export const educationTitle = (edu) => [edu.degree, edu.major].filter(Boolean).join(" - ");

export const certificationLine = (c) => `${c.title} — ${c.issuer}${c.date ? ` (${formatMonthYear(c.date)})` : ""}`;

export const languagesLine = (languages) =>
  languages
    .filter((l) => l.name)
    .map((l) => (l.proficiency ? `${l.name} (${l.proficiency})` : l.name))
    .join(", ");

// Bagian apa saja yang dicetak (bagian kosong tidak dicetak, termasuk judulnya)
export function getVisibleSections(data) {
  const { summary, experiences = [], educations = [], skills, certifications = [], languages = [] } = data;
  return {
    summary: Boolean(summary && summary.trim()),
    experience: experiences.some(hasExperience),
    education: educations.some(hasEducation),
    skills: Boolean(skills && (skills.hardSkills?.length || skills.softSkills?.length)),
    certifications: certifications.some((c) => c.title),
    languages: languages.some((l) => l.name),
  };
}
