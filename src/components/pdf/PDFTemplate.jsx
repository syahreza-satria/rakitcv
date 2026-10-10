import React from "react";
import { Document, Page, Text, View, Link, Font, StyleSheet } from "@react-pdf/renderer";
import { getTheme } from "../../lib/cvTokens";
import { getSections, getContactItems, cvFooterText } from "../../lib/cvContent";

// Template Korporat memakai Inter (di-embed, subset Latin). Tiap ketebalan didaftarkan sebagai
// keluarga terpisah mengikuti nama yang dipakai token (regular / -SemiBold / -Bold).
Font.register({ family: "Inter", src: "/fonts/inter-400.woff" });
Font.register({ family: "Inter-SemiBold", src: "/fonts/inter-600.woff" });
Font.register({ family: "Inter-Bold", src: "/fonts/inter-700.woff" });
// Template Akademik memakai Calibri; yang di-embed Carlito (kembaran metrik Calibri, subset Latin, OFL)
Font.register({ family: "Carlito", src: "/fonts/carlito-400.woff" });
Font.register({ family: "Carlito-Bold", src: "/fonts/carlito-700.woff" });
Font.register({ family: "Carlito-Italic", src: "/fonts/carlito-400-italic.woff" });
Font.registerHyphenationCallback((word) => [word]); // tanpa pemenggalan kata otomatis, agar teks tetap utuh di ATS

// Semua angka berasal dari token tema (CV_DESIGN_SYSTEM.md). Spasi vertikal selalu `marginTop`
// elemen berikutnya. Tidak ada tabel, ikon, atau posisi absolut untuk isi (footer nomor halaman
// adalah satu-satunya elemen absolut dan hanya memuat nama + nomor halaman).
function createStyles(t) {
  return StyleSheet.create({
    page: {
      paddingTop: t.page.top,
      paddingBottom: t.page.bottom,
      paddingLeft: t.page.left,
      paddingRight: t.page.right,
      fontFamily: t.font.pdf,
      fontSize: t.size.body,
      lineHeight: t.leading.body,
      color: t.color.text,
      backgroundColor: "#FFFFFF",
    },
    header: { alignItems: t.header.align === "center" ? "center" : "flex-start" },
    name: { fontFamily: t.font.pdfBold, fontSize: t.size.name, lineHeight: t.leading.heading, color: t.color.accent },
    title: { fontSize: t.size.title, lineHeight: t.leading.heading, marginTop: t.header.nameToTitle },
    contact: {
      fontSize: t.size.contact,
      color: t.color.muted,
      marginTop: t.header.titleToContact,
      textAlign: t.header.align,
    },
    headerRule: {
      alignSelf: "stretch",
      marginTop: t.header.titleToContact,
      borderBottomWidth: t.header.ruleWidth,
      borderBottomColor: t.color.rule,
      borderBottomStyle: "solid",
    },
    link: { color: t.color.muted, textDecoration: "none" },
    sectionTitle: {
      fontFamily: t.font.pdfBold,
      fontSize: t.size.section,
      lineHeight: t.leading.heading,
      letterSpacing: t.tracking.section,
      color: t.color.accent,
      borderBottomWidth: t.section.ruleWidth,
      borderBottomColor: t.color.rule,
      borderBottomStyle: "solid",
      paddingBottom: t.section.titleToRule,
    },
    content: { marginTop: t.section.ruleToContent },
    entryRow: { flexDirection: "row", justifyContent: "space-between" },
    entryTitle: { flex: 1, fontFamily: t.font.pdfSemiBold, fontSize: t.size.entryTitle },
    date: {
      minWidth: t.entry.dateMinWidth,
      marginLeft: t.entry.titleDateGap,
      textAlign: "right",
      fontSize: t.size.date,
      color: t.color.muted,
    },
    meta: {
      fontFamily: t.font.metaItalic ? t.font.pdfItalic : t.font.pdf,
      fontSize: t.size.meta,
      color: t.color.muted,
      marginTop: t.entry.titleToMeta,
    },
    bullet: { flexDirection: "row" },
    bulletMark: { width: t.bullet.indent, paddingLeft: t.bullet.hanging },
    bulletText: { flex: 1 },
    label: { fontFamily: t.font.pdfBold },
    bold: { fontFamily: t.font.pdfBold },
    citation: {
      fontSize: t.citation?.size,
      paddingLeft: t.citation?.hangingIndent,
      textIndent: -(t.citation?.hangingIndent || 0),
    },
    footer: {
      position: "absolute",
      bottom: t.page.footer?.offset,
      left: t.page.left,
      right: t.page.right,
      textAlign: "center",
      fontSize: t.page.footer?.size,
      color: t.color.muted,
    },
  });
}

