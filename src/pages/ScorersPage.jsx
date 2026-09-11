import React, { useMemo } from "react";
import { Target } from "lucide-react";
import { C, FONT_MONO } from "../theme";
import { SectionHeading, EmptyState, TeamTag, CardEventIcon } from "../components/atoms";
import { useLeagueData } from "../context/DataContext";
import { computeScorers } from "../lib/compute";

export default function ScorersPage({ year }) {
  const { fixtures, players, teams } = useLeagueData();
  const scorers = useMemo(() => computeScorers(fixtures, players, teams, year), [fixtures, players, teams, year]);

  return (
    <div>
      <SectionHeading eyebrow={`Season ${year}`} title="Top scorers" />
      {scorers.length === 0 ? (
        <EmptyState text={`No goals recorded for ${year} yet.`} />
      ) : (
        <div style={{ display: "grid", gap: 10 }}>
          {scorers.map((s, i) => (
            <div key={s.player.id} style={{ display: "flex", alignItems: "center", gap: 16, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 18px" }}>
              <div style={{ fontFamily: FONT_MONO, fontSize: 16, width: 24, color: i === 0 ? C.gold : C.textFaint }}>{i + 1}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 500, fontSize: 14.5 }}>{s.player.name}</div>
                <TeamTag team={s.team} />
              </div>
              <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                {s.yellow > 0 && <span style={{ fontSize: 12, color: C.textFaint, fontFamily: FONT_MONO, display: "flex", alignItems: "center" }}><CardEventIcon type="yellow" />{s.yellow}</span>}
                {s.red > 0 && <span style={{ fontSize: 12, color: C.textFaint, fontFamily: FONT_MONO, display: "flex", alignItems: "center", marginLeft: 6 }}><CardEventIcon type="red" />{s.red}</span>}
              </div>
              <div style={{ fontFamily: FONT_MONO, fontSize: 22, fontWeight: 600, color: C.text, minWidth: 50, textAlign: "right" }}>
                {s.goals} <Target size={14} style={{ verticalAlign: 2, marginLeft: 2, color: C.accent }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
