import React, { useState, useEffect } from "react";
import { Save, Plus, X, Target } from "lucide-react";
import { C } from "../../theme";
import { TeamTag, CardEventIcon, EmptyState } from "../atoms";
import { AdminPanel, FieldLabel, inputStyle, PrimaryButton, IconButton } from "../adminAtoms";
import { useLeagueData } from "../../context/DataContext";

export function ResultsAdmin() {
  const { teams, players, fixtures, saveResult, addEvent, removeEvent } = useLeagueData();
  const [fixtureId, setFixtureId] = useState(fixtures[0]?.id || "");
  const fixture = fixtures.find((f) => f.id === fixtureId);

  const [homeScore, setHomeScore] = useState(fixture?.homeScore ?? 0);
  const [awayScore, setAwayScore] = useState(fixture?.awayScore ?? 0);
  const [evPlayer, setEvPlayer] = useState("");
  const [evType, setEvType] = useState("goal");
  const [evMinute, setEvMinute] = useState("");
  const [busy, setBusy] = useState(false);

  // keep fixtureId valid if fixtures list changes (e.g. after delete)
  useEffect(() => {
    if (!fixtures.find((f) => f.id === fixtureId) && fixtures.length > 0) {
      setFixtureId(fixtures[0].id);
    }
  }, [fixtures, fixtureId]);

  const selectFixture = (id) => {
    setFixtureId(id);
    const f = fixtures.find((x) => x.id === id);
    setHomeScore(f?.homeScore ?? 0);
    setAwayScore(f?.awayScore ?? 0);
  };

  const doSaveScore = async () => {
    setBusy(true);
    await saveResult(fixtureId, { homeScore: Number(homeScore), awayScore: Number(awayScore) });
    setBusy(false);
  };

  const doAddEvent = async () => {
    if (!evPlayer || !evMinute) return;
    setBusy(true);
    await addEvent(fixtureId, { playerId: evPlayer, type: evType, minute: Number(evMinute) });
    setBusy(false);
    setEvMinute("");
  };

  if (!fixture) return <EmptyState text="Add a fixture first, then record its result here." />;

  const home = teams.find((t) => t.id === fixture.homeTeamId);
  const away = teams.find((t) => t.id === fixture.awayTeamId);
  const rosterFor = (teamId) => players.filter((p) => p.teamId === teamId);

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <AdminPanel>
        <FieldLabel>Fixture</FieldLabel>
        <select style={inputStyle} value={fixtureId} onChange={(e) => selectFixture(e.target.value)}>
          {fixtures.slice().sort((a, b) => b.date.localeCompare(a.date)).map((f) => {
            const h = teams.find((t) => t.id === f.homeTeamId), a = teams.find((t) => t.id === f.awayTeamId);
            return <option key={f.id} value={f.id}>{f.year} · {f.date} · {h?.name} vs {a?.name}</option>;
          })}
        </select>
      </AdminPanel>

      <AdminPanel>
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr auto", gap: 12, alignItems: "end" }}>
          <div><FieldLabel>{home?.name} score</FieldLabel><input type="number" min="0" style={inputStyle} value={homeScore} onChange={(e) => setHomeScore(e.target.value)} /></div>
          <div style={{ paddingBottom: 8, color: C.textFaint, fontFamily: "'JetBrains Mono', monospace" }}>–</div>
          <div><FieldLabel>{away?.name} score</FieldLabel><input type="number" min="0" style={inputStyle} value={awayScore} onChange={(e) => setAwayScore(e.target.value)} /></div>
          <PrimaryButton onClick={doSaveScore} disabled={busy}><Save size={14} /> {busy ? "Saving…" : "Save result"}</PrimaryButton>
        </div>
      </AdminPanel>

      <AdminPanel>
        <FieldLabel>Record a match event (goal or card)</FieldLabel>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr auto", gap: 12, marginTop: 4 }}>
          <select style={inputStyle} value={evPlayer} onChange={(e) => setEvPlayer(e.target.value)}>
            <option value="">Select player…</option>
            <optgroup label={home?.name}>
              {rosterFor(fixture.homeTeamId).map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </optgroup>
            <optgroup label={away?.name}>
              {rosterFor(fixture.awayTeamId).map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </optgroup>
          </select>
          <select style={inputStyle} value={evType} onChange={(e) => setEvType(e.target.value)}>
            <option value="goal">Goal</option>
            <option value="yellow">Yellow card</option>
            <option value="red">Red card</option>
          </select>
          <input type="number" min="0" max="120" placeholder="Min" style={inputStyle} value={evMinute} onChange={(e) => setEvMinute(e.target.value)} />
          <PrimaryButton onClick={doAddEvent} disabled={busy}><Plus size={14} /> Add</PrimaryButton>
        </div>
      </AdminPanel>

      <div style={{ display: "grid", gap: 6 }}>
        {fixture.events.slice().sort((a, b) => a.minute - b.minute).map((e) => {
          const p = players.find((pl) => pl.id === e.playerId);
          const t = teams.find((tm) => tm.id === p?.teamId);
          return (
            <div key={e.id} style={{ display: "flex", alignItems: "center", gap: 10, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 12px", fontSize: 13 }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", color: C.textFaint, minWidth: 34 }}>{e.minute}'</span>
              {e.type === "goal" ? <Target size={14} color={C.accent} /> : <CardEventIcon type={e.type} />}
              <span style={{ flex: 1 }}>{p?.name}</span>
              <TeamTag team={t} />
              <IconButton danger onClick={() => removeEvent(fixtureId, e.id)}><X size={13} /></IconButton>
            </div>
          );
        })}
        {fixture.events.length === 0 && <EmptyState text="No goals or cards recorded for this fixture yet." />}
      </div>
    </div>
  );
}
