export function computeStandings(fixtures, teams, year) {
  const table = {};
  teams.forEach((t) => {
    table[t.id] = {
      team: t, played: 0, won: 0, drawn: 0, lost: 0,
      gf: 0, ga: 0, participated: false, matchPts: 0,
    };
  });
  fixtures
    .filter((f) => f.year === year)
    .forEach((f) => {
      if (f.homeTeamId in table) table[f.homeTeamId].participated = true;
      if (f.awayTeamId in table) table[f.awayTeamId].participated = true;
      if (f.status !== "completed") return;
      const h = table[f.homeTeamId], a = table[f.awayTeamId];
      if (!h || !a) return;
      h.played++; a.played++;
      h.gf += f.homeScore; h.ga += f.awayScore;
      a.gf += f.awayScore; a.ga += f.homeScore;
      if (f.homeScore > f.awayScore) { h.won++; a.lost++; h.matchPts += 3; }
      else if (f.homeScore < f.awayScore) { a.won++; h.lost++; a.matchPts += 3; }
      else { h.drawn++; a.drawn++; h.matchPts += 1; a.matchPts += 1; }
    });
  return Object.values(table)
    .filter((r) => r.participated)
    .map((r) => ({ ...r, participationPts: 5, gd: r.gf - r.ga, total: r.matchPts + 5 }))
    .sort((a, b) => b.total - a.total || b.gd - a.gd || b.gf - a.gf);
}

export function computeScorers(fixtures, players, teams, year) {
  const stats = {};
  players.forEach((p) => {
    stats[p.id] = { player: p, goals: 0, yellow: 0, red: 0 };
  });
  fixtures
    .filter((f) => f.year === year && f.status === "completed")
    .forEach((f) => {
      f.events.forEach((e) => {
        if (!stats[e.playerId]) return;
        if (e.type === "goal") stats[e.playerId].goals++;
        if (e.type === "yellow") stats[e.playerId].yellow++;
        if (e.type === "red") stats[e.playerId].red++;
      });
    });
  return Object.values(stats)
    .filter((s) => s.goals > 0)
    .map((s) => ({ ...s, team: teams.find((t) => t.id === s.player.teamId) }))
    .sort((a, b) => b.goals - a.goals);
}
