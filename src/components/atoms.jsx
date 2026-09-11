import React from "react";
import { C, FONT_MONO, FONT_BODY } from "../theme";

export function Pill({ children, tone = "muted" }) {
  const tones = {
    muted: { bg: C.surfaceAlt, color: C.textMuted },
    live: { bg: C.accentSoft, color: "#F0879A" },
    done: { bg: C.turfSoft, color: "#7FCB9F" },
    gold: { bg: C.goldSoft, color: "#EBC670" },
  };
  const s = tones[tone];
  return (
    <span
      style={{
        background: s.bg, color: s.color, fontFamily: FONT_MONO,
        fontSize: 11, letterSpacing: 1, padding: "3px 8px", borderRadius: 3,
        textTransform: "uppercase", whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
}

export function TeamTag({ team }) {
  if (!team) return null;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
      <span style={{ width: 8, height: 8, borderRadius: 2, background: team.color, display: "inline-block" }} />
      <span style={{ fontSize: 13, color: C.textMuted, fontFamily: FONT_BODY }}>{team.short}</span>
    </span>
  );
}

export function CardEventIcon({ type }) {
  const colors = { yellow: "#D9A63C", red: "#C6183B" };
  return (
    <span
      title={type}
      style={{
        display: "inline-block", width: 9, height: 12, borderRadius: 1,
        background: colors[type], marginRight: 4, verticalAlign: "middle",
      }}
    />
  );
}

export function SectionHeading({ eyebrow, title, action }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 18, flexWrap: "wrap", gap: 12 }}>
      <div>
        <div style={{ fontFamily: FONT_MONO, fontSize: 11, letterSpacing: 2, color: C.accent, textTransform: "uppercase", marginBottom: 4 }}>
          {eyebrow}
        </div>
        <h2 style={{ fontFamily: "'Anton', sans-serif", fontWeight: 400, fontSize: 30, color: C.text, margin: 0, letterSpacing: 0.5 }}>
          {title}
        </h2>
      </div>
      {action}
    </div>
  );
}

export function EmptyState({ text }) {
  return (
    <div style={{ border: `1px dashed ${C.border}`, borderRadius: 10, padding: "40px 20px", textAlign: "center", color: C.textFaint, fontSize: 14 }}>
      {text}
    </div>
  );
}

export function YearDial({ years, value, onChange }) {
  return (
    <div style={{ display: "inline-flex", background: C.surfaceAlt, border: `1px solid ${C.border}`, borderRadius: 8, padding: 3, gap: 2 }}>
      {years.map((y) => (
        <button
          key={y}
          onClick={() => onChange(y)}
          style={{
            fontFamily: FONT_MONO, fontSize: 13, padding: "7px 16px", borderRadius: 6, border: "none",
            cursor: "pointer", background: value === y ? C.accent : "transparent",
            color: value === y ? "#fff" : C.textMuted, transition: "all .15s",
          }}
        >
          {y}
        </button>
      ))}
    </div>
  );
}
