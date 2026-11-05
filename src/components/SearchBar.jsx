import { useState } from "react";
import { Button, MenuItem, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import GuestPicker from "./GuestPicker";
import { useData } from "../context/DataContext";
import { destinations } from "../data/sampleData";

// Controlled by the parent through `value` and `onSearch`.
// Fields: destination, category, dates, guests (adults, kids, pets), max price.
export default function SearchBar({ value, onSearch, compact = false }) {
  const { settings } = useData();
  const [f, setF] = useState(value);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  return (
    <form
      onSubmit={(e) => { e.preventDefault(); onSearch(f); }}
      className="search-bar"
      style={{ padding: compact ? 16 : 20 }}
    >
      <div className="row g-3 align-items-end">
        <div className="col-12 col-md-6 col-lg">
          <TextField select fullWidth size="small" label="Destination" value={f.destination} onChange={set("destination")}>
            <MenuItem value="">Anywhere</MenuItem>
            {destinations.map((d) => <MenuItem key={d.name} value={d.name}>{d.name}</MenuItem>)}
          </TextField>
        </div>
        <div className="col-12 col-md-6 col-lg">
          <TextField select fullWidth size="small" label="Category" value={f.type} onChange={set("type")}>
            <MenuItem value="">Any category</MenuItem>
            {settings.propertyTypes.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
          </TextField>
        </div>
        <div className="col-6 col-lg">
          <TextField fullWidth size="small" type="date" label="Check-in" value={f.checkIn} onChange={set("checkIn")} slotProps={{ inputLabel: { shrink: true } }} />
        </div>
        <div className="col-6 col-lg">
          <TextField fullWidth size="small" type="date" label="Check-out" value={f.checkOut} onChange={set("checkOut")} slotProps={{ inputLabel: { shrink: true } }} />
        </div>
        <div className="col-6 col-md-3 col-lg">
          <GuestPicker value={{ adults: f.adults, kids: f.kids, pets: f.pets }} onChange={(g) => setF({ ...f, ...g })} />
        </div>
        <div className="col-6 col-md-3 col-lg-2">
          <TextField fullWidth size="small" type="number" label="Max price (₱)" value={f.maxPrice} onChange={set("maxPrice")} slotProps={{ htmlInput: { min: 0 } }} />
        </div>
        <div className="col-12 col-lg-auto">
          <Button type="submit" variant="contained" fullWidth startIcon={<SearchIcon />}>Search</Button>
        </div>
      </div>
    </form>
  );
}
