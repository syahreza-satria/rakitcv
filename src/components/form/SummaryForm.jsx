"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCV } from "../../lib/store";
import { inputClasses, labelClasses, hintClasses } from "../../lib/ui";
import { z } from "zod";

const schema = z.object({
  summary: z.string().min(10, "Ringkasan profil minimal 10 karakter").max(600, "Ringkasan maksimal 600 karakter agar tetap ringkas"),
});

export default function SummaryForm() {
  const { cvData, setCvData, goNext, goBack } = useCV();

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
    goNext();
  };


  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="border-b border-zinc-200 pb-4">
        <h3 className="text-md font-bold tracking-wide text-zinc-900">Ringkasan Profil</h3>
        <p className="text-xs text-zinc-500 mt-1">Tulis penjelasan singkat 3-4 kalimat mengenai latar belakang profesional, pencapaian utama, dan keahlian Anda.</p>
      </div>

      <div className="flex flex-col gap-2">
        <label className={labelClasses}>Ringkasan Profesional</label>
        <p className={hintClasses}>Tulis langsung ke intinya dalam 3–4 kalimat (maks. 600 karakter): profesi dan lama pengalaman, keahlian utama, lalu satu pencapaian terukur. Hindari klaim umum seperti &quot;pekerja keras&quot; tanpa bukti.</p>
        <textarea
          {...register("summary")}
          rows={6}
          placeholder="Frontend Developer berpengalaman lebih dari 5 tahun dengan keahlian dalam merancang sistem skala besar..."
          className={inputClasses}
        />
        {errors.summary && <p className="text-xs text-red-600 font-semibold">{errors.summary.message}</p>}
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
