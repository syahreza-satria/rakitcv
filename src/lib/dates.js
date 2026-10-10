// Format tanggal CV: input form memakai <input type="month"> (nilai "YYYY-MM"),
// tampil di CV sebagai "Feb 2026".

export const MONTH_YEAR_REGEX = /^\d{4}-(0[1-9]|1[0-2])$/;
export const MONTH_YEAR_MESSAGE = "Pilih bulan dan tahun";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

// "2026-02" -> "Feb 2026". Teks lain (mis. draf lama "Januari 2023") dikembalikan apa adanya.
export function formatMonthYear(value) {
  if (!value || !MONTH_YEAR_REGEX.test(value)) return value || "";
  const [year, month] = value.split("-");
  return `${MONTHS[Number(month) - 1]} ${year}`;
}
