import React from "react";
import { MapPin, Target } from "lucide-react";
import { C, FONT_MONO, FONT_BODY, FacetClip } from "../theme";
import { Pill, CardEventIcon } from "./atoms";

export function FixtureCard({ fixture, teams, players }) {
  const home = teams.find((t) => t.id === fixture.homeTeamId);
  const away = teams.find((t) => t.id === fixture.awayTeamId);
  const isDone = fixture.status === "completed";

  const scorersFor = (teamId) =>
    fixture.events
      .filter((e) => e.type === "goal" && players.find((p) => p.id === e.playerId)?.teamId === teamId)
      .sort((a, b) => a.minute - b.minute);
  const cardsFor = (teamId) =>
    fixture.events
      .filter((e) => (e.type === "yellow" || e.type === "red") && players.find((p) => p.id === e.playerId)?.teamId === teamId)
      .sort((a, b) => a.minute - b.minute);

  const playerName = (id) => players.find((p) => p.id === id)?.name || "Unknown";

  return (
    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "18px 20px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, right: 0, width: 18, height: 18, background: C.bg, ...FacetClip, borderLeft: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div style={{ display: "flex", gap: 10, alignItems: "center", fontFamily: FONT_MONO, fontSize: 11, color: C.textFaint, textTransform: "uppercase", letterSpacing: 1 }}>
          <span>{fixture.round}</span>
          <span>·</span>
          <span>{fixture.date}</span>
        </div>
        <Pill tone={isDone ? "done" : "muted"}>{isDone ? "Full time" : "Scheduled"}</Pill>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", gap: 14 }}>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontFamily: FONT_BODY, fontSize: 16, color: C.text, fontWeight: 500 }}>{home?.name}</div>
        </div>
        <div style={{ fontFamily: FONT_MONO, fontSize: 26, color: C.text, letterSpacing: 2, fontVariantNumeric: "tabular-nums", background: C.surfaceAlt, padding: "6px 16px", borderRadius: 6, minWidth: 90, textAlign: "center" }}>
          {isDone ? `${fixture.homeScore} – ${fixture.awayScore}` : "vs"}
        </div>
        <div style={{ textAlign: "left" }}>
          <div style={{ fontFamily: FONT_BODY, fontSize: 16, color: C.text, fontWeight: 500 }}>{away?.name}</div>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 10, justifyContent: "center", color: C.textFaint, fontSize: 12, fontFamily: FONT_BODY }}>
        <MapPin size={13} /> {fixture.venue}
      </div>

      {isDone && fixture.events.length > 0 && (
        <div style={{ marginTop: 16, paddingTop: 14, borderTop: `1px solid ${C.borderSoft}`, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <div>
            {scorersFor(fixture.homeTeamId).map((e) => (
              <div key={e.id} style={{ fontSize: 12.5, color: C.textMuted, fontFamily: FONT_BODY, marginBottom: 3, textAlign: "right" }}>
                {playerName(e.playerId)} <span style={{ color: C.textFaint }}>{e.minute}'</span> <Target size={11} style={{ verticalAlign: -1, marginLeft: 2 }} />
              </div>
            ))}
            {cardsFor(fixture.homeTeamId).map((e) => (
              <div key={e.id} style={{ fontSize: 12.5, color: C.textFaint, fontFamily: FONT_BODY, marginBottom: 3, textAlign: "right" }}>
                {playerName(e.playerId)} <span>{e.minute}'</span> <CardEventIcon type={e.type} />
              </div>
            ))}
          </div>
          <div>
            {scorersFor(fixture.awayTeamId).map((e) => (
              <div key={e.id} style={{ fontSize: 12.5, color: C.textMuted, fontFamily: FONT_BODY, marginBottom: 3 }}>
                <Target size={11} style={{ verticalAlign: -1, marginRight: 2 }} /> {playerName(e.playerId)} <span style={{ color: C.textFaint }}>{e.minute}'</span>
              </div>
            ))}
            {cardsFor(fixture.awayTeamId).map((e) => (
              <div key={e.id} style={{ fontSize: 12.5, color: C.textFaint, fontFamily: FONT_BODY, marginBottom: 3 }}>
                <CardEventIcon type={e.type} /> {playerName(e.playerId)} <span>{e.minute}'</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
