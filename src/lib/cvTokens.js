// Token desain output CV (lihat CV_DESIGN_SYSTEM.md). Dipakai bersama oleh
// PDFTemplate (angka pt langsung) dan CVPreview (lewat ptToPx).
const base = {
  page: { marginPt: 51, marginCm: 1.8 },
  size: { name: 20, title: 11.5, section: 11, entryTitle: 10.5, meta: 10, body: 10, contact: 9.5 },
  leading: { body: 1.35, heading: 1.15 },
  space: { xs: 2, sm: 4, md: 8, lg: 14, sectionGap: 6 },
  rule: 0.75,
  sectionLetterSpacing: 0.5,
  bulletIndent: 10,
};

export const CV_THEMES = {
  classic: {
    ...base,
    font: { pdf: "Times-Roman", pdfBold: "Times-Bold", pdfItalic: "Times-Italic", css: '"Times New Roman", Times, serif' },
    color: { text: "#111111", muted: "#444444", accent: "#111111", rule: "#111111" },
    headerAlign: "center",
    metaItalic: true,
  },
  modern: {
    ...base,
    // Inter di-embed dari public/fonts (didaftarkan di PDFTemplate dan @font-face di globals.css)
    font: { pdf: "Inter", pdfBold: "Inter-Bold", pdfItalic: "Inter", css: '"Inter", Helvetica, Arial, sans-serif' },
    color: { text: "#111827", muted: "#4B5563", accent: "#2563EB", rule: "#2563EB" },
    headerAlign: "left",
    metaItalic: false,
  },
};

export const getTheme = (templateId) => CV_THEMES[templateId] || CV_THEMES.modern;

export const ptToPx = (pt) => `${(pt * 4) / 3}px`;
