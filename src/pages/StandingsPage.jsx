import React, { useMemo } from "react";
import { C, FONT_MONO } from "../theme";
import { SectionHeading } from "../components/atoms";
import { useLeagueData } from "../context/DataContext";
import { computeStandings } from "../lib/compute";

const cellC = { padding: "11px 14px", textAlign: "center", fontFamily: FONT_MONO, color: C.textMuted };

export default function StandingsPage({ year }) {
  const { fixtures, teams } = useLeagueData();
  const standings = useMemo(() => computeStandings(fixtures, teams, year), [fixtures, teams, year]);

  return (
    <div>
      <SectionHeading eyebrow={`Season ${year}`} title="Tournament ranking" />
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, overflow: "hidden", marginBottom: 16 }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5 }}>
            <thead>
              <tr style={{ background: C.surfaceAlt, textAlign: "left" }}>
                {["#", "Team", "P", "W", "D", "L", "GF", "GA", "GD", "Participation", "Match pts", "Total"].map((h, i) => (
                  <th key={h} style={{ padding: "12px 14px", color: C.textFaint, fontFamily: FONT_MONO, fontWeight: 400, fontSize: 11, letterSpacing: 0.5, textTransform: "uppercase", textAlign: i > 1 ? "center" : "left" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {standings.map((r, i) => (
                <tr key={r.team.id} style={{ borderTop: `1px solid ${C.borderSoft}` }}>
                  <td style={{ padding: "11px 14px", fontFamily: FONT_MONO, color: i < 3 ? C.gold : C.textFaint }}>{i + 1}</td>
                  <td style={{ padding: "11px 14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ width: 8, height: 8, borderRadius: 2, background: r.team.color, display: "inline-block" }} />
                      <span style={{ fontWeight: 500 }}>{r.team.name}</span>
                    </div>
                  </td>
                  <td style={cellC}>{r.played}</td>
                  <td style={cellC}>{r.won}</td>
                  <td style={cellC}>{r.drawn}</td>
                  <td style={cellC}>{r.lost}</td>
                  <td style={cellC}>{r.gf}</td>
                  <td style={cellC}>{r.ga}</td>
                  <td style={cellC}>{r.gd > 0 ? `+${r.gd}` : r.gd}</td>
                  <td style={{ ...cellC, color: C.textFaint }}>+{r.participationPts}</td>
                  <td style={{ ...cellC, color: C.textFaint }}>{r.matchPts}</td>
                  <td style={{ ...cellC, fontFamily: FONT_MONO, fontWeight: 600, color: C.text }}>{r.total}</td>
                </tr>
              ))}
              {standings.length === 0 && (
                <tr><td colSpan={12} style={{ padding: 24, textAlign: "center", color: C.textFaint }}>No teams have played in {year} yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <p style={{ fontSize: 12.5, color: C.textFaint, lineHeight: 1.6, maxWidth: 640 }}>
        Ranking rule: every team that takes part in the {year} season earns a flat 5-point participation bonus, on top of the standard 3 points per win and 1 point per draw from completed fixtures. Teams are ranked by total points, then goal difference, then goals scored.
      </p>
    </div>
  );
}
