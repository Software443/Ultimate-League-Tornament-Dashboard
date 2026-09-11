import React, { useState } from "react";
import { C } from "../theme";
import { SectionHeading, EmptyState } from "../components/atoms";
import { FixtureCard } from "../components/FixtureCard";
import { useLeagueData } from "../context/DataContext";

export default function FixturesPage({ year }) {
  const { fixtures, teams, players } = useLeagueData();
  const [statusFilter, setStatusFilter] = useState("all");

  const list = fixtures
    .filter((f) => f.year === year)
    .filter((f) => statusFilter === "all" || f.status === statusFilter)
    .sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div>
      <SectionHeading
        eyebrow={`Season ${year}`}
        title="Fixtures & results"
        action={
          <div style={{ display: "flex", gap: 6 }}>
            {["all", "completed", "scheduled"].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                style={{
                  fontSize: 12.5, padding: "6px 12px", borderRadius: 6,
                  border: `1px solid ${statusFilter === s ? C.accent : C.border}`,
                  background: statusFilter === s ? C.accentSoft : "transparent",
                  color: statusFilter === s ? "#F0879A" : C.textMuted, cursor: "pointer", textTransform: "capitalize",
                }}
              >
                {s}
              </button>
            ))}
          </div>
        }
      />
      {list.length === 0 ? (
        <EmptyState text={`No fixtures recorded for ${year} yet.`} />
      ) : (
        <div style={{ display: "grid", gap: 14 }}>
          {list.map((f) => <FixtureCard key={f.id} fixture={f} teams={teams} players={players} />)}
        </div>
      )}
    </div>
  );
}
