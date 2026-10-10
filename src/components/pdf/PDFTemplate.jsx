import React from "react";
import { Document, Page, Text, View, Link, Font, StyleSheet } from "@react-pdf/renderer";
import { getTheme } from "../../lib/cvTokens";
import { formatMonthYear } from "../../lib/dates";
import {
  SECTION_TITLES,
  getContactItems,
  getVisibleSections,
  joinParts,
  formatDateRange,
  splitBullets,
  hasExperience,
  hasEducation,
  educationTitle,
  certificationLine,
  languagesLine,
} from "../../lib/cvContent";

// Template Modern memakai Inter (di-embed, subset Latin). Dua keluarga terpisah mengikuti
// pola penamaan font bawaan (regular / -Bold) yang dipakai token.
Font.register({ family: "Inter", src: "/fonts/inter-400.woff" });
Font.register({ family: "Inter-Bold", src: "/fonts/inter-700.woff" });
Font.registerHyphenationCallback((word) => [word]); // tanpa pemenggalan kata otomatis, agar teks tetap utuh di ATS

// Gaya dibuat dari token tema (CV_DESIGN_SYSTEM.md). Tidak ada header/footer halaman,
// tabel, ikon, atau posisi absolut: semua isi mengalir satu kolom.
function createStyles(t) {
  return StyleSheet.create({
    page: {
      padding: t.page.marginPt,
      fontFamily: t.font.pdf,
      fontSize: t.size.body,
      lineHeight: t.leading.body,
      color: t.color.text,
      backgroundColor: "#FFFFFF",
    },
    header: { alignItems: t.headerAlign === "center" ? "center" : "flex-start" },
    name: {
      fontFamily: t.font.pdfBold,
      fontSize: t.size.name,
      lineHeight: t.leading.heading,
      color: t.color.accent,
    },
    title: {
      fontSize: t.size.title,
      lineHeight: t.leading.heading,
      marginTop: t.space.xs,
    },
    contact: {
      fontSize: t.size.contact,
      color: t.color.muted,
      marginTop: t.space.sm,
      textAlign: t.headerAlign,
    },
    link: { color: t.color.muted, textDecoration: "none" },
    section: { marginTop: t.space.lg },
    sectionTitle: {
      fontFamily: t.font.pdfBold,
      fontSize: t.size.section,
      lineHeight: t.leading.heading,
      letterSpacing: t.sectionLetterSpacing,
      color: t.color.accent,
      borderBottomWidth: t.rule,
      borderBottomColor: t.color.rule,
      borderBottomStyle: "solid",
      paddingBottom: t.space.xs,
      marginBottom: t.space.sectionGap,
    },
    entry: { marginBottom: t.space.md },
    entryRow: { flexDirection: "row", justifyContent: "space-between" },
    entryTitle: { flex: 1, fontFamily: t.font.pdfBold, fontSize: t.size.entryTitle },
    date: { fontSize: t.size.meta, color: t.color.muted, marginLeft: t.space.md },
    meta: {
      fontFamily: t.metaItalic ? t.font.pdfItalic : t.font.pdf,
      fontSize: t.size.meta,
      color: t.color.muted,
      marginTop: t.space.xs,
    },
    bullet: { flexDirection: "row", marginTop: t.space.sm },
    bulletMark: { width: t.bulletIndent },
    bulletText: { flex: 1 },
    paragraph: { marginTop: t.space.sm },
    label: { fontFamily: t.font.pdfBold },
    line: { marginTop: t.space.xs },
  });
}

