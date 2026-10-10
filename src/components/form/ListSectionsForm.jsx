"use client";

import React, { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Trash2 } from "lucide-react";
import { useCV } from "../../lib/store";
import MonthYearInput from "./MonthYearInput";
import { inputClasses, textClasses, labelClasses, hintClasses } from "../../lib/ui";
import {
  ResearchSchema,
  TeachingSchema,
  VolunteerSchema,
  PublicationSchema,
  AwardSchema,
  PresentationSchema,
  ReferenceSchema,
} from "../../lib/schema";

// Form daftar generik untuk bagian khas template Akademik. Tiap bagian = satu array di cvData.
// type: text | textarea | month | year | checkbox
const SECTIONS = {
  research: {
    title: "Pengalaman Penelitian",
    hint: "Proyek riset, asisten riset, atau magang penelitian.",
    itemLabel: "Penelitian",
    schema: ResearchSchema,
    fields: [
      { name: "title", label: "Judul Proyek / Peran", hint: "Mis. Asisten Riset.", placeholder: "Asisten Riset" },
      { name: "institution", label: "Institusi / Laboratorium", hint: "Tempat riset dilakukan.", placeholder: "Laboratorium Data Science, ITB" },
      { name: "startDate", label: "Mulai", type: "month" },
      { name: "endDate", label: "Selesai", type: "month", disabledBy: "current" },
      { name: "current", label: "Masih berlangsung", type: "checkbox" },
      { name: "description", label: "Uraian (Opsional)", type: "textarea", full: true, hint: "Satu baris = satu butir.", placeholder: "Mengumpulkan dan menyiapkan data kunjungan 40 puskesmas." },
    ],
  },
  teaching: {
    title: "Pengalaman Mengajar",
    hint: "Asisten dosen, asisten praktikum, atau pengajar.",
    itemLabel: "Mengajar",
    schema: TeachingSchema,
    fields: [
      { name: "title", label: "Mata Kuliah / Peran", hint: "Mis. Asisten Praktikum Basis Data.", placeholder: "Asisten Praktikum Basis Data" },
      { name: "institution", label: "Institusi", hint: "Kampus atau lembaga.", placeholder: "Universitas Padjadjaran" },
      { name: "startDate", label: "Mulai", type: "month" },
      { name: "endDate", label: "Selesai", type: "month", disabledBy: "current" },
      { name: "current", label: "Masih berlangsung", type: "checkbox" },
      { name: "description", label: "Uraian (Opsional)", type: "textarea", full: true, hint: "Satu baris = satu butir.", placeholder: "Membimbing 40 mahasiswa pada praktikum SQL." },
    ],
  },
  volunteer: {
    title: "Pengalaman Sukarela",
    hint: "Organisasi, komunitas, atau kegiatan sosial. Sebutkan peran dan hasil yang terukur.",
    itemLabel: "Kegiatan",
    schema: VolunteerSchema,
    fields: [
      { name: "title", label: "Peran", hint: "Mis. Koordinator Program.", placeholder: "Koordinator Program Mentoring" },
      { name: "institution", label: "Organisasi / Komunitas", placeholder: "Komunitas Code for Indonesia" },
      { name: "startDate", label: "Mulai", type: "month" },
      { name: "endDate", label: "Selesai", type: "month", disabledBy: "current" },
      { name: "current", label: "Masih berlangsung", type: "checkbox" },
      { name: "description", label: "Uraian (Opsional)", type: "textarea", full: true, hint: "Satu baris = satu butir. Sertakan angka bila ada.", placeholder: "Mengoordinasi 25 mentor dan 60 peserta." },
    ],
  },
  publications: {
    title: "Publikasi",
    hint: "Tulis sitasi gaya APA 7. Nama Anda otomatis ditebalkan; urutan dari tahun terbaru.",
    itemLabel: "Publikasi",
    schema: PublicationSchema,
    fields: [
      {
        name: "citation",
        label: "Sitasi (APA 7)",
        type: "textarea",
        full: true,
        hint: "Format: Nama, I., & Nama, I. (Tahun). Judul artikel. Nama Jurnal, vol(no), hlm. doi.",
        placeholder: "Doe, J., & Santoso, B. (2025). Judul artikel. Jurnal Contoh, 12(3), 45–60.",
      },
      { name: "year", label: "Tahun", type: "year", hint: "Dipakai untuk mengurutkan.", placeholder: "2025" },
    ],
  },
  awards: {
    title: "Penghargaan dan Beasiswa",
    hint: "Prestasi, penghargaan, atau beasiswa. Tulis yang paling relevan dan sebutkan pemberinya.",
    itemLabel: "Penghargaan",
    schema: AwardSchema,
    fields: [
      { name: "title", label: "Nama Penghargaan / Beasiswa", placeholder: "Beasiswa Unggulan Pascasarjana", full: true },
      { name: "issuer", label: "Pemberi", placeholder: "Kementerian Pendidikan" },
      { name: "year", label: "Tahun", type: "year", placeholder: "2024" },
    ],
  },
  presentations: {
    title: "Presentasi dan Konferensi",
    hint: "Makalah atau poster yang Anda presentasikan.",
    itemLabel: "Presentasi",
    schema: PresentationSchema,
    fields: [
      { name: "title", label: "Judul Presentasi", placeholder: "Peramalan Kunjungan Pasien dengan SARIMA", full: true },
      { name: "event", label: "Acara / Konferensi", placeholder: "Seminar Nasional Informatika Kesehatan" },
      { name: "year", label: "Tahun", type: "year", placeholder: "2025" },
    ],
  },
  references: {
    title: "Referensi",
    hint: "Biasanya dosen pembimbing atau atasan. Pastikan mereka sudah bersedia dihubungi.",
    itemLabel: "Referensi",
    schema: ReferenceSchema,
    fields: [
      { name: "name", label: "Nama dan Gelar", placeholder: "Prof. Dr. Ahmad Fauzi, M.T." },
      { name: "position", label: "Jabatan (Opsional)", placeholder: "Dosen Pembimbing" },
      { name: "institution", label: "Institusi", placeholder: "Institut Teknologi Bandung" },
      { name: "email", label: "Email (Opsional)", placeholder: "ahmad.fauzi@itb.ac.id" },
      { name: "phone", label: "Telepon (Opsional)", placeholder: "+62 ..." },
    ],
  },
};

