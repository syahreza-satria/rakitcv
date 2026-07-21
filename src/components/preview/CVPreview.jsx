"use client";

import React from "react";
import { useCV } from "../../lib/store";

export default function CVPreview() {
  const { cvData, templateId } = useCV();
  const { personalInfo, summary, experiences, educations, skills, certifications, languages } = cvData;

  const isClassic = templateId === "classic";
  
  // Design system configurations matching the PDF output
  // Classic: Times New Roman, Deep Charcoal (#1f2937) accents, centered, formal.
  // Modern: Arial/Calibri (Sans), Deep Navy (#1e3a8a) accents, left-aligned, modern headings.
  const fontClass = isClassic ? "font-serif" : "font-sans";
  const accentColor = isClassic ? "text-zinc-900" : "text-blue-900";
  
  // Page container simulation: A4 standard dimensions with 1.8cm margin
  const containerStyle = "bg-white text-zinc-800 p-[1.8cm] max-w-[21cm] min-h-[29.7cm] shadow-xl border border-zinc-200 mx-auto leading-relaxed text-[11.5px]";

  const renderSectionHeader = (title) => {
    if (isClassic) {
      return (
        <h2 className={`text-[12px] font-bold tracking-widest border-b border-zinc-300 pb-1 mb-2.5 uppercase ${accentColor} text-left`}>
          {title}
        </h2>
      );
    } else {
      return (
        <h2 className={`text-[12px] font-bold tracking-widest border-l-2 border-blue-600 pl-2.5 mb-2.5 uppercase ${accentColor} text-left`}>
          {title}
        </h2>
      );
    }
  };

  return (
    <div className="w-full overflow-y-auto max-h-[calc(100vh-140px)] p-4 bg-zinc-100 dark:bg-zinc-900/50 rounded-xl">
      <div 
        id="cv-preview-a4" 
        className={`${fontClass} ${containerStyle} flex flex-col gap-6`}
        style={{ boxSizing: "border-box" }}
      >
        {/* HEADER SECTION */}
        <div className="flex flex-col items-center text-center">
          {/* Main Title - Full Name */}
          <h1 className={`text-2xl font-bold tracking-wide uppercase leading-tight ${accentColor}`}>
            {personalInfo.fullName || "NAMA LENGKAP"}
          </h1>
          
          {/* Subtitle - Professional Title */}
          <p className={`text-xs font-semibold mt-1.5 uppercase tracking-wider ${isClassic ? "text-zinc-600" : "text-blue-650"}`}>
            {personalInfo.title || "PROFESI / JABATAN"}
          </p>
          
          {/* Contact Details Grid */}
          <div className="flex flex-wrap gap-x-2.5 gap-y-1 mt-3 text-[9.5px] text-zinc-500 font-medium justify-center">
            {[
              personalInfo.email && (
                <span key="email" className="hover:text-zinc-950 transition">{personalInfo.email}</span>
              ),
              personalInfo.phone && (
                <span key="phone">{personalInfo.phone}</span>
              ),
              personalInfo.location && (
                <span key="location">{personalInfo.location}</span>
              ),
              personalInfo.linkedin && (
                <span key="linkedin" className={`font-semibold hover:underline ${isClassic ? "text-zinc-700" : "text-blue-700"}`}>
                  {personalInfo.linkedin.replace(/^https?:\/\/(www\.)?/, "")}
                </span>
              ),
              personalInfo.portfolio && (
                <span key="portfolio" className={`font-semibold hover:underline ${isClassic ? "text-zinc-700" : "text-blue-700"}`}>
                  {personalInfo.portfolio.replace(/^https?:\/\/(www\.)?/, "")}
                </span>
              )
            ].filter(Boolean).map((el, idx) => (
              <div key={el.key} className="flex items-center gap-1.5">
                {idx > 0 && <span className="text-zinc-300 font-bold">•</span>}
                {el}
              </div>
            ))}
          </div>
        </div>

        {/* SUMMARY SECTION */}
        {summary && (
          <div>
            {renderSectionHeader("RINGKASAN PROFIL")}
            <p className="text-justify leading-relaxed whitespace-pre-line text-zinc-700">
              {summary}
            </p>
          </div>
        )}

        {/* WORK EXPERIENCE SECTION */}
        {experiences && experiences.length > 0 && experiences.some(exp => exp.company || exp.position) && (
          <div>
            {renderSectionHeader("PENGALAMAN KERJA")}
            <div className="flex flex-col gap-4.5">
              {experiences.map((exp, index) => {
                if (!exp.company && !exp.position) return null;
                return (
                  <div key={index} className="flex flex-col">
                    {/* Position / Role and Dates */}
                    <div className="flex justify-between items-baseline font-bold text-zinc-950">
                      <span className="text-[12px]">{exp.position || "Posisi / Jabatan"}</span>
                      <span className="font-semibold text-zinc-500 text-[10px]">
                        {exp.startDate || "Mulai"} – {exp.current ? "Sekarang" : (exp.endDate || "Selesai")}
                      </span>
                    </div>
                    {/* Company and Location */}
                    <div className="flex justify-between items-baseline mt-0.5 text-zinc-600 font-medium">
                      <span className={`${isClassic ? "italic" : "font-semibold text-zinc-700"}`}>{exp.company || "Perusahaan"}</span>
                      <span className="text-zinc-400 text-[10px] font-normal">{exp.location || "Lokasi"}</span>
                    </div>
                    {/* Bullet Points */}
                    {exp.description && (
                      <ul className="list-disc list-outside ml-4 mt-2 flex flex-col gap-1 text-zinc-700 leading-relaxed">
                        {exp.description.split("\n").filter(Boolean).map((bullet, idx) => (
                          <li key={idx} className="pl-1">
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* EDUCATION SECTION */}
        {educations && educations.length > 0 && educations.some(edu => edu.institution || edu.degree) && (
          <div>
            {renderSectionHeader("PENDIDIKAN")}
            <div className="flex flex-col gap-4">
              {educations.map((edu, index) => {
                if (!edu.institution && !edu.degree) return null;
                return (
                  <div key={index} className="flex flex-col">
                    {/* Degree/Major and Graduation Year */}
                    <div className="flex justify-between items-baseline font-bold text-zinc-950">
                      <span className="text-[12px]">
                        {edu.degree || "Jenjang"}{edu.major ? ` - ${edu.major}` : ""}
                      </span>
                      <span className="font-semibold text-zinc-500 text-[10px]">
                        {edu.graduationDate || "Tahun Lulus"}
                      </span>
                    </div>
                    {/* Institution */}
                    <div className="flex justify-between items-baseline mt-0.5 text-zinc-600 font-medium">
                      <span className={`${isClassic ? "italic" : "font-semibold text-zinc-700"}`}>{edu.institution || "Institusi Pendidikan"}</span>
                    </div>
                    {edu.description && (
                      <p className="mt-1.5 text-zinc-750 leading-relaxed whitespace-pre-line text-justify pl-0.5">
                        {edu.description}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SKILLS SECTION */}
        {skills && ((skills.hardSkills && skills.hardSkills.length > 0) || (skills.softSkills && skills.softSkills.length > 0)) && (
          <div>
            {renderSectionHeader("KEAHLIAN (SKILLS)")}
            <div className="flex flex-col gap-1.5 leading-relaxed text-zinc-700">
              {skills.hardSkills && skills.hardSkills.length > 0 && (
                <p>
                  <strong className="text-zinc-800 font-bold">Hard Skills: </strong>
                  <span>{skills.hardSkills.join(", ")}</span>
                </p>
              )}
              {skills.softSkills && skills.softSkills.length > 0 && (
                <p>
                  <strong className="text-zinc-800 font-bold">Soft Skills: </strong>
                  <span>{skills.softSkills.join(", ")}</span>
                </p>
              )}
            </div>
          </div>
        )}

        {/* CERTIFICATIONS SECTION */}
        {certifications && certifications.length > 0 && certifications.some(cert => cert.title) && (
          <div>
            {renderSectionHeader("SERTIFIKASI & PENGHARGAAN")}
            <ul className="list-disc list-outside ml-4 flex flex-col gap-1 text-zinc-700 leading-relaxed">
              {certifications.map((cert, index) => {
                if (!cert.title) return null;
                return (
                  <li key={index} className="pl-1">
                    <strong className="text-zinc-800 font-bold">{cert.title}</strong> – {cert.issuer} ({cert.date})
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* LANGUAGES SECTION */}
        {languages && languages.length > 0 && languages.some(lang => lang.name) && (
          <div>
            {renderSectionHeader("BAHASA")}
            <div className="flex flex-wrap gap-x-6 gap-y-1.5 text-zinc-700">
              {languages.map((lang, index) => {
                if (!lang.name) return null;
                return (
                  <div key={index} className="flex gap-1.5">
                    <strong className="text-zinc-800 font-bold">{lang.name}:</strong>
                    <span>{lang.proficiency}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
