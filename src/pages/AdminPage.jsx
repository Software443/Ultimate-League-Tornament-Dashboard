import React, { useState } from "react";
import { ShieldCheck, Users, Calendar, Award } from "lucide-react";
import { C } from "../theme";
import { SectionHeading } from "../components/atoms";
import { TeamsAdmin } from "../components/admin/TeamsAdmin";
import { PlayersAdmin } from "../components/admin/PlayersAdmin";
import { FixturesAdmin } from "../components/admin/FixturesAdmin";
import { ResultsAdmin } from "../components/admin/ResultsAdmin";

const SECTIONS = [
  { id: "teams", label: "Teams", icon: ShieldCheck },
  { id: "players", label: "Players", icon: Users },
  { id: "fixtures", label: "Fixtures", icon: Calendar },
  { id: "results", label: "Results & events", icon: Award },
];

export default function AdminPage() {
  const [section, setSection] = useState("teams");

  return (
    <div>
      <SectionHeading eyebrow="Control panel" title="Admin dashboard" />
      <div style={{ display: "flex", gap: 8, marginBottom: 22, flexWrap: "wrap" }}>
        {SECTIONS.map((s) => {
          const Icon = s.icon;
          const active = section === s.id;
          return (
            <button
              key={s.id}
              onClick={() => setSection(s.id)}
              style={{
                display: "flex", alignItems: "center", gap: 7, padding: "9px 15px", borderRadius: 7,
                border: `1px solid ${active ? C.accent : C.border}`, background: active ? C.accentSoft : C.surface,
                color: active ? "#F0879A" : C.textMuted, cursor: "pointer", fontSize: 13,
              }}
            >
              <Icon size={14} /> {s.label}
            </button>
          );
        })}
      </div>

      {section === "teams" && <TeamsAdmin />}
      {section === "players" && <PlayersAdmin />}
      {section === "fixtures" && <FixturesAdmin />}
      {section === "results" && <ResultsAdmin />}
    </div>
  );
}
