import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Gem, LogIn } from "lucide-react";
import { C, FONT_DISPLAY, FONT_MONO, FacetClip } from "../theme";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const from = location.state?.from?.pathname || "/admin";

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const ok = await login(email, password);
    setSubmitting(false);
    if (ok) navigate(from, { replace: true });
  };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <form
        onSubmit={onSubmit}
        style={{ width: "100%", maxWidth: 380, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: "32px 30px" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 26 }}>
          <div style={{ width: 38, height: 38, background: C.accent, ...FacetClip, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Gem size={18} color="#fff" />
          </div>
          <div>
            <div style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 3, color: C.textFaint, textTransform: "uppercase" }}>Redspinel presents</div>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: 22, color: C.text, letterSpacing: 1 }}>ULTIMATE ADMIN</div>
          </div>
        </div>

        <label style={{ fontSize: 11.5, color: C.textFaint, fontFamily: FONT_MONO, textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 5 }}>
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoFocus
          style={{ width: "100%", background: C.surfaceAlt, border: `1px solid ${C.border}`, borderRadius: 6, padding: "10px 12px", color: C.text, fontSize: 14, outline: "none", marginBottom: 16 }}
        />

        <label style={{ fontSize: 11.5, color: C.textFaint, fontFamily: FONT_MONO, textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 5 }}>
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", background: C.surfaceAlt, border: `1px solid ${C.border}`, borderRadius: 6, padding: "10px 12px", color: C.text, fontSize: 14, outline: "none", marginBottom: 18 }}
        />

        {error && <div style={{ color: "#F0879A", fontSize: 12.5, marginBottom: 14 }}>{error}</div>}

        <button
          type="submit"
          disabled={submitting}
          style={{
            width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            background: C.accent, color: "#fff", border: "none", borderRadius: 7, padding: "11px 16px",
            fontSize: 14, fontWeight: 600, cursor: submitting ? "default" : "pointer", opacity: submitting ? 0.7 : 1,
          }}
        >
          <LogIn size={16} /> {submitting ? "Signing in…" : "Sign in"}
        </button>

        <div style={{ marginTop: 16, fontSize: 11.5, color: C.textFaint, lineHeight: 1.5 }}>
          No account yet? Create an admin user in your Supabase project under Authentication → Users, then sign in here with that email and password.
        </div>
      </form>
    </div>
  );
}
