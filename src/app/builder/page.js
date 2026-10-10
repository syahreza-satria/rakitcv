"use client";

import React from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useCV } from "../../lib/store";
import PersonalInfoForm from "../../components/form/PersonalInfoForm";
import SummaryForm from "../../components/form/SummaryForm";
import ExperienceForm from "../../components/form/ExperienceForm";
import EducationForm from "../../components/form/EducationForm";
import SkillsForm from "../../components/form/SkillsForm";
import AdditionalForm from "../../components/form/AdditionalForm";
import InterestsForm from "../../components/form/InterestsForm";
import ListSectionsForm from "../../components/form/ListSectionsForm";
import CVPreview from "../../components/preview/CVPreview";
import { getCVIssues } from "../../lib/schema";
import { Sparkles, Trash2, ArrowLeft, Layers, Check, User, FileText, Briefcase, GraduationCap, Award, Languages, Download, AlertCircle, BookOpen, FlaskConical, Trophy } from "lucide-react";

// @react-pdf/renderer berat: dimuat hanya di browser dan hanya di halaman editor
const PDFDownloadButton = dynamic(() => import("./PDFDownloadButton"), {
  ssr: false,
  loading: () => (
    <button disabled className="flex items-center gap-2 rounded-lg bg-zinc-200 px-5 py-2.5 text-sm font-semibold text-zinc-500 cursor-not-allowed">
      Memuat PDF...
    </button>
  ),
});

const STEP_ICONS = {
  personal: User,
  summary: FileText,
  interests: BookOpen,
  experience: Briefcase,
  education: GraduationCap,
  academic: FlaskConical,
  achievements: Trophy,
  highlights: Trophy,
  skills: Award,
  additional: Languages,
};

