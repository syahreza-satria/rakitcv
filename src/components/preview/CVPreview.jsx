"use client";

import React, { useEffect, useRef, useState } from "react";
import { useCV } from "../../lib/store";
import { getTheme, ptToPx } from "../../lib/cvTokens";
import { getSections, getContactItems } from "../../lib/cvContent";

// Preview HTML yang mengikuti token yang sama dengan PDF (CV_DESIGN_SYSTEM.md).
// Memakai inline style + ptToPx, bukan kelas Tailwind, agar skalanya sama dengan PDF.
// Spasi vertikal selalu `marginTop` elemen berikutnya.
const A4_WIDTH_PX = (21 / 2.54) * 96; // 21cm

export default function CVPreview() {
  const { cvData, templateId } = useCV();
  const t = getTheme(templateId);
  const { personalInfo } = cvData;
  const contact = getContactItems(personalInfo, t.id);
  const sections = getSections(cvData, t.id);
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

  const gap = (i, value) => (i > 0 ? { marginTop: px(value) } : undefined);
  const bold = { fontWeight: "bold" };
  const p0 = { margin: 0 };

  const renderBlock = (block) => {
    switch (block.type) {
      case "paragraph":
        return <p style={p0}>{block.text}</p>;
      case "entries":
        return block.entries.map((entry, i) => {
          const body = [
            ...entry.details.map((d) => ({ kind: "detail", ...d })),
            ...entry.paragraphs.map((text) => ({ kind: "paragraph", text })),
            ...entry.bullets.map((text) => ({ kind: "bullet", text })),
          ];
          return (
            <div key={i} style={gap(i, t.entry.gap)}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ flex: 1, fontWeight: t.font.entryTitleWeight, fontSize: px(t.size.entryTitle) }}>
                  {entry.title}
                </span>
                {entry.date && (
                  <span
                    style={{
                      minWidth: px(t.entry.dateMinWidth),
                      marginLeft: px(t.entry.titleDateGap),
                      textAlign: "right",
                      fontSize: px(t.size.date),
                      color: t.color.muted,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {entry.date}
                  </span>
                )}
              </div>
              {entry.meta && (
                <div
                  style={{
                    marginTop: px(t.entry.titleToMeta),
                    fontSize: px(t.size.meta),
                    color: t.color.muted,
                    fontStyle: t.font.metaItalic ? "italic" : "normal",
                  }}
                >
                  {entry.meta}
                </div>
              )}
              {body.map((item, j) => {
                const style = { marginTop: px(j === 0 ? t.entry.metaToBody : t.bullet.gap) };
                if (item.kind === "bullet") {
                  return (
                    <div key={j} style={{ ...style, display: "flex" }}>
                      <span style={{ width: px(t.bullet.indent), paddingLeft: px(t.bullet.hanging), flexShrink: 0, boxSizing: "border-box" }}>
                        •
                      </span>
                      <span style={{ flex: 1 }}>{item.text}</span>
                    </div>
                  );
                }
                if (item.kind === "detail") {
                  return (
                    <div key={j} style={style}>
                      <span style={bold}>{item.label}: </span>
                      {item.value}
                    </div>
                  );
                }
                return (
                  <div key={j} style={style}>
                    {item.text}
                  </div>
                );
              })}
            </div>
          );
        });
      case "skills":
        return block.lines.map((line, i) => (
          <p key={i} style={{ ...p0, ...gap(i, t.bullet.gap) }}>
            <span style={bold}>{line.label}: </span>
            {line.text}
          </p>
        ));
      case "lines":
        return block.lines.map((line, i) => (
          <p key={i} style={{ ...p0, ...gap(i, t.bullet.gap) }}>
            {line}
          </p>
        ));
      case "citations":
        return block.items.map((segments, i) => (
          <p
            key={i}
            style={{
              ...p0,
              ...gap(i, t.citation.gap),
              fontSize: px(t.citation.size),
              paddingLeft: px(t.citation.hangingIndent),
              textIndent: `-${px(t.citation.hangingIndent)}`,
            }}
          >
            {segments.map((seg, j) => (
              <span key={j} style={seg.bold ? bold : undefined}>
                {seg.text}
              </span>
            ))}
          </p>
        ));
      case "references":
        return block.items.map((lines, i) => (
          <div key={i} style={gap(i, t.citation?.gap ?? t.entry.gap)}>
            {lines.map((line, j) => (
              <div key={j} style={j === 0 ? bold : undefined}>
                {line}
              </div>
            ))}
          </div>
        ));
      default:
        return null;
    }
  };

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
            paddingTop: px(t.page.top),
            paddingBottom: px(t.page.bottom),
            paddingLeft: px(t.page.left),
            paddingRight: px(t.page.right),
            fontFamily: t.font.css,
            fontSize: px(t.size.body),
            lineHeight: t.leading.body,
            color: t.color.text,
          }}
        >
          {/* HEADER */}
          <header style={{ textAlign: t.header.align }}>
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
            <p style={{ ...p0, marginTop: px(t.header.nameToTitle), fontSize: px(t.size.title), lineHeight: t.leading.heading }}>
              {personalInfo.title || "Profesi / Jabatan"}
            </p>
            {contact.length > 0 && (
              <p style={{ ...p0, marginTop: px(t.header.titleToContact), fontSize: px(t.size.contact), color: t.color.muted }}>
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
            {t.header.rule && (
              <div style={{ marginTop: px(t.header.titleToContact), borderBottom: `${t.header.ruleWidth}pt solid ${t.color.rule}` }} />
            )}
          </header>

          {sections.map((section, i) => (
            <section key={section.id} style={{ marginTop: px(i === 0 ? t.header.bottom : t.section.gap) }}>
              <h2
                style={{
                  margin: 0,
                  paddingBottom: px(t.section.titleToRule),
                  fontSize: px(t.size.section),
                  lineHeight: t.leading.heading,
                  fontWeight: "bold",
                  letterSpacing: `${t.tracking.section}pt`,
                  color: t.color.accent,
                  borderBottom: `${t.section.ruleWidth}pt solid ${t.color.rule}`,
                }}
              >
                {section.title}
              </h2>
              <div style={{ marginTop: px(t.section.ruleToContent) }}>{renderBlock(section.block)}</div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
