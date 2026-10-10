"use client";

import React, { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCV } from "../../lib/store";
import MonthYearInput from "./MonthYearInput";
import { inputClasses, textClasses, labelClasses, hintClasses } from "../../lib/ui";
import { EducationSchema } from "../../lib/schema";
import { z } from "zod";
import { Plus, Trash2 } from "lucide-react";

const schema = z.object({
  educations: z.array(EducationSchema).min(1, "Minimal harus ada 1 riwayat pendidikan"),
});

const EMPTY_EDUCATION = {
  institution: "",
  degree: "",
  major: "",
  graduationDate: "",
  current: false,
  description: "",
  thesisTitle: "",
  advisor: "",
  gpa: "",
};

export default function EducationForm() {
  const { cvData, setCvData, goNext, goBack, templateId } = useCV();

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
        EMPTY_EDUCATION
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
    goNext();
  };


  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="border-b border-zinc-200 pb-4 flex justify-between items-center">
        <div>
          <h3 className="text-md font-bold tracking-wide text-zinc-900">Pendidikan</h3>
          <p className="text-xs text-zinc-500 mt-1">Masukkan riwayat pendidikan terakhir atau relevan Anda.</p>
        </div>
        <button
          type="button"
          onClick={() => append(EMPTY_EDUCATION)}
          className="flex items-center gap-1.5 rounded-xl border border-blue-500/30 bg-blue-500/10 px-3.5 py-2 text-xs font-bold text-blue-700 hover:bg-blue-500/20 hover:border-blue-500/40 transition duration-200 cursor-pointer"
        >
          <Plus size={14} /> Tambah
        </button>
      </div>

      {errors.educations?.message && (
        <p className="text-xs font-semibold text-red-600 bg-red-50 p-3.5 rounded-xl border border-red-200">
          {errors.educations.message}
        </p>
      )}

      <div className="space-y-6">
        {fields.map((field, index) => (
          <div key={field.id} className="relative rounded-xl border border-zinc-200 bg-zinc-50 p-5 space-y-4">
            {fields.length > 1 && (
              <button
                type="button"
                onClick={() => remove(index)}
                className="absolute right-4 top-4 text-zinc-500 hover:text-red-600 transition duration-200"
                title="Hapus Pendidikan"
              >
                <Trash2 size={16} />
              </button>
            )}

            <h4 className="font-bold text-xs uppercase tracking-wider text-zinc-500">Pendidikan #{index + 1}</h4>

            <div className="grid grid-cols-1 gap-4.5 sm:grid-cols-2">
              <div className="flex flex-col gap-2 sm:col-span-2">
                <label className={labelClasses}>Nama Institusi / Universitas / Sekolah</label>
                <p className={hintClasses}>Tulis nama resmi tanpa singkatan.</p>
                <input
                  {...register(`educations.${index}.institution`)}
                  placeholder="Universitas Indonesia"
                  className={inputClasses}
                />
                {errors.educations?.[index]?.institution && (
                  <p className="text-xs text-red-600 font-semibold">{errors.educations[index].institution.message}</p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label className={labelClasses}>Jenjang Pendidikan</label>
                <p className={hintClasses}>Tulis jenjang dan gelar yang diperoleh, mis. Sarjana Teknik (S.T.) atau SMA/SMK.</p>
                <input
                  {...register(`educations.${index}.degree`)}
                  placeholder="Sarjana (S1)"
                  className={inputClasses}
                />
                {errors.educations?.[index]?.degree && (
                  <p className="text-xs text-red-600 font-semibold">{errors.educations[index].degree.message}</p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label className={labelClasses}>Jurusan / Bidang Studi</label>
                <p className={hintClasses}>Program studi atau jurusan Anda.</p>
                <input
                  {...register(`educations.${index}.major`)}
                  placeholder="Teknik Informatika"
                  className={inputClasses}
                />
                {errors.educations?.[index]?.major && (
                  <p className="text-xs text-red-600 font-semibold">{errors.educations[index].major.message}</p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label className={labelClasses}>Bulan &amp; Tahun Lulus</label>
                <p className={hintClasses}>Pilih bulan dan tahun lulus. Bila belum lulus, pilih perkiraan kelulusan.</p>
                <MonthYearInput registration={register(`educations.${index}.graduationDate`)} />
                {errors.educations?.[index]?.graduationDate && (
                  <p className="text-xs text-red-600 font-semibold">{errors.educations[index].graduationDate.message}</p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label className={labelClasses}>IPK (Opsional)</label>
                <p className={hintClasses}>Sertakan skala, mis. 3,85/4,00.</p>
                <input {...register(`educations.${index}.gpa`)} placeholder="3,85/4,00" className={inputClasses} />
              </div>

              {templateId === "academic" && (
                <div className="flex flex-col gap-2">
                  <label className={labelClasses}>Pembimbing (Opsional)</label>
                  <p className={hintClasses}>Nama beserta gelar.</p>
                  <input
                    {...register(`educations.${index}.advisor`)}
                    placeholder="Prof. Dr. Ahmad Fauzi, M.T."
                    className={inputClasses}
                  />
                </div>
              )}

              <div className="flex flex-col gap-2 sm:col-span-2">
                <label className={labelClasses}>Judul Skripsi / Tesis (Opsional)</label>
                <p className={hintClasses}>Tulis judul lengkap dalam huruf kalimat.</p>
                <input
                  {...register(`educations.${index}.thesisTitle`)}
                  placeholder="Prediksi Kunjungan Pasien Puskesmas Menggunakan Model Deret Waktu"
                  className={inputClasses}
                />
              </div>

              <div className="flex flex-col gap-2 sm:col-span-2">
                <label className={labelClasses}>Prestasi / Organisasi (Opsional)</label>
                <p className={hintClasses}>Isi hanya yang relevan, mis. penghargaan akademik atau organisasi.</p>
                <textarea
                  {...register(`educations.${index}.description`)}
                  rows={3}
                  placeholder="Penerima Dean's List. Aktif dalam organisasi mahasiswa."
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