export default function BuilderPage() {
  const { 
    cvData, 
    activeStep, 
    setActiveStep, 
    templateId, 
    setTemplateId,
    steps: stepDefs,
    loadExampleData, 
    resetData,
    isLoaded,
    dataVersion
  } = useCV();

  if (!isLoaded) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-zinc-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
          <p className="text-sm font-semibold text-zinc-500 tracking-wider uppercase">Memuat Editor...</p>
        </div>
      </div>
    );
  }

  const steps = stepDefs.map(({ key, title }) => ({ key, title, icon: STEP_ICONS[key] }));

  // Validasi CVSchema penuh: menentukan status tiap langkah dan apakah PDF boleh diunduh
  const issues = getCVIssues(cvData, templateId);
  const stepsWithIssues = new Set(issues.map((issue) => issue.step));
  const isComplete = issues.length === 0;

  // key=dataVersion: form di-mount ulang saat data diganti dari luar (Isi Contoh / Reset)
  const renderFormStep = () => {
    switch (steps[activeStep]?.key) {
      case "summary":
        return <SummaryForm key={dataVersion} />;
      case "interests":
        return <InterestsForm key={dataVersion} />;
      case "experience":
        return <ExperienceForm key={dataVersion} />;
      case "education":
        return <EducationForm key={dataVersion} />;
      case "academic":
        return <ListSectionsForm key={dataVersion} stepKey="academic" />;
      case "achievements":
        return <ListSectionsForm key={dataVersion} stepKey="achievements" />;
      case "highlights":
        return <ListSectionsForm key={dataVersion} stepKey="highlights" />;
      case "skills":
        return <SkillsForm key={dataVersion} />;
      case "additional":
        return <AdditionalForm key={dataVersion} />;
      default:
        return <PersonalInfoForm key={dataVersion} />;
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 flex flex-col font-sans antialiased selection:bg-blue-500/20">
      
      {/* GLOW DECORATIONS (Background only, won't affect PDF/ATS parser) */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-300/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-blue-300/10 rounded-full blur-[100px] pointer-events-none"></div>

      {/* HEADER SECTION */}
      <header className="sticky top-0 z-30 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-md px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link 
            href="/"
            className="flex items-center gap-2 text-sm font-semibold text-zinc-600 hover:text-zinc-900 transition duration-200"
          >
            <ArrowLeft size={16} />
            <span>Kembali</span>
          </Link>
          <span className="text-zinc-300">|</span>
          <div className="flex items-center gap-2">
            <h1 className="text-md font-bold tracking-tight text-zinc-900">
              RakitCV
            </h1>
            <span className="rounded-full bg-blue-500/10 px-2.5 py-0.5 text-[10px] font-bold text-blue-700 border border-blue-500/20 uppercase tracking-widest">
              Editor
            </span>
          </div>
        </div>

        {/* CONTROLS */}
        <div className="flex items-center gap-3.5 flex-wrap">
          {/* Template Selector */}
          <div className="flex items-center bg-zinc-100 rounded-xl p-1 border border-zinc-200">
            {[
              { id: "corporate", label: "ATS Korporat", icon: Sparkles },
              { id: "academic", label: "ATS Akademik", icon: Layers },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setTemplateId(id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all duration-200 ${
                  templateId === id
                    ? "bg-white text-zinc-900 shadow-sm border border-zinc-200"
                    : "text-zinc-600 hover:text-zinc-900"
                }`}
              >
                <Icon size={13} />
                {label}
              </button>
            ))}
          </div>

          {/* Load Sample Data */}
          <button
            onClick={loadExampleData}
            title="Isi form secara otomatis dengan data contoh"
            className="flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-100 px-4 py-2.5 text-xs font-bold text-zinc-700 transition duration-200 active:scale-95 cursor-pointer"
          >
            <Sparkles size={14} className="text-blue-600" />
            Isi Contoh
          </button>

          {/* Reset */}
          <button
            onClick={resetData}
            title="Hapus semua draft saat ini"
            className="flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 px-4 py-2.5 text-xs font-bold text-red-600 transition duration-200 active:scale-95 cursor-pointer"
          >
            <Trash2 size={14} />
            Reset
          </button>

          {/* Export PDF */}
          {isComplete ? (
            <PDFDownloadButton cvData={cvData} templateId={templateId} />
          ) : (
            <button
              type="button"
              disabled
              title="Lengkapi data yang wajib diisi sebelum mengunduh"
              className="flex items-center gap-2 rounded-lg bg-zinc-200 px-5 py-2.5 text-sm font-semibold text-zinc-500 cursor-not-allowed"
            >
              <Download size={16} />
              Unduh PDF
            </button>
          )}
        </div>
      </header>

      {/* WORKSPACE LAYOUT */}
      <main className="flex-1 w-full max-w-[1700px] mx-auto p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start relative z-10">
        
        {/* LEFT COLUMN: FORM */}
        <section className="bg-white border border-zinc-200 rounded-2xl shadow-sm p-6 flex flex-col gap-8">
          
          {/* STEP PROGRESS BAR */}
          <div className="relative px-2">
            {/* Background Line */}
            <div className="absolute top-5 left-4 right-4 h-[2px] bg-zinc-200 z-0"></div>
            
            {/* Active Progress Line */}
            <div 
              className="absolute top-5 left-4 h-[2px] bg-gradient-to-r from-blue-500 to-blue-600 z-0 transition-all duration-300"
              style={{ width: `${(activeStep / (steps.length - 1)) * 95}%` }}
            ></div>

            {/* Step Bullets */}
            <div className="relative z-10 flex justify-between">
              {steps.map((step, idx) => {
                const StepIcon = step.icon;
                const isActive = activeStep === idx;
                const hasIssue = stepsWithIssues.has(idx) && activeStep > idx;
                const isCompleted = activeStep > idx && !stepsWithIssues.has(idx);
                
                return (
                  <button
                    key={idx}
                    onClick={() => setActiveStep(idx)}
                    className="flex flex-col items-center gap-2 bg-transparent border-0 cursor-pointer group focus:outline-none"
                  >
                    <div 
                      className={`relative h-10 w-10 rounded-xl flex items-center justify-center transition-all duration-300 border-2 ${
                        isCompleted 
                          ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/20" 
                          : isActive 
                            ? "bg-white border-blue-500 text-blue-600 shadow-md shadow-blue-500/10 scale-110" 
                            : "bg-white border-zinc-200 text-zinc-500 group-hover:border-zinc-300 group-hover:text-zinc-700"
                      }`}
                    >
                      {isCompleted ? <Check size={16} className="stroke-[3]" /> : <StepIcon size={16} />}
                      {hasIssue && (
                        <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-white" title="Data belum lengkap">
                          <AlertCircle size={10} />
                        </span>
                      )}
                    </div>
                    <span 
                      className={`text-[10px] font-bold tracking-wider uppercase hidden md:inline transition-all duration-355 ${
                        isActive 
                          ? "text-blue-700 font-extrabold" 
                          : "text-zinc-500 group-hover:text-zinc-700"
                      }`}
                    >
                      {step.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ACTIVE STEP FORM */}
          <div className="min-h-[420px] bg-zinc-50 border border-zinc-200 rounded-xl p-6">
            {renderFormStep()}
          </div>
        </section>

        {/* RIGHT COLUMN: PREVIEW */}
        <section className="sticky top-[100px] flex flex-col gap-4">
          <div className="flex justify-between items-center px-2">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <h3 className="text-xs font-bold text-zinc-600 uppercase tracking-widest">Live Preview A4</h3>
            </div>
            <span className="text-[11px] text-zinc-500 italic">Copy-pasteable & ATS-compliant</span>
          </div>
          {!isComplete && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900">
              <p className="font-bold flex items-center gap-1.5">
                <AlertCircle size={14} />
                Lengkapi data berikut untuk mengaktifkan unduhan PDF:
              </p>
              <ul className="mt-2 flex flex-wrap gap-2">
                {[...stepsWithIssues].sort().map((step) => (
                  <li key={step}>
                    <button
                      type="button"
                      onClick={() => setActiveStep(step)}
                      className="rounded-lg border border-amber-300 bg-white px-2.5 py-1 font-semibold text-amber-800 hover:bg-amber-100 cursor-pointer"
                    >
                      {steps[step]?.title} ({issues.filter((i) => i.step === step).length})
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <CVPreview />
        </section>
      </main>
    </div>
  );
}
