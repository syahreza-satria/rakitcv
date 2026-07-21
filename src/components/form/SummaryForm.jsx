"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCV } from "../../lib/store";
import { z } from "zod";

const schema = z.object({
  summary: z.string().min(10, "Ringkasan profil minimal 10 karakter"),
});

export default function SummaryForm() {
  const { cvData, setCvData, setActiveStep } = useCV();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { summary: cvData.summary },
  });

  const watchedSummary = watch("summary");

  // Sync to store live but only when data has actually changed
  useEffect(() => {
    if (watchedSummary !== undefined && watchedSummary !== cvData.summary) {
      setCvData((prev) => ({
        ...prev,
        summary: watchedSummary,
      }));
    }
  }, [watchedSummary, cvData.summary, setCvData]);

  const onSubmit = (data) => {
    setActiveStep(2);
  };

  const inputClasses = "w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-sm text-zinc-100 outline-none transition duration-200 placeholder:text-zinc-655 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 resize-y";
  const labelClasses = "text-xs font-bold uppercase tracking-wider text-zinc-400";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="border-b border-zinc-800 pb-4">
        <h3 className="text-md font-bold tracking-wide text-zinc-100">Ringkasan Profil</h3>
        <p className="text-xs text-zinc-500 mt-1">Tulis penjelasan singkat 3-4 kalimat mengenai latar belakang profesional, pencapaian utama, dan keahlian Anda.</p>
      </div>

      <div className="space-y-2">
        <label className={labelClasses}>Ringkasan Profesional</label>
        <textarea
          {...register("summary")}
          rows={6}
          placeholder="e.g. Software Engineer berpengalaman lebih dari 5 tahun dengan keahlian dalam merancang sistem skala besar..."
          className={inputClasses}
        />
        {errors.summary && <p className="text-xs text-red-400 font-semibold">{errors.summary.message}</p>}
      </div>

      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={() => setActiveStep(0)}
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
