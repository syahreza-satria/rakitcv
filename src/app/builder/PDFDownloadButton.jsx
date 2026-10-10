"use client";

import React from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import PDFTemplate from "../../components/pdf/PDFTemplate";
import { Download, Loader2 } from "lucide-react";

export default function PDFDownloadButton({ cvData, templateId }) {
  const fileName = `CV_${cvData.personalInfo.fullName ? cvData.personalInfo.fullName.replace(/\s+/g, "_") : "Resume"}.pdf`;

  return (
    <PDFDownloadLink
      document={<PDFTemplate data={cvData} templateId={templateId} />}
      fileName={fileName}
    >
      {({ loading }) => {
        if (loading) {
          return (
            <span className="flex items-center gap-2 rounded-lg bg-blue-500/80 px-5 py-2.5 text-sm font-semibold text-white cursor-wait">
              <Loader2 size={16} className="animate-spin" />
              Menyiapkan PDF...
            </span>
          );
        }

        return (
          <span className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 shadow-md hover:shadow-blue-500/20 active:scale-95">
            <Download size={16} />
            Unduh PDF
          </span>
        );
      }}
    </PDFDownloadLink>
  );
}
