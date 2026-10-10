"use client";

import React, { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCV } from "../../lib/store";
import MonthYearInput from "./MonthYearInput";
import { inputClasses, textClasses, labelClasses, hintClasses } from "../../lib/ui";
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


  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="border-b border-zinc-200 pb-4 flex justify-between items-center">
        <div>
          <h3 className="text-md font-bold tracking-wide text-zinc-900">Pengalaman Kerja</h3>
          <p className="text-xs text-zinc-500 mt-1">Tambahkan riwayat pekerjaan Anda. Gunakan bullet points di deskripsi.</p>
        </div>
        <button
          type="button"
          onClick={() => append({ company: "", position: "", location: "", startDate: "", endDate: "", current: false, description: "" })}
          className="flex items-center gap-1.5 rounded-xl border border-blue-500/30 bg-blue-500/10 px-3.5 py-2 text-xs font-bold text-blue-700 hover:bg-blue-500/20 hover:border-blue-500/40 transition duration-200 cursor-pointer"
        >
          <Plus size={14} /> Tambah
        </button>
      </div>

      {errors.experiences?.message && (
        <p className="text-xs font-semibold text-red-600 bg-red-50 p-3.5 rounded-xl border border-red-200">
          {errors.experiences.message}
        </p>
      )}

      <div className="space-y-6">
        {fields.map((field, index) => {
          const isCurrent = watchedExperiences[index]?.current;
          
          return (
            <div key={field.id} className="relative rounded-xl border border-zinc-200 bg-zinc-50 p-5 space-y-4">
              {fields.length > 1 && (
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="absolute right-4 top-4 text-zinc-500 hover:text-red-600 transition duration-200"
                  title="Hapus Entri"
                >
                  <Trash2 size={16} />
                </button>
              )}

              <h4 className="font-bold text-xs uppercase tracking-wider text-zinc-500">Pekerjaan #{index + 1}</h4>

              <div className="grid grid-cols-1 gap-4.5 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label className={labelClasses}>Nama Perusahaan</label>
                  <p className={hintClasses}>Nama resmi perusahaan atau instansi.</p>
                  <input
                    {...register(`experiences.${index}.company`)}
                    placeholder="PT Maju Jaya"
                    className={inputClasses}
                  />
                  {errors.experiences?.[index]?.company && (
                    <p className="text-xs text-red-600 font-semibold">{errors.experiences[index].company.message}</p>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <label className={labelClasses}>Posisi / Jabatan</label>
                  <p className={hintClasses}>Gunakan nama jabatan yang sama dengan di kontrak atau LinkedIn.</p>
                  <input
                    {...register(`experiences.${index}.position`)}
                    placeholder="Frontend Developer"
                    className={inputClasses}
                  />
                  {errors.experiences?.[index]?.position && (
                    <p className="text-xs text-red-600 font-semibold">{errors.experiences[index].position.message}</p>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <label className={labelClasses}>Lokasi</label>
                  <p className={hintClasses}>Kota tempat Anda bekerja, atau tulis &quot;Remote&quot;.</p>
                  <input
                    {...register(`experiences.${index}.location`)}
                    placeholder="Jakarta, Indonesia"
                    className={inputClasses}
                  />
                  {errors.experiences?.[index]?.location && (
                    <p className="text-xs text-red-600 font-semibold">{errors.experiences[index].location.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-2">
                    <label className={labelClasses}>Mulai Kerja</label>
                    <p className={hintClasses}>Pilih bulan dan tahun mulai bekerja.</p>
                    <MonthYearInput registration={register(`experiences.${index}.startDate`)} />
                    {errors.experiences?.[index]?.startDate && (
                      <p className="text-xs text-red-600 font-semibold">{errors.experiences[index].startDate.message}</p>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className={labelClasses}>Selesai Kerja</label>
                    <p className={hintClasses}>Pilih bulan dan tahun selesai. Bila masih bekerja, centang kotak di bawahnya.</p>
                    <MonthYearInput registration={register(`experiences.${index}.endDate`)} disabled={isCurrent} />
                    {errors.experiences?.[index]?.endDate && (
                      <p className="text-xs text-red-600 font-semibold">{errors.experiences[index].endDate.message}</p>
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
                        setValue(`experiences.${index}.endDate`, "");
                      } else {
                        setValue(`experiences.${index}.endDate`, "");
                      }
                    }}
                    className="h-4.5 w-4.5 rounded-lg border-zinc-200 bg-white text-blue-600 focus:ring-blue-500/20"
                  />
                  <label htmlFor={`experiences-${index}-current`} className="text-xs text-zinc-600 font-bold uppercase tracking-wider cursor-pointer">
                    Saya saat ini bekerja di sini
                  </label>
                </div>

                <div className="flex flex-col gap-2 sm:col-span-2">
                  <label className={labelClasses}>Deskripsi Tanggung Jawab & Pencapaian</label>
                  <p className={hintClasses}>Satu baris = satu poin di CV. Mulai dengan kata kerja (membangun, meningkatkan, memimpin) dan sertakan angka bila ada. Cukup 3–5 poin per pekerjaan.</p>
                  <textarea
                    {...register(`experiences.${index}.description`)}
                    rows={4}
                    placeholder="Masukkan poin-poin pencapaian Anda, pisahkan dengan baris baru (Enter).&#10;Contoh:&#10;Meningkatkan retensi pengguna sebesar 15% dengan membenahi bug UI.&#10;Mendesain pustaka komponen internal menggunakan Tailwind CSS."
                    className={textClasses}
                  />
                  {errors.experiences?.[index]?.description && (
                    <p className="text-xs text-red-600 font-semibold">{errors.experiences[index].description.message}</p>
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
