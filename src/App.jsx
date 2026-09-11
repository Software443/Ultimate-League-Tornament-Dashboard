import React, { useMemo, useState } from "react";
import { BrowserRouter, Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import { Calendar, Trophy, Target, LayoutDashboard, Gem, LogOut } from "lucide-react";
import { C, FONT_DISPLAY, FONT_MONO, FONT_BODY, FacetClip } from "./theme";
import { YearDial } from "./components/atoms";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { DataProvider, useLeagueData } from "./context/DataContext";
import { ProtectedRoute } from "./components/ProtectedRoute";

import FixturesPage from "./pages/FixturesPage";
import StandingsPage from "./pages/StandingsPage";
import ScorersPage from "./pages/ScorersPage";
import AdminPage from "./pages/AdminPage";
import Login from "./pages/Login";

const NAV = [
  { to: "/", label: "Fixtures", icon: Calendar },
  { to: "/standings", label: "Standings", icon: Trophy },
  { to: "/scorers", label: "Top scorers", icon: Target },
  { to: "/admin", label: "Admin", icon: LayoutDashboard },
];

function Shell() {
  const { fixtures } = useLeagueData();
  const { isAuthenticated, username, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const years = useMemo(() => [...new Set(fixtures.map((f) => f.year))].sort((a, b) => b - a), [fixtures]);
  const [year, setYear] = useState(() => years[0] || new Date().getFullYear());
  const effectiveYear = years.includes(year) ? year : (years[0] || year);

  const onLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: FONT_BODY, color: C.text }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; }
        ::selection { background: ${C.accentDim}; }
        input, select, textarea, button { font-family: ${FONT_BODY}; }
        a { text-decoration: none; }
      `}</style>

      <header style={{ borderBottom: `1px solid ${C.border}`, padding: "22px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 40, height: 40, background: C.accent, ...FacetClip, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Gem size={20} color="#fff" />
          </div>
          <div>
            <div style={{ fontFamily: FONT_MONO, fontSize: 10.5, letterSpacing: 3, color: C.textFaint, textTransform: "uppercase" }}>Redspinel presents</div>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: 26, letterSpacing: 1, lineHeight: 1, color: C.text }}>ULTIMATE</div>
          </div>
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <YearDial years={years.length ? years : [effectiveYear]} value={effectiveYear} onChange={setYear} />
          {isAuthenticated ? (
            <button onClick={onLogout} style={{ display: "flex", alignItems: "center", gap: 6, background: "transparent", border: `1px solid ${C.border}`, borderRadius: 7, padding: "8px 14px", color: C.textMuted, fontSize: 13, cursor: "pointer" }}>
              <LogOut size={14} /> Log out {username ? `(${username})` : ""}
            </button>
          ) : (
            <Link to="/login" style={{ fontSize: 13, color: C.textMuted, border: `1px solid ${C.border}`, borderRadius: 7, padding: "8px 14px" }}>
              Admin login
            </Link>
          )}
        </div>
      </header>

      <nav style={{ display: "flex", gap: 4, padding: "0 32px", borderBottom: `1px solid ${C.border}`, overflowX: "auto" }}>
        {NAV.map((t) => {
          const Icon = t.icon;
          const active = location.pathname === t.to;
          return (
            <Link
              key={t.to}
              to={t.to}
              style={{
                display: "flex", alignItems: "center", gap: 8, padding: "14px 18px",
                borderBottom: active ? `2px solid ${C.accent}` : "2px solid transparent",
                color: active ? C.text : C.textMuted, fontSize: 14, fontWeight: 500, whiteSpace: "nowrap",
              }}
            >
              <Icon size={16} /> {t.label}
            </Link>
          );
        })}
      </nav>

      <main style={{ padding: "28px 32px 60px", maxWidth: 1080, margin: "0 auto" }}>
        <Routes>
          <Route path="/" element={<FixturesPage year={effectiveYear} />} />
          <Route path="/standings" element={<StandingsPage year={effectiveYear} />} />
          <Route path="/scorers" element={<ScorersPage year={effectiveYear} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
        </Routes>
      </main>
    </div>
  );
}

function DataGate({ children }) {
  const { loading, loadError } = useLeagueData();
  if (loadError) {
    return (
      <div style={{ minHeight: "100vh", background: C.bg, color: C.text, display: "flex", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: FONT_BODY }}>
        <div style={{ maxWidth: 420, textAlign: "center" }}>
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: 24, marginBottom: 10 }}>Can't reach the API</div>
          <p style={{ color: C.textFaint, fontSize: 14, lineHeight: 1.6 }}>{loadError}</p>
          <p style={{ color: C.textFaint, fontSize: 13 }}>Make sure the backend is running: <code>cd server && npm run dev</code></p>
        </div>
      </div>
    );
  }
  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: C.bg, color: C.textFaint, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT_MONO }}>
        Loading league data…
      </div>
    );
  }
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DataProvider>
          <DataGate>
            <Shell />
          </DataGate>
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
