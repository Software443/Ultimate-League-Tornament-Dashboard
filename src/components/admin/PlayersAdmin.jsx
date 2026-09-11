import React, { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { C } from "../../theme";
import { TeamTag } from "../atoms";
import { AdminPanel, FieldLabel, inputStyle, PrimaryButton, IconButton } from "../adminAtoms";
import { useLeagueData } from "../../context/DataContext";

export function PlayersAdmin() {
  const { teams, players, addPlayer, removePlayer } = useLeagueData();
  const [name, setName] = useState("");
  const [teamId, setTeamId] = useState(teams[0]?.id || "");
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState("");

  const submit = async () => {
    if (!name.trim() || !teamId) return;
    setBusy(true);
    setFormError("");
    const res = await addPlayer({ name: name.trim(), teamId });
    setBusy(false);
    if (res.ok) setName(""); else setFormError(res.error);
  };

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <AdminPanel>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr auto", gap: 12, alignItems: "end" }}>
          <div><FieldLabel>Player name</FieldLabel><input style={inputStyle} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Ahmed Suleiman" /></div>
          <div>
            <FieldLabel>Team</FieldLabel>
            <select style={inputStyle} value={teamId} onChange={(e) => setTeamId(e.target.value)}>
              {teams.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <PrimaryButton onClick={submit} disabled={busy}><Plus size={15} /> {busy ? "Adding…" : "Add player"}</PrimaryButton>
        </div>
        {formError && <div style={{ color: "#F0879A", fontSize: 12.5, marginTop: 10 }}>{formError}</div>}
      </AdminPanel>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 8 }}>
        {players.map((p) => {
          const t = teams.find((tm) => tm.id === p.teamId);
          return (
            <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 10, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 12px" }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13.5, fontWeight: 500 }}>{p.name}</div>
                <TeamTag team={t} />
              </div>
              <IconButton danger onClick={() => removePlayer(p.id)}><Trash2 size={13} /></IconButton>
            </div>
          );
        })}
      </div>
    </div>
  );
}
