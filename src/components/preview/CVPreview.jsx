"use client";

import React, { useEffect, useRef, useState } from "react";
import { useCV } from "../../lib/store";
import { getTheme, ptToPx } from "../../lib/cvTokens";
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

// Preview HTML yang mengikuti token yang sama dengan PDF (CV_DESIGN_SYSTEM.md).
// Memakai inline style + ptToPx, bukan kelas Tailwind, agar skalanya sama dengan PDF.
const A4_WIDTH_PX = (21 / 2.54) * 96; // 21cm

export default function CVPreview() {
  const { cvData, templateId } = useCV();
  const t = getTheme(templateId);
  const { personalInfo, summary, experiences, educations, skills, certifications, languages } = cvData;
  const show = getVisibleSections(cvData);
  const contact = getContactItems(personalInfo);
  const px = ptToPx;

  // Kertas A4 selalu 21cm; di kolom yang lebih sempit, seluruh halaman diperkecil agar muat (tanpa scroll horizontal)
  const containerRef = useRef(null);
  const [zoom, setZoom] = useState(1);
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      const available = entry.contentRect.width;
      setZoom(Math.min(1, available / A4_WIDTH_PX));
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const section = { marginTop: px(t.space.lg) };
  const entry = { marginBottom: px(t.space.md) };
  const entryRow = { display: "flex", justifyContent: "space-between" };
  const bold = { fontWeight: "bold" };
  const date = {
    fontSize: px(t.size.meta),
    color: t.color.muted,
    marginLeft: px(t.space.md),
    whiteSpace: "nowrap",
  };
  const meta = {
    fontSize: px(t.size.meta),
    color: t.color.muted,
    marginTop: px(t.space.xs),
    fontStyle: t.metaItalic ? "italic" : "normal",
  };

  const renderTitle = (children) => (
    <h2
      style={{
        margin: 0,
        marginBottom: px(t.space.sectionGap),
        paddingBottom: px(t.space.xs),
        fontSize: px(t.size.section),
        lineHeight: t.leading.heading,
        fontWeight: "bold",
        letterSpacing: `${t.sectionLetterSpacing}pt`,
        color: t.color.accent,
        borderBottom: `${t.rule}pt solid ${t.color.rule}`,
      }}
    >
      {children}
    </h2>
  );

  return (
    <div className="w-full overflow-y-auto overflow-x-hidden max-h-[calc(100vh-140px)] p-4 bg-zinc-100 rounded-xl">
      <div ref={containerRef} className="w-full">
      <div
        id="cv-preview-a4"
        className="mx-auto bg-white shadow-xl border border-zinc-200"
        style={{
          boxSizing: "border-box",
          width: "21cm",
          zoom,
          minHeight: "29.7cm",
          padding: `${t.page.marginCm}cm`,
          fontFamily: t.font.css,
          fontSize: px(t.size.body),
          lineHeight: t.leading.body,
          color: t.color.text,
        }}
      >
        {/* HEADER */}
        <header style={{ textAlign: t.headerAlign }}>
          <h1
            style={{
              margin: 0,
              fontSize: px(t.size.name),
              lineHeight: t.leading.heading,
              fontWeight: "bold",
              color: t.color.accent,
            }}
          >
            {(personalInfo.fullName || "NAMA LENGKAP").toUpperCase()}
          </h1>
          <p style={{ margin: 0, marginTop: px(t.space.xs), fontSize: px(t.size.title), lineHeight: t.leading.heading }}>
            {personalInfo.title || "Profesi / Jabatan"}
          </p>
          {contact.length > 0 && (
            <p style={{ margin: 0, marginTop: px(t.space.sm), fontSize: px(t.size.contact), color: t.color.muted }}>
              {contact.map((item, i) => (
                <React.Fragment key={i}>
                  {i > 0 ? " | " : ""}
                  {item.href ? (
                    <a href={item.href} style={{ color: "inherit", textDecoration: "none" }}>
                      {item.text}
                    </a>
                  ) : (
                    item.text
                  )}
                </React.Fragment>
              ))}
            </p>
          )}
        </header>

        {show.summary && (
          <section style={section}>
            {renderTitle(SECTION_TITLES.summary)}
            <p style={{ margin: 0 }}>{summary}</p>
          </section>
        )}

        {show.experience && (
          <section style={section}>
            {renderTitle(SECTION_TITLES.experience)}
            {experiences.filter(hasExperience).map((exp, i) => (
              <div key={i} style={entry}>
                <div style={entryRow}>
                  <span style={{ ...bold, fontSize: px(t.size.entryTitle) }}>{exp.position}</span>
                  <span style={date}>{formatDateRange(exp.startDate, exp.endDate, exp.current)}</span>
                </div>
                <div style={meta}>{joinParts(exp.company, exp.location)}</div>
                {splitBullets(exp.description).map((bullet, j) => (
                  <div key={j} style={{ display: "flex", marginTop: px(t.space.sm) }}>
                    <span style={{ width: px(t.bulletIndent), flexShrink: 0 }}>•</span>
                    <span style={{ flex: 1 }}>{bullet}</span>
                  </div>
                ))}
              </div>
            ))}
          </section>
        )}

        {show.education && (
          <section style={section}>
            {renderTitle(SECTION_TITLES.education)}
            {educations.filter(hasEducation).map((edu, i) => (
              <div key={i} style={entry}>
                <div style={entryRow}>
                  <span style={{ ...bold, fontSize: px(t.size.entryTitle) }}>{educationTitle(edu)}</span>
                  <span style={date}>{formatMonthYear(edu.graduationDate)}</span>
                </div>
                <div style={meta}>{edu.institution}</div>
                {edu.description && <p style={{ margin: 0, marginTop: px(t.space.sm) }}>{edu.description}</p>}
              </div>
            ))}
          </section>
        )}

        {show.skills && (
          <section style={section}>
            {renderTitle(SECTION_TITLES.skills)}
            {skills.hardSkills?.length > 0 && (
              <p style={{ margin: 0 }}>
                <span style={bold}>Hard skill: </span>
                {skills.hardSkills.join(", ")}
              </p>
            )}
            {skills.softSkills?.length > 0 && (
              <p style={{ margin: 0, marginTop: px(t.space.xs) }}>
                <span style={bold}>Soft skill: </span>
                {skills.softSkills.join(", ")}
              </p>
            )}
          </section>
        )}

        {show.certifications && (
          <section style={section}>
            {renderTitle(SECTION_TITLES.certifications)}
            {certifications
              .filter((c) => c.title)
              .map((cert, i) => (
                <p key={i} style={{ margin: 0, marginTop: i > 0 ? px(t.space.xs) : 0 }}>
                  {certificationLine(cert)}
                </p>
              ))}
          </section>
        )}

        {show.languages && (
          <section style={section}>
            {renderTitle(SECTION_TITLES.languages)}
            <p style={{ margin: 0 }}>{languagesLine(languages)}</p>
          </section>
        )}
      </div>
      </div>
    </div>
  );
}
