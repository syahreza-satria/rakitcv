// Token desain output CV (lihat CV_DESIGN_SYSTEM.md §8). Dipakai bersama oleh
// PDFTemplate (angka pt langsung) dan CVPreview (lewat ptToPx). Semua spasi dan
// ukuran berasal dari sini; komponen tidak menulis angka sendiri.
const mm = (v) => v * 2.835;

export const CV_THEMES = {
  corporate: {
    id: "corporate",
    label: "ATS Korporat",
    font: {
      pdf: "Inter",
      pdfSemiBold: "Inter-SemiBold",
      pdfBold: "Inter-Bold",
      pdfItalic: "Inter",
      css: "Inter, Helvetica, Arial, sans-serif",
      metaItalic: false,
      entryTitleWeight: 600,
    },
    page: { top: mm(12.7), bottom: mm(12.7), left: mm(12.7), right: mm(12.7), footer: null },
    header: { align: "left", nameToTitle: 2, titleToContact: 4, bottom: 10, rule: false },
    section: { gap: 12, titleToRule: 2, ruleWidth: 0.75, ruleToContent: 6, minPresenceAhead: 40 },
    entry: { gap: 8, titleToMeta: 1, metaToBody: 3, dateMinWidth: 90, titleDateGap: 12 },
    bullet: { indent: 12, hanging: 2, gap: 2 },
    citation: null,
    size: { name: 20, title: 11, contact: 9.5, section: 10.5, entryTitle: 10.5, meta: 10, date: 9.5, body: 10 },
    leading: { body: 1.3, heading: 1.15 },
    tracking: { section: 0.6 },
    color: { text: "#111827", muted: "#4B5563", accent: "#2563EB", rule: "#2563EB" },
  },
  academic: {
    id: "academic",
    label: "ATS Akademik",
    font: {
      pdf: "Carlito",
      pdfSemiBold: "Carlito-Bold",
      pdfBold: "Carlito-Bold",
      pdfItalic: "Carlito-Italic",
      css: 'Calibri, Carlito, Arial, sans-serif',
      metaItalic: true,
      entryTitleWeight: 700,
    },
    page: { top: mm(12.7), bottom: mm(12.7), left: mm(12.7), right: mm(12.7), footer: { offset: mm(4), size: 9 } },
    header: { align: "center", nameToTitle: 4, titleToContact: 6, bottom: 14, rule: true, ruleWidth: 0.75 },
    section: { gap: 16, titleToRule: 3, ruleWidth: 0.5, ruleToContent: 8, minPresenceAhead: 56 },
    entry: { gap: 10, titleToMeta: 2, metaToBody: 4, dateMinWidth: 100, titleDateGap: 12 },
    bullet: { indent: 14, hanging: 3, gap: 3 },
    citation: { gap: 6, hangingIndent: 18, size: 10.5 },
    size: { name: 18, title: 11, contact: 10, section: 11.5, entryTitle: 11, meta: 11, date: 10.5, body: 11 },
    leading: { body: 1.15, heading: 1.15 },
    tracking: { section: 0.4 },
    color: { text: "#000000", muted: "#333333", accent: "#000000", rule: "#000000" },
  },
};

export const DEFAULT_TEMPLATE = "corporate";

export const isTemplateId = (id) => id === "corporate" || id === "academic";

// Draf lama memakai "modern" / "classic"
export const migrateTemplateId = (id) => (id === "classic" ? "academic" : id === "modern" ? "corporate" : id);

export const getTheme = (templateId) => CV_THEMES[templateId] || CV_THEMES[DEFAULT_TEMPLATE];

export const ptToPx = (pt) => `${(pt * 4) / 3}px`;
