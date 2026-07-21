import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

// Define Styles
const styles = StyleSheet.create({
  page: {
    padding: "1.8cm",
    fontSize: 9.5, // 9.5pt translates to a clear, legible size for ATS
    lineHeight: 1.45,
    color: "#27272a", // Zinc-800 for softer body text reading
  },
  
  // Header
  header: {
    marginBottom: 16,
  },
  headerCenter: {
    alignItems: "center",
    textAlign: "center",
  },
  headerLeft: {
    alignItems: "center",
    textAlign: "center",
  },
  fullName: {
    fontSize: 20,
    letterSpacing: 1.2,
    lineHeight: 1.2, // Explicit line height to prevent overlap
    marginBottom: 4,  // Safe margin to push the title down
  },
  title: {
    fontSize: 10,
    letterSpacing: 1,
    lineHeight: 1.2,
  },
  contactRow: {
    marginTop: 6,
    fontSize: 8.2,
    color: "#71717a", // Zinc-500 for secondary contact info
    lineHeight: 1.3,
  },
  contactLink: {
    fontWeight: "bold",
  },
  dividerText: {
    color: "#d4d4d8", // Light grey dot separators
    fontWeight: "bold",
  },

  // Sections
  section: {
    marginBottom: 14,
  },
  sectionTitleClassic: {
    fontSize: 10.5,
    textAlign: "left",
    borderBottomWidth: 0.75,
    borderBottomColor: "#d4d4d8", // Thin zinc divider
    paddingBottom: 3,
    marginBottom: 8,
    letterSpacing: 1.5,
  },
  sectionTitleModern: {
    fontSize: 10.5,
    borderLeftWidth: 2,
    borderLeftColor: "#2563eb", // Blue accent border
    paddingLeft: 6,
    paddingTop: 1,
    paddingBottom: 1,
    marginBottom: 8,
    letterSpacing: 1.5,
  },

  // Experience & Education entries
  entry: {
    marginBottom: 9,
  },
  entryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  entryTitle: {
    fontSize: 10,
    color: "#09090b", // Rich dark headings
  },
  entryDate: {
    fontSize: 8.5,
    color: "#71717a",
  },
  entrySubHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 1,
  },
  entrySubtitle: {
    color: "#3f3f46",
    fontSize: 9,
  },
  entryLocation: {
    fontSize: 8.5,
    color: "#a1a1aa", // Soft location details
  },
  
  // Bullet lists
  bulletList: {
    marginTop: 5,
    paddingLeft: 6,
  },
  bulletItem: {
    flexDirection: "row",
    marginBottom: 2.5,
  },
  bulletPoint: {
    width: 8,
    fontSize: 9.5,
    color: "#71717a",
  },
  bulletContent: {
    flex: 1,
    fontSize: 9,
    color: "#3f3f46",
    lineHeight: 1.4,
  },

  // Text details
  summaryText: {
    textAlign: "justify",
    color: "#3f3f46",
  },
  skillsText: {
    marginBottom: 4,
  },
  boldLabel: {
    color: "#09090b",
  },
  normalValue: {
    color: "#3f3f46",
  },
  certItem: {
    flexDirection: "row",
    marginBottom: 2.5,
  },
  langRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 2,
  },
  langItem: {
    marginRight: 18,
    flexDirection: "row",
  }
});

