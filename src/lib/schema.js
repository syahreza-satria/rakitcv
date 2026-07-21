import { z } from "zod";

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
  startDate: z.string().min(2, "Tanggal mulai wajib diisi"),
  endDate: z.string().optional(),
  current: z.boolean().default(false),
  description: z.string().min(10, "Deskripsi pekerjaan minimal 10 karakter"),
});

export const EducationSchema = z.object({
  institution: z.string().min(2, "Nama institusi/sekolah minimal 2 karakter"),
  degree: z.string().min(2, "Jenjang pendidikan (mis. S1, SMA) wajib diisi"),
  major: z.string().min(2, "Jurusan/Program studi wajib diisi"),
  graduationDate: z.string().min(2, "Tanggal kelulusan wajib diisi"),
  current: z.boolean().default(false),
  description: z.string().optional(),
});

export const CertificationSchema = z.object({
  title: z.string().min(2, "Nama sertifikasi minimal 2 karakter"),
  issuer: z.string().min(2, "Penerbit sertifikat minimal 2 karakter"),
  date: z.string().min(2, "Tanggal perolehan wajib diisi"),
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
