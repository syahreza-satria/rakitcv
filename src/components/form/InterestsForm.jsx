"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCV } from "../../lib/store";
import { inputClasses, labelClasses, hintClasses } from "../../lib/ui";
import { z } from "zod";

const schema = z.object({
  researchInterests: z.string().min(10, "Minat penelitian minimal 10 karakter"),
});

// Template Akademik: pengganti Ringkasan, tampil sebagai bagian MINAT PENELITIAN
export default function InterestsForm() {
  const { cvData, setCvData, goNext, goBack } = useCV();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { researchInterests: cvData.researchInterests },
  });

  const watched = watch("researchInterests");

  useEffect(() => {
    if (watched !== undefined && watched !== cvData.researchInterests) {
      setCvData((prev) => ({ ...prev, researchInterests: watched }));
    }
  }, [watched, cvData.researchInterests, setCvData]);

  return (
    <form onSubmit={handleSubmit(goNext)} className="space-y-6">
      <div className="border-b border-zinc-200 pb-4">
        <h3 className="text-md font-bold tracking-wide text-zinc-900">Minat Penelitian</h3>
        <p className="text-xs text-zinc-500 mt-1">Bagian pembuka CV akademik: bidang yang Anda dalami dan ingin dikembangkan.</p>
      </div>

      <div className="flex flex-col gap-2">
        <label className={labelClasses}>Minat Penelitian</label>
        <p className={hintClasses}>
          Tulis 2–3 kalimat: bidang utama, topik spesifik, dan konteks penerapannya. Selaraskan dengan bidang program atau lab yang dituju.
        </p>
        <textarea
          {...register("researchInterests")}
          rows={6}
          placeholder="Sistem informasi kesehatan, analitik data pendidikan, dan penerapan machine learning untuk layanan publik."
          className={inputClasses}
        />
        {errors.researchInterests && <p className="text-xs text-red-600 font-semibold">{errors.researchInterests.message}</p>}
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
