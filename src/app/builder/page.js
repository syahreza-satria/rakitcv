"use client";

import React from "react";
import Link from "next/link";
import { useCV } from "../../lib/store";
import PersonalInfoForm from "../../components/form/PersonalInfoForm";
import SummaryForm from "../../components/form/SummaryForm";
import ExperienceForm from "../../components/form/ExperienceForm";
import EducationForm from "../../components/form/EducationForm";
import SkillsForm from "../../components/form/SkillsForm";
import AdditionalForm from "../../components/form/AdditionalForm";
import CVPreview from "../../components/preview/CVPreview";
import PDFDownloadButton from "./PDFDownloadButton";
import { Sparkles, Trash2, ArrowLeft, Layers, Check, User, FileText, Briefcase, GraduationCap, Award, Languages } from "lucide-react";

export default function BuilderPage() {
  const { 
    cvData, 
    activeStep, 
    setActiveStep, 
    templateId, 
    setTemplateId, 
    loadExampleData, 
    resetData,
    isLoaded
  } = useCV();

  if (!isLoaded) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-zinc-950">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
          <p className="text-sm font-semibold text-zinc-400 tracking-wider uppercase">Memuat Editor...</p>
        </div>
      </div>
    );
  }

  // Define steps with icons
  const steps = [
    { title: "Data Diri", icon: User },
    { title: "Ringkasan", icon: FileText },
    { title: "Pengalaman", icon: Briefcase },
    { title: "Pendidikan", icon: GraduationCap },
    { title: "Keahlian", icon: Award },
    { title: "Lainnya", icon: Languages }
  ];

  const renderFormStep = () => {
    switch (activeStep) {
      case 0:
        return <PersonalInfoForm />;
      case 1:
        return <SummaryForm />;
      case 2:
        return <ExperienceForm />;
      case 3:
        return <EducationForm />;
      case 4:
        return <SkillsForm />;
      case 5:
        return <AdditionalForm />;
      default:
        return <PersonalInfoForm />;
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans antialiased selection:bg-blue-500/30">
      
      {/* GLOW DECORATIONS (Background only, won't affect PDF/ATS parser) */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-[100px] pointer-events-none"></div>

      {/* HEADER SECTION */}
      <header className="sticky top-0 z-30 w-full border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link 
            href="/"
            className="flex items-center gap-2 text-sm font-semibold text-zinc-400 hover:text-zinc-100 transition duration-200"
          >
            <ArrowLeft size={16} />
            <span>Kembali</span>
          </Link>
          <span className="text-zinc-800">|</span>
          <div className="flex items-center gap-2">
            <h1 className="text-md font-bold tracking-tight text-white">
              CV ATS Builder
            </h1>
            <span className="rounded-full bg-blue-500/10 px-2.5 py-0.5 text-[10px] font-bold text-blue-400 border border-blue-500/20 uppercase tracking-widest">
              Editor
            </span>
          </div>
        </div>

        {/* CONTROLS */}
        <div className="flex items-center gap-3.5 flex-wrap">
          {/* Template Selector */}
          <div className="flex items-center bg-zinc-900 rounded-xl p-1 border border-zinc-800">
            <button
              onClick={() => setTemplateId("classic")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all duration-200 ${
                templateId === "classic"
                  ? "bg-zinc-800 text-white shadow-md border border-zinc-700/50"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <Layers size={13} />
              Classic (Serif)
            </button>
            <button
              onClick={() => setTemplateId("modern")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all duration-200 ${
                templateId === "modern"
                  ? "bg-zinc-800 text-white shadow-md border border-zinc-700/50"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <Sparkles size={13} />
              Modern (Sans)
            </button>
          </div>

          {/* Load Sample Data */}
          <button
            onClick={loadExampleData}
            title="Isi form secara otomatis dengan data contoh"
            className="flex items-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-900 hover:bg-zinc-850 px-4 py-2.5 text-xs font-bold text-zinc-300 transition duration-200 active:scale-95 cursor-pointer"
          >
            <Sparkles size={14} className="text-blue-400" />
            Isi Contoh
          </button>

          {/* Reset */}
          <button
            onClick={resetData}
            title="Hapus semua draft saat ini"
            className="flex items-center gap-1.5 rounded-xl border border-red-950/40 bg-red-950/10 hover:bg-red-950/20 px-4 py-2.5 text-xs font-bold text-red-400 transition duration-200 active:scale-95 cursor-pointer"
          >
            <Trash2 size={14} />
            Reset
          </button>

          {/* Export PDF */}
          <PDFDownloadButton cvData={cvData} templateId={templateId} />
        </div>
      </header>

      {/* WORKSPACE LAYOUT */}
      <main className="flex-1 w-full max-w-[1700px] mx-auto p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start relative z-10">
        
        {/* LEFT COLUMN: FORM */}
        <section className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl shadow-2xl p-6 flex flex-col gap-8 backdrop-blur-xl">
          
          {/* STEP PROGRESS BAR */}
          <div className="relative px-2">
            {/* Background Line */}
            <div className="absolute top-5 left-4 right-4 h-[2px] bg-zinc-800 z-0"></div>
            
            {/* Active Progress Line */}
            <div 
              className="absolute top-5 left-4 h-[2px] bg-gradient-to-r from-blue-500 to-blue-600 z-0 transition-all duration-300"
              style={{ width: `${(activeStep / (steps.length - 1)) * 95}%` }}
            ></div>

            {/* Step Bullets */}
            <div className="relative z-10 flex justify-between">
              {steps.map((step, idx) => {
                const StepIcon = step.icon;
                const isCompleted = activeStep > idx;
                const isActive = activeStep === idx;
                
                return (
                  <button
                    key={idx}
                    onClick={() => setActiveStep(idx)}
                    className="flex flex-col items-center gap-2 bg-transparent border-0 cursor-pointer group focus:outline-none"
                  >
                    <div 
                      className={`h-10 w-10 rounded-xl flex items-center justify-center transition-all duration-300 border-2 ${
                        isCompleted 
                          ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/20" 
                          : isActive 
                            ? "bg-zinc-950 border-blue-400 text-blue-400 shadow-md shadow-blue-500/10 scale-110" 
                            : "bg-zinc-950 border-zinc-800 text-zinc-500 group-hover:border-zinc-700 group-hover:text-zinc-300"
                      }`}
                    >
                      {isCompleted ? <Check size={16} className="stroke-[3]" /> : <StepIcon size={16} />}
                    </div>
                    <span 
                      className={`text-[10px] font-bold tracking-wider uppercase hidden md:inline transition-all duration-355 ${
                        isActive 
                          ? "text-blue-400 font-extrabold" 
                          : "text-zinc-500 group-hover:text-zinc-355"
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
          <div className="min-h-[420px] bg-zinc-900/60 border border-zinc-800/50 rounded-xl p-6 shadow-inner">
            {renderFormStep()}
          </div>
        </section>

        {/* RIGHT COLUMN: PREVIEW */}
        <section className="sticky top-[100px] flex flex-col gap-4">
          <div className="flex justify-between items-center px-2">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Live Preview A4</h3>
            </div>
            <span className="text-[11px] text-zinc-500 italic">Copy-pasteable & ATS-compliant</span>
          </div>
          <CVPreview />
        </section>
      </main>
    </div>
  );
}
