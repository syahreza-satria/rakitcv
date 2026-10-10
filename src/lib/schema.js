import { z } from "zod";
import { MONTH_YEAR_REGEX, MONTH_YEAR_MESSAGE } from "./dates";

const monthYear = z.string().regex(MONTH_YEAR_REGEX, MONTH_YEAR_MESSAGE);

// Aturan 1: nama ditulis tanpa gelar (gelar ditulis di bagian Pendidikan).
// Awalan: Dr., Prof., Ir., Drs., Dra., H., Hj. Akhiran: ada koma atau singkatan gelar umum.
const TITLE_PREFIX = /^(prof|dr|drs|dra|ir|hj?)\.\s?|^(prof|dr|drs|dra|ir)\s/i;
const TITLE_SUFFIX = /(,|\b[smb]\.\s?(kom|t|e|h|pd|si|sos|ak|psi|ked|ip|eng|sc|a|hum|ikom|farm|kes|kep|mm|ma|ba)\b|\bph\.?d\b|\bmba\b|\bcpa\b)/i;
export const hasAcademicTitle = (name) => TITLE_PREFIX.test(name.trim()) || TITLE_SUFFIX.test(name.trim());

// Aturan 2: nomor telepon memakai kode negara, mis. +62 812-3456-7890
const PHONE_REGEX = /^\+\d{1,3}[\s\d\-()]{6,}$/;

export const PersonalInfoSchema = z.object({
  fullName: z
    .string()
    .min(2, "Nama lengkap minimal 2 karakter")
    .refine((v) => !hasAcademicTitle(v), "Tulis nama tanpa gelar. Gelar ditulis di bagian Pendidikan."),
  title: z.string().min(2, "Profesi/Jabatan minimal 2 karakter"),
  email: z.string().email("Format email tidak valid"),
  phone: z.string().regex(PHONE_REGEX, "Awali dengan kode negara, mis. +62 812-3456-7890"),
  location: z.string().min(2, "Lokasi (Kota, Negara) minimal 2 karakter"),
  linkedin: z.string().url("Format URL LinkedIn tidak valid").or(z.literal("")).optional(),
  portfolio: z.string().url("Format URL Portofolio tidak valid").or(z.literal("")).optional(),
  scholar: z.string().url("Format URL ORCID / Google Scholar tidak valid").or(z.literal("")).optional(),
});

export const ExperienceSchema = z.object({
  company: z.string().min(2, "Nama perusahaan minimal 2 karakter"),
  position: z.string().min(2, "Posisi minimal 2 karakter"),
  location: z.string().min(2, "Lokasi minimal 2 karakter"),
  startDate: monthYear,
  endDate: z.string().optional(),
  current: z.boolean().default(false),
  description: z.string().min(10, "Deskripsi pekerjaan minimal 10 karakter"),
}).refine((exp) => exp.current || MONTH_YEAR_REGEX.test(exp.endDate || ""), {
  message: "Tanggal selesai wajib diisi (atau centang masih bekerja)",
  path: ["endDate"],
});

export const EducationSchema = z.object({
  institution: z.string().min(2, "Nama institusi/sekolah minimal 2 karakter"),
  degree: z.string().min(2, "Jenjang pendidikan (mis. S1, SMA) wajib diisi"),
  major: z.string().min(2, "Jurusan/Program studi wajib diisi"),
  graduationDate: monthYear,
  current: z.boolean().default(false),
  description: z.string().optional(),
  thesisTitle: z.string().optional(),
  advisor: z.string().optional(),
  gpa: z.string().optional(),
});

export const CertificationSchema = z.object({
  title: z.string().min(2, "Nama sertifikasi minimal 2 karakter"),
  issuer: z.string().min(2, "Penerbit sertifikat minimal 2 karakter"),
  date: monthYear,
});

export const LanguageSchema = z.object({
  name: z.string().min(2, "Nama bahasa minimal 2 karakter"),
  proficiency: z.string().min(2, "Tingkat kemahiran wajib diisi"), // mis. Native, Professional, Fluent
});

const year = z.string().regex(/^\d{4}$/, "Isi tahun 4 digit, mis. 2024");

// Bagian khas template Akademik (CV_DESIGN_SYSTEM.md 6.2)
export const ResearchSchema = z.object({
  title: z.string().min(2, "Judul / peran minimal 2 karakter"),
  institution: z.string().min(2, "Institusi / laboratorium minimal 2 karakter"),
  startDate: monthYear,
  endDate: z.string().optional(),
  current: z.boolean().default(false),
  description: z.string().optional(),
});

export const TeachingSchema = ResearchSchema;
export const VolunteerSchema = ResearchSchema;

export const PublicationSchema = z.object({
  citation: z.string().min(10, "Sitasi minimal 10 karakter"),
  year,
});