export default function PDFTemplate({ data, templateId }) {
  const t = getTheme(templateId);
  const s = createStyles(t);
  const { personalInfo } = data;
  const contact = getContactItems(personalInfo, t.id);
  const sections = getSections(data, t.id);

  const gap = (i, value) => (i > 0 ? { marginTop: value } : undefined);

  const renderBlock = (block) => {
    switch (block.type) {
      case "paragraph":
        return <Text>{block.text}</Text>;
      case "entries":
        return block.entries.map((entry, i) => {
          const body = [
            ...entry.details.map((d) => ({ kind: "detail", ...d })),
            ...entry.paragraphs.map((text) => ({ kind: "paragraph", text })),
            ...entry.bullets.map((text) => ({ kind: "bullet", text })),
          ];
          return (
            <View key={i} style={gap(i, t.entry.gap)}>
              <View wrap={false}>
                <View style={s.entryRow}>
                  <Text style={s.entryTitle}>{entry.title}</Text>
                  {entry.date ? <Text style={s.date}>{entry.date}</Text> : null}
                </View>
                {entry.meta ? <Text style={s.meta}>{entry.meta}</Text> : null}
              </View>
              {body.map((item, j) => {
                const style = { marginTop: j === 0 ? t.entry.metaToBody : t.bullet.gap };
                if (item.kind === "bullet") {
                  return (
                    <View key={j} style={[s.bullet, style]}>
                      <Text style={s.bulletMark}>•</Text>
                      <Text style={s.bulletText}>{item.text}</Text>
                    </View>
                  );
                }
                if (item.kind === "detail") {
                  return (
                    <Text key={j} style={style}>
                      <Text style={s.label}>{item.label}: </Text>
                      {item.value}
                    </Text>
                  );
                }
                return (
                  <Text key={j} style={style}>
                    {item.text}
                  </Text>
                );
              })}
            </View>
          );
        });
      case "skills":
        return block.lines.map((line, i) => (
          <Text key={i} style={gap(i, t.bullet.gap)}>
            <Text style={s.label}>{line.label}: </Text>
            {line.text}
          </Text>
        ));
      case "lines":
        return block.lines.map((line, i) => (
          <Text key={i} style={gap(i, t.bullet.gap)}>
            {line}
          </Text>
        ));
      case "citations":
        return block.items.map((segments, i) => (
          <View key={i} wrap={false} style={gap(i, t.citation.gap)}>
            <Text style={s.citation}>
              {segments.map((seg, j) => (
                <Text key={j} style={seg.bold ? s.bold : undefined}>
                  {seg.text}
                </Text>
              ))}
            </Text>
          </View>
        ));
      case "references":
        return block.items.map((lines, i) => (
          <View key={i} wrap={false} style={gap(i, t.citation?.gap ?? t.entry.gap)}>
            {lines.map((line, j) => (
              <Text key={j} style={j === 0 ? s.label : undefined}>
                {line}
              </Text>
            ))}
          </View>
        ));
      default:
        return null;
    }
  };

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
          {t.header.rule && <View style={s.headerRule} />}
        </View>

        {/* BAGIAN: urutan dan judul dari getSections */}
        {sections.map((section, i) => (
          <View key={section.id} style={{ marginTop: i === 0 ? t.header.bottom : t.section.gap }}>
            <Text style={s.sectionTitle} minPresenceAhead={t.section.minPresenceAhead}>
              {section.title}
            </Text>
            <View style={s.content}>{renderBlock(section.block)}</View>
          </View>
        ))}

        {t.page.footer && (
          <Text
            style={s.footer}
            fixed
            render={({ pageNumber, totalPages }) => cvFooterText(personalInfo.fullName, pageNumber, totalPages)}
          />
        )}
      </Page>
    </Document>
  );
}
