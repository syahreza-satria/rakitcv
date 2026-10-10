import { z } from "zod";
import { MONTH_YEAR_REGEX, MONTH_YEAR_MESSAGE } from "./dates";

const monthYear = z.string().regex(MONTH_YEAR_REGEX, MONTH_YEAR_MESSAGE);

export const PersonalInfoSchema = z.object({
  fullName: z.string().min(2, "Nama lengkap minimal 2 karakter"),
  title: z.string().min(2, "Profesi/Jabatan minimal 2 karakter"),
  email: z.string().email("Format email tidak valid"),
  phone: z.string().min(5, "Nomor telepon minimal 5 karakter"),
  location: z.string().min(2, "Lokasi (Kota, Negara) minimal 2 karakter"),
  linkedin: z.string().url("Format URL LinkedIn tidak valid").or(z.literal("")).optional(),
  portfolio: z.string().url("Format URL Portofolio tidak valid").or(z.literal("")).optional(),
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

export const CVSchema = z.object({
  personalInfo: PersonalInfoSchema,
  summary: z.string().min(10, "Ringkasan profil minimal 10 karakter"),
  experiences: z.array(ExperienceSchema).min(1, "Minimal harus ada 1 pengalaman kerja"),
  educations: z.array(EducationSchema).min(1, "Minimal harus ada 1 riwayat pendidikan"),
  skills: z.object({
    hardSkills: z.array(z.string()).min(1, "Minimal masukkan 1 keahlian teknis"),
    softSkills: z.array(z.string()).optional().default([]),
  }),
  certifications: z.array(CertificationSchema).optional().default([]),
  languages: z.array(LanguageSchema).optional().default([]),
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
  },
  summary: "",
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
    },
  ],
  skills: {
    hardSkills: [],
    softSkills: [],
  },
  certifications: [],
  languages: [],
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
    },
    defaultCVData.personalInfo
  ),
  summary: str,
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
      })
    )
    .catch(() => structuredClone(defaultCVData.educations)),
  skills: section({ hardSkills: strList, softSkills: strList }, defaultCVData.skills),
  certifications: z.array(z.object({ title: str, issuer: str, date: str })).catch([]),
  languages: z.array(z.object({ name: str, proficiency: str })).catch([]),
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

// Urutan langkah di editor: indeks dipakai oleh stepper (activeStep).
export const STEP_TITLES = ["Data Diri", "Ringkasan", "Pengalaman", "Pendidikan", "Keahlian", "Lainnya"];

const SECTION_STEP = {
  personalInfo: 0,
  summary: 1,
  experiences: 2,
  educations: 3,
  skills: 4,
  certifications: 5,
  languages: 5,
};

// Validasi CVSchema penuh. Mengembalikan daftar masalah `{ step, message }` (kosong bila lengkap).
export function getCVIssues(cvData) {
  const result = CVSchema.safeParse(cvData);
  if (result.success) return [];
  return result.error.issues.map((issue) => ({
    step: SECTION_STEP[issue.path[0]] ?? 0,
    message: issue.message,
  }));
}
