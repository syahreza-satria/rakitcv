"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCV } from "../../lib/store";
import { inputClasses, labelClasses } from "../../lib/ui";
import { z } from "zod";
import { X, Plus } from "lucide-react";

const schema = z.object({
  hardSkills: z.array(z.string()).min(1, "Minimal masukkan 1 keahlian teknis"),
  softSkills: z.array(z.string()).optional().default([]),
  researchMethods: z.array(z.string()).optional().default([]),
});

export default function SkillsForm() {
  const { cvData, setCvData, goNext, goBack, templateId } = useCV();
  const academic = templateId === "academic";
  
  const [hardInput, setHardInput] = useState("");
  const [softInput, setSoftInput] = useState("");
  const [methodInput, setMethodInput] = useState("");

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: cvData.skills,
  });

  const hardSkills = watch("hardSkills") || [];
  const softSkills = watch("softSkills") || [];
  const researchMethods = watch("researchMethods") || [];

  // Subscription-based live sync to CV Context (prevents render loops and stack overflows)
  useEffect(() => {
    const subscription = watch((value) => {
      if (value) {
        const hasSkillsChanged = JSON.stringify(value.hardSkills) !== JSON.stringify(cvData.skills.hardSkills) ||
                                 JSON.stringify(value.softSkills) !== JSON.stringify(cvData.skills.softSkills) ||
                                 JSON.stringify(value.researchMethods) !== JSON.stringify(cvData.skills.researchMethods);
        
        if (hasSkillsChanged) {
          setCvData((prev) => ({
            ...prev,
            skills: {
              hardSkills: value.hardSkills || [],
              softSkills: value.softSkills || [],
              researchMethods: value.researchMethods || [],
            },
          }));
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, cvData.skills, setCvData]);

  const addHardSkill = () => {
    const value = hardInput.trim();
    if (value && !hardSkills.includes(value)) {
      const updated = [...hardSkills, value];
      setValue("hardSkills", updated, { shouldValidate: true });
      setHardInput("");
    }
  };

  const removeHardSkill = (skillToRemove) => {
    const updated = hardSkills.filter((s) => s !== skillToRemove);
    setValue("hardSkills", updated, { shouldValidate: true });
  };

  const addSoftSkill = () => {
    const value = softInput.trim();
    if (value && !softSkills.includes(value)) {
      const updated = [...softSkills, value];
      setValue("softSkills", updated, { shouldValidate: true });
      setSoftInput("");
    }
  };

  const removeSoftSkill = (skillToRemove) => {
    const updated = softSkills.filter((s) => s !== skillToRemove);
    setValue("softSkills", updated, { shouldValidate: true });
  };

  const addMethod = () => {
    const value = methodInput.trim();
    if (value && !researchMethods.includes(value)) {
      setValue("researchMethods", [...researchMethods, value], { shouldValidate: true });
      setMethodInput("");
    }
  };

  const removeMethod = (method) => {
    setValue("researchMethods", researchMethods.filter((m) => m !== method), { shouldValidate: true });
  };

  const skillInputClasses = inputClasses.replace("w-full", "flex-1");

  const onSubmit = (data) => {
    goNext();
  };


  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="border-b border-zinc-200 pb-4">
        <h3 className="text-md font-bold tracking-wide text-zinc-900">Keahlian (Skills)</h3>
        <p className="text-xs text-zinc-500 mt-1">Ketik keahlian Anda lalu tekan Enter atau klik ikon + untuk menambahkan chip keahlian.</p>
      </div>

      {/* HARD SKILLS */}
      <div className="space-y-3">
        <label className={labelClasses}>{academic ? "Perangkat Lunak / Keahlian Teknis (Minimal 1)" : "Hard Skills / Keahlian Teknis (Minimal 1)"}</label>
        <p className="text-xs leading-relaxed text-zinc-500">Satu keahlian per entri, tekan Enter untuk menambah. Pakai istilah yang muncul di lowongan, mis. React, SQL, Excel.</p>
        <div className="flex gap-2.5">
          <input
            type="text"
            value={hardInput}
            onChange={(e) => setHardInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === ",") {
                e.preventDefault();
                addHardSkill();
              }
            }}
            placeholder="React, Next.js, SQL (tekan Enter)"
            className={skillInputClasses}
          />
          <button
            type="button"
            onClick={addHardSkill}
            className="rounded-xl bg-zinc-100 p-2.5 text-zinc-700 hover:bg-zinc-200 transition cursor-pointer"
          >
            <Plus size={20} />
          </button>
        </div>
        {errors.hardSkills && <p className="text-xs text-red-600 font-semibold">{errors.hardSkills.message}</p>}

        <div className="flex flex-wrap gap-2 pt-2">
          {hardSkills.map((skill, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1.5 rounded-xl bg-blue-500/10 px-3.5 py-1.5 text-xs font-bold text-blue-700 border border-blue-500/20"
            >
              {skill}
              <button
                type="button"
                onClick={() => removeHardSkill(skill)}
                className="hover:text-blue-700 transition"
              >
                <X size={12} />
              </button>
            </span>
          ))}
          {hardSkills.length === 0 && (
            <p className="text-xs text-zinc-500 italic">Belum ada hard skill ditambahkan.</p>
          )}
        </div>
      </div>

      {/* METODE PENELITIAN (Akademik) */}
      {academic && (
        <div className="space-y-3">
          <label className={labelClasses}>Metode Penelitian (Opsional)</label>
          <p className="text-xs leading-relaxed text-zinc-500">Mis. analisis regresi, wawancara terstruktur, studi kasus.</p>
          <div className="flex gap-2.5">
            <input
              type="text"
              value={methodInput}
              onChange={(e) => setMethodInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === ",") {
                  e.preventDefault();
                  addMethod();
                }
              }}
              placeholder="Analisis deret waktu (tekan Enter)"
              className={skillInputClasses}
            />
            <button
              type="button"
              onClick={addMethod}
              className="rounded-xl bg-zinc-100 p-2.5 text-zinc-700 hover:bg-zinc-200 transition cursor-pointer"
            >
              <Plus size={20} />
            </button>
          </div>
          <div className="flex flex-wrap gap-2 pt-2">
            {researchMethods.map((method) => (
              <span
                key={method}
                className="inline-flex items-center gap-1.5 rounded-xl bg-blue-500/10 px-3.5 py-1.5 text-xs font-bold text-blue-700 border border-blue-500/20"
              >
                {method}
                <button type="button" onClick={() => removeMethod(method)} className="hover:text-blue-700 transition">
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* SOFT SKILLS */}
      <div className="space-y-3">
        <label className={labelClasses}>Soft Skills / Karakter Kerja (Opsional)</label>
        <p className="text-xs leading-relaxed text-zinc-500">Pilih 3–5 yang paling relevan dengan posisi yang dilamar.</p>
        <div className="flex gap-2.5">
          <input
            type="text"
            value={softInput}
            onChange={(e) => setSoftInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === ",") {
                e.preventDefault();
                addSoftSkill();
              }
            }}
            placeholder="Kepemimpinan, Komunikasi (tekan Enter)"
            className={skillInputClasses}
          />
          <button
            type="button"
            onClick={addSoftSkill}
            className="rounded-xl bg-zinc-100 p-2.5 text-zinc-700 hover:bg-zinc-200 transition cursor-pointer"
          >
            <Plus size={20} />
          </button>
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          {softSkills.map((skill, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1.5 rounded-xl bg-zinc-100 px-3.5 py-1.5 text-xs font-bold text-zinc-700 border border-zinc-300"
            >
              {skill}
              <button
                type="button"
                onClick={() => removeSoftSkill(skill)}
                className="hover:text-zinc-900 transition"
              >
                <X size={12} />
              </button>
            </span>
          ))}
          {softSkills.length === 0 && (
            <p className="text-xs text-zinc-500 italic">Belum ada soft skill ditambahkan.</p>
          )}
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={goBack}
          className="rounded-xl border border-zinc-200 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-zinc-600 transition duration-200 hover:bg-zinc-100 hover:text-zinc-800 active:scale-95 cursor-pointer focus:outline-none"
        >
          Kembali
        </button>
        <button
          type="submit"
          className="rounded-xl bg-blue-600 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-blue-600/10 transition duration-200 hover:bg-blue-500 hover:shadow-blue-500/20 active:scale-95 cursor-pointer focus:outline-none"
        >
          Lanjut
        </button>
      </div>
    </form>
  );
}
