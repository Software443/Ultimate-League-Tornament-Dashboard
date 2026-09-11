import React from "react";
import { C, FONT_MONO } from "../theme";

export function AdminPanel({ children }) {
  return <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: 20 }}>{children}</div>;
}

export function FieldLabel({ children }) {
  return (
    <label style={{ fontSize: 11.5, color: C.textFaint, fontFamily: FONT_MONO, textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 5 }}>
      {children}
    </label>
  );
}

export const inputStyle = {
  width: "100%", background: C.surfaceAlt, border: `1px solid ${C.border}`, borderRadius: 6,
  padding: "8px 10px", color: C.text, fontSize: 13.5, outline: "none",
};

export function PrimaryButton({ children, ...props }) {
  return (
    <button {...props} style={{ display: "flex", alignItems: "center", gap: 6, background: C.accent, color: "#fff", border: "none", borderRadius: 6, padding: "9px 16px", fontSize: 13, cursor: "pointer", fontWeight: 500, ...(props.style || {}) }}>
      {children}
    </button>
  );
}

export function IconButton({ children, danger, ...props }) {
  return (
    <button {...props} style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 30, height: 30, background: "transparent", border: `1px solid ${C.border}`, borderRadius: 6, color: danger ? C.accent : C.textMuted, cursor: "pointer" }}>
      {children}
    </button>
  );
}