export default function PDFTemplate({ data, templateId }) {
  const { personalInfo, summary, experiences, educations, skills, certifications, languages } = data;
  const isClassic = templateId === "classic";

  const fontStyle = {
    fontFamily: isClassic ? "Times-Roman" : "Helvetica",
  };

  const boldFont = isClassic ? "Times-Bold" : "Helvetica-Bold";
  const italicFont = isClassic ? "Times-Italic" : "Helvetica-Oblique";

  // Accent Colors:
  // Classic: Slate-900 / Neutral Black
  // Modern: Blue-900 (#1e3a8a) / Royal Blue
  const nameColor = isClassic ? "#18181b" : "#1e3a8a";
  const titleColor = isClassic ? "#52525b" : "#2563eb";
  const accentTitleColor = isClassic ? "#18181b" : "#1e3a8a";
  const linkColor = isClassic ? "#3f3f46" : "#1d4ed8";

  // Build contact items array
  const contactItems = [
    personalInfo.email ? personalInfo.email : null,
    personalInfo.phone ? personalInfo.phone : null,
    personalInfo.location ? personalInfo.location : null,
    personalInfo.linkedin ? personalInfo.linkedin.replace(/^https?:\/\/(www\.)?/, "") : null,
    personalInfo.portfolio ? personalInfo.portfolio.replace(/^https?:\/\/(www\.)?/, "") : null,
  ].filter(Boolean);

  return (
    <Document title={`CV_${personalInfo.fullName.replace(/\s+/g, "_")}`} author={personalInfo.fullName}>
      <Page size="A4" style={[styles.page, fontStyle]}>
        
        {/* HEADER */}
        <View style={[styles.header, isClassic ? styles.headerCenter : styles.headerLeft]}>
          <Text style={[styles.fullName, { fontFamily: boldFont, color: nameColor }]}>
            {personalInfo.fullName ? personalInfo.fullName.toUpperCase() : "NAMA LENGKAP"}
          </Text>
          <Text style={[styles.title, { fontFamily: boldFont, color: titleColor }]}>
            {personalInfo.title ? personalInfo.title.toUpperCase() : "PROFESI / JABATAN"}
          </Text>
          
          {/* Render contacts in a single wrapped paragraph block to prevent layout bugs */}
          <Text style={[styles.contactRow, { textAlign: "center" }]}>
            {contactItems.map((item, idx) => {
              const isLink = item === personalInfo.linkedin?.replace(/^https?:\/\/(www\.)?/, "") || 
                             item === personalInfo.portfolio?.replace(/^https?:\/\/(www\.)?/, "");
              
              return (
                <React.Fragment key={idx}>
                  {idx > 0 && <Text style={styles.dividerText}>  •  </Text>}
                  <Text style={isLink ? { fontFamily: boldFont, color: linkColor } : {}}>
                    {item}
                  </Text>
                </React.Fragment>
              );
            })}
          </Text>
        </View>

        {/* RINGKASAN PROFIL */}
        {summary && (
          <View style={styles.section}>
            <Text style={[
              isClassic ? styles.sectionTitleClassic : styles.sectionTitleModern, 
              { fontFamily: boldFont, color: accentTitleColor }
            ]}>
              RINGKASAN PROFIL
            </Text>
            <Text style={styles.summaryText}>{summary}</Text>
          </View>
        )}

        {/* PENGALAMAN KERJA */}
        {experiences && experiences.length > 0 && experiences.some(e => e.company || e.position) && (
          <View style={styles.section}>
            <Text style={[
              isClassic ? styles.sectionTitleClassic : styles.sectionTitleModern, 
              { fontFamily: boldFont, color: accentTitleColor }
            ]}>
              PENGALAMAN KERJA
            </Text>
            {experiences.map((exp, index) => {
              if (!exp.company && !exp.position) return null;
              return (
                <View key={index} style={styles.entry} wrap={false}>
                  <View style={styles.entryHeader}>
                    <Text style={[styles.entryTitle, { fontFamily: boldFont }]}>{exp.position || "Posisi / Jabatan"}</Text>
                    <Text style={[styles.entryDate, { fontFamily: boldFont }]}>
                      {exp.startDate || "Mulai"} – {exp.current ? "Sekarang" : (exp.endDate || "Selesai")}
                    </Text>
                  </View>
                  <View style={styles.entrySubHeader}>
                    <Text style={[styles.entrySubtitle, isClassic ? { fontFamily: italicFont } : { fontFamily: boldFont, color: "#52525b" }]}>
                      {exp.company || "Perusahaan"}
                    </Text>
                    <Text style={styles.entryLocation}>{exp.location || "Lokasi"}</Text>
                  </View>
                  {exp.description && (
                    <View style={styles.bulletList}>
                      {exp.description.split("\n").filter(Boolean).map((bullet, idx) => (
                        <View key={idx} style={styles.bulletItem}>
                          <Text style={styles.bulletPoint}>•</Text>
                          <Text style={styles.bulletContent}>{bullet}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        )}

        {/* PENDIDIKAN */}
        {educations && educations.length > 0 && educations.some(e => e.institution || e.degree) && (
          <View style={styles.section}>
            <Text style={[
              isClassic ? styles.sectionTitleClassic : styles.sectionTitleModern, 
              { fontFamily: boldFont, color: accentTitleColor }
            ]}>
              PENDIDIKAN
            </Text>
            {educations.map((edu, index) => {
              if (!edu.institution && !edu.degree) return null;
              return (
                <View key={index} style={styles.entry} wrap={false}>
                  <View style={styles.entryHeader}>
                    <Text style={[styles.entryTitle, { fontFamily: boldFont }]}>
                      {edu.degree || "Jenjang"}{edu.major ? ` - ${edu.major}` : ""}
                    </Text>
                    <Text style={[styles.entryDate, { fontFamily: boldFont }]}>{edu.graduationDate || "Tahun Lulus"}</Text>
                  </View>
                  <View style={styles.entrySubHeader}>
                    <Text style={[styles.entrySubtitle, isClassic ? { fontFamily: italicFont } : { fontFamily: boldFont, color: "#52525b" }]}>
                      {edu.institution || "Institusi"}
                    </Text>
                  </View>
                  {edu.description && (
                    <Text style={[styles.normalValue, { marginTop: 4, fontSize: 9, color: "#3f3f46" }]}>{edu.description}</Text>
                  )}
                </View>
              );
            })}
          </View>
        )}

        {/* KEAHLIAN */}
        {skills && ((skills.hardSkills && skills.hardSkills.length > 0) || (skills.softSkills && skills.softSkills.length > 0)) && (
          <View style={styles.section} wrap={false}>
            <Text style={[
              isClassic ? styles.sectionTitleClassic : styles.sectionTitleModern, 
              { fontFamily: boldFont, color: accentTitleColor }
            ]}>
              KEAHLIAN (SKILLS)
            </Text>
            {skills.hardSkills && skills.hardSkills.length > 0 && (
              <Text style={styles.skillsText}>
                <Text style={[styles.boldLabel, { fontFamily: boldFont }]}>Hard Skills: </Text>
                <Text style={styles.normalValue}>{skills.hardSkills.join(", ")}</Text>
              </Text>
            )}
            {skills.softSkills && skills.softSkills.length > 0 && (
              <Text style={styles.skillsText}>
                <Text style={[styles.boldLabel, { fontFamily: boldFont }]}>Soft Skills: </Text>
                <Text style={styles.normalValue}>{skills.softSkills.join(", ")}</Text>
              </Text>
            )}
          </View>
        )}

        {/* SERTIFIKASI & PENGHARGAAN */}
        {certifications && certifications.length > 0 && certifications.some(c => c.title) && (
          <View style={styles.section} wrap={false}>
            <Text style={[
              isClassic ? styles.sectionTitleClassic : styles.sectionTitleModern, 
              { fontFamily: boldFont, color: accentTitleColor }
            ]}>
              SERTIFIKASI & PENGHARGAAN
            </Text>
            {certifications.map((cert, index) => {
              if (!cert.title) return null;
              return (
                <View key={index} style={styles.certItem}>
                  <Text style={styles.bulletPoint}>•</Text>
                  <Text style={styles.normalValue}>
                    <Text style={{ fontFamily: boldFont, color: "#09090b" }}>{cert.title}</Text> – {cert.issuer} ({cert.date})
                  </Text>
                </View>
              );
            })}
          </View>
        )}

        {/* BAHASA */}
        {languages && languages.length > 0 && languages.some(l => l.name) && (
          <View style={styles.section} wrap={false}>
            <Text style={[
              isClassic ? styles.sectionTitleClassic : styles.sectionTitleModern, 
              { fontFamily: boldFont, color: accentTitleColor }
            ]}>
              BAHASA
            </Text>
            <View style={styles.langRow}>
              {languages.map((lang, index) => {
                if (!lang.name) return null;
                return (
                  <View key={index} style={styles.langItem}>
                    <Text style={[styles.boldLabel, { fontFamily: boldFont }]}>{lang.name}: </Text>
                    <Text style={styles.normalValue}>{lang.proficiency}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}

      </Page>
    </Document>
  );
}
