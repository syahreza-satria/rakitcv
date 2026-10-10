"use client";

import Link from "next/link";

export default function Error({ unstable_retry }) {
  return (
    <main className="flex-1 flex flex-col items-center justify-center gap-4 px-6 py-24 text-center">
      <h1 className="text-2xl font-bold text-zinc-900">Terjadi kesalahan</h1>
      <p className="max-w-md text-sm text-zinc-600">
        Maaf, ada masalah saat menampilkan halaman ini. Draf CV Anda tetap tersimpan di perangkat ini.
      </p>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => unstable_retry()}
          className="flex h-11 items-center justify-center rounded-xl bg-blue-600 px-6 text-sm font-semibold text-white transition hover:bg-blue-700 cursor-pointer"
        >
          Coba Lagi
        </button>
        <Link
          href="/"
          className="flex h-11 items-center justify-center rounded-xl border border-zinc-200 bg-white px-6 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100"
        >
          Beranda
        </Link>
      </div>
    </main>
  );
}
