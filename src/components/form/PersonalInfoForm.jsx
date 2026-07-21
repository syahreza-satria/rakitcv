"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCV } from "../../lib/store";
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

  const inputClasses = "w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-sm text-zinc-100 outline-none transition duration-200 placeholder:text-zinc-655 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10";
  const labelClasses = "text-xs font-bold uppercase tracking-wider text-zinc-400";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="border-b border-zinc-800 pb-4">
        <h3 className="text-md font-bold tracking-wide text-zinc-100">Data Diri</h3>
        <p className="text-xs text-zinc-500 mt-1">Masukkan data diri lengkap Anda untuk header CV.</p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <label className={labelClasses}>Nama Lengkap</label>
          <input
            {...register("fullName")}
            placeholder="e.g. Budi Santoso"
            className={inputClasses}
          />
          {errors.fullName && <p className="text-xs text-red-400 font-semibold">{errors.fullName.message}</p>}
        </div>

        <div className="space-y-2 sm:col-span-2">
          <label className={labelClasses}>Profesi / Jabatan</label>
          <input
            {...register("title")}
            placeholder="e.g. Senior Software Engineer"
            className={inputClasses}
          />
          {errors.title && <p className="text-xs text-red-400 font-semibold">{errors.title.message}</p>}
        </div>

        <div className="space-y-2">
          <label className={labelClasses}>Email</label>
          <input
            type="email"
            {...register("email")}
            placeholder="e.g. budi@email.com"
            className={inputClasses}
          />
          {errors.email && <p className="text-xs text-red-400 font-semibold">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <label className={labelClasses}>Nomor Telepon</label>
          <input
            {...register("phone")}
            placeholder="e.g. +62 812-3456-7890"
            className={inputClasses}
          />
          {errors.phone && <p className="text-xs text-red-400 font-semibold">{errors.phone.message}</p>}
        </div>

        <div className="space-y-2 sm:col-span-2">
          <label className={labelClasses}>Lokasi (Kota, Negara)</label>
          <input
            {...register("location")}
            placeholder="e.g. Jakarta, Indonesia"
            className={inputClasses}
          />
          {errors.location && <p className="text-xs text-red-400 font-semibold">{errors.location.message}</p>}
        </div>

        <div className="space-y-2">
          <label className={labelClasses}>LinkedIn URL (Opsional)</label>
          <input
            {...register("linkedin")}
            placeholder="e.g. https://linkedin.com/in/username"
            className={inputClasses}
          />
          {errors.linkedin && <p className="text-xs text-red-400 font-semibold">{errors.linkedin.message}</p>}
        </div>

        <div className="space-y-2">
          <label className={labelClasses}>Portfolio / Website (Opsional)</label>
          <input
            {...register("portfolio")}
            placeholder="e.g. https://mywebsite.com"
            className={inputClasses}
          />
          {errors.portfolio && <p className="text-xs text-red-400 font-semibold">{errors.portfolio.message}</p>}
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
