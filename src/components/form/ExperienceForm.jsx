"use client";

import React, { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCV } from "../../lib/store";
import { ExperienceSchema } from "../../lib/schema";
import { z } from "zod";
import { Plus, Trash2 } from "lucide-react";

const schema = z.object({
  experiences: z.array(ExperienceSchema).min(1, "Minimal harus ada 1 pengalaman kerja"),
});

export default function ExperienceForm() {
  const { cvData, setCvData, setActiveStep } = useCV();

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      experiences: cvData.experiences.length > 0 ? cvData.experiences : [
        { company: "", position: "", location: "", startDate: "", endDate: "", current: false, description: "" }
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "experiences",
  });

  // Watch for current check state helper
  const watchedExperiences = watch("experiences") || [];

  // Subscription-based live sync to CV Context (highly reliable for nested field arrays)
  useEffect(() => {
    const subscription = watch((value) => {
      if (value.experiences) {
        // Deep compare to prevent unnecessary context updates
        if (JSON.stringify(value.experiences) !== JSON.stringify(cvData.experiences)) {
          setCvData((prev) => ({
            ...prev,
            experiences: value.experiences,
          }));
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, cvData.experiences, setCvData]);

  const onSubmit = (data) => {
    setActiveStep(3);
  };

  const inputClasses = "w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-sm text-zinc-100 outline-none transition duration-200 placeholder:text-zinc-655 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10";
  const textClasses = "w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-sm text-zinc-100 outline-none transition duration-200 placeholder:text-zinc-655 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 resize-y";
  const labelClasses = "text-xs font-bold uppercase tracking-wider text-zinc-400";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="border-b border-zinc-800 pb-4 flex justify-between items-center">
        <div>
          <h3 className="text-md font-bold tracking-wide text-zinc-100">Pengalaman Kerja</h3>
          <p className="text-xs text-zinc-500 mt-1">Tambahkan riwayat pekerjaan Anda. Gunakan bullet points di deskripsi.</p>
        </div>
        <button
          type="button"
          onClick={() => append({ company: "", position: "", location: "", startDate: "", endDate: "", current: false, description: "" })}
          className="flex items-center gap-1.5 rounded-xl border border-blue-500/30 bg-blue-500/10 px-3.5 py-2 text-xs font-bold text-blue-400 hover:bg-blue-500/20 hover:border-blue-500/40 transition duration-200 cursor-pointer"
        >
          <Plus size={14} /> Tambah
        </button>
      </div>

      {errors.experiences?.message && (
        <p className="text-xs font-semibold text-red-400 bg-red-950/20 p-3.5 rounded-xl border border-red-900/35">
          {errors.experiences.message}
        </p>
      )}

      <div className="space-y-6">
        {fields.map((field, index) => {
          const isCurrent = watchedExperiences[index]?.current;
          
          return (
            <div key={field.id} className="relative rounded-xl border border-zinc-800 bg-zinc-950/20 p-5 space-y-4">
              {fields.length > 1 && (
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="absolute right-4 top-4 text-zinc-500 hover:text-red-400 transition duration-250"
                  title="Hapus Entri"
                >
                  <Trash2 size={16} />
                </button>
              )}

              <h4 className="font-bold text-xs uppercase tracking-wider text-zinc-555">Pekerjaan #{index + 1}</h4>

              <div className="grid grid-cols-1 gap-4.5 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className={labelClasses}>Nama Perusahaan</label>
                  <input
                    {...register(`experiences.${index}.company`)}
                    placeholder="e.g. PT Maju Jaya"
                    className={inputClasses}
                  />
                  {errors.experiences?.[index]?.company && (
                    <p className="text-xs text-red-400 font-semibold">{errors.experiences[index].company.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className={labelClasses}>Posisi / Jabatan</label>
                  <input
                    {...register(`experiences.${index}.position`)}
                    placeholder="e.g. Frontend Developer"
                    className={inputClasses}
                  />
                  {errors.experiences?.[index]?.position && (
                    <p className="text-xs text-red-400 font-semibold">{errors.experiences[index].position.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className={labelClasses}>Lokasi</label>
                  <input
                    {...register(`experiences.${index}.location`)}
                    placeholder="e.g. Jakarta, Indonesia"
                    className={inputClasses}
                  />
                  {errors.experiences?.[index]?.location && (
                    <p className="text-xs text-red-400 font-semibold">{errors.experiences[index].location.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <label className={labelClasses}>Mulai Kerja</label>
                    <input
                      {...register(`experiences.${index}.startDate`)}
                      placeholder="e.g. Jan 2022"
                      className={inputClasses}
                    />
                    {errors.experiences?.[index]?.startDate && (
                      <p className="text-xs text-red-400 font-semibold">{errors.experiences[index].startDate.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className={labelClasses}>Selesai Kerja</label>
                    <input
                      {...register(`experiences.${index}.endDate`)}
                      placeholder="e.g. Des 2023"
                      disabled={isCurrent}
                      className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-sm text-zinc-100 outline-none transition duration-200 placeholder:text-zinc-655 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:bg-zinc-950/40 disabled:text-zinc-500"
                    />
                    {errors.experiences?.[index]?.endDate && (
                      <p className="text-xs text-red-400 font-semibold">{errors.experiences[index].endDate.message}</p>
                    )}
                  </div>
                </div>

                <div className="sm:col-span-2 flex items-center gap-2.5 pt-1">
                  <input
                    type="checkbox"
                    id={`experiences-${index}-current`}
                    {...register(`experiences.${index}.current`)}
                    onChange={(e) => {
                      setValue(`experiences.${index}.current`, e.target.checked);
                      if (e.target.checked) {
                        setValue(`experiences.${index}.endDate`, "Sekarang");
                      } else {
                        setValue(`experiences.${index}.endDate`, "");
                      }
                    }}
                    className="h-4.5 w-4.5 rounded-lg border-zinc-800 bg-zinc-950 text-blue-600 focus:ring-blue-550/20"
                  />
                  <label htmlFor={`experiences-${index}-current`} className="text-xs text-zinc-400 font-bold uppercase tracking-wider cursor-pointer">
                    Saya saat ini bekerja di sini
                  </label>
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <label className={labelClasses}>Deskripsi Tanggung Jawab & Pencapaian</label>
                  <textarea
                    {...register(`experiences.${index}.description`)}
                    rows={4}
                    placeholder="Masukkan poin-poin pencapaian Anda, pisahkan dengan baris baru (Enter).&#10;e.g.&#10;Meningkatkan retensi pengguna sebesar 15% dengan membenahi bug UI.&#10;Mendesain pustaka komponen internal menggunakan Tailwind CSS."
                    className={textClasses}
                  />
                  {errors.experiences?.[index]?.description && (
                    <p className="text-xs text-red-400 font-semibold">{errors.experiences[index].description.message}</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={() => setActiveStep(1)}
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