export const AwardSchema = z.object({
  title: z.string().min(2, "Nama penghargaan minimal 2 karakter"),
  issuer: z.string().min(2, "Pemberi penghargaan minimal 2 karakter"),
  year,
});

export const PresentationSchema = z.object({
  title: z.string().min(2, "Judul presentasi minimal 2 karakter"),
  event: z.string().min(2, "Nama acara minimal 2 karakter"),
  year,
});

export const ReferenceSchema = z.object({
  name: z.string().min(2, "Nama referensi minimal 2 karakter"),
  position: z.string().optional(),
  institution: z.string().min(2, "Institusi minimal 2 karakter"),
  email: z.string().optional(),
  phone: z.string().optional(),
});

export const CVSchema = z.object({
  personalInfo: PersonalInfoSchema,
  summary: z.string().min(10, "Ringkasan profil minimal 10 karakter").max(600, "Ringkasan maksimal 600 karakter agar tetap ringkas"),
  experiences: z.array(ExperienceSchema).min(1, "Minimal harus ada 1 pengalaman kerja"),
  educations: z.array(EducationSchema).min(1, "Minimal harus ada 1 riwayat pendidikan"),
  skills: z.object({
    hardSkills: z.array(z.string()).min(1, "Minimal masukkan 1 keahlian teknis"),
    softSkills: z.array(z.string()).optional().default([]),
    researchMethods: z.array(z.string()).optional().default([]),
  }),
  certifications: z.array(CertificationSchema).optional().default([]),
  languages: z.array(LanguageSchema).optional().default([]),
  awards: z.array(AwardSchema).optional().default([]),
  volunteer: z.array(VolunteerSchema).optional().default([]),
});

// Template Akademik: hanya Minat Penelitian, Pendidikan, dan Keahlian yang wajib.
export const AcademicCVSchema = z.object({
  personalInfo: PersonalInfoSchema,
  researchInterests: z.string().min(10, "Minat penelitian minimal 10 karakter"),
  educations: z.array(EducationSchema).min(1, "Minimal harus ada 1 riwayat pendidikan"),
  research: z.array(ResearchSchema).default([]),
  publications: z.array(PublicationSchema).default([]),
  teaching: z.array(TeachingSchema).default([]),
  experiences: z.array(ExperienceSchema).default([]),
  awards: z.array(AwardSchema).default([]),
  volunteer: z.array(VolunteerSchema).default([]),
  presentations: z.array(PresentationSchema).default([]),
  skills: z.object({
    hardSkills: z.array(z.string()).min(1, "Minimal masukkan 1 keahlian"),
    softSkills: z.array(z.string()).optional().default([]),
    researchMethods: z.array(z.string()).optional().default([]),
  }),
  certifications: z.array(CertificationSchema).default([]),
  languages: z.array(LanguageSchema).default([]),
  references: z.array(ReferenceSchema).default([]),
});

export const defaultCVData = {
  personalInfo: {
    fullName: "",
    title: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    portfolio: "",
    scholar: "",
  },
  summary: "",
  researchInterests: "",
  experiences: [
    {
      company: "",
      position: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
    },
  ],
  educations: [
    {
      institution: "",
      degree: "",
      major: "",
      graduationDate: "",
      current: false,
      description: "",
      thesisTitle: "",
      advisor: "",
      gpa: "",
    },
  ],
  skills: {
    hardSkills: [],
    softSkills: [],
    researchMethods: [],
  },
  certifications: [],
  languages: [],
  research: [],
  publications: [],
  teaching: [],
  volunteer: [],
  awards: [],
  presentations: [],
  references: [],
};

export const DRAFT_VERSION = 1;

// Skema longgar untuk memuat draf dari localStorage: nilai yang rusak/hilang
// diganti default per-bagian, sehingga draf lama atau korup tidak membuat render error.
const str = z.string().catch("");
const bool = z.boolean().catch(false);
const strList = z.array(z.string()).catch([]);
const section = (shape, fallback) => z.object(shape).catch(() => structuredClone(fallback));

