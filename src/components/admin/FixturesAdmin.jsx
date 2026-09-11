import React, { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { C } from "../../theme";
import { Pill } from "../atoms";
import { AdminPanel, FieldLabel, inputStyle, PrimaryButton, IconButton } from "../adminAtoms";
import { useLeagueData } from "../../context/DataContext";

export function FixturesAdmin() {
  const { teams, fixtures, addFixture, removeFixture } = useLeagueData();
  const [year, setYear] = useState(new Date().getFullYear());
  const [round, setRound] = useState("");
  const [date, setDate] = useState("");
  const [venue, setVenue] = useState("");
  const [homeTeamId, setHomeTeamId] = useState(teams[0]?.id || "");
  const [awayTeamId, setAwayTeamId] = useState(teams[1]?.id || "");
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState("");

  const submit = async () => {
    if (!round.trim() || !date || !venue.trim() || homeTeamId === awayTeamId) return;
    setBusy(true);
    setFormError("");
    const res = await addFixture({ year: Number(year), round: round.trim(), date, venue: venue.trim(), homeTeamId, awayTeamId });
    setBusy(false);
    if (res.ok) { setRound(""); setDate(""); setVenue(""); } else setFormError(res.error);
  };

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <AdminPanel>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 12 }}>
          <div><FieldLabel>Year</FieldLabel><input type="number" style={inputStyle} value={year} onChange={(e) => setYear(e.target.value)} /></div>
          <div><FieldLabel>Round / matchday</FieldLabel><input style={inputStyle} value={round} onChange={(e) => setRound(e.target.value)} placeholder="Matchday 5" /></div>
          <div><FieldLabel>Date</FieldLabel><input type="date" style={inputStyle} value={date} onChange={(e) => setDate(e.target.value)} /></div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 12 }}>
          <div>
            <FieldLabel>Home team</FieldLabel>
            <select style={inputStyle} value={homeTeamId} onChange={(e) => setHomeTeamId(e.target.value)}>
              {teams.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div>
            <FieldLabel>Away team</FieldLabel>
            <select style={inputStyle} value={awayTeamId} onChange={(e) => setAwayTeamId(e.target.value)}>
              {teams.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div><FieldLabel>Venue</FieldLabel><input style={inputStyle} value={venue} onChange={(e) => setVenue(e.target.value)} placeholder="Stadium, city" /></div>
        </div>
        <PrimaryButton onClick={submit} disabled={busy}><Plus size={15} /> {busy ? "Scheduling…" : "Schedule fixture"}</PrimaryButton>
        {formError && <div style={{ color: "#F0879A", fontSize: 12.5, marginTop: 10 }}>{formError}</div>}
      </AdminPanel>

      <div style={{ display: "grid", gap: 8 }}>
        {fixtures.slice().sort((a, b) => b.date.localeCompare(a.date)).map((f) => {
          const h = teams.find((t) => t.id === f.homeTeamId), a = teams.find((t) => t.id === f.awayTeamId);
          return (
            <div key={f.id} style={{ display: "flex", alignItems: "center", gap: 14, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 14px" }}>
              <Pill>{f.year}</Pill>
              <span style={{ fontSize: 12.5, color: C.textFaint, fontFamily: "'JetBrains Mono', monospace", minWidth: 90 }}>{f.date}</span>
              <span style={{ flex: 1, fontSize: 13.5 }}>{h?.name} <span style={{ color: C.textFaint }}>vs</span> {a?.name}</span>
              <Pill tone={f.status === "completed" ? "done" : "muted"}>{f.status}</Pill>
              <IconButton danger onClick={() => removeFixture(f.id)}><Trash2 size={13} /></IconButton>
            </div>
          );
        })}
      </div>
    </div>
  );
}