// Langkah -> bagian yang tampil
const STEP_SECTIONS = {
  academic: ["research", "teaching", "publications"],
  achievements: ["awards", "presentations", "volunteer", "references"],
  highlights: ["volunteer", "awards"],
};

const emptyRow = (fields) => Object.fromEntries(fields.map((f) => [f.name, f.type === "checkbox" ? false : ""]));

function ListSection({ name, config, control, register, errors, watch }) {
  const { fields, append, remove } = useFieldArray({ control, name });
  const rows = watch(name) || [];

  return (
    <div className="space-y-4">
      <div className="border-b border-zinc-200 pb-4 flex justify-between items-center gap-4">
        <div>
          <h3 className="text-md font-bold tracking-wide text-zinc-900">{config.title}</h3>
          <p className="text-xs text-zinc-500 mt-1">{config.hint} (Opsional)</p>
        </div>
        <button
          type="button"
          onClick={() => append(emptyRow(config.fields))}
          className="flex shrink-0 items-center gap-1.5 rounded-xl border border-blue-500/30 bg-blue-500/10 px-3.5 py-2 text-xs font-bold text-blue-700 hover:bg-blue-500/20 hover:border-blue-500/40 transition duration-200 cursor-pointer"
        >
          <Plus size={14} /> Tambah
        </button>
      </div>

      {fields.length === 0 && (
        <p className="text-xs italic text-zinc-500">Belum ada entri. Bagian ini tidak dicetak di CV bila kosong.</p>
      )}

      {fields.map((field, index) => (
        <div key={field.id} className="relative rounded-xl border border-zinc-200 bg-zinc-50 p-5 space-y-4">
          <button
            type="button"
            onClick={() => remove(index)}
            className="absolute right-4 top-4 text-zinc-500 hover:text-red-600 transition duration-200"
            title="Hapus entri"
          >
            <Trash2 size={15} />
          </button>
          <h4 className="font-bold text-xs uppercase tracking-wider text-zinc-500">
            {config.itemLabel} #{index + 1}
          </h4>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {config.fields.map((f) => {
              const error = errors?.[name]?.[index]?.[f.name];
              const key = `${name}.${index}.${f.name}`;
              if (f.type === "checkbox") {
                return (
                  <label key={f.name} className="flex items-center gap-2 text-xs font-semibold text-zinc-700 sm:col-span-2">
                    <input type="checkbox" {...register(key)} className="h-4 w-4 rounded border-zinc-300" />
                    {f.label}
                  </label>
                );
              }
              return (
                <div key={f.name} className={`flex flex-col gap-2 ${f.full ? "sm:col-span-2" : ""}`}>
                  <label className={labelClasses}>{f.label}</label>
                  {f.hint && <p className={hintClasses}>{f.hint}</p>}
                  {f.type === "textarea" ? (
                    <textarea {...register(key)} rows={3} placeholder={f.placeholder} className={textClasses} />
                  ) : f.type === "month" ? (
                    <MonthYearInput
                      registration={register(key)}
                      disabled={f.disabledBy ? Boolean(rows[index]?.[f.disabledBy]) : false}
                    />
                  ) : (
                    <input
                      {...register(key)}
                      inputMode={f.type === "year" ? "numeric" : undefined}
                      maxLength={f.type === "year" ? 4 : undefined}
                      placeholder={f.placeholder}
                      className={inputClasses}
                    />
                  )}
                  {error && <p className="text-xs text-red-600 font-semibold">{error.message}</p>}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ListSectionsForm({ stepKey }) {
  const { cvData, setCvData, goNext, goBack } = useCV();
  const keys = STEP_SECTIONS[stepKey];

  const schema = z.object(Object.fromEntries(keys.map((k) => [k, z.array(SECTIONS[k].schema)])));

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: Object.fromEntries(keys.map((k) => [k, cvData[k] || []])),
  });

  // Sinkron ke store secara langsung, hanya bila data berubah
  useEffect(() => {
    const subscription = watch((value) => {
      const changed = keys.filter((k) => JSON.stringify(value[k] || []) !== JSON.stringify(cvData[k] || []));
      if (changed.length > 0) {
        setCvData((prev) => ({ ...prev, ...Object.fromEntries(changed.map((k) => [k, value[k] || []])) }));
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, cvData, keys, setCvData]);

  return (
    <form onSubmit={handleSubmit(goNext)} className="space-y-8">
      {keys.map((k) => (
        <ListSection key={k} name={k} config={SECTIONS[k]} control={control} register={register} errors={errors} watch={watch} />
      ))}

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
