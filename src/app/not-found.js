import Link from "next/link";

export const metadata = { title: "Halaman Tidak Ditemukan - RakitCV" };

export default function NotFound() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center gap-4 px-6 py-24 text-center">
      <p className="text-sm font-bold uppercase tracking-widest text-blue-700">404</p>
      <h1 className="text-2xl font-bold text-zinc-900">Halaman tidak ditemukan</h1>
      <p className="max-w-md text-sm text-zinc-600">Alamat yang Anda tuju tidak ada atau sudah dipindahkan.</p>
      <Link
        href="/"
        className="flex h-11 items-center justify-center rounded-xl bg-blue-600 px-6 text-sm font-semibold text-white transition hover:bg-blue-700"
      >
        Kembali ke Beranda
      </Link>
    </main>
  );
}
