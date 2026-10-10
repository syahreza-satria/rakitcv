"use client";

import React from "react";
import { inputClasses } from "../../lib/ui";

// Input bulan + tahun (date picker bawaan browser). Dipakai semua kolom tanggal di form.
// `registration` adalah hasil `register(name)` dari react-hook-form.
export default function MonthYearInput({ registration, className = inputClasses, ...props }) {
  return <input {...registration} {...props} type="month" className={className} />;
}