export const DraftSchema = z.object({
  personalInfo: section(
    {
      fullName: str,
      title: str,
      email: str,
      phone: str,
      location: str,
      linkedin: str,
      portfolio: str,
      scholar: str,
    },
    defaultCVData.personalInfo
  ),
  summary: str,
  researchInterests: str,
  experiences: z
    .array(
      z.object({
        company: str,
        position: str,
        location: str,
        startDate: str,
        endDate: str,
        current: bool,
        description: str,
      })
    )
    .catch(() => structuredClone(defaultCVData.experiences)),
  educations: z
    .array(
      z.object({
        institution: str,
        degree: str,
        major: str,
        graduationDate: str,
        current: bool,
        description: str,
        thesisTitle: str,
        advisor: str,
        gpa: str,
      })
    )
    .catch(() => structuredClone(defaultCVData.educations)),
  skills: section({ hardSkills: strList, softSkills: strList, researchMethods: strList }, defaultCVData.skills),
  certifications: z.array(z.object({ title: str, issuer: str, date: str })).catch([]),
  languages: z.array(z.object({ name: str, proficiency: str })).catch([]),
  research: z
    .array(z.object({ title: str, institution: str, startDate: str, endDate: str, current: bool, description: str }))
    .catch([]),
  publications: z.array(z.object({ citation: str, year: str })).catch([]),
  teaching: z
    .array(z.object({ title: str, institution: str, startDate: str, endDate: str, current: bool, description: str }))
    .catch([]),
  awards: z.array(z.object({ title: str, issuer: str, year: str })).catch([]),
  volunteer: z
    .array(z.object({ title: str, institution: str, startDate: str, endDate: str, current: bool, description: str }))
    .catch([]),
  presentations: z.array(z.object({ title: str, event: str, year: str })).catch([]),
  references: z
    .array(z.object({ name: str, position: str, institution: str, email: str, phone: str }))
    .catch([]),
});

// Mengubah isi localStorage (mentah) menjadi data CV yang aman. Mengembalikan null bila bukan data CV.
export function parseDraft(raw) {
  if (!raw || typeof raw !== "object") return null;
  const payload = "version" in raw ? raw.data : raw; // draf lama tanpa `version` berupa data CV langsung
  if (!payload || typeof payload !== "object") return null;
  const result = DraftSchema.safeParse(payload);
  if (!result.success) return null;
  const data = result.data;
  if (data.experiences.length === 0) data.experiences = structuredClone(defaultCVData.experiences);
  if (data.educations.length === 0) data.educations = structuredClone(defaultCVData.educations);
  return data;
}

// Langkah editor per template. `key` menentukan form yang tampil; indeks dipakai stepper (activeStep).
export const STEPS = {
  corporate: [
    { key: "personal", title: "Data Diri" },
    { key: "summary", title: "Ringkasan" },
    { key: "experience", title: "Pengalaman" },
    { key: "education", title: "Pendidikan" },
    { key: "skills", title: "Keahlian" },
    { key: "highlights", title: "Capaian" },
    { key: "additional", title: "Lainnya" },
  ],
  academic: [
    { key: "personal", title: "Data Diri" },
    { key: "interests", title: "Minat Penelitian" },
    { key: "education", title: "Pendidikan" },
    { key: "academic", title: "Akademik" },
    { key: "experience", title: "Pengalaman" },
    { key: "achievements", title: "Capaian" },
    { key: "skills", title: "Keahlian" },
    { key: "additional", title: "Lainnya" },
  ],
};

export const getSteps = (templateId) => STEPS[templateId] || STEPS.corporate;

// Bagian data -> kunci langkah
const SECTION_STEP_KEY = {
  volunteer: "highlights",
  personalInfo: "personal",
  summary: "summary",
  researchInterests: "interests",
  experiences: "experience",
  educations: "education",
  research: "academic",
  publications: "academic",
  teaching: "academic",
  awards: "achievements",
  presentations: "achievements",
  references: "achievements",
  skills: "skills",
  certifications: "additional",
  languages: "additional",
};

const isBlankRow = (row) =>
  Object.values(row).every((v) => v === "" || v === false || v == null || (Array.isArray(v) && v.length === 0));

const OPTIONAL_LISTS = ["volunteer", "experiences", "research", "publications", "teaching", "awards", "presentations", "references", "certifications", "languages"];

// Baris kosong pada bagian opsional diabaikan saat validasi (tidak dicetak di CV)
const withoutBlankRows = (cvData) => {
  const cleaned = { ...cvData };
  for (const key of OPTIONAL_LISTS) {
    if (Array.isArray(cleaned[key])) cleaned[key] = cleaned[key].filter((row) => !isBlankRow(row));
  }
  return cleaned;
};

// Validasi penuh sesuai template. Mengembalikan daftar masalah `{ step, message }` (kosong bila lengkap).
export function getCVIssues(cvData, templateId = "corporate") {
  const academic = templateId === "academic";
  const steps = getSteps(templateId);
  const result = (academic ? AcademicCVSchema : CVSchema).safeParse(academic ? withoutBlankRows(cvData) : cvData);
  if (result.success) return [];
  return result.error.issues.map((issue) => {
    const section = issue.path[0];
    // Penghargaan dan sukarela ada di langkah "Capaian" (key berbeda per template)
    const stepKey = ["awards", "volunteer"].includes(section) ? (academic ? "achievements" : "highlights") : SECTION_STEP_KEY[section];
    const index = steps.findIndex((s) => s.key === stepKey);
    return { step: index === -1 ? 0 : index, message: issue.message };
  });
}
