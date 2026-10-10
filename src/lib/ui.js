export const inputClasses =
  "w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-900 outline-none transition duration-200 placeholder:text-zinc-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:bg-zinc-50 disabled:text-zinc-500";

export const textClasses = `${inputClasses} resize-y`;

export const labelClasses = "text-xs font-bold uppercase tracking-wider text-zinc-600";

// Petunjuk tampil di bawah input (order-last), jadi induknya harus "flex flex-col"
export const hintClasses = "order-last text-xs leading-relaxed text-zinc-500";
