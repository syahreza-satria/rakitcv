"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCV } from "../../lib/store";
import { z } from "zod";
import { X, Plus } from "lucide-react";

const schema = z.object({
  hardSkills: z.array(z.string()).min(1, "Minimal masukkan 1 keahlian teknis"),
  softSkills: z.array(z.string()).optional().default([]),
});

export default function SkillsForm() {
  const { cvData, setCvData, setActiveStep } = useCV();
  
  const [hardInput, setHardInput] = useState("");
  const [softInput, setSoftInput] = useState("");

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

  // Subscription-based live sync to CV Context (prevents render loops and stack overflows)
  useEffect(() => {
    const subscription = watch((value) => {
      if (value) {
        const hasSkillsChanged = JSON.stringify(value.hardSkills) !== JSON.stringify(cvData.skills.hardSkills) ||
                                 JSON.stringify(value.softSkills) !== JSON.stringify(cvData.skills.softSkills);
        
        if (hasSkillsChanged) {
          setCvData((prev) => ({
            ...prev,
            skills: {
              hardSkills: value.hardSkills || [],
              softSkills: value.softSkills || [],
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

  const onSubmit = (data) => {
    setActiveStep(5);
  };

  const inputClasses = "flex-1 rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-sm text-zinc-100 outline-none transition duration-200 placeholder:text-zinc-655 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10";
  const labelClasses = "text-xs font-bold uppercase tracking-wider text-zinc-400";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="border-b border-zinc-800 pb-4">
        <h3 className="text-md font-bold tracking-wide text-zinc-100">Keahlian (Skills)</h3>
        <p className="text-xs text-zinc-500 mt-1">Ketik keahlian Anda lalu tekan Enter atau klik ikon + untuk menambahkan chip keahlian.</p>
      </div>

      {/* HARD SKILLS */}
      <div className="space-y-3">
        <label className={labelClasses}>Hard Skills / Keahlian Teknis (Minimal 1)</label>
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
            placeholder="e.g. React, Next.js, SQL (tekan Enter)"
            className={inputClasses}
          />
          <button
            type="button"
            onClick={addHardSkill}
            className="rounded-xl bg-zinc-800 p-2.5 text-zinc-300 hover:bg-zinc-700 transition cursor-pointer"
          >
            <Plus size={20} />
          </button>
        </div>
        {errors.hardSkills && <p className="text-xs text-red-400 font-semibold">{errors.hardSkills.message}</p>}

        <div className="flex flex-wrap gap-2 pt-2">
          {hardSkills.map((skill, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1.5 rounded-xl bg-blue-500/10 px-3.5 py-1.5 text-xs font-bold text-blue-400 border border-blue-500/20"
            >
              {skill}
              <button
                type="button"
                onClick={() => removeHardSkill(skill)}
                className="hover:text-blue-200 transition"
              >
                <X size={12} />
              </button>
            </span>
          ))}
          {hardSkills.length === 0 && (
            <p className="text-xs text-zinc-650 italic">Belum ada hard skill ditambahkan.</p>
          )}
        </div>
      </div>

      {/* SOFT SKILLS */}
      <div className="space-y-3">
        <label className={labelClasses}>Soft Skills / Karakter Kerja (Opsional)</label>
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
            placeholder="e.g. Kepemimpinan, Komunikasi (tekan Enter)"
            className={inputClasses}
          />
          <button
            type="button"
            onClick={addSoftSkill}
            className="rounded-xl bg-zinc-800 p-2.5 text-zinc-300 hover:bg-zinc-700 transition cursor-pointer"
          >
            <Plus size={20} />
          </button>
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          {softSkills.map((skill, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1.5 rounded-xl bg-zinc-800 px-3.5 py-1.5 text-xs font-bold text-zinc-350 border border-zinc-700/50"
            >
              {skill}
              <button
                type="button"
                onClick={() => removeSoftSkill(skill)}
                className="hover:text-zinc-150 transition"
              >
                <X size={12} />
              </button>
            </span>
          ))}
          {softSkills.length === 0 && (
            <p className="text-xs text-zinc-650 italic">Belum ada soft skill ditambahkan.</p>
          )}
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={() => setActiveStep(3)}
          className="rounded-xl border border-zinc-800 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-zinc-400 transition duration-200 hover:bg-zinc-850 hover:text-zinc-200 active:scale-95 cursor-pointer focus:outline-none"
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
