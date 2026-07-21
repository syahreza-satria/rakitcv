"use client";

import React, { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCV } from "../../lib/store";
import { EducationSchema } from "../../lib/schema";
import { z } from "zod";
import { Plus, Trash2 } from "lucide-react";

const schema = z.object({
  educations: z.array(EducationSchema).min(1, "Minimal harus ada 1 riwayat pendidikan"),
});

export default function EducationForm() {
  const { cvData, setCvData, setActiveStep } = useCV();

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      educations: cvData.educations.length > 0 ? cvData.educations : [
        { institution: "", degree: "", major: "", graduationDate: "", current: false, description: "" }
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "educations",
  });

  // Subscription-based live sync to CV Context (highly reliable for nested field arrays)
  useEffect(() => {
    const subscription = watch((value) => {
      if (value.educations) {
        // Deep compare to prevent unnecessary context updates
        if (JSON.stringify(value.educations) !== JSON.stringify(cvData.educations)) {
          setCvData((prev) => ({
            ...prev,
            educations: value.educations,
          }));
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, cvData.educations, setCvData]);

  const onSubmit = (data) => {
    setActiveStep(4);
  };

  const inputClasses = "w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-sm text-zinc-100 outline-none transition duration-200 placeholder:text-zinc-655 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10";
  const textClasses = "w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-sm text-zinc-100 outline-none transition duration-200 placeholder:text-zinc-655 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 resize-y";
  const labelClasses = "text-xs font-bold uppercase tracking-wider text-zinc-400";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="border-b border-zinc-800 pb-4 flex justify-between items-center">
        <div>
          <h3 className="text-md font-bold tracking-wide text-zinc-100">Pendidikan</h3>
          <p className="text-xs text-zinc-500 mt-1">Masukkan riwayat pendidikan terakhir atau relevan Anda.</p>
        </div>
        <button
          type="button"
          onClick={() => append({ institution: "", degree: "", major: "", graduationDate: "", current: false, description: "" })}
          className="flex items-center gap-1.5 rounded-xl border border-blue-500/30 bg-blue-500/10 px-3.5 py-2 text-xs font-bold text-blue-400 hover:bg-blue-500/20 hover:border-blue-500/40 transition duration-200 cursor-pointer"
        >
          <Plus size={14} /> Tambah
        </button>
      </div>

      {errors.educations?.message && (
        <p className="text-xs font-semibold text-red-400 bg-red-950/20 p-3.5 rounded-xl border border-red-200 dark:border-red-900/35">
          {errors.educations.message}
        </p>
      )}

      <div className="space-y-6">
        {fields.map((field, index) => (
          <div key={field.id} className="relative rounded-xl border border-zinc-800 bg-zinc-950/20 p-5 space-y-4">
            {fields.length > 1 && (
              <button
                type="button"
                onClick={() => remove(index)}
                className="absolute right-4 top-4 text-zinc-500 hover:text-red-400 transition duration-250"
                title="Hapus Pendidikan"
              >
                <Trash2 size={16} />
              </button>
            )}

            <h4 className="font-bold text-xs uppercase tracking-wider text-zinc-555">Pendidikan #{index + 1}</h4>

            <div className="grid grid-cols-1 gap-4.5 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <label className={labelClasses}>Nama Institusi / Universitas / Sekolah</label>
                <input
                  {...register(`educations.${index}.institution`)}
                  placeholder="e.g. Universitas Indonesia"
                  className={inputClasses}
                />
                {errors.educations?.[index]?.institution && (
                  <p className="text-xs text-red-400 font-semibold">{errors.educations[index].institution.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className={labelClasses}>Jenjang Pendidikan</label>
                <input
                  {...register(`educations.${index}.degree`)}
                  placeholder="e.g. Sarjana (S1), Diploma (D3), SMA"
                  className={inputClasses}
                />
                {errors.educations?.[index]?.degree && (
                  <p className="text-xs text-red-400 font-semibold">{errors.educations[index].degree.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className={labelClasses}>Jurusan / Bidang Studi</label>
                <input
                  {...register(`educations.${index}.major`)}
                  placeholder="e.g. Teknik Informatika"
                  className={inputClasses}
                />
                {errors.educations?.[index]?.major && (
                  <p className="text-xs text-red-400 font-semibold">{errors.educations[index].major.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className={labelClasses}>Tahun Kelulusan</label>
                <input
                  {...register(`educations.${index}.graduationDate`)}
                  placeholder="e.g. 2020 atau 2026 (Perkiraan)"
                  className={inputClasses}
                />
                {errors.educations?.[index]?.graduationDate && (
                  <p className="text-xs text-red-400 font-semibold">{errors.educations[index].graduationDate.message}</p>
                )}
              </div>

              <div className="space-y-2 sm:col-span-2">
                <label className={labelClasses}>Deskripsi Tambahan / Prestasi / IPK (Opsional)</label>
                <textarea
                  {...register(`educations.${index}.description`)}
                  rows={3}
                  placeholder="e.g. IPK 3.85/4.00. Aktif dalam organisasi mahasiswa dan memenangkan lomba karya tulis ilmiah."
                  className={textClasses}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={() => setActiveStep(2)}
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
