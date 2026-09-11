import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { supabase } from "../lib/supabaseClient";

const DataContext = createContext(null);

// Supabase/Postgres columns are snake_case; the rest of the app (compute.js,
// FixtureCard, admin panels) expects the same camelCase shape the old
// Express API returned. Map at the boundary so nothing else has to change.
const mapTeam = (t) => ({ id: t.id, name: t.name, short: t.short, color: t.color });
const mapPlayer = (p) => ({ id: p.id, name: p.name, teamId: p.team_id });
const mapEvent = (e) => ({ id: e.id, playerId: e.player_id, type: e.type, minute: e.minute });
const mapFixture = (f) => ({
  id: f.id,
  year: f.year,
  round: f.round,
  date: f.date,
  venue: f.venue,
  homeTeamId: f.home_team_id,
  awayTeamId: f.away_team_id,
  status: f.status,
  homeScore: f.home_score,
  awayScore: f.away_score,
  events: (f.events || []).map(mapEvent),
});

export function DataProvider({ children }) {
  const [teams, setTeams] = useState([]);
  const [players, setPlayers] = useState([]);
  const [fixtures, setFixtures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const refreshAll = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      const [teamsRes, playersRes, fixturesRes] = await Promise.all([
        supabase.from("teams").select("*").order("name"),
        supabase.from("players").select("*").order("name"),
        supabase.from("fixtures").select("*, events(*)").order("date"),
      ]);
      if (teamsRes.error) throw teamsRes.error;
      if (playersRes.error) throw playersRes.error;
      if (fixturesRes.error) throw fixturesRes.error;

      setTeams(teamsRes.data.map(mapTeam));
      setPlayers(playersRes.data.map(mapPlayer));
      setFixtures(fixturesRes.data.map(mapFixture));
    } catch (err) {
      setLoadError(err.message || "Could not reach Supabase. Check your VITE_SUPABASE_URL / anon key.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  // Runs a mutation, then refreshes local state from the DB.
  // RLS on the Supabase side is what actually blocks unauthenticated writes;
  // this just surfaces whatever error Postgres/Supabase returns.
  const guarded = useCallback(
    async (fn) => {
      try {
        await fn();
        await refreshAll();
        return { ok: true };
      } catch (err) {
        return { ok: false, error: err.message || "Something went wrong." };
      }
    },
    [refreshAll]
  );

  const value = {
    teams,
    players,
    fixtures,
    loading,
    loadError,
    refreshAll,

    addTeam: (data) =>
      guarded(async () => {
        const { error } = await supabase
          .from("teams")
          .insert({ name: data.name, short: data.short, color: data.color });
        if (error) throw error;
      }),
    removeTeam: (id) =>
      guarded(async () => {
        const { error } = await supabase.from("teams").delete().eq("id", id);
        if (error) throw error;
      }),

    addPlayer: (data) =>
      guarded(async () => {
        const { error } = await supabase
          .from("players")
          .insert({ name: data.name, team_id: data.teamId });
        if (error) throw error;
      }),
    removePlayer: (id) =>
      guarded(async () => {
        const { error } = await supabase.from("players").delete().eq("id", id);
        if (error) throw error;
      }),

    addFixture: (data) =>
      guarded(async () => {
        const { error } = await supabase.from("fixtures").insert({
          year: data.year,
          round: data.round,
          date: data.date,
          venue: data.venue,
          home_team_id: data.homeTeamId,
          away_team_id: data.awayTeamId,
        });
        if (error) throw error;
      }),
    removeFixture: (id) =>
      guarded(async () => {
        const { error } = await supabase.from("fixtures").delete().eq("id", id);
        if (error) throw error;
      }),

    saveResult: (id, data) =>
      guarded(async () => {
        const { error } = await supabase
          .from("fixtures")
          .update({ home_score: data.homeScore, away_score: data.awayScore, status: "completed" })
          .eq("id", id);
        if (error) throw error;
      }),

    addEvent: (fixtureId, data) =>
      guarded(async () => {
        const { error } = await supabase.from("events").insert({
          fixture_id: fixtureId,
          player_id: data.playerId,
          type: data.type,
          minute: data.minute,
        });
        if (error) throw error;
      }),
    removeEvent: (fixtureId, eventId) =>
      guarded(async () => {
        const { error } = await supabase.from("events").delete().eq("id", eventId);
        if (error) throw error;
      }),
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useLeagueData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useLeagueData must be used within DataProvider");
  return ctx;
}