export default function PDFTemplate({ data, templateId }) {
  const t = getTheme(templateId);
  const s = createStyles(t);
  const { personalInfo, summary, experiences = [], educations = [], skills, certifications = [], languages = [] } = data;
  const show = getVisibleSections(data);
  const contact = getContactItems(personalInfo);

  // minPresenceAhead: judul bagian tidak tertinggal sendirian di dasar halaman
  const renderTitle = (children) => (
    <Text style={s.sectionTitle} minPresenceAhead={48}>
      {children}
    </Text>
  );

  return (
    <Document title={`CV ${personalInfo.fullName || ""}`.trim()} author={personalInfo.fullName || undefined}>
      <Page size="A4" style={s.page}>
        {/* HEADER */}
        <View style={s.header}>
          <Text style={s.name}>{(personalInfo.fullName || "").toUpperCase()}</Text>
          {personalInfo.title ? <Text style={s.title}>{personalInfo.title}</Text> : null}
          {contact.length > 0 && (
            <Text style={s.contact}>
              {contact.map((item, i) => (
                <React.Fragment key={i}>
                  {i > 0 ? " | " : ""}
                  {item.href ? (
                    <Link src={item.href} style={s.link}>
                      {item.text}
                    </Link>
                  ) : (
                    item.text
                  )}
                </React.Fragment>
              ))}
            </Text>
          )}
        </View>

        {/* RINGKASAN */}
        {show.summary && (
          <View style={s.section}>
            {renderTitle(SECTION_TITLES.summary)}
            <Text>{summary}</Text>
          </View>
        )}

        {/* PENGALAMAN KERJA */}
        {show.experience && (
          <View style={s.section}>
            {renderTitle(SECTION_TITLES.experience)}
            {experiences.filter(hasExperience).map((exp, i) => (
              <View key={i} style={s.entry}>
                <View wrap={false}>
                  <View style={s.entryRow}>
                    <Text style={s.entryTitle}>{exp.position}</Text>
                    <Text style={s.date}>{formatDateRange(exp.startDate, exp.endDate, exp.current)}</Text>
                  </View>
                  <Text style={s.meta}>{joinParts(exp.company, exp.location)}</Text>
                </View>
                {splitBullets(exp.description).map((bullet, j) => (
                  <View key={j} style={s.bullet}>
                    <Text style={s.bulletMark}>•</Text>
                    <Text style={s.bulletText}>{bullet}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        )}

        {/* PENDIDIKAN */}
        {show.education && (
          <View style={s.section}>
            {renderTitle(SECTION_TITLES.education)}
            {educations.filter(hasEducation).map((edu, i) => (
              <View key={i} style={s.entry}>
                <View wrap={false}>
                  <View style={s.entryRow}>
                    <Text style={s.entryTitle}>{educationTitle(edu)}</Text>
                    <Text style={s.date}>{formatMonthYear(edu.graduationDate)}</Text>
                  </View>
                  <Text style={s.meta}>{edu.institution}</Text>
                </View>
                {edu.description ? <Text style={s.paragraph}>{edu.description}</Text> : null}
              </View>
            ))}
          </View>
        )}

        {/* KEAHLIAN */}
        {show.skills && (
          <View style={s.section}>
            {renderTitle(SECTION_TITLES.skills)}
            {skills.hardSkills?.length > 0 && (
              <Text>
                <Text style={s.label}>Hard skill: </Text>
                {skills.hardSkills.join(", ")}
              </Text>
            )}
            {skills.softSkills?.length > 0 && (
              <Text style={s.line}>
                <Text style={s.label}>Soft skill: </Text>
                {skills.softSkills.join(", ")}
              </Text>
            )}
          </View>
        )}

        {/* SERTIFIKASI */}
        {show.certifications && (
          <View style={s.section}>
            {renderTitle(SECTION_TITLES.certifications)}
            {certifications
              .filter((c) => c.title)
              .map((cert, i) => (
                <Text key={i} style={i > 0 ? s.line : undefined}>
                  {certificationLine(cert)}
                </Text>
              ))}
          </View>
        )}

        {/* BAHASA */}
        {show.languages && (
          <View style={s.section}>
            {renderTitle(SECTION_TITLES.languages)}
            <Text>{languagesLine(languages)}</Text>
          </View>
        )}
      </Page>
    </Document>
  );
}
