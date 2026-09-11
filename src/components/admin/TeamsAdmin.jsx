import React, { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { C } from "../../theme";
import { Pill } from "../atoms";
import { AdminPanel, FieldLabel, inputStyle, PrimaryButton, IconButton } from "../adminAtoms";
import { useLeagueData } from "../../context/DataContext";

export function TeamsAdmin() {
  const { teams, addTeam, removeTeam } = useLeagueData();
  const [name, setName] = useState("");
  const [short, setShort] = useState("");
  const [color, setColor] = useState("#C6183B");
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState("");

  const submit = async () => {
    if (!name.trim() || !short.trim()) return;
    setBusy(true);
    setFormError("");
    const res = await addTeam({ name: name.trim(), short: short.trim(), color });
    setBusy(false);
    if (res.ok) { setName(""); setShort(""); } else setFormError(res.error);
  };

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <AdminPanel>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr auto", gap: 12, alignItems: "end" }}>
          <div><FieldLabel>Team name</FieldLabel><input style={inputStyle} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Jos Panthers" /></div>
          <div><FieldLabel>Short code</FieldLabel><input style={inputStyle} value={short} onChange={(e) => setShort(e.target.value)} placeholder="JOS" maxLength={4} /></div>
          <div><FieldLabel>Color</FieldLabel><input type="color" value={color} onChange={(e) => setColor(e.target.value)} style={{ ...inputStyle, padding: 2, height: 34 }} /></div>
          <PrimaryButton onClick={submit} disabled={busy}><Plus size={15} /> {busy ? "Adding…" : "Add team"}</PrimaryButton>
        </div>
        {formError && <div style={{ color: "#F0879A", fontSize: 12.5, marginTop: 10 }}>{formError}</div>}
      </AdminPanel>
      <div style={{ display: "grid", gap: 8 }}>
        {teams.map((t) => (
          <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 12, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 14px" }}>
            <span style={{ width: 10, height: 10, borderRadius: 3, background: t.color }} />
            <span style={{ fontWeight: 500, flex: 1 }}>{t.name}</span>
            <Pill>{t.short}</Pill>
            <IconButton danger onClick={() => removeTeam(t.id)}><Trash2 size={14} /></IconButton>
          </div>
        ))}
      </div>
    </div>
  );
}
