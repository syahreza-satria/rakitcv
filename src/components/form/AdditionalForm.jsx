"use client";

import React, { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCV } from "../../lib/store";
import { CertificationSchema, LanguageSchema } from "../../lib/schema";
import { z } from "zod";
import { Plus, Trash2, CheckCircle } from "lucide-react";

const schema = z.object({
  certifications: z.array(CertificationSchema).optional().default([]),
  languages: z.array(LanguageSchema).optional().default([]),
});

export default function AdditionalForm() {
  const { cvData, setCvData, setActiveStep } = useCV();
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      certifications: cvData.certifications || [],
      languages: cvData.languages || [],
    },
  });

  const {
    fields: certFields,
    append: appendCert,
    remove: removeCert,
  } = useFieldArray({
    control,
    name: "certifications",
  });

  const {
    fields: langFields,
    append: appendLang,
    remove: removeLang,
  } = useFieldArray({
    control,
    name: "languages",
  });

  const watchedValues = watch();

  // Sync to store live but only when data has actually changed
  useEffect(() => {
    if (watchedValues) {
      const hasCertsChanged = JSON.stringify(watchedValues.certifications) !== JSON.stringify(cvData.certifications);
      const hasLangsChanged = JSON.stringify(watchedValues.languages) !== JSON.stringify(cvData.languages);
      
      if (hasCertsChanged || hasLangsChanged) {
        setCvData((prev) => ({
          ...prev,
          certifications: watchedValues.certifications || [],
          languages: watchedValues.languages || [],
        }));
      }
    }
  }, [watchedValues, cvData.certifications, cvData.languages, setCvData]);

  const onSubmit = (data) => {
    setShowSuccessToast(true);
    setTimeout(() => {
      setShowSuccessToast(false);
    }, 4000);
  };

  const inputClasses = "w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-sm text-zinc-100 outline-none transition duration-200 placeholder:text-zinc-655 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10";
  const labelClasses = "text-[10px] font-bold uppercase tracking-wider text-zinc-400";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* CERTIFICATIONS */}
      <div className="space-y-4">
        <div className="border-b border-zinc-800 pb-4 flex justify-between items-center">
          <div>
            <h3 className="text-md font-bold tracking-wide text-zinc-100">Sertifikasi</h3>
            <p className="text-xs text-zinc-555 mt-1">Masukkan sertifikasi profesional atau penghargaan (Opsional).</p>
          </div>
          <button
            type="button"
            onClick={() => appendCert({ title: "", issuer: "", date: "" })}
            className="flex items-center gap-1.5 rounded-xl border border-blue-500/30 bg-blue-500/10 px-3.5 py-2 text-xs font-bold text-blue-400 hover:bg-blue-500/20 hover:border-blue-500/40 transition duration-200 cursor-pointer"
          >
            <Plus size={14} /> Tambah
          </button>
        </div>

        <div className="space-y-4">
          {certFields.map((field, index) => (
            <div key={field.id} className="relative rounded-xl border border-zinc-800 bg-zinc-950/20 p-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <button
                type="button"
                onClick={() => removeCert(index)}
                className="absolute right-4 top-4 text-zinc-500 hover:text-red-400 transition duration-250"
                title="Hapus Sertifikat"
              >
                <Trash2 size={15} />
              </button>

              <div className="space-y-1 sm:col-span-3">
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Sertifikasi #{index + 1}</span>
              </div>

              <div className="space-y-2">
                <label className={labelClasses}>Nama Sertifikasi</label>
                <input
                  {...register(`certifications.${index}.title`)}
                  placeholder="e.g. AWS Cloud Practitioner"
                  className={inputClasses}
                />
                {errors.certifications?.[index]?.title && (
                  <p className="text-xs text-red-400 font-semibold">{errors.certifications[index].title.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className={labelClasses}>Penerbit / Lembaga</label>
                <input
                  {...register(`certifications.${index}.issuer`)}
                  placeholder="e.g. Amazon Web Services"
                  className={inputClasses}
                />
                {errors.certifications?.[index]?.issuer && (
                  <p className="text-xs text-red-400 font-semibold">{errors.certifications[index].issuer.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className={labelClasses}>Tahun Perolehan</label>
                <input
                  {...register(`certifications.${index}.date`)}
                  placeholder="e.g. 2023"
                  className={inputClasses}
                />
                {errors.certifications?.[index]?.date && (
                  <p className="text-xs text-red-400 font-semibold">{errors.certifications[index].date.message}</p>
                )}
              </div>
            </div>
          ))}
          {certFields.length === 0 && (
            <p className="text-xs text-zinc-655 italic">Belum ada sertifikasi ditambahkan.</p>
          )}
        </div>
      </div>

      {/* LANGUAGES */}
      <div className="space-y-4">
        <div className="border-b border-zinc-800 pb-4 flex justify-between items-center">
          <div>
            <h3 className="text-md font-bold tracking-wide text-zinc-100">Bahasa</h3>
            <p className="text-xs text-zinc-555 mt-1">Masukkan bahasa yang Anda kuasai (Opsional).</p>
          </div>
          <button
            type="button"
            onClick={() => appendLang({ name: "", proficiency: "" })}
            className="flex items-center gap-1.5 rounded-xl border border-blue-500/30 bg-blue-500/10 px-3.5 py-2 text-xs font-bold text-blue-400 hover:bg-blue-500/20 hover:border-blue-500/40 transition duration-200 cursor-pointer"
          >
            <Plus size={14} /> Tambah
          </button>
        </div>

        <div className="space-y-4">
          {langFields.map((field, index) => (
            <div key={field.id} className="relative rounded-xl border border-zinc-800 bg-zinc-950/20 p-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => removeLang(index)}
                className="absolute right-4 top-4 text-zinc-500 hover:text-red-400 transition duration-250"
                title="Hapus Bahasa"
              >
                <Trash2 size={15} />
              </button>

              <div className="space-y-1 sm:col-span-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Bahasa #{index + 1}</span>
              </div>

              <div className="space-y-2">
                <label className={labelClasses}>Bahasa</label>
                <input
                  {...register(`languages.${index}.name`)}
                  placeholder="e.g. Bahasa Indonesia"
                  className={inputClasses}
                />
                {errors.languages?.[index]?.name && (
                  <p className="text-xs text-red-400 font-semibold">{errors.languages[index].name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className={labelClasses}>Tingkat Kemahiran</label>
                <input
                  {...register(`languages.${index}.proficiency`)}
                  placeholder="e.g. Penutur Asli, Fluent (TOEFL 600)"
                  className={inputClasses}
                />
                {errors.languages?.[index]?.proficiency && (
                  <p className="text-xs text-red-400 font-semibold">{errors.languages[index].proficiency.message}</p>
                )}
              </div>
            </div>
          ))}
          {langFields.length === 0 && (
            <p className="text-xs text-zinc-655 italic">Belum ada bahasa ditambahkan.</p>
          )}
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={() => setActiveStep(4)}
          className="rounded-xl border border-zinc-800 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-zinc-400 transition duration-200 hover:bg-zinc-850 hover:text-zinc-200 active:scale-95 cursor-pointer focus:outline-none"
        >
          Kembali
        </button>
        <button
          type="submit"
          className="rounded-xl bg-blue-600 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-blue-600/10 transition duration-200 hover:bg-blue-500 hover:shadow-blue-500/20 active:scale-95 cursor-pointer focus:outline-none"
        >
          Simpan Data
        </button>
      </div>

      {/* Success Notification Toast */}
      {showSuccessToast && (
        <div className="fixed bottom-6 right-6 z-[9999] flex items-center gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-950/80 px-4 py-3.5 text-xs font-semibold text-emerald-400 backdrop-blur-xl shadow-2xl shadow-emerald-950/50 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <CheckCircle size={16} className="text-emerald-400 shrink-0" />
          <span>Draf CV berhasil disimpan ke penyimpanan lokal!</span>
        </div>
      )}
    </form>
  );
}
