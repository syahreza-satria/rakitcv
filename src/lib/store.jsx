"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { defaultCVData, parseDraft, DRAFT_VERSION, getSteps } from "./schema";
import { DEFAULT_TEMPLATE, isTemplateId, migrateTemplateId } from "./cvTokens";

const CVContext = createContext(null);

const DUMMY_DATA = {
  personalInfo: {
    fullName: "Budi Santoso",
    title: "Senior Software Engineer",
    email: "budi.santoso@email.com",
    phone: "+62 812-3456-7890",
    location: "Jakarta, Indonesia",
    linkedin: "https://linkedin.com/in/budisantoso",
    portfolio: "https://budisantoso.dev",
  },
  summary: "Software Engineer berpengalaman lebih dari 5 tahun dalam pengembangan aplikasi web menggunakan ekosistem React, Node.js, dan arsitektur cloud. Terbiasa memimpin tim kecil, merancang basis data performa tinggi, serta mengoptimalkan kinerja frontend untuk meningkatkan kepuasan pengguna sebesar 25%.",
  experiences: [
    {
      company: "PT Digital Solusi Indonesia",
      position: "Senior Frontend Engineer",
      location: "Jakarta, Indonesia",
      startDate: "2023-01",
      endDate: "Sekarang",
      current: true,
      description: "Memimpin migrasi aplikasi web dari React 17 ke Next.js App Router, meningkatkan performa Core Web Vitals sebesar 40%.\nMerancang komponen UI modular yang digunakan oleh 3 tim produk terpisah.\nMementori 4 junior engineer dalam penulisan clean code dan praktik testing yang baik.",
    },
    {
      company: "Startup Teknologi Nusantara",
      position: "Software Engineer",
      location: "Bandung, Indonesia",
      startDate: "2020-07",
      endDate: "2022-12",
      current: false,
      description: "Mendevelop RESTful API menggunakan Express dan Node.js untuk menangani 100k+ request harian.\nBerkolaborasi dengan desainer produk UI/UX untuk mengimplementasikan dashboard responsif.\nMengurangi loading time database PostgreSQL sebesar 15% dengan optimasi query dan indexing.",
    },
  ],
  educations: [
    {
      institution: "Universitas Indonesia",
      degree: "Sarjana (S1)",
      major: "Teknik Informatika",
      graduationDate: "2020-07",
      current: false,
      description: "",
      thesisTitle: "Optimasi Sistem Rekomendasi Berbasis Graph Neural Network",
      advisor: "",
      gpa: "3,82/4,00",
    },
  ],
  volunteer: [
    {
      title: "Koordinator Program Mentoring",
      institution: "Komunitas Code for Indonesia",
      startDate: "2021-03",
      endDate: "2022-12",
      current: false,
      description: "Mengoordinasi 25 mentor dan 60 peserta pada program belajar pemrograman gratis.",
    },
  ],
  awards: [{ title: "Juara 2 Hackathon Nasional", issuer: "Kementerian Komunikasi dan Informatika", year: "2019" }],
  researchInterests: "",
  research: [],
  publications: [],
  teaching: [],
  presentations: [],
  references: [],
  skills: {
    hardSkills: ["JavaScript", "TypeScript", "React", "Next.js", "Node.js", "Express", "PostgreSQL", "Tailwind CSS", "Git"],
    softSkills: ["Kepemimpinan", "Kerjasama Tim", "Komunikasi", "Pemecahan Masalah"],
    researchMethods: [],
  },
  certifications: [
    {
      title: "AWS Certified Solutions Architect",
      issuer: "Amazon Web Services",
      date: "2024-03",
    },
    {
      title: "Google UX Design Professional Certificate",
      issuer: "Coursera",
      date: "2021-09",
    },
  ],
  languages: [
    { name: "Bahasa Indonesia", proficiency: "Penutur Asli (Native)" },
    { name: "Bahasa Inggris", proficiency: "Profesional (TOEFL 600)" },
  ],
};

