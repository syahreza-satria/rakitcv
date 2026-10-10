"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { defaultCVData, parseDraft, DRAFT_VERSION } from "./schema";

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
      description: "IPK 3.82/4.00. Juara 2 Hackathon Nasional 2019.",
    },
  ],
  skills: {
    hardSkills: ["JavaScript", "TypeScript", "React", "Next.js", "Node.js", "Express", "PostgreSQL", "Tailwind CSS", "Git"],
    softSkills: ["Kepemimpinan", "Kerjasama Tim", "Komunikasi", "Pemecahan Masalah"],
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

const LOCAL_STORAGE_KEY = "cv_builder_draft";
const TEMPLATE_STORAGE_KEY = "cv_builder_template";

export function CVProvider({ children }) {
  const [cvData, setCvData] = useState(defaultCVData);
  const [activeStep, setActiveStep] = useState(0);
  const [templateId, setTemplateId] = useState("modern");
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
      if (savedTemplate === "classic" || savedTemplate === "modern") {
        setTemplateId(savedTemplate);
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

  const resetData = () => {
    setCvData(defaultCVData);
    setActiveStep(0);
    setDataVersion((v) => v + 1);
  };

  const loadExampleData = () => {
    setCvData(DUMMY_DATA);
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
        setTemplateId,
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
