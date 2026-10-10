"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCV } from "../../lib/store";
import { inputClasses, labelClasses, hintClasses } from "../../lib/ui";
import { PersonalInfoSchema } from "../../lib/schema";

export default function PersonalInfoForm() {
  const { cvData, setCvData, setActiveStep } = useCV();
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(PersonalInfoSchema),
    defaultValues: cvData.personalInfo,
  });

  const watchedValues = watch();

  // Sync to store live but only when data has actually changed (prevents render loops)
  useEffect(() => {
    if (watchedValues && JSON.stringify(watchedValues) !== JSON.stringify(cvData.personalInfo)) {
      setCvData((prev) => ({
        ...prev,
        personalInfo: watchedValues,
      }));
    }
  }, [watchedValues, cvData.personalInfo, setCvData]);

  const onSubmit = (data) => {
    setActiveStep(1);
  };


  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="border-b border-zinc-200 pb-4">
        <h3 className="text-md font-bold tracking-wide text-zinc-900">Data Diri</h3>
        <p className="text-xs text-zinc-500 mt-1">Masukkan data diri lengkap Anda untuk header CV.</p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2 sm:col-span-2">
          <label className={labelClasses}>Nama Lengkap</label>
          <p className={hintClasses}>Tulis sesuai KTP atau ijazah. Tampil dengan huruf kapital di bagian atas CV.</p>
          <input
            {...register("fullName")}
            placeholder="John Doe"
            className={inputClasses}
          />
          {errors.fullName && <p className="text-xs text-red-600 font-semibold">{errors.fullName.message}</p>}
        </div>

        <div className="flex flex-col gap-2 sm:col-span-2">
          <label className={labelClasses}>Profesi / Jabatan</label>
          <p className={hintClasses}>Posisi yang Anda lamar atau profesi utama. Sebaiknya selaras dengan judul di lowongan.</p>
          <input
            {...register("title")}
            placeholder="Frontend Developer"
            className={inputClasses}
          />
          {errors.title && <p className="text-xs text-red-600 font-semibold">{errors.title.message}</p>}
        </div>

        <div className="flex flex-col gap-2">
          <label className={labelClasses}>Email</label>
          <p className={hintClasses}>Gunakan email profesional yang memuat nama Anda.</p>
          <input
            type="email"
            {...register("email")}
            placeholder="john.doe@email.com"
            className={inputClasses}
          />
          {errors.email && <p className="text-xs text-red-600 font-semibold">{errors.email.message}</p>}
        </div>

        <div className="flex flex-col gap-2">
          <label className={labelClasses}>Nomor Telepon</label>
          <p className={hintClasses}>Nomor aktif (idealnya terhubung WhatsApp), mis. +62 812-3456-7890.</p>
          <input
            {...register("phone")}
            placeholder="+62 812-3456-7890"
            className={inputClasses}
          />
          {errors.phone && <p className="text-xs text-red-600 font-semibold">{errors.phone.message}</p>}
        </div>

        <div className="flex flex-col gap-2 sm:col-span-2">
          <label className={labelClasses}>Lokasi (Kota, Negara)</label>
          <p className={hintClasses}>Cukup kota dan negara. Alamat lengkap tidak diperlukan.</p>
          <input
            {...register("location")}
            placeholder="Jakarta, Indonesia"
            className={inputClasses}
          />
          {errors.location && <p className="text-xs text-red-600 font-semibold">{errors.location.message}</p>}
        </div>

        <div className="flex flex-col gap-2">
          <label className={labelClasses}>LinkedIn URL (Opsional)</label>
          <p className={hintClasses}>Salin URL profil lengkap, diawali https://. Kosongkan bila tidak punya.</p>
          <input
            {...register("linkedin")}
            placeholder="https://linkedin.com/in/johndoe"
            className={inputClasses}
          />
          {errors.linkedin && <p className="text-xs text-red-600 font-semibold">{errors.linkedin.message}</p>}
        </div>

        <div className="flex flex-col gap-2">
          <label className={labelClasses}>Portfolio / Website (Opsional)</label>
          <p className={hintClasses}>Situs pribadi, GitHub, atau Behance, diawali https://.</p>
          <input
            {...register("portfolio")}
            placeholder="https://johndoe.dev"
            className={inputClasses}
          />
          {errors.portfolio && <p className="text-xs text-red-600 font-semibold">{errors.portfolio.message}</p>}
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          className="rounded-xl bg-blue-600 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-blue-600/10 transition duration-200 hover:bg-blue-500 hover:shadow-blue-500/20 active:scale-95 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/50"
        >
          Lanjut
        </button>
      </div>
    </form>
  );
}