// Data contoh untuk template Akademik
const DUMMY_ACADEMIC_DATA = {
  personalInfo: {
    fullName: "Sari Wulandari",
    title: "Kandidat Magister Sistem Informasi",
    email: "sari.wulandari@email.com",
    phone: "+62 813-5555-0101",
    location: "Bandung, Indonesia",
    linkedin: "https://linkedin.com/in/sariwulandari",
    portfolio: "",
    scholar: "https://orcid.org/0000-0000-0000-0000",
  },
  summary: "",
  researchInterests:
    "Sistem informasi kesehatan, analitik data pendidikan, dan penerapan machine learning untuk layanan publik di Indonesia.",
  experiences: [
    {
      company: "Dinas Komunikasi dan Informatika Kota Bandung",
      position: "Analis Data (Magang)",
      location: "Bandung, Indonesia",
      startDate: "2022-06",
      endDate: "2022-12",
      current: false,
      description: "Membersihkan dan menganalisis data layanan publik untuk laporan triwulanan.\nMembangun dashboard Power BI yang dipakai 5 bidang.",
    },
  ],
  educations: [
    {
      institution: "Institut Teknologi Bandung",
      degree: "Magister (S2)",
      major: "Sistem dan Teknologi Informasi",
      graduationDate: "2026-08",
      current: false,
      description: "",
      thesisTitle: "Prediksi Kunjungan Pasien Puskesmas Menggunakan Model Deret Waktu",
      advisor: "Prof. Dr. Ir. Ahmad Fauzi, M.T.",
      gpa: "3,92/4,00",
    },
    {
      institution: "Universitas Padjadjaran",
      degree: "Sarjana (S1)",
      major: "Sistem Informasi",
      graduationDate: "2024-07",
      current: false,
      description: "",
      thesisTitle: "Sistem Rekomendasi Mata Kuliah Berbasis Content-Based Filtering",
      advisor: "Dr. Rina Kusuma, S.Kom., M.Kom.",
      gpa: "3,85/4,00",
    },
  ],
  research: [
    {
      title: "Asisten Riset",
      institution: "Laboratorium Data Science, ITB",
      startDate: "2024-09",
      endDate: "",
      current: true,
      description: "Mengumpulkan dan menyiapkan data kunjungan 40 puskesmas untuk model peramalan.\nMenulis kode analisis dengan Python dan mendokumentasikan metode untuk replikasi.",
    },
  ],
  publications: [
    {
      citation:
        "Wulandari, S., & Fauzi, A. (2025). Peramalan kunjungan pasien puskesmas dengan model SARIMA. Jurnal Sistem Informasi, 21(2), 101–114.",
      year: "2025",
    },
    {
      citation:
        "Wulandari, S., & Kusuma, R. (2024). Sistem rekomendasi mata kuliah berbasis content-based filtering. Jurnal Teknologi Informasi, 9(1), 33–42.",
      year: "2024",
    },
  ],
  teaching: [
    {
      title: "Asisten Praktikum Basis Data",
      institution: "Universitas Padjadjaran",
      startDate: "2023-02",
      endDate: "2023-12",
      current: false,
      description: "Membimbing 40 mahasiswa pada praktikum SQL dan normalisasi.",
    },
  ],
  awards: [
    { title: "Beasiswa Unggulan Pascasarjana", issuer: "Kementerian Pendidikan", year: "2024" },
    { title: "Lulusan Terbaik Fakultas", issuer: "Universitas Padjadjaran", year: "2024" },
  ],
  volunteer: [],
  presentations: [{ title: "Peramalan Kunjungan Pasien dengan SARIMA", event: "Seminar Nasional Informatika Kesehatan", year: "2025" }],
  skills: {
    hardSkills: ["Python", "R", "SQL", "SPSS", "Power BI"],
    softSkills: ["Penulisan ilmiah", "Presentasi"],
    researchMethods: ["Analisis deret waktu", "Regresi", "Wawancara terstruktur"],
  },
  certifications: [{ title: "IELTS Academic (Skor 7.0)", issuer: "British Council", date: "2024-03" }],
  languages: [
    { name: "Bahasa Indonesia", proficiency: "Penutur Asli" },
    { name: "Bahasa Inggris", proficiency: "Profesional" },
  ],
  references: [
    {
      name: "Prof. Dr. Ir. Ahmad Fauzi, M.T.",
      position: "Dosen Pembimbing",
      institution: "Institut Teknologi Bandung",
      email: "ahmad.fauzi@itb.example",
      phone: "",
    },
  ],
};

const LOCAL_STORAGE_KEY = "cv_builder_draft";
const TEMPLATE_STORAGE_KEY = "cv_builder_template";

export function CVProvider({ children }) {
  const [cvData, setCvData] = useState(defaultCVData);
  const [activeStep, setActiveStep] = useState(0);
  const [templateId, setTemplateId] = useState(DEFAULT_TEMPLATE);
  const [isLoaded, setIsLoaded] = useState(false);
  // Naik setiap data diganti dari luar form (contoh/reset) agar form di-mount ulang dengan nilai baru
  const [dataVersion, setDataVersion] = useState(0);

  // Load draft on mount (localStorage hanya tersedia di browser, jadi harus lewat effect)
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    try {
      const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedData) {
        const draft = parseDraft(JSON.parse(savedData));
        if (draft) {
          setCvData(draft);
        } else {
          localStorage.removeItem(LOCAL_STORAGE_KEY); // draf tidak dapat dipulihkan: mulai baru
        }
      }
      const savedTemplate = localStorage.getItem(TEMPLATE_STORAGE_KEY);
      const migrated = migrateTemplateId(savedTemplate);
      if (isTemplateId(migrated)) {
        setTemplateId(migrated);
      }
    } catch (e) {
      console.error("Error loading CV draft:", e);
      try {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      } catch {}
    }
    setIsLoaded(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Save draft on changes
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ version: DRAFT_VERSION, data: cvData }));
    } catch (e) {
      console.error("Error saving CV draft:", e);
    }
  }, [cvData, isLoaded]);

  // Save template configuration on changes
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(TEMPLATE_STORAGE_KEY, templateId);
    } catch (e) {
      console.error("Error saving template style:", e);
    }
  }, [templateId, isLoaded]);

  const steps = getSteps(templateId);

  // Pindah template: urutan langkah berbeda, jadi kembali ke langkah pertama
  const changeTemplate = (id) => {
    if (id === templateId) return;
    setTemplateId(id);
    setActiveStep(0);
  };

  const goNext = () => setActiveStep((s) => Math.min(s + 1, steps.length - 1));
  const goBack = () => setActiveStep((s) => Math.max(s - 1, 0));

  const resetData = () => {
    setCvData(defaultCVData);
    setActiveStep(0);
    setDataVersion((v) => v + 1);
  };

  const loadExampleData = () => {
    setCvData(templateId === "academic" ? DUMMY_ACADEMIC_DATA : DUMMY_DATA);
    setDataVersion((v) => v + 1);
  };

  return (
    <CVContext.Provider
      value={{
        cvData,
        setCvData,
        activeStep,
        setActiveStep,
        templateId,
        setTemplateId: changeTemplate,
        steps,
        goNext,
        goBack,
        resetData,
        loadExampleData,
        isLoaded,
        dataVersion,
      }}
    >
      {children}
    </CVContext.Provider>
  );
}

export function useCV() {
  const context = useContext(CVContext);
  if (!context) {
    throw new Error("useCV must be used within a CVProvider");
  }
  return context;
}
