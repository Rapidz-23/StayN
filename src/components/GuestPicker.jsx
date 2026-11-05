import { useState } from "react";
import { Button, IconButton, Popover, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import PersonIcon from "@mui/icons-material/Person";
import { guestLabel } from "../utils/guests";


export default function GuestPicker({ value, onChange, minAdults = 0, maxGuests = 16, maxPets = 5 }) {
  const [anchor, setAnchor] = useState(null);
  const { adults = 0, kids = 0, pets = 0 } = value;
  const full = adults + kids >= maxGuests;

  const rows = [
    { key: "adults", title: "Adults", hint: "Age 13 and up", min: minAdults, plusOff: full },
    { key: "kids", title: "Kids", hint: "Age 12 and under", min: 0, plusOff: full },
    { key: "pets", title: "Pets", hint: maxPets === 0 ? "Not allowed here" : `Up to ${maxPets}`, min: 0, plusOff: pets >= maxPets },
  ];
  const set = (key, n) => onChange({ adults, kids, pets, [key]: n });

  return (
    <>
      <Button
        fullWidth
        variant="outlined"
        color="inherit"
        startIcon={<PersonIcon />}
        onClick={(e) => setAnchor(e.currentTarget)}
        aria-label="Choose guests"
        sx={{ height: 40, justifyContent: "flex-start", textTransform: "none", fontWeight: 400, color: "text.primary", borderColor: "rgba(0,0,0,0.23)" }}
      >
        {guestLabel(value)}
      </Button>
      <Popover open={Boolean(anchor)} anchorEl={anchor} onClose={() => setAnchor(null)} anchorOrigin={{ vertical: "bottom", horizontal: "left" }}>
        <div style={{ padding: 16, width: 280 }}>
          {rows.map((r, i) => {
            const n = value[r.key] || 0;
            return (
              <div key={r.key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderTop: i ? "1px solid var(--border)" : 0 }}>
                <div>
                  <div style={{ fontWeight: 500 }}>{r.title}</div>
                  <div style={{ color: "var(--muted)", fontSize: 13 }}>{r.hint}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <IconButton size="small" aria-label={`Fewer ${r.title.toLowerCase()}`} disabled={n <= r.min} onClick={() => set(r.key, n - 1)} sx={{ border: "1px solid var(--border)" }}><RemoveIcon fontSize="small" /></IconButton>
                  <Typography sx={{ width: 20, textAlign: "center" }}>{n}</Typography>
                  <IconButton size="small" aria-label={`More ${r.title.toLowerCase()}`} disabled={r.plusOff} onClick={() => set(r.key, n + 1)} sx={{ border: "1px solid var(--border)" }}><AddIcon fontSize="small" /></IconButton>
                </div>
              </div>
            );
          })}
          <Button fullWidth variant="contained" sx={{ mt: 1 }} onClick={() => setAnchor(null)}>Done</Button>
        </div>
      </Popover>
    </>
  );
}
